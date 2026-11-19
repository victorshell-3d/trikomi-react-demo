import type { CSSProperties, ReactNode } from "react";

export function JewelryMark({ kind = "Ring" }: { kind?: string }) {
  return (
    <svg
      viewBox="0 0 80 68"
      fill="none"
      aria-hidden="true"
      className="kit-jewel-mark"
    >
      {kind === "Ring" ? (
        <>
          <ellipse cx="40" cy="42" rx="20" ry="21" />
          <path d="m31 17 5-8h8l5 8-9 10-9-10Z M31 17h18 M36 9l4 18 4-18" />
        </>
      ) : kind === "Pendant" ? (
        <>
          <path d="M23 6q17 30 34 0 M40 29v7 M40 34C19 51 27 63 40 63s21-12 0-29Z" />
          <path d="M40 40c-12 11-11 16 0 18" />
        </>
      ) : kind === "Pearls" ? (
        <>
          {Array.from({ length: 13 }, (_, i) => {
            const a = (i / 12) * Math.PI;
            return (
              <circle
                key={i}
                cx={40 - Math.cos(a) * 25}
                cy={22 + Math.sin(a) * 30}
                r="3.3"
              />
            );
          })}
        </>
      ) : (
        <>
          <ellipse cx="40" cy="34" rx="28" ry="18" strokeDasharray="7 4" />
          <path d="m36 47 4-6 4 6 7 1-5 5 1 7-7-3-7 3 1-7-5-5 7-1Z" />
        </>
      )}
    </svg>
  );
}
export function ChoiceCard({
  selected,
  label,
  detail,
  children,
  onClick,
}: {
  selected: boolean;
  label: string;
  detail?: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="kit-choice"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
    >
      <span className="kit-choice-art">{children}</span>
      <span className="kit-choice-label">
        {label}
        <small>{detail}</small>
      </span>
      <span className="kit-choice-check" aria-hidden="true">
        {selected ? "✓" : "+"}
      </span>
    </button>
  );
}
export function MetalOrb({ tone }: { tone: string }) {
  return (
    <span
      className="kit-metal-orb"
      style={{ "--metal": tone } as CSSProperties}
    />
  );
}
export function SectionHeading({
  eyebrow,
  title,
  trailing,
}: {
  eyebrow: string;
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="kit-section-heading">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {trailing}
    </div>
  );
}
export function SpecCard({
  name,
  metal,
  shape,
  carat,
  size,
  tone,
  ring,
}: {
  name: string;
  metal: string;
  shape: string;
  carat: number;
  size: number;
  tone: string;
  ring: boolean;
}) {
  return (
    <section className="kit-spec-card" aria-label="Live design specifications">
      <div className="kit-spec-top">
        <span>YOUR COMPOSITION</span>
        <span className="kit-live-dot">LIVE</span>
      </div>
      <div className="kit-spec-name">
        <JewelryMark
          kind={
            name.includes("necklace")
              ? "Pearls"
              : name.includes("pendant")
                ? "Pendant"
                : name.includes("bracelet")
                  ? "Bracelet"
                  : "Ring"
          }
        />
        <h2>
          {name}
          <small>Personal design / 01</small>
        </h2>
      </div>
      <dl>
        <div>
          <dt>Material</dt>
          <dd>
            <i style={{ background: tone }} />
            {metal}
          </dd>
        </div>
        {ring && (
          <>
            <div>
              <dt>Center stone</dt>
              <dd>
                {shape} · {carat.toFixed(1)} ct
              </dd>
            </div>
            <div>
              <dt>Ring size</dt>
              <dd>US {size}</dd>
            </div>
          </>
        )}
      </dl>
      <p>Visual preview. Final details confirmed by a jeweler.</p>
    </section>
  );
}
export function StudioHint({ onClose }: { onClose: () => void }) {
  return (
    <div className="kit-studio-hint" role="status">
      <span className="kit-hint-symbol">↔</span>
      <span>
        <strong>Make it yours.</strong> Choose a material. Try the tools and cart.
        Explore every detail.
      </span>
      <button onClick={onClose} aria-label="Dismiss studio hint">
        ×
      </button>
    </div>
  );
}
export function GemMark({ shape }: { shape: string }) {
  return (
    <span
      className={"kit-gem-mark kit-gem-" + shape.toLowerCase()}
      aria-hidden="true"
    />
  );
}
