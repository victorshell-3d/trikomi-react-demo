import React, { useState, useEffect, useCallback } from 'react';
import { useVictorShellTheme, type VictorShellAccent } from '../../theme/ThemeProvider';
import { LandingNav, type LandingNavLink } from './LandingNav';

export interface LandingHeaderProps {
  /** The specific product title (e.g. '3D Model Viewer', 'Jewelry Configurator'). */
  productTitle: string;
  /** Optional category or edition badge (e.g. 'WebGPU Studio', 'Parametric Packaging'). */
  productBadge?: string;
  /** Optional custom brand mark or logo image URL/element. */
  brandLogo?: React.ReactNode;
  /** Main brand name text. Defaults to 'VictorShell'. */
  brandName?: string;
  /** Optional URL for the brand logo link. Defaults to root demo hub '/'. */
  brandHref?: string;
  /** Navigation links for this product landing page. */
  navLinks?: LandingNavLink[];
  /** Callback invoked when the user clicks 'Explore Demo'. */
  onExploreDemo?: () => void;
  /** Label for the demo CTA button. Defaults to 'Explore Demo'. */
  exploreDemoLabel?: string;
  /** Optional fallback URL if explore demo should act as a link. */
  exploreDemoHref?: string;
  /** Whether to show the theme switcher for the 3 frosted glass themes. Defaults to true. */
  showThemeSwitcher?: boolean;
  /** Override active theme; if omitted, uses VictorShellThemeProvider context. */
  activeTheme?: VictorShellAccent;
  /** Callback when theme is changed via the header switcher. */
  onThemeChange?: (theme: VictorShellAccent) => void;
  /** Optional secondary action element (e.g. docs link, repo link). */
  secondaryAction?: React.ReactNode;
  /** Whether header is fixed/sticky at the top. Defaults to true. */
  sticky?: boolean;
  /** Additional CSS class names. */
  className?: string;
}

