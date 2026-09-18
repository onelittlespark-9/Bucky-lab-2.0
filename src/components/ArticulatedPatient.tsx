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
  for (const line of text.split("\n")) {
    if (line.startsWith("v ")) {
      const [, x, y, z] = line.trim().split(/\s+/);
      positions.push(+x, +y, +z);
    } else if (line.startsWith("f ")) {
      const face = line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((value) => Number(value.split("/")[0]) - 1);
      for (let i = 1; i < face.length - 1; i++)
        indices.push(face[0], face[i], face[i + 1]);
    }
  }
  return { positions, indices };
}
const radians = (degrees = 0) => THREE.MathUtils.degToRad(degrees);
export function ArticulatedPatient({
  pose,
  rotation,
}: {
  pose: FullBodyPose;
  rotation: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    bones = useRef<Record<string, THREE.Bone>>({}),
    root = useRef<THREE.Group | null>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let disposed = false,
      renderer: THREE.WebGLRenderer | null = null,
      frame = 0;
    Promise.all([
      compressedText(meshUrl),
      compressedText(skeletonUrl),
      compressedText(weightsUrl),
    ])
      .then(([obj, rigText, weightsText]) => {
        if (disposed) return;
        const data = meshData(obj),
          rig = JSON.parse(rigText) as Rig,
          skin = JSON.parse(weightsText) as Weights,
          geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(data.positions, 3),
        );
        geometry.setIndex(data.indices);
        geometry.computeVertexNormals();
        const names = Object.keys(rig.bones),
          index = new Map(names.map((name, i) => [name, i])),
          perVertex: Array<[number, number][]> = Array.from(
            { length: data.positions.length / 3 },
            () => [],
          );
        for (const [name, entries] of Object.entries(skin.weights)) {
          const joint = index.get(name);
          if (joint === undefined) continue;
          for (const [vertex, weight] of entries)
            perVertex[vertex]?.push([joint, weight]);
        }
        const jointData: number[] = [],
          weightData: number[] = [];
        for (const influences of perVertex) {
          const top = influences.sort((a, b) => b[1] - a[1]).slice(0, 4),
            total = top.reduce((sum, item) => sum + item[1], 0) || 1;
          for (let i = 0; i < 4; i++) {
            jointData.push(top[i]?.[0] ?? 0);
            weightData.push((top[i]?.[1] ?? 0) / total);
          }
        }
        geometry.setAttribute(
          "skinIndex",
          new THREE.Uint16BufferAttribute(jointData, 4),
        );
        geometry.setAttribute(
          "skinWeight",
          new THREE.Float32BufferAttribute(weightData, 4),
        );
        const position = geometry.getAttribute("position"),
          jointPosition = (joint: string) => {
            const vertices = rig.joints[joint] ?? [];
            const point = new THREE.Vector3();
            for (const vertex of vertices)
              point.add(
                new THREE.Vector3(
                  position.getX(vertex),
                  position.getY(vertex),
                  position.getZ(vertex),
                ),
              );
            return vertices.length
              ? point.multiplyScalar(1 / vertices.length)
              : point;
          },
          heads: Record<string, THREE.Vector3> = {};
        for (const name of names)
          heads[name] = jointPosition(rig.bones[name].head);
        const boneMap: Record<string, THREE.Bone> = {};
        for (const name of names) {
          const bone = new THREE.Bone();
          bone.name = name;
          boneMap[name] = bone;
        }
        for (const name of names) {
          const parent = rig.bones[name].parent,
            bone = boneMap[name],
            head = heads[name];
          bone.position.copy(parent ? head.clone().sub(heads[parent]) : head);
          if (parent) boneMap[parent].add(bone);
        }
        const mesh = new THREE.SkinnedMesh(
          geometry,
          new THREE.MeshStandardMaterial({
            color: 0xc9997d,
            roughness: 0.82,
            metalness: 0,
            side: THREE.DoubleSide,
          }),
        );
        for (const name of names)
          if (!rig.bones[name].parent) mesh.add(boneMap[name]);
        mesh.bind(new THREE.Skeleton(names.map((name) => boneMap[name])));
        const scene = new THREE.Scene(),
          patient = new THREE.Group();
        patient.add(mesh);
        scene.add(patient);
        scene.add(new THREE.HemisphereLight(0xe8f4ff, 0x26313b, 2.2));
        const key = new THREE.DirectionalLight(0xffffff, 2.8);
        key.position.set(-6, 10, 12);
        scene.add(key);
        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
        camera.position.set(0, 0, 28);
        camera.lookAt(0, 0, 0);
        renderer = new THREE.WebGLRenderer({
          canvas: element,
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        bones.current = boneMap;
        root.current = patient;
        const render = () => {
          if (disposed || !renderer) return;
          const w = element.clientWidth,
            h = element.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / Math.max(1, h);
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
          frame = requestAnimationFrame(render);
        };
        render();
      })
      .catch((error) => {
        element.dataset.error = String(error);
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      renderer?.dispose();
    };
  }, []);
  useEffect(() => {
    const rig = bones.current,
      patient = root.current;
    if (!patient) return;
    patient.rotation.set(
      radians(pose.bodyPitch),
      radians(rotation),
      radians(pose.bodyRoll),
    );
    const set = (name: string, x = 0, y = 0, z = 0) =>
      rig[name]?.rotation.set(radians(x), radians(y), radians(z));
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
  }, [pose, rotation]);
  return (
    <canvas
      ref={canvas}
      className="articulated-patient-canvas"
      aria-label="Articulated anatomical patient"
    />
  );
}
