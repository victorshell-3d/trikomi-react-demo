import React, { useState, useEffect } from 'react';
import { VictorShellBrandFooter } from './VictorShellBrandFooter';
import victorshellLogoUrl from '../../assets/victorshell-logo.png';

export interface SportswearLandingPageProps {
  /** Callback to launch the actual 3D Sportswear Configurator application. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'orange'. */
  theme?: string;
  /** Additional CSS class names. */
  className?: string;
}

interface SportswearCategoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const SPORTSWEAR_CATEGORIES: SportswearCategoryItem[] = [
  {
    id: 'athletic-jerseys',
    name: 'Athletic Jerseys',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    )
  },
  {
    id: 'performance-hoodies',
    name: 'Performance Hoodies',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3a3 3 0 0 1 6 0v2H9V3z" />
        <path d="M20 7l-3-2H7L4 7a2 2 0 0 0-1 1.7V12l3-1v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9l3 1V8.7A2 2 0 0 0 20 7z" />
        <line x1="12" y1="5" x2="12" y2="12" />
      </svg>
    )
  },
  {
    id: 'tracksuits',
    name: 'Tracksuits',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6.5L8 4l4 2 4-2 4 2.5v4l-3-1v12.5H7V9.5L4 10.5v-4z" />
        <line x1="12" y1="6" x2="12" y2="22" />
        <line x1="8.5" y1="9.5" x2="8.5" y2="22" />
        <line x1="15.5" y1="9.5" x2="15.5" y2="22" />
      </svg>
    )
  },
  {
    id: 'running-wear',
    name: 'Running Wear',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2h2v4a3 3 0 0 0 6 0V2h2l1 5-2 1v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8L4 7l1-5z" />
        <path d="M9 13l3 2 3-2" />
      </svg>
    )
  },
  {
    id: 'teamwear',
    name: 'Teamwear',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polygon points="12 7 13.5 10 17 10.5 14.5 13 15 16.5 12 15 9 16.5 9.5 13 7 10.5 10.5 10 12 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
];

/**
 * SportswearLandingPage
 * Trikomi Sportswear landing experience with dark obsidian (#08090B) and vibrant orange (#FF7200)
 * styling, animated hero stage, interactive category showcase, studio capabilities, and 3D preview.
 */
