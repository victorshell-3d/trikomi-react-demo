import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import { Hero3DCanvas } from './Hero3DCanvas';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface JewelryLandingPageProps {
  /** Callback to launch the actual Jewelry Configurator 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/jewelry-configurator/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'violet'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * JewelryLandingPage
 *
 * Dedicated, luxury single-product landing page for the VictorShell Jewelry Configurator.
 * Built using the Frosted Glass design system and Task 22/23/24 reusable components.
 * Focuses exclusively on Jewelry Configurator capabilities:
 * - DiamondPlugin ray-traced spectral dispersion & caustic sparkle (Abbe index 58.6)
 * - 4 precious metal alloys (18K Yellow Gold, 18K Rose Gold, Platinum 950, White Gold)
 * - Gemstone cut geometries (Round Brilliant, Princess, Emerald, Cushion)
 * - Ring settings (Classic Solitaire ring.glb, Halo Setting ring2.glb, diamonds.glb)
 * - Real-time environment reflections (Studio Softbox, Luxury Boutique Spotlight)
 */
export const JewelryLandingPage: React.FC<JewelryLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/jewelry-configurator/index.html#demo',
  theme = 'violet',
  className = ''
}) => {
  // Navigation anchors for the single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#cta' }
  ];

  // Verified Features from MaterialControls.tsx & DiamondPlugin
  const features: FeatureItem[] = [
    {
      id: 'spectral-dispersion',
      title: 'Ray-Traced Spectral Dispersion',
      description:
        'Calculates real-time wavelength light splitting using the Cauchy dispersion formula (Abbe 58.6), creating authentic diamond fire and rainbow caustics.',
      badge: 'Spectral PBR',
      highlight: true
    },
    {
      id: 'noble-metals',
      title: 'Precious Metal Alloys',
      description:
        'Physically modeled microfacet reflectance for 18K Yellow Gold, 18K Rose Gold, Platinum 950, and 18K White Gold with anisotropic micro-grooves.',
      badge: 'Noble Metals'
    },
    {
      id: 'gemstone-cuts',
      title: 'Interactive Diamond Cuts',
      description:
        'Seamlessly swap center diamond cuts between Round Brilliant, Princess, Emerald, and Cushion shapes with parametric facet realignment.',
      badge: 'Gemological Library'
    },
    {
      id: 'luxury-lighting',
      title: 'Studio Lighting Presets',
      description:
        'Switch between Studio Softbox, Luxury Jewelry Boutique Spotlight, and Warm Sunset Gem lighting environments for optical brilliance.',
      badge: 'HDR Environments'
    },
    {
      id: 'carat-scaling',
      title: 'Parametric Carat Sizing',
      description:
        'Interactive diamond carat scaling with proportional pavilion depth and table width calculations adhering to standard gemological grading.',
      badge: 'Parametric Gem'
    },
    {
      id: 'high-res-render',
      title: '4K Studio Snapshot Export',
      description:
        'Capture print-ready 4K high-resolution renderings with alpha transparency for e-commerce lookbooks, social media, and customer quotes.',
      badge: 'Production 4K'
    }
  ];

  // Interactive Showcase Views
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'solitaire-view',
      label: 'Classic Solitaire',
      badge: 'ring.glb',
      description:
        '1.5 Carat Round Brilliant center stone set in a polished Platinum 950 cathedral band with 4-prong claw mounting.',
      visual: (
        <div className="vs-jewelry-preview-card" data-testid="showcase-solitaire-preview">
          <div className="vs-jewelry-preview-card__badge-row">
            <span className="vs-jewelry-chip">ring.glb</span>
            <span className="vs-jewelry-chip vs-jewelry-chip--accent">Platinum 950</span>
          </div>
          <div className="vs-jewelry-preview-card__visual">
            <img
              src="/logos/jewel.png"
              alt="VictorShell Classic Solitaire Ring"
              className="vs-jewelry-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-jewelry-preview-card__meta">
            <span className="vs-jewelry-preview-card__title">Classic Solitaire Ring</span>
            <span className="vs-jewelry-preview-card__spec">Round Brilliant Cut · Cauchy Dispersion · 60 FPS</span>
          </div>
        </div>
      )
    },
    {
      id: 'halo-view',
      label: 'Halo Setting',
      badge: 'ring2.glb',
      description:
        'Cushion cut diamond surrounded by 24 micro-pavé melee diamonds set in warm 18K Rose Gold with millgrain edge detailing.',
      visual: (
        <div className="vs-jewelry-preview-card" data-testid="showcase-halo-preview">
          <div className="vs-jewelry-preview-card__badge-row">
            <span className="vs-jewelry-chip">ring2.glb</span>
            <span className="vs-jewelry-chip vs-jewelry-chip--accent">18K Rose Gold</span>
          </div>
          <div className="vs-jewelry-preview-card__visual">
            <img
              src="/logos/jewel.png"
              alt="VictorShell Halo Setting Ring"
              className="vs-jewelry-preview-card__img vs-jewelry-preview-card__img--alt"
              loading="lazy"
            />
          </div>
          <div className="vs-jewelry-preview-card__meta">
            <span className="vs-jewelry-preview-card__title">Halo Pavé Setting</span>
            <span className="vs-jewelry-preview-card__spec">Micro-Pavé Melee · 18K Rose Gold · Anisotropic Sheen</span>
          </div>
        </div>
      )
    },
    {
      id: 'diamonds-view',
      label: 'Gemstone Cluster',
      badge: 'diamonds.glb',
      description:
        'Multi-stone diamond cluster demonstrating spectral ray tracing and chromatic light splitting across faceted gemstone clusters.',
      visual: (
        <div className="vs-jewelry-preview-card" data-testid="showcase-cluster-preview">
          <div className="vs-jewelry-preview-card__badge-row">
            <span className="vs-jewelry-chip">diamonds.glb</span>
            <span className="vs-jewelry-chip vs-jewelry-chip--accent">Multi-Gem Array</span>
          </div>
          <div className="vs-jewelry-preview-card__visual">
            <img
              src="/logos/jewel.png"
              alt="VictorShell Multi-Diamond Cluster"
              className="vs-jewelry-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-jewelry-preview-card__meta">
            <span className="vs-jewelry-preview-card__title">Multi-Gemstone Cluster</span>
            <span className="vs-jewelry-preview-card__spec">Spectral Ray Tracing · Total Internal Reflection</span>
          </div>
        </div>
      )
    }
  ];

  // Benefits & Performance Metrics
  const benefits: BenefitItem[] = [
    {
      id: 'dispersion',
      title: 'Abbe 58.6 Dispersion Index',
      description:
        'Accurately calculates chromatic wavelength separation, generating natural diamond fire and scintillation sparkle.',
      metric: 'Abbe 58.6',
      metricLabel: 'Optical Dispersion',
      tag: 'Physics Based'
    },
    {
      id: 'fps',
      title: '60 FPS Real-Time Ray Tracing',
      description:
        'Three.js WebGPU compute shaders calculate internal reflections instantly with zero dropped frames on laptops and phones.',
      metric: '60 FPS',
      metricLabel: 'WebGPU Viewport',
      tag: 'Performance'
    },
    {
      id: 'conversion',
      title: '3.4x E-Commerce Engagement',
      description:
        'Interactive 3D diamond inspection removes buyer hesitation and increases average order value for luxury bridal retailers.',
      metric: '3.4x',
      metricLabel: 'Engagement Lift',
      tag: 'E-Commerce ROI'
    },
    {
      id: 'accuracy',
      title: 'True Anisotropic Reflection',
      description:
        'Precision micro-groove reflection renders polished platinum and brushed gold bands with optical fidelity.',
      metric: '100%',
      metricLabel: 'Material Fidelity',
      tag: 'Luxury Grade'
    }
  ];

  // Interactive state for hero visual simulation
  const [activeMetal, setActiveMetal] = useState<'yellow' | 'rose' | 'platinum' | 'black'>('platinum');
  const [activeCut, setActiveCut] = useState<'round' | 'princess' | 'oval' | 'pear'>('round');
  const [activeTab, setActiveTab] = useState<'metal' | 'stone' | 'style'>('metal');
  const [activeCarat, setActiveCarat] = useState<number>(1.5);
  const [activeSetting, setActiveSetting] = useState<'solitaire' | 'halo'>('solitaire');
  const stageRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Hero visual stage with marble pedestal, glowing halo, Drag to Rotate pill, Fullscreen, and Floating Glass Panel
  const heroVisual = (
    <div ref={stageRef} className="vs-jewelry-hero-showcase" data-testid="jewelry-hero-stage">
      {/* 3D Ring Stage with Pedestal & Halo */}
      <div className="vs-jewelry-hero-stage__viewport">
        <Hero3DCanvas
          modelUrl={activeSetting === 'solitaire' ? '/models/ring.glb' : '/models/ring2.glb'}
          preset="jewelry"
          activeMaterial={activeMetal}
          activeVariant={activeCut}
        />

        {/* Floating Pedestal Interaction Bar */}
        <div className="vs-jewelry-pedestal-bar">
          <div className="vs-jewelry-rotate-pill" title="Drag to Rotate Model">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Drag to Rotate</span>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="vs-jewelry-fullscreen-btn"
            title="Toggle Fullscreen View"
            aria-label="Toggle Fullscreen View"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Glass Customization Panel */}
      <div className="vs-jewelry-customizer-card" data-testid="jewelry-customizer-card">
        <h3 className="vs-jewelry-customizer-title">Customize Your Design</h3>

        {/* 3 Tabs: Metal, Stone, Style */}
        <div className="vs-jewelry-customizer-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'metal'}
            className={`vs-jewelry-tab-btn ${activeTab === 'metal' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('metal')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="14" r="6" />
              <polyline points="12 4 14 8 10 8 12 4" />
            </svg>
            <span>Metal</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'stone'}
            className={`vs-jewelry-tab-btn ${activeTab === 'stone' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('stone')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
            </svg>
            <span>Stone</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'style'}
            className={`vs-jewelry-tab-btn ${activeTab === 'style' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span>Style</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'metal' && (
          <div className="vs-jewelry-customizer-section">
            <span className="vs-jewelry-section-label">Metal Finish</span>
            <div className="vs-jewelry-swatches-grid">
              <button
                type="button"
                className={`vs-jewelry-swatch vs-jewelry-swatch--gold ${activeMetal === 'yellow' ? 'is-active' : ''}`}
                onClick={() => setActiveMetal('yellow')}
                title="18K Yellow Gold"
                aria-label="18K Yellow Gold finish"
              />
              <button
                type="button"
                className={`vs-jewelry-swatch vs-jewelry-swatch--rose ${activeMetal === 'rose' ? 'is-active' : ''}`}
                onClick={() => setActiveMetal('rose')}
                title="18K Rose Gold"
                aria-label="18K Rose Gold finish"
              />
              <button
                type="button"
                className={`vs-jewelry-swatch vs-jewelry-swatch--silver ${activeMetal === 'platinum' ? 'is-active' : ''}`}
                onClick={() => setActiveMetal('platinum')}
                title="Platinum 950 / White Gold"
                aria-label="Platinum 950 / White Gold finish"
              />
              <button
                type="button"
                className={`vs-jewelry-swatch vs-jewelry-swatch--black ${activeMetal === 'black' ? 'is-active' : ''}`}
                onClick={() => setActiveMetal('black')}
                title="Black Ruthenium"
                aria-label="Black Ruthenium finish"
              />
            </div>

            <span className="vs-jewelry-section-label" style={{ marginTop: '0.85rem' }}>Stone Shape</span>
            <div className="vs-jewelry-cuts-grid">
              <button
                type="button"
                className={`vs-jewelry-cut-icon-btn ${activeCut === 'round' ? 'is-active' : ''}`}
                onClick={() => setActiveCut('round')}
                title="Round Brilliant Cut"
                aria-label="Round Brilliant Cut"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <polygon points="12 5 17 9 15 16 9 16 7 9 12 5" />
                </svg>
              </button>
              <button
                type="button"
                className={`vs-jewelry-cut-icon-btn ${activeCut === 'princess' ? 'is-active' : ''}`}
                onClick={() => setActiveCut('princess')}
                title="Princess Cut"
                aria-label="Princess Cut"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <polygon points="12 6 18 12 12 18 6 12 12 6" />
                </svg>
              </button>
              <button
                type="button"
                className={`vs-jewelry-cut-icon-btn ${activeCut === 'oval' ? 'is-active' : ''}`}
                onClick={() => setActiveCut('oval')}
                title="Oval Cut"
                aria-label="Oval Cut"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <ellipse cx="12" cy="12" rx="7" ry="9" />
                  <ellipse cx="12" cy="12" rx="4" ry="6" />
                </svg>
              </button>
              <button
                type="button"
                className={`vs-jewelry-cut-icon-btn ${activeCut === 'pear' ? 'is-active' : ''}`}
                onClick={() => setActiveCut('pear')}
                title="Pear / Teardrop Cut"
                aria-label="Pear / Teardrop Cut"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 3 C12 3 6 11 6 16 A6 6 0 0 0 18 16 C18 11 12 3 12 3 Z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stone' && (
          <div className="vs-jewelry-customizer-section">
            <span className="vs-jewelry-section-label">Center Diamond Shape</span>
            <div className="vs-jewelry-cuts-grid">
              <button
                type="button"
                className={`vs-jewelry-cut-icon-btn ${activeCut === 'round' ? 'is-active' : ''}`}
                onClick={() => setActiveCut('round')}
                title="Round Brilliant Cut"
                aria-label="Round Brilliant Cut"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /></svg>
              </button>
              <button
                type="button"
                className={`vs-jewelry-cut-icon-btn ${activeCut === 'princess' ? 'is-active' : ''}`}
                onClick={() => setActiveCut('princess')}
                title="Princess Cut"
                aria-label="Princess Cut"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
              </button>
              <button
                type="button"
                className={`vs-jewelry-cut-icon-btn ${activeCut === 'oval' ? 'is-active' : ''}`}
                onClick={() => setActiveCut('oval')}
                title="Oval Cut"
                aria-label="Oval Cut"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><ellipse cx="12" cy="12" rx="7" ry="9" /></svg>
              </button>
              <button
                type="button"
                className={`vs-jewelry-cut-icon-btn ${activeCut === 'pear' ? 'is-active' : ''}`}
                onClick={() => setActiveCut('pear')}
                title="Pear Cut"
                aria-label="Pear Cut"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3 C12 3 6 11 6 16 A6 6 0 0 0 18 16 C18 11 12 3 12 3 Z" /></svg>
              </button>
            </div>

            <span className="vs-jewelry-section-label" style={{ marginTop: '0.85rem' }}>Diamond Carat Weight</span>
            <div className="vs-jewelry-carat-row">
              {[1.0, 1.5, 2.0, 3.0].map((carat) => (
                <button
                  key={carat}
                  type="button"
                  className={`vs-jewelry-carat-pill ${activeCarat === carat ? 'is-active' : ''}`}
                  onClick={() => setActiveCarat(carat)}
                >
                  {carat.toFixed(1)} CT
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="vs-jewelry-customizer-section">
            <span className="vs-jewelry-section-label">Ring Setting Style</span>
            <div className="vs-jewelry-style-row">
              <button
                type="button"
                className={`vs-jewelry-style-btn ${activeSetting === 'solitaire' ? 'is-active' : ''}`}
                onClick={() => setActiveSetting('solitaire')}
              >
                Classic Solitaire
              </button>
              <button
                type="button"
                className={`vs-jewelry-style-btn ${activeSetting === 'halo' ? 'is-active' : ''}`}
                onClick={() => setActiveSetting('halo')}
              >
                Halo Setting
              </button>
            </div>
          </div>
        )}

        {/* View in 3D Button */}
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-jewelry-view-3d-btn"
          data-testid="jewelry-view-in-3d-btn"
        >
          <span>View in 3D</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="Jewelry Configurator"
      productBadge="3D WebGPU Studio"
      productTagline="Physically-based real-time 3D diamond caustics, precious metals, and custom ring customization."
      brandName="VictorShell™"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Try Live Demo"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-jewelry-landing-page ${className}`.trim()}
      heroProps={{
        title: (
          <>
            Design, Customize &amp;<br />
            Visualize Jewelry in <span className="vs-gradient-text">3D</span>
          </>
        ),
        badge: <span className="vs-jewelry-hero-badge">💎 3D Jewelry Configurator</span>,
        description:
          'A photorealistic, real-time jewelry configurator with ray-traced rendering, multi-materials and instant design variations.',
        exploreDemoLabel: 'Try Live Demo',
        secondaryCta: {
          label: 'Book a Demo',
          href: '#cta',
          icon: (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          )
        },
        techBadges: [
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ),
            label: 'Real-Time',
            sublabel: 'Rendering'
          },
          {
            icon: (
              <span style={{ fontWeight: 800, fontSize: '13px', letterSpacing: '-0.02em' }}>4K</span>
            ),
            label: '4K',
            sublabel: 'Ultra Quality'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            ),
            label: 'PBR',
            sublabel: 'Materials'
          }
        ],
        featureHighlights: [
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            ),
            title: 'Realistic 3D Visualization',
            description: 'Photorealistic quality with ray-traced rendering.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            ),
            title: 'Complete Customization',
            description: 'Change metals, stones, sizes and styles in real time.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ),
            title: 'Fast & Seamless',
            description: 'Instant updates with high-performance WebGL.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            ),
            title: 'Cross-Platform',
            description: 'Works smoothly on desktop, tablet and mobile.'
          }
        ],
        visual: heroVisual,
        visualPosition: 'right'
      }}
      overviewProps={{
        id: 'overview',
        badge: 'Optical Gemology',
        title: 'Sub-Surface Refraction & Physical Diamond Caustics',
        subtitle: 'Simulating light ray dispersion through crystalline micro-facets',
        description:
          'Unlike standard glossy 3D shaders, the VictorShell Jewelry Configurator calculates real-time internal total reflection, chromatic aberration, and spectral wavelength splitting based on physical gemological equations (Cauchy formula, Abbe dispersion index 58.6). Light enters the crown, reflects within the pavilion facets, and exits as fiery rainbows.',
        highlights: [
          {
            title: 'Accurate Spectral Fire',
            text: 'Real-time wavelength splitting separates incoming white light into red, green, and violet caustic reflections inside the stone.'
          },
          {
            title: 'Anisotropic Metal Shaders',
            text: 'Physically modeled anisotropic micro-grooves accurately render polished platinum and brushed gold ring bands with realistic specular streaks.'
          },
          {
            title: 'Dynamic Gemstone Swapping',
            text: 'Seamless real-time swapping between round brilliant, princess, cushion, and emerald diamond cuts without model reloading delay.'
          }
        ],
        visual: (
          <div className="vs-jewelry-optical-card" data-testid="jewelry-optical-card">
            <div className="vs-jewelry-optical-card__header">
              <span className="vs-jewelry-optical-card__title">Physical Diamond Refraction (Abbe 58.6)</span>
              <span className="vs-jewelry-chip">DiamondPlugin WebGPU</span>
            </div>
            <div className="vs-jewelry-optical-card__body">
              <img
                src="/logos/jewel.png"
                alt="Jewelry Diamond Optical Refraction"
                className="vs-jewelry-optical-card__img"
                loading="lazy"
              />
            </div>
            <div className="vs-jewelry-optical-card__footer">
              <span className="vs-jewelry-optical-card__note">Total Internal Reflection · Chromatic Abbe Splitting</span>
            </div>
          </div>
        )
      }}
      featuresProps={{
        id: 'features',
        badge: 'Atelier Capabilities',
        sectionTitle: 'Luxury Craftsmanship Meets WebGPU Precision',
        sectionSubtitle:
          'Tools engineered for luxury maisons, bespoke jewelers, and high-conversion bridal e-commerce.',
        layout: 'grid',
        columns: 3,
        features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Ring Settings',
        sectionTitle: 'Explore Signature Ring Settings',
        sectionSubtitle:
          'Switch between handcrafted solitaire rings, halo pavé designs, and multi-gemstone clusters.',
        items: showcaseItems
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Prestige & Performance',
        sectionTitle: 'Why Luxury Maisons Choose VictorShell',
        sectionSubtitle: 'Zero rendering compromise, instant load speeds, and photorealistic gemological fidelity.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive Gem Studio',
        title: 'Experience the 3D Jewelry Configurator Live',
        description:
          'Step into the virtual jewelry atelier. Inspect diamond sparkle, switch precious metal bands, and customize diamond cuts in your browser.',
        exploreDemoLabel: 'Launch Jewelry Studio',
        exploreDemoHref: exploreDemoHref,
        note: 'High-precision WebGPU shaders · Mobile, tablet & desktop ready · Zero downloads'
      }}
    >
      {/* Dedicated Industry Use Cases Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="jewelry-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Luxury Verticals</span>
            <h2 className="vs-landing-use-cases__title">Tailored for Haute Joaillerie &amp; E-Commerce</h2>
            <p className="vs-landing-use-cases__subtitle">
              From bespoke atelier consultations to high-volume luxury bridal storefronts.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-atelier">
              <div className="vs-use-case-card__icon" aria-hidden="true">💎</div>
              <span className="vs-use-case-card__tag">Haute Joaillerie</span>
              <h3 className="vs-use-case-card__title">Bespoke Atelier Consultations</h3>
              <p className="vs-use-case-card__desc">
                Enable master jewelers to collaborate with private clients in real-time consultations, swapping rare gemstone cuts and noble metal alloys live on iPad or desktop.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-bridal">
              <div className="vs-use-case-card__icon" aria-hidden="true">💍</div>
              <span className="vs-use-case-card__tag">Luxury Bridal E-Commerce</span>
              <h3 className="vs-use-case-card__title">Custom Engagement Ring Builders</h3>
              <p className="vs-use-case-card__desc">
                Provide couples with an interactive 3D ring designer where they can inspect diamond fire, adjust carat weight, and preview band engravings with confidence.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-traders">
              <div className="vs-use-case-card__icon" aria-hidden="true">🔬</div>
              <span className="vs-use-case-card__tag">Diamond Trading &amp; Labs</span>
              <h3 className="vs-use-case-card__title">Certified Diamond Visualizer</h3>
              <p className="vs-use-case-card__desc">
                Showcase certified diamond proportions, pavilion depth, and optical light return metrics for online diamond bourses and gemological grading laboratories.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-retail">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏬</div>
              <span className="vs-use-case-card__tag">Retail &amp; Showrooms</span>
              <h3 className="vs-use-case-card__title">In-Store Interactive Kiosks</h3>
              <p className="vs-use-case-card__desc">
                Deploy silky 60 FPS touch kiosks in physical boutique showrooms, allowing walk-in customers to explore millions of diamond and metal combinations effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
