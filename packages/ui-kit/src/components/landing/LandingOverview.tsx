import React from 'react';

export interface OverviewHighlight {
  title?: string;
  text: string;
  icon?: React.ReactNode;
}

export interface LandingOverviewProps {
  /** Optional section badge (e.g. 'Product Overview', 'Deep Dive'). */
  badge?: string;
  /** Section heading title. */
  title: React.ReactNode;
  /** Optional section subtitle. */
  subtitle?: string;
  /** Detailed product description content. */
  description: React.ReactNode;
  /** Bullet highlights with optional custom icons. */
  highlights?: OverviewHighlight[];
  /** Visual slot (product screenshot, interactive preview, architecture diagram). */
  visual?: React.ReactNode;
  /** Whether to place the visual on the left. Defaults to false (right). */
  reversed?: boolean;
  /** Optional CTA action within the overview block. */
  cta?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  /** Optional DOM element ID for anchor navigation (e.g. 'overview'). */
  id?: string;
  /** Additional CSS class names. */
  className?: string;
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({
  badge,
  title,
  subtitle,
  description,
  highlights,
  visual,
  reversed = false,
  cta,
  id,
  className = ''
}) => {
  return (
    <section
      id={id}
      className={`vs-landing-overview ${reversed ? 'vs-landing-overview--reversed' : ''} ${className}`.trim()}
      data-testid="landing-overview"
    >
      <div className="vs-landing-overview__container">
        {/* Text Content */}
        <div className="vs-landing-overview__content">
          {badge && (
            <span className="vs-landing-overview__badge" data-testid="overview-badge">
              {badge}
            </span>
          )}

          {subtitle && (
            <p className="vs-landing-overview__subtitle">{subtitle}</p>
          )}

          <h2 className="vs-landing-overview__title" data-testid="overview-title">
            {title}
          </h2>

          <div className="vs-landing-overview__description">
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>

          {highlights && highlights.length > 0 && (
            <div className="vs-landing-overview__highlights" data-testid="overview-highlights">
              {highlights.map((item, idx) => (
                <div key={idx} className="vs-overview-highlight">
                  <div className="vs-overview-highlight__icon" aria-hidden="true">
                    {item.icon || (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="vs-overview-highlight__text">
                    {item.title && <strong>{item.title}: </strong>}
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cta && (
            <div className="vs-landing-overview__cta-wrap">
              <a
                href={cta.href || '#'}
                onClick={(e) => {
                  if (cta.onClick) {
                    e.preventDefault();
                    cta.onClick();
                  }
                }}
                className="vs-landing-overview__cta vs-btn-primary"
              >
                <span>{cta.label}</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Visual Slot */}
        {visual && (
          <div className="vs-landing-overview__visual" data-testid="overview-visual">
            <div className="vs-landing-overview__visual-frame">
              {visual}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
