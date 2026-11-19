import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../ui-kit/controls";
import { StudioPanel, StudioCartSurface, StudioStepNav } from "../../../ui-kit/jewelry/StudioSurfaces";
import { ChoiceCard, JewelryMark, MetalOrb } from "../../../ui-kit/studio";
import { JewelryColorPicker } from "../../../ui-kit/jewelry/JewelryColorPicker";
type StudioDesign = {
  piece:
    "Classic Solitaire" | "Halo Setting" | "Pendant" | "Pearls" | "Bracelet";
  metal: string;
  gem: string;
  shape: "Original" | "Round" | "Oval" | "Emerald";
  finish: "Original" | "Polished" | "Satin";
  scene: string;
  size: number;
};
const initial: StudioDesign = {
  piece: "Classic Solitaire",
  metal: "#e0e3e8",
  gem: "#ffffff",
  shape: "Original",
  finish: "Original",
  scene: "Ring",
  size: 1,
};
function SelectionLabel({ text }: { text: string }) {
  const current = useRef<HTMLSpanElement>(null);
  const previous = useRef<HTMLSpanElement>(null);
  const last = useRef(text);
  useEffect(() => {
    if (last.current === text) return;
    if (previous.current) previous.current.textContent = last.current;
    last.current = text;
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    previous.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: "forwards" });
    current.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180 });
  }, [text]);
  return <span className="noir-selection-label"><span ref={previous} aria-hidden="true" className="noir-label-previous" /><span ref={current}>{text}</span></span>;
}
export function GuidedPanel({
  loading,
  onPiece,
  onTone,
  onFinish,
  onShape,
  selectedPart,
}: {
  selectedPart?: { part: "Stone" | "Metal"; revision: number };
  loading: boolean;
  onPiece: (index: number) => Promise<boolean>;
  onTone: (target: string, color: string) => void;
  onFinish: (finish: string) => void;
  onShape: (shape: string) => void;
}) {
  const [design, setDesign] = useState(initial),
    [step, setStep] = useState(0),
    [collapsed, setCollapsed] = useState(false),
    [notice, setNotice] = useState(""),
    [cart, setCart] = useState<StudioDesign[]>([]),
    [cartOpen, setCartOpen] = useState(false),
    [colorTarget, setColorTarget] = useState("Gem"),
    [busy, setBusy] = useState(false);
  const ring =
    design.piece === "Classic Solitaire" || design.piece === "Halo Setting";
  const steps = ring
    ? ["Piece", "Ring style", "Stone", "Metal", "Colour"]
    : ["Piece", "Stone", "Metal", "Colour"];
  const current = steps[step] || "Colour";
  const panel = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLElement>(null);
  const stepLight = useRef<HTMLSpanElement>(null);
  const previousStep = useRef(step);
  useLayoutEffect(() => {
    const nav = progress.current;
    const moveLight = () => {
      const active = nav?.querySelector<HTMLElement>("[aria-current=step]");
      if (active && stepLight.current) {
        stepLight.current.style.width = active.offsetWidth + "px";
        stepLight.current.style.height = active.offsetHeight + "px";
        stepLight.current.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
      }
    };
    moveLight();
    const observer = new ResizeObserver(moveLight);
    if (nav) observer.observe(nav);
    return () => observer.disconnect();
  }, [step, ring, collapsed]);
  useEffect(() => {
    const direction = step >= previousStep.current ? 1 : -1;
    previousStep.current = step;
    if (!matchMedia("(prefers-reduced-motion:reduce)").matches) panel.current?.animate(
      [{ opacity: 0, transform: `translateX(${direction * 8}px)` }, { opacity: 1, transform: "translateX(0)" }],
      { duration: 200, easing: "ease-out" },
    );
  }, [step]);
  useEffect(() => {
    if (selectedPart) { setStep(steps.indexOf(selectedPart.part)); setCollapsed(false); }
  }, [selectedPart]);
  const cartDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (cartOpen) cartDialog.current?.showModal();
    else cartDialog.current?.close();
  }, [cartOpen]);
  const update = (patch: Partial<StudioDesign>) => {
    const previous = design;
    setDesign((d) => ({
      ...(patch.piece && patch.piece !== d.piece ? initial : d),
      ...patch,
    }));
    if (patch.gem) onTone("Gem", patch.gem);
    if (patch.metal) onTone("Metal", patch.metal);
    if (patch.finish) onFinish(patch.finish);
    if (patch.shape) onShape(patch.shape);
    if (patch.piece) {
      setBusy(true);
      onPiece(
        [
          "Classic Solitaire",
          "Halo Setting",
          "Pendant",
          "Pearls",
          "Bracelet",
        ].indexOf(patch.piece),
      )
        .then((ok) => {
          if (!ok) {
            setDesign(previous);
            setStep(0);
            setNotice("This piece could not be selected. Please try again.");
          }
        })
        .finally(() => setBusy(false));
    }
    setNotice("");
  };
  const next = () => setStep((n) => Math.min(n + 1, steps.length - 1));
  const swatchPending = useRef(false);
  const pickSwatch = async (button: HTMLButtonElement, patch: Partial<StudioDesign>) => {
    if (swatchPending.current) return;
    swatchPending.current = true;
    update(patch);
    if (!matchMedia("(prefers-reduced-motion:reduce)").matches) {
      const icon = button.firstElementChild;
      icon?.animate([{ transform: "scale(.92)" }, { transform: "scale(1.025)", offset: .7 }, { transform: "scale(1)" }], { duration: 180, easing: "ease-out" });
      const glow = button.animate([{ filter: "drop-shadow(0 0 0 transparent)" }, { filter: "drop-shadow(0 0 5px var(--p-500))", offset: .4 }, { filter: "drop-shadow(0 0 0 transparent)" }], { duration: 180 });
      await glow.finished.catch(() => {});
    }
    swatchPending.current = false;
    if (button.isConnected) next();
  };
  const finish = () => {
    setCart((items) => [...items, { ...design }]);
    setCartOpen(true);
  };
  const target = document.getElementById("jewelry-cart-target");
  const selectionTarget = document.getElementById("studio-selection-target");
  return (
    <>
      {selectionTarget && createPortal(<div className="local-selection-summary" aria-label="Selected materials"><SelectionLabel text={ring ? ({ "#ffffff": "Original stone", "#1644b8": "Sapphire", "#15865d": "Emerald", "#ac1746": "Ruby", "#e1ebfa": "Diamond" }[design.gem] || "Custom stone") : "Original stones"} /><span aria-hidden="true"> · </span><SelectionLabel text={({ "#e0e3e8": "Platinum", "#d5af63": "Gold", "#c88d79": "Rose" }[design.metal] || "Custom metal")} /></div>, selectionTarget)}
      {target &&
        createPortal(
          <Button
            className="noir-cart-button"
            aria-label={"Open cart, " + cart.length + " items"}
            onClick={() => setCartOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 4h2l2.5 11h11l2-8H6M9 20h.01M18 20h.01" />
            </svg>
            <span>{cart.length}</span>
          </Button>,
          target,
        )}
      <StudioPanel data-collapsed={collapsed} className="noir-flow" aria-label={"Build your jewelry: " + current + " options"}>
        <div
          ref={panel}
          hidden={collapsed}
          id="studio-options"
          className="noir-flow-content"
          key={current}
          inert={busy || loading}
          aria-busy={busy || loading}
        >
          {current === "Piece" ? (
            <div className="noir-flow-choices">
              {(["Ring", "Pendant", "Pearls", "Bracelet"] as const).map(
                (piece) => (
                  <ChoiceCard selected={piece === "Ring" ? ring : design.piece === piece} label={piece}
                    key={piece}
                    onClick={() => {
                      update({
                        piece: piece === "Ring" ? "Classic Solitaire" : piece,
                        scene: "Ring",
                      });

                      setStep(1);
                    }}
                  >
                    <JewelryMark kind={piece} />
                  </ChoiceCard>
                ),
              )}
            </div>
          ) : current === "Ring style" ? (
            <div className="noir-flow-choices two">
              {(["Classic Solitaire", "Halo Setting"] as const).map((piece) => (
                <ChoiceCard selected={design.piece === piece} label={piece}
                  key={piece}
                  onClick={() => {
                    update({ piece });
                    next();
                  }}
                >
                  <span className="noir-piece-symbol" aria-hidden="true">
                    {piece === "Classic Solitaire" ? "♢" : "✧"}
                  </span>
                </ChoiceCard>
              ))}
            </div>
          ) : current === "Stone" ? (
            ring ? (
              <div className="noir-stone-step">
                <div className="noir-gems">
                  {[
                    { name: "Sapphire", color: "#1644b8" },
                    { name: "Emerald", color: "#15865d" },
                    { name: "Ruby", color: "#ac1746" },
                    { name: "Diamond", color: "#e1ebfa" },
                  ].map((g) => (
                    <Button variant="ghost"
                      key={g.name}
                      aria-label={g.name}
                      aria-pressed={design.gem===g.color}
                      onClick={(event) => { void pickSwatch(event.currentTarget, { gem: g.color }); }}
                    >
                      <span
                        style={{ "--gem": g.color } as React.CSSProperties}
                      />
                      <small>{g.name}</small>
                    </Button>
                  ))}
                </div>
                <span className="noir-step-hint">
                  Choose a stone to continue
                </span>
              </div>
            ) : (
              <div className="noir-fixed-stone">
                <p>
                  {design.piece === "Pearls"
                    ? "Original pearl strand"
                    : design.piece === "Pendant"
                      ? "Original teardrop stone"
                      : "Original charm set"}
                  <small>
                    This collection model keeps its original stones and display.
                  </small>
                </p>
                <Button onClick={next}>Keep original →</Button>
              </div>
            )
          ) : current === "Metal" ? (
            <div className="noir-metals">
              {[
                { name: "Platinum", tone: "#e0e3e8" },
                { name: "Gold", tone: "#d5af63" },
                { name: "Rose", tone: "#c88d79" },
              ].map((m) => (
                <Button variant="ghost"
                  key={m.name}
                  aria-label={m.name}
                  aria-pressed={design.metal===m.tone}
                  onClick={(event) => { void pickSwatch(event.currentTarget, { metal: m.tone }); }}
                >
                  <MetalOrb tone={m.tone} />
                  <span>{m.name}</span>
                  <span className="noir-choice-arrow">↗</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="noir-final-step">
              <div className="noir-custom-zone">
                <div className="noir-colour-target">
                  {(ring ? ["Gem", "Metal"] : ["Metal"]).map((target) => (
                    <Button variant="ghost"
                      key={target}
                      aria-pressed={(ring ? colorTarget : "Metal") === target}
                      onClick={() => setColorTarget(target)}
                    >
                      {target} colour
                    </Button>
                  ))}
                </div>
                <JewelryColorPicker
                  value={
                    ring && colorTarget === "Gem" ? design.gem : design.metal
                  }
                  onChange={(value) =>
                    update(
                      ring && colorTarget === "Gem"
                        ? { gem: value }
                        : { metal: value },
                    )
                  }
                />
              </div>
              <div className="noir-final-options">
                {ring && (
                  <select
                    aria-label="Stone cut"
                    value={design.shape}
                    onChange={(e) =>
                      update({
                        shape: e.target.value as StudioDesign["shape"],
                      })
                    }
                  >
                    <option value="Original">Original cut</option>
                    <option>Round</option>
                    <option>Oval</option>
                    <option value="Emerald">Step</option>
                  </select>
                )}
                <select
                  aria-label="Surface finish"
                  value={design.finish}
                  onChange={(e) =>
                    update({
                      finish: e.target.value as StudioDesign["finish"],
                    })
                  }
                >
                  <option
                    value="Original"
                    disabled={design.finish !== "Original"}
                  >
                    Original finish
                  </option>
                  <option>Polished</option>
                  <option>Satin</option>
                </select>
              </div>
              <Button
                variant="primary"
                disabled={busy || loading}
                onClick={finish}
              >
                Add to cart <span>＋</span>
              </Button>
            </div>
          )}
        </div>
        <Button variant="ghost" className="noir-dock-toggle" aria-label={collapsed ? "Show options" : "Hide options"} aria-expanded={!collapsed} aria-controls="studio-options" onClick={() => setCollapsed(!collapsed)}><span aria-hidden="true">{collapsed ? "⌃" : "⌄"}</span></Button>
        <StudioStepNav ref={progress} className="noir-progress" aria-label="Design steps"><span ref={stepLight} className="noir-step-light" aria-hidden="true" />
          {steps.map((label, i) => (
            <Button variant="ghost"
              key={label}
              data-complete={i < step}
              aria-current={step === i ? "step" : undefined}
              disabled={i > step}
              onClick={() => { setCollapsed(false); setStep(i); }}
            >
              <span className="noir-step-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><defs><linearGradient id={"step-"+i} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--p-300)"/><stop offset=".4" stopColor="var(--p-400)"/><stop offset="1" stopColor="var(--p-700)"/></linearGradient></defs><g fill={"url(#step-"+i+")"} stroke="var(--p-300)" strokeWidth=".8">{label==="Piece"?<><path d="m16 3 12 7v13l-12 7-12-7V10Z"/><path d="m4 10 12 7 12-7M16 17v13" fill="none"/></>:label==="Ring style"?<><ellipse cx="16" cy="20" rx="10" ry="8" fill="none" strokeWidth="5"/><path d="m10 5 3-3h6l3 3-6 8Z"/></>:label==="Stone"?<><path d="M3 11 9 4h14l6 7-13 18Z"/><path d="m3 11 13 18-7-18 7-7 7 7-7 18M3 11h26" fill="none"/></>:label==="Metal"?<><ellipse cx="16" cy="9" rx="12" ry="5"/><path d="M4 9v14c0 7 24 7 24 0V9c0 7-24 7-24 0Z"/><path d="M4 16c0 7 24 7 24 0" fill="none"/></>:<><path d="M16 2C12 9 5 14 5 21a11 11 0 0 0 22 0c0-7-7-12-11-19Z"/><path d="M11 17c-4 5-1 9 3 9" fill="none" strokeWidth="2"/></>}</g></svg></span>
              <span>{label}</span>
            </Button>
          ))}
          {step > 0 && (
            <Button variant="ghost" className="noir-back" onClick={() => setStep((n) => n - 1)}>
              ← Back
            </Button>
          )}
        </StudioStepNav>
      </StudioPanel>
      <dialog
        aria-label="Your cart"
        ref={cartDialog}
        onCancel={() => setCartOpen(false)}
        className="noir-cart-backdrop"
        onClick={() => setCartOpen(false)}
      >
        <StudioCartSurface
          className="noir-cart-panel"

          aria-label="Your cart"
          onClick={(e) => e.stopPropagation()}
        >
          <header>
            <div>
              <span className="noir-eyebrow">YOUR COLLECTION</span>
              <h2>
                Your cart <small>{cart.length}</small>
              </h2>
            </div>
            <Button aria-label="Close cart" onClick={() => setCartOpen(false)}>
              ×
            </Button>
          </header>
          <p className="noir-cart-note">
            Designs are kept for this visit. No checkout or payment.
          </p>
          <div className="noir-cart-items">
            {cart.length === 0 ? (
              <p>Your collection starts with one idea.</p>
            ) : (
              cart.map((item, i) => (
                <article key={i}>
                  <div
                    className="noir-cart-tone"
                    style={{ background: item.metal }}
                  >
                    <i style={{ background: item.gem }} />
                  </div>
                  <div>
                    <h3>{item.piece}</h3>
                    <p>
                      {item.piece === "Classic Solitaire" ||
                      item.piece === "Halo Setting"
                        ? item.shape === "Emerald"
                          ? "Step cut"
                          : item.shape === "Original"
                            ? "Original cut"
                            : item.shape + " cut"
                        : "Original stones"}{" "}
                      ·{" "}
                      {item.finish === "Original"
                        ? "Original finish"
                        : item.finish}
                    </p>
                    <div className="noir-cart-swatches">
                      <i style={{ background: item.gem }} />
                      <i style={{ background: item.metal }} />
                    </div>
                  </div>
                  <Button variant="ghost"
                    aria-label={"Remove " + item.piece}
                    onClick={() =>
                      setCart((items) => items.filter((_, j) => j !== i))
                    }
                  >
                    ×
                  </Button>
                </article>
              ))
            )}
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setCartOpen(false);
              setStep(0);
            }}
          >
            Create another piece →
          </Button>
        </StudioCartSurface>
      </dialog>
      <div role="status">{notice}</div>
    </>
  );
}
