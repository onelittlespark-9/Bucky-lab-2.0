import React, { useEffect, useRef, useState } from "react";
import { latestLoadedVolume, type PatientVolume } from "../core/volume";
import type { PatientSex } from "../core/patients";
import type {
  FullBodyPose,
  RespirationInstruction,
} from "../core/radiographic-positions";
import type { RadiographicPosition } from "../core/radiographic-positions";
import { ArticulatedPatient } from "./ArticulatedPatient";
import "./PatientPositioner.css";
type Field = {
  x: number;
  y: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};
type Props = {
  sex?: PatientSex;
  volume?: PatientVolume | null;
  position?: RadiographicPosition;
  rotation: number;
  x: number;
  y: number;
  beamX?: number;
  beamY?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  pose: FullBodyPose;
  instructions?: string[];
  respiration?: RespirationInstruction;
  onRotation: (v: number) => void;
  onBeam?: (x: number, y: number) => void;
  onField?: (v: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }) => void;
};
function volumeSex(v?: PatientVolume | null): PatientSex {
  const s =
    `${v?.manifest.caseId ?? ""} ${v?.manifest.source.case ?? ""}`.toLowerCase();
  return s.includes("female") ? "female" : "male";
}
export function PatientPositioner({
  sex,
  volume,
  position,
  rotation,
  x,
  y,
  beamX = 0,
  beamY = 0,
  left = 28,
  right = 28,
  top = 18,
  bottom = 18,
  pose,
  instructions = [],
  respiration = "none",
  onRotation,
  onBeam,
  onField,
}: Props) {
  const stage = useRef<HTMLDivElement>(null),
    drag = useRef<{
      mode: "move" | "resize";
      sx: number;
      sy: number;
      f: Field;
    } | null>(null);
  const [local, setLocal] = useState<Field>({
      x: beamX,
      y: beamY,
      left,
      right,
      top,
      bottom,
    }),
    [activeVolume, setActiveVolume] = useState<PatientVolume | null>(
      volume ?? latestLoadedVolume(),
    ),
    [completed, setCompleted] = useState<Set<number>>(new Set());
  const f =
      onBeam || onField
        ? { x: beamX, y: beamY, left, right, top, bottom }
        : local,
    width = Math.max(10, 100 - f.left - f.right),
    height = Math.max(10, 100 - f.top - f.bottom),
    fx = f.left + width / 2 + f.x,
    fy = f.top + height / 2 + f.y;
  useEffect(() => {
    setCompleted(new Set());
  }, [instructions, respiration]);
  useEffect(() => {
    if (volume) {
      setActiveVolume(volume);
      return;
    }
    const id = setInterval(() => {
      const v = latestLoadedVolume();
      if (v) setActiveVolume(v);
    }, 150);
    return () => clearInterval(id);
  }, [volume]);
  const activeSex = sex ?? volumeSex(activeVolume);
  function start(e: React.PointerEvent, mode: "move" | "resize") {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { mode, sx: e.clientX, sy: e.clientY, f: { ...f } };
  }
  function move(e: React.PointerEvent) {
    const d = drag.current,
      r = stage.current?.getBoundingClientRect();
    if (!d || !r) return;
    const dx = ((e.clientX - d.sx) / r.width) * 100,
      dy = ((e.clientY - d.sy) / r.height) * 100;
    if (d.mode === "move") {
      const nx = Math.max(-45, Math.min(45, d.f.x + dx)),
        ny = Math.max(-45, Math.min(45, d.f.y + dy));
      onBeam ? onBeam(nx, ny) : setLocal((v) => ({ ...v, x: nx, y: ny }));
      return;
    }
    const oldW = 100 - d.f.left - d.f.right,
      oldH = 100 - d.f.top - d.f.bottom,
      cx = d.f.left + oldW / 2 + d.f.x,
      cy = d.f.top + oldH / 2 + d.f.y,
      w = Math.max(8, Math.min(92, oldW + dx * 2)),
      h = Math.max(8, Math.min(92, oldH + dy * 2)),
      nl = Math.max(0, Math.min(92, cx - w / 2 - d.f.x)),
      nt = Math.max(0, Math.min(92, cy - h / 2 - d.f.y)),
      nf = {
        left: nl,
        right: Math.max(0, 100 - nl - w),
        top: nt,
        bottom: Math.max(0, 100 - nt - h),
      };
    onField ? onField(nf) : setLocal((v) => ({ ...v, ...nf }));
  }
  function toggleInstruction(i: number) {
    setCompleted((old) => {
      const n = new Set(old);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }
  const shoulder = instructions.find((v) => /shoulder/i.test(v)),
    breathing = instructions.find((v) =>
      /breath|inspiration|expiration|hold/i.test(v),
    ),
    coaching = [shoulder, breathing].filter(
      (v, i, a): v is string => !!v && a.indexOf(v) === i,
    );
  return (
    <div className="patient-positioner" ref={stage}>
      <div
        className={`anatomy-patient real-mesh skin-patient ${activeSex}`}
        style={{
          transform: `translate(${x * 0.7}%,${-y * 0.7}%)`,
        }}
      >
        <ArticulatedPatient pose={pose} rotation={rotation} />
        <span className="patient-sex-badge">{activeSex.toUpperCase()}</span>
        <span className="pose-fidelity-badge">ARTICULATED · CC0</span>
      </div>
      <div
        className="light-field"
        style={{
          left: `${fx - width / 2}%`,
          top: `${fy - height / 2}%`,
          width: `${width}%`,
          height: `${height}%`,
        }}
        onPointerDown={(e) => start(e, "move")}
        onPointerMove={move}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <span className="field-centre" />
        <span className="field-label">LIGHT FIELD</span>
        <button
          className="field-handle"
          aria-label="Resize collimation"
          onPointerDown={(e) => {
            e.stopPropagation();
            start(e, "resize");
          }}
          onPointerMove={move}
          onPointerUp={() => (drag.current = null)}
        />
      </div>
      {coaching.length > 0 && (
        <details className="patient-instructions">
          <summary>Patient communication</summary>
          {coaching.map((v, i) => (
            <label
              className={completed.has(i) ? "instruction-selected" : ""}
              key={`${i}-${v}`}
            >
              <input
                type="checkbox"
                checked={completed.has(i)}
                onChange={() => toggleInstruction(i)}
              />
              <span>{v}</span>
            </label>
          ))}
        </details>
      )}
      <label className="patient-rotation">
        Patient rotation <b>{rotation}°</b>
        <input
          type="range"
          min="-180"
          max="180"
          value={rotation}
          onChange={(e) => onRotation(+e.target.value)}
        />
      </label>
      <small className="positioning-hint">
        Use external landmarks to position the patient. Move and collimate the
        light field independently. Joint-dependent positioning is shown by the
        articulated patient rig.
      </small>
    </div>
  );
}
