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
  theme = 'violet',
  className = ''
}) => {
  // Navigation anchors matching the reference navbar: Overview, Features, Use Cases, Performance, Tech Specs
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#cta' }
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

  // Interactive customizer states matching reference
  const [activeTab, setActiveTab] = useState<'color' | 'material' | 'view'>('color');
  const [activeColor, setActiveColor] = useState<'purple' | 'blue' | 'cyan' | 'pink' | 'white'>('purple');
  const [activeMaterial, setActiveMaterial] = useState<'purple-gloss' | 'chrome' | 'silver' | 'brushed' | 'carbon'>('purple-gloss');

  // Hero visual showcase matching reference layout: center purple knot on pedestal, right floating customization panel
  const heroVisual = (
    <div className="vs-viewer-hero-showcase" data-testid="viewer-hero-showcase">
      {/* Center 3D Product Stage */}
      <div className="vs-viewer-hero-stage__viewport">
        <div className="vs-viewer-hero-image-wrap">
          <img
            src="/images/purple-knot-product.png"
            alt="VictorShell 3D Product Viewer - Purple Torus Knot"
            className="vs-viewer-hero-image"
            loading="eager"
          />
        </div>
      </div>

      {/* Right Floating Glass Customizer Panel */}
      <div className="vs-viewer-customizer-card" data-testid="viewer-customizer-card">
        <h3 className="vs-viewer-customizer-title">Customize Your Product</h3>

        {/* Tabs: Color, Material, View */}
        <div className="vs-viewer-customizer-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'color'}
            className={`vs-viewer-tab-btn ${activeTab === 'color' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('color')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>Color</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'material'}
            className={`vs-viewer-tab-btn ${activeTab === 'material' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('material')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span>Material</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'view'}
            className={`vs-viewer-tab-btn ${activeTab === 'view' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            <span>View</span>
          </button>
        </div>

        {/* Section 1: Color */}
        <div className="vs-viewer-customizer-section">
          <span className="vs-viewer-section-label">Color</span>
          <div className="vs-viewer-swatches-grid">
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--purple ${activeColor === 'purple' ? 'is-active' : ''}`}
              onClick={() => setActiveColor('purple')}
              title="Cosmic Purple"
              aria-label="Cosmic Purple"
            />
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--blue ${activeColor === 'blue' ? 'is-active' : ''}`}
              onClick={() => setActiveColor('blue')}
              title="Ocean Blue"
              aria-label="Ocean Blue"
            />
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--cyan ${activeColor === 'cyan' ? 'is-active' : ''}`}
              onClick={() => setActiveColor('cyan')}
              title="Vibrant Cyan"
              aria-label="Vibrant Cyan"
            />
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--pink ${activeColor === 'pink' ? 'is-active' : ''}`}
              onClick={() => setActiveColor('pink')}
              title="Neon Pink"
              aria-label="Neon Pink"
            />
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--white ${activeColor === 'white' ? 'is-active' : ''}`}
              onClick={() => setActiveColor('white')}
              title="Pure White"
              aria-label="Pure White"
            />
          </div>
        </div>

        {/* Section 2: Material */}
        <div className="vs-viewer-customizer-section">
          <span className="vs-viewer-section-label">Material</span>
          <div className="vs-viewer-swatches-grid">
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--purple-gloss ${activeMaterial === 'purple-gloss' ? 'is-active' : ''}`}
              onClick={() => setActiveMaterial('purple-gloss')}
              title="Gloss Metallic Purple"
              aria-label="Gloss Metallic Purple"
            />
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--chrome ${activeMaterial === 'chrome' ? 'is-active' : ''}`}
              onClick={() => setActiveMaterial('chrome')}
              title="Mirror Chrome"
              aria-label="Mirror Chrome"
            />
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--silver ${activeMaterial === 'silver' ? 'is-active' : ''}`}
              onClick={() => setActiveMaterial('silver')}
              title="Silver Satin"
              aria-label="Silver Satin"
            />
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--brushed ${activeMaterial === 'brushed' ? 'is-active' : ''}`}
              onClick={() => setActiveMaterial('brushed')}
              title="Brushed Steel"
              aria-label="Brushed Steel"
            />
            <button
              type="button"
              className={`vs-viewer-swatch vs-viewer-swatch--carbon ${activeMaterial === 'carbon' ? 'is-active' : ''}`}
              onClick={() => setActiveMaterial('carbon')}
              title="Dark Carbon Fiber"
              aria-label="Dark Carbon Fiber"
            />
          </div>
        </div>

        {/* View in 3D Button */}
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-viewer-view-3d-btn"
          data-testid="viewer-view-in-3d-btn"
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
      productTitle="3D Viewer Configurator"
      productBadge="3D Viewer Configurator"
      productTagline="Enterprise WebGPU 3D model visualization, PBR material editing, kinematics animation, and real-time 8thWall WebAR."
      brandName="VictorShell™"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Try Live Demo"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-viewer-landing-page ${className}`.trim()}
      heroProps={{
        id: 'hero',
        badge: (
          <span className="vs-viewer-hero-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>3D Product Viewer</span>
          </span>
        ),
        title: (
          <>
            View, Interact &amp;<br />
            Showcase Products in <span className="vs-gradient-text">3D</span>
          </>
        ),
        description:
          'A powerful 3D product viewer to display, customize and interact with your products in high quality, real-time 3D.',
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
            description: 'Show your product in true-to-life 3D with accurate detail and finish.'
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
            description: 'Change color, material and variants in real time.'
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
        layout: 'grid',
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
    </ProductLandingTemplate>
  );
};

export default ViewerLandingPage;
