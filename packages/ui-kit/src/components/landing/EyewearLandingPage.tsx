import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import { Hero3DCanvas } from './Hero3DCanvas';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface EyewearLandingPageProps {
  /** Callback to launch the actual Eyewear Try-On 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/eyewear-tryon/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'violet'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * EyewearLandingPage
 *
 * Dedicated, premium single-product landing page for the VictorShell Eyewear Try-On platform.
 * Built using the Frosted Glass design system and Task 22/23/24 reusable components.
 * Focuses exclusively on WebGPU Virtual Eyewear Fitting:
 * - Sub-millimeter 3D facial landmark mesh estimation (478 points via MediaPipe tasks-vision)
 * - Automated real-time pupillary distance (PD / IPD) calibration
 * - Full cranial 3D head occluder for realistic temple arm depth behind ears
 * - Dynamic PBR frame materials (acetate, titanium, gold) and optical anti-reflective lens shaders
 * - 6 curated designer silhouettes (Aviator, Wayfarer, Clubmaster, Round Metal, Sport Wrap, Hexagonal)
 * - Cross-platform zero-plugin web execution at 60 FPS
 */
export const EyewearLandingPage: React.FC<EyewearLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/eyewear-tryon/index.html#demo',
  theme = 'violet',
  className = ''
}) => {
  // Navigation anchors for single-page scroll layout matching reference navbar
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#cta' }
  ];

  // Interactive state for hero stage matching reference
  const [activeFrameColor, setActiveFrameColor] = useState<'black' | 'tortoise' | 'brown' | 'crystal' | 'blue'>('black');
  const [activeLensColor, setActiveLensColor] = useState<'purple' | 'clear' | 'dark' | 'blue' | 'rose'>('purple');
  const [activeTab, setActiveTab] = useState<'frame' | 'lens' | 'style'>('frame');
  const stageRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const silhouettes = [
    { id: 'wayfarer', name: 'Wayfarer Classic', code: 'MOD-01', width: '142 mm', bridge: '18 mm' },
    { id: 'aviator', name: 'Aviator Vintage', code: 'MOD-02', width: '138 mm', bridge: '14 mm' },
    { id: 'clubmaster', name: 'Clubmaster Retro', code: 'MOD-03', width: '140 mm', bridge: '20 mm' },
    { id: 'round', name: 'Round Metal', code: 'MOD-04', width: '132 mm', bridge: '21 mm' },
    { id: 'sport', name: 'Sport Wrap', code: 'MOD-05', width: '146 mm', bridge: '12 mm' },
    { id: 'hexagonal', name: 'Hexagonal Geometric', code: 'MOD-06', width: '136 mm', bridge: '19 mm' }
  ];

  // 6 Verified Bento Features
  const features: FeatureItem[] = [
    {
      id: 'sub-millimeter-tracking',
      title: '478-Point 3D Facial Landmarks',
      description:
        'Leverages MediaPipe vision task AI running client-side in WebGPU/WebGL to lock 3D frame geometry to the user’s nose bridge, temples, and brow with zero perceptible latency.',
      badge: 'Sub-Millimeter Tracking',
      highlight: true
    },
    {
      id: 'automated-pd',
      title: 'Automated Pupillary Distance (PD)',
      description:
        'Calculates real-time interpupillary distance (IPD) calibrated against camera intrinsic parameters, giving customers precision frame sizing guidance before ordering.',
      badge: 'Optical Calibration'
    },
    {
      id: 'cranial-occlusion',
      title: 'Full Cranial 3D Head Occluder',
      description:
        'Solves the floating-glasses artifact with a calibrated 3D anatomical skull depth mask, allowing temple arms to naturally disappear behind the ears and cheekbones.',
      badge: 'Realistic Depth'
    },
    {
      id: 'pbr-optics',
      title: 'PBR Optics & Anti-Reflective Shaders',
      description:
        'Simulates multi-layer optical coatings, Fresnel edge reflectance, polarized attenuation, and realistic studio environment reflections across both lenses and frames.',
      badge: 'Optical Physics'
    },
    {
      id: 'curated-silhouettes',
      title: '6 Curated Designer Silhouettes',
      description:
        'Includes Aviator Classic, Wayfarer, Clubmaster, Round Metal, Sport Wrap, and Hexagonal models, fully optimized with Draco geometry compression.',
      badge: 'Designer Library'
    },
    {
      id: 'zero-plugin-engine',
      title: 'Universal Zero-Plugin Web Engine',
      description:
        'Runs directly in mobile Safari (iOS), mobile Chrome (Android), and desktop browsers without App Store downloads or browser extensions.',
      badge: 'Zero Friction'
    }
  ];

  // 3 Showcase Modes
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'optical-prescription',
      label: 'Optical Prescription Fitting',
      badge: 'glasses1.glb',
      description:
        'Combines automated pupillary distance measurement, bridge width assessment, and progressive lens optical alignment for prescription retail customers.',
      visual: (
        <div className="vs-eyewear-preview-card" data-testid="showcase-optical-preview">
          <div className="vs-eyewear-preview-card__badge-row">
            <span className="vs-eyewear-chip">glasses1.glb</span>
            <span className="vs-eyewear-chip vs-eyewear-chip--accent">Rx Optical Alignment</span>
          </div>
          <div className="vs-eyewear-preview-card__visual">
            <img
              src="/logos/eyewear.png"
              alt="VictorShell Optical Prescription Eyewear"
              className="vs-eyewear-preview-card__img vs-eyewear-preview-card__img--optical"
              loading="lazy"
            />
          </div>
          <div className="vs-eyewear-preview-card__meta">
            <span className="vs-eyewear-preview-card__title">Precision Optical Rx Fitting</span>
            <span className="vs-eyewear-preview-card__spec">Pupillary Distance: 63.5mm · Bridge: 18mm · Anti-Reflective Crizal</span>
          </div>
        </div>
      )
    },
    {
      id: 'sun-polarized',
      label: 'Designer Sunglasses & Coatings',
      badge: 'glasses2.glb',
      description:
        'Showcase gradient tints, polarized UV400 filters, flash mirror coatings, and metallic luster with dynamic lighting that reacts to head movement.',
      visual: (
        <div className="vs-eyewear-preview-card" data-testid="showcase-sun-preview">
          <div className="vs-eyewear-preview-card__badge-row">
            <span className="vs-eyewear-chip">glasses2.glb</span>
            <span className="vs-eyewear-chip vs-eyewear-chip--accent">Polarized UV400</span>
          </div>
          <div className="vs-eyewear-preview-card__visual">
            <img
              src="/logos/eyewear.png"
              alt="VictorShell Designer Sunglasses"
              className="vs-eyewear-preview-card__img vs-eyewear-preview-card__img--sun"
              loading="lazy"
            />
          </div>
          <div className="vs-eyewear-preview-card__meta">
            <span className="vs-eyewear-preview-card__title">Designer Sunglasses &amp; Coatings</span>
            <span className="vs-eyewear-preview-card__spec">Transmission: 15% · PBR Studio HDRI · Gradient Polarized Tint</span>
          </div>
        </div>
      )
    },
    {
      id: 'sport-aerodynamic',
      label: 'Performance Sports Wraps',
      badge: 'glasses3.glb',
      description:
        'Simulate high-curvature base-8 wrapped frames with non-slip temporal arms, cranial wrap verification, and high-impact aerodynamic styling.',
      visual: (
        <div className="vs-eyewear-preview-card" data-testid="showcase-sport-preview">
          <div className="vs-eyewear-preview-card__badge-row">
            <span className="vs-eyewear-chip">glasses3.glb</span>
            <span className="vs-eyewear-chip vs-eyewear-chip--accent">Base-8 Aerodynamic Wrap</span>
          </div>
          <div className="vs-eyewear-preview-card__visual">
            <img
              src="/logos/eyewear.png"
              alt="VictorShell Performance Sports Wraps"
              className="vs-eyewear-preview-card__img vs-eyewear-preview-card__img--sport"
              loading="lazy"
            />
          </div>
          <div className="vs-eyewear-preview-card__meta">
            <span className="vs-eyewear-preview-card__title">Performance Sports Wraps</span>
            <span className="vs-eyewear-preview-card__spec">Base-8 Curvature · Temporal Grip · Non-Slip Occlusion</span>
          </div>
        </div>
      )
    }
  ];

  // 4 Core Technical Benefits
  const benefits: BenefitItem[] = [
    {
      id: 'benefit-occlusion',
      title: 'Flawless Cranial Occlusion',
      description:
        'Proprietary 3D head mesh depth rendering eliminates the unrealistic visual artifact of temple arms floating beside or clipping through human hair and ears.',
      metric: 'Depth Pass',
      metricLabel: 'Zero Temple Arm Clipping'
    },
    {
      id: 'benefit-pd',
      title: 'Accurate Pupillary Calibration',
      description:
        'Real-time IPD measurement accurately maps millimeter distance between eye centers using computer vision face mesh triangulation and sensor focal length.',
      metric: '±0.8 mm',
      metricLabel: 'Calibrated Accuracy'
    },
    {
      id: 'benefit-latency',
      title: 'Fluid 60 FPS Tracking',
      description:
        'High-performance WebGPU compute shaders and MediaPipe landmarks guarantee stutter-free tracking during natural head turns, pitches, and smiles.',
      metric: '< 16 ms',
      metricLabel: 'Motion-to-Photon Latency'
    },
    {
      id: 'benefit-pbr',
      title: 'Physically Accurate Optical Shaders',
      description:
        'Real-time PBR material models simulate refraction indices, Fresnel reflection equations, and surface microfacet roughness under realistic studio HDRI illumination.',
      metric: '100% PBR',
      metricLabel: 'Dielectric & Metallic Materials'
    }
  ];

  // Hero visual stage with marble pedestal, glowing halo, Drag to Rotate pill, Fullscreen, and Floating Glass Panel
  const heroVisual = (
    <div ref={stageRef} className="vs-eyewear-hero-showcase" data-testid="eyewear-hero-stage">
      {/* 3D Eyewear Stage with Pedestal & Halo */}
      <div className="vs-eyewear-hero-stage__viewport">
        <Hero3DCanvas
          modelUrl="/models/glasses.glb"
          preset="eyewear"
          activeMaterial={activeFrameColor}
          activeVariant={activeLensColor}
        />

        {/* Floating Pedestal Interaction Bar */}
        <div className="vs-eyewear-pedestal-bar">
          <div className="vs-eyewear-rotate-pill" title="Drag to Rotate Model">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Drag to Rotate</span>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="vs-eyewear-fullscreen-btn"
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
      <div className="vs-eyewear-customizer-card" data-testid="eyewear-customizer-card">
        <h3 className="vs-eyewear-customizer-title">Customize Your Design</h3>

        {/* 3 Tabs: Frame, Lens, Style */}
        <div className="vs-eyewear-customizer-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'frame'}
            className={`vs-eyewear-tab-btn ${activeTab === 'frame' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('frame')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="12" r="3" />
              <line x1="9" y1="12" x2="15" y2="12" />
            </svg>
            <span>Frame</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'lens'}
            className={`vs-eyewear-tab-btn ${activeTab === 'lens' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('lens')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path d="M9 7l6 10M9 11l4 6" />
            </svg>
            <span>Lens</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'style'}
            className={`vs-eyewear-tab-btn ${activeTab === 'style' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3-4 6-2-3-4-4-4-6a4 4 0 0 1 4-4z" />
              <path d="M12 22a4 4 0 0 1-4-4c0-2 2-3 4-6 2 3 4 4 4 6a4 4 0 0 1-4 4z" />
              <path d="M22 12a4 4 0 0 1-4 4c-2 0-3-2-6-4 3-2 4-4 6-4a4 4 0 0 1 4 4z" />
              <path d="M2 12a4 4 0 0 1 4-4c2 0 3 2 6 4-3 2-4 4-6 4a4 4 0 0 1-4-4z" />
            </svg>
            <span>Style</span>
          </button>
        </div>

        {/* Tab 1: Frame Color */}
        <div className="vs-eyewear-customizer-section">
          <span className="vs-eyewear-section-label">Frame Color</span>
          <div className="vs-eyewear-swatches-grid">
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--black ${activeFrameColor === 'black' ? 'is-active' : ''}`}
              onClick={() => setActiveFrameColor('black')}
              title="Glossy Black Acetate"
              aria-label="Glossy Black Acetate"
            />
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--tortoise ${activeFrameColor === 'tortoise' ? 'is-active' : ''}`}
              onClick={() => setActiveFrameColor('tortoise')}
              title="Havana Tortoiseshell"
              aria-label="Havana Tortoiseshell"
            />
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--brown ${activeFrameColor === 'brown' ? 'is-active' : ''}`}
              onClick={() => setActiveFrameColor('brown')}
              title="Classic Dark Brown"
              aria-label="Classic Dark Brown"
            />
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--crystal ${activeFrameColor === 'crystal' ? 'is-active' : ''}`}
              onClick={() => setActiveFrameColor('crystal')}
              title="Clear Crystal / Silver"
              aria-label="Clear Crystal / Silver"
            />
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--blue ${activeFrameColor === 'blue' ? 'is-active' : ''}`}
              onClick={() => setActiveFrameColor('blue')}
              title="Matte Ocean Blue"
              aria-label="Matte Ocean Blue"
            />
          </div>
        </div>

        {/* Tab 2: Lens Type */}
        <div className="vs-eyewear-customizer-section">
          <span className="vs-eyewear-section-label">Lens Type</span>
          <div className="vs-eyewear-swatches-grid">
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--clear ${activeLensColor === 'clear' ? 'is-active' : ''}`}
              onClick={() => setActiveLensColor('clear')}
              title="Clear Optical AR"
              aria-label="Clear Optical AR"
            />
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--dark ${activeLensColor === 'dark' ? 'is-active' : ''}`}
              onClick={() => setActiveLensColor('dark')}
              title="Polarized Dark Gray"
              aria-label="Polarized Dark Gray"
            />
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--lens-blue ${activeLensColor === 'blue' ? 'is-active' : ''}`}
              onClick={() => setActiveLensColor('blue')}
              title="Blue Gradient UV400"
              aria-label="Blue Gradient UV400"
            />
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--purple ${activeLensColor === 'purple' ? 'is-active' : ''}`}
              onClick={() => setActiveLensColor('purple')}
              title="Purple Violet Gradient"
              aria-label="Purple Violet Gradient"
            />
            <button
              type="button"
              className={`vs-eyewear-swatch vs-eyewear-swatch--rose ${activeLensColor === 'rose' ? 'is-active' : ''}`}
              onClick={() => setActiveLensColor('rose')}
              title="Rose Sunset Gradient"
              aria-label="Rose Sunset Gradient"
            />
          </div>
        </div>

        {/* View in 3D Button */}
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-eyewear-view-3d-btn"
          data-testid="eyewear-view-in-3d-btn"
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

  // Overview Anatomical Alignment Visual Card
  const overviewVisual = (
    <div className="vs-eyewear-anatomical-card">
      <div className="vs-eyewear-anatomical-card__header">
        <span className="vs-eyewear-anatomical-card__title">Cranial Depth & IPD Geometry</span>
        <span className="vs-eyewear-anatomical-card__badge">Live Depth Pass</span>
      </div>
      <div className="vs-eyewear-anatomical-card__body">
        <div className="vs-eyewear-anatomical-metric">
          <span className="vs-eyewear-anatomical-metric__val">478</span>
          <span className="vs-eyewear-anatomical-metric__lbl">Landmark Vertices</span>
          <span className="vs-eyewear-anatomical-metric__sub">Full 3D Facial Mesh</span>
        </div>
        <div className="vs-eyewear-anatomical-metric">
          <span className="vs-eyewear-anatomical-metric__val">&lt; 1.0mm</span>
          <span className="vs-eyewear-anatomical-metric__lbl">Pupillary Tolerance</span>
          <span className="vs-eyewear-anatomical-metric__sub">Camera Intrinsic Calibration</span>
        </div>
        <div className="vs-eyewear-anatomical-metric">
          <span className="vs-eyewear-anatomical-metric__val">100%</span>
          <span className="vs-eyewear-anatomical-metric__lbl">Ear Occlusion</span>
          <span className="vs-eyewear-anatomical-metric__sub">head_occluder.obj Volume</span>
        </div>
      </div>
      <div className="vs-eyewear-anatomical-card__footer">
        <span className="vs-eyewear-anatomical-card__note">
          Zero video stream leaves the client browser · 100% private WebAssembly processing
        </span>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="Eyewear Configurator"
      productBadge="3D WebGPU Studio"
      productTagline="Sub-millimeter 3D facial landmark fitting, automated PD measurement, and realistic cranial occlusion."
      brandName="VictorShell™"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoHref={exploreDemoHref}
      exploreDemoLabel="Try Live Demo"
      navLinks={navLinks}
      className={`vs-eyewear-landing-page ${className}`.trim()}
      heroProps={{
        title: (
          <>
            Design, Customize &amp;<br />
            Try Eyewear in <span className="vs-gradient-text">3D</span>
          </>
        ),
        badge: (
          <span className="vs-eyewear-hero-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="12" r="3" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <path d="M3 12h-1M22 12h-1" />
            </svg>
            <span>3D Eyewear Configurator</span>
          </span>
        ),
        description:
          'A real-time eyewear configurator to design frames, lenses and styles with lifelike 3D visualization and virtual try-on.',
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
            description: 'See your eyewear in true-to-life 3D with accurate shape and detail.'
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
            description: 'Change frame, lens, color, size and style in real time.'
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
        badge: 'The Science of Virtual Eyewear',
        title: 'Clinical Precision Meets High-Fashion 3D Realism',
        subtitle: 'Engineered for Optical Precision & True-To-Life Material Realism',
        description:
          'VictorShell Eyewear Try-On eliminates the guesswork of online eyewear purchasing by combining real-time MediaPipe facial landmark mesh estimation with WebGPU physically-based rendering. Our proprietary cranial 3D head occluder solves the industry-wide flaw of virtual eyewear: floating frames. By rendering a calibrated invisible head volume into the depth buffer, temple arms naturally tuck behind the user’s ears and hair.',
        highlights: [
          {
            title: 'Automated IPD Calibration',
            text: 'Sub-millimeter measurement across frontal camera planes calibrated to sensor geometry.'
          },
          {
            title: 'Cranial Depth Pass',
            text: 'Invisible skull occluder ensures temple arms slip naturally behind ears and hair.'
          },
          {
            title: 'PBR Optical Coatings',
            text: 'Dielectric transmission and multi-layer anti-reflective filters react to studio HDRI lighting.'
          },
          {
            title: 'Universal Zero-Plugin Web',
            text: 'Runs directly in mobile Safari, Android Chrome, and desktop browsers without downloads.'
          }
        ],
        visual: overviewVisual
      }}
      featuresProps={{
        id: 'features',
        badge: 'Core Architectural Capabilities',
        sectionTitle: 'Engineered for Precision Optical Fitting',
        sectionSubtitle:
          'From sub-millimeter biometric facial landmark alignment to depth-occluded temple arms and real-time pupillary distance measurement, VictorShell Eyewear delivers an uncompromised virtual fitting experience.',
        layout: 'grid',
        columns: 3,
        features: features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Multi-Category Fitting',
        sectionTitle: 'Curated Eyewear Collections & Optical Modes',
        sectionSubtitle:
          'Experience corrective prescription frames, polarized sunglasses, and aerodynamic performance wraps.',
        items: showcaseItems
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Measurable Business & Optical Impact',
        sectionTitle: 'Why Leading Eyewear Brands Choose VictorShell',
        sectionSubtitle: 'Zero design turnaround latency, 100% vector accuracy, and direct die-cutting export.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive Eyewear Studio',
        title: 'Experience Virtual Eyewear Fitting in Real Time',
        description:
          'Launch the interactive live camera demo to experience automated PD calculation, cranial occlusion, and real-time designer frame switching.',
        exploreDemoLabel: 'Explore Eyewear Demo',
        exploreDemoHref: exploreDemoHref,
        note: 'Instant camera activation · 100% private client-side processing · No video stream leaves your browser'
      }}
    >
      {/* Industry Verticals Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="eyewear-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Industry Verticals</span>
            <h2 className="vs-landing-use-cases__title">Purpose-Built for Optical Retailing &amp; Vision Care</h2>
            <p className="vs-landing-use-cases__subtitle">
              From direct-to-consumer online eyewear boutiques to clinical telehealth consultations.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-d2c">
              <div className="vs-use-case-card__icon" aria-hidden="true">👓</div>
              <span className="vs-use-case-card__tag">E-Commerce Brands</span>
              <h3 className="vs-use-case-card__title">Direct-to-Consumer (D2C) Optical</h3>
              <p className="vs-use-case-card__desc">
                Cut online eyewear return rates by up to 38% by empowering shoppers to verify bridge fit, temple width, and face shape compatibility in real-time camera AR.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-luxury">
              <div className="vs-use-case-card__icon" aria-hidden="true">✨</div>
              <span className="vs-use-case-card__tag">Haute Horlogerie &amp; Fashion</span>
              <h3 className="vs-use-case-card__title">Luxury Fashion &amp; Designer Houses</h3>
              <p className="vs-use-case-card__desc">
                Deliver an elevated virtual boutique experience highlighting hand-polished Italian acetate, 18K gold electroplating, and custom engraved temple branding.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-telehealth">
              <div className="vs-use-case-card__icon" aria-hidden="true">🩺</div>
              <span className="vs-use-case-card__tag">Healthcare &amp; Vision Centers</span>
              <h3 className="vs-use-case-card__title">Telehealth &amp; Digital Optometry</h3>
              <p className="vs-use-case-card__desc">
                Enable eye care practitioners to conduct remote face measurements, verify pupillary distance, and recommend certified frames ahead of in-clinic visits.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-custom">
              <div className="vs-use-case-card__icon" aria-hidden="true">🔬</div>
              <span className="vs-use-case-card__tag">Additive Manufacturing</span>
              <h3 className="vs-use-case-card__title">Custom Bespoke &amp; 3D Printed Eyewear</h3>
              <p className="vs-use-case-card__desc">
                Capture patient cranial proportions to parametrically generate tailored 3D-printed titanium or polyamide frames adapted to unique facial geometries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
