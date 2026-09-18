import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
const root = new URL("../assets/patient/makehuman/", import.meta.url),
  readGzip = async (name) =>
    gunzipSync(await readFile(new URL(name, root))).toString("utf8"),
  [meshText, skeletonText, weightsText, licence] = await Promise.all([
    readGzip("base.obj.gz"),
    readGzip("default.mhskel.gz"),
    readGzip("default_weights.mhw.gz"),
    readFile(new URL("LICENSE.CC0.md", root), "utf8"),
  ]),
  skeleton = JSON.parse(skeletonText),
  weights = JSON.parse(weightsText),
  vertices = (meshText.match(/^v /gm) ?? []).length,
  faces = (meshText.match(/^f /gm) ?? []).length,
  bodyStart = meshText.indexOf("\ng body\n"),
  bodyEnd = meshText.indexOf("\ng ", bodyStart + 3),
  bodySection = meshText.slice(bodyStart, bodyEnd < 0 ? undefined : bodyEnd),
  bodyFaces = (bodySection.match(/^f /gm) ?? []).length;
if (vertices < 15000 || faces < 15000)
  throw new Error(
    `Patient source mesh is incomplete (${vertices} vertices, ${faces} faces)`,
  );
if (bodyFaces < 13000)
  throw new Error(`Patient body surface is incomplete (${bodyFaces} faces)`);
const required = [
  "head",
  "neck01",
  "upperarm01.L",
  "upperarm01.R",
  "lowerarm01.L",
  "lowerarm01.R",
  "wrist.L",
  "wrist.R",
  "pelvis.L",
  "pelvis.R",
  "upperleg01.L",
  "upperleg01.R",
  "lowerleg01.L",
  "lowerleg01.R",
  "foot.L",
  "foot.R",
];
for (const bone of required) {
  if (!skeleton.bones?.[bone])
    throw new Error(`Patient skeleton is missing ${bone}`);
  if (!Array.isArray(weights.weights?.[bone]) || !weights.weights[bone].length)
    throw new Error(`Patient skin weights are missing ${bone}`);
}
if (
  skeleton.license !== "CC0" ||
  weights.license !== "CC0" ||
  !licence.includes("CC0 1.0 Universal")
)
  throw new Error("Patient asset licence is not verified as CC0");
console.log(
  `Validated articulated patient surface: ${vertices} vertices, ${bodyFaces} body faces (${faces - bodyFaces} helper faces excluded), ${Object.keys(skeleton.bones).length} deformation rig joints. Anatomical bone completeness is validated separately.`,
);
