import React from 'react';

export interface BenefitItem {
  id?: string;
  title: string;
  description: React.ReactNode;
  metric?: string;
  metricLabel?: string;
  icon?: React.ReactNode;
  tag?: string;
}

export interface LandingBenefitsProps {
  /** Optional section badge (e.g. 'Enterprise Value', 'Target Use Cases'). */
  badge?: string;
  /** Section heading title. */
  sectionTitle: string;
  /** Optional section subtitle. */
  sectionSubtitle?: string;
  /** Optional descriptive paragraph. */
  sectionDescription?: string;
  /** Array of benefits or use case items. */
  items: BenefitItem[];
  /** Layout style: 'cards' (focus on use cases) or 'metrics' (focus on quantifiable benchmarks). Defaults to 'cards'. */
  variant?: 'cards' | 'metrics';
  /** Optional DOM element ID for anchor navigation (e.g. 'benefits'). */
  id?: string;
  /** Additional CSS class names. */
  className?: string;
}

export const LandingBenefits: React.FC<LandingBenefitsProps> = ({
  badge,
  sectionTitle,
  sectionSubtitle,
  sectionDescription,
  items = [],
  variant = 'cards',
  id,
  className = ''
}) => {
  return (
    <section
      id={id}
      className={`vs-landing-benefits vs-landing-benefits--${variant} ${className}`.trim()}
      data-testid="landing-benefits"
    >
      <div className="vs-landing-benefits__container">
        {/* Header */}
        <div className="vs-landing-benefits__header">
          {badge && (
            <span className="vs-landing-benefits__badge" data-testid="benefits-badge">
              {badge}
            </span>
          )}
          {sectionSubtitle && (
            <p className="vs-landing-benefits__subtitle">{sectionSubtitle}</p>
          )}
          <h2 className="vs-landing-benefits__title" data-testid="benefits-title">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="vs-landing-benefits__desc">{sectionDescription}</p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="vs-landing-benefits__grid" data-testid="benefits-grid">
          {items.map((item, idx) => {
            const itemKey = item.id || `${item.title}-${idx}`;

            return (
              <div
                key={itemKey}
                className="vs-benefit-card"
                data-testid={`benefit-card-${idx}`}
              >
                <div className="vs-benefit-card__inner">
                  {item.tag && (
                    <span className="vs-benefit-card__tag">{item.tag}</span>
                  )}

                  {item.metric && (
                    <div className="vs-benefit-card__metric-wrap">
                      <span className="vs-benefit-card__metric">{item.metric}</span>
                      {item.metricLabel && (
                        <span className="vs-benefit-card__metric-label">{item.metricLabel}</span>
                      )}
                    </div>
                  )}

                  <div className="vs-benefit-card__header">
                    {item.icon && (
                      <div className="vs-benefit-card__icon" aria-hidden="true">
                        {item.icon}
                      </div>
                    )}
                    <h3 className="vs-benefit-card__title">{item.title}</h3>
                  </div>

                  <div className="vs-benefit-card__desc">
                    {typeof item.description === 'string' ? (
                      <p>{item.description}</p>
                    ) : (
                      item.description
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
