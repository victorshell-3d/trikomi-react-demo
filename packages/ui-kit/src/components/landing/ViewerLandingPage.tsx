import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface ViewerLandingPageProps {
  /** Callback to launch the actual 3D Viewer application. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/viewer/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'indigo'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * ViewerLandingPage
 *
 * Dedicated, premium single-product landing page for the VictorShell 3D Viewer Studio.
 * Built using the Frosted Glass design system and reusable landing components.
 * Focuses exclusively on 3D Viewer capabilities:
 * - Next-generation Three.js WebGPU rendering engine with WebGL2 fallback
 * - Cinema-grade PBR material editing (roughness, metalness, clearcoat, transmission, dispersion)
 * - Cinematic post-processing stack (Bloom, SSGI, SSR, SSAO, Depth of Field, progressive shadows)
 * - Precision point-to-point 3D measurement overlay with millimeter calibration
 * - Multi-track skeletal animation timeline with scrubbing and variable playback speed
 * - Instant 8thWall SLAM WebAR surface placement with zero native app installation
 * - 4K studio snapshot export and GLTF 2.0 scene packager
 */
export const ViewerLandingPage: React.FC<ViewerLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/viewer/index.html#demo',
  theme = 'indigo',
  className = ''
}) => {
  // Navigation anchors for the single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Modes', href: '#showcase' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#specs' }
  ];

  // Verified Features from ThreeViewer and plugins in @trikomi/core
  const features: FeatureItem[] = [
    {
      id: 'webgpu-pipeline',
      title: 'WebGPU & WebGL2 Hybrid Pipeline',
      description:
        'Harnesses modern GPU compute shaders and high-throughput rasterization with automatic WebGL2 fallback for universal 60 FPS performance across all devices.',
      badge: 'Core Engine',
      highlight: true
    },
    {
      id: 'pbr-materials',
      title: 'PBR Material & Texture Editor',
      description:
        'Live calibration of physically based shading channels: microfacet roughness, metallic sheen, normal maps, clearcoat, refractive transmission, and Cauchy dispersion.',
      badge: 'Photorealistic PBR'
    },
    {
      id: 'post-processing',
      title: 'Cinematic Post-Processing Stack',
      description:
        'Integrated screen-space ambient occlusion (SSAO), screen-space reflections (SSR), HDR Bloom glow, and physical camera depth of field (DOF).',
      badge: 'Visual Effects'
    },
    {
      id: '3d-measurement',
      title: 'Precision 3D Measurement Overlay',
      description:
        'Interactive point-to-point surface snapping tool calculating real-world Euclidean distances in millimeters and centimeters directly on model vertices.',
      badge: 'Engineering CAD'
    },
    {
      id: 'kinematics-timeline',
      title: 'Multi-Track Animation Timeline',
      description:
        'Scrub, reverse, loop, and inspect multi-clip skeletal animations with variable playback speed (0.25x – 2x) for complex mechanical and character rigs.',
      badge: 'GLTF Kinematics'
    },
    {
      id: 'webar-slam',
      title: 'Instant 8thWall SLAM WebAR',
      description:
        'Stream 3D assets directly into augmented reality with 6-DOF surface tracking, real-world scaling, and directional light estimation with zero app installation.',
      badge: 'Niantic WebAR'
    }
  ];

  // Interactive Showcase Views
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'pbr-studio',
      label: 'PBR Realistic Studio',
      badge: 'Photorealistic PBR',
      description:
        'Cinema-quality studio lighting with HDR softbox reflections, progressive contact shadows, and calibrated physically based materials.',
      visual: (
        <div className="vs-viewer-preview-card" data-testid="showcase-pbr-preview">
          <div className="vs-viewer-preview-card__badge-row">
            <span className="vs-viewer-chip">MeshPhysicalMaterial</span>
            <span className="vs-viewer-chip vs-viewer-chip--accent">HDR Studio Lighting</span>
          </div>
          <div className="vs-viewer-preview-card__visual">
            <img
              src="/logos/trikomi.png"
              alt="VictorShell 3D Viewer PBR Rendering"
              className="vs-viewer-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-viewer-preview-card__meta">
            <span className="vs-viewer-preview-card__title">Photorealistic PBR Shading</span>
            <span className="vs-viewer-preview-card__spec">Microfacet Roughness 0.1 · Metalness 0.9 · 60 FPS WebGPU</span>
          </div>
        </div>
      )
    },
    {
      id: 'wireframe-inspection',
      label: 'Mesh & Wireframe',
      badge: 'Topology Inspection',
      description:
        'Inspect polygonal edge flow, surface normals, bounding box bounds, and precision dimensional tolerances with live overlay toggles.',
      visual: (
        <div className="vs-viewer-preview-card" data-testid="showcase-wireframe-preview">
          <div className="vs-viewer-preview-card__badge-row">
            <span className="vs-viewer-chip">Polygonal Wireframe</span>
            <span className="vs-viewer-chip vs-viewer-chip--accent">Vertex Normals</span>
          </div>
          <div className="vs-viewer-preview-card__visual">
            <img
              src="/logos/trikomi.png"
              alt="VictorShell 3D Viewer Wireframe Inspection"
              className="vs-viewer-preview-card__img vs-viewer-preview-card__img--alt"
              loading="lazy"
            />
          </div>
          <div className="vs-viewer-preview-card__meta">
            <span className="vs-viewer-preview-card__title">CAD &amp; Mesh Inspection</span>
            <span className="vs-viewer-preview-card__spec">Scene Graph Traversal · Transform Gizmos · Point Snapping</span>
          </div>
        </div>
      )
    },
    {
      id: 'animation-kinematics',
      label: 'Kinematics Timeline',
      badge: 'Skeletal Rigging',
      description:
        'Multi-clip animation playback with interactive timeline scrubbing, frame step controls, and variable playback speeds.',
      visual: (
        <div className="vs-viewer-preview-card" data-testid="showcase-animation-preview">
          <div className="vs-viewer-preview-card__badge-row">
            <span className="vs-viewer-chip">AnimationMixer</span>
            <span className="vs-viewer-chip vs-viewer-chip--accent">0.25x – 2.0x Scrub</span>
          </div>
          <div className="vs-viewer-preview-card__visual">
            <img
              src="/logos/trikomi.png"
              alt="VictorShell 3D Viewer Animation Timeline"
              className="vs-viewer-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-viewer-preview-card__meta">
            <span className="vs-viewer-preview-card__title">Interactive Animation Timeline</span>
            <span className="vs-viewer-preview-card__spec">Multi-Track Playback · Sub-Frame Scrubbing · Loop Modes</span>
          </div>
        </div>
      )
    },
    {
      id: 'webar-slam',
      label: 'Augmented Reality',
      badge: 'Niantic 8thWall SLAM',
      description:
        'Place 3D assets in physical spaces using mobile browser camera tracking with instant surface anchoring and light estimation.',
      visual: (
        <div className="vs-viewer-preview-card" data-testid="showcase-webar-preview">
          <div className="vs-viewer-preview-card__badge-row">
            <span className="vs-viewer-chip">8thWall SLAM WebAR</span>
            <span className="vs-viewer-chip vs-viewer-chip--accent">Zero App Install</span>
          </div>
          <div className="vs-viewer-preview-card__visual">
            <img
              src="/logos/trikomi.png"
              alt="VictorShell 3D Viewer WebAR"
              className="vs-viewer-preview-card__img vs-viewer-preview-card__img--ar"
              loading="lazy"
            />
          </div>
          <div className="vs-viewer-preview-card__meta">
            <span className="vs-viewer-preview-card__title">Real-World WebAR Placement</span>
            <span className="vs-viewer-preview-card__spec">Instant Floor Detection · 1:1 Scale · iOS &amp; Android Browser</span>
          </div>
        </div>
      )
    }
  ];

  // Benefits & Performance Metrics
  const benefits: BenefitItem[] = [
    {
      id: 'fps',
      title: 'Silky 60 FPS Viewport',
      description:
        'Three.js WebGPU engine delivers ultra-smooth rotation, pan, and zoom with zero micro-stuttering on desktop and mobile browsers.',
      metric: '60 FPS',
      metricLabel: 'WebGPU Viewport',
      tag: 'Performance'
    },
    {
      id: 'load-time',
      title: 'Instant Model Streaming',
      description:
        'Optimized GLTF Draco decompression and progressive texture streaming load complex 3D models in milliseconds.',
      metric: '< 50ms',
      metricLabel: 'Interaction Response',
      tag: 'Speed'
    },
    {
      id: 'cost',
      title: 'Zero Server GPU Streaming Cost',
      description:
        'All 3D rendering and post-processing run 100% client-side in the user’s browser. No expensive pixel-streaming server instances.',
      metric: '$0 / hr',
      metricLabel: 'Cloud GPU Cost',
      tag: 'Client-Side'
    },
    {
      id: 'export-res',
      title: '4K Studio Snapshot & GLTF Export',
      description:
        'Capture ultra-high-resolution 4K studio snapshots with transparency and export self-contained GLTF/GLB models with embedded PBR textures.',
      metric: '4K UHD',
      metricLabel: 'Snapshot Resolution',
      tag: 'Production'
    }
  ];

  // Interactive states for hero visual controls
  const [activeShading, setActiveShading] = useState<'pbr' | 'wireframe' | 'studio' | 'diamond'>('pbr');
  const [activeBloom, setActiveBloom] = useState(true);
  const [activeSSR, setActiveSSR] = useState(true);

  const shadingModes = {
    pbr: 'PBR Physically Based',
    wireframe: 'Technical Wireframe & Normals',
    studio: 'Studio Softbox Environment',
    diamond: 'Cauchy Spectral Dispersion'
  };

  // Hero visual stage with interactive shading switches, post-processing chips, and real-time status
  const heroVisual = (
    <div className="vs-viewer-hero-stage" data-testid="viewer-hero-stage">
      <div className="vs-viewer-hero-stage__backdrop" aria-hidden="true" />
      
      <div className="vs-viewer-hero-stage__controls">
        <span className="vs-viewer-hero-stage__indicator">
          <span className="vs-viewer-hero-stage__dot" />
          Three.js WebGPU Active
        </span>
        <div className="vs-viewer-hero-stage__modes">
          {(['pbr', 'wireframe', 'studio', 'diamond'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`vs-viewer-mode-btn ${activeShading === mode ? 'is-active' : ''}`}
              onClick={() => setActiveShading(mode)}
              aria-label={`Switch to ${mode} mode`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="vs-viewer-hero-stage__viewport">
        <img
          src="/logos/trikomi.png"
          alt="VictorShell 3D Viewer Interactive Viewport"
          className={`vs-viewer-hero-stage__model vs-viewer-hero-stage__model--${activeShading}`}
        />
        
        {/* Interactive Feature Badges */}
        <div className="vs-viewer-hero-stage__pin vs-viewer-hero-stage__pin--post">
          <span className="vs-viewer-hero-stage__pin-dot" />
          <span>{activeBloom ? 'Bloom Glow Active' : 'Bloom Muted'}</span>
        </div>
        <div className="vs-viewer-hero-stage__pin vs-viewer-hero-stage__pin--measure">
          <span className="vs-viewer-hero-stage__pin-dot" />
          <span>Point-to-Point 3D Measurement</span>
        </div>
        <div className="vs-viewer-hero-stage__pin vs-viewer-hero-stage__pin--ar">
          <span className="vs-viewer-hero-stage__pin-dot" />
          <span>8thWall SLAM Ready</span>
        </div>
      </div>

      <div className="vs-viewer-hero-stage__footer">
        <div className="vs-viewer-hero-stage__meta">
          <span className="vs-viewer-hero-stage__meta-label">Active Shading Mode</span>
          <span className="vs-viewer-hero-stage__meta-val">{shadingModes[activeShading]}</span>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setActiveBloom(!activeBloom)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '999px',
                border: activeBloom ? '1px solid var(--vs-primary)' : '1px solid var(--vs-control-border)',
                background: activeBloom ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.6)',
                color: activeBloom ? 'var(--vs-primary)' : 'var(--vs-ink-muted)',
                cursor: 'pointer'
              }}
            >
              Bloom: {activeBloom ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSSR(!activeSSR)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '999px',
                border: activeSSR ? '1px solid var(--vs-primary)' : '1px solid var(--vs-control-border)',
                background: activeSSR ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.6)',
                color: activeSSR ? 'var(--vs-primary)' : 'var(--vs-ink-muted)',
                cursor: 'pointer'
              }}
            >
              SSR: {activeSSR ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
        <div className="vs-viewer-hero-stage__specs">
          <span className="vs-viewer-chip vs-viewer-chip--accent">60 FPS WebGPU</span>
          <span className="vs-viewer-chip">4K Snapshot</span>
        </div>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="3D Viewer"
      productBadge="WebGPU Engine &amp; Post-Processing"
      productTagline="Enterprise WebGPU 3D model visualization, PBR material editing, kinematics animation, and real-time 8thWall WebAR."
      brandName="VictorShell"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Launch 3D Viewer"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-viewer-landing-page ${className}`.trim()}
      heroProps={{
        id: 'hero',
        badge: 'Next-Gen WebGPU 3D Graphics',
        title: 'Next-Generation WebGPU 3D Model Viewer & Real-Time Engine',
        description:
          'Inspect high-fidelity 3D models with cinema-grade PBR materials, post-processing effects, real-time 3D measurements, multi-track animation timelines, and one-click WebAR surface tracking.',
        stats: [
          { stat: '60 FPS', label: 'WebGPU & WebGL2 Rendering' },
          { stat: '< 50ms', label: 'Instant Model Streaming' },
          { stat: '0 Plugins', label: 'Runs in Any Modern Browser' }
        ],
        visual: heroVisual
      }}
      overviewProps={{
        id: 'overview',
        badge: 'Studio-Grade Rendering',
        title: 'Cinema-Grade Shading, Kinematics & Post-Processing',
        description:
          'Engineered on Three.js WebGPU and @trikomi/core, the 3D Viewer delivers instant hardware-accelerated rendering, progressive soft contact shadows, screen-space reflections, and physical camera depth of field.',
        highlights: [
          {
            title: 'Physically Based Shading (PBR)',
            text: 'Real-time microfacet roughness, metallic sheen, clearcoat, refractive transmission, and anisotropic dispersion.'
          },
          {
            title: 'Point-to-Point 3D Measurement Tool',
            text: 'Millimeter-accurate surface vertex snapping calculates Euclidean dimensions directly in the 3D viewport.'
          },
          {
            title: 'Multi-Track Kinematics Timeline',
            text: 'Scrub, reverse, loop, and inspect multi-clip skeletal animations with variable speed (0.25x – 2x).'
          }
        ],
        visual: (
          <div className="vs-viewer-overview-card" data-testid="viewer-overview-card">
            <div className="vs-viewer-overview-card__header">
              <span className="vs-viewer-overview-card__title">Real-Time PBR Channel Pipeline</span>
              <span className="vs-viewer-chip">ThreeViewer.ts</span>
            </div>
            <div className="vs-viewer-overview-card__body">
              <img
                src="/logos/trikomi.png"
                alt="3D Viewer PBR Pipeline"
                className="vs-viewer-overview-card__img"
                loading="lazy"
              />
            </div>
            <div className="vs-viewer-overview-card__footer">
              <div className="vs-viewer-pbr-swatches">
                <span className="vs-viewer-chip" style={{ fontSize: '10px' }}>Roughness: 0.1</span>
                <span className="vs-viewer-chip" style={{ fontSize: '10px' }}>Metalness: 0.9</span>
                <span className="vs-viewer-chip" style={{ fontSize: '10px' }}>Normal Map: 100%</span>
                <span className="vs-viewer-chip" style={{ fontSize: '10px' }}>Bloom: 0.45</span>
              </div>
              <span className="vs-viewer-overview-card__note">Hardware-Accelerated WebGPU Shaders</span>
            </div>
          </div>
        )
      }}
      featuresProps={{
        id: 'features',
        badge: 'Engine Capabilities',
        sectionTitle: 'Built for High-Precision 3D Inspection & Visualization',
        sectionSubtitle:
          'Advanced graphics and tooling built for designers, engineers, e-commerce platforms, and digital artists.',
        layout: 'bento',
        columns: 3,
        features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Viewport Modes',
        sectionTitle: 'Explore Multi-Mode Inspection & Rendering',
        sectionSubtitle:
          'Switch between interactive viewport modes designed for different stages of the 3D asset lifecycle.',
        items: showcaseItems
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Performance & ROI',
        sectionTitle: 'Why Creators & Engineers Choose VictorShell 3D Viewer',
        sectionSubtitle: 'Engineered for speed, fidelity, client-side efficiency, and zero plugin friction.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive 3D Studio',
        title: 'Launch the Full 3D Viewer Interactive Studio',
        description:
          'Inspect models, adjust PBR materials, measure geometry, and experience augmented reality live in your browser.',
        exploreDemoLabel: 'Launch 3D Viewer',
        exploreDemoHref
      }}
    >
      {/* Proven Industry Use Cases Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="viewer-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Proven Verticals</span>
            <h2 className="vs-landing-use-cases__title">Empowering Every 3D Workflow</h2>
            <p className="vs-landing-use-cases__subtitle">
              From enterprise e-commerce showrooms to high-precision aerospace and jewelry engineering.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-ecommerce">
              <div className="vs-use-case-card__icon" aria-hidden="true">🛍️</div>
              <span className="vs-use-case-card__tag">E-Commerce &amp; Retail</span>
              <h3 className="vs-use-case-card__title">Interactive 3D Product Showrooms</h3>
              <p className="vs-use-case-card__desc">
                Engage buyers with 360-degree rotating models, customizable surface materials, and instant WebAR viewing that boosts conversion rates and reduces return rates.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-cad">
              <div className="vs-use-case-card__icon" aria-hidden="true">📐</div>
              <span className="vs-use-case-card__tag">CAD &amp; Engineering</span>
              <h3 className="vs-use-case-card__title">Mechanical Assembly &amp; Tolerances</h3>
              <p className="vs-use-case-card__desc">
                Inspect complex CAD geometries with millimeter-accurate point-to-point measurement, exploded part animations, and scene graph hierarchy traversal.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-game-art">
              <div className="vs-use-case-card__icon" aria-hidden="true">🎮</div>
              <span className="vs-use-case-card__tag">Gaming &amp; VFX</span>
              <h3 className="vs-use-case-card__title">Digital Asset &amp; Rig Validation</h3>
              <p className="vs-use-case-card__desc">
                Review 3D character rigs, skinning weights, and skeletal animations with sub-frame scrubbing, lighting checks, and wireframe normal inspections.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-luxury">
              <div className="vs-use-case-card__icon" aria-hidden="true">💎</div>
              <span className="vs-use-case-card__tag">Luxury &amp; Jewelry</span>
              <h3 className="vs-use-case-card__title">Ray-Traced Spectral Dispersion</h3>
              <p className="vs-use-case-card__desc">
                Simulate Cauchy optical dispersion in diamond facets, anisotropic metallic reflections, and physical gemstone refraction with zero render latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Technical Specs Section */}
      <section className="vs-landing-specs" id="specs" data-testid="viewer-specs-section">
        <div className="vs-landing-specs__container">
          <div className="vs-landing-specs__header">
            <span className="vs-landing-specs__badge">Technical Specifications</span>
            <h2 className="vs-landing-specs__title">Engine &amp; Architecture Specifications</h2>
            <p className="vs-landing-specs__subtitle">
              Verified specifications powering the VictorShell 3D Viewer Studio.
            </p>
          </div>

          <div className="vs-landing-specs__grid">
            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Rendering &amp; Graphics</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Rendering Engine</dt>
                  <dd>Three.js WebGPU with WebGL2 Fallback</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Core SDK</dt>
                  <dd>@trikomi/core &amp; ThreeViewer</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Shading Pipeline</dt>
                  <dd>PBR MeshPhysicalMaterial &amp; Cauchy Dispersion</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Lighting &amp; Studio</dt>
                  <dd>HDR Softbox environment with progressive ground shadows</dd>
                </div>
              </dl>
            </div>

            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Post-Processing &amp; FX</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Glow &amp; Radiance</dt>
                  <dd>BloomPlugin with luminance thresholding</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Reflections &amp; AO</dt>
                  <dd>Screen Space Reflections (SSR) &amp; SSAO / SSGI</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Camera Optics</dt>
                  <dd>Physical Depth of Field (DOF) with focal distance</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Outlines &amp; Highlights</dt>
                  <dd>OutlinePlugin for selected node highlighting</dd>
                </div>
              </dl>
            </div>

            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Tooling &amp; Measurement</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Dimensional Snapping</dt>
                  <dd>MeasurementPlugin point-to-point vertex raycaster</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Scene Manipulation</dt>
                  <dd>TransformGizmoPlugin (Translate, Rotate, Scale)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Camera Controls</dt>
                  <dd>OrbitControlsPlugin with damping &amp; auto-rotate</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Camera Angles</dt>
                  <dd>Orthographic &amp; Perspective presets (Top, Front, Side)</dd>
                </div>
              </dl>
            </div>

            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Augmented Reality &amp; Export</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>WebAR Engine</dt>
                  <dd>Niantic 8thWall SLAM SDK (Surface Tracking)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Installation</dt>
                  <dd>0 App Installs • Runs in Safari &amp; Chrome mobile</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Scene Export</dt>
                  <dd>GLTF 2.0 / GLB Binary packager</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Image Capture</dt>
                  <dd>4K Ultra HD PNG Studio Snapshot</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};

export default ViewerLandingPage;
