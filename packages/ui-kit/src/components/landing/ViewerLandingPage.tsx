import React, { useState, useEffect, useCallback } from 'react';
import { useOptionalVictorShellTheme } from '../../theme/ThemeProvider';

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
 * Trikomi 3D Product Viewer landing page.
 * Uses exact reference styling, CSS classes, and interactive 3D hero canvas.
 */

/* --------------------------------------------------------------------------
   ConfidenceViewerMockup: Interactive 3D Viewer Interface Mockup
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
                    <span>Capabilities</span>
                    <svg className="tk-nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="tk-dropdown">
                    <a href="#solutions" onClick={(e) => handleScrollTo('solutions', e)} className="tk-dropdown__link">PBR Materials &amp; Shaders</a>
                    <a href="#solutions" onClick={(e) => handleScrollTo('solutions', e)} className="tk-dropdown__link">Dimension Measurements</a>
                    <a href="#solutions" onClick={(e) => handleScrollTo('solutions', e)} className="tk-dropdown__link">8thWall WebAR SLAM</a>
                    <a href="#solutions" onClick={(e) => handleScrollTo('solutions', e)} className="tk-dropdown__link">Camera Views &amp; Kinematics</a>
                    <a href="#demo" onClick={handleLaunchDemo} className="tk-dropdown__link">Launch 3D Studio</a>
                  </div>
                </li>

                <li className="tk-nav-item">
                  <a href="#experience" onClick={(e) => handleScrollTo('experience', e)} className="tk-nav-btn">
                    3D Studio
                  </a>
                </li>

                <li className="tk-nav-item">
                  <a href="#stats" onClick={(e) => handleScrollTo('stats', e)} className="tk-nav-btn">
                    Specifications
                  </a>
                </li>
              </ul>
            </nav>

            {/* Right Controls: Theme Toggle, Launch Studio, Mobile Menu */}
            <div className="tk-nav-actions">
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="12" x2="12" y2="3" />
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
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
              </button>

              {/* Launch Studio Button */}
              <button
                type="button"
                className="tk-btn-primary"
                onClick={handleLaunchDemo}
                data-testid="navbar-launch-studio-btn"
              >
                <span>Launch Studio</span>
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
              <a
                href="#solutions"
                className="tk-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('solutions', e);
                }}
              >
                Studio Capabilities
              </a>
              <a
                href="#experience"
                className="tk-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('experience', e);
                }}
              >
                Interactive 3D Studio
              </a>
              <a
                href="#stats"
                className="tk-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('stats', e);
                }}
              >
                Technical Specifications
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
                      <line x1="12" y1="12" x2="12" y2="3" />
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
                  handleLaunchDemo(e);
                }}
              >
                <span>Launch 3D Studio</span>
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
                INTERACTIVE 3D PRODUCT VIEWER
              </div>

              <h1 className="tk-hero__title">
                Inspect, Configure &amp;<br />
                <span className="tk-gradient-text">Experience in 3D</span>
              </h1>

              <p className="tk-hero__desc">
                High-performance real-time 3D viewport for models and e-commerce assets.
                Test physical PBR materials, measure exact dimensions, animate kinematics,
                and preview in Augmented Reality directly in your browser.
              </p>

              <div className="tk-hero__actions">
                <button
                  type="button"
                  className="tk-btn-primary"
                  onClick={handleLaunchDemo}
                  data-testid="hero-explore-solutions-btn"
                >
                  <span>Launch 3D Studio</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="tk-btn-secondary"
                  onClick={(e) => handleScrollTo('solutions', e)}
                  data-testid="hero-watch-demo-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Explore Capabilities</span>
                </button>
              </div>

              {/* Social Proof / Trust Row */}
              <div className="tk-trust-row">
                <div className="tk-avatar-group">
                  <div className="tk-avatar" style={{ background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600 }}>3D</div>
                  <div className="tk-avatar" style={{ background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600 }}>AR</div>
                  <div className="tk-avatar" style={{ background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 600 }}>PBR</div>
                  <div className="tk-avatar-badge">60 FPS</div>
                </div>
                <span className="tk-trust-text">
                  Cinema-grade WebGL engine<br />with real-time PBR shading
                </span>
              </div>
            </div>

            {/* Right Visual: 3D Studio Workstation Viewport */}
            <div className="tk-hero__visual">
              <div
                className="tk-hero__visual-wrap"
                onClick={handleLaunchDemo}
                title="Click to Launch 3D Studio"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleLaunchDemo();
                  }
                }}
              >
                <div className="tk-hero-mockup-frame">
                  <img
                    src="/images/viewer-hero-studio.jpg"
                    alt="Trikomi 3D Product Viewer Studio showing a luxury designer armchair with millimeter dimension calipers, material swatches, and camera controls"
                    className="tk-hero-mockup-img"
                    loading="eager"
                  />
                  <div className="tk-hero-mockup-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Click to Launch 3D Studio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. Horizontal Feature Strip (5 items)
          ---------------------------------------------------------------------- */}
      <section className="tk-strip-section" aria-label="Key Capabilities">
        <div className="tk-container">
          <div className="tk-feature-strip">
            <div className="tk-feature-strip__inner">
              {/* 1. Real-time PBR Materials */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="tk-strip-title">Real-Time PBR<br />Materials</span>
              </div>

              {/* 2. Millimeter Measurements */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <span className="tk-strip-title">Dimension &amp;<br />Measurements</span>
              </div>

              {/* 3. Instant WebAR SLAM */}
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
                <span className="tk-strip-title">Instant WebAR<br />Projection</span>
              </div>

              {/* 4. Multi-Camera Presets */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span className="tk-strip-title">Camera Views &amp;<br />Kinematics</span>
              </div>

              {/* 5. glTF 2.0 & GLB Ready */}
              <div className="tk-strip-item">
                <div className="tk-strip-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <span className="tk-strip-title">glTF 2.0 &amp; GLB<br />Standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          4. Studio Inspection Capabilities (5 Cards)
          ---------------------------------------------------------------------- */}
      <section className="tk-solutions-section" id="solutions">
        <div className="tk-container tk-solutions-container">
          {/* Left Column: Heading, description */}
          <div className="tk-solutions-intro">
            <div className="tk-badge">STUDIO CAPABILITIES</div>
            <h2 className="tk-section-title">
              Engineered for<br />
              <span className="tk-gradient-text">Precision &amp; Realism</span>
            </h2>
            <p className="tk-section-subtitle">
              Inspect physical materials, verify geometric tolerances, and experience digital twins in browser-native 3D.
            </p>
            <a
              href="#demo"
              className="tk-view-all-link"
              onClick={handleLaunchDemo}
            >
              <span>Open 3D Studio</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Right Column: 5 Floating 3D Cards */}
          <div className="tk-cards-deck">
            {/* Card 1: PBR Materials */}
            <div
              className="tk-solution-card tk-card-jewelry"
              onClick={handleLaunchDemo}
              style={{ cursor: 'pointer' }}
              title="Launch 3D Studio Material Inspector"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-materials.jpg"
                    alt="PBR Material Spheres and Texture Inspection"
                    className="tk-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">PBR Material<br />Inspection</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: WebAR Projection */}
            <div
              className="tk-solution-card tk-card-eyewear"
              onClick={handleLaunchDemo}
              style={{ cursor: 'pointer' }}
              title="Launch 3D Studio WebAR"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-webar.jpg"
                    alt="WebAR SLAM Projection of Designer Armchair in Living Room"
                    className="tk-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">WebAR SLAM<br />Projection</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Color & Texture Variants */}
            <div
              className="tk-solution-card tk-card-sportswear"
              onClick={handleLaunchDemo}
              style={{ cursor: 'pointer' }}
              title="Launch 3D Studio Variants"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-variants.jpg"
                    alt="Designer Armchair in Cognac Leather, Forest Velvet, and Ivory Boucle Variants"
                    className="tk-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">Color &amp; Texture<br />Variants</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Dimension & Scale Calibers */}
            <div
              className="tk-solution-card tk-card-packaging"
              onClick={handleLaunchDemo}
              style={{ cursor: 'pointer' }}
              title="Launch 3D Studio Measurements"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-dimensions.jpg"
                    alt="Precision 3D Holographic Wireframe Caliber Measurements"
                    className="tk-card-image tk-card-image--packaging"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">Dimension &amp;<br />Scale Calibers</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 5: 360° Panorama & HDRI Environments */}
            <div
              className="tk-solution-card tk-card-tour"
              onClick={handleLaunchDemo}
              style={{ cursor: 'pointer' }}
              title="Launch 3D Studio HDRI Environments"
            >
              <div className="tk-card-inner">
                <div className="tk-card-image-wrap">
                  <img
                    src="/images/viewer-card-tour.png"
                    alt="360 HDRI Environments"
                    className="tk-card-image tk-card-image--tour"
                    loading="lazy"
                  />
                </div>
                <div className="tk-card-footer">
                  <h3 className="tk-card-title">360° Studio<br />Environments</h3>
                  <span className="tk-card-arrow-btn" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          5. Configure with Confidence Section (3-Part Composition)
          ---------------------------------------------------------------------- */}
      <section className="tk-confidence-section" id="experience">
        <div className="tk-container tk-confidence-container">
          <div className="tk-confidence-inner">
            {/* Left Column (35%): 3D Designer Chair Turntable Artwork */}
            <div className="tk-confidence-left">
              <img
                src="/images/viewer-confidence-furniture.jpg"
                alt="Interactive 3D Furniture Studio Turntable with Calibers and Controls"
                className="tk-confidence-artwork"
                loading="lazy"
              />
            </div>

            {/* Center Column (25%): Badge, Heading, Description, CTA */}
            <div className="tk-confidence-center">
              <div className="tk-confidence-badge">REAL-TIME 3D STUDIO</div>
              <h2 className="tk-confidence-title">
                Inspect with<br />
                <span className="tk-gradient-confidence">Confidence</span>
              </h2>
              <p className="tk-confidence-desc">
                Evaluate lighting reflections, physical metalness, surface roughness, and exact millimeters in real-time.
              </p>
              <div className="tk-confidence-actions">
                <button
                  type="button"
                  className="tk-confidence-btn"
                  onClick={handleLaunchDemo}
                  data-testid="experience-try-live-demo-btn"
                >
                  <span>Launch 3D Studio</span>
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
          6. Technical Specifications Bar
          ---------------------------------------------------------------------- */}
      <section className="tk-stats-section" id="stats">
        <div className="tk-container">
          <div className="tk-stats-bar">
            <div className="tk-stats-bar__inner">
              {/* Stat 1: 60 FPS */}
              <div className="tk-stat-item">
                <div className="tk-stat-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div className="tk-stat-text">
                  <div className="tk-stat-value">60 FPS</div>
                  <div className="tk-stat-label">Real-Time Viewport</div>
                </div>
              </div>

              {/* Stat 2: glTF 2.0 & GLB */}
              <div className="tk-stat-item">
                <div className="tk-stat-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="tk-stat-text">
                  <div className="tk-stat-value">glTF 2.0</div>
                  <div className="tk-stat-label">GLB, Draco &amp; KTX2</div>
                </div>
              </div>

              {/* Stat 3: 8thWall WebAR */}
              <div className="tk-stat-item">
                <div className="tk-stat-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="tk-stat-text">
                  <div className="tk-stat-value">WebAR</div>
                  <div className="tk-stat-label">8thWall SLAM Ready</div>
                </div>
              </div>

              {/* Stat 4: 100% Native */}
              <div className="tk-stat-item">
                <div className="tk-stat-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="tk-stat-text">
                  <div className="tk-stat-value">100%</div>
                  <div className="tk-stat-label">Browser Native (Zero Apps)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          7. Final CTA Banner
          ---------------------------------------------------------------------- */}
      <section className="tk-bottom-integrated" id="cta">
        <div className="tk-container">
          <div className="tk-cta-card">
            <div className="tk-cta-content">
              <span className="tk-cta-label">READY TO TEST YOUR 3D ASSETS?</span>
              <h2 className="tk-cta-title">
                Launch the Interactive<br />
                3D Product Studio
              </h2>
              <div className="tk-cta-actions">
                <button
                  type="button"
                  className="tk-btn-primary tk-cta-btn-demo"
                  onClick={handleLaunchDemo}
                >
                  <span>Launch 3D Studio</span>
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
          8. Grounded Footer Section
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
                &copy; {new Date().getFullYear()} Trikomi 3D Platform. Product Viewer Studio.
              </span>
            </div>

            {/* Right: Back to Top */}
            <div className="tk-footer__right">
              <div className="tk-footer__links">
                <a
                  href="#hero"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="tk-footer__link"
                >
                  Back to Top ↑
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
