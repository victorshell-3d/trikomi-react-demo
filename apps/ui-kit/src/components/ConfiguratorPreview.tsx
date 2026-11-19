import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Button,
  Dialog,
  Icon,
  IconButton,
  Range,
  SegmentedControl,
  Swatches,
  Switch,
} from "./controls";
const hues: Record<string, number> = {
  Violet: 272,
  Magenta: 288,
  Gold: 43,
  Rose: 350,
  Emerald: 160,
  Blue: 215,
};
const searchItems = [
  ["Colour tokens", "#gallery-tokens"], ["Glow & elevation", "#gallery-tokens"], ["Radius scale", "#gallery-tokens"], ["Type scale", "#gallery-tokens"],
  ["Primary button", "#gallery-buttons"], ["Secondary button", "#gallery-buttons"], ["Ghost button", "#gallery-buttons"], ["Icon buttons", "#gallery-buttons"], ["Round 3D / 360 / AR actions", "#gallery-buttons"],
  ["Dropdown toolbar", "#gallery-toolbars"], ["Chip tabs", "#gallery-toolbars"], ["Thumbnail carousel", "#gallery-toolbars"], ["Icon pill", "#gallery-toolbars"],
  ["Top nav pills", "#gallery-nav"], ["Left icon rail", "#gallery-nav"], ["Hotspot markers", "#gallery-nav"],
  ["Modal", "#gallery-overlays"], ["Slide-in panel", "#gallery-overlays"], ["Toast", "#gallery-overlays"], ["Toggle switch", "#gallery-overlays"], ["Slider", "#gallery-overlays"]
];
const colors = [
  "#a855f7",
  "#b629d5",
  "#edbc25",
  "#e84762",
  "#22ad7c",
  "#3c81ed",
];
export function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div
      className="tool-drop"
      ref={ref}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="tool-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label === "Color" ? (
          <i className="tool-dot" />
        ) : (
          <Icon name={label === "Material" ? "layers" : "sun"} />
        )}
        <span>{label}</span>
        <Icon name="chev-d" className="i-chev" />
      </button>
      {open && (
        <div className={label === "Color" ? "drop menu-swatches" : "drop"}>
          {options.map((option) => (
            <button
              type="button"
              className={
                label === "Color"
                  ? `swatch-dot ${value === option ? "is-active" : ""}`
                  : `menu-item ${value === option ? "is-selected" : ""}`
              }
              aria-label={option}
              style={
                label === "Color"
                  ? ({
                      "--dot": `hsl(${hues[option]} 85% 60%)`,
                    } as CSSProperties)
                  : undefined
              }
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              {label !== "Color" && (
                <>
                  <Icon name="check" />
                  {option}
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function ConfiguratorToolbar({
  color,
  material,
  lighting,
  onColor,
  onMaterial,
  onLighting,
  onCustomize,
}: {
  color: string;
  material: string;
  lighting: string;
  onColor: (v: string) => void;
  onMaterial: (v: string) => void;
  onLighting: (v: string) => void;
  onCustomize: () => void;
}) {
  return (
    <>
      <Dropdown
        label="Color"
        options={Object.keys(hues)}
        value={color}
        onChange={onColor}
      />
      <span className="tool-sep" />
      <Dropdown
        label="Material"
        options={["Metallic", "Matte", "Glass", "Satin"]}
        value={material}
        onChange={onMaterial}
      />
      <span className="tool-sep" />
      <Dropdown
        label="Lighting"
        options={["Studio", "Neon", "Soft", "Dramatic"]}
        value={lighting}
        onChange={onLighting}
      />
      <Button variant="primary" className="toolbar-customize" onClick={onCustomize}>
        <Icon name="wand" />
        Customize
      </Button>
    </>
  );
}
export function ConfiguratorPreview({
  onToast,
  state,
  externalOverlay,
  onExternalClose,
}: {
  state: {
    hue: number;
    color: string;
    material: string;
    lighting: string;
    setColor: (v: string) => void;
    setMaterial: (v: string) => void;
    setLighting: (v: string) => void;
  };
  externalOverlay?: "customize" | "share" | null;
  onExternalClose?: () => void;
  onToast: (message: string) => void;
}) {
  const { hue, color, material, lighting, setColor, setMaterial, setLighting } =
    state;
  const [spin, setSpin] = useState(false);
  const [activeSection, setActiveSection] = useState("#gallery-tokens");
  const [hotspots, setHotspots] = useState(true);
  const [glow, setGlow] = useState(55);
  const [favorite, setFavorite] = useState(false);
  const [rail, setRail] = useState("Model");
  const [overlay, setOverlay] = useState<
    "customize" | "share" | "search" | null
  >(null);
  useEffect(() => {
    if (externalOverlay) setOverlay(externalOverlay);
  }, [externalOverlay]);
  const closeOverlay = () => {
    setOverlay(null);
    onExternalClose?.();
  };
  const [tab, setTab] = useState("Color");
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(false);
  const [hotspot, setHotspot] = useState("");
  const stage = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const sections = [
    ["Tokens", "#gallery-tokens"],
    ["Components", "#gallery-buttons"],
    ["Toolbars", "#gallery-toolbars"],
    ["Overlays", "#gallery-overlays"],
  ];
  useEffect(() => {
    const changed = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", changed);
    return () => document.removeEventListener("fullscreenchange", changed);
  }, []);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setHotspot("");
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const controls = {
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
      <div
        ref={stage}
        className="stage react-stage"
        data-material={material.toLowerCase()}
        data-lighting={lighting.toLowerCase()}
        style={{ "--h": hue } as CSSProperties}
      >
        <div className="stage-arcs" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="stage-floor" aria-hidden="true" />
        <header className="topbar glass">
          <button
            type="button"
            className="brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <svg className="brand-mark" aria-hidden="true">
              <use href="#i-logo" />
            </svg>
            <span className="brand-name">
              VictorShell<sup>®</sup>
            </span>
            <span className="brand-sep" />
            <span className="brand-product">Common Configurator</span>
          </button>
          <nav className="topnav" aria-label="Kit sections">
            {sections.map(([label, href]) => (
              <a key={href} className={`topnav-link ${activeSection === href ? "is-active" : ""}`} href={href} onClick={() => setActiveSection(href)}>
                {label}
              </a>
            ))}
          </nav>
          <div className="topbar-actions">
            <IconButton
              icon="search"
              id="searchBtn"
              label="Search components"
              onClick={() => setOverlay("search")}
            />
            <IconButton
              icon="heart"
              label="Save to favourites"
              aria-pressed={favorite}
              className={`icon-btn ${favorite ? "is-active" : ""}`}
              onClick={() => {
                setFavorite((v) => !v);
                onToast(
                  favorite ? "Removed from favourites" : "Added to favourites",
                );
              }}
            />
            <IconButton
              icon="share"
              label="Share"
              onClick={() => setOverlay("share")}
            />
            <IconButton
              icon="kebab"
              label="More options"
              aria-expanded={menu}
              onClick={() => setMenu((v) => !v)}
            />
            <Button
              aria-label="Export demo"
              variant="primary"
              onClick={() =>
                onToast(
                  "Demo only: export is not connected. No file generated.",
                )
              }
            >
              <Icon name="download" />
              <span>Export</span>
            </Button>
          </div>
          {menu && (
            <div className="drop menu topbar-menu">
              {[ ["Duplicate project", "copy"], ["Rename", "wand"] ].map(([label, icon]) => <button type="button" className="menu-item" key={label} onClick={() => { setMenu(false); onToast(`${label} - demo action`); }}><Icon name={icon} />{label}</button>)}
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  setOverlay("customize");
                  setMenu(false);
                }}
              >
                Settings
              </button>
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  setColor("Violet");
                  setMaterial("Metallic");
                  setLighting("Neon");
                  setMenu(false);
                  onToast("Preview reset");
                }}
              >
                Reset preview
              </button>
            </div>
          )}
        </header>
        <nav className="rail glass" aria-label="Configurator sections">
          {[
            ["Model", "cube"],
            ["Material", "layers"],
            ["Color", "palette"],
            ["Adjust", "sliders"],
            ["View", "cube"],
          ].map(([label, icon]) => (
            <button
              type="button"
              className={`rail-item ${rail === label ? "is-active" : ""}`}
              key={label}
              aria-pressed={rail === label}
              onClick={() => {
                setRail(label);
                if (["Material", "Color", "Adjust"].includes(label)) {
                  setTab(label === "Material" ? "Material" : "Color");
                  setOverlay("customize");
                } else onToast(`${label} section selected`);
              }}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="obj-wrap" aria-hidden="true">
          <div
            className={`obj ${spin ? "spinning" : ""}`}
            style={{ "--glow-k": glow } as CSSProperties}
          >
            <i className="obj-core" />
            <i className="obj-ring" />
            <i className="obj-shine" />
          </div>
          <div className="podium" />
        </div>
        {hotspots &&
          [
            ["Front face", "31%", "38%"],
            ["Finish detail", "66%", "55%"],
          ].map(([name, x, y]) => (
            <button
              type="button"
              key={name}
              aria-label={`${name} hotspot`}
              className="hotspot"
              style={{ "--hx": x, "--hy": y } as CSSProperties}
              onClick={() => setHotspot(hotspot === name ? "" : name)}
            >
              <span />
            </button>
          ))}
        {hotspot && (
          <div className="hotspot-card glass">
            <b>{hotspot}</b>
            <p>Surface color and material follow the shared controls.</p>
            <button type="button" onClick={() => setHotspot("")}>
              Close detail
            </button>
          </div>
        )}
        <div className="side-actions">
          {[
            ["3D", "cube"],
            ["360°", "rotate"],
            ["AR", "ar"],
            ["Full", "expand"],
          ].map(([label, icon]) => (
            <button
              type="button"
              className={`round-action ${(label === "3D" && !spin) || (label === "360°" && spin) || (label === "Full" && fullscreen) ? "is-active" : ""}`}
              key={label}
              aria-pressed={
                label === "360°"
                  ? spin
                  : label === "Full"
                    ? fullscreen
                    : undefined
              }
              onClick={() => {
                if (label === "360°") setSpin((v) => !v);
                else if (label === "Full") {
                  if (document.fullscreenElement)
                    void document.exitFullscreen();
                  else
                    void stage.current
                      ?.requestFullscreen()
                      .catch(() => onToast("Fullscreen unavailable"));
                } else
                  onToast(
                    label === "AR"
                      ? "Demo only: AR is not connected. No camera requested."
                      : "Schematic 3D view selected",
                  );
              }}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="toolbar glass">
          <ConfiguratorToolbar {...controls} />
        </div>
      </div>
      <Dialog
        open={overlay === "customize"}
        title="Customize"
        drawer
        onClose={closeOverlay}
      >
        <SegmentedControl
          label="Customize tabs"
          options={["Color", "Material", "Lighting"]}
          value={tab}
          onChange={setTab}
        />
        <div className="drawer-body">
          {tab === "Color" ? (
            <>
              <Swatches
                label="Object color"
                colors={colors}
                value={colors[Object.keys(hues).indexOf(color)]}
                onChange={(v) => setColor(Object.keys(hues)[colors.indexOf(v)])}
              />
              <Range label="Glow intensity" value={glow} onChange={setGlow} />
            </>
          ) : tab === "Material" ? (
            <div className="opt-list" role="group" aria-label="Material finish">
              {["Metallic", "Matte", "Glass", "Satin"].map((v) => (
                <button
                  type="button"
                  className={`opt-row ${material === v ? "is-active" : ""}`}
                  aria-pressed={material === v}
                  key={v}
                  onClick={() => setMaterial(v)}
                >
                  <i className={`opt-chip ${v.toLowerCase()}`} />
                  {v}
                  <Icon name="check" className="opt-check" />
                </button>
              ))}
            </div>
          ) : (
            <>
              <div
                className="opt-list"
                role="group"
                aria-label="Scene lighting"
              >
                {["Studio", "Neon", "Soft", "Dramatic"].map((v) => (
                  <button
                    type="button"
                    className={`opt-row ${lighting === v ? "is-active" : ""}`}
                    aria-pressed={lighting === v}
                    key={v}
                    onClick={() => setLighting(v)}
                  >
                    <i className={`opt-chip l-${v.toLowerCase()}`} />
                    {v}
                    <Icon name="check" className="opt-check" />
                  </button>
                ))}
              </div>
              <Switch
                label="Auto-rotate object"
                checked={spin}
                onChange={setSpin}
              />
              <Switch
                label="Show hotspots"
                checked={hotspots}
                onChange={setHotspots}
              />
            </>
          )}
        </div>
        <footer className="drawer-foot">
          <Button
            className="drawer-action"
            variant="ghost"
            onClick={() => {
              setColor("Violet");
              setMaterial("Metallic");
              setLighting("Neon");
              setGlow(55);
              setSpin(false);
              setHotspots(true);
            }}
          >
            Reset
          </Button>
          <Button
            className="drawer-action"
            variant="primary"
            onClick={() => {
              closeOverlay();
              onToast("Demo design saved for this page session");
            }}
          >
            Save design
          </Button>
        </footer>
      </Dialog>
      <Dialog
        open={overlay === "share"}
        title="Share this kit"
        onClose={closeOverlay}
      >
        <p className="modal-sub">Anyone with the link can view this preview.</p>
        <div className="copy-row">
          <input
            aria-label="Preview link"
            readOnly
            value={window.location.href}
          />
          <Button
            variant="primary"
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href).then(
                () => onToast("Link copied"),
                () => onToast("Copy unavailable. Select the link manually."),
              );
            }}
          >
            Copy
          </Button>
        </div>
        <div className="share-apps">
          {["WhatsApp", "Email", "Teams"].map((app) => (
            <IconButton
              icon={app === "Email" ? "image" : app === "Teams" ? "user" : "share"}
              label={`Share on ${app} (demo)`}
              className="icon-btn lg"
              key={app}
              onClick={() =>
                onToast(`Demo only: ${app} sharing is not connected`)
              }
            />
          ))}
        </div>
      </Dialog>
      <Dialog
        open={overlay === "search"}
        title="Search kit components"
        onClose={closeOverlay}
      >
        <input
          className="search-react-input"
          aria-label="Search kit components"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tokens, components, toolbars…"
        />
        <div className="search-results">
          {searchItems
            .filter(([label]) =>
              label.toLowerCase().includes(search.toLowerCase()),
            )
            .map(([label, href]) => (
              <a
                className="search-item"
                href={href}
                key={label}
                onClick={() => setOverlay(null)}
              >
                {label}
              </a>
            ))}
          {!searchItems.some(([label]) =>
            label.toLowerCase().includes(search.toLowerCase()),
          ) && <p className="search-empty">No matching component</p>}
        </div>
      </Dialog>
    </>
  );
}
