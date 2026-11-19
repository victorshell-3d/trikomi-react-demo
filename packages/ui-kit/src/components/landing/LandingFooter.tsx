import React from 'react';

export interface LandingFooterLink {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
  onClick?: () => void;
}

export interface LandingFooterColumn {
  title: string;
  links: LandingFooterLink[];
}

export interface LandingFooterProps {
  /** The specific product title. */
  productTitle: string;
  /** Custom product tagline / elevator pitch. */
  productTagline?: string;
  /** Main brand name. Defaults to 'VictorShell'. */
  brandName?: string;
  /** Optional Explore Demo callback. */
  onExploreDemo?: () => void;
  /** Label for Explore Demo button. */
  exploreDemoLabel?: string;
  /** Custom columns of footer navigation links. */
  linkColumns?: LandingFooterColumn[];
  /** SDK / Engine version indicator string. Defaults to '@trikomi/core WebGPU 3D Engine'. */
  sdkVersion?: string;
  /** Whether to show 'Back to Top' button. Defaults to true. */
  showBackToTop?: boolean;
  /** Copyright year. Defaults to current year. */
  copyrightYear?: number;
  /** Additional CSS class names. */
  className?: string;
}

const DEFAULT_LINK_COLUMNS: LandingFooterColumn[] = [
  {
    title: '3D Platform',
    links: [
      { label: '3D Model Viewer', href: '/apps/viewer/index.html' },
      { label: 'Jewelry Studio', href: '/apps/jewelry-configurator/index.html' },
      { label: 'Sportswear Customizer', href: '/apps/sportswear-configurator/index.html' },
      { label: 'Box Packaging Lab', href: '/apps/box-configurator/index.html' },
      { label: 'Eyewear AR Try-On', href: '/apps/eyewear-tryon/index.html' },
      { label: 'Face Motion Capture', href: '/apps/face-mocap/index.html' },
      { label: '360 Virtual Tour', href: '/apps/360tour/index.html' }
    ]
  },
  {
    title: 'Developer SDK',
    links: [
      { label: 'Documentation', href: '/docs/index.html' },
      { label: 'WebGPU Pipeline', href: '/docs/index.html#build' },
      { label: 'Plugin Architecture', href: '/docs/index.html#plugins' },
      { label: 'Asset Management', href: '/docs/index.html#assets' }
    ]
  },
  {
    title: 'Technology',
    links: [
      { label: 'Three.js WebGPU', href: 'https://threejs.org', external: true },
      { label: 'MediaPipe Vision', href: 'https://developers.google.com/mediapipe', external: true },
      { label: 'React 19 & MobX', href: 'https://react.dev', external: true }
    ]
  }
];

export const LandingFooter: React.FC<LandingFooterProps> = ({
  productTitle,
  productTagline = 'High-performance interactive 3D WebGPU visualization and customization engine.',
  brandName = 'VictorShell',
  onExploreDemo,
  exploreDemoLabel = 'Explore Interactive Demo',
  linkColumns = DEFAULT_LINK_COLUMNS,
  sdkVersion = '@trikomi/core WebGPU 3D Engine',
  showBackToTop = true,
  copyrightYear = new Date().getFullYear(),
  className = ''
}) => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`vs-landing-footer ${className}`.trim()}
      role="contentinfo"
      data-testid="landing-footer"
    >
      <div className="vs-landing-footer__glow" aria-hidden="true" />
      <div className="vs-landing-footer__container">
        {/* Main Columns Grid */}
        <div className="vs-landing-footer__grid">
          {/* Brand & Product Column */}
          <div className="vs-landing-footer__brand-col">
            <div className="vs-landing-footer__brand-header">
              <div className="vs-landing-footer__brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div className="vs-landing-footer__brand-titles">
                <span className="vs-landing-footer__brand-name">{brandName}</span>
                <span className="vs-landing-footer__product-name">{productTitle}</span>
              </div>
            </div>

            <p className="vs-landing-footer__tagline">{productTagline}</p>

            {onExploreDemo && (
              <button
                type="button"
                onClick={onExploreDemo}
                className="vs-landing-footer__cta-btn vs-btn-primary"
                data-testid="footer-explore-demo-btn"
              >
                <span className="vs-landing-footer__cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span>{exploreDemoLabel}</span>
              </button>
            )}

            <div className="vs-landing-footer__status-badge">
              <span className="vs-landing-footer__status-dot" aria-hidden="true" />
              <span className="vs-landing-footer__status-text">{sdkVersion}</span>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          <div className="vs-landing-footer__links-group">
            {linkColumns.map((col, idx) => (
              <div key={col.title || idx} className="vs-landing-footer__col">
                <h4 className="vs-landing-footer__col-title">{col.title}</h4>
                <ul className="vs-landing-footer__link-list">
                  {col.links.map((link, lIdx) => (
                    <li key={`${link.label}-${lIdx}`} className="vs-landing-footer__link-item">
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (link.onClick) {
                            e.preventDefault();
                            link.onClick();
                          }
                        }}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="vs-landing-footer__link"
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="vs-landing-footer__link-badge">{link.badge}</span>
                        )}
                        {link.external && (
                          <svg className="vs-landing-footer__external-icon" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="vs-landing-footer__bottom-bar">
          <p className="vs-landing-footer__copyright">
            &copy; {copyrightYear} {brandName} 3D Platform. All rights reserved. Powered by @trikomi/core WebGPU.
          </p>

          {showBackToTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="vs-landing-footer__back-to-top"
              aria-label="Back to top"
              data-testid="back-to-top-btn"
            >
              <span>Back to top</span>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
