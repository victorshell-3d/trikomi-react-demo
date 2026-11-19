import { jewelrySwatches } from "./palette";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent, KeyboardEvent } from "react";
const defaults = jewelrySwatches;
function hsv(hex: string) {
  const c = hex.match(/[a-f\d]{2}/gi)!.map((v) => parseInt(v, 16) / 255),
    max = Math.max(...c),
    min = Math.min(...c),
    d = max - min;
  let h = 0;
  if (d) {
    h =
      max === c[0]
        ? ((c[1] - c[2]) / d) % 6
        : max === c[1]
          ? (c[2] - c[0]) / d + 2
          : (c[0] - c[1]) / d + 4;
    h *= 60;
  }
  return [(h + 360) % 360, max === 0 ? 0 : d / max, max];
}
function hex(h: number, s: number, v: number) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return ("#" + f(5) + f(3) + f(1)).toUpperCase();
}
export function JewelryColorPicker({
  value,
  onChange,
  inline = false,
}: {
  value: string;
  inline?: boolean;
  onChange: (color: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    [open, setOpen] = useState(false),
    [h, setH] = useState(42),
    [s, setS] = useState(0.4),
    [v, setV] = useState(0.85),
    [input, setInput] = useState(value.toUpperCase()),
    [invalid, setInvalid] = useState(false),
    [notice, setNotice] = useState("");
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const x = JSON.parse(localStorage.getItem("jewelry-colors") || "null");
      return Array.isArray(x)
        ? x
            .filter(
              (c: unknown) => typeof c === "string" && /^#[a-f\d]{6}$/i.test(c),
            )
            .slice(0, 8)
        : defaults;
    } catch {
      return defaults;
    }
  });
  useEffect(() => {
    const [nh, ns, nv] = hsv(value);
    if (ns > 0.001) setH(nh);
    setS(ns);
    setV(nv);
    setInput(value.toUpperCase());
    setInvalid(false);
  }, [value]);
  const change = (nh: number, ns: number, nv: number) => {
    setH(nh);
    setS(ns);
    setV(nv);
    onChange(hex(nh, ns, nv));
  };
  const point = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    change(
      h,
      Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      1 - Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    );
  };
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
      return;
    e.preventDefault();
    const step = e.shiftKey ? 0.1 : 0.01;
    change(
      h,
      Math.max(
        0,
        Math.min(
          1,
          s +
            (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0),
        ),
      ),
      Math.max(
        0,
        Math.min(
          1,
          v + (e.key === "ArrowUp" ? step : e.key === "ArrowDown" ? -step : 0),
        ),
      ),
    );
  };
  const close = () => {
    dialog.current?.close();
    setOpen(false);
  };
  const eye = async () => {
    const w = window as typeof window & {
      EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
    };
    if (!w.EyeDropper) return;
    try {
      const c = await new w.EyeDropper().open();
      onChange(c.sRGBHex);
      setNotice("Sampled color applied");
    } catch {
      setNotice("Color sampling cancelled");
    }
  };
  const pickerSurface = (compact: boolean) => (
    <>
      <div
        className="js-sv-square"
        tabIndex={0}
        role="slider"
        aria-label={
          compact
            ? "Inline saturation and brightness"
            : "Saturation and brightness"
        }
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(s * 100)}
        aria-valuetext={`Saturation ${Math.round(s * 100)}%, brightness ${Math.round(v * 100)}%. Use left/right for saturation, up/down for brightness.`}
        style={{ backgroundColor: `hsl(${h} 100% 50%)` }}
        onKeyDown={keys}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          point(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) point(e);
        }}
      >
        <i
          style={{
            left: `${s * 100}%`,
            top: `${(1 - v) * 100}%`,
            background: value,
          }}
        />
      </div>
      <div className="js-picker-hue">
        {!compact && (
          <button
            disabled={!("EyeDropper" in window)}
            title={
              "EyeDropper" in window
                ? "Pick a color from your screen"
                : "Screen eyedropper is unavailable in this browser. Use the square or HEX field."
            }
            aria-label="Pick screen color"
            onClick={eye}
          >
            ⌾
          </button>
        )}
        <label>
          <span>
            Hue <b>{Math.round(h)}°</b>
          </span>
          <input
            aria-label={compact ? "Inline hue" : "Hue"}
            type="range"
            min="0"
            max="359"
            value={h}
            onChange={(e) => change(Number(e.target.value), s, v)}
          />
        </label>
      </div>
    </>
  );
  return (
    <>
      {inline && (
        <div
          className="js-inline-picker"
          role="group"
          aria-label="Live color picker"
        >
          <div className="js-inline-picker-label">
            <span>Color picker</span>
            <code>{value.toUpperCase()}</code>
          </div>
          {pickerSurface(true)}
        </div>
      )}
      <button
        className="js-color-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
      >
        <i style={{ background: value }} />
        <span>Custom color</span>
        <span aria-hidden="true">↗</span>
      </button>
      <dialog
        ref={dialog}
        className="js-color-dialog"
        aria-labelledby="js-color-heading"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="js-picker-head">
          <div>
            <small>MATERIAL STUDIO</small>
            <h2 id="js-color-heading">Choose your color</h2>
          </div>
          <button onClick={close} aria-label="Close color picker">
            ×
          </button>
        </div>
        {pickerSurface(false)}
        <div className="js-picker-hex">
          <label htmlFor="js-hex">HEX</label>
          <input
            id="js-hex"
            value={input}
            maxLength={20}
            spellCheck={false}
            aria-invalid={invalid}
            aria-describedby={invalid ? "js-color-error" : undefined}
            onChange={(e) => {
              const text = e.target.value.trim().toUpperCase();
              setInput(text);
              if (/^#?(?:[A-F\d]{3}|[A-F\d]{6})$/.test(text)) {
                const digits = text.replace(/^#/, "");
                onChange(
                  "#" +
                    (digits.length === 3
                      ? [...digits].map((c) => c + c).join("")
                      : digits),
                );
                setInvalid(false);
              } else setInvalid(true);
            }}
          />
          <i style={{ background: value }} />
          <span>100%</span>
        </div>
        {invalid && (
          <p className="js-picker-error" id="js-color-error">
            Enter a 3- or 6-digit HEX color, e.g. #85F or #875CFF.
          </p>
        )}
        <div className="js-picker-saved">
          <span>Saved colors</span>
          <button
            onClick={() => {
              const next = [
                value.toUpperCase(),
                ...saved.filter((c) => c.toLowerCase() !== value.toLowerCase()),
              ].slice(0, 8);
              setSaved(next);
              try {
                localStorage.setItem("jewelry-colors", JSON.stringify(next));
                setNotice("Color saved on this device");
              } catch {
                setNotice("Color saved for this visit");
              }
            }}
          >
            + Save current
          </button>
        </div>
        <div className="js-saved-swatches">
          {saved.map((c) => (
            <button
              key={c}
              aria-label={`Saved color ${c}`}
              aria-pressed={c.toLowerCase() === value.toLowerCase()}
              style={{ background: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
        <p className="js-picker-caption" role="status">
          {notice || "Changes apply live. Saved colors stay on this device."}
        </p>
      </dialog>
    </>
  );
}
