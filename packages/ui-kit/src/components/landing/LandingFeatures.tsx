import React from 'react';

export interface FeatureItem {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  description: React.ReactNode;
  badge?: string;
  highlight?: boolean;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    external?: boolean;
  };
}

export interface LandingFeaturesProps {
  /** Optional section header badge (e.g. 'Core Technology'). */
  badge?: string;
  /** Section title. */
  sectionTitle?: string;
  /** Optional section subtitle or category label. */
  sectionSubtitle?: string;
  /** Optional descriptive paragraph below header. */
  sectionDescription?: string;
  /** Array of feature items to display. */
  features: FeatureItem[];
  /** Grid column layout. Defaults to 3. */
  columns?: 2 | 3 | 4;
  /** Card presentation style: 'grid' or 'bento' (highlighting key cards). Defaults to 'grid'. */
  layout?: 'grid' | 'bento';
  /** Optional DOM element ID for anchor navigation (e.g. 'features'). */
  id?: string;
  /** Additional CSS class names. */
  className?: string;
}

export const LandingFeatures: React.FC<LandingFeaturesProps> = ({
  badge,
  sectionTitle = 'Key Features & Capabilities',
  sectionSubtitle,
  sectionDescription,
  features = [],
  columns = 3,
  layout = 'grid',
  id,
  className = ''
}) => {
  return (
    <section
      id={id}
      className={`vs-landing-features vs-landing-features--${layout} vs-landing-features--cols-${columns} ${className}`.trim()}
      data-testid="landing-features"
    >
      <div className="vs-landing-features__container">
        {/* Section Header */}
        {(badge || sectionTitle || sectionSubtitle || sectionDescription) && (
          <div className="vs-landing-features__header">
            {badge && (
              <span className="vs-landing-features__badge" data-testid="features-badge">
                {badge}
              </span>
            )}
            {sectionSubtitle && (
              <p className="vs-landing-features__subtitle">{sectionSubtitle}</p>
            )}
            {sectionTitle && (
              <h2 className="vs-landing-features__title" data-testid="features-title">
                {sectionTitle}
              </h2>
            )}
            {sectionDescription && (
              <p className="vs-landing-features__desc">{sectionDescription}</p>
            )}
          </div>
        )}

        {/* Feature Cards Grid */}
        <div className="vs-landing-features__grid" data-testid="features-grid">
          {features.map((item, idx) => {
            const itemKey = item.id || `${item.title}-${idx}`;
            const isHighlighted = Boolean(item.highlight);

            return (
              <div
                key={itemKey}
                className={`vs-feature-card ${isHighlighted ? 'vs-feature-card--highlight' : ''}`}
                data-testid={`feature-card-${idx}`}
              >
                <div className="vs-feature-card__glow" aria-hidden="true" />
                <div className="vs-feature-card__inner">
                  {/* Card Header (Icon & Badge) */}
                  <div className="vs-feature-card__top">
                    {item.icon ? (
                      <div className="vs-feature-card__icon" aria-hidden="true">
                        {item.icon}
                      </div>
                    ) : (
                      <div className="vs-feature-card__icon vs-feature-card__icon--default" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    {item.badge && (
                      <span className="vs-feature-card__badge">{item.badge}</span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="vs-feature-card__title">{item.title}</h3>
                  <div className="vs-feature-card__desc">
                    {typeof item.description === 'string' ? (
                      <p>{item.description}</p>
                    ) : (
                      item.description
                    )}
                  </div>

                  {/* Optional Card Action */}
                  {item.action && (
                    <div className="vs-feature-card__action">
                      <a
                        href={item.action.href || '#'}
                        onClick={(e) => {
                          if (item.action?.onClick) {
                            e.preventDefault();
                            item.action.onClick();
                          }
                        }}
                        target={item.action.external ? '_blank' : undefined}
                        rel={item.action.external ? 'noopener noreferrer' : undefined}
                        className="vs-feature-card__action-link"
                      >
                        <span>{item.action.label}</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
