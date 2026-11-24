import React from 'react';

export interface HeroStat {
  label: string;
  value: string;
  hint?: string;
}

export interface HeroCtaAction {
  label: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}

export interface LandingHeroProps {
  /** Main hero title for this specific product. */
  title: React.ReactNode;
  /** Optional subtitle or category lead (e.g. 'Parametric Packaging Studio'). */
  subtitle?: string;
  /** Optional pill badge text (e.g. 'WebGPU Accelerated', 'MediaPipe AR'). */
  badge?: string;
  /** Product introduction paragraph. */
  description: React.ReactNode;
  /** Primary Explore Demo callback. */
  onExploreDemo: () => void;
  /** Primary Explore Demo button label. Defaults to 'Explore Demo'. */
  exploreDemoLabel?: string;
  /** Optional secondary action (e.g. documentation, technical specs). */
  secondaryCta?: HeroCtaAction;
  /** Product-specific visual slot (image, 3D render, interactive mockup, screenshot). */
  visual?: React.ReactNode;
  /** Position of the visual relative to text. Defaults to 'right'. */
  visualPosition?: 'right' | 'left' | 'bottom';
  /** Optional key metrics or quick stats to display below CTAs. */
  stats?: HeroStat[];
  /** Content alignment. Defaults to 'left'. */
  align?: 'left' | 'center';
  /** Optional DOM element ID for anchor navigation (e.g. 'hero'). */
  id?: string;
  /** Additional CSS class names. */
  className?: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  title,
  subtitle,
  badge,
  description,
  onExploreDemo,
  exploreDemoLabel = 'Explore Demo',
  secondaryCta,
  visual,
  visualPosition = 'right',
  stats,
  align = 'left',
  id,
  className = ''
}) => {
  const isCentered = align === 'center' || visualPosition === 'bottom';

  return (
    <section
      id={id}
      className={`vs-landing-hero vs-landing-hero--visual-${visualPosition} vs-landing-hero--align-${align} ${className}`.trim()}
      data-testid="landing-hero"
    >
      <div className="vs-landing-hero__container">
        {/* Text Content Column */}
        <div className="vs-landing-hero__content">
          {badge && (
            <div className="vs-landing-hero__badge-wrap">
              <span className="vs-landing-hero__badge" data-testid="hero-badge">
                <span className="vs-landing-hero__badge-dot" aria-hidden="true" />
                {badge}
              </span>
            </div>
          )}

          {subtitle && (
            <p className="vs-landing-hero__subtitle" data-testid="hero-subtitle">
              {subtitle}
            </p>
          )}

          <h1 className="vs-landing-hero__title" data-testid="hero-title">
            {title}
          </h1>

          <div className="vs-landing-hero__description" data-testid="hero-description">
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>

          {/* CTA Actions Group */}
          <div className={`vs-landing-hero__actions ${isCentered ? 'vs-landing-hero__actions--center' : ''}`}>
            <button
              type="button"
              onClick={onExploreDemo}
              className="vs-landing-hero__primary-cta vs-btn-primary"
              data-testid="hero-explore-demo-btn"
            >
              <span className="vs-landing-hero__cta-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </span>
              <span>{exploreDemoLabel}</span>
            </button>

            {secondaryCta && (
              <a
                href={secondaryCta.href || '#'}
                onClick={(e) => {
                  if (secondaryCta.onClick) {
                    e.preventDefault();
                    secondaryCta.onClick();
                  }
                }}
                target={secondaryCta.external ? '_blank' : undefined}
                rel={secondaryCta.external ? 'noopener noreferrer' : undefined}
                className="vs-landing-hero__secondary-cta"
                data-testid="hero-secondary-cta"
              >
                <span>{secondaryCta.label}</span>
                {secondaryCta.external ? (
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </a>
            )}
          </div>

          {/* Quick Stats / Highlights Bar */}
          {stats && stats.length > 0 && (
            <div className="vs-landing-hero__stats" data-testid="hero-stats">
              {stats.map((stat, idx) => (
                <div key={stat.label || idx} className="vs-landing-hero__stat-item">
                  <span className="vs-landing-hero__stat-val">{stat.value}</span>
                  <span className="vs-landing-hero__stat-label">{stat.label}</span>
                  {stat.hint && <span className="vs-landing-hero__stat-hint">{stat.hint}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Visual Column */}
        {visual && (
          <div className="vs-landing-hero__visual" data-testid="hero-visual">
            <div className="vs-landing-hero__visual-frame">
              <div className="vs-landing-hero__visual-glow" aria-hidden="true" />
              <div className="vs-landing-hero__visual-inner">
                {visual}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