const THEME_OPTIONS: Array<{ value: VictorShellAccent; label: string; color: string }> = [
  { value: 'violet', label: 'Violet', color: '#6E2CF2' },
  { value: 'indigo', label: 'Indigo', color: '#4338CA' },
  { value: 'orchid', label: 'Orchid', color: '#A21CAF' }
];

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  productTitle,
  productBadge,
  brandLogo,
  brandName = 'VictorShell',
  brandHref = '/',
  navLinks = [],
  onExploreDemo,
  exploreDemoLabel = 'Explore Demo',
  exploreDemoHref,
  showThemeSwitcher = true,
  activeTheme: controlledTheme,
  onThemeChange,
  secondaryAction,
  sticky = true,
  className = ''
}) => {
  const contextTheme = useVictorShellTheme();
  const currentTheme = controlledTheme ?? contextTheme.accent;

  const handleThemeSelect = (themeValue: VictorShellAccent) => {
    contextTheme.setAccent(themeValue);
    if (onThemeChange) {
      onThemeChange(themeValue);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent background page scrolling when mobile navigation drawer is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleExploreClick = (e: React.MouseEvent) => {
    if (onExploreDemo) {
      e.preventDefault();
      onExploreDemo();
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`vs-landing-header ${sticky ? 'vs-landing-header--sticky' : ''} ${className}`.trim()}
      data-testid="landing-header"
    >
      <div className="vs-landing-header__container">
        {/* Brand & Product Identity */}
        <div className="vs-landing-header__brand-group">
          <a
            href={brandHref}
            className="vs-landing-header__brand-link"
            aria-label={`${brandName} Home`}
          >
            {brandLogo ? (
              <span className="vs-landing-header__logo-custom">{brandLogo}</span>
            ) : (
              <div className="vs-landing-header__brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
            )}
            <div className="vs-landing-header__brand-meta">
              <span className="vs-landing-header__brand-title">{brandName}</span>
              <span className="vs-landing-header__brand-divider" aria-hidden="true">/</span>
              <span className="vs-landing-header__product-title" data-testid="product-title">{productTitle}</span>
            </div>
          </a>

          {productBadge && (
            <span className="vs-landing-header__badge" data-testid="product-badge">
              {productBadge}
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        {navLinks.length > 0 && (
          <div className="vs-landing-header__nav-wrapper">
            <LandingNav
              links={navLinks}
              orientation="horizontal"
              className="vs-landing-header__desktop-nav"
            />
          </div>
        )}

        {/* Actions Group (Theme Switcher, Secondary Action, CTA) */}
        <div className="vs-landing-header__actions">
          {/* Theme Switcher */}
          {showThemeSwitcher && (
            <div
              className="vs-landing-header__theme-switcher"
              role="radiogroup"
              aria-label="Theme Accent Switcher"
              data-testid="landing-theme-switcher"
            >
              {THEME_OPTIONS.map((theme) => {
                const isSelected = currentTheme === theme.value;
                return (
                  <button
                    key={theme.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${theme.label} theme`}
                    title={`${theme.label} theme`}
                    className={`vs-landing-header__theme-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => handleThemeSelect(theme.value)}
                    style={{ '--theme-swatch-color': theme.color } as React.CSSProperties}
                  >
                    <span className="vs-landing-header__theme-dot" />
                  </button>
                );
              })}
            </div>
          )}

          {secondaryAction && (
            <div className="vs-landing-header__secondary-action">
              {secondaryAction}
            </div>
          )}

          {/* Mandatory Explore Demo Button */}
          <a
            href={exploreDemoHref || '#demo'}
            onClick={handleExploreClick}
            className="vs-landing-header__cta-btn vs-btn-primary"
            data-testid="explore-demo-btn"
            role="button"
          >
            <span className="vs-landing-header__cta-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
            <span className="vs-landing-header__cta-text vs-landing-header__cta-text--full">{exploreDemoLabel}</span>
            <span className="vs-landing-header__cta-text vs-landing-header__cta-text--short" aria-hidden="true">Demo</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="vs-landing-header__mobile-toggle"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-nav-toggle"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Panel */}
      {mobileMenuOpen && (
        <div
          className="vs-landing-header__mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          data-testid="mobile-drawer"
        >
          <div
            className="vs-landing-header__mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="vs-landing-header__mobile-panel">
            <div className="vs-landing-header__mobile-panel-header">
              <span className="vs-landing-header__mobile-title">{productTitle}</span>
              <button
                type="button"
                className="vs-landing-header__mobile-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {navLinks.length > 0 && (
              <LandingNav
                links={navLinks}
                orientation="vertical"
                onLinkClick={() => setMobileMenuOpen(false)}
                className="vs-landing-header__mobile-nav"
              />
            )}

            <div className="vs-landing-header__mobile-footer">
              {showThemeSwitcher && (
                <div className="vs-landing-header__mobile-theme-row">
                  <span className="vs-landing-header__mobile-theme-label">Accent Theme</span>
                  <div
                    className="vs-landing-header__theme-switcher"
                    role="radiogroup"
                    aria-label="Theme Accent Switcher"
                  >
                    {THEME_OPTIONS.map((theme) => {
                      const isSelected = currentTheme === theme.value;
                      return (
                        <button
                          key={theme.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={`${theme.label} theme`}
                          className={`vs-landing-header__theme-btn ${isSelected ? 'is-active' : ''}`}
                          onClick={() => handleThemeSelect(theme.value)}
                          style={{ '--theme-swatch-color': theme.color } as React.CSSProperties}
                        >
                          <span className="vs-landing-header__theme-dot" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <a
                href={exploreDemoHref || '#demo'}
                onClick={handleExploreClick}
                className="vs-landing-header__cta-btn vs-btn-primary vs-landing-header__mobile-cta"
                role="button"
              >
                <span className="vs-landing-header__cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span className="vs-landing-header__cta-text">{exploreDemoLabel}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
