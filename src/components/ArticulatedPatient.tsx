import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { FullBodyPose } from "../core/radiographic-positions";
import meshUrl from "../../assets/patient/makehuman/base.obj.gz?url";
import skeletonUrl from "../../assets/patient/makehuman/default.mhskel.gz?url";
import weightsUrl from "../../assets/patient/makehuman/default_weights.mhw.gz?url";

type Rig = {
  bones: Record<string, { head: string; parent: string | null }>;
  joints: Record<string, number[]>;
};
type Weights = { weights: Record<string, [number, number][]> };
export type PatientScreenRegistration = { headY:number; pelvisY:number; leftShoulderX:number; rightShoulderX:number };
type PatientModel = {
  positions: Float32Array;
  indices: Uint32Array;
  jointIndices: Uint16Array;
  jointWeights: Float32Array;
  bones: Record<string, THREE.Bone>;
  skeleton: THREE.Skeleton;
  patient: THREE.Group;
};

async function compressedText(url: string) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Patient asset unavailable (${response.status})`);
  if (typeof DecompressionStream === "undefined")
    throw new Error("This browser cannot decompress the articulated patient");
  return new Response(
    response.body!.pipeThrough(new DecompressionStream("gzip")),
  ).text();
}

function meshData(text: string) {
  const positions: number[] = [],
    indices: number[] = [];
  let group = "";
  for (const line of text.split("\n")) {
    if (line.startsWith("g ")) {
      group = line.slice(2).trim();
    } else if (line.startsWith("v ")) {
      const [, x, y, z] = line.trim().split(/\s+/);
      positions.push(+x, +y, +z);
    } else if (line.startsWith("f ") && group === "body") {
      const face = line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((value) => Number(value.split("/")[0]) - 1);
      for (let i = 1; i < face.length - 1; i++)
        indices.push(face[0], face[i], face[i + 1]);
    }
  }
  return {
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
  };
}

const radians = (degrees = 0) => THREE.MathUtils.degToRad(degrees);

function applyPose(model: PatientModel, pose: FullBodyPose, rotation: number) {
  model.patient.rotation.set(
    radians(pose.bodyPitch),
    radians(rotation),
    radians(pose.bodyRoll),
  );
  const set = (name: string, x = 0, y = 0, z = 0) =>
    model.bones[name]?.rotation.set(radians(x), radians(y), radians(z));
  set("head", pose.headExtension, pose.headRotation);
  set(
    "upperarm01.L",
    pose.leftShoulder.flexion,
    pose.leftShoulder.rotation,
    pose.leftShoulder.abduction,
  );
  set(
    "upperarm01.R",
    pose.rightShoulder.flexion,
    pose.rightShoulder.rotation,
    -(pose.rightShoulder.abduction ?? 0),
  );
  set("lowerarm01.L", pose.leftElbow.flexion, pose.leftElbow.rotation);
  set("lowerarm01.R", pose.rightElbow.flexion, pose.rightElbow.rotation);
  set(
    "upperleg01.L",
    pose.leftHip.flexion,
    pose.leftHip.rotation,
    pose.leftHip.abduction,
  );
  set(
    "upperleg01.R",
    pose.rightHip.flexion,
    pose.rightHip.rotation,
    -(pose.rightHip.abduction ?? 0),
  );
  set("lowerleg01.L", pose.leftKnee.flexion);
  set("lowerleg01.R", pose.rightKnee.flexion);
  model.patient.updateMatrixWorld(true);
  model.skeleton.update();
}

function drawPatient(canvas: HTMLCanvasElement, model: PatientModel, onRegistration?: (v:PatientScreenRegistration)=>void) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D rendering is unavailable");
  const ratio = Math.min(window.devicePixelRatio || 1, 2),
    width = Math.max(1, Math.round(canvas.clientWidth * ratio)),
    height = Math.max(1, Math.round(canvas.clientHeight * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  context.clearRect(0, 0, width, height);
  if (!model.skeleton.boneMatrices)
    throw new Error("Patient rig matrices are unavailable");
  const boneMatrices = model.skeleton.boneMatrices,
    vertexCount = model.positions.length / 3,
    transformed = new Float32Array(model.positions.length),
    source = new THREE.Vector3(),
    result = new THREE.Vector3(),
    weighted = new THREE.Vector3(),
    matrix = new THREE.Matrix4();
  for (let vertex = 0; vertex < vertexCount; vertex++) {
    source.fromArray(model.positions, vertex * 3);
    result.set(0, 0, 0);
    let appliedWeight = 0;
    for (let influence = 0; influence < 4; influence++) {
      const offset = vertex * 4 + influence,
        weight = model.jointWeights[offset];
      if (!weight) continue;
      matrix.fromArray(boneMatrices, model.jointIndices[offset] * 16);
      weighted.copy(source).applyMatrix4(matrix).multiplyScalar(weight);
      result.add(weighted);
      appliedWeight += weight;
    }
    if (!appliedWeight)
      result.copy(source).applyMatrix4(model.patient.matrixWorld);
    transformed.set([result.x, result.y, result.z], vertex * 3);
  }
  const triangles: { a: number; b: number; c: number; depth: number }[] = [];
  for (let i = 0; i < model.indices.length; i += 3) {
    const a = model.indices[i],
      b = model.indices[i + 1],
      c = model.indices[i + 2];
    triangles.push({
      a,
      b,
      c,
      depth:
        (transformed[a * 3 + 2] +
          transformed[b * 3 + 2] +
          transformed[c * 3 + 2]) /
        3,
    });
  }
  triangles.sort((left, right) => left.depth - right.depth);
  const scale = Math.min(width / 12, height / 20),
    centreX = width / 2,
    centreY = height * 0.51,
    projectBone=(name:string)=>{const p=new THREE.Vector3();model.bones[name]?.getWorldPosition(p);return{x:(centreX+p.x*scale)/width,y:(centreY-p.y*scale)/height}},
    head=projectBone("head"),hipL=projectBone("upperleg01.L"),hipR=projectBone("upperleg01.R"),shoulderL=projectBone("upperarm01.L"),shoulderR=projectBone("upperarm01.R"),
    light = new THREE.Vector3(-0.35, 0.25, 1).normalize(),
    ab = new THREE.Vector3(),
    ac = new THREE.Vector3(),
    normal = new THREE.Vector3();
  for (const triangle of triangles) {
    const ax = transformed[triangle.a * 3],
      ay = transformed[triangle.a * 3 + 1],
      az = transformed[triangle.a * 3 + 2],
      bx = transformed[triangle.b * 3],
      by = transformed[triangle.b * 3 + 1],
      bz = transformed[triangle.b * 3 + 2],
      cx = transformed[triangle.c * 3],
      cy = transformed[triangle.c * 3 + 1],
      cz = transformed[triangle.c * 3 + 2];
    ab.set(bx - ax, by - ay, bz - az);
    ac.set(cx - ax, cy - ay, cz - az);
    normal.crossVectors(ab, ac).normalize();
    const illumination = Math.max(0, Math.abs(normal.dot(light))),
      value = Math.round(42 + illumination * 35);
    context.fillStyle = `hsl(20 31% ${value}%)`;
    context.beginPath();
    context.moveTo(centreX + ax * scale, centreY - ay * scale);
    context.lineTo(centreX + bx * scale, centreY - by * scale);
    context.lineTo(centreX + cx * scale, centreY - cy * scale);
    context.closePath();
    context.fill();
  }
  onRegistration?.({headY:head.y,pelvisY:(hipL.y+hipR.y)/2,leftShoulderX:shoulderL.x,rightShoulderX:shoulderR.x});
}

function buildPatient(obj: string, rigText: string, weightsText: string) {
  const data = meshData(obj),
    rig = JSON.parse(rigText) as Rig,
    skin = JSON.parse(weightsText) as Weights,
    names = Object.keys(rig.bones),
    jointLookup = new Map(names.map((name, index) => [name, index])),
    perVertex: Array<[number, number][]> = Array.from(
      { length: data.positions.length / 3 },
      () => [],
    );
  for (const [name, entries] of Object.entries(skin.weights)) {
    const joint = jointLookup.get(name);
    if (joint === undefined) continue;
    for (const [vertex, weight] of entries)
      perVertex[vertex]?.push([joint, weight]);
  }
  const jointIndices = new Uint16Array(perVertex.length * 4),
    jointWeights = new Float32Array(perVertex.length * 4);
  perVertex.forEach((influences, vertex) => {
    const top = influences.sort((a, b) => b[1] - a[1]).slice(0, 4),
      total = top.reduce((sum, item) => sum + item[1], 0) || 1;
    top.forEach(([joint, weight], influence) => {
      jointIndices[vertex * 4 + influence] = joint;
      jointWeights[vertex * 4 + influence] = weight / total;
    });
  });
  const jointPosition = (joint: string) => {
      const vertices = rig.joints[joint] ?? [],
        point = new THREE.Vector3();
      for (const vertex of vertices)
        point.add(new THREE.Vector3().fromArray(data.positions, vertex * 3));
      return vertices.length
        ? point.multiplyScalar(1 / vertices.length)
        : point;
    },
    heads: Record<string, THREE.Vector3> = {},
    bones: Record<string, THREE.Bone> = {};
  for (const name of names) {
    heads[name] = jointPosition(rig.bones[name].head);
    bones[name] = new THREE.Bone();
    bones[name].name = name;
  }
  const patient = new THREE.Group();
  for (const name of names) {
    const parent = rig.bones[name].parent,
      bone = bones[name];
    bone.position.copy(
      parent ? heads[name].clone().sub(heads[parent]) : heads[name],
    );
    if (parent) bones[parent].add(bone);
    else patient.add(bone);
  }
  patient.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(names.map((name) => bones[name]));
  skeleton.calculateInverses();
  return { ...data, jointIndices, jointWeights, bones, skeleton, patient };
}

export function ArticulatedPatient({
  pose,
  rotation,
  onRegistration,
}: {
  pose: FullBodyPose;
  rotation: number;
  onRegistration?: (v:PatientScreenRegistration)=>void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    model = useRef<PatientModel | null>(null),
    current = useRef({ pose, rotation });
  current.current = { pose, rotation };
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let disposed = false;
    const resize = new ResizeObserver(() => {
      if (model.current) drawPatient(element, model.current,onRegistration);
    });
    resize.observe(element);
    Promise.all([
      compressedText(meshUrl),
      compressedText(skeletonUrl),
      compressedText(weightsUrl),
    ])
      .then(([obj, rigText, weightsText]) => {
        if (disposed) return;
        model.current = buildPatient(obj, rigText, weightsText);
        applyPose(
          model.current,
          current.current.pose,
          current.current.rotation,
        );
        drawPatient(element, model.current,onRegistration);
      })
      .catch((error) => {
        element.dataset.error = String(error);
      });
    return () => {
      disposed = true;
      resize.disconnect();
      model.current = null;
    };
  }, []);
  useEffect(() => {
    if (!canvas.current || !model.current) return;
    applyPose(model.current, pose, rotation);
    drawPatient(canvas.current, model.current,onRegistration);
  }, [pose, rotation,onRegistration]);
  return (
    <canvas
      ref={canvas}
      className="articulated-patient-canvas"
      aria-label="Articulated anatomical patient"
    />
  );
}
