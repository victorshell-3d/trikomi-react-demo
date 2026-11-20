import React from 'react';

export interface LandingCtaSectionProps {
  /** Section badge. Defaults to 'Get Started'. */
  badge?: string;
  /** Section heading title. */
  title: React.ReactNode;
  /** Compelling call to action description. */
  description: React.ReactNode;
  /** Mandatory Explore Demo callback. */
  onExploreDemo: () => void;
  /** Button text. Defaults to 'Explore Demo'. */
  exploreDemoLabel?: string;
  /** Optional secondary button action (e.g. technical docs). */
  secondaryCta?: {
    label: string;
    onClick?: () => void;
    href?: string;
    external?: boolean;
  };
  /** Optional direct link URL for the Explore Demo CTA. */
  exploreDemoHref?: string;
  /** Micro-copy / note below the buttons (e.g. 'No plugin required · Runs on WebGL2 / WebGPU'). */
  note?: string;
  /** Optional DOM element ID for anchor navigation (e.g. 'cta'). */
  id?: string;
  /** Additional CSS class names. */
  className?: string;
}

export const LandingCtaSection: React.FC<LandingCtaSectionProps> = ({
  badge = 'Interactive 3D Demo',
  title,
  description,
  onExploreDemo,
  exploreDemoLabel = 'Explore Demo',
  exploreDemoHref,
  secondaryCta,
  note = 'Zero downloads required · Runs instantly in modern web browsers',
  id,
  className = ''
}) => {
  return (
    <section
      id={id}
      className={`vs-landing-cta-section ${className}`.trim()}
      data-testid="landing-cta-section"
    >
      <div className="vs-landing-cta-section__container">
        <div className="vs-landing-cta-card">
          {/* Ambient Glows */}
          <div className="vs-landing-cta-card__glow" aria-hidden="true" />

          <div className="vs-landing-cta-card__content">
            {badge && (
              <span className="vs-landing-cta-card__badge" data-testid="cta-badge">
                <span className="vs-landing-cta-card__badge-dot" aria-hidden="true" />
                {badge}
              </span>
            )}

            <h2 className="vs-landing-cta-card__title" data-testid="cta-title">
              {title}
            </h2>

            <div className="vs-landing-cta-card__desc">
              {typeof description === 'string' ? <p>{description}</p> : description}
            </div>

            <div className="vs-landing-cta-card__actions">
              {exploreDemoHref ? (
                <a
                  href={exploreDemoHref}
                  onClick={() => {
                    if (onExploreDemo) {
                      onExploreDemo();
                    }
                  }}
                  className="vs-landing-cta-card__primary-btn vs-btn-primary"
                  data-testid="cta-explore-demo-btn"
                >
                  <span className="vs-landing-cta-card__btn-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                  <span>{exploreDemoLabel}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onExploreDemo}
                  className="vs-landing-cta-card__primary-btn vs-btn-primary"
                  data-testid="cta-explore-demo-btn"
                >
                  <span className="vs-landing-cta-card__btn-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                  <span>{exploreDemoLabel}</span>
                </button>
              )}

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
                  className="vs-landing-cta-card__secondary-btn"
                >
                  <span>{secondaryCta.label}</span>
                  {secondaryCta.external && (
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  )}
                </a>
              )}
            </div>

            {note && (
              <p className="vs-landing-cta-card__note">
                <span className="vs-landing-cta-card__note-icon" aria-hidden="true">⚡</span>
                {note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
