import { useState, useRef, type CSSProperties } from "react";
import { Icon } from "./controls";
export type ThumbnailItem = { id: string; category: string; hue: number };
export function ChipCarousel({
  items,
  value,
  onChange,
  onHue,
}: {
  items: ThumbnailItem[];
  value: string;
  onChange: (v: string) => void;
  onHue: (v: number) => void;
}) {
  const [filter, setFilter] = useState("All");
  const track = useRef<HTMLDivElement>(null);
  function scroll(direction: number) {
    const el = track.current;
    if (!el) return;
    const end = el.scrollWidth - el.clientWidth;
    el.scrollTo({
      left:
        direction > 0
          ? el.scrollLeft >= end - 4
            ? 0
            : el.scrollLeft + 260
          : el.scrollLeft <= 4
            ? end
            : el.scrollLeft - 260,
      behavior: "smooth",
    });
  }
  return (
    <div className="selection-bar glass">
      <div className="chips">
        {["All", "Classic", "Modern", "Bold", "Premium"].map((v) => (
          <button
            type="button"
            className={"chip" + (filter === v ? " is-active" : "")}
            aria-pressed={filter === v}
            key={v}
            onClick={() => {
              setFilter(v);
              track.current?.scrollTo({ left: 0 });
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="carousel">
        <button
          type="button"
          className="car-arrow"
          aria-label="Previous"
          onClick={() => scroll(-1)}
        >
          <Icon name="chev-l" />
        </button>
        <div ref={track} className="car-track">
          {items
            .filter((v) => filter === "All" || v.category === filter)
            .map((v) => (
              <button
                type="button"
                key={v.id}
                className={"thumb" + (value === v.id ? " is-selected" : "")}
                aria-pressed={value === v.id}
                onClick={() => {
                  onChange(v.id);
                  onHue(v.hue);
                }}
              >
                <i
                  className="thumb-art"
                  style={{ "--h": v.hue } as CSSProperties}
                />
                <span>{v.id}</span>
              </button>
            ))}
        </div>
        <button
          type="button"
          className="car-arrow"
          aria-label="Next"
          onClick={() => scroll(1)}
        >
          <Icon name="chev-r" />
        </button>
      </div>
    </div>
  );
}
