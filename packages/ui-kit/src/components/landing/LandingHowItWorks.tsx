import React from 'react';

export interface StepItem {
  /** Step number, e.g. '01', '02', '03' */
  number: string;
  /** Step title */
  title: string;
  /** Step description */
  description: React.ReactNode;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Optional badge text */
  badge?: string;
}

export interface LandingHowItWorksProps {
  /** Optional section badge (defaults to 'Workflow') */
  badge?: string;
  /** Section heading title (defaults to 'How It Works') */
  sectionTitle?: string;
  /** Optional subtitle */
  sectionSubtitle?: string;
  /** Optional descriptive paragraph below heading */
  sectionDescription?: string;
  /** Exactly 3 simple workflow steps */
  steps: StepItem[];
  /** Optional DOM element ID for anchor navigation (defaults to 'how-it-works') */
  id?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * LandingHowItWorks
 *
 * Section 4 of the compact VictorShell landing page layout.
 * Displays a streamlined 3-step workflow (Select/Upload -> Customize/Interact -> Export/View).
 */
export const LandingHowItWorks: React.FC<LandingHowItWorksProps> = ({
  badge = 'Workflow',
  sectionTitle = 'How It Works',
  sectionSubtitle,
  sectionDescription,
  steps = [],
  id = 'how-it-works',
  className = ''
}) => {
  return (
    <section
      id={id}
      className={`vs-landing-how-it-works ${className}`.trim()}
      data-testid="landing-how-it-works"
    >
      <div className="vs-landing-how-it-works__container">
        {/* Section Header */}
        <div className="vs-landing-how-it-works__header">
          {badge && (
            <span className="vs-landing-how-it-works__badge" data-testid="how-it-works-badge">
              <span className="vs-landing-how-it-works__badge-dot" aria-hidden="true" />
              {badge}
            </span>
          )}
          {sectionSubtitle && (
            <p className="vs-landing-how-it-works__subtitle">{sectionSubtitle}</p>
          )}
          {sectionTitle && (
            <h2 className="vs-landing-how-it-works__title" data-testid="how-it-works-title">
              {sectionTitle}
            </h2>
          )}
          {sectionDescription && (
            <p className="vs-landing-how-it-works__desc">{sectionDescription}</p>
          )}
        </div>

        {/* 3-Step Grid */}
        <div className="vs-landing-how-it-works__grid" data-testid="how-it-works-grid">
          {steps.map((step) => (
            <div
              key={step.number}
              className="vs-step-card"
              data-testid={`step-card-${step.number}`}
            >
              <div className="vs-step-card__top">
                <span className="vs-step-card__number" data-testid="step-number">
                  {step.number}
                </span>
                {step.icon && (
                  <div className="vs-step-card__icon-wrap" aria-hidden="true">
                    {step.icon}
                  </div>
                )}
              </div>

              <h3 className="vs-step-card__title" data-testid="step-title">
                {step.title}
              </h3>

              <div className="vs-step-card__desc" data-testid="step-desc">
                {typeof step.description === 'string' ? (
                  <p>{step.description}</p>
                ) : (
                  step.description
                )}
              </div>

              {step.badge && (
                <span className="vs-step-card__badge" data-testid="step-badge">
                  {step.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
