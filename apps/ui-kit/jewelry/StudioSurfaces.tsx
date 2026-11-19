import type { HTMLAttributes, Ref } from "react";

export function StudioToolbar({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="group" className={`kit-studio-toolbar ${className}`} {...props} />;
}
export function StudioPanel({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <aside className={`kit-studio-panel ${className}`} {...props} />;
}
export function StudioCartSurface({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`kit-cart-surface ${className}`} {...props} />;
}
export function StudioBackdrop() {
  return <div className="kit-studio-backdrop aurora-stage" aria-hidden="true"><i className="aurora-arch arch-one"/><i className="aurora-arch arch-two"/><i className="aurora-arch arch-three"/><i className="aurora-plinth"/>{Array.from({length:12},(_,i)=><i className="aurora-spark" key={i} style={{left:(7+i*19%88)+"%",top:(12+i*13%58)+"%",animationDelay:(i*.63)+"s"}}/>)}</div>;
}

export function StudioStepNav({className = "", ref, ...props}: HTMLAttributes<HTMLElement> & {ref?:Ref<HTMLElement>}) { return <nav ref={ref} className={`kit-studio-steps ${className}`} {...props} />; }
