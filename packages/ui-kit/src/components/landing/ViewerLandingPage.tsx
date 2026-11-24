import React, { useState, useEffect, useCallback } from 'react';
import { useOptionalVictorShellTheme } from '../../theme/ThemeProvider';
import { ViewerHero3DCanvas, ViewerPreviewStudio } from './Viewer3DCanvas';

export interface ViewerLandingPageProps {
  /** Callback to launch the actual 3D Viewer application. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'violet'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

const STORAGE_KEY_MODE = 'vs_theme_mode';

/**
 * ViewerLandingPage
 *
 * Pixel-perfect implementation of the Trikomi 3D Product Viewer landing page.
 * Features real interactive 3D models (360° mouse drag, touch rotation, zoom,
 * fullscreen, floating toolbar, and live PBR material swatches).
 */

/* --------------------------------------------------------------------------
   ConfidenceViewerMockup: Interactive 3D Viewer Interface Mockup matching Reference
   -------------------------------------------------------------------------- */
interface ConfidenceViewerMockupProps {
  themeMode?: 'light' | 'dark';
  onLaunchDemo?: (e?: React.MouseEvent) => void;
}

const ConfidenceViewerMockup: React.FC<ConfidenceViewerMockupProps> = ({
  themeMode = 'dark',
  onLaunchDemo
}) => {
  return (
    <div
      className="tk-confidence-console-wrap"
      onClick={onLaunchDemo}
      title="Click to launch Interactive 3D Studio"
      role="region"
      aria-label="3D Product Viewer interactive preview"
    >
      <div className="tk-console-media">
        <img
          src="/images/viewer-confidence-mockup.png"
          alt="Trikomi 3D Viewer interface preview with toolbar and swatches"
          className="tk-console-img"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export const ViewerLandingPage: React.FC<ViewerLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '#demo',
  theme = 'violet',
  className = ''
}) => {
  // Context-aware theme support with fallback to local state
  const themeContext = useOptionalVictorShellTheme();

  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY_MODE);
        if (saved === 'light' || saved === 'dark') {
          return saved;
        }
      } catch {
        // Ignore localStorage error
      }
    }
    // Default to Light theme as requested
    return 'light';
  });

  const activeMode = themeContext ? themeContext.themeMode : themeMode;

  const handleToggleTheme = useCallback(() => {
    if (themeContext) {
      themeContext.toggleThemeMode();
    } else {
      setThemeModeState((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem(STORAGE_KEY_MODE, next);
          } catch {
            // Ignore localStorage error
          }
        }
        return next;
      });
    }
  }, [themeContext]);

  // Keep documentElement in sync
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeMode);
    }
  }, [activeMode]);

  // Scroll detection for transparent-to-subtle glass transition
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile navigation drawer state & accordion submenus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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

  const handleLaunchDemo = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onExploreDemo) {
      onExploreDemo();
    } else if (typeof window !== 'undefined') {
      window.location.hash = exploreDemoHref;
    }
  };

  const handleScrollTo = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className={`tk-viewer-page ${className}`}
      data-theme={activeMode}
      data-accent={theme}
      data-testid="trikomi-viewer-landing"
    >
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="tk-viewer-ambient" aria-hidden="true">
        <div className="tk-ambient-orb-1" />
        <div className="tk-ambient-orb-2" />
        <div className="tk-ambient-orb-3" />
        <div className="tk-ambient-orb-4" />
      </div>

      {/* ----------------------------------------------------------------------
          1. Header / Navbar
          ---------------------------------------------------------------------- */}
      <header className={`tk-navbar ${isScrolled ? 'is-scrolled' : ''}`} data-testid="viewer-header">
        <div className="tk-container">
          <div className="tk-navbar__inner">
            {/* Brand Logo */}
            <a
              href="#/"
              className="tk-brand"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Trikomi 3D Platform"
            >
              <div className="tk-brand__icon" aria-hidden="true">
                {/* Trikomi Geometric Origami / Arrow Logo */}
                <svg viewBox="0 0 28 28" width="32" height="32" fill="none">
                  <path
                    d="M3 5.5L25 14L3 22.5L7.5 14L3 5.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.5 14L25 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ opacity: 0.3 }}
                  />
                </svg>
              </div>
              <span className="tk-brand__name">Trikomi</span>
            </a>

            {/* Center Navigation Links with Dropdowns */}
            <nav className="tk-nav" aria-label="Main Navigation">
              <ul className="tk-nav-links">
                <li className="tk-nav-item">
                  <button type="button" className="tk-nav-btn" aria-haspopup="true" aria-expanded="false">
                    <span>Solutions</span>
                    <svg className="tk-nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="tk-dropdown">
                    <a href="/apps/jewelry-configurator/index.html" className="tk-dropdown__link">Jewelry Configurator</a>
                    <a href="/apps/eyewear-tryon/index.html" className="tk-dropdown__link">Eyewear Virtual Try-On</a>
                    <a href="/apps/sportswear-configurator/index.html" className="tk-dropdown__link">Sportswear Configurator</a>
                    <a href="/apps/box-configurator/index.html" className="tk-dropdown__link">Packaging Configurator</a>
                    <a href="/apps/360tour/index.html" className="tk-dropdown__link">360° Virtual Tour</a>
                    <a href="#demo" onClick={handleLaunchDemo} className="tk-dropdown__link">3D Product Viewer Studio</a>
                  </div>
                </li>

                <li className="tk-nav-item">
                  <button type="button" className="tk-nav-btn" aria-haspopup="true" aria-expanded="false">
                    <span>Products</span>
                    <svg className="tk-nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="tk-dropdown">
                    <a href="#experience" onClick={(e) => handleScrollTo('experience', e)} className="tk-dropdown__link">WebGPU 3D Engine</a>
                    <a href="#experience" onClick={(e) => handleScrollTo('experience', e)} className="tk-dropdown__link">8thWall WebAR SLAM</a>
                    <a href="#experience" onClick={(e) => handleScrollTo('experience', e)} className="tk-dropdown__link">Cinema-Grade PBR</a>
                    <a href="#experience" onClick={(e) => handleScrollTo('experience', e)} className="tk-dropdown__link">Kinematics Timeline</a>
                  </div>
                </li>

                <li className="tk-nav-item">
                  <button type="button" className="tk-nav-btn" aria-haspopup="true" aria-expanded="false">
                    <span>Industries</span>
                    <svg className="tk-nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="tk-dropdown">
                    <a href="#solutions" onClick={(e) => handleScrollTo('solutions', e)} className="tk-dropdown__link">Luxury Jewelry</a>
                    <a href="#solutions" onClick={(e) => handleScrollTo('solutions', e)} className="tk-dropdown__link">Eyewear &amp; Optics</a>
                    <a href="#solutions" onClick={(e) => handleScrollTo('solutions', e)} className="tk-dropdown__link">Athletic Apparel</a>
                    <a href="#solutions" onClick={(e) => handleScrollTo('solutions', e)} className="tk-dropdown__link">Premium Packaging</a>
                  </div>
                </li>

                <li className="tk-nav-item">
                  <button type="button" className="tk-nav-btn" aria-haspopup="true" aria-expanded="false">
                    <span>Resources</span>
                    <svg className="tk-nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="tk-dropdown">
                    <a href="#cta" onClick={(e) => handleScrollTo('cta', e)} className="tk-dropdown__link">Developer Documentation</a>
                    <a href="#cta" onClick={(e) => handleScrollTo('cta', e)} className="tk-dropdown__link">API Reference</a>
                    <a href="#cta" onClick={(e) => handleScrollTo('cta', e)} className="tk-dropdown__link">Case Studies</a>
                    <a href="#cta" onClick={(e) => handleScrollTo('cta', e)} className="tk-dropdown__link">System Status</a>
                  </div>
                </li>

                <li className="tk-nav-item">
                  <a href="#stats" onClick={(e) => handleScrollTo('stats', e)} className="tk-nav-btn">
                    Pricing
                  </a>
                </li>
              </ul>
            </nav>

            {/* Right Controls: Search, Theme Toggle, Book a Demo, Mobile Menu */}
            <div className="tk-nav-actions">
              <button
                type="button"
                className="tk-search-btn"
                aria-label="Search Trikomi platform"
                onClick={() => handleScrollTo('solutions')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Theme Toggle Button Pill */}
              <button
                type="button"
                className="tk-theme-toggle"
                data-testid="landing-theme-mode-toggle"
                onClick={handleToggleTheme}
                aria-label={`Switch to ${activeMode === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${activeMode === 'dark' ? 'light' : 'dark'} mode`}
              >
                <span className={`tk-theme-icon ${activeMode === 'light' ? 'is-active' : ''}`}>
                  {/* Sun Icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </span>
                <span className={`tk-theme-icon ${activeMode === 'dark' ? 'is-active' : ''}`}>
                  {/* Moon Icon */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
              </button>

              {/* Book a Demo Button */}
              <button
                type="button"
                className="tk-btn-primary"
                onClick={(e) => handleScrollTo('cta', e)}
              >
                <span>Book a Demo</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                type="button"
                className="tk-mobile-toggle vs-landing-header__mobile-toggle"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="landing-mobile-nav-toggle"
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
        </div>
      </header>

      {/* Mobile Drawer Navigation Panel */}
      {mobileMenuOpen && (
        <div
          className="tk-mobile-drawer vs-landing-header__mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          data-testid="mobile-drawer"
        >
          <div
            className="tk-mobile-drawer__backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="tk-mobile-drawer__panel">
            <div className="tk-mobile-drawer__header">
              <div className="tk-brand">
                <div className="tk-brand__icon" aria-hidden="true">
                  <svg viewBox="0 0 28 28" width="24" height="24" fill="none">
                    <path d="M3 5.5L25 14L3 22.5L7.5 14L3 5.5Z" fill="currentColor" />
                  </svg>
                </div>
                <span className="tk-brand__name">Trikomi</span>
              </div>
              <button
                type="button"
                className="tk-mobile-drawer__close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="tk-mobile-drawer__nav" aria-label="Mobile Navigation Links">
              {/* Solutions Accordion Dropdown */}
              <div className="tk-mobile-accordion">
                <button
                  type="button"
                  className="tk-mobile-drawer__link tk-mobile-accordion__btn"
                  onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                  aria-expanded={mobileSolutionsOpen}
                >
                  <span>Solutions</span>
                  <svg
                    className={`tk-mobile-chevron ${mobileSolutionsOpen ? 'is-open' : ''}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {mobileSolutionsOpen && (
                  <div className="tk-mobile-submenu">
                    <a href="/apps/jewelry-configurator/index.html" className="tk-mobile-sublink" onClick={() => setMobileMenuOpen(false)}>
                      <span>• Luxury Jewelry</span>
                    </a>
                    <a href="/apps/eyewear-tryon/index.html" className="tk-mobile-sublink" onClick={() => setMobileMenuOpen(false)}>
                      <span>• Eyewear &amp; Optics</span>
                    </a>
                    <a href="/apps/sportswear-configurator/index.html" className="tk-mobile-sublink" onClick={() => setMobileMenuOpen(false)}>
                      <span>• Athletic Apparel</span>
                    </a>
                    <a href="/apps/box-configurator/index.html" className="tk-mobile-sublink" onClick={() => setMobileMenuOpen(false)}>
                      <span>• Premium Packaging</span>
                    </a>
                    <a href="/apps/360tour/index.html" className="tk-mobile-sublink" onClick={() => setMobileMenuOpen(false)}>
                      <span>• Virtual Tour (360°)</span>
                    </a>
                    <a
                      href="#solutions"
                      className="tk-mobile-sublink tk-mobile-sublink--all"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleScrollTo('solutions', e);
                      }}
                    >
                      <span>→ View All Solutions</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Products & Features */}
              <a
                href="#experience"
                className="tk-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('experience', e);
                }}
              >
                Products &amp; Features
              </a>

              {/* Resources Accordion Dropdown */}
              <div className="tk-mobile-accordion">
                <button
                  type="button"
                  className="tk-mobile-drawer__link tk-mobile-accordion__btn"
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                  aria-expanded={mobileResourcesOpen}
                >
                  <span>Resources</span>
                  <svg
                    className={`tk-mobile-chevron ${mobileResourcesOpen ? 'is-open' : ''}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {mobileResourcesOpen && (
                  <div className="tk-mobile-submenu">
                    <a href="#cta" className="tk-mobile-sublink" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo('cta', e); }}>
                      <span>• Developer Documentation</span>
                    </a>
                    <a href="#cta" className="tk-mobile-sublink" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo('cta', e); }}>
                      <span>• API Reference</span>
                    </a>
                    <a href="#cta" className="tk-mobile-sublink" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo('cta', e); }}>
                      <span>• Case Studies</span>
                    </a>
                    <a href="#cta" className="tk-mobile-sublink" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo('cta', e); }}>
                      <span>• System Status</span>
                    </a>
                  </div>
                )}
              </div>

              <a
                href="#stats"
                className="tk-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('stats', e);
                }}
              >
                Platform Stats &amp; Pricing
              </a>
              <a
                href="#cta"
                className="tk-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('cta', e);
                }}
              >
                Enterprise Solutions
              </a>
              <a
                href="#demo"
                className="tk-mobile-drawer__link tk-mobile-drawer__link--highlight"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLaunchDemo(e);
                }}
              >
                Launch 3D Studio
              </a>
            </nav>

            <div className="tk-mobile-drawer__footer">
              <div className="tk-mobile-drawer__theme">
                <span>Theme Mode:</span>
                <button
                  type="button"
                  className="tk-theme-toggle"
                  onClick={handleToggleTheme}
                  aria-label="Toggle theme mode"
                >
                  <span className={`tk-theme-icon ${activeMode === 'light' ? 'is-active' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                    </svg>
                  </span>
                  <span className={`tk-theme-icon ${activeMode === 'dark' ? 'is-active' : ''}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </span>
                </button>
              </div>

              <button
                type="button"
                className="tk-btn-primary tk-btn--full"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('cta', e);
                }}
              >
                <span>Book a Demo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          2. Hero Section with Real Interactive 3D Model
          ---------------------------------------------------------------------- */}
      <section className="tk-hero" id="hero">
        <div className="tk-container">
          <div className="tk-hero__grid">
            {/* Left Content Column */}
            <div className="tk-hero__content">
              <div className="tk-badge">
                BESPOKE 3D CONFIGURATOR PLATFORM
              </div>

              <h1 className="tk-hero__title">
                Design Beyond<br />
                <span className="tk-gradient-text">Dimensions</span>
              </h1>

              <p className="tk-hero__desc">
                Create immersive, high-performance 3D configurators for e-commerce, fashion, jewelry, packaging and more.
              </p>

              <div className="tk-hero__actions">
                <button
                  type="button"
                  className="tk-btn-primary"
                  onClick={handleLaunchDemo}
                  data-testid="hero-explore-solutions-btn"
                >
                  <span>Explore Solutions</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="tk-btn-secondary"
                  onClick={handleLaunchDemo}
                  data-testid="hero-watch-demo-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Social Proof / Avatars */}
              <div className="tk-trust-row">
                <div className="tk-avatar-group">
                  <div className="tk-avatar" style={{ background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600 }}>JD</div>
                  <div className="tk-avatar" style={{ background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600 }}>SK</div>
                  <div className="tk-avatar" style={{ background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600 }}>AL</div>
                  <div className="tk-avatar-badge">+1000</div>
                </div>
                <span className="tk-trust-text">
                  Trusted by global brands<br />and innovative teams
                </span>
              </div>
            </div>

            {/* Right Visual: Real Interactive 3D Metallic Purple Torus Knot */}
            <div className="tk-hero__visual">
              <div className="tk-hero__visual-wrap">
                <ViewerHero3DCanvas themeMode={activeMode} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. Horizontal Feature Strip (5 items) - Futuristic Hexagonal Glass Panel
          ---------------------------------------------------------------------- */}
      <section className="tk-strip-section" aria-label="Key Capabilities">
        <div className="tk-container">
          <div className="tk-feature-strip">
            <div className="tk-feature-strip__inner">
              {/* 1. Lightning Fast Performance */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="tk-strip-title">Lightning Fast<br />Performance</span>
              </div>

              {/* 2. Photorealistic Rendering */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <span className="tk-strip-title">Photorealistic<br />Rendering</span>
              </div>

              {/* 3. Fully Customizable Experiences */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="2" y1="6" x2="22" y2="6" />
                    <circle cx="8" cy="6" r="2" fill="currentColor" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <circle cx="16" cy="12" r="2" fill="currentColor" />
                    <line x1="2" y1="18" x2="22" y2="18" />
                    <circle cx="10" cy="18" r="2" fill="currentColor" />
                  </svg>
                </div>
                <span className="tk-strip-title">Fully Customizable<br />Experiences</span>
              </div>

              {/* 4. Scale for Enterprise */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span className="tk-strip-title">Scale for<br />Enterprise</span>
              </div>

              {/* 5. Secure & Reliable */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <span className="tk-strip-title">Secure &amp;<br />Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          4. Solutions Section ("Bring Your Ideas to Life" - 5 Cards)
          ---------------------------------------------------------------------- */}
      <section className="tk-solutions-section" id="solutions">
        <div className="tk-container tk-solutions-container">
          {/* Left Column: Heading, description, View All Solutions */}
          <div className="tk-solutions-intro">
            <div className="tk-badge">POWERFUL CONFIGURATORS</div>
            <h2 className="tk-section-title">
              Bring Your<br />
              <span className="tk-gradient-text">Ideas to Life</span>
            </h2>
            <p className="tk-section-subtitle">
              From luxury jewelry to sportswear, packaging to virtual showrooms — one platform, endless possibilities.
            </p>
            <a
              href="#solutions"
              className="tk-view-all-link"
              onClick={handleLaunchDemo}
            >
              <span>View All Solutions</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Right Column: 5 Futuristic Tilted Floating 3D Cards */}
          <div className="tk-cards-deck">
            {/* Card 1: Jewelry Configurator */}
            <a
              href="/apps/jewelry-configurator/index.html"
              className="tk-solution-card tk-card-jewelry"
              title="Open Jewelry Configurator"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-jewelry.png"
                    alt="Jewelry Configurator"
                    className="tk-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">Jewelry<br />Configurator</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Card 2: Eyewear Try-On */}
            <a
              href="/apps/eyewear-tryon/index.html"
              className="tk-solution-card tk-card-eyewear"
              title="Open Eyewear Virtual Try-On"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-eyewear.png"
                    alt="Eyewear Try-On"
                    className="tk-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">Eyewear<br />Try-On</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Card 3: Sportswear Configurator */}
            <a
              href="/apps/sportswear-configurator/index.html"
              className="tk-solution-card tk-card-sportswear"
              title="Open Sportswear Configurator"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-sportswear.png"
                    alt="Sportswear Configurator"
                    className="tk-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">Sportswear<br />Configurator</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Card 4: Packaging Configurator */}
            <a
              href="/apps/box-configurator/index.html"
              className="tk-solution-card tk-card-packaging"
              title="Open Packaging Configurator"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-packaging.png"
                    alt="Packaging Configurator"
                    className="tk-card-image tk-card-image--packaging"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">Packaging<br />Configurator</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Card 5: Virtual Tour (360°) */}
            <a
              href="/apps/360tour/index.html"
              className="tk-solution-card tk-card-tour"
              title="Open Virtual Tour"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-tour.png"
                    alt="Virtual Tour (360°)"
                    className="tk-card-image tk-card-image--tour"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">Virtual Tour<br />(360°)</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          5. Configure with Confidence Section (PROMPT 26: 3-Part Composition)
             - LEFT (35%): Large glowing 3D Torus Knot with mountain landscape
             - CENTER (25%): Badge, Heading, Description, Angular CTA Button
             - RIGHT (40%): 3D Viewer interface preview with toolbar & swatches
          ---------------------------------------------------------------------- */}
      <section className="tk-confidence-section" id="experience">
        <div className="tk-container tk-confidence-container">
          <div className="tk-confidence-inner">
            {/* Left Column (35%): 3D Torus Knot + Mountains Artwork */}
            <div className="tk-confidence-left">
              <img
                src="/images/viewer-confidence-knot.png"
                alt="3D Metallic Torus Knot on Mountain Landscape"
                className="tk-confidence-artwork"
                loading="lazy"
              />
            </div>

            {/* Center Column (25%): Badge, Heading, Description, CTA */}
            <div className="tk-confidence-center">
              <div className="tk-confidence-badge">REAL-TIME 3D EXPERIENCE</div>
              <h2 className="tk-confidence-title">
                Configure with<br />
                <span className="tk-gradient-confidence">Confidence</span>
              </h2>
              <p className="tk-confidence-desc">
                Give your customers the power to explore, personalize and experience products in stunning 3D — in real time.
              </p>
              <div className="tk-confidence-actions">
                <button
                  type="button"
                  className="tk-confidence-btn"
                  onClick={handleLaunchDemo}
                  data-testid="experience-try-live-demo-btn"
                >
                  <span>Try Live Demo</span>
                  <span className="tk-btn-arrow">→</span>
                </button>
              </div>
            </div>

            {/* Right Column (40%): 3D Viewer Interface Preview Mockup */}
            <div className="tk-confidence-right">
              <ConfidenceViewerMockup
                themeMode={activeMode}
                onLaunchDemo={handleLaunchDemo}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          6. Statistics Bar
          ---------------------------------------------------------------------- */}
      <section className="tk-stats-section" id="stats">
        <div className="tk-container">
          <div className="tk-stats-bar">
            <div className="tk-stats-bar__inner">
              {/* Stat 1: 60+ Projects */}
              <div className="tk-stat-item">
                <div className="tk-stat-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                    <circle cx="8" cy="15.5" r="0.75" fill="currentColor" stroke="none" />
                    <circle cx="16" cy="15.5" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div className="tk-stat-text">
                  <div className="tk-stat-value">60+</div>
                  <div className="tk-stat-label">Projects Delivered</div>
                </div>
              </div>

              {/* Stat 2: 6+ Countries */}
              <div className="tk-stat-item">
                <div className="tk-stat-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="tk-stat-text">
                  <div className="tk-stat-value">6+</div>
                  <div className="tk-stat-label">Countries</div>
                </div>
              </div>

              {/* Stat 3: 99.9% Uptime */}
              <div className="tk-stat-item">
                <div className="tk-stat-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div className="tk-stat-text">
                  <div className="tk-stat-value">99.9%</div>
                  <div className="tk-stat-label">Uptime</div>
                </div>
              </div>

              {/* Stat 4: 100% Satisfaction */}
              <div className="tk-stat-item">
                <div className="tk-stat-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                    <circle cx="10" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="tk-stat-text">
                  <div className="tk-stat-value">100%</div>
                  <div className="tk-stat-label">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          7. Integrated Bottom Area: Final CTA Showroom Section + Footer
          ---------------------------------------------------------------------- */}
      <section className="tk-bottom-integrated" id="cta">
        <div className="tk-container">
          {/* Compact CTA Banner Card - Exact 3.7:1 Aspect Ratio Matching Reference */}
          <div className="tk-cta-card">
            {/* Left Content Area (approx 42% width, 7.5% from card left edge) */}
            <div className="tk-cta-content">
              <span className="tk-cta-label">READY TO GET STARTED?</span>
              <h2 className="tk-cta-title">
                Let&apos;s Build Your<br />
                3D Experience Together
              </h2>
              <div className="tk-cta-actions">
                <button
                  type="button"
                  className="tk-btn-primary tk-cta-btn-demo"
                  onClick={handleLaunchDemo}
                >
                  <span>Book a Demo</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          8. Distinct Grounded Footer Section
          ---------------------------------------------------------------------- */}
      <footer className="tk-footer">
        <div className="tk-container">
            <div className="tk-footer__inner">
              {/* Left: Brand + Copyright */}
              <div className="tk-footer__left">
                <div className="tk-brand">
                  <div className="tk-brand__icon" aria-hidden="true">
                    <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
                      <path
                        d="M3 5.5L25 14L3 22.5L7.5 14L3 5.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="tk-brand__name" style={{ fontSize: '17px' }}>Trikomi</span>
                </div>
                <span className="tk-footer__copy">
                  &copy; 2025 Trikomi. All rights reserved.
                </span>
              </div>

              {/* Right: Legal Links + Social Icons */}
              <div className="tk-footer__right">
                <div className="tk-footer__links">
                  <a href="#privacy" className="tk-footer__link">Privacy</a>
                  <a href="#terms" className="tk-footer__link">Terms</a>
                  <a href="#contact" className="tk-footer__link">Contact</a>
                </div>
                <span className="tk-footer__divider" aria-hidden="true">|</span>
                <div className="tk-footer__socials">
                  {/* LinkedIn */}
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="tk-social-btn" aria-label="LinkedIn">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="tk-social-btn" aria-label="YouTube">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  {/* X / Twitter */}
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="tk-social-btn" aria-label="X">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="tk-social-btn" aria-label="Instagram">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
      </footer>
    </div>
  );
};

export default ViewerLandingPage;
