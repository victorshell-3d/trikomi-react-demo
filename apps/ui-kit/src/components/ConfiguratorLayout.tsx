import { type ReactNode, type InputHTMLAttributes } from "react";
import { Button, Icon, IconButton, Range, SegmentedControl } from "./controls";

/** SDK-free presentation primitives. Consumers own data, state and callbacks. */
export function BrandHeader({ product, actions }: { product: string; actions: ReactNode }) {
  return <header className="cfg-header topbar glass"><div className="brand"><svg className="brand-mark" aria-hidden="true"><use href="#i-logo" /></svg><span className="brand-name">VictorShell<sup>®</sup></span><span className="brand-sep"/><span className="brand-product">{product}</span></div><div className="cfg-file-actions">{actions}</div></header>;
}
export function FileInput(props: InputHTMLAttributes<HTMLInputElement> & { inputRef: React.Ref<HTMLInputElement> }) {
  const { inputRef, ...rest } = props;
  return <input {...rest} type="file" ref={inputRef} className="cfg-file-input" />;
}
export function Badge({ children }: { children: ReactNode }) { return <span className="chip">{children}</span>; }
export function PanelHeading({ eyebrow, title, count }: { eyebrow: string; title: string; count: number }) {
  return <header className="cfg-panel-heading"><div><p className="cfg-eyebrow">{eyebrow}</p><h2>{title}</h2></div><Badge>{count}</Badge></header>;
}
export function ResponsivePanel({ side, open, label, children, empty = false }: { side: "left" | "right"; open: boolean; label: string; children: ReactNode; empty?: boolean }) {
  return <aside className={`${side === "left" ? "cfg-materials" : "cfg-shapes"} ${empty ? "cfg-shape-empty" : ""} glass ${open ? "mobile-open" : ""}`} aria-label={label}>{children}</aside>;
}
export function MobilePanelControls({ options, value, open, label, onSelect, onToggle }: { options: string[]; value: string; open: boolean; label: string; onSelect: (value: string) => void; onToggle: () => void }) {
  return <div className="cfg-mobile-controls glass"><SegmentedControl label={label} options={options} value={value} onChange={onSelect}/><IconButton icon={open ? "close" : "sliders"} label={open ? "Hide controls" : "Show controls"} aria-expanded={open} onClick={onToggle}/></div>;
}
export function ScrollList({ children }: { children: ReactNode }) { return <div className="cfg-material-list">{children}</div>; }
export function ColorField({ value, label, onChange }: { value: string; label: string; onChange: (value: string) => void }) {
  return <input type="color" value={value} aria-label={label} onChange={e => onChange(e.target.value)}/>;
}
export function SelectableColorRow({ selected, label, title, detail, icon, color, colorLabel, onSelect, onColor }: { selected: boolean; label: string; title: string; detail: string; icon: string; color: string; colorLabel: string; onSelect: () => void; onColor: (value: string) => void }) {
  return <div className={`cfg-material ${selected ? "is-selected" : ""}`}><button type="button" className="cfg-material-select" aria-pressed={selected} aria-label={label} onClick={onSelect}><Icon name={icon}/><span>{title}</span><small>{detail}</small></button><ColorField value={color} label={colorLabel} onChange={onColor}/></div>;
}
export function AdjustmentGroup({ title, children }: { title: string; children: ReactNode }) {
  return <section className="cfg-fine-tune" aria-label={title}><div className="cfg-adjust-heading"><Icon name="sliders"/><h3>{title}</h3></div>{children}</section>;
}
export function ValueRange({ value, unit = "", ...rest }: Parameters<typeof Range>[0] & { unit?: string }) {
  return <div className="cfg-range"><span>{value}{unit}</span><Range {...rest} value={value}/></div>;
}
export type ImageChoice = { id: string; label: string; image: string; accessibleLabel?: string };
export function ThumbnailGrid({ items, value, onChange }: { items: ImageChoice[]; value?: string; onChange: (id: string) => void }) {
  return <div className="cfg-shape-list">{items.map(item => <button type="button" className={`cfg-shape ${value === item.id ? "is-active" : ""}`} aria-label={item.accessibleLabel || item.label} aria-pressed={value === item.id} key={item.id} onClick={() => onChange(item.id)}><img src={item.image} alt=""/><span>{item.label}</span></button>)}</div>;
}
export function EmptyPanel({ title, description, action, onAction }: { title: string; description: string; action: string; onAction: () => void }) {
  return <><Icon name="gem"/><h2>{title}</h2><p>{description}</p><Button onClick={onAction}>{action}</Button></>;
}
export function ModelPicker({ items, value, loading, label, previousLabel, nextLabel, onChange, onPrevious, onNext }: { items: ImageChoice[]; value: string; loading: boolean; label: string; previousLabel: string; nextLabel: string; onChange: (id: string) => void; onPrevious: () => void; onNext: () => void }) {
  return <nav className="cfg-models toolbar glass" aria-label={label}><IconButton icon="chev-l" label={previousLabel} onClick={onPrevious}/>{items.map(item => <button className={`cfg-model ${value === item.id ? "is-active" : ""}`} type="button" aria-pressed={value === item.id} disabled={loading && value !== item.id} key={item.id} onClick={() => onChange(item.id)}><img src={item.image} alt=""/><span>{item.label}</span></button>)}<IconButton icon="chev-r" label={nextLabel} onClick={onNext}/></nav>;
}
export function LoadingOverlay({ text, image }: { text: string; image: string }) {
  return <div className="cfg-loading" role="status"><img src={image} width={60} alt="Loading..."/><div>{text}</div></div>;
}
