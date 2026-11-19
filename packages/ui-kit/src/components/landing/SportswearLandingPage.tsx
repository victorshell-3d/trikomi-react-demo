import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface SportswearLandingPageProps {
  /** Callback to launch the actual Sportswear Configurator 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/sportswear-configurator/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'indigo'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * SportswearLandingPage
 *
 * Dedicated, premium single-product landing page for the VictorShell Sportswear Configurator.
 * Built using the Frosted Glass design system and Task 22/23 reusable components.
 * Focuses exclusively on Sportswear Configurator capabilities:
 * - Dynamic SVG vector decal engine with real-time UV projection
 * - Sublimation fabric shaders (technical mesh, interlock knit, smooth poly)
 * - Custom player names and numbers with dynamic sub-pixel typography
 * - 4-angle studio camera presets with 4-grid view box
 * - Multi-garment models (Pro Soccer, Rugby Match Kit, Basketball Singlet)
 * - Industry use cases for clubs, collegiate leagues, and cut-and-sew manufacturers
 * - Factory-ready 2048x2048 snapshot export & dieline manifests
 */
export const SportswearLandingPage: React.FC<SportswearLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/sportswear-configurator/index.html#demo',
  theme = 'indigo',
  className = ''
}) => {
  // Navigation anchors for the single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Garment Kits', href: '#showcase' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#specs' }
  ];

  // Verified Features from ConfiguratorStore & 3D ThreeCanvas implementation
  const features: FeatureItem[] = [
    {
      id: 'dynamic-decals',
      title: 'Dynamic Vector Decals',
      description:
        'Upload custom SVG team logos, crests, and sponsor marks. Position, rotate, and scale decals with real-time UV projection conforming to fabric seams.',
      badge: 'Core Engine',
      highlight: true
    },
    {
      id: 'fabric-shaders',
      title: 'Technical Fabric Shaders',
      description:
        'Switch between moisture-wicking technical mesh, heavy-duty interlock knit, and smooth performance polyester with physically accurate sheen and micro-roughness.',
      badge: 'Photorealistic PBR'
    },
    {
      id: 'player-typography',
      title: 'Player Names & Numbers',
      description:
        'Built-in vector typography engine rendering custom player names and jersey numbers with instant font family selection, kerning calibration, and color control.',
      badge: 'Vector Canvas'
    },
    {
      id: 'studio-cameras',
      title: '4-Angle Studio Cameras',
      description:
        'Instant one-click camera pivots across Front, Back, Left Profile, and Right Profile angles with a synchronized 4-grid preview box for total inspection.',
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
      id: 'production-dieline',
      title: 'Factory Snapshot Export',
      description:
        'One-click multi-angle high-resolution snapshot generation and structured order manifest for factory cutting dielines and dye-sublimation printing.',
      badge: 'Production Ready'
    }
  ];

  // Interactive Showcase Garments
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'soccer',
      label: 'Pro Soccer Kit',
      badge: 'SoccerJersey.gltf',
      description:
        'Tailored athletic fit with raglan sleeves, breathable mesh underarm ventilation panels, and chest crest decal zone.',
      visual: (
        <div className="vs-sportswear-preview-card" data-testid="showcase-soccer-preview">
          <div className="vs-sportswear-preview-card__badge-row">
            <span className="vs-sportswear-chip">SoccerJersey.gltf</span>
            <span className="vs-sportswear-chip vs-sportswear-chip--accent">Technical Mesh</span>
          </div>
          <div className="vs-sportswear-preview-card__visual">
            <img
              src="/logos/jersey.png"
              alt="VictorShell Pro Soccer Jersey 3D Model"
              className="vs-sportswear-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-sportswear-preview-card__meta">
            <span className="vs-sportswear-preview-card__title">Pro Soccer Jersey</span>
            <span className="vs-sportswear-preview-card__spec">Dual-Tone Sublimation · 60 FPS WebGPU</span>
          </div>
        </div>
      )
    },
    {
      id: 'rugby',
      label: 'Rugby Match Kit',
      badge: 'RugbyJersey.gltf',
      description:
        'Heavy-duty interlock knit shader with reinforced collar seams, chest sponsor block, and bold athletic back numbering.',
      visual: (
        <div className="vs-sportswear-preview-card" data-testid="showcase-rugby-preview">
          <div className="vs-sportswear-preview-card__badge-row">
            <span className="vs-sportswear-chip">RugbyJersey.gltf</span>
            <span className="vs-sportswear-chip vs-sportswear-chip--accent">Interlock Knit</span>
          </div>
          <div className="vs-sportswear-preview-card__visual">
            <img
              src="/logos/jersey.png"
              alt="VictorShell Rugby Match Jersey 3D Model"
              className="vs-sportswear-preview-card__img vs-sportswear-preview-card__img--alt"
              loading="lazy"
            />
          </div>
          <div className="vs-sportswear-preview-card__meta">
            <span className="vs-sportswear-preview-card__title">Rugby Match Kit</span>
            <span className="vs-sportswear-preview-card__spec">High-Tensile Fabric · Heavy Seam Normal Mapping</span>
          </div>
        </div>
      )
    },
    {
      id: 'basketball',
      label: 'Basketball Singlet',
      badge: 'BasketballSinglet.gltf',
      description:
        'Lightweight sleeveless open-mesh garment with ribbed armhole trims, wide athletic lettering, and contrast side stripes.',
      visual: (
        <div className="vs-sportswear-preview-card" data-testid="showcase-basketball-preview">
          <div className="vs-sportswear-preview-card__badge-row">
            <span className="vs-sportswear-chip">BasketballSinglet.gltf</span>
            <span className="vs-sportswear-chip vs-sportswear-chip--accent">Open Air Mesh</span>
          </div>
          <div className="vs-sportswear-preview-card__visual">
            <img
              src="/logos/jersey.png"
              alt="VictorShell Basketball Singlet 3D Model"
              className="vs-sportswear-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-sportswear-preview-card__meta">
            <span className="vs-sportswear-preview-card__title">Basketball Singlet</span>
            <span className="vs-sportswear-preview-card__spec">Sleeveless Cut · Dynamic Player Numbering</span>
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
        'Three.js WebGPU engine delivers smooth rotation and instant zoom with zero micro-stuttering on mobile and desktop.',
      metric: '60 FPS',
      metricLabel: 'WebGPU Viewport',
      tag: 'Performance'
    },
    {
      id: 'load-time',
      title: 'Instant Interactive Loading',
      description:
        'Optimized GLTF streaming and progressive textures load the 3D model in seconds, keeping customer engagement high.',
      metric: '< 1.2s',
      metricLabel: 'Time to Interactive',
      tag: 'Speed'
    },
    {
      id: 'cost',
      title: 'Zero Cloud GPU Streaming Fees',
      description:
        'All 3D rendering and vector decal projections run 100% on the client browser. No expensive pixel-streaming server bills.',
      metric: '$0 / hr',
      metricLabel: 'Server GPU Cost',
      tag: 'Client-Side'
    },
    {
      id: 'sampling-waste',
      title: 'Eliminate Sampling Waste',
      description:
        'Accurate digital sign-off with 4-angle snapshot export eliminates physical sample production cycles and shipping delay.',
      metric: '100%',
      metricLabel: 'Production Accuracy',
      tag: 'Zero Waste'
    }
  ];

  // Interactive states for hero visual controls
  const [activeHeroAngle, setActiveHeroAngle] = useState<'front' | 'back' | 'left' | 'right'>('front');
  const [activeFabric, setActiveFabric] = useState<'mesh' | 'knit' | 'smooth'>('mesh');

  const fabricNames = {
    mesh: 'Technical Mesh (Moisture-Wicking)',
    knit: 'Interlock Knit (Heavy Match Durability)',
    smooth: 'Sublimated Polyester (Smooth Sheen)'
  };

  // Hero visual component with interactive angle selector, fabric selector, and decal pills
  const heroVisual = (
    <div className="vs-sportswear-hero-stage" data-testid="sportswear-hero-stage">
      <div className="vs-sportswear-hero-stage__backdrop" aria-hidden="true" />
      
      <div className="vs-sportswear-hero-stage__controls">
        <span className="vs-sportswear-hero-stage__indicator">
          <span className="vs-sportswear-hero-stage__dot" />
          WebGPU Canvas Active
        </span>
        <div className="vs-sportswear-hero-stage__angles">
          {(['front', 'back', 'left', 'right'] as const).map((angle) => (
            <button
              key={angle}
              type="button"
              className={`vs-sportswear-angle-btn ${activeHeroAngle === angle ? 'is-active' : ''}`}
              onClick={() => setActiveHeroAngle(angle)}
              aria-label={`View ${angle} angle`}
            >
              {angle.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="vs-sportswear-hero-stage__viewport">
        <img
          src="/logos/jersey.png"
          alt="Sportswear Configurator 3D Interactive Jersey"
          className={`vs-sportswear-hero-stage__jersey vs-sportswear-hero-stage__jersey--${activeHeroAngle}`}
        />
        <div className="vs-sportswear-hero-stage__decal-tag vs-sportswear-hero-stage__decal-tag--crest">
          <span className="vs-sportswear-hero-stage__decal-dot" />
          <span>Dynamic Crest UV</span>
        </div>
        <div className="vs-sportswear-hero-stage__decal-tag vs-sportswear-hero-stage__decal-tag--sponsor">
          <span className="vs-sportswear-hero-stage__decal-dot" />
          <span>Vector Sponsor Mark</span>
        </div>
      </div>

      <div className="vs-sportswear-hero-stage__footer">
        <div className="vs-sportswear-hero-stage__meta">
          <span className="vs-sportswear-hero-stage__meta-label">Selected Fabric</span>
          <span className="vs-sportswear-hero-stage__meta-val">{fabricNames[activeFabric]}</span>
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            {(['mesh', 'knit', 'smooth'] as const).map((fab) => (
              <button
                key={fab}
                type="button"
                onClick={() => setActiveFabric(fab)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: activeFabric === fab ? '1px solid var(--vs-primary)' : '1px solid var(--vs-control-border)',
                  background: activeFabric === fab ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.6)',
                  color: activeFabric === fab ? 'var(--vs-primary)' : 'var(--vs-ink-muted)',
                  cursor: 'pointer'
                }}
              >
                {fab.charAt(0).toUpperCase() + fab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-sportswear-hero-stage__quick-btn vs-btn-secondary"
          data-testid="hero-quick-launch-btn"
        >
          Launch 3D Lab →
        </button>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="Sportswear Configurator"
      productBadge="WebGPU Vector Decal Engine"
      productTagline="Real-time 3D jersey design, dynamic vector decals, and precision sublimation dieline export."
      brandName="VictorShell"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Launch 3D Configurator"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-sportswear-landing-page ${className}`.trim()}
      heroProps={{
        title: 'High-Performance Custom 3D Team Apparel',
        subtitle: 'Real-Time Texture Composer & Vector Decal Studio',
        badge: 'Interactive WebGPU Demo',
        description:
          'Configure professional team jerseys, rugby kits, and basketball singlets with live vector logo placement, custom player names and numbers, photorealistic fabric shaders, and instant factory-ready production specs.',
        exploreDemoLabel: 'Launch 3D Configurator',
        secondaryCta: {
          label: 'View Tech Specs',
          href: '#specs'
        },
        stats: [
          { value: '60 FPS', label: 'WebGPU Engine', hint: 'Fluid real-time viewport' },
          { value: '3 Kits', label: 'Garment Types', hint: 'Soccer, Rugby & Basketball' },
          { value: '< 1.2s', label: 'Load Time', hint: 'Streamed GLTF geometry' }
        ],
        visual: heroVisual,
        visualPosition: 'right'
      }}
      overviewProps={{
        id: 'overview',
        badge: 'Textile Architecture',
        title: 'True-to-Scale Fabric Simulation & Sublimation Pipeline',
        subtitle: 'Bridging digital concept design with physical textile manufacturing',
        description:
          'The Sportswear Configurator connects dynamic 2D artwork composition with physical 3D textile reality. Using Three.js WebGPU shaders and canvas compositing, designers can customize fabric sheen, layer decals across seams, and inspect collar, side-panel, and sleeve aesthetics with sub-millimeter precision before printing.',
        highlights: [
          {
            title: 'Sub-Second Decal Projection',
            text: 'Vector SVG logos conform accurately across complex fabric meshes and shoulder seams without texture distortion.'
          },
          {
            title: 'Production Snapshot Export',
            text: 'Generate high-resolution multi-angle camera snapshots and structured manufacturing manifests with a single click.'
          },
          {
            title: 'Independent Color Layering',
            text: 'Custom Pantone hex palette control over individual garment components: collars, sleeves, body panels, and trims.'
          }
        ],
        visual: (
          <div className="vs-sportswear-dieline-card" data-testid="sportswear-dieline-card">
            <div className="vs-sportswear-dieline-card__header">
              <span className="vs-sportswear-dieline-card__title">UV Layout & Color Channels</span>
              <span className="vs-sportswear-chip">uv_layout_with_labels.svg</span>
            </div>
            <div className="vs-sportswear-dieline-card__body">
              <img
                src="/svgs/uv_layout_with_labels.svg"
                alt="Sportswear UV Layout and Color Channels"
                className="vs-sportswear-dieline-card__img"
                loading="lazy"
              />
            </div>
            <div className="vs-sportswear-dieline-card__footer">
              <div className="vs-sportswear-color-swatches">
                <span className="vs-sportswear-swatch" style={{ background: '#1A1A1A' }} title="Base Body" />
                <span className="vs-sportswear-swatch" style={{ background: '#D4AF37' }} title="Gold Accent" />
                <span className="vs-sportswear-swatch" style={{ background: '#F0F0F0' }} title="Pure White" />
                <span className="vs-sportswear-swatch" style={{ background: '#0A1128' }} title="Navy Trim" />
                <span className="vs-sportswear-swatch" style={{ background: '#780000' }} title="Crimson Contrast" />
              </div>
              <span className="vs-sportswear-dieline-card__note">5 Independent Hex Layer Channels</span>
            </div>
          </div>
        )
      }}
      featuresProps={{
        id: 'features',
        badge: 'Engine Capabilities',
        sectionTitle: 'Built for High-Fidelity Custom Apparel',
        sectionSubtitle:
          'Precision tools for athletic apparel brands, team uniform distributors, and bespoke manufacturers.',
        layout: 'bento',
        columns: 3,
        features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Garment Catalog',
        sectionTitle: 'Explore Supported Teamwear Kits',
        sectionSubtitle:
          'Switch between interactive 3D garment presets to inspect geometry and fabric textures.',
        items: showcaseItems
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Performance & ROI',
        sectionTitle: 'Why Apparel Manufacturers Choose VictorShell',
        sectionSubtitle: 'Engineered for speed, conversion, and zero sampling waste.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive 3D Studio',
        title: 'Experience the Sportswear Configurator Live',
        description:
          'Step into the real-time 3D studio. Change colors, place vector logos, choose fabrics, and test player number rendering in your browser.',
        exploreDemoLabel: 'Launch 3D Configurator',
        exploreDemoHref: exploreDemoHref,
        note: 'Runs smoothly on Chrome, Safari, Firefox, and Edge · Desktop, tablet, and mobile'
      }}
    >
      {/* Dedicated Industry Use Cases Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="sportswear-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Proven Verticals</span>
            <h2 className="vs-landing-use-cases__title">Tailored for Every Athletic Discipline</h2>
            <p className="vs-landing-use-cases__subtitle">
              From elite professional teams to high-volume cut-and-sew garment factories.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-soccer">
              <div className="vs-use-case-card__icon" aria-hidden="true">⚽</div>
              <span className="vs-use-case-card__tag">Soccer &amp; Football</span>
              <h3 className="vs-use-case-card__title">Pro Club Match &amp; Away Kits</h3>
              <p className="vs-use-case-card__desc">
                Enable fans and club managers to design authentic matchday kits with multi-tier sponsor logos, official league sleeve patches, and personalized squad lettering.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-rugby">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏉</div>
              <span className="vs-use-case-card__tag">Rugby &amp; Contact Sports</span>
              <h3 className="vs-use-case-card__title">High-Tensile Interlock Uniforms</h3>
              <p className="vs-use-case-card__desc">
                Design heavy-duty tournament uniforms with reinforced collar stitch mapping, sublimated chest chevrons, and high-visibility player numbers built for collision durability.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-basketball">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏀</div>
              <span className="vs-use-case-card__tag">Basketball &amp; Track</span>
              <h3 className="vs-use-case-card__title">AAU Leagues &amp; Varsity Camps</h3>
              <p className="vs-use-case-card__desc">
                Configure lightweight sleeveless jerseys with wide armhole ribbing, arched chest typography, and ventilated open-mesh weave for maximum on-court breathability.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-factory">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏭</div>
              <span className="vs-use-case-card__tag">Manufacturing &amp; Sublimation</span>
              <h3 className="vs-use-case-card__title">Direct-to-Cutter Production</h3>
              <p className="vs-use-case-card__desc">
                Export 2048x2048 high-resolution 4-angle snapshot manifests and calibrated Pantone hex specifications directly to dye-sublimation printers and laser cutters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Technical Specs Section */}
      <section className="vs-landing-specs" id="specs" data-testid="sportswear-specs-section">
        <div className="vs-landing-specs__container">
          <div className="vs-landing-specs__header">
            <span className="vs-landing-specs__badge">Technical Specifications</span>
            <h2 className="vs-landing-specs__title">Engine &amp; Architecture Specifications</h2>
            <p className="vs-landing-specs__subtitle">
              Verified specifications powering the VictorShell Sportswear Configurator.
            </p>
          </div>

          <div className="vs-landing-specs__grid">
            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">3D Engine &amp; Graphics</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Rendering Engine</dt>
                  <dd>Three.js WebGPU / WebGL2 Fallback</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Core SDK</dt>
                  <dd>@trikomi/core &amp; @trikomi/sportswear</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Geometry Format</dt>
                  <dd>Optimized GLTF 2.0 with Draco mesh compression</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Lighting &amp; Studio</dt>
                  <dd>HDR Softbox studio environment with ground ambient glow</dd>
                </div>
              </dl>
            </div>

            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Decals &amp; Typography</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Vector Formats</dt>
                  <dd>SVG, PNG, High-Resolution Canvas DataURL</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>UV Projection</dt>
                  <dd>Real-time dynamic UV matrix mapping across seams</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Typography Engine</dt>
                  <dd>Sub-pixel canvas font rendering with custom fonts</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Export Output</dt>
                  <dd>Multi-angle 2048x2048 PNG snapshots &amp; dieline manifest</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