export const SportswearLandingPage: React.FC<SportswearLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '#demo',
  theme = 'orange',
  className = ''
}) => {
  // Active category selection state
  const [activeCategory, setActiveCategory] = useState<string>('Athletic Jerseys');

  // Scroll detection for navbar background blur transition
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

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLaunchStudio = (e?: React.MouseEvent) => {
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
      className={`tk-sw-page ${className}`.trim()}
      data-theme="dark"
      data-accent={theme}
      data-testid="trikomi-sportswear-landing"
    >
      {/* Ambient Futuristic Orange Background Glow */}
      <div className="tk-sw-ambient" aria-hidden="true">
        <div className="tk-sw-ambient-top" />
        <div className="tk-sw-ambient-stage" />
        <div className="tk-sw-ambient-left" />
      </div>

      {/* ----------------------------------------------------------------------
          1. Header / Navbar
          ---------------------------------------------------------------------- */}
      <header
        className={`tk-sw-navbar ${isScrolled ? 'is-scrolled' : ''}`}
        data-testid="sportswear-navbar"
      >
        <div className="tk-sw-container">
          <div className="tk-sw-navbar__inner">
            {/* VictorShell Brand Logo */}
            <a
              href="#/"
              className="tk-sw-brand"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="VictorShell"
              aria-label="VictorShell"
              data-testid="sportswear-header-logo-link"
            >
              <img
                src={victorshellLogoUrl}
                alt="VictorShell"
                width={369}
                height={84}
                className="tk-sw-brand__logo"
                data-testid="sportswear-header-logo"
              />
            </a>

            {/* Navigation Links */}
            <nav className="tk-sw-nav" aria-label="Main Navigation">
              <ul className="tk-sw-nav-links">
                {/* 3D Studio */}
                <li className="tk-sw-nav-item">
                  <a
                    href="#demo"
                    onClick={handleLaunchStudio}
                    className="tk-sw-nav-link"
                  >
                    3D Studio
                  </a>
                </li>

                {/* Industries */}
                <li className="tk-sw-nav-item">
                  <a
                    href="#categories"
                    onClick={(e) => handleScrollTo('categories', e)}
                    className="tk-sw-nav-link"
                  >
                    Industries
                  </a>
                </li>

                {/* Resources */}
                <li className="tk-sw-nav-item">
                  <a
                    href="#capabilities"
                    onClick={(e) => handleScrollTo('capabilities', e)}
                    className="tk-sw-nav-link"
                  >
                    Resources
                  </a>
                </li>
              </ul>
            </nav>

            {/* Right Controls: Search, Launch Studio */}
            <div className="tk-sw-nav-actions">
              {/* Search Icon */}
              <button
                type="button"
                className="tk-sw-search-btn"
                aria-label="Browse sportswear styles"
                title="Browse sportswear styles"
                onClick={(e) => handleScrollTo('categories', e)}
                data-testid="navbar-search-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Orange Launch Studio Button */}
              <button
                type="button"
                className="tk-sw-btn-launch"
                onClick={handleLaunchStudio}
                data-testid="navbar-launch-studio-btn"
              >
                <span>Launch Studio</span>
                <svg
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              {/* Mobile Drawer Hamburger */}
              <button
                type="button"
                className="tk-sw-mobile-toggle"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="navbar-mobile-toggle"
              >
                {mobileMenuOpen ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
          className="tk-sw-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          data-testid="sportswear-mobile-drawer"
        >
          <div
            className="tk-sw-mobile-drawer__backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="tk-sw-mobile-drawer__panel">
            <div className="tk-sw-mobile-drawer__header">
              <div className="tk-sw-brand">
                <img
                  src={victorshellLogoUrl}
                  alt="VictorShell"
                  width={369}
                  height={84}
                  className="tk-sw-brand__logo"
                  data-testid="sportswear-drawer-header-logo"
                />
              </div>
              <button
                type="button"
                className="tk-sw-mobile-drawer__close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="tk-sw-mobile-drawer__nav" aria-label="Mobile Navigation Links">
              <a
                href="#demo"
                className="tk-sw-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLaunchStudio(e);
                }}
              >
                Sportswear 3D Configurator
              </a>
              <a
                href="#categories"
                className="tk-sw-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('categories', e);
                }}
              >
                Sportswear Styles
              </a>
              <a
                href="#capabilities"
                className="tk-sw-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('capabilities', e);
                }}
              >
                Studio Capabilities
              </a>
              <a
                href="#studio"
                className="tk-sw-mobile-drawer__link"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo('studio', e);
                }}
              >
                3D Preview Studio
              </a>
            </nav>

            <div className="tk-sw-mobile-drawer__footer">
              <button
                type="button"
                className="tk-sw-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLaunchStudio(e);
                }}
              >
                <span>Launch 3D Studio</span>
                <svg
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          2. Hero Section (Left: Copy & CTAs | Right: Cinematic 3D Presentation)
          ---------------------------------------------------------------------- */}
      <section className="tk-sw-hero" id="hero" data-testid="sportswear-hero-section">
        <div className="tk-sw-container">
          <div className="tk-sw-hero__grid">
            {/* Left Content Column */}
            <div className="tk-sw-hero__content">
              {/* Small Orange Outlined Badge */}
              <div className="tk-sw-badge" data-testid="sportswear-hero-badge">
                <svg
                  className="tk-sw-badge__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
                <span>INTERACTIVE 3D SPORTSWEAR PLATFORM</span>
              </div>

              {/* Main Heading */}
              <h1 className="tk-sw-hero__title" data-testid="sportswear-hero-title">
                Design, Customize &amp; Experience Sportswear in{' '}
                <span className="tk-sw-hero__highlight">Real-Time 3D</span>
              </h1>

              {/* Description */}
              <p className="tk-sw-hero__desc" data-testid="sportswear-hero-desc">
                Create, customize and visualize sportswear products with high-quality 3D previews,
                realistic materials, colors and interactive customization tools.
              </p>

              {/* Action Buttons */}
              <div className="tk-sw-hero__actions">
                <button
                  type="button"
                  className="tk-sw-btn-primary"
                  onClick={handleLaunchStudio}
                  data-testid="hero-launch-studio-btn"
                >
                  <span>Launch 3D Studio</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="tk-sw-btn-secondary"
                  onClick={(e) => handleScrollTo('capabilities', e)}
                  data-testid="hero-explore-capabilities-btn"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span>Explore Capabilities</span>
                </button>
              </div>

              {/* Three Feature Indicators */}
              <div className="tk-sw-indicators" data-testid="sportswear-hero-indicators">
                {/* 1. Real-Time 3D */}
                <div className="tk-sw-indicator">
                  <div className="tk-sw-indicator__icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <span className="tk-sw-indicator__text">Real-Time 3D</span>
                </div>

                {/* 2. Material Customization */}
                <div className="tk-sw-indicator">
                  <div className="tk-sw-indicator__icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <span className="tk-sw-indicator__text">Material Customization</span>
                </div>

                {/* 3. Live Preview */}
                <div className="tk-sw-indicator">
                  <div className="tk-sw-indicator__icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <span className="tk-sw-indicator__text">Live Preview</span>
                </div>
              </div>
            </div>

            {/* Right Cinematic 3D Presentation */}
            <div className="tk-sw-hero__visual" data-testid="sportswear-hero-visual">
              <div
                className="tk-sw-stage-wrap"
                onClick={handleLaunchStudio}
                title="Click to launch Sportswear 3D Studio"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLaunchStudio();
                  }
                }}
              >
                {/* Animated Volumetric Orange Ring & Podium Glow Layers */}
                <div className="tk-sw-hero-ring-glow" aria-hidden="true" />
                <div className="tk-sw-hero-ring-sweep" aria-hidden="true" />

                {/* 3D Cinematic Sportswear Render */}
                <img
                  src="/images/sportswear-hero-cinematic.jpg"
                  alt="Trikomi 3D Sportswear Configurator presentation featuring a prominent matte black and orange athletic technical jacket inside an illuminated neon orange ring stage"
                  className="tk-sw-product-img"
                  loading="eager"
                  data-testid="sportswear-hero-product-img"
                />

                {/* Hover Action Pill Overlay */}
                <div className="tk-sw-interactive-pill">
                  <svg
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
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Launch 3D Studio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. Sportswear Categories Section ("One Studio, Multiple Sportswear Styles")
          ---------------------------------------------------------------------- */}
      <section
        className="tk-sw-categories-section"
        id="categories"
        data-testid="sportswear-categories-section"
        aria-label="Sportswear Categories"
      >
        <div className="tk-sw-container">
          <div className="tk-sw-categories-strip">
            {/* Heading on Left */}
            <div className="tk-sw-categories-header">
              <h2 className="tk-sw-categories-title" data-testid="sportswear-categories-title">
                One Studio,<br />Multiple Sportswear Styles
              </h2>
            </div>

            {/* Orange Vertical Separator */}
            <div className="tk-sw-categories-divider" aria-hidden="true" />

            {/* 5 Interactive Category Tabs */}
            <div
              className="tk-sw-categories-list"
              role="tablist"
              aria-label="Sportswear Categories"
              data-testid="sportswear-categories-list"
            >
              {SPORTSWEAR_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    id={`cat-tab-${cat.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={0}
                    className={`tk-sw-category-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(cat.name)}
                    data-testid={`sportswear-category-${cat.id}`}
                  >
                    <span className="tk-sw-category-icon" aria-hidden="true">
                      {cat.icon}
                    </span>
                    <span className="tk-sw-category-name">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          4. Studio Capabilities Section (Exact Reference Two-Column Layout)
          ---------------------------------------------------------------------- */}
      <section
        className="tk-sw-capabilities-exact-section"
        id="capabilities"
        data-testid="sportswear-capabilities-section"
        aria-label="Studio Capabilities"
      >
        <div className="tk-sw-container">
          <div className="tk-sw-capabilities-row">
            {/* Left Side: Four Large Tilted Rectangular Product Image Panels */}
            <div className="tk-sw-capabilities-panels-col" data-testid="sportswear-capabilities-visual">
              <div
                className="tk-sw-tilted-panels-wrap"
                onClick={handleLaunchStudio}
                title="Click to Launch 3D Studio"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleLaunchStudio();
                  }
                }}
              >
                <img
                  src="/images/sportswear-capabilities-panels.jpg"
                  alt="Studio Capabilities displaying four floating sportswear cards with an athletic jersey, full tracksuit, zip performance hoodie, and carbon running shoes"
                  className="tk-sw-tilted-panels-img"
                  loading="eager"
                  data-testid="sportswear-capabilities-panels-img"
                />
              </div>
            </div>

            {/* Right Side: Heading, Description & 3-Column Feature Container */}
            <div className="tk-sw-capabilities-content-col">
              <span className="tk-sw-section-label" data-testid="sportswear-capabilities-badge">
                STUDIO CAPABILITIES
              </span>

              <h2 className="tk-sw-capabilities-title" data-testid="sportswear-capabilities-title">
                From Inspection to <br />Full Customization
              </h2>

              <p className="tk-sw-capabilities-desc" data-testid="sportswear-capabilities-desc">
                A complete set of 3D tools to visualize, configure, measure, and test your sportswear products in real-time.
              </p>

              {/* ONE Horizontal Feature Container (3 Columns) */}
              <div className="tk-sw-features-box" data-testid="sportswear-features-box">
                {/* Column 1: Material Inspection */}
                <div className="tk-sw-feature-col" data-testid="sportswear-feature-col-1">
                  <div className="tk-sw-feature-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <line x1="3.6" y1="9" x2="20.4" y2="9" />
                      <line x1="3.6" y1="15" x2="20.4" y2="15" />
                      <path d="M12 3a14.5 14.5 0 0 0 0 18" />
                      <path d="M12 3a14.5 14.5 0 0 1 0 18" />
                    </svg>
                  </div>
                  <span className="tk-sw-feature-title">Material <br />Inspection</span>
                </div>

                <div className="tk-sw-feature-sep" aria-hidden="true" />

                {/* Column 2: Dimension & Measurement */}
                <div className="tk-sw-feature-col" data-testid="sportswear-feature-col-2">
                  <div className="tk-sw-feature-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 14.5C4 9.5 7.5 6 12 6C16.5 6 20 9.5 20 14.5" />
                      <circle cx="19" cy="14" r="2.5" />
                      <line x1="6" y1="14.5" x2="6" y2="17.5" />
                      <line x1="10" y1="14.5" x2="10" y2="16.5" />
                      <line x1="14" y1="14.5" x2="14" y2="17.5" />
                    </svg>
                  </div>
                  <span className="tk-sw-feature-title">Dimension &amp; <br />Measurement</span>
                </div>

                <div className="tk-sw-feature-sep" aria-hidden="true" />

                {/* Column 3: Texture & Color Variants */}
                <div className="tk-sw-feature-col" data-testid="sportswear-feature-col-3">
                  <div className="tk-sw-feature-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C13.5 22 14.5 21 14.5 19.5C14.5 18.8 14.2 18.2 13.8 17.7C13.4 17.2 13.1 16.6 13.1 16C13.1 14.9 14 14 15.1 14H17C19.8 14 22 11.8 22 9C22 5.1 17.5 2 12 2Z" />
                      <circle cx="7.5" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                      <circle cx="16.5" cy="10" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="tk-sw-feature-title">Texture &amp; <br />Color Variants</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          5. Real-Time 3D Studio Section (Exact Reference Two-Column Layout)
          ---------------------------------------------------------------------- */}
      <section
        className="tk-sw-studio-exact-section"
        id="studio"
        data-testid="sportswear-showcase-section"
        aria-label="Real-Time 3D Studio"
      >
        <div className="tk-sw-container">
          <div className="tk-sw-studio-row">
            {/* Left Column: Large Realistic Laptop Mockup */}
            <div className="tk-sw-studio-laptop-col" data-testid="sportswear-showcase-visual">
              <div
                className="tk-sw-laptop-mockup-wrap"
                onClick={handleLaunchStudio}
                title="Click to Launch 3D Studio"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleLaunchStudio();
                  }
                }}
              >
                <img
                  src="/images/sportswear-studio-laptop.jpg"
                  alt="Trikomi Real-Time 3D Sportswear Studio laptop viewport displaying a glowing orange grid pedestal, 3D running sneaker and jacket model, toolbar icons, and PBR material spheres"
                  className="tk-sw-laptop-img"
                  loading="eager"
                  data-testid="sportswear-showcase-img"
                />

                {/* Subtle Hover Action Pill */}
                <div className="tk-sw-laptop-hover-pill">
                  <svg
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
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Launch 3D Studio</span>
                </div>
              </div>
            </div>

            {/* Right Column: Heading, Description & Orange Gradient Pill Button */}
            <div className="tk-sw-studio-content-col">
              <span className="tk-sw-section-label" data-testid="sportswear-showcase-badge">
                REAL-TIME 3D STUDIO
              </span>

              <h2 className="tk-sw-studio-title" data-testid="sportswear-showcase-title">
                Inspect with <span className="tk-sw-highlight-orange">Confidence</span>
              </h2>

              <p className="tk-sw-studio-desc" data-testid="sportswear-showcase-desc">
                Evaluate lighting, materials, surface quality, and exact measurements in real-time.
              </p>

              <button
                type="button"
                className="tk-sw-btn-primary tk-sw-studio-btn"
                onClick={handleLaunchStudio}
                data-testid="showcase-launch-studio-btn"
              >
                <span>Launch 3D Studio</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          6. Final CTA Section ("Bring Your Sportswear Designs to Life in 3D")
          ---------------------------------------------------------------------- */}
      <section
        className="tk-sw-cta-section"
        id="cta"
        data-testid="sportswear-cta-section"
        aria-label="Experience Sportswear 3D"
      >
        <div className="tk-sw-container">
          <div className="tk-sw-cta-card" data-testid="sportswear-cta-card">
            {/* Left Content Column */}
            <div className="tk-sw-cta-content">
              <span className="tk-sw-section-label tk-sw-cta-badge" data-testid="sportswear-cta-label">
                READY TO EXPERIENCE SPORTSWEAR 3D?
              </span>

              <h2 className="tk-sw-cta-title" data-testid="sportswear-cta-title">
                Bring Your Sportswear<br />Designs to Life in 3D
              </h2>

              <button
                type="button"
                className="tk-sw-btn-primary tk-sw-cta-btn"
                onClick={handleLaunchStudio}
                data-testid="cta-launch-studio-btn"
              >
                <span>Launch 3D Studio</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Right Orange Dotted Wave Mesh Visual attached to right edge */}
            <div className="tk-sw-cta-wave-wrap" aria-hidden="true">
              <img
                src="/images/sportswear-cta-wave.jpg"
                alt="Futuristic glowing orange particle wave mesh"
                className="tk-sw-cta-wave-img"
                loading="eager"
                data-testid="sportswear-cta-wave-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          7. Footer Section (VictorShell Official Footer)
          ---------------------------------------------------------------------- */}
      <VictorShellBrandFooter
        id="footer"
        ariaLabel="Site Footer"
        className="tk-sw-footer"
        containerClassName="tk-sw-container"
        socialHeading="Connect with VictorShell"
        copyrightText="© 2026 VictorShell. All rights reserved."
        footerTestId="sportswear-footer"
        logoLinkTestId="sportswear-footer-logo-link"
        logoTestId="sportswear-footer-logo"
        copyrightTestId="sportswear-footer-copyright"
        socialTestIdPrefix="sportswear-footer-social"
      />
    </div>
  );
};

export default SportswearLandingPage;
