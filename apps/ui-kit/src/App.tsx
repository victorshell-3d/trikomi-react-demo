import { useState, useEffect, type CSSProperties } from "react";
import { IconSymbols } from "./components/IconSymbols";
import {
  ConfiguratorPreview,
  ConfiguratorToolbar,
} from "./components/ConfiguratorPreview";
import { Switch } from "./components/controls";
import { ChipCarousel } from "./components/ChipCarousel";
const items = [
  { id: "Classic Violet", category: "Classic", hue: 270 },
  { id: "Modern Blue", category: "Modern", hue: 210 },
  { id: "Premium Gold", category: "Premium", hue: 43 },
  { id: "Classic Blue", category: "Classic", hue: 215 },
  { id: "Premium Teal", category: "Premium", hue: 190 },
  { id: "Bold Magenta", category: "Bold", hue: 288 },
];
export default function App() {
  const [message, notify] = useState("");
  const [overlay, setOverlay] = useState<"customize" | "share" | null>(null);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    Notifications: true,
    Watermark: false,
  });
  const [pressed, setPressed] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, string>>({
    nav: "Home",
    rail: "Model",
  });
  const [slider, setSlider] = useState(40);
  const [color, setColor] = useState("Violet");
  const [material, setMaterial] = useState("Metallic");
  const [lighting, setLighting] = useState("Neon");
  const [asset, setAsset] = useState("Classic Violet");
  const [galleryHue, setGalleryHue] = useState(272);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => notify(""), 2600);
    return () => clearTimeout(t);
  }, [message]);
  useEffect(()=>setGalleryHue(({Violet:272,Magenta:288,Gold:43,Rose:350,Emerald:160,Blue:215} as Record<string,number>)[color]),[color]);
  const toolbar = {
    color,
    material,
    lighting,
    onColor: setColor,
    onMaterial: setMaterial,
    onLighting: setLighting,
    onCustomize: () => setOverlay("customize"),
  };
  return (
    <>
      <IconSymbols />
      <ConfiguratorPreview
        state={{
          hue: galleryHue,
          color,
          material,
          lighting,
          setColor,
          setMaterial,
          setLighting,
        }}
        onToast={notify}
        externalOverlay={overlay}
        onExternalClose={() => setOverlay(null)}
      />
      <main className="wrap" style={{ "--h": galleryHue } as CSSProperties}>
        <header className="kit-head">
          <span className="chip chip-glow">{"Common UI Kit v2.0 · React"}</span>
          <h1>{"One component set for every VictorShell configurator"}</h1>
          <p>
            {
              "One common dark-theme interface and the same components for every configurator. React + TypeScript conversion of the exact TRIK-30 attachment. Interactive component demos with shared controls."
            }
          </p>
        </header>
        <section id="gallery-tokens">
          <h2>{"01 - Design tokens"}</h2>
          <div className="panel">
            <p className="field-label">{"Colours"}</p>
            <div className="grid g6">
              <div className="swatch">
                <i style={{ background: "#07020f" } as CSSProperties}></i>
                <div>
                  <b>{"Bg deep"}</b>
                  <code>{"#07020F"}</code>
                </div>
              </div>
              <div className="swatch">
                <i style={{ background: "#120826" } as CSSProperties}></i>
                <div>
                  <b>{"Bg panel"}</b>
                  <code>{"#120826"}</code>
                </div>
              </div>
              <div className="swatch">
                <i style={{ background: "#1e1040" } as CSSProperties}></i>
                <div>
                  <b>{"Surface"}</b>
                  <code>{"#1E1040"}</code>
                </div>
              </div>
              <div className="swatch">
                <i style={{ background: "#7c3aed" } as CSSProperties}></i>
                <div>
                  <b>{"Primary"}</b>
                  <code>{"#7C3AED"}</code>
                </div>
              </div>
              <div className="swatch">
                <i style={{ background: "#a855f7" } as CSSProperties}></i>
                <div>
                  <b>{"Accent"}</b>
                  <code>{"#A855F7"}</code>
                </div>
              </div>
              <div className="swatch">
                <i style={{ background: "#d8b4fe" } as CSSProperties}></i>
                <div>
                  <b>{"Accent soft"}</b>
                  <code>{"#D8B4FE"}</code>
                </div>
              </div>
              <div className="swatch">
                <i style={{ background: "#f5c66b" } as CSSProperties}></i>
                <div>
                  <b>{"Gold detail"}</b>
                  <code>{"#F5C66B"}</code>
                </div>
              </div>
              <div className="swatch">
                <i style={{ background: "#ffffff" } as CSSProperties}></i>
                <div>
                  <b>{"Text"}</b>
                  <code>{"#FFFFFF"}</code>
                </div>
              </div>
              <div className="swatch">
                <i style={{ background: "#b8a6d9" } as CSSProperties}></i>
                <div>
                  <b>{"Text muted"}</b>
                  <code>{"#B8A6D9"}</code>
                </div>
              </div>
              <div className="swatch">
                <i
                  style={
                    {
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    } as CSSProperties
                  }
                ></i>
                <div>
                  <b>{"Primary gradient"}</b>
                  <code>{"135\u00b0"}</code>
                </div>
              </div>
              <div className="swatch">
                <i
                  style={
                    {
                      background:
                        "radial-gradient(circle,#a855f766,transparent 70%)",
                    } as CSSProperties
                  }
                ></i>
                <div>
                  <b>{"Glow"}</b>
                  <code>{"rgba(168,85,247,.4)"}</code>
                </div>
              </div>
              <div className="swatch">
                <i
                  style={
                    {
                      background: "rgba(23,12,42,.66)",
                      backdropFilter: "blur(14px)",
                    } as CSSProperties
                  }
                ></i>
                <div>
                  <b>{"Glass"}</b>
                  <code>{"blur 14px"}</code>
                </div>
              </div>
            </div>
            <p className="field-label">{"Radius & elevation"}</p>
            <div className="row">
              <div
                className="radius-demo"
                style={{ "--r": "10px" } as CSSProperties}
              >
                {"10"}
              </div>
              <div
                className="radius-demo"
                style={{ "--r": "16px" } as CSSProperties}
              >
                {"16"}
              </div>
              <div
                className="radius-demo"
                style={{ "--r": "22px" } as CSSProperties}
              >
                {"22"}
              </div>
              <div
                className="radius-demo"
                style={{ "--r": "28px" } as CSSProperties}
              >
                {"28"}
              </div>
              <div
                className="radius-demo"
                style={{ "--r": "999px" } as CSSProperties}
              >
                {"pill"}
              </div>
              <div className="glow-demo">{"glow-sm / glow / glow-lg"}</div>
            </div>
            <p className="field-label">{"Type scale (Manrope)"}</p>
            <div className="type-row">
              <span className="t-display">{"Common Product Configurator"}</span>
              <code>{"32 / 800"}</code>
            </div>
            <div className="type-row">
              <span className="t-h1">{"Customize your piece"}</span>
              <code>{"24 / 700"}</code>
            </div>
            <div className="type-row">
              <span className="t-body">
                {
                  "Choose a color, material and lighting for the shared preview."
                }
              </span>
              <code>{"15 / 500"}</code>
            </div>
            <div className="type-row">
              <span className="t-small">
                {"360\u00b0 \u00b7 AR \u00b7 FULLSCREEN"}
              </span>
              <code>{"11 / 700 caps"}</code>
            </div>
          </div>
        </section>
        <section id="gallery-buttons">
          <h2>{"02 - Buttons & icon actions"}</h2>
          <div className="panel">
            <p className="field-label">{"Primary / secondary / ghost"}</p>
            <div className="row">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => notify("Primary clicked")}
              >
                <svg>
                  <use href="#i-sparkle"></use>
                </svg>
                <span>{"Customize"}</span>
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => notify("Secondary clicked")}
              >
                <svg>
                  <use href="#i-camera"></use>
                </svg>
                <span>{"Try-On"}</span>
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => notify("Ghost clicked")}
              >
                <svg>
                  <use href="#i-upload"></use>
                </svg>
                <span>{"Upload Photo"}</span>
              </button>
              <button
                className="btn btn-primary"
                disabled
                type="button"
                onClick={() => notify("Saved - this is a demo toast")}
              >
                <span>{"Disabled"}</span>
              </button>
            </div>
            <p className="field-label">{"Icon buttons (top bar style)"}</p>
            <div className="row">
              <button
                aria-label="Favourite"
                type="button"
                className={
                  "icon-btn lg" +
                  ((pressed["Favourite"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["Favourite"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["Favourite"]: !(p["Favourite"] ?? false),
                  }));
                  notify("Favourite - demo action");
                }}
              >
                <svg>
                  <use href="#i-heart"></use>
                </svg>
              </button>
              <button
                aria-label="Share"
                type="button"
                className={
                  "icon-btn lg" +
                  ((pressed["Share"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["Share"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["Share"]: !(p["Share"] ?? false),
                  }));
                  notify("Share - demo action");
                }}
              >
                <svg>
                  <use href="#i-share"></use>
                </svg>
              </button>
              <button
                aria-label="Settings"
                type="button"
                className={
                  "icon-btn lg" +
                  ((pressed["Settings"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["Settings"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["Settings"]: !(p["Settings"] ?? false),
                  }));
                  notify("Settings - demo action");
                }}
              >
                <svg>
                  <use href="#i-gear"></use>
                </svg>
              </button>
              <button
                aria-label="More"
                type="button"
                className={
                  "icon-btn lg" +
                  ((pressed["More"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["More"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["More"]: !(p["More"] ?? false),
                  }));
                  notify("More - demo action");
                }}
              >
                <svg>
                  <use href="#i-kebab"></use>
                </svg>
              </button>
            </div>
            <p className="field-label">
              {"Round side actions (3D / 360\u00b0 / AR / fullscreen)"}
            </p>
            <div className="row">
              <button
                type="button"
                className={
                  "round-action" +
                  ((pressed["3D view"] ?? true) ? " is-active" : "")
                }
                aria-pressed={pressed["3D view"] ?? true}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["3D view"]: !(p["3D view"] ?? true),
                  }));
                  notify("3D view - demo action");
                }}
              >
                <svg>
                  <use href="#i-cube"></use>
                </svg>
                <span>{"3D"}</span>
              </button>
              <button
                type="button"
                className={
                  "round-action" +
                  ((pressed["360 spin"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["360 spin"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["360 spin"]: !(p["360 spin"] ?? false),
                  }));
                  notify("360 spin - demo action");
                }}
              >
                <svg>
                  <use href="#i-rotate"></use>
                </svg>
                <span>{"360\u00b0"}</span>
              </button>
              <button
                type="button"
                className={
                  "round-action" +
                  ((pressed["AR view"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["AR view"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["AR view"]: !(p["AR view"] ?? false),
                  }));
                  notify("AR view - demo action");
                }}
              >
                <svg>
                  <use href="#i-ar"></use>
                </svg>
                <span>{"AR"}</span>
              </button>
              <button
                type="button"
                className={
                  "round-action" +
                  ((pressed["Fullscreen"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["Fullscreen"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["Fullscreen"]: !(p["Fullscreen"] ?? false),
                  }));
                  notify("Fullscreen - demo action");
                }}
              >
                <svg>
                  <use href="#i-expand"></use>
                </svg>
                <span>{"Full"}</span>
              </button>
            </div>
          </div>
        </section>
        <section id="gallery-toolbars">
          <h2>{"03 - Bottom pill toolbars"}</h2>
          <div className="panel">
            <p className="field-label">{"Common dropdown toolbar"}</p>
            <div className="toolbar glass toolbar-static">
              <ConfiguratorToolbar {...toolbar} />
            </div>
            <p className="field-label">{"Chip tabs + thumbnail carousel"}</p>
            <ChipCarousel
              items={items}
              value={asset}
              onChange={setAsset}
              onHue={setGalleryHue}
            />
            <p className="field-label">{"Common icon pill"}</p>
            <div
              className="toolbar glass toolbar-static icon-pill"
              id="demoToolbarIcons"
            >
              <button
                aria-label="Model"
                type="button"
                className={
                  "tool-icon" + ((pressed["model"] ?? true) ? " is-active" : "")
                }
                aria-pressed={pressed["model"] ?? true}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["model"]: !(p["model"] ?? true),
                  }));
                  notify("model - demo action");
                }}
              >
                <svg>
                  <use href="#i-cube"></use>
                </svg>
              </button>
              <span className="tool-sep"></span>
              <button
                aria-label="Location"
                type="button"
                className={
                  "tool-icon" +
                  ((pressed["location"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["location"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["location"]: !(p["location"] ?? false),
                  }));
                  notify("location - demo action");
                }}
              >
                <svg>
                  <use href="#i-pin"></use>
                </svg>
              </button>
              <span className="tool-sep"></span>
              <button
                aria-label="Tune"
                type="button"
                className={
                  "tool-icon" + ((pressed["tune"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["tune"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["tune"]: !(p["tune"] ?? false),
                  }));
                  notify("tune - demo action");
                }}
              >
                <svg>
                  <use href="#i-sliders"></use>
                </svg>
              </button>
              <span className="tool-sep"></span>
              <button
                aria-label="Gallery"
                type="button"
                className={
                  "tool-icon" +
                  ((pressed["gallery"] ?? false) ? " is-active" : "")
                }
                aria-pressed={pressed["gallery"] ?? false}
                onClick={() => {
                  setPressed((p) => ({
                    ...p,
                    ["gallery"]: !(p["gallery"] ?? false),
                  }));
                  notify("gallery - demo action");
                }}
              >
                <svg>
                  <use href="#i-image"></use>
                </svg>
              </button>
            </div>
          </div>
        </section>
        <section id="gallery-nav">
          <h2>{"04 - Navigation"}</h2>
          <div className="panel">
            <p className="field-label">{"Top nav pills"}</p>
            <nav className="topnav topnav-static">
              <button
                type="button"
                className={
                  "topnav-link" +
                  (selected["nav"] === "Home" ? " is-active" : "")
                }
                aria-pressed={selected["nav"] === "Home"}
                onClick={() => setSelected((v) => ({ ...v, ["nav"]: "Home" }))}
              >
                {"Home"}
              </button>
              <button
                type="button"
                className={
                  "topnav-link" +
                  (selected["nav"] === "Collections" ? " is-active" : "")
                }
                aria-pressed={selected["nav"] === "Collections"}
                onClick={() =>
                  setSelected((v) => ({ ...v, ["nav"]: "Collections" }))
                }
              >
                {"Collections"}
              </button>
              <button
                type="button"
                className={
                  "topnav-link" +
                  (selected["nav"] === "Customize" ? " is-active" : "")
                }
                aria-pressed={selected["nav"] === "Customize"}
                onClick={() =>
                  setSelected((v) => ({ ...v, ["nav"]: "Customize" }))
                }
              >
                {"Customize"}
              </button>
              <button
                type="button"
                className={
                  "topnav-link" +
                  (selected["nav"] === "Support" ? " is-active" : "")
                }
                aria-pressed={selected["nav"] === "Support"}
                onClick={() =>
                  setSelected((v) => ({ ...v, ["nav"]: "Support" }))
                }
              >
                {"Support"}
              </button>
            </nav>
            <p className="field-label">{"Left icon rail"}</p>
            <nav className="rail rail-static glass">
              <button
                type="button"
                className={
                  "rail-item" +
                  (selected["rail"] === "Model" ? " is-active" : "")
                }
                aria-pressed={selected["rail"] === "Model"}
                onClick={() =>
                  setSelected((v) => ({ ...v, ["rail"]: "Model" }))
                }
              >
                <svg>
                  <use href="#i-cube"></use>
                </svg>
                <span>{"Model"}</span>
              </button>
              <button
                type="button"
                className={
                  "rail-item" +
                  (selected["rail"] === "Material" ? " is-active" : "")
                }
                aria-pressed={selected["rail"] === "Material"}
                onClick={() =>
                  setSelected((v) => ({ ...v, ["rail"]: "Material" }))
                }
              >
                <svg>
                  <use href="#i-layers"></use>
                </svg>
                <span>{"Material"}</span>
              </button>
              <button
                type="button"
                className={
                  "rail-item" +
                  (selected["rail"] === "Color" ? " is-active" : "")
                }
                aria-pressed={selected["rail"] === "Color"}
                onClick={() =>
                  setSelected((v) => ({ ...v, ["rail"]: "Color" }))
                }
              >
                <svg>
                  <use href="#i-palette"></use>
                </svg>
                <span>{"Color"}</span>
              </button>
              <button
                type="button"
                className={
                  "rail-item" +
                  (selected["rail"] === "Adjust" ? " is-active" : "")
                }
                aria-pressed={selected["rail"] === "Adjust"}
                onClick={() =>
                  setSelected((v) => ({ ...v, ["rail"]: "Adjust" }))
                }
              >
                <svg>
                  <use href="#i-sliders"></use>
                </svg>
                <span>{"Adjust"}</span>
              </button>
              <button
                type="button"
                className={
                  "rail-item" +
                  (selected["rail"] === "3D View" ? " is-active" : "")
                }
                aria-pressed={selected["rail"] === "3D View"}
                onClick={() =>
                  setSelected((v) => ({ ...v, ["rail"]: "3D View" }))
                }
              >
                <svg>
                  <use href="#i-cube"></use>
                </svg>
                <span>{"3D View"}</span>
              </button>
            </nav>
            <p className="field-label">{"Hotspot markers"}</p>
            <div className="row">
              <button
                className="hotspot hotspot-static"
                type="button"
                onClick={() => notify("Hotspot: surface detail")}
                aria-label="Hotspot detail demo"
              >
                <span></span>
              </button>
              <button
                className="hotspot hotspot-static"
                type="button"
                onClick={() => notify("Hotspot: finish detail")}
                aria-label="Hotspot detail demo"
              >
                <span></span>
              </button>
              <span className="label">
                {"Pulsing markers for product details - click one"}
              </span>
            </div>
          </div>
        </section>
        <section id="gallery-overlays">
          <h2>{"05 - Overlays, popovers & forms"}</h2>
          <div className="panel">
            <div className="row">
              <button
                className="btn btn-secondary"
                id="demoModalBtn"
                type="button"
                onClick={() => setOverlay("share")}
              >
                <svg>
                  <use href="#i-share"></use>
                </svg>
                <span>{"Open modal"}</span>
              </button>
              <button
                className="btn btn-secondary"
                id="demoPanelBtn"
                type="button"
                onClick={() => setOverlay("customize")}
              >
                <svg>
                  <use href="#i-wand"></use>
                </svg>
                <span>{"Open panel"}</span>
              </button>
              <button
                className="btn btn-secondary"
                id="demoToastBtn"
                type="button"
                onClick={() => notify("Saved - this is a demo toast")}
              >
                <svg>
                  <use href="#i-check"></use>
                </svg>
                <span>{"Show toast"}</span>
              </button>
            </div>
            <p className="field-label">{"Form controls"}</p>
            <div className="row">
              <Switch
                label="Notifications"
                checked={toggles["Notifications"]}
                onChange={(v) =>
                  setToggles((t) => ({ ...t, ["Notifications"]: v }))
                }
              />
              <Switch
                label="Watermark"
                checked={toggles["Watermark"]}
                onChange={(v) =>
                  setToggles((t) => ({ ...t, ["Watermark"]: v }))
                }
              />
            </div>
            <div className="row">
              <input
                type="range"
                className="slider"
                style={{ maxWidth: "220px" } as CSSProperties}
                aria-label="Demo slider"
                value={slider}
                onChange={(e) => setSlider(+e.target.value)}
              />
            </div>
          </div>
        </section>
        <footer className="kit-foot">
          <p>
            {
              "Built with React + TypeScript. One common interface for all VictorShell configurators."
            }
          </p>
        </footer>
        <details className="api-notes">
          <summary>React component API and source</summary>
          <p>
            Exact source: TRIK-30 attachment 10063, commit f357a6c. No later
            workspace extension.
          </p>
          <p>
            Import Button, IconButton, Dropdown, ConfiguratorToolbar,
            ChipCarousel, Switch, Range, SegmentedControl, Swatches or Dialog
            from src/index.ts. Controls receive values and callbacks; App holds
            the demo state.
          </p>
          <pre>
            {
              '<Button variant="primary" onClick={save}>Save</Button>\n<ChipCarousel items={items} value={selected} onChange={setSelected} onHue={setHue} />'
            }
          </pre>
        </details>
      </main>
      <div className="toasts" aria-live="polite">
        {message && <div className="toast">{message}</div>}
      </div>
    </>
  );
}
