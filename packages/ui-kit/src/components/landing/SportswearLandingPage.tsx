import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import type { FeatureItem } from './LandingFeatures';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { StepItem } from './LandingHowItWorks';
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
 * Compact single-product landing page for the VictorShell Sportswear Configurator.
 * Follows the 6-section structure:
 * 1. Header with simple navigation & Explore Demo CTA
 * 2. Hero with interactive jersey angle stage & dual CTAs
 * 3. Key Features (6 cards)
 * 4. How It Works (3-step workflow)
 * 5. Interactive Preview with garment tabs & configurator launch CTA
 * 6. Final CTA & Footer
 */
export const SportswearLandingPage: React.FC<SportswearLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/sportswear-configurator/index.html#demo',
  theme = 'indigo',
  className = ''
}) => {
  // Navigation anchors for the compact layout
  const navLinks: LandingNavLink[] = [
    { label: 'Features', href: '#features', active: true },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Preview', href: '#showcase' }
  ];

  // 6 Core Features
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
      id: 'production-dieline',
      title: 'Factory Snapshot Export',
      description:
        'One-click multi-angle high-resolution snapshot generation and structured order manifests for dye-sublimation manufacturing.',
      badge: 'Production Ready'
    }
  ];

  // 3-Step How It Works Workflow
  const steps: StepItem[] = [
    {
      number: '01',
      title: 'Select Garment Silhouette',
      description:
        'Choose from Pro Soccer Jerseys, Rugby Match Kits, or Basketball Singlets with optimized WebGPU 3D geometry.',
      badge: 'Step 1: Base Model'
    },
    {
      number: '02',
      title: 'Customize Fabrics & Decals',
      description:
        'Apply team Pantone colors, select technical fabric textures, place vector SVG sponsor marks, and format player numbers.',
      badge: 'Step 2: Design & Details'
    },
    {
      number: '03',
      title: 'Inspect & Export Manifest',
      description:
        'Inspect across 4 studio camera angles and export high-resolution snapshot manifests for digital dye-sublimation production.',
      badge: 'Step 3: Manufacturing Ready'
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

  // Interactive states for hero visual controls
  const [activeHeroAngle, setActiveHeroAngle] = useState<'front' | 'back' | 'left' | 'right'>('front');
  const [activeFabric, setActiveFabric] = useState<'mesh' | 'knit' | 'smooth'>('mesh');

  const fabricNames = {
    mesh: 'Technical Mesh (Moisture-Wicking)',
    knit: 'Interlock Knit (Heavy Match Durability)',
    smooth: 'Sublimated Polyester (Smooth Sheen)'
  };

  // Hero visual component with interactive angle selector, fabric selector, and decal tags
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
      exploreDemoLabel="Explore Demo"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-sportswear-landing-page ${className}`.trim()}
      heroProps={{
        title: 'High-Performance Custom 3D Team Apparel',
        subtitle: 'Real-Time Texture Composer & Vector Decal Studio',
        badge: 'Interactive WebGPU Demo',
        description:
          'Configure professional team jerseys, rugby kits, and basketball singlets with live vector logo placement, custom player names and numbers, and photorealistic fabric shaders.',
        exploreDemoLabel: 'Explore Demo',
        secondaryCta: {
          label: 'Book a Demo',
          href: '#cta'
        },
        stats: [
          { value: '60 FPS', label: 'WebGPU Engine', hint: 'Fluid real-time viewport' },
          { value: '3 Kits', label: 'Garment Types', hint: 'Soccer, Rugby & Basketball' },
          { value: '< 1.2s', label: 'Load Time', hint: 'Streamed GLTF geometry' }
        ],
        visual: heroVisual,
        visualPosition: 'right'
      }}
      featuresProps={{
        id: 'features',
        badge: 'Core Features',
        sectionTitle: 'Key Features & Capabilities',
        sectionSubtitle:
          'Precision tools for athletic apparel brands, team uniform distributors, and custom kit designers.',
        layout: 'bento',
        columns: 3,
        features
      }}
      howItWorksProps={{
        id: 'how-it-works',
        badge: 'Workflow',
        sectionTitle: 'How It Works',
        sectionSubtitle: 'Three simple steps to design and manufacture custom teamwear',
        sectionDescription:
          'From base garment selection to direct factory dieline export in a frictionless browser workflow.',
        steps
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Interactive Preview',
        sectionTitle: 'Explore Supported Teamwear Kits',
        sectionSubtitle:
          'Inspect 3D garment presets with dynamic seam-wrapping decals and fabric micro-textures.',
        items: showcaseItems,
        action: {
          label: 'Launch 3D Configurator',
          onClick: onExploreDemo,
          href: exploreDemoHref
        }
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive 3D Studio',
        title: 'Experience the Sportswear Configurator Live',
        description:
          'Step into the real-time 3D studio. Change colors, place vector logos, choose fabrics, and test player typography directly in your browser.',
        exploreDemoLabel: 'Launch 3D Configurator',
        exploreDemoHref: exploreDemoHref,
        secondaryCta: {
          label: 'Book a Demo',
          onClick: onExploreDemo
        },
        note: 'Instant client-side rendering · WebGPU / WebGL2 · Responsive on all devices'
      }}
    />
  );
};
