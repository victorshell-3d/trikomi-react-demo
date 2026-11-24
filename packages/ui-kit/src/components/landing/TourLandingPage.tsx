import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface TourLandingPageProps {
  /** Callback to launch the actual 360 Tour 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/360tour/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'violet'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * TourLandingPage
 *
 * Dedicated, premium single-product landing page for the VictorShell 360° Virtual Tour Studio.
 * Built using the Frosted Glass design system and Task 22/23/24 reusable components.
 * Focuses exclusively on 360° Panoramic Virtual Tours:
 * - High-resolution equirectangular spherical panorama rendering via Three.js
 * - Interactive node graph with teleportation hotspots and smooth zoom transitions
 * - Offline OPFS (Origin Private File System) client storage
 * - Standalone ZIP export bundling autonomous HTML5 viewer with zero cloud server requirements
 * - Spatial audio nodes and customizable nadir floor patches
 */
export const TourLandingPage: React.FC<TourLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/360tour/index.html#demo',
  theme = 'violet',
  className = ''
}) => {
  // Navigation anchors for the single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Tour Modes', href: '#showcase' },
    { label: 'Virtual Verticals', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#specs' }
  ];

  // Verified Features from VirtualTourStore.js, exportApi.js, and @trikomi/core/tour
  const features: FeatureItem[] = [
    {
      id: 'spherical-engine',
      title: 'Equirectangular Spherical Engine',
      description:
        'High-resolution panoramic sphere rendering with Three.js inverse normal projection, sub-pixel mipmapping, and hardware-accelerated WebGPU rasterization.',
      badge: 'Three.js Sphere',
      highlight: true
    },
    {
      id: 'hotspot-graph',
      title: 'Interactive Hotspot Node Graph',
      description:
        'Connect multiple panoramic scenes with animated teleportation hotspots, custom tooltip labels, and smooth camera zoom-through transitions.',
      badge: 'Teleportation Mesh'
    },
    {
      id: 'opfs-storage',
      title: 'Offline OPFS Client Storage',
      description:
        'Leverages the browser Origin Private File System and IndexedDB to cache high-res equirectangular images locally without recurring cloud database fees.',
      badge: 'Zero Cloud Storage'
    },
    {
      id: 'zip-export',
      title: 'Autonomous Standalone ZIP Export',
      description:
        'One-click client-side export bundles an autonomous, single-folder HTML5 viewer with all scene assets ready to host on any static CDN or USB drive.',
      badge: 'Serverless Package'
    },
    {
      id: 'spatial-audio',
      title: 'Directional Spatial Audio',
      description:
        'Embed localized 3D audio beacons that naturally attenuate and pan in real-time as users look around the panoramic space.',
      badge: 'WebAudio 3D'
    },
    {
      id: 'nadir-patch',
      title: 'Custom Nadir & Floor Concealment',
      description:
        'Seamlessly mask camera tripods at the bottom sphere pole with customized corporate brand logos, mirror reflections, and scale controls.',
      badge: 'Tripod Masking'
    }
  ];

  // Interactive Showcase Views
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'architecture-view',
      label: 'Luxury Architecture',
      badge: 'Residential Villa',
      description:
        'Multi-scene architectural walk-through connecting grand foyer, infinity pool terrace, and open-plan kitchen with seamless door teleportation.',
      visual: (
        <div className="vs-tour-preview-card" data-testid="showcase-architecture-preview">
          <div className="vs-tour-preview-card__badge-row">
            <span className="vs-tour-chip">Residential Villa</span>
            <span className="vs-tour-chip vs-tour-chip--accent">Multi-Room Graph</span>
          </div>
          <div className="vs-tour-preview-card__visual">
            <img
              src="/logos/360.png"
              alt="VictorShell 360 Virtual Tour Villa"
              className="vs-tour-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-tour-preview-card__meta">
            <span className="vs-tour-preview-card__title">Grand Villa Walkthrough</span>
            <span className="vs-tour-preview-card__spec">8 Scenes · 14 Hotspots · Spatial Ocean Ambience</span>
          </div>
        </div>
      )
    },
    {
      id: 'hospitality-view',
      label: 'Hospitality Suites',
      badge: 'Boutique Hotel',
      description:
        'Interactive luxury hotel suite preview featuring interactive amenity popups, dining room menus, and direct booking engine links.',
      visual: (
        <div className="vs-tour-preview-card" data-testid="showcase-hospitality-preview">
          <div className="vs-tour-preview-card__badge-row">
            <span className="vs-tour-chip">Boutique Hotel</span>
            <span className="vs-tour-chip vs-tour-chip--accent">Interactive Amenities</span>
          </div>
          <div className="vs-tour-preview-card__visual">
            <img
              src="/logos/360.png"
              alt="VictorShell 360 Hotel Suite"
              className="vs-tour-preview-card__img vs-tour-preview-card__img--alt"
              loading="lazy"
            />
          </div>
          <div className="vs-tour-preview-card__meta">
            <span className="vs-tour-preview-card__title">Presidential Penthouse Suite</span>
            <span className="vs-tour-preview-card__spec">360° Panorama · Floorplan Map · Reservation Links</span>
          </div>
        </div>
      )
    },
    {
      id: 'museum-view',
      label: 'Museum Exhibition',
      badge: 'Art Gallery',
      description:
        'Cultural gallery experience guiding visitors through curated sculpture halls with synchronized audio narration and high-res artwork details.',
      visual: (
        <div className="vs-tour-preview-card" data-testid="showcase-museum-preview">
          <div className="vs-tour-preview-card__badge-row">
            <span className="vs-tour-chip">Art Gallery</span>
            <span className="vs-tour-chip vs-tour-chip--accent">Curated Audio Guide</span>
          </div>
          <div className="vs-tour-preview-card__visual">
            <img
              src="/logos/360.png"
              alt="VictorShell 360 Museum Gallery"
              className="vs-tour-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-tour-preview-card__meta">
            <span className="vs-tour-preview-card__title">Renaissance Sculpture Hall</span>
            <span className="vs-tour-preview-card__spec">Artwork Audio Beacons · Multilingual Tooltips · 16K Mipmaps</span>
          </div>
        </div>
      )
    }
  ];

  // Benefits & Performance Metrics
  const benefits: BenefitItem[] = [
    {
      id: 'gyro-fps',
      title: 'Silky 60 FPS Gyroscope Motion',
      description:
        'Spherical shader calculations update at native refresh rates on mobile devices and VR headsets with zero camera stutter.',
      metric: '60 FPS',
      metricLabel: 'Panorama Refresh',
      tag: 'Hardware Accelerated'
    },
    {
      id: 'cloud-cost',
      title: 'Zero Cloud Storage Fees',
      description:
        'High-resolution panoramic media is stored client-side in the browser Origin Private File System, completely eliminating recurring server hosting costs.',
      metric: '0 MB',
      metricLabel: 'Server Overhead',
      tag: 'OPFS In-Browser'
    },
    {
      id: 'scene-latency',
      title: 'Instant Scene Transitions',
      description:
        'Smart scene pre-fetching and texture cache warming load linked panoramic rooms in sub-seconds with smooth zoom-through teleportation.',
      metric: '< 1 sec',
      metricLabel: 'Teleportation Latency',
      tag: 'Instant Switch'
    },
    {
      id: 'export-ease',
      title: 'Self-Contained Standalone Export',
      description:
        'Client-side JSZip engine packages HTML5 runtime, icons, and panoramas into a single distribution archive that runs offline on any device.',
      metric: '1-Click',
      metricLabel: 'Autonomous Package',
      tag: 'Zero Dependencies'
    }
  ];

  // Interactive state for hero visual simulation
  const [activeScene, setActiveScene] = useState<'lobby' | 'suite' | 'rooftop'>('lobby');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);

  // Hero visual stage with simulated 360 panorama viewport and interactive hotspot pins
  const heroVisual = (
    <div className="vs-tour-hero-stage" data-testid="tour-hero-stage">
      <div className="vs-tour-hero-stage__backdrop" aria-hidden="true" />

      <div className="vs-tour-hero-stage__controls">
        <button
          type="button"
          className="vs-tour-hero-stage__indicator"
          onClick={() => setIsAutoRotate((prev) => !prev)}
          title="Click to toggle auto-rotation"
          style={{ background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span className={`vs-tour-hero-stage__dot ${isAutoRotate ? 'is-active' : ''}`} />
          {isAutoRotate ? 'Auto-Rotate: 60 FPS' : 'Rotation Paused'}
        </button>

        <div className="vs-tour-hero-stage__scenes">
          {(['lobby', 'suite', 'rooftop'] as const).map((scene) => (
            <button
              key={scene}
              type="button"
              className={`vs-tour-scene-btn ${activeScene === scene ? 'is-active' : ''}`}
              onClick={() => setActiveScene(scene)}
              aria-label={`Select ${scene} scene`}
            >
              {scene.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="vs-tour-hero-stage__viewport">
        <img
          src="/logos/360.png"
          alt="360 Virtual Tour Spherical Panorama"
          className="vs-tour-hero-stage__pano"
        />

        {/* Interactive Simulated Hotspot Pins */}
        <div className="vs-tour-hotspot-pin vs-tour-hotspot-pin--north">
          <span className="vs-tour-hotspot-dot" />
          <span>Teleport to Terrace</span>
        </div>
        <div className="vs-tour-hotspot-pin vs-tour-hotspot-pin--east">
          <span className="vs-tour-hotspot-dot vs-tour-hotspot-dot--audio" />
          <span>Fountain Audio Node</span>
        </div>
        <div className="vs-tour-hotspot-pin vs-tour-hotspot-pin--info">
          <span className="vs-tour-hotspot-dot vs-tour-hotspot-dot--info" />
          <span>Suite Amenities Info</span>
        </div>

        {/* Compass & Horizon Indicator */}
        <div className="vs-tour-compass">
          <span>Heading: 240° SW</span>
        </div>
      </div>

      <div className="vs-tour-hero-stage__footer">
        <div className="vs-tour-hero-stage__meta">
          <span className="vs-tour-hero-stage__meta-label">Selected Scene Node</span>
          <span className="vs-tour-hero-stage__meta-val">
            {activeScene === 'lobby' ? 'Grand Atrium Lobby · 3 Hotspots' : activeScene === 'suite' ? 'Panoramic Penthouse · 5 Hotspots' : 'Sky Lounge Terrace · 4 Hotspots'}
          </span>
        </div>
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-tour-hero-stage__quick-btn vs-btn-secondary"
          data-testid="hero-quick-launch-btn"
        >
          Explore Virtual Tour →
        </button>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="360° Virtual Tour"
      productBadge="Three.js Spherical Panorama Engine"
      productTagline="Immersive WebGPU panoramic tours with interactive teleportation hotspots, offline OPFS storage, and self-contained ZIP export."
      brandName="VictorShell"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Launch 360 Tour Studio"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-tour-landing-page ${className}`.trim()}
      heroProps={{
        title: 'Immersive 360° Virtual Tour Studio & Autonomous Web Viewer',
        subtitle: 'From High-Resolution Panoramas to Self-Contained Interactive Walkthroughs',
        badge: 'Spherical WebGPU Engine',
        description:
          'Create cinematic 360° virtual tours directly in your browser. Connect equirectangular panoramas with interactive teleportation hotspots, embed spatial audio beacons, store media locally with zero cloud subscription fees, and export autonomous standalone tour packages ready to run offline.',
        exploreDemoLabel: 'Launch 360 Tour Studio',
        secondaryCta: {
          label: 'View Tech Specs',
          href: '#specs'
        },
        stats: [
          { value: '60 FPS', label: 'Panorama Motion', hint: 'Smooth spherical easing' },
          { value: '0 MB', label: 'Cloud Server Fees', hint: '100% in-browser OPFS' },
          { value: '1-Click', label: 'Autonomous Export', hint: 'Serverless HTML5 package' }
        ],
        visual: heroVisual,
        visualPosition: 'right'
      }}
      overviewProps={{
        id: 'overview',
        badge: 'Photogrammetric Spherical Projection',
        title: 'Precision Panoramic Spherical Mapping Without Cloud Server Dependencies',
        subtitle: 'From raw equirectangular image frames to multi-room interactive graphs in seconds',
        description:
          'The VictorShell 360° Virtual Tour engine maps high-resolution 8K/16K equirectangular panoramas onto inverted sphere geometries using Three.js and WebGPU shaders. Visitors navigate freely with responsive mouse, touch, or device gyroscope motion, smoothly jumping between rooms through intuitive teleportation portals.',
        highlights: [
          {
            title: 'Sub-Frame Spherical Interpolation',
            text: 'Cubic easing algorithms eliminate camera motion sickness while providing realistic field-of-view zooming and horizon leveling.'
          },
          {
            title: 'Zero-Cloud Private Storage',
            text: 'Save and organize all panoramic imagery directly inside your browser Origin Private File System (OPFS) with zero cloud upload bandwidth.'
          },
          {
            title: 'Complete Standalone Packaging',
            text: 'Integrated ZIP exporter builds an autonomous, self-hosted distribution folder with index.html, Three.js runtime, and all compressed textures.'
          }
        ],
        visual: (
          <div className="vs-tour-sphere-card" data-testid="tour-sphere-card">
            <div className="vs-tour-sphere-card__header">
              <span className="vs-tour-sphere-card__title">Spherical Coordinate Projection</span>
              <span className="vs-tour-chip">Equirectangular 2:1</span>
            </div>
            <div className="vs-tour-sphere-card__body">
              <img
                src="/logos/360.png"
                alt="360 Tour Spherical Projection"
                className="vs-tour-sphere-card__img"
                loading="lazy"
              />
            </div>
            <div className="vs-tour-sphere-card__footer">
              <span className="vs-tour-sphere-card__note">Yaw: 0°–360° · Pitch: -90° to +90° · FOV: 30°–110° Dynamic Zoom</span>
            </div>
          </div>
        )
      }}
      featuresProps={{
        id: 'features',
        badge: 'Tour Builder Suite',
        sectionTitle: 'Studio-Grade Virtual Tour Tools in Any Browser',
        sectionSubtitle:
          'A complete suite of scene linking, spatial audio, and serverless distribution tools.',
        layout: 'bento',
        columns: 3,
        features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Tour Modes',
        sectionTitle: 'Explore Diverse Virtual Tour Applications',
        sectionSubtitle:
          'Switch between luxury residential villas, boutique hospitality suites, and cultural art exhibitions.',
        items: showcaseItems
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Performance & Portability',
        sectionTitle: 'Why Photographers and Studios Choose 360° Tour',
        sectionSubtitle: 'Zero hosting fees, complete offline independence, and silky smooth 60 FPS transitions.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive Tour Studio',
        title: 'Step Inside the 360° Virtual Tour Builder Now',
        description:
          'Upload your panoramic images, place interactive teleportation hotspots, and preview seamless walkthroughs live in your browser.',
        exploreDemoLabel: 'Launch 360 Tour Studio',
        exploreDemoHref: exploreDemoHref,
        note: 'Zero cloud subscriptions · 100% in-browser OPFS storage · Standalone ZIP export'
      }}
    >
      {/* Dedicated Industry Use Cases Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="tour-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Virtual Verticals</span>
            <h2 className="vs-landing-use-cases__title">Engineered for Photographers, Architects &amp; Venues</h2>
            <p className="vs-landing-use-cases__subtitle">
              From commercial real estate open houses to cultural museum digital twins.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-realestate">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏡</div>
              <span className="vs-use-case-card__tag">Real Estate &amp; Architecture</span>
              <h3 className="vs-use-case-card__title">Virtual Open Houses &amp; Villas</h3>
              <p className="vs-use-case-card__desc">
                Enable prospective buyers and architectural clients to explore properties remotely with floor-by-floor navigation and room dimension tags.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-hospitality">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏨</div>
              <span className="vs-use-case-card__tag">Hospitality &amp; Resorts</span>
              <h3 className="vs-use-case-card__title">Interactive Hotel Suite Walkthroughs</h3>
              <p className="vs-use-case-card__desc">
                Showcase luxury resort suites, event ballrooms, and spa amenities with embedded booking links and high-resolution panoramic vistas.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-culture">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏛️</div>
              <span className="vs-use-case-card__tag">Museums &amp; Culture</span>
              <h3 className="vs-use-case-card__title">Digitized Heritage &amp; Art Tours</h3>
              <p className="vs-use-case-card__desc">
                Preserve historical monuments and art galleries as interactive digital twins complete with multi-lingual audio guides and curatorial notes.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-facility">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏭</div>
              <span className="vs-use-case-card__tag">Facilities &amp; Industry</span>
              <h3 className="vs-use-case-card__title">BIM Facility Inspection Walks</h3>
              <p className="vs-use-case-card__desc">
                Document construction progress, mechanical equipment rooms, and data centers for remote safety compliance and engineering audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Technical Specs Section */}
      <section className="vs-landing-specs" id="specs" data-testid="tour-specs-section">
        <div className="vs-landing-specs__container">
          <div className="vs-landing-specs__header">
            <span className="vs-landing-specs__badge">Technical Specifications</span>
            <h2 className="vs-landing-specs__title">Spherical Engine &amp; Storage Specifications</h2>
            <p className="vs-landing-specs__subtitle">
              Verified specifications powering the VictorShell 360° Virtual Tour Studio.
            </p>
          </div>

          <div className="vs-landing-specs__grid">
            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Three.js Spherical Core</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Geometry</dt>
                  <dd>Inverted normal equirectangular sphere (60 segments)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Input Formats</dt>
                  <dd>JPEG, PNG, WebP 2:1 equirectangular (up to 16K)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Transitions</dt>
                  <dd>Smooth cubic easing zoom-through teleportation</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Controls</dt>
                  <dd>Mouse drag, touch pinch-to-zoom, device gyroscope</dd>
                </div>
              </dl>
            </div>

            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Storage &amp; Standalone Export</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Client Storage</dt>
                  <dd>Origin Private File System (OPFS) + idb-keyval</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Audio Engine</dt>
                  <dd>WebAudio API with 3D directional positional nodes</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Standalone Export</dt>
                  <dd>Self-contained ZIP archive with zero server dependencies</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Nadir Masking</dt>
                  <dd>Parametric floor brand patch with dynamic scale</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
