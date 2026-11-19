import type { ReactNode } from "react";
export function StudioHeader({ children, brand = "Jewelry Studio", subtitle = "JEWELRY / DESIGN STUDIO", mark = "J", className = "", showNote = true }: { children: ReactNode; brand?: string; subtitle?: string; mark?: string; className?: string; showNote?: boolean }) {
  return <header className={`js-header glass ${className}`}>
    <div className="js-brand shell-brand"><b aria-hidden="true">{mark}</b><span>{brand}<small>{subtitle}</small></span></div>
    {showNote && <span className="js-header-note"><span className="kit-atelier-wordmark">THE PERSONAL ATELIER</span><em>Design in real time.</em></span>}
    {children}
  </header>;
}
export function StudioDock({
  category,
  onChange,
  tabs = ["Piece", "Metal", "Colour", "Stone", "Engrave", "Size", "Compare", "Share"],
}: {
  category: string;
  onChange: (value: string) => void;
  tabs?: string[];
}) {
  return (
    <nav
      className="js-category-tabs"
      role="tablist"
      aria-label="Customize jewelry"
    >
      {tabs.map((c, i) => (
        <button
          key={c}
          id={"js-category-" + c}
          role="tab"
          aria-controls="js-options"
          aria-selected={category === c}
          tabIndex={category === c ? 0 : -1}
          onClick={() => {
            onChange(c);
          }}
          onKeyDown={(e) => {
            if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              const next =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? tabs.length - 1
                    : (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) %
                      tabs.length;
              onChange(tabs[next]);
              requestAnimationFrame(() => {
                const target = document.getElementById(
                  "js-category-" + tabs[next],
                );
                target?.focus();
                target?.scrollIntoView({
                  block: "nearest",
                  inline: "nearest",
                  behavior: "instant",
                });
              });
            }
          }}
        >
          {c}
        </button>
      ))}
    </nav>
  );
}
