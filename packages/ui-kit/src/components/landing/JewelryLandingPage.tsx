import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface JewelryLandingPageProps {
  /** Callback to launch the actual Jewelry Configurator 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/jewelry-configurator/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'orchid'. */
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
  theme = 'orchid',
  className = ''
}) => {
  // Navigation anchors for the single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Gemstone Atelier', href: '#showcase' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#specs' }
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
  const [activeMetal, setActiveMetal] = useState<'yellow' | 'rose' | 'platinum' | 'white'>('platinum');
  const [activeCut, setActiveCut] = useState<'round' | 'princess' | 'emerald' | 'cushion'>('round');

  const metalNames = {
    yellow: '18K Yellow Gold',
    rose: '18K Rose Gold',
    platinum: 'Platinum 950',
    white: '18K White Gold'
  };

  const cutNames = {
    round: 'Round Brilliant Cut (57 Facets)',
    princess: 'Princess Cut (76 Facets)',
    emerald: 'Emerald Step Cut (50 Facets)',
    cushion: 'Cushion Modified Brilliant'
  };

  // Hero visual stage with simulated diamond dispersion, metal switcher, and cut selector
  const heroVisual = (
    <div className="vs-jewelry-hero-stage" data-testid="jewelry-hero-stage">
      <div className="vs-jewelry-hero-stage__backdrop" aria-hidden="true" />

      <div className="vs-jewelry-hero-stage__controls">
        <span className="vs-jewelry-hero-stage__indicator">
          <span className="vs-jewelry-hero-stage__dot" />
          WebGPU Spectral Raytracing: Active
        </span>
        <div className="vs-jewelry-hero-stage__cuts">
          {(['round', 'princess', 'emerald', 'cushion'] as const).map((cut) => (
            <button
              key={cut}
              type="button"
              className={`vs-jewelry-cut-btn ${activeCut === cut ? 'is-active' : ''}`}
              onClick={() => setActiveCut(cut)}
              aria-label={`Select ${cut} cut`}
            >
              {cut.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="vs-jewelry-hero-stage__viewport">
        <img
          src="/logos/jewel.png"
          alt="Jewelry Configurator 3D Diamond Ring"
          className="vs-jewelry-hero-stage__gem"
        />

        {/* Spectral Dispersion Fire Pins */}
        <div className="vs-jewelry-sparkle-pin vs-jewelry-sparkle-pin--crown">
          <span className="vs-jewelry-sparkle-dot" />
          <span>Crown Caustic Fire</span>
        </div>
        <div className="vs-jewelry-sparkle-pin vs-jewelry-sparkle-pin--band">
          <span className="vs-jewelry-sparkle-dot" />
          <span>Anisotropic Metal</span>
        </div>
      </div>

      <div className="vs-jewelry-hero-stage__footer">
        <div className="vs-jewelry-hero-stage__meta">
          <span className="vs-jewelry-hero-stage__meta-label">Selected Metal &amp; Cut</span>
          <span className="vs-jewelry-hero-stage__meta-val">
            {metalNames[activeMetal]} · {cutNames[activeCut]}
          </span>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setActiveMetal('platinum')}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '999px',
                border: activeMetal === 'platinum' ? '1px solid var(--vs-primary)' : '1px solid var(--vs-control-border)',
                background: activeMetal === 'platinum' ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.6)',
                color: activeMetal === 'platinum' ? 'var(--vs-primary)' : 'var(--vs-ink-muted)',
                cursor: 'pointer'
              }}
            >
              Platinum
            </button>
            <button
              type="button"
              onClick={() => setActiveMetal('rose')}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '999px',
                border: activeMetal === 'rose' ? '1px solid var(--vs-primary)' : '1px solid var(--vs-control-border)',
                background: activeMetal === 'rose' ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.6)',
                color: activeMetal === 'rose' ? 'var(--vs-primary)' : 'var(--vs-ink-muted)',
                cursor: 'pointer'
              }}
            >
              Rose Gold
            </button>
            <button
              type="button"
              onClick={() => setActiveMetal('yellow')}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '999px',
                border: activeMetal === 'yellow' ? '1px solid var(--vs-primary)' : '1px solid var(--vs-control-border)',
                background: activeMetal === 'yellow' ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.6)',
                color: activeMetal === 'yellow' ? 'var(--vs-primary)' : 'var(--vs-ink-muted)',
                cursor: 'pointer'
              }}
            >
              Yellow Gold
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-jewelry-hero-stage__quick-btn vs-btn-secondary"
          data-testid="hero-quick-launch-btn"
        >
          Launch Atelier →
        </button>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="Jewelry Configurator"
      productBadge="Ray-Traced Spectral Dispersion"
      productTagline="Physically-based real-time 3D diamond caustics, precious metals, and custom ring customization."
      brandName="VictorShell"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Launch Jewelry Studio"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-jewelry-landing-page ${className}`.trim()}
      heroProps={{
        title: 'Photorealistic 3D Jewelry & Ray-Traced Diamond Studio',
        subtitle: 'Physical Dispersion, Diamond Fire Caustics, and Precious Metals in WebGPU',
        badge: 'Spectral PBR Engine · Abbe 58.6',
        description:
          'Experience diamond fire and optical light dispersion rendered in real time. Customize bespoke engagement rings, explore 18K precious metals, swap gemstone cuts, and inspect spectral sparkle with optical clarity on any device.',
        exploreDemoLabel: 'Launch Jewelry Studio',
        secondaryCta: {
          label: 'View Tech Specs',
          href: '#specs'
        },
        stats: [
          { value: 'Abbe 58.6', label: 'Optical Dispersion', hint: 'Natural rainbow diamond fire' },
          { value: '5 Cuts', label: 'Gemstone Shapes', hint: 'Brilliant, Princess, Emerald' },
          { value: '4 Metals', label: 'Precious Alloys', hint: 'Platinum, Gold, Rose Gold' }
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
        layout: 'bento',
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

      {/* Product Technical Specs Section */}
      <section className="vs-landing-specs" id="specs" data-testid="jewelry-specs-section">
        <div className="vs-landing-specs__container">
          <div className="vs-landing-specs__header">
            <span className="vs-landing-specs__badge">Technical Specifications</span>
            <h2 className="vs-landing-specs__title">Optical &amp; Shader Specifications</h2>
            <p className="vs-landing-specs__subtitle">
              Verified optical equations powering the VictorShell Jewelry Configurator.
            </p>
          </div>

          <div className="vs-landing-specs__grid">
            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Diamond Raytracing &amp; Dispersion</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Shader Engine</dt>
                  <dd>Three.js WebGPU / DiamondPlugin</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Dispersion Formula</dt>
                  <dd>Cauchy equation with Abbe coefficient (V = 58.6)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Internal Reflections</dt>
                  <dd>Multi-bounce total internal reflection (TIR)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Gemstone Geometry</dt>
                  <dd>Optimized GLTF with Draco facet compression</dd>
                </div>
              </dl>
            </div>

            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Precious Metals &amp; Studio Lighting</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Metal BRDF</dt>
                  <dd>Anisotropic microfacet reflection model</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Precious Metals</dt>
                  <dd>18K Yellow, 18K Rose, Platinum 950, White Gold</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Lighting Environments</dt>
                  <dd>HDR Softbox, Boutique Spotlight, Sunset Gem</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Export Capabilities</dt>
                  <dd>Print-ready 4K PNG renders with alpha transparency</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
