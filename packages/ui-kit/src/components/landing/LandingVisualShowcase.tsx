import React, { useState } from 'react';

export interface ShowcaseItem {
  id: string;
  label: string;
  badge?: string;
  description?: string;
  visual: React.ReactNode;
}

export interface LandingVisualShowcaseProps {
  /** Optional section badge. */
  badge?: string;
  /** Section heading title. */
  sectionTitle: string;
  /** Optional section subtitle. */
  sectionSubtitle?: string;
  /** Optional descriptive paragraph. */
  sectionDescription?: string;
  /** Showcase view items to toggle between. */
  items: ShowcaseItem[];
  /** Optional initially active tab ID. Defaults to first item's ID. */
  defaultActiveId?: string;
  /** Optional call-to-action button to launch the full configurator from the preview stage */
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  /** Optional DOM element ID for anchor navigation (e.g. 'showcase'). */
  id?: string;
  /** Additional CSS class names. */
  className?: string;
}

export const LandingVisualShowcase: React.FC<LandingVisualShowcaseProps> = ({
  badge,
  sectionTitle,
  sectionSubtitle,
  sectionDescription,
  items = [],
  defaultActiveId,
  action,
  id,
  className = ''
}) => {
  const [activeId, setActiveId] = useState<string>(defaultActiveId || items[0]?.id || '');
  const activeItem = items.find((item) => item.id === activeId) || items[0];

  return (
    <section
      id={id}
      className={`vs-landing-showcase ${className}`.trim()}
      data-testid="landing-visual-showcase"
    >
      <div className="vs-landing-showcase__container">
        {/* Header */}
        <div className="vs-landing-showcase__header">
          {badge && (
            <span className="vs-landing-showcase__badge" data-testid="showcase-badge">
              {badge}
            </span>
          )}
          {sectionSubtitle && (
            <p className="vs-landing-showcase__subtitle">{sectionSubtitle}</p>
          )}
          <h2 className="vs-landing-showcase__title" data-testid="showcase-title">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="vs-landing-showcase__desc">{sectionDescription}</p>
          )}

          {/* Interactive Showcase Tabs */}
          {items.length > 1 && (
            <div
              className="vs-landing-showcase__tabs"
              role="tablist"
              aria-label="Showcase Views"
              data-testid="showcase-tabs"
            >
              {items.map((item) => {
                const isActive = item.id === activeItem?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`showcase-panel-${item.id}`}
                    className={`vs-showcase-tab ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveId(item.id)}
                    data-testid={`showcase-tab-${item.id}`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="vs-showcase-tab__badge">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Showcase Frame Viewport */}
        {activeItem && (
          <div
            id={`showcase-panel-${activeItem.id}`}
            role="tabpanel"
            className="vs-landing-showcase__stage"
            data-testid="showcase-stage"
          >
            <div className="vs-landing-showcase__frame">
              <div className="vs-landing-showcase__visual-wrapper">
                {activeItem.visual}
              </div>
            </div>

            <div className="vs-landing-showcase__stage-footer">
              {activeItem.description ? (
                <p className="vs-landing-showcase__caption" data-testid="showcase-caption">
                  {activeItem.description}
                </p>
              ) : <div />}

              {action && (
                <div className="vs-landing-showcase__action-wrap">
                  {action.href ? (
                    <a
                      href={action.href}
                      onClick={action.onClick}
                      className="vs-btn-primary vs-landing-showcase__cta-btn"
                      data-testid="showcase-launch-btn"
                    >
                      <span>{action.label}</span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={action.onClick}
                      className="vs-btn-primary vs-landing-showcase__cta-btn"
                      data-testid="showcase-launch-btn"
                    >
                      <span>{action.label}</span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
