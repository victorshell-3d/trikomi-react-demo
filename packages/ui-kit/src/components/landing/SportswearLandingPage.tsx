import React, { useState, useRef } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import { Hero3DCanvas } from './Hero3DCanvas';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface SportswearLandingPageProps {
  /** Callback to launch the actual Sportswear Configurator 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/sportswear-configurator/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'violet'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * SportswearLandingPage
 *
 * Dedicated, luxury single-product landing page for the VictorShell Sportswear Configurator.
 * Rebuilt to match the approved VictorShell reference image:
 * - Left column: Category badge, heading with "in 3D" purple gradient, description, Try Live Demo & Book a Demo CTAs, 3 Tech Badges
 * - Center: Large realistic 3D sportswear jersey on marble pedestal with neon halo, Drag to Rotate pill, Fullscreen button
 * - Right: Floating glassmorphism Customization Panel with Design, Fabric, Logo, Text tabs
 * - Bottom: Four equal-width feature cards (Realistic 3D Visualization, Complete Customization, Fast & Seamless, Cross-Platform)
 */
export const SportswearLandingPage: React.FC<SportswearLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/sportswear-configurator/index.html#demo',
  theme = 'violet',
  className = ''
}) => {
  const stageRef = useRef<HTMLDivElement>(null);

  // Navigation anchors for single-page scroll layout matching reference
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#cta' }
  ];

  // Interactive Customizer State
  const [activeTab, setActiveTab] = useState<'design' | 'fabric' | 'logo' | 'text'>('design');
  const [activeColor, setActiveColor] = useState<'purple' | 'blue' | 'red' | 'orange' | 'white'>('purple');
  const [activePattern, setActivePattern] = useState<'sash' | 'waves' | 'dots' | 'hex' | 'chevron'>('sash');
  const [activeFabric, setActiveFabric] = useState<'mesh' | 'knit' | 'smooth' | 'pique' | 'jacquard'>('mesh');
  const [playerName, setPlayerName] = useState<string>('VICTOR');
  const [playerNumber, setPlayerNumber] = useState<string>('10');
  const [logoPosition, setLogoPosition] = useState<'chest' | 'left' | 'sleeve'>('chest');
  const [showSponsor, setShowSponsor] = useState<boolean>(true);

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // 6 Extended Features for the Features section
  const features: FeatureItem[] = [
    {
      id: 'dynamic-decals',
      title: 'Dynamic Vector Decals',
      description:
        'Upload custom SVG team crests and sponsor marks with real-time UV projection conforming to fabric seams.',
      badge: 'Core Engine',
      highlight: true
    },
    {
      id: 'fabric-shaders',
      title: 'Technical Fabric Shaders',
      description:
        'Switch between moisture-wicking technical mesh, heavy-duty interlock knit, and smooth poly with physically accurate sheen.',
      badge: 'Photorealistic PBR'
    },
    {
      id: 'player-typography',
      title: 'Player Names & Numbers',
      description:
        'Built-in vector typography engine rendering custom player names and jersey numbers with instant font and color control.',
      badge: 'Vector Canvas'
    },
    {
      id: 'studio-cameras',
      title: '4-Angle Studio Cameras',
      description:
        'Instant one-click camera pivots across Front, Back, Left Profile, and Right Profile angles for 360 inspection.',
      badge: 'Multi-Angle'
    },
    {
      id: 'garment-library',
      title: 'Multi-Sport Garment Models',
      description:
        'Production-accurate 3D models for Pro Soccer Jerseys, Rugby Match Kits, and Basketball Singlets with optimized GLTF geometry.',
      badge: 'GLTF / WebGPU'
    },
    {
      id: 'dieline-export',
      title: 'Factory Snapshot Export',
      description:
        'Generate high-resolution PNG renders and 2D sublimation UV dielines directly in the browser for instant manufacturing.',
      badge: 'Sublimation Pipeline'
    }
  ];

  // Benefits & Performance Metrics
  const benefits: BenefitItem[] = [
    {
      metric: '60 FPS',
      label: 'Real-Time WebGPU Render',
      description: 'Zero lag when updating decals, jersey numbers, and fabric shaders in real time.',
      tag: 'Hardware Accelerated'
    },
    {
      metric: '< 1.2s',
      label: 'Initial Kit Load Time',
      description: 'Draco-compressed GLTF models stream instantaneously on desktop and mobile browsers.',
      tag: 'Optimized Assets'
    },
    {
      metric: '$0 / hr',
      label: 'Client-Side Rendering Cost',
      description: 'All 3D calculations execute locally on user hardware with zero expensive server GPU costs.',
      tag: 'Serverless Architecture'
    },
    {
      metric: '100%',
      label: 'Color Channel Independence',
      description: '5 independent hex channels guarantee pixel-perfect brand color reproduction.',
      tag: 'Factory Accurate'
    }
  ];

  // Interactive Showcase Views
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'soccer-view',
      label: 'Pro Soccer Kit',
      badge: 'SoccerJersey.gltf',
      description:
        'High-performance soccer match jersey featuring raglan sleeves, ribbed collar, and breathable underarm mesh zones.',
      visual: (
        <div className="vs-sportswear-showcase-card" data-testid="showcase-soccer-preview">
          <div className="vs-sportswear-showcase-card__badge-row">
            <span className="vs-sportswear-chip">SoccerJersey.gltf</span>
            <span className="vs-sportswear-chip vs-sportswear-chip--accent">Technical Mesh · Raglan Cut</span>
          </div>
          <div className="vs-sportswear-showcase-card__visual">
            <img
              src="/logos/jersey.png"
              alt="Pro Soccer Kit 3D Preview"
              className="vs-sportswear-showcase-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-sportswear-showcase-card__meta">
            <span className="vs-sportswear-showcase-card__title">Athletic Match Jersey</span>
            <span className="vs-sportswear-showcase-card__spec">5 Color Zones · Chest & Sleeve Decals</span>
          </div>
        </div>
      )
    },
    {
      id: 'rugby-view',
      label: 'Rugby Match Kit',
      badge: 'RugbyJersey.gltf',
      description:
        'Reinforced heavy-duty rugby kit with heavy poly-interlock weave, reinforced collar placket, and high-impact stretch seams.',
      visual: (
        <div className="vs-sportswear-showcase-card" data-testid="showcase-rugby-preview">
          <div className="vs-sportswear-showcase-card__badge-row">
            <span className="vs-sportswear-chip">RugbyJersey.gltf</span>
            <span className="vs-sportswear-chip vs-sportswear-chip--accent">Interlock Knit · Heavy Poly</span>
          </div>
          <div className="vs-sportswear-showcase-card__visual">
            <img
              src="/logos/jersey.png"
              alt="Rugby Match Kit 3D Preview"
              className="vs-sportswear-showcase-card__img vs-sportswear-showcase-card__img--alt"
              loading="lazy"
            />
          </div>
          <div className="vs-sportswear-showcase-card__meta">
            <span className="vs-sportswear-showcase-card__title">Heavyweight Rugby Kit</span>
            <span className="vs-sportswear-showcase-card__spec">Reinforced Seams · Sublimation Ready</span>
          </div>
        </div>
      )
    },
    {
      id: 'basketball-view',
      label: 'Basketball Singlet',
      badge: 'BasketballSinglet.gltf',
      description:
        'Ultralight sleeveless basketball jersey with deep armholes, rib-knit binding, and open-hole athletic mesh for elite court speed.',
      visual: (
        <div className="vs-sportswear-showcase-card" data-testid="showcase-basketball-preview">
          <div className="vs-sportswear-showcase-card__badge-row">
            <span className="vs-sportswear-chip">BasketballSinglet.gltf</span>
            <span className="vs-sportswear-chip vs-sportswear-chip--accent">Open-Hole Mesh · Sleeveless</span>
          </div>
          <div className="vs-sportswear-showcase-card__visual">
            <img
              src="/logos/jersey.png"
              alt="Basketball Singlet 3D Preview"
              className="vs-sportswear-showcase-card__img vs-sportswear-showcase-card__img--alt2"
              loading="lazy"
            />
          </div>
          <div className="vs-sportswear-showcase-card__meta">
            <span className="vs-sportswear-showcase-card__title">Pro Basketball Singlet</span>
            <span className="vs-sportswear-showcase-card__spec">Dual-Tone Piping · Large Number Canvas</span>
          </div>
        </div>
      )
    }
  ];

  // Hero visual stage with marble pedestal, glowing halo, Drag to Rotate pill, Fullscreen, and Floating Glass Panel
  const heroVisual = (
    <div ref={stageRef} className="vs-sportswear-hero-showcase" data-testid="sportswear-hero-stage">
      {/* 3D Sportswear Stage with Marble Pedestal & Halo */}
      <div className="vs-sportswear-hero-stage__viewport">
        <Hero3DCanvas
          modelUrl="/models/SoccerJersey.gltf"
          preset="sportswear"
          activeMaterial={activeFabric}
          activeVariant={activePattern}
          activeColor={activeColor}
          activeNumber={playerNumber}
        />

        {/* Floating Pedestal Interaction Bar */}
        <div className="vs-sportswear-pedestal-bar">
          <div className="vs-sportswear-rotate-pill" title="Drag to Rotate Jersey">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Drag to Rotate</span>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="vs-sportswear-fullscreen-btn"
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
      <div className="vs-sportswear-customizer-card" data-testid="sportswear-customizer-card">
        <h3 className="vs-sportswear-customizer-title">Customize Your Design</h3>

        {/* 4 Tabs: Design, Fabric, Logo, Text */}
        <div className="vs-sportswear-customizer-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'design'}
            className={`vs-sportswear-tab-btn ${activeTab === 'design' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('design')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
            <span>Design</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'fabric'}
            className={`vs-sportswear-tab-btn ${activeTab === 'fabric' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('fabric')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
            <span>Fabric</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'logo'}
            className={`vs-sportswear-tab-btn ${activeTab === 'logo' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('logo')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Logo</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'text'}
            className={`vs-sportswear-tab-btn ${activeTab === 'text' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="9" y1="20" x2="15" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
            <span>Text</span>
          </button>
        </div>

        {/* Tab 1: Design (Base Color, Pattern, Fabric Type) */}
        {activeTab === 'design' && (
          <>
            {/* Section: Base Color */}
            <div className="vs-sportswear-customizer-section">
              <span className="vs-sportswear-section-label">Base Color</span>
              <div className="vs-sportswear-swatches-grid">
                <button
                  type="button"
                  className={`vs-sportswear-swatch vs-sportswear-swatch--purple ${activeColor === 'purple' ? 'is-active' : ''}`}
                  onClick={() => setActiveColor('purple')}
                  title="Royal Purple (#7628D9)"
                  aria-label="Royal Purple color"
                />
                <button
                  type="button"
                  className={`vs-sportswear-swatch vs-sportswear-swatch--blue ${activeColor === 'blue' ? 'is-active' : ''}`}
                  onClick={() => setActiveColor('blue')}
                  title="Electric Blue (#2563EB)"
                  aria-label="Electric Blue color"
                />
                <button
                  type="button"
                  className={`vs-sportswear-swatch vs-sportswear-swatch--red ${activeColor === 'red' ? 'is-active' : ''}`}
                  onClick={() => setActiveColor('red')}
                  title="Crimson Red (#DC2626)"
                  aria-label="Crimson Red color"
                />
                <button
                  type="button"
                  className={`vs-sportswear-swatch vs-sportswear-swatch--orange ${activeColor === 'orange' ? 'is-active' : ''}`}
                  onClick={() => setActiveColor('orange')}
                  title="Energy Orange (#EA580C)"
                  aria-label="Energy Orange color"
                />
                <button
                  type="button"
                  className={`vs-sportswear-swatch vs-sportswear-swatch--white ${activeColor === 'white' ? 'is-active' : ''}`}
                  onClick={() => setActiveColor('white')}
                  title="Pure White (#FFFFFF)"
                  aria-label="Pure White color"
                />
              </div>
            </div>

            {/* Section: Pattern */}
            <div className="vs-sportswear-customizer-section">
              <span className="vs-sportswear-section-label">Pattern</span>
              <div className="vs-sportswear-patterns-grid">
                <button
                  type="button"
                  className={`vs-sportswear-pattern-btn ${activePattern === 'sash' ? 'is-active' : ''}`}
                  onClick={() => setActivePattern('sash')}
                  title="Diagonal Lightning Sash"
                  aria-label="Diagonal Lightning Sash pattern"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="4" y1="20" x2="16" y2="4" />
                    <line x1="8" y1="20" x2="20" y2="4" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vs-sportswear-pattern-btn ${activePattern === 'waves' ? 'is-active' : ''}`}
                  onClick={() => setActivePattern('waves')}
                  title="Aerodynamic Twin Waves"
                  aria-label="Aerodynamic Twin Waves pattern"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 9 Q 7 4 12 9 T 22 9" />
                    <path d="M2 15 Q 7 10 12 15 T 22 15" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vs-sportswear-pattern-btn ${activePattern === 'dots' ? 'is-active' : ''}`}
                  onClick={() => setActivePattern('dots')}
                  title="Gradient Perforated Dots"
                  aria-label="Gradient Perforated Dots pattern"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <circle cx="5" cy="5" r="2" />
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="19" cy="5" r="2" />
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                    <circle cx="5" cy="19" r="2" />
                    <circle cx="12" cy="19" r="2" />
                    <circle cx="19" cy="19" r="2" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vs-sportswear-pattern-btn ${activePattern === 'hex' ? 'is-active' : ''}`}
                  onClick={() => setActivePattern('hex')}
                  title="Honeycomb Tech Hexagons"
                  aria-label="Honeycomb Tech Hexagons pattern"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 3 19 7 19 15 12 19 5 15 5 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vs-sportswear-pattern-btn ${activePattern === 'chevron' ? 'is-active' : ''}`}
                  onClick={() => setActivePattern('chevron')}
                  title="Athletic Chevron Stripes"
                  aria-label="Athletic Chevron Stripes pattern"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="5 9 12 15 19 9" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Section: Fabric Type */}
            <div className="vs-sportswear-customizer-section">
              <span className="vs-sportswear-section-label">Fabric Type</span>
              <div className="vs-sportswear-fabrics-grid">
                <button
                  type="button"
                  className={`vs-sportswear-fabric-btn ${activeFabric === 'mesh' ? 'is-active' : ''}`}
                  onClick={() => setActiveFabric('mesh')}
                  title="Breathable Athletic Mesh (160 GSM)"
                  aria-label="Breathable Athletic Mesh"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                    <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                    <circle cx="7" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="17" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="7" cy="17" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="17" r="1.5" fill="currentColor" />
                    <circle cx="17" cy="17" r="1.5" fill="currentColor" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vs-sportswear-fabric-btn ${activeFabric === 'knit' ? 'is-active' : ''}`}
                  onClick={() => setActiveFabric('knit')}
                  title="Interlock Ribbed Knit (220 GSM)"
                  aria-label="Interlock Ribbed Knit"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="6" y1="4" x2="6" y2="20" />
                    <line x1="10" y1="4" x2="10" y2="20" />
                    <line x1="14" y1="4" x2="14" y2="20" />
                    <line x1="18" y1="4" x2="18" y2="20" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vs-sportswear-fabric-btn ${activeFabric === 'smooth' ? 'is-active' : ''}`}
                  onClick={() => setActiveFabric('smooth')}
                  title="Silky Poly Tricot with Sheen"
                  aria-label="Silky Poly Tricot"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 16c4 0 6-8 10-8s4 8 6 8" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vs-sportswear-fabric-btn ${activeFabric === 'pique' ? 'is-active' : ''}`}
                  onClick={() => setActiveFabric('pique')}
                  title="Matte Moisture-Wicking Pique"
                  aria-label="Matte Moisture-Wicking Pique"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="5" width="4" height="4" />
                    <rect x="15" y="5" width="4" height="4" />
                    <rect x="10" y="10" width="4" height="4" />
                    <rect x="5" y="15" width="4" height="4" />
                    <rect x="15" y="15" width="4" height="4" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vs-sportswear-fabric-btn ${activeFabric === 'jacquard' ? 'is-active' : ''}`}
                  onClick={() => setActiveFabric('jacquard')}
                  title="Engineered Jacquard Knit"
                  aria-label="Engineered Jacquard Knit"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 4 19 12 12 20 5 12" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Fabric Specs */}
        {activeTab === 'fabric' && (
          <div className="vs-sportswear-customizer-section" style={{ gap: '0.65rem' }}>
            <span className="vs-sportswear-section-label">Selected Fabric Details</span>
            <div style={{ background: 'var(--vs-soft-lavender, #EDE5FF)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Material:</span>
                <span style={{ fontWeight: 700, color: 'var(--vs-ink)' }}>
                  {activeFabric === 'mesh' ? 'Athletic Micro-Mesh' :
                   activeFabric === 'knit' ? 'Interlock Ribbed Poly' :
                   activeFabric === 'smooth' ? 'Silky Polyester Tricot' :
                   activeFabric === 'pique' ? 'Matte Hydrophilic Pique' : 'Engineered Jacquard'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Weight:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>160 GSM Light</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Breathability:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-primary)' }}>98.4% Air Permeable</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Stretch:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>4-Way Spandex Blend</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Logo & Decals */}
        {activeTab === 'logo' && (
          <div className="vs-sportswear-customizer-section" style={{ gap: '0.65rem' }}>
            <span className="vs-sportswear-section-label">Team Crest Placement</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {(['chest', 'left', 'sleeve'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setLogoPosition(pos)}
                  style={{
                    padding: '0.45rem',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    border: logoPosition === pos ? '1.5px solid var(--vs-primary)' : '1px solid var(--vs-light-lavender-border)',
                    background: logoPosition === pos ? 'var(--vs-soft-lavender)' : '#FFFFFF',
                    color: logoPosition === pos ? 'var(--vs-primary)' : 'var(--vs-ink-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {pos === 'chest' ? 'Center' : pos === 'left' ? 'Left Chest' : 'Sleeve'}
                </button>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.76rem', color: 'var(--vs-ink)' }}>
              <input
                type="checkbox"
                checked={showSponsor}
                onChange={(e) => setShowSponsor(e.target.checked)}
                style={{ accentColor: 'var(--vs-primary)' }}
              />
              Show Vector Sponsor Mark
            </label>
          </div>
        )}

        {/* Tab 4: Player Name & Number */}
        {activeTab === 'text' && (
          <div className="vs-sportswear-customizer-section" style={{ gap: '0.65rem' }}>
            <span className="vs-sportswear-section-label">Player Typography</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--vs-ink-muted)' }}>
                Player Name:
                <input
                  type="text"
                  value={playerName}
                  maxLength={12}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    marginTop: '2px',
                    borderRadius: '8px',
                    border: '1px solid var(--vs-light-lavender-border)',
                    fontFamily: 'var(--vs-font-display)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    color: 'var(--vs-ink)',
                    background: '#FFFFFF'
                  }}
                />
              </label>
              <label style={{ fontSize: '0.72rem', color: 'var(--vs-ink-muted)' }}>
                Jersey Number:
                <input
                  type="text"
                  value={playerNumber}
                  maxLength={2}
                  onChange={(e) => setPlayerNumber(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    marginTop: '2px',
                    borderRadius: '8px',
                    border: '1px solid var(--vs-light-lavender-border)',
                    fontFamily: 'var(--vs-font-display)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    color: 'var(--vs-primary)',
                    background: '#FFFFFF'
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {/* View in 3D Button */}
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-sportswear-view-3d-btn"
          data-testid="sportswear-view-3d-btn"
        >
          <span>View in 3D</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="Sportswear Configurator"
      productBadge="3D Sportswear Configurator"
      productTagline="A real-time sportswear configurator to design jerseys, hoodies, and team kits with full customization, realistic fabrics and instant 3D preview."
      brandName="VictorShell"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Try Live Demo"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-sportswear-landing-page ${className}`.trim()}
      heroProps={{
        title: (
          <>
            Design, Customize &<br />
            Visualize Sportswear <span className="vs-gradient-text">in 3D</span>
          </>
        ),
        badge: (
          <span className="vs-sportswear-hero-badge">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
            3D Sportswear Configurator
          </span>
        ),
        description:
          'A real-time sportswear configurator to design jerseys, hoodies, and team kits with full customization, realistic fabrics and instant 3D preview.',
        exploreDemoLabel: 'Try Live Demo',
        secondaryCta: {
          label: 'Book a Demo',
          href: '#cta',
          icon: (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          )
        },
        // Three Technical Badges beneath CTAs matching reference
        techBadges: [
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ),
            label: 'Real-Time',
            sublabel: 'Rendering'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M7 9v6h3v-3h-3" />
                <path d="M14 9v6l3-3" />
              </svg>
            ),
            label: '4K',
            sublabel: 'Ultra Quality'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            ),
            label: 'PBR',
            sublabel: 'Materials'
          }
        ],
        // Four Feature Cards matching exact reference text and icons
        featureHighlights: [
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            ),
            title: 'Realistic 3D Visualization',
            description: 'See your design in true-to-life 3D with realistic fabric, fit and detail.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            description: 'Change colors, patterns, logos, text and fabric in real time.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ),
            title: 'Fast & Seamless',
            description: 'Instant updates with high-performance WebGL.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        badge: 'Technical Overview',
        title: 'True-to-Scale Fabric Simulation & Sublimation Pipeline',
        subtitle: 'From 3D interactive design directly to precision manufacturing-ready sublimation patterns.',
        narrative:
          'The VictorShell Sportswear Configurator unites WebGPU real-time 3D rendering with a direct sublimation dieline generator. Seamlessly map SVG emblems and sponsor graphics across 3D garment seams while previewing physically based fabric microfacet normals.',
        highlights: [
          {
            title: 'Dynamic Seam Decals',
            description: 'Scalable vector emblems conform to garment geometry without texture stretching or pixelation.'
          },
          {
            title: 'Sublimation Dielines',
            description: 'Instant millimeter-accurate SVG and PDF export formatted directly for digital fabric cutters.'
          },
          {
            title: 'Team Roster Batching',
            description: 'Automate hundreds of player names and numbers across the full roster in a single export.'
          }
        ],
        visual: (
          <div className="vs-sportswear-dieline-card" data-testid="sportswear-dieline-card">
            <div className="vs-sportswear-dieline-card__header">
              <span className="vs-sportswear-dieline-card__title">Sublimation Pattern &amp; Zone Mapping</span>
              <span className="vs-sportswear-chip">5 Seam Panels</span>
            </div>
            <div className="vs-sportswear-dieline-card__visual">
              <img
                src="/textures/FTB20_01.svg"
                alt="2D Vector Sublimation Pattern"
                className="vs-sportswear-dieline-card__img"
                loading="lazy"
              />
            </div>
          </div>
        )
      }}
      featuresProps={{
        id: 'features',
        badge: 'Core Capabilities',
        sectionTitle: 'Engineered for Performance Athletics',
        sectionSubtitle: 'Sub-millimeter accurate sublimation mapping meets real-time 3D garment simulation.',
        features,
        layout: 'grid',
        columns: 3
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Garment Models',
        title: 'Pro Sport Garment Architecture',
        subtitle: 'Inspect production-ready match kits with realistic technical fabrics and raglan sleeve construction.',
        items: showcaseItems,
        activeId: 'soccer-view'
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Production Metrics',
        title: 'High-Throughput Sublimation Pipeline',
        subtitle: 'Engineered to accelerate athletic manufacturing from initial concept to digital fabric cutter.',
        items: benefits,
        columns: 4
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Ready to Design?',
        title: 'Launch the Sportswear 3D Studio',
        subtitle: 'Design custom match kits with dynamic vector decals and instant sublimation dielines.',
        primaryAction: {
          label: 'Launch 3D Configurator',
          onClick: onExploreDemo,
          href: exploreDemoHref
        },
        secondaryAction: {
          label: 'Book a Demo',
          href: '#cta'
        },
        reassurance: 'Production 4K WebGL · Vector Dieline Export · Zero Plugins Required'
      }}
    />
  );
};
