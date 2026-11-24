import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface BoxLandingPageProps {
  /** Callback to launch the actual Box Configurator 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/box-configurator/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'indigo'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * BoxLandingPage
 *
 * Dedicated, premium single-product landing page for the VictorShell Box Configurator.
 * Built using the Frosted Glass design system and Task 22/23/24 reusable components.
 * Focuses exclusively on Parametric 3D Packaging Design:
 * - Real-time parametric carton kinematics (folding & flat dieline generation)
 * - 2D vector decal projection & custom graphics via Konva canvas
 * - Standard packaging templates (Reverse Tuck End, Mailer Box, Display Tray)
 * - Flap, notch, and cutout structural customization
 * - Production-ready vector dieline exports (PDF, SVG, DXF, PNG)
 */
export const BoxLandingPage: React.FC<BoxLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/box-configurator/index.html#demo',
  theme = 'indigo',
  className = ''
}) => {
  // Navigation anchors for the single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Box Templates', href: '#showcase' },
    { label: 'Packaging Verticals', href: '#use-cases' },
    { label: 'Manufacturing', href: '#benefits' },
    { label: 'Tech Specs', href: '#specs' }
  ];

  // Verified Features from ConfigStore.ts and @trikomi/core/box
  const features: FeatureItem[] = [
    {
      id: 'parametric-kinematics',
      title: 'Real-Time Carton Kinematics',
      description:
        'Smoothly animate the continuous folding sequence from a 2D flat dieline into a closed 3D carton with realistic hinge constraints.',
      badge: 'Hierarchical 3D Fold',
      highlight: true
    },
    {
      id: 'vector-decals',
      title: 'Interactive 2D Decal Projection',
      description:
        'Place, scale, and rotate high-resolution brand logos, vector typography, and graphics across box panels using Konva with zero distortion.',
      badge: 'Konva 2D Engine'
    },
    {
      id: 'standard-templates',
      title: 'Standard Packaging Library',
      description:
        'Pre-engineered industry templates including Reverse Tuck End cartons, Roll-End Mailers, and Counter Display Trays ready to customize.',
      badge: 'FEFCO / ECMA Standard'
    },
    {
      id: 'dieline-export',
      title: 'Production Vector Dieline Export',
      description:
        'Generate precision CAD/CAM dielines with separated vector layers for cut lines, crease scores, bleeds, and dimension callouts.',
      badge: 'PDF / SVG / DXF'
    },
    {
      id: 'parametric-sizing',
      title: 'Instant Dimension Scaling',
      description:
        'Adjust width, height, and depth dynamically while internal algorithm recalculates all tuck flaps, dust flaps, and glue tabs automatically.',
      badge: 'Auto-Flap Grading'
    },
    {
      id: 'material-finishes',
      title: 'Substrate & Foil Shaders',
      description:
        'Simulate authentic packaging materials including natural kraft board, corrugated flute, premium coated cardstock, and metallic foil stamping.',
      badge: 'WebGPU PBR'
    }
  ];

  // Interactive Showcase Views
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'mailer-view',
      label: 'E-Commerce Mailer',
      badge: 'box-mailer',
      description:
        'Roll-End Tuck-Front (RETF) mailer box with self-locking dust flaps and reinforced side walls, engineered for unboxing experiences.',
      visual: (
        <div className="vs-box-preview-card" data-testid="showcase-mailer-preview">
          <div className="vs-box-preview-card__badge-row">
            <span className="vs-box-chip">box-mailer</span>
            <span className="vs-box-chip vs-box-chip--accent">Roll-End Tuck-Front</span>
          </div>
          <div className="vs-box-preview-card__visual">
            <img
              src="/logos/box.png"
              alt="VictorShell Mailer Box"
              className="vs-box-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-box-preview-card__meta">
            <span className="vs-box-preview-card__title">E-Commerce Mailer Box</span>
            <span className="vs-box-preview-card__spec">Self-Locking Flaps · E-Flute Corrugated · 250×180×80mm</span>
          </div>
        </div>
      )
    },
    {
      id: 'tuck-end-view',
      label: 'Reverse Tuck End',
      badge: 'box-tuck-end',
      description:
        'Classic folding carton with friction-lock tuck flaps on opposite sides, ideal for cosmetics, pharmaceuticals, and retail retail goods.',
      visual: (
        <div className="vs-box-preview-card" data-testid="showcase-tuck-preview">
          <div className="vs-box-preview-card__badge-row">
            <span className="vs-box-chip">box-tuck-end</span>
            <span className="vs-box-chip vs-box-chip--accent">Reverse Tuck Style</span>
          </div>
          <div className="vs-box-preview-card__visual">
            <img
              src="/logos/box.png"
              alt="VictorShell Reverse Tuck End Box"
              className="vs-box-preview-card__img vs-box-preview-card__img--alt"
              loading="lazy"
            />
          </div>
          <div className="vs-box-preview-card__meta">
            <span className="vs-box-preview-card__title">Reverse Tuck End Carton</span>
            <span className="vs-box-preview-card__spec">Dual Tuck Closures · 18pt SBS Paperboard · 80×50×140mm</span>
          </div>
        </div>
      )
    },
    {
      id: 'tray-view',
      label: 'Display Tray',
      badge: 'box-open-tray',
      description:
        'Open-top retail display tray with reinforced double-wall sides designed for point-of-sale merchandising and counter showcases.',
      visual: (
        <div className="vs-box-preview-card" data-testid="showcase-tray-preview">
          <div className="vs-box-preview-card__badge-row">
            <span className="vs-box-chip">box-open-tray</span>
            <span className="vs-box-chip vs-box-chip--accent">Open Counter Tray</span>
          </div>
          <div className="vs-box-preview-card__visual">
            <img
              src="/logos/box.png"
              alt="VictorShell Display Tray"
              className="vs-box-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-box-preview-card__meta">
            <span className="vs-box-preview-card__title">Counter Merchandising Tray</span>
            <span className="vs-box-preview-card__spec">Open Display · Double-Wall Stiffeners · 200×150×60mm</span>
          </div>
        </div>
      )
    }
  ];

  // Benefits & Performance Metrics
  const benefits: BenefitItem[] = [
    {
      id: 'dieline-speed',
      title: 'Instant Dieline Computation',
      description:
        'Structural kinematics recalculate folding creases, cut perimeters, and glue flaps in sub-milliseconds as dimensions change.',
      metric: '0 sec',
      metricLabel: 'Calculation Delay',
      tag: 'Real-Time CAD'
    },
    {
      id: 'cut-accuracy',
      title: '100% Vector Precision',
      description:
        'Mathematical bezier contours ensure exported dielines match die-maker cutting rules with zero polygon tessellation error.',
      metric: '100%',
      metricLabel: 'Vector Accuracy',
      tag: 'Factory Grade'
    },
    {
      id: 'render-speed',
      title: '60 FPS 3D Kinematics',
      description:
        'Hierarchical scene graph calculates multi-panel folding angles smoothly in real-time WebGPU on any mobile or desktop screen.',
      metric: '60 FPS',
      metricLabel: 'Folding Simulation',
      tag: 'WebGL / WebGPU'
    },
    {
      id: 'export-formats',
      title: 'Universal CAD/CAM Formats',
      description:
        'Export production dielines in PDF, SVG, DXF, and PNG with separated cut lines, score creases, and dimension annotations.',
      metric: '4+ Formats',
      metricLabel: 'Production Outputs',
      tag: 'CNC Ready'
    }
  ];

  // Interactive state for hero visual simulation
  const [activeTemplate, setActiveTemplate] = useState<'tuck' | 'mailer' | 'tray'>('mailer');
  const [unfoldPercent, setUnfoldPercent] = useState<number>(35);

  // Hero visual stage with simulated parametric fold slider and dimension chips
  const heroVisual = (
    <div className="vs-box-hero-stage" data-testid="box-hero-stage">
      <div className="vs-box-hero-stage__backdrop" aria-hidden="true" />

      <div className="vs-box-hero-stage__controls">
        <div className="vs-box-hero-stage__templates">
          {(['mailer', 'tuck', 'tray'] as const).map((tpl) => (
            <button
              key={tpl}
              type="button"
              className={`vs-box-tpl-btn ${activeTemplate === tpl ? 'is-active' : ''}`}
              onClick={() => setActiveTemplate(tpl)}
              aria-label={`Select ${tpl} template`}
            >
              {tpl === 'mailer' ? 'MAILER BOX' : tpl === 'tuck' ? 'TUCK END' : 'OPEN TRAY'}
            </button>
          ))}
        </div>
        <span className="vs-box-chip vs-box-chip--accent">
          {unfoldPercent === 0 ? 'Closed 3D Box' : unfoldPercent === 100 ? 'Flat 2D Dieline' : `Folding: ${unfoldPercent}%`}
        </span>
      </div>

      <div className="vs-box-hero-stage__viewport">
        <img
          src="/logos/box.png"
          alt="Box Configurator 3D Packaging Model"
          className="vs-box-hero-stage__model"
        />

        {/* Parametric Dimension HUD Chips */}
        <div className="vs-box-dimension-chip vs-box-dimension-chip--width">
          <span>Width: 220mm</span>
        </div>
        <div className="vs-box-dimension-chip vs-box-dimension-chip--height">
          <span>Height: 160mm</span>
        </div>
        <div className="vs-box-dimension-chip vs-box-dimension-chip--depth">
          <span>Depth: 75mm</span>
        </div>
      </div>

      <div className="vs-box-hero-stage__footer">
        <div className="vs-box-hero-stage__slider-wrap">
          <label htmlFor="vs-box-unfold-slider" className="vs-box-hero-stage__slider-label">
            Interactive Fold Sequence
          </label>
          <input
            id="vs-box-unfold-slider"
            type="range"
            min="0"
            max="100"
            value={unfoldPercent}
            onChange={(e) => setUnfoldPercent(Number(e.target.value))}
            className="vs-box-hero-stage__slider"
            aria-label="Box unfold animation progress slider"
          />
        </div>
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-box-hero-stage__quick-btn vs-btn-secondary"
          data-testid="hero-quick-launch-btn"
        >
          Open 3D Studio →
        </button>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="Box Configurator"
      productBadge="Parametric 3D Dieline Engine"
      productTagline="Real-time parametric folding, 2D vector decal projection, and production-ready dieline export."
      brandName="VictorShell"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Launch Box Studio"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-box-landing-page ${className}`.trim()}
      heroProps={{
        title: 'Parametric 3D Packaging Design & Real-Time Dieline Studio',
        subtitle: 'From Custom Dimensions to Production CAD Dielines in Seconds',
        badge: 'Parametric Packaging Engine',
        description:
          'Design custom folding cartons, e-commerce mailer boxes, and retail trays directly in your browser. Adjust dimensions parametrically, place vector brand artwork with precision, preview interactive 3D folding sequences, and export certified dielines ready for die-cut manufacturing.',
        exploreDemoLabel: 'Launch Box Studio',
        secondaryCta: {
          label: 'View Tech Specs',
          href: '#specs'
        },
        stats: [
          { value: '3 Templates', label: 'Box Architectures', hint: 'Mailer, Tuck End, Open Tray' },
          { value: '100%', label: 'Vector Accuracy', hint: 'Millimeter-precise die lines' },
          { value: '4 Formats', label: 'Export Options', hint: 'PDF, SVG, DXF, PNG' }
        ],
        visual: heroVisual,
        visualPosition: 'right'
      }}
      overviewProps={{
        id: 'overview',
        badge: 'Structural Packaging Engineering',
        title: 'Precision Carton Kinematics from 2D Vector Cut Paths to 3D Assembly',
        subtitle: 'Real-time mathematical propagation of box depth, flap angles, and scoring rules',
        description:
          'Unlike generic 3D mockups, the VictorShell Box Configurator is built on a true parametric CAD kernel (@trikomi/core/box). Every panel, dust flap, tuck tab, and glue joint is mathematically linked to the primary length, width, and depth parameters. Changing any dimension instantly recalculates the entire unfolded dieline geometry.',
        highlights: [
          {
            title: 'Automatic Flap & Tab Grading',
            text: 'Tuck flap lengths, finger notches, and glue flap angles scale proportionally according to standard FEFCO/ECMA paperboard manufacturing rules.'
          },
          {
            title: 'Sub-Millimeter Crease Scoring',
            text: 'Accurately distinguishes through-cut perimeters, perforations, and 180° bidirectional crease score rules with dedicated color codes.'
          },
          {
            title: 'Live 2D Artwork Mapping',
            text: 'Seamless Konva 2D canvas overlay maps graphics, vector text, and barcodes directly onto individual box panels without UV seam tearing.'
          }
        ],
        visual: (
          <div className="vs-box-dieline-card" data-testid="box-dieline-card">
            <div className="vs-box-dieline-card__header">
              <span className="vs-box-dieline-card__title">Computed Dieline Layout</span>
              <span className="vs-box-chip">FEFCO Standard Vector</span>
            </div>
            <div className="vs-box-dieline-card__body">
              <div className="vs-box-dieline-mock">
                <svg viewBox="0 0 320 200" className="vs-box-dieline-svg" aria-label="Parametric Dieline Geometry Diagram">
                  {/* Outer cut outline */}
                  <rect x="20" y="20" width="280" height="160" rx="4" fill="none" stroke="var(--vs-primary)" strokeWidth="2" strokeDasharray="none" />
                  {/* Crease score lines */}
                  <line x1="90" y1="20" x2="90" y2="180" stroke="var(--vs-primary-light)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <line x1="160" y1="20" x2="160" y2="180" stroke="var(--vs-primary-light)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <line x1="230" y1="20" x2="230" y2="180" stroke="var(--vs-primary-light)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <line x1="20" y1="70" x2="300" y2="70" stroke="var(--vs-primary-light)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <line x1="20" y1="130" x2="300" y2="130" stroke="var(--vs-primary-light)" strokeWidth="1.5" strokeDasharray="4 3" />
                  {/* Panel dimension labels */}
                  <text x="55" y="105" fill="var(--vs-ink-muted)" fontSize="10" textAnchor="middle" fontFamily="var(--vs-font-mono)">Side A</text>
                  <text x="125" y="105" fill="var(--vs-primary)" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--vs-font-mono)">Front Panel</text>
                  <text x="195" y="105" fill="var(--vs-ink-muted)" fontSize="10" textAnchor="middle" fontFamily="var(--vs-font-mono)">Side B</text>
                  <text x="265" y="105" fill="var(--vs-ink-muted)" fontSize="10" textAnchor="middle" fontFamily="var(--vs-font-mono)">Back Panel</text>
                  <text x="125" y="50" fill="var(--vs-ink-subtle)" fontSize="9" textAnchor="middle" fontFamily="var(--vs-font-mono)">Top Flap</text>
                  <text x="125" y="160" fill="var(--vs-ink-subtle)" fontSize="9" textAnchor="middle" fontFamily="var(--vs-font-mono)">Bottom Tuck</text>
                </svg>
              </div>
            </div>
            <div className="vs-box-dieline-card__footer">
              <span className="vs-box-dieline-card__note">Green = Through Cut · Magenta = Crease Fold · Blue = Bleed Margin</span>
            </div>
          </div>
        )
      }}
      featuresProps={{
        id: 'features',
        badge: 'Packaging Engineering',
        sectionTitle: 'Production-Grade Packaging Tools in Your Browser',
        sectionSubtitle:
          'From initial dimensional concept to manufacturing-ready dielines without external CAD plugins.',
        layout: 'bento',
        columns: 3,
        features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Box Architectures',
        sectionTitle: 'Explore Industry Packaging Models',
        sectionSubtitle:
          'Switch between e-commerce mailers, cosmetic tuck-end cartons, and retail counter display trays.',
        items: showcaseItems
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Manufacturing & Speed',
        sectionTitle: 'Why Packaging Manufacturers Choose Box Configurator',
        sectionSubtitle: 'Zero design turnaround latency, 100% vector accuracy, and direct die-cutting export.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive Packaging Studio',
        title: 'Start Designing Your Custom Box in Real-Time 3D',
        description:
          'Select a template, customize length, width, and depth, place your brand graphics, and export production-ready vector dielines instantly.',
        exploreDemoLabel: 'Launch Box Studio',
        exploreDemoHref: exploreDemoHref,
        note: 'Zero CAD software installation · Runs on any browser · Instant vector export'
      }}
    >
      {/* Dedicated Industry Use Cases Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="box-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Packaging Verticals</span>
            <h2 className="vs-landing-use-cases__title">Engineered for Brands, Printers &amp; Die-Makers</h2>
            <p className="vs-landing-use-cases__subtitle">
              From direct-to-consumer unboxing boxes to mass-production retail packaging lines.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-ecommerce">
              <div className="vs-use-case-card__icon" aria-hidden="true">📦</div>
              <span className="vs-use-case-card__tag">E-Commerce &amp; D2C</span>
              <h3 className="vs-use-case-card__title">Custom Branded Mailers</h3>
              <p className="vs-use-case-card__desc">
                Enable online retailers and subscription box brands to design personalized unboxing packages with dynamic double-sided artwork and custom inserts.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-cosmetics">
              <div className="vs-use-case-card__icon" aria-hidden="true">💄</div>
              <span className="vs-use-case-card__tag">Cosmetics &amp; Pharma</span>
              <h3 className="vs-use-case-card__title">Reverse Tuck Folding Cartons</h3>
              <p className="vs-use-case-card__desc">
                Design lightweight paperboard cartons for perfumes, skincare bottles, and medicine packaging with tight friction-lock closures and safety tabs.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-retail">
              <div className="vs-use-case-card__icon" aria-hidden="true">🏪</div>
              <span className="vs-use-case-card__tag">Retail &amp; POS</span>
              <h3 className="vs-use-case-card__title">Point-of-Sale Counter Trays</h3>
              <p className="vs-use-case-card__desc">
                Create sturdy corrugated open display boxes for checkout counters and supermarket shelves with integrated header cards and tear-away lips.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-diemakers">
              <div className="vs-use-case-card__icon" aria-hidden="true">📐</div>
              <span className="vs-use-case-card__tag">Print Production</span>
              <h3 className="vs-use-case-card__title">Direct CNC Die-Cutter Export</h3>
              <p className="vs-use-case-card__desc">
                Deliver clean 1:1 scale DXF and vector PDF files directly into Zünd, Kongsberg, and laser die-cutting software with zero manual redraw overhead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Technical Specs Section */}
      <section className="vs-landing-specs" id="specs" data-testid="box-specs-section">
        <div className="vs-landing-specs__container">
          <div className="vs-landing-specs__header">
            <span className="vs-landing-specs__badge">Technical Specifications</span>
            <h2 className="vs-landing-specs__title">Structural &amp; CAD Specifications</h2>
            <p className="vs-landing-specs__subtitle">
              Verified structural packaging specifications powering the VictorShell Box Configurator.
            </p>
          </div>

          <div className="vs-landing-specs__grid">
            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Parametric CAD Engine</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Geometry Kernel</dt>
                  <dd>@trikomi/core/box parametric node graph</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Kinematic Solver</dt>
                  <dd>Hierarchical 3D panel folding with collision guards</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Flap Calculations</dt>
                  <dd>FEFCO &amp; ECMA standard packaging rule propagation</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Graphic Projection</dt>
                  <dd>Konva 2D vector canvas to 3D WebGPU PBR texture mapping</dd>
                </div>
              </dl>
            </div>

            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">CAD/CAM &amp; Export Formats</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Vector Dieline</dt>
                  <dd>PDF (Vector), SVG, DXF (AutoCAD / CNC)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Layer Separation</dt>
                  <dd>Through-Cut, Crease Score, Bleed, Dimensions</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>3D Asset Export</dt>
                  <dd>GLTF 2.0 with embedded PBR textures</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Design Presets</dt>
                  <dd>Tuck End, Roll-End Mailer, Open Display Tray, Custom</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
