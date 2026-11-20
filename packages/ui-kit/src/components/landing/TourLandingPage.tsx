import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import { Hero3DCanvas } from './Hero3DCanvas';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { StepItem } from './LandingHowItWorks';
import type { LandingNavLink } from './LandingNav';

export interface TourLandingPageProps {
  /** Callback to launch the actual 360 Virtual Tour 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/360tour/index.html#/dashboard'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'violet'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * TourLandingPage
 *
 * Dedicated, premium single-product landing page for the VictorShell 360° Virtual Tour.
 * Built using the Frosted Glass design system.
 */
export const TourLandingPage: React.FC<TourLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/360tour/index.html#/dashboard',
  theme = 'violet',
  className = ''
}) => {
  // Navigation anchors for the full layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Tour Scenarios', href: '#showcase' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Portability', href: '#benefits' },
    { label: 'Tech Specs', href: '#cta' }
  ];

  // 6 Core Features
  const features: FeatureItem[] = [
    {
      id: 'spherical-engine',
      title: 'Equirectangular Spherical Engine',
      description:
        'High-resolution panoramic sphere rendering with Three.js inverse normal projection and hardware-accelerated WebGPU rasterization.',
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
        'Leverages browser Origin Private File System and IndexedDB to cache high-res panoramas locally without cloud storage fees.',
      badge: 'Zero Cloud Storage'
    },
    {
      id: 'zip-export',
      title: 'Autonomous Standalone ZIP Export',
      description:
        'One-click client-side export bundles an autonomous, single-folder HTML5 viewer with all scene assets ready for any static CDN or USB drive.',
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
        'Seamlessly overlay custom company brand logos or circular mirror nadirs to conceal tripod mounts and camera rigs.',
      badge: 'Tripod Nadir Mask'
    }
  ];

  // 3-Step Workflow
  const steps: StepItem[] = [
    {
      number: '01',
      title: 'Upload 360° Panoramas',
      description:
        'Drag and drop equirectangular JPG, PNG, or HDR captures directly into the browser with zero server transcoding wait.',
      badge: 'Step 1: Ingest'
    },
    {
      number: '02',
      title: 'Place Hotspots & Audio',
      description:
        'Point and click to place animated teleportation nodes, informative popups, directional spatial audio beacons, and custom nadir patches.',
      badge: 'Step 2: Connect'
    },
    {
      number: '03',
      title: 'Export Standalone Package',
      description:
        'Generate an autonomous standalone HTML5 ZIP package with embedded player runtime, ready to deploy to any web host or offline kiosk.',
      badge: 'Step 3: Publish'
    }
  ];

  // Benefits & Portability Metrics
  const benefits: BenefitItem[] = [
    {
      metric: '60 FPS',
      label: 'Panorama Motion',
      description: 'Fluid equirectangular orbit with zero stutter across mobile and desktop displays.',
      tag: 'Smooth WebGPU'
    },
    {
      metric: '0 MB',
      label: 'Zero Cloud Storage Fees',
      description: '100% private OPFS client cache avoids recurring monthly hosting subscriptions.',
      tag: 'Serverless OPFS'
    },
    {
      metric: '< 1 sec',
      label: 'Scene Switch Latency',
      description: 'Instant room-to-room teleportation with pre-decoded GPU texture caching.',
      tag: 'Instant Preload'
    },
    {
      metric: '1-Click',
      label: 'Autonomous Export',
      description: 'Complete offline HTML5 viewer and asset bundle in a single portable zip archive.',
      tag: 'Self-Contained'
    }
  ];

  // Interactive Showcase Views
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'architecture-view',
      label: 'Luxury Architecture',
      badge: 'Residential Villa',
      description:
        'Multi-story residential walkthrough with animated floorplan navigation and terrace panoramic viewports.',
      visual: (
        <div className="vs-tour-showcase-card" data-testid="showcase-arch-preview">
          <div className="vs-tour-showcase-card__badge-row">
            <span className="vs-tour-chip">Villa_Living_Room.jpg</span>
            <span className="vs-tour-chip vs-tour-chip--accent">4 Hotspots · 4K Pano</span>
          </div>
          <div className="vs-tour-showcase-card__visual">
            <img
              src="/logos/360.png"
              alt="Luxury Architecture Panoramic Walkthrough"
              className="vs-tour-showcase-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-tour-showcase-card__meta">
            <span className="vs-tour-showcase-card__title">Grand Villa Interior</span>
            <span className="vs-tour-showcase-card__spec">60 FPS Smooth Orbit · Spatial Terrace Audio</span>
          </div>
        </div>
      )
    },
    {
      id: 'hospitality-view',
      label: 'Hospitality Suites',
      badge: 'Hotel Penthouse',
      description:
        'Interactive hotel suite inspection with clickable room amenities, balcony perspectives, and booking CTAs.',
      visual: (
        <div className="vs-tour-showcase-card" data-testid="showcase-suite-preview">
          <div className="vs-tour-showcase-card__badge-row">
            <span className="vs-tour-chip">Penthouse_Suite.jpg</span>
            <span className="vs-tour-chip vs-tour-chip--accent">6 Hotspots · 8K HDR</span>
          </div>
          <div className="vs-tour-showcase-card__visual">
            <img
              src="/logos/360.png"
              alt="Hotel Penthouse Panoramic Walkthrough"
              className="vs-tour-showcase-card__img vs-tour-showcase-card__img--alt"
              loading="lazy"
            />
          </div>
          <div className="vs-tour-showcase-card__meta">
            <span className="vs-tour-showcase-card__title">Executive Penthouse Suite</span>
            <span className="vs-tour-showcase-card__spec">Room Switcher UI · Dynamic Information Cards</span>
          </div>
        </div>
      )
    },
    {
      id: 'museum-view',
      label: 'Museum Exhibition',
      badge: 'Heritage Gallery',
      description:
        'Digitized museum gallery with artifact audio beacons, curated artwork plaques, and guided path sequences.',
      visual: (
        <div className="vs-tour-showcase-card" data-testid="showcase-museum-preview">
          <div className="vs-tour-showcase-card__badge-row">
            <span className="vs-tour-chip">Heritage_Hall.jpg</span>
            <span className="vs-tour-chip vs-tour-chip--accent">Artifact Audio · Curated Tour</span>
          </div>
          <div className="vs-tour-showcase-card__visual">
            <img
              src="/logos/360.png"
              alt="Museum Exhibition Panoramic Walkthrough"
              className="vs-tour-showcase-card__img vs-tour-showcase-card__img--alt2"
              loading="lazy"
            />
          </div>
          <div className="vs-tour-showcase-card__meta">
            <span className="vs-tour-showcase-card__title">Heritage Museum Gallery</span>
            <span className="vs-tour-showcase-card__spec">Artifact Audio Beacons · Informational Popups</span>
          </div>
        </div>
      )
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
        <Hero3DCanvas preset="tour" />

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
      exploreDemoLabel="Try Live Demo"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-tour-landing-page ${className}`.trim()}
      heroProps={{
        title: 'Immersive 360° Virtual Tour Studio & Autonomous Web Viewer',
        subtitle: 'From High-Resolution Panoramas to Self-Contained Interactive Walkthroughs',
        badge: 'Spherical WebGPU Engine',
        description:
          'High-resolution spherical panorama rendering with interactive spatial hotspots, ambisonic audio nodes, and architectural floorplan synchronization. Zero plugins or recurring hosting fees required.',
        exploreDemoLabel: 'Try Live Demo',
        secondaryCta: {
          label: 'Book a Demo',
          href: '#cta'
        },
        featureHighlights: [
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            ),
            title: '8K Spherical HDR Mapping',
            description: 'Equirectangular projection with smooth sub-frame inertia damping'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            ),
            title: 'Spatial Hotspot Waypoints',
            description: 'Interactive room-to-room teleportation and contextual annotations'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            ),
            title: 'Ambisonic Spatial Audio',
            description: 'Distance-attenuated positional sound nodes for true presence'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            ),
            title: 'Fullscreen & ZIP Export',
            description: 'One-click native fullscreen mode and self-contained offline bundle'
          }
        ],
        stats: [
          { value: '60 FPS', label: 'Panorama Motion', hint: 'Fluid equirectangular orbit' },
          { value: '0 MB', label: 'Cloud Storage Fees', hint: '100% private OPFS client cache' },
          { value: '< 1 sec', label: 'Scene Switch', hint: 'Instant room-to-room teleport' }
        ],
        visual: heroVisual,
        visualPosition: 'right'
      }}
      overviewProps={{
        id: 'overview',
        badge: 'Studio Overview',
        title: 'Precision Panoramic Spherical Mapping',
        subtitle: 'From High-Resolution 360° Images to Fully Interactive Walkthrough Networks.',
        narrative:
          'VictorShell 360° Virtual Tour combines hardware-accelerated Three.js inverse-sphere mapping with a private browser-local database. Create room-to-room teleport networks, attach rich HTML info cards to furniture or architectural elements, and export an entire self-contained tour without paying recurring cloud hosting fees.',
        highlights: [
          {
            title: 'Sub-Frame Spherical Interpolation',
            description: 'Fluid 60 FPS camera rotation with inertia damping and smooth field-of-view zooms.'
          },
          {
            title: 'Zero-Cloud Private Storage',
            description: 'Stores gigabytes of panoramic photography directly in browser OPFS storage with zero cloud fees.'
          },
          {
            title: 'Autonomous Standalone Bundle',
            description: 'Generates a single offline HTML5 ZIP package with embedded player runtime ready for static hosting.'
          }
        ],
        visual: (
          <div className="vs-tour-sphere-card" data-testid="tour-sphere-card">
            <div className="vs-tour-sphere-card__header">
              <span className="vs-tour-chip">Equirectangular 2:1</span>
              <span className="vs-tour-chip vs-tour-chip--accent">Inverted Sphere Mesh (60 Segments)</span>
            </div>
            <div className="vs-tour-sphere-card__body">
              <img
                src="/logos/360.png"
                alt="Equirectangular Panoramic Projection Geometry Diagram"
                className="vs-tour-sphere-svg"
                loading="lazy"
              />
            </div>
            <div className="vs-tour-sphere-card__footer">
              <span>Projection: Equirectangular Spherical · Hotspot Mesh: UV Coordinate Raycast</span>
            </div>
          </div>
        )
      }}
      featuresProps={{
        id: 'features',
        badge: 'Core Features',
        sectionTitle: 'Key Features & Capabilities',
        sectionSubtitle:
          'Professional panoramic tools for real estate brokers, hospitality venues, and architectural showcases.',
        layout: 'grid',
        columns: 3,
        features
      }}
      howItWorksProps={{
        id: 'how-it-works',
        badge: 'Workflow',
        sectionTitle: 'How It Works',
        sectionSubtitle: 'Three steps to build, customize, and publish immersive virtual walkthroughs',
        sectionDescription:
          'A zero-server web workflow taking high-resolution equirectangular captures to interactive standalone tours.',
        steps
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Interactive Preview',
        sectionTitle: 'Explore Tour Scenarios',
        sectionSubtitle:
          'Experience interactive spherical walkthroughs across residential, hospitality, and museum spaces.',
        items: showcaseItems,
        action: {
          label: 'Launch 360 Tour Studio',
          onClick: onExploreDemo,
          href: exploreDemoHref
        }
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Portability & Performance',
        sectionTitle: 'Why Developers & Realtors Choose VictorShell Tour',
        sectionSubtitle: 'Zero recurring storage fees, 60 FPS motion fluidity, and instant offline publishing.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive 3D Demo',
        title: 'Create Your First 360° Virtual Tour',
        description:
          'Load your equirectangular panoramas, place interactive teleportation hotspots, and test spatial audio beacons in real-time.',
        exploreDemoLabel: 'Launch 360 Tour Studio',
        exploreDemoHref: exploreDemoHref,
        secondaryCta: {
          label: 'Book a Demo',
          onClick: onExploreDemo
        },
        note: 'Instant client-side rendering · WebGPU / WebGL2 · Responsive on all devices'
      }}
    >
      {/* 9. Dedicated Virtual Verticals Use Cases Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="tour-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Virtual Verticals</span>
            <h2 className="vs-landing-use-cases__title">Engineered for Realtors, Architects &amp; Virtual Spaces</h2>
            <p className="vs-landing-use-cases__subtitle">
              From high-end real estate listings to museum archives and facility inspections.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-realestate">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏡</div>
              <span className="vs-use-case-card__tag">Residential Real Estate</span>
              <h3 className="vs-use-case-card__title">Virtual Open Houses &amp; Villas</h3>
              <p className="vs-use-case-card__desc">
                Enable prospective buyers to tour properties room-by-room with spatial orientation, floor plan mini-maps, and high-res architectural detail zoom.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-hospitality">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏨</div>
              <span className="vs-use-case-card__tag">Hospitality &amp; Luxury Resorts</span>
              <h3 className="vs-use-case-card__title">Interactive Hotel Suite Walkthroughs</h3>
              <p className="vs-use-case-card__desc">
                Showcase luxury suites, event venues, and resort amenities with direct booking links, ambient spatial ocean sounds, and balcony perspectives.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-heritage">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏛️</div>
              <span className="vs-use-case-card__tag">Museums &amp; Cultural Heritage</span>
              <h3 className="vs-use-case-card__title">Digitized Heritage &amp; Art Tours</h3>
              <p className="vs-use-case-card__desc">
                Curate educational guided tours of historical exhibits with audio narration hotspots, artifact information overlays, and archival zoom.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-aec">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏗️</div>
              <span className="vs-use-case-card__tag">AEC &amp; Facility Management</span>
              <h3 className="vs-use-case-card__title">BIM Facility Inspection Walks</h3>
              <p className="vs-use-case-card__desc">
                Document construction progress and mechanical plant rooms with timestamped spherical captures and maintenance tag annotations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
