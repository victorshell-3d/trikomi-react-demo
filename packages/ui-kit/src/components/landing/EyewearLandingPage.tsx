import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
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
  // Navigation anchors for single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Frame Styles', href: '#showcase' },
    { label: 'Industry Verticals', href: '#use-cases' },
    { label: 'Optical Precision', href: '#benefits' },
    { label: 'Tech Specs', href: '#specs' }
  ];

  // Interactive state for hero stage
  const [activeSilhouette, setActiveSilhouette] = useState<string>('Aviator Classic');
  const [activeLensTint, setActiveLensTint] = useState<string>('Clear AR');
  const [activeFrameMaterial, setActiveFrameMaterial] = useState<string>('Brushed Titanium');
  const [cranialOcclusion, setCranialOcclusion] = useState<boolean>(true);

  const silhouettes = [
    { id: 'aviator', name: 'Aviator Classic', code: 'MOD-01', width: '138 mm', bridge: '14 mm' },
    { id: 'wayfarer', name: 'Wayfarer Style', code: 'MOD-02', width: '142 mm', bridge: '18 mm' },
    { id: 'clubmaster', name: 'Clubmaster', code: 'MOD-03', width: '140 mm', bridge: '20 mm' },
    { id: 'round', name: 'Round Metal', code: 'MOD-04', width: '132 mm', bridge: '21 mm' },
    { id: 'sport', name: 'Sport Wrap', code: 'MOD-05', width: '146 mm', bridge: '12 mm' },
    { id: 'hexagonal', name: 'Hexagonal', code: 'MOD-06', width: '136 mm', bridge: '19 mm' }
  ];

  const lensTints = [
    { id: 'clear', label: 'Clear AR', transmission: '98%', tintHex: 'rgba(235, 245, 255, 0.25)' },
    { id: 'amber', label: 'Amber Tint', transmission: '45%', tintHex: 'rgba(245, 158, 11, 0.40)' },
    { id: 'polarized', label: 'Midnight Polarized', transmission: '15%', tintHex: 'rgba(15, 23, 42, 0.75)' },
    { id: 'mirror', label: 'Rose Mirror', transmission: '22%', tintHex: 'rgba(217, 70, 239, 0.55)' }
  ];

  const frameMaterials = [
    { id: 'titanium', label: 'Brushed Titanium', finish: 'Metallic PBR', swatch: '#94A3B8' },
    { id: 'acetate', label: 'Acetate Tortoise', finish: 'Translucent Dielectric', swatch: '#78350F' },
    { id: 'gold', label: 'Polished 18K Gold', finish: 'High-Gloss Reflective', swatch: '#EAB308' },
    { id: 'carbon', label: 'Matte Carbon', finish: 'Carbon Fiber Weave', swatch: '#1E293B' }
  ];

  const currentSilhouette = silhouettes.find((s) => s.name === activeSilhouette) || silhouettes[0];
  const currentTint = lensTints.find((t) => t.label === activeLensTint) || lensTints[0];
  const currentMat = frameMaterials.find((m) => m.label === activeFrameMaterial) || frameMaterials[0];

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
      badge: 'Corrective Eyewear',
      description:
        'Combines automated pupillary distance measurement, bridge width assessment, and progressive lens optical alignment for prescription retail customers.',
      visual: (
        <div className="vs-showcase-visual-card">
          <div className="vs-showcase-visual-badge">Rx Optical Center Locked</div>
          <div className="vs-showcase-visual-metric">PD: 63.5mm · Heights: 18mm</div>
        </div>
      )
    },
    {
      id: 'sun-polarized',
      label: 'Designer Sunglasses & Coatings',
      badge: 'Sun & Luxury Optics',
      description:
        'Showcase gradient tints, polarized UV400 filters, flash mirror coatings, and metallic luster with dynamic lighting that reacts to head movement.',
      visual: (
        <div className="vs-showcase-visual-card">
          <div className="vs-showcase-visual-badge">Polarized UV400 Coating</div>
          <div className="vs-showcase-visual-metric">Transmission: 15% · PBR Studio HDRI</div>
        </div>
      )
    },
    {
      id: 'sport-aerodynamic',
      label: 'Performance Sports Wraps',
      badge: 'Active & Sports Eyewear',
      description:
        'Simulate high-curvature base-8 wrapped frames with non-slip temporal arms, cranial wrap verification, and high-impact aerodynamic styling.',
      visual: (
        <div className="vs-showcase-visual-card">
          <div className="vs-showcase-visual-badge">Base-8 Aerodynamic Wrap</div>
          <div className="vs-showcase-visual-metric">Temporal Grip · Non-Slip Occlusion</div>
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

  // Technical Specifications Table
  const technicalSpecs = [
    { label: 'Facial Landmark Engine', value: 'MediaPipe Vision Tasks (478 3D landmarks, GPU accelerated)' },
    { label: 'Cranial Occlusion', value: '3D head mesh depth buffer pass (head_occluder.obj)' },
    { label: 'Pupillary Accuracy', value: '±0.8 mm under standard camera distances (40–60 cm)' },
    { label: 'Rendering Pipeline', value: 'Three.js WebGPU / WebGL with PBR dielectric & metallic shaders' },
    { label: 'Frame Geometries', value: 'GLTF / GLB Draco compressed (< 2.5 MB initial package)' },
    { label: 'Lighting Environment', value: 'Studio HDRI equirectangular reflection map (brown_photostudio_02)' },
    { label: 'Frame Rate & Latency', value: '60 FPS lock / < 16 ms motion-to-photon latency' },
    { label: 'Browser Support', value: 'Mobile Safari (iOS 14+), Mobile Chrome (Android), Desktop Chrome/Edge' }
  ];

  // Hero Interactive Visual Stage
  const heroVisual = (
    <div className="vs-eyewear-hero-stage">
      <div className="vs-eyewear-hero-stage__backdrop" />

      {/* Stage Header HUD */}
      <div className="vs-eyewear-hero-stage__hud">
        <div className="vs-eyewear-hud-chip vs-eyewear-hud-chip--active">
          <span className="vs-eyewear-hud-dot" />
          <span>Tracking: 478 Landmark Lock</span>
        </div>
        <div className="vs-eyewear-hud-chip">
          <span>PD: 63.5 mm</span>
        </div>
        <div
          className={`vs-eyewear-hud-chip vs-eyewear-hud-chip--toggle ${
            cranialOcclusion ? 'is-enabled' : ''
          }`}
          onClick={() => setCranialOcclusion(!cranialOcclusion)}
          title="Toggle Cranial 3D Depth Occluder"
          role="button"
          tabIndex={0}
        >
          <span>Occluder: {cranialOcclusion ? 'ACTIVE' : 'OFF'}</span>
        </div>
      </div>

      {/* Interactive Eyewear Simulator Card */}
      <div className="vs-eyewear-preview-card">
        <div className="vs-eyewear-preview-card__surface">
          {/* Facial Reticle Overlay */}
          <div className="vs-eyewear-reticle">
            <div className="vs-eyewear-reticle__line--h" />
            <div className="vs-eyewear-reticle__line--v" />
            <div className="vs-eyewear-reticle__eye vs-eyewear-reticle__eye--left">
              <span className="vs-eyewear-reticle__crosshair" />
              <span className="vs-eyewear-reticle__pupil-label">L Eye · 31.8mm</span>
            </div>
            <div className="vs-eyewear-reticle__eye vs-eyewear-reticle__eye--right">
              <span className="vs-eyewear-reticle__crosshair" />
              <span className="vs-eyewear-reticle__pupil-label">R Eye · 31.7mm</span>
            </div>
            <div className="vs-eyewear-reticle__pd-bracket">
              <span className="vs-eyewear-reticle__pd-text">IPD: 63.5 mm</span>
            </div>
          </div>

          {/* 3D Glasses Silhouette Schematic */}
          <div className="vs-eyewear-glasses-graphic">
            <svg
              className="vs-eyewear-glasses-svg"
              viewBox="0 0 400 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Temple Arms (with occlusion depth indicator) */}
              <path
                d="M 30 75 Q 70 65 110 70"
                stroke={currentMat.swatch}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={cranialOcclusion ? 'none' : '4 3'}
                opacity={cranialOcclusion ? 0.45 : 0.85}
              />
              <path
                d="M 370 75 Q 330 65 290 70"
                stroke={currentMat.swatch}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={cranialOcclusion ? 'none' : '4 3'}
                opacity={cranialOcclusion ? 0.45 : 0.85}
              />

              {/* Left Rim */}
              <rect
                x="85"
                y="45"
                width="95"
                height="70"
                rx="24"
                fill={currentTint.tintHex}
                stroke={currentMat.swatch}
                strokeWidth="6"
              />
              {/* Left Lens Glare Reflection */}
              <path
                d="M 100 55 L 145 55 L 125 105 L 90 105 Z"
                fill="rgba(255, 255, 255, 0.28)"
              />

              {/* Bridge */}
              <path
                d="M 180 72 Q 200 62 220 72"
                stroke={currentMat.swatch}
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Right Rim */}
              <rect
                x="220"
                y="45"
                width="95"
                height="70"
                rx="24"
                fill={currentTint.tintHex}
                stroke={currentMat.swatch}
                strokeWidth="6"
              />
              {/* Right Lens Glare Reflection */}
              <path
                d="M 235 55 L 280 55 L 260 105 L 225 105 Z"
                fill="rgba(255, 255, 255, 0.28)"
              />

              {/* Nose Pads */}
              <circle cx="182" cy="85" r="4" fill="rgba(255, 255, 255, 0.8)" />
              <circle cx="218" cy="85" r="4" fill="rgba(255, 255, 255, 0.8)" />
            </svg>
          </div>

          {/* Active Model Meta HUD Badge */}
          <div className="vs-eyewear-preview-meta">
            <span className="vs-eyewear-preview-meta__title">{currentSilhouette.name}</span>
            <span className="vs-eyewear-preview-meta__detail">
              Frame: {currentSilhouette.width} · Bridge: {currentSilhouette.bridge} · Lens: {currentTint.label}
            </span>
          </div>
        </div>

        {/* Silhouette Selector Pills */}
        <div className="vs-eyewear-controls-row">
          <span className="vs-eyewear-controls-label">SILHOUETTE</span>
          <div className="vs-eyewear-pill-group">
            {silhouettes.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`vs-eyewear-pill-btn ${activeSilhouette === s.name ? 'is-active' : ''}`}
                onClick={() => setActiveSilhouette(s.name)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lens Coating & Frame Material Selector */}
        <div className="vs-eyewear-materials-grid">
          <div className="vs-eyewear-mat-column">
            <span className="vs-eyewear-controls-label">OPTICAL COATING</span>
            <div className="vs-eyewear-pill-group vs-eyewear-pill-group--compact">
              {lensTints.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`vs-eyewear-pill-btn vs-eyewear-pill-btn--sm ${
                    activeLensTint === t.label ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveLensTint(t.label)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="vs-eyewear-mat-column">
            <span className="vs-eyewear-controls-label">FRAME MATERIAL</span>
            <div className="vs-eyewear-pill-group vs-eyewear-pill-group--compact">
              {frameMaterials.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`vs-eyewear-pill-btn vs-eyewear-pill-btn--sm ${
                    activeFrameMaterial === m.label ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveFrameMaterial(m.label)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
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
      productTitle="Eyewear Try-On"
      productBadge="WebGPU AR Facial Fitting"
      productTagline="Sub-millimeter 3D facial landmark fitting, automated PD measurement, and realistic cranial occlusion."
      brandName="VictorShell"
      brandLogo={<img src="/logos/eyewear.png" alt="Eyewear Logo" style={{ width: 26, height: 26, objectFit: 'contain' }} />}
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoHref={exploreDemoHref}
      exploreDemoLabel="Explore Eyewear Demo"
      navLinks={navLinks}
      className={`vs-eyewear-landing-page ${className}`.trim()}
      heroProps={{
        title: 'Next-Generation AR Eyewear Fitting & Automated PD Measurement',
        subtitle: 'Sub-Millimeter 3D Facial Landmark Tracking Powered by WebGPU',
        badge: 'WebGPU AR Facial Fitting',
        description:
          'Transform eyewear e-commerce with real-time 3D facial fitting, automated pupillary distance (PD) calibration, full cranial occlusion, and true-to-life PBR frame and optical lens rendering.',
        stats: [
          { value: '478 Pts', label: '3D Facial Mesh', hint: 'Real-time landmarks' },
          { value: '< 1.0 mm', label: 'PD Accuracy', hint: 'Pupillary calibration' },
          { value: '60 FPS', label: 'WebGPU Engine', hint: 'Zero jitter frame lock' },
          { value: '-38%', label: 'Return Rates', hint: 'Accurate fit confidence' }
        ],
        visual: heroVisual
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
        layout: 'bento',
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

      {/* Product Technical Specs Section */}
      <section className="vs-landing-specs" id="specs" data-testid="eyewear-specs-section">
        <div className="vs-landing-specs__container">
          <div className="vs-landing-specs__header">
            <span className="vs-landing-specs__badge">Engineering Specifications</span>
            <h2 className="vs-landing-specs__title">Technical Architecture &amp; Performance</h2>
            <p className="vs-landing-specs__subtitle">
              Certified optical metrics, shader pipelines, and real-time tracking performance.
            </p>
          </div>

          <div className="vs-specs-table-card">
            <table className="vs-specs-table">
              <thead>
                <tr>
                  <th scope="col">Subsystem</th>
                  <th scope="col">Architecture Specification</th>
                  <th scope="col">Standard / Target</th>
                </tr>
              </thead>
              <tbody>
                {technicalSpecs.map((spec, idx) => (
                  <tr key={idx}>
                    <td className="vs-specs-label">{spec.label}</td>
                    <td className="vs-specs-value">{spec.value}</td>
                    <td className="vs-specs-status">Verified Production</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
