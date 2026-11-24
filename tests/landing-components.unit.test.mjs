import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  LandingBenefits,
  LandingCtaSection,
  LandingFeatures,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingNav,
  LandingOverview,
  LandingVisualShowcase,
  ProductLandingLayout,
  ProductLandingTemplate,
  SportswearLandingPage,
  FaceMocapLandingPage,
  JewelryLandingPage,
  BoxLandingPage,
  TourLandingPage,
  EyewearLandingPage,
  ViewerLandingPage,
  VictorShellThemeProvider
} from '../packages/ui-kit/src/index.ts';

test('LandingNav renders horizontal and vertical navigation links with active state', () => {
  const links = [
    { id: 'overview', label: 'Overview', href: '#overview', active: true },
    { id: 'specs', label: 'Tech Specs', href: '#specs', badge: 'v1.0' },
    { id: 'docs', label: 'SDK Docs', href: '/docs', external: true }
  ];

  // Horizontal navigation
  const horizontalHtml = renderToStaticMarkup(
    React.createElement(LandingNav, { links, orientation: 'horizontal' })
  );
  assert.ok(horizontalHtml.includes('vs-landing-nav--horizontal'), 'Should apply horizontal orientation class.');
  assert.ok(horizontalHtml.includes('Overview'), 'Should render Overview link.');
  assert.ok(horizontalHtml.includes('Tech Specs'), 'Should render Tech Specs link.');
  assert.ok(horizontalHtml.includes('is-active'), 'Active link should have is-active class.');
  assert.ok(horizontalHtml.includes('aria-current="page"'), 'Active link should have aria-current="page".');
  assert.ok(horizontalHtml.includes('vs-landing-nav__indicator'), 'Active link should have visual indicator.');
  assert.ok(horizontalHtml.includes('v1.0'), 'Badge should be rendered.');
  assert.ok(horizontalHtml.includes('target="_blank"'), 'External link should have target="_blank".');

  // Vertical navigation
  const verticalHtml = renderToStaticMarkup(
    React.createElement(LandingNav, { links, orientation: 'vertical' })
  );
  assert.ok(verticalHtml.includes('vs-landing-nav--vertical'), 'Should apply vertical orientation class.');
});

test('LandingHeader renders single product branding, theme switcher, and Explore Demo CTA', () => {
  const headerHtml = renderToStaticMarkup(
    React.createElement(
      VictorShellThemeProvider,
      { initialAccent: 'violet' },
      React.createElement(LandingHeader, {
        productTitle: 'Jewelry Configurator',
        productBadge: 'Ray Traced Diamond',
        brandName: 'VictorShell',
        showThemeSwitcher: true,
        exploreDemoLabel: 'Explore Demo',
        navLinks: [
          { label: 'Overview', href: '#overview', active: true },
          { label: 'Gems', href: '#gems' }
        ]
      })
    )
  );

  // 1. Single Product Branding
  assert.ok(headerHtml.includes('Jewelry Configurator'), 'Must display the specific product title.');
  assert.ok(headerHtml.includes('data-testid="product-title"'), 'Product title must have testid.');
  assert.ok(headerHtml.includes('Ray Traced Diamond'), 'Must display product badge.');
  assert.ok(headerHtml.includes('data-testid="product-badge"'), 'Product badge must have testid.');
  assert.ok(headerHtml.includes('VictorShell'), 'Must display brand name.');

  // 2. Triple Theme Switcher
  assert.ok(headerHtml.includes('data-testid="landing-theme-switcher"'), 'Theme switcher must be present.');
  assert.ok(headerHtml.includes('aria-label="Violet theme"'), 'Must have Violet theme option.');
  assert.ok(headerHtml.includes('aria-label="Indigo theme"'), 'Must have Indigo theme option.');
  assert.ok(headerHtml.includes('aria-label="Orchid theme"'), 'Must have Orchid theme option.');

  // 3. Mandatory Explore Demo CTA
  assert.ok(headerHtml.includes('data-testid="explore-demo-btn"'), 'Explore Demo CTA button must exist.');
  assert.ok(headerHtml.includes('vs-btn-primary'), 'Explore Demo button must use primary button style.');
  assert.ok(headerHtml.includes('Explore Demo'), 'CTA text must be rendered.');

  // 4. Mobile Menu Toggle
  assert.ok(headerHtml.includes('data-testid="mobile-nav-toggle"'), 'Mobile hamburger toggle button must exist.');
});

test('LandingFooter renders single product metadata, status indicator, links, and back-to-top', () => {
  const footerHtml = renderToStaticMarkup(
    React.createElement(LandingFooter, {
      productTitle: 'Box Configurator',
      productTagline: 'Parametric 3D box engineering and real-time dieline generation.',
      brandName: 'VictorShell',
      sdkVersion: '@trikomi/core WebGPU 3D Engine',
      showBackToTop: true
    })
  );

  assert.ok(footerHtml.includes('Box Configurator'), 'Footer must display product title.');
  assert.ok(footerHtml.includes('Parametric 3D box engineering'), 'Footer must display product tagline.');
  assert.ok(footerHtml.includes('@trikomi/core WebGPU 3D Engine'), 'Footer must display engine status indicator.');
  assert.ok(footerHtml.includes('vs-landing-footer__status-dot'), 'Footer must display animated status dot.');
  assert.ok(footerHtml.includes('3D Platform'), 'Footer must list platform columns.');
  assert.ok(footerHtml.includes('Developer SDK'), 'Footer must list SDK documentation column.');
  assert.ok(footerHtml.includes('data-testid="back-to-top-btn"'), 'Footer must provide back-to-top action.');
  assert.ok(footerHtml.includes('All rights reserved'), 'Footer must display copyright line.');
});

test('ProductLandingLayout coordinates Header, ambient background, main content, and Footer', () => {
  const layoutHtml = renderToStaticMarkup(
    React.createElement(
      ProductLandingLayout,
      {
        productTitle: 'Sportswear Configurator',
        productBadge: 'Dynamic SVG Decals',
        productTagline: 'Interactive custom jersey colors, fabrics, logos and numbers.',
        theme: 'indigo',
        onExploreDemo: () => {},
        navLinks: [{ label: 'Design Lab', href: '#lab', active: true }]
      },
      React.createElement('div', { 'data-testid': 'custom-product-content' }, 'Hero Section for Sportswear')
    )
  );

  assert.ok(layoutHtml.includes('data-testid="product-landing-layout"'), 'Layout container must be rendered.');
  assert.ok(layoutHtml.includes('data-accent="indigo"'), 'Theme provider must set data-accent="indigo".');
  assert.ok(layoutHtml.includes('vs-landing-ambient'), 'Ambient background glow must be rendered.');
  assert.ok(layoutHtml.includes('Sportswear Configurator'), 'Product title must be present in layout.');
  assert.ok(layoutHtml.includes('Dynamic SVG Decals'), 'Product badge must be present in layout.');
  assert.ok(layoutHtml.includes('Hero Section for Sportswear'), 'Children content must be rendered inside main.');
  assert.ok(layoutHtml.includes('vs-landing-footer'), 'LandingFooter must be rendered by layout.');
});

test('LandingHero renders product title, badge, CTAs, stats, and visual stage', () => {
  const heroHtml = renderToStaticMarkup(
    React.createElement(LandingHero, {
      title: 'Sportswear Configurator',
      subtitle: 'Real-time 3D Apparel Customization Engine',
      badge: 'Interactive WebGPU Demo',
      description: 'Configure high-performance team jerseys with dynamic vector decals, sublimation materials, and instant 3D preview.',
      exploreDemoLabel: 'Launch Configurator Demo',
      onExploreDemo: () => {},
      secondaryCta: {
        label: 'View Tech Specs',
        href: '#specs'
      },
      stats: [
        { value: '60 FPS', label: 'WebGPU Engine', hint: 'Ultra smooth rendering' },
        { value: '< 1.5s', label: 'Load Time', hint: 'Optimized GLTF streaming' }
      ],
      visual: React.createElement('div', { 'data-testid': 'mock-hero-visual' }, '3D Jersey Canvas'),
      visualPosition: 'right'
    })
  );

  assert.ok(heroHtml.includes('data-testid="landing-hero"'), 'Hero section container must exist.');
  assert.ok(heroHtml.includes('Sportswear Configurator'), 'Hero must display product title.');
  assert.ok(heroHtml.includes('Real-time 3D Apparel Customization Engine'), 'Hero must display subtitle.');
  assert.ok(heroHtml.includes('Interactive WebGPU Demo'), 'Hero must display product badge.');
  assert.ok(heroHtml.includes('Configure high-performance team jerseys'), 'Hero must render intro description.');
  assert.ok(heroHtml.includes('Launch Configurator Demo'), 'Hero must render primary CTA text.');
  assert.ok(heroHtml.includes('data-testid="hero-explore-demo-btn"'), 'Hero must have explore demo button testid.');
  assert.ok(heroHtml.includes('View Tech Specs'), 'Hero must render secondary CTA.');
  assert.ok(heroHtml.includes('href="#specs"'), 'Secondary CTA must have correct href.');
  assert.ok(heroHtml.includes('60 FPS'), 'Hero must render stat value.');
  assert.ok(heroHtml.includes('WebGPU Engine'), 'Hero must render stat label.');
  assert.ok(heroHtml.includes('mock-hero-visual'), 'Hero must render custom visual slot.');
  assert.ok(heroHtml.includes('vs-landing-hero--visual-right'), 'Hero must apply right visual placement modifier.');
});

test('LandingFeatures renders grid and bento layouts with feature items', () => {
  const features = [
    {
      id: 'decal-engine',
      title: 'Dynamic Vector Decals',
      description: 'Upload custom SVG artwork and position logos with real-time UV projection.',
      badge: 'Core Tech'
    },
    {
      id: 'sublimation',
      title: 'Sublimation Materials',
      description: 'Photorealistic fabric shaders replicating technical knit and moisture-wicking weave.',
      badge: 'PBR'
    },
    {
      id: 'color-palette',
      title: 'Pantone Palette Matching',
      description: 'Accurate color calibration ensuring what you design matches physical production.',
      action: { label: 'Learn more', href: '#palette' }
    }
  ];

  // Grid layout test
  const gridHtml = renderToStaticMarkup(
    React.createElement(LandingFeatures, {
      badge: 'Engine Capabilities',
      sectionTitle: 'Built for High-Performance Apparel',
      sectionSubtitle: 'Precision 3D customization with zero latency.',
      features,
      layout: 'grid',
      columns: 3
    })
  );

  assert.ok(gridHtml.includes('data-testid="landing-features"'), 'Features container must exist.');
  assert.ok(gridHtml.includes('Engine Capabilities'), 'Features badge must be rendered.');
  assert.ok(gridHtml.includes('Built for High-Performance Apparel'), 'Features title must be rendered.');
  assert.ok(gridHtml.includes('Dynamic Vector Decals'), 'Feature title 1 rendered.');
  assert.ok(gridHtml.includes('Sublimation Materials'), 'Feature title 2 rendered.');
  assert.ok(gridHtml.includes('Pantone Palette Matching'), 'Feature title 3 rendered.');
  assert.ok(gridHtml.includes('vs-landing-features--cols-3'), 'Columns class must be applied.');
  assert.ok(gridHtml.includes('Core Tech'), 'Feature badge rendered.');
  assert.ok(gridHtml.includes('href="#palette"'), 'Feature link rendered.');

  // Bento layout test
  const bentoHtml = renderToStaticMarkup(
    React.createElement(LandingFeatures, {
      sectionTitle: 'Next-Gen Configurator',
      features,
      layout: 'bento'
    })
  );
  assert.ok(bentoHtml.includes('vs-landing-features--bento'), 'Bento layout modifier must be applied.');
});

test('LandingOverview renders product narrative, highlights, and visual side-by-side', () => {
  const overviewHtml = renderToStaticMarkup(
    React.createElement(LandingOverview, {
      badge: 'Architecture Overview',
      title: 'True-to-Scale Parametric Box Engineering',
      subtitle: 'From 2D dieline to folded 3D carton in milliseconds.',
      description: 'The Box Configurator connects directly with packaging CAD formats. Users can adjust dimensions, flute thicknesses, and tuck closures.',
      highlights: [
        {
          title: 'Live Folding Simulation',
          text: 'Step-by-step carton folding animation powered by joint kinematics.'
        },
        {
          title: 'Export Production Vector PDF',
          text: 'One-click export of ready-to-print vector cut/crease lines.'
        }
      ],
      visual: React.createElement('div', { 'data-testid': 'box-folding-preview' }, 'Interactive Carton Preview'),
      reversed: true
    })
  );

  assert.ok(overviewHtml.includes('data-testid="landing-overview"'), 'Overview section must exist.');
  assert.ok(overviewHtml.includes('Architecture Overview'), 'Overview badge must be rendered.');
  assert.ok(overviewHtml.includes('True-to-Scale Parametric Box Engineering'), 'Overview title must be rendered.');
  assert.ok(overviewHtml.includes('From 2D dieline to folded 3D carton'), 'Overview subtitle must be rendered.');
  assert.ok(overviewHtml.includes('The Box Configurator connects directly'), 'Description text rendered.');
  assert.ok(overviewHtml.includes('Live Folding Simulation'), 'Highlight 1 title rendered.');
  assert.ok(overviewHtml.includes('Step-by-step carton folding animation'), 'Highlight 1 text rendered.');
  assert.ok(overviewHtml.includes('box-folding-preview'), 'Visual node rendered.');
  assert.ok(overviewHtml.includes('vs-landing-overview--reversed'), 'Reversed class modifier must be present.');
});

test('LandingBenefits renders metric callouts, frosted cards, and tags', () => {
  const benefits = [
    {
      id: 'performance',
      title: 'Sub-Millisecond Tracking',
      description: '68 facial landmark tracking runs smoothly in real time.',
      metric: '68 pts',
      metricLabel: 'Landmark Mesh',
      tag: 'MediaPipe'
    },
    {
      id: 'latency',
      title: 'Zero Cloud Roundtrips',
      description: 'All face analysis and expression blendshapes execute purely on-device.',
      metric: '0 ms',
      metricLabel: 'Server Latency',
      tag: 'Privacy First'
    }
  ];

  const benefitsHtml = renderToStaticMarkup(
    React.createElement(LandingBenefits, {
      badge: 'Performance & Privacy',
      sectionTitle: 'Why Developers Choose Face Mocap',
      sectionSubtitle: 'Engineered for seamless in-browser motion capture.',
      items: benefits,
      variant: 'metrics'
    })
  );

  assert.ok(benefitsHtml.includes('data-testid="landing-benefits"'), 'Benefits container must exist.');
  assert.ok(benefitsHtml.includes('data-testid="benefits-badge"'), 'Benefits badge container rendered.');
  assert.ok(benefitsHtml.includes('Performance &amp; Privacy'), 'Benefits badge rendered.');
  assert.ok(benefitsHtml.includes('Why Developers Choose Face Mocap'), 'Benefits title rendered.');
  assert.ok(benefitsHtml.includes('68 pts'), 'Metric 1 value rendered.');
  assert.ok(benefitsHtml.includes('Landmark Mesh'), 'Metric 1 label rendered.');
  assert.ok(benefitsHtml.includes('0 ms'), 'Metric 2 value rendered.');
  assert.ok(benefitsHtml.includes('Server Latency'), 'Metric 2 label rendered.');
  assert.ok(benefitsHtml.includes('MediaPipe'), 'Tag rendered in benefits.');
  assert.ok(benefitsHtml.includes('vs-landing-benefits--metrics'), 'Metrics modifier applied.');
});

test('LandingVisualShowcase renders tabbed product modes and preview stage', () => {
  const showcaseItems = [
    {
      id: 'diamonds',
      label: 'Diamond Refraction',
      badge: 'Ray Traced PBR',
      description: 'Physical caustic simulation calculates realistic sparkle in real-time.',
      visual: React.createElement('div', { 'data-testid': 'diamond-stage' }, 'Diamond Visualizer')
    },
    {
      id: 'metals',
      label: 'Precious Metals',
      badge: 'Microfacet PBR',
      description: 'Accurate metal anisotropic roughness reflections.',
      visual: React.createElement('div', { 'data-testid': 'metal-stage' }, 'Metal Visualizer')
    }
  ];

  const showcaseHtml = renderToStaticMarkup(
    React.createElement(LandingVisualShowcase, {
      badge: 'Visual Fidelity',
      sectionTitle: 'Explore High-Precision Jewelry Rendering',
      sectionSubtitle: 'Switch between shader modes to inspect real-time optical quality.',
      items: showcaseItems,
      defaultActiveId: 'diamonds'
    })
  );

  assert.ok(showcaseHtml.includes('data-testid="landing-visual-showcase"'), 'Visual showcase container rendered.');
  assert.ok(showcaseHtml.includes('Explore High-Precision Jewelry Rendering'), 'Showcase title rendered.');
  assert.ok(showcaseHtml.includes('Diamond Refraction'), 'Tab 1 label rendered.');
  assert.ok(showcaseHtml.includes('Precious Metals'), 'Tab 2 label rendered.');
  assert.ok(showcaseHtml.includes('Physical caustic simulation'), 'Active item description rendered.');
  assert.ok(showcaseHtml.includes('diamond-stage'), 'Active visual stage rendered.');
  assert.ok(showcaseHtml.includes('Ray Traced PBR'), 'Active item badge rendered.');
});

test('LandingCtaSection renders conversion banner, primary Explore Demo button, and reassurance note', () => {
  const ctaHtml = renderToStaticMarkup(
    React.createElement(LandingCtaSection, {
      badge: 'Ready to Experience',
      title: 'Test the 360° Virtual Tour Live in Your Browser',
      description: 'Seamless hotspot navigation, spherical panorama streaming, and spatial audio with zero plugins.',
      exploreDemoLabel: 'Explore Interactive Tour Demo',
      onExploreDemo: () => {},
      secondaryCta: {
        label: 'Read SDK Documentation',
        href: '/docs/tour'
      },
      note: 'No installation required • Runs natively on mobile and desktop browsers'
    })
  );

  assert.ok(ctaHtml.includes('data-testid="landing-cta-section"'), 'CTA section container rendered.');
  assert.ok(ctaHtml.includes('vs-landing-cta-card'), 'Frosted banner card rendered.');
  assert.ok(ctaHtml.includes('Test the 360° Virtual Tour Live in Your Browser'), 'CTA title rendered.');
  assert.ok(ctaHtml.includes('Explore Interactive Tour Demo'), 'Primary CTA text rendered.');
  assert.ok(ctaHtml.includes('data-testid="cta-explore-demo-btn"'), 'Primary CTA button testid rendered.');
  assert.ok(ctaHtml.includes('Read SDK Documentation'), 'Secondary CTA rendered.');
  assert.ok(ctaHtml.includes('href="/docs/tour"'), 'Secondary CTA href rendered.');
  assert.ok(ctaHtml.includes('No installation required'), 'Reassurance note rendered.');
});

test('ProductLandingTemplate coordinates master layout, sections, and theme', () => {
  const templateHtml = renderToStaticMarkup(
    React.createElement(ProductLandingTemplate, {
      productTitle: 'Box Configurator',
      productBadge: 'Parametric Dielines',
      productTagline: 'Custom carton folding simulation.',
      theme: 'violet',
      onExploreDemo: () => {},
      exploreDemoLabel: 'Launch Studio',
      navLinks: [{ label: 'Overview', href: '#overview', active: true }],
      heroProps: {
        title: 'Parametric Packaging in 3D',
        description: 'Design and fold custom corrugated cartons live in your browser.'
      },
      overviewProps: {
        title: 'Precision Kinematics',
        description: 'Folding animation matches real box board thickness.'
      },
      featuresProps: {
        sectionTitle: 'Core Capabilities',
        features: [
          { title: 'Dieline Import', description: 'Supports standard CAD formats.' }
        ]
      },
      showcaseProps: {
        sectionTitle: 'Box Styles',
        items: [
          { id: 'mailer', label: 'Mailer Box', visual: React.createElement('div', null, 'Mailer') }
        ]
      },
      benefitsProps: {
        sectionTitle: 'Production Efficiency',
        items: [
          { title: 'Zero Waste', description: 'Accurate die lines eliminate scrap.', metric: '0%', metricLabel: 'Scrap Rate' }
        ]
      }
    })
  );

  assert.ok(templateHtml.includes('vs-product-landing-template'), 'Template class must be applied.');
  assert.ok(templateHtml.includes('data-accent="violet"'), 'Theme accent must be set to violet.');
  assert.ok(templateHtml.includes('Parametric Packaging in 3D'), 'Hero title must be rendered.');
  assert.ok(templateHtml.includes('Precision Kinematics'), 'Overview section must be rendered.');
  assert.ok(templateHtml.includes('Core Capabilities'), 'Features section must be rendered.');
  assert.ok(templateHtml.includes('Box Styles'), 'Showcase section must be rendered.');
  assert.ok(templateHtml.includes('Production Efficiency'), 'Benefits section must be rendered.');
  assert.ok(templateHtml.includes('Launch Studio'), 'CTA buttons must use exploreDemoLabel.');
});

test('SportswearLandingPage renders complete sample page with verified features, assets, and demo CTA', () => {
  const samplePageHtml = renderToStaticMarkup(
    React.createElement(SportswearLandingPage, {
      onExploreDemo: () => {},
      exploreDemoHref: '/apps/sportswear-configurator/index.html#demo',
      theme: 'indigo'
    })
  );

  // 1. Branding & Header
  assert.ok(samplePageHtml.includes('Sportswear Configurator'), 'Product title must be displayed.');
  assert.ok(samplePageHtml.includes('WebGPU Vector Decal Engine'), 'Product badge must be displayed.');
  assert.ok(samplePageHtml.includes('data-accent="indigo"'), 'Indigo theme must be applied.');
  assert.ok(samplePageHtml.includes('Launch 3D Configurator'), 'Primary Explore Demo CTA must be displayed.');

  // 2. Navigation
  assert.ok(samplePageHtml.includes('href="#overview"'), 'Nav must link to Overview.');
  assert.ok(samplePageHtml.includes('href="#features"'), 'Nav must link to Features.');
  assert.ok(samplePageHtml.includes('href="#showcase"'), 'Nav must link to Showcase.');
  assert.ok(samplePageHtml.includes('href="#use-cases"'), 'Nav must link to Use Cases.');
  assert.ok(samplePageHtml.includes('href="#benefits"'), 'Nav must link to Performance.');
  assert.ok(samplePageHtml.includes('href="#specs"'), 'Nav must link to Tech Specs.');

  // 3. Hero Section & Stage
  assert.ok(samplePageHtml.includes('High-Performance Custom 3D Team Apparel'), 'Hero title rendered.');
  assert.ok(samplePageHtml.includes('sportswear-hero-stage'), 'Hero interactive stage rendered.');
  assert.ok(samplePageHtml.includes('WebGPU Canvas Active'), 'Hero status indicator rendered.');
  assert.ok(samplePageHtml.includes('Dynamic Crest UV'), 'Hero decal tag rendered.');
  assert.ok(samplePageHtml.includes('Vector Sponsor Mark'), 'Hero sponsor tag rendered.');
  assert.ok(samplePageHtml.includes('hero-quick-launch-btn'), 'Quick launch demo button rendered.');
  assert.ok(samplePageHtml.includes('/logos/jersey.png'), 'Real jersey asset referenced.');

  // 4. Overview Deep-Dive
  assert.ok(samplePageHtml.includes('True-to-Scale Fabric Simulation &amp; Sublimation Pipeline'), 'Overview title rendered.');
  assert.ok(samplePageHtml.includes('sportswear-dieline-card'), 'Technical dieline card rendered.');
  assert.ok(samplePageHtml.includes('/svgs/uv_layout_with_labels.svg'), 'Real UV layout asset referenced.');
  assert.ok(samplePageHtml.includes('5 Independent Hex Layer Channels'), 'Color channels note rendered.');

  // 5. Key Features
  assert.ok(samplePageHtml.includes('Dynamic Vector Decals'), 'Feature 1 rendered.');
  assert.ok(samplePageHtml.includes('Technical Fabric Shaders'), 'Feature 2 rendered.');
  assert.ok(samplePageHtml.includes('Player Names &amp; Numbers'), 'Feature 3 rendered.');
  assert.ok(samplePageHtml.includes('4-Angle Studio Cameras'), 'Feature 4 rendered.');
  assert.ok(samplePageHtml.includes('Multi-Sport Garment Models'), 'Feature 5 rendered.');
  assert.ok(samplePageHtml.includes('Factory Snapshot Export'), 'Feature 6 rendered.');

  // 6. Visual Showcase
  assert.ok(samplePageHtml.includes('Explore Supported Teamwear Kits'), 'Showcase title rendered.');
  assert.ok(samplePageHtml.includes('Pro Soccer Kit'), 'Garment tab 1 rendered.');
  assert.ok(samplePageHtml.includes('Rugby Match Kit'), 'Garment tab 2 rendered.');
  assert.ok(samplePageHtml.includes('Basketball Singlet'), 'Garment tab 3 rendered.');
  assert.ok(samplePageHtml.includes('SoccerJersey.gltf'), 'GLTF model chip rendered.');

  // 7. Benefits & Metrics
  assert.ok(samplePageHtml.includes('Why Apparel Manufacturers Choose VictorShell'), 'Benefits title rendered.');
  assert.ok(samplePageHtml.includes('60 FPS'), 'Metric 1 value rendered.');
  assert.ok(samplePageHtml.includes('&lt; 1.2s'), 'Metric 2 value rendered.');
  assert.ok(samplePageHtml.includes('$0 / hr'), 'Metric 3 value rendered.');
  assert.ok(samplePageHtml.includes('100%'), 'Metric 4 value rendered.');

  // 8. Dedicated Use Cases Section
  assert.ok(samplePageHtml.includes('sportswear-use-cases-section'), 'Use cases section rendered.');
  assert.ok(samplePageHtml.includes('Tailored for Every Athletic Discipline'), 'Use cases title rendered.');
  assert.ok(samplePageHtml.includes('use-case-soccer'), 'Soccer use case card rendered.');
  assert.ok(samplePageHtml.includes('use-case-rugby'), 'Rugby use case card rendered.');
  assert.ok(samplePageHtml.includes('use-case-basketball'), 'Basketball use case card rendered.');
  assert.ok(samplePageHtml.includes('use-case-factory'), 'Factory sublimation use case card rendered.');
  assert.ok(samplePageHtml.includes('Direct-to-Cutter Production'), 'Production title rendered.');

  // 9. Technical Specifications Section
  assert.ok(samplePageHtml.includes('sportswear-specs-section'), 'Specs section rendered.');
  assert.ok(samplePageHtml.includes('Three.js WebGPU / WebGL2 Fallback'), 'Specs detail rendered.');
  assert.ok(samplePageHtml.includes('Optimized GLTF 2.0 with Draco mesh compression'), 'Specs geometry rendered.');

  // 9. Pre-Footer CTA & Demo Route
  assert.ok(samplePageHtml.includes('landing-cta-section'), 'Pre-footer CTA section rendered.');
  assert.ok(samplePageHtml.includes('href="/apps/sportswear-configurator/index.html#demo"'), 'CTA links to existing demo route.');

  // 10. Footer
  assert.ok(samplePageHtml.includes('vs-landing-footer'), 'Footer rendered.');
  assert.ok(samplePageHtml.includes('@trikomi/core WebGPU 3D Engine'), 'Engine status rendered in footer.');
});

test('Sportswear Landing Page Final QA Verification (Layout, Responsiveness, CTAs, Navigation, Assets, Themes)', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // 1. Verify Assets on Disk
  const assets = [
    'public/logos/jersey.png',
    'public/svgs/uv_layout_with_labels.svg',
    'public/models/BasketballSinglet.gltf',
    'public/models/RugbyJersey.gltf',
    'public/models/SoccerJersey.gltf',
    'public/logos/trikomi.png'
  ];
  assets.forEach(asset => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 1000, `Asset ${asset} must have valid non-zero content`);
  });

  // 2. Render HTML
  const html = renderToStaticMarkup(
    React.createElement(SportswearLandingPage, {
      onExploreDemo: () => {},
      exploreDemoHref: '/apps/sportswear-configurator/index.html#demo',
      theme: 'indigo'
    })
  );

  // 3. Navigation anchor targets
  ['overview', 'features', 'showcase', 'use-cases', 'benefits', 'specs'].forEach(target => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `DOM Section with id="${target}" must exist`);
  });

  // 4. CTAs and Button Handlers
  assert.ok(html.includes('data-testid="explore-demo-btn"'), 'Header Explore Demo CTA present');
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), 'Hero Primary CTA present');
  assert.ok(html.includes('data-testid="hero-quick-launch-btn"'), 'Hero Quick Launch CTA present');
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), 'Pre-Footer CTA present');
  assert.ok(html.includes('href="/apps/sportswear-configurator/index.html#demo"'), 'Pre-Footer CTA links to demo');

  // 5. Triple Themes Compatibility
  ['violet', 'indigo', 'orchid'].forEach(theme => {
    const themeMarkup = renderToStaticMarkup(
      React.createElement(SportswearLandingPage, {
        onExploreDemo: () => {},
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });

  // 6. Responsive classes present
  assert.ok(html.includes('vs-sportswear-hero-stage'), 'Hero stage container present');
  assert.ok(html.includes('vs-sportswear-dieline-card'), 'Dieline card container present');
  assert.ok(html.includes('vs-landing-use-cases__grid'), 'Use cases responsive grid present');
  assert.ok(html.includes('vs-landing-specs__grid'), 'Specs responsive grid present');
});

test('Face Mocap Landing Page Architecture & QA Verification', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // 1. Verify Assets on Disk
  const assets = [
    'public/logos/facemocap.png',
    'public/svgs/mocap_landmarks_measurement.svg',
    'public/models/raccoon_head_small.glb',
    'public/models/head-occluder.glb',
    'public/logos/trikomi.png'
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 100, `Asset ${asset} must have valid content`);
  });

  // 2. Render HTML
  const html = renderToStaticMarkup(
    React.createElement(FaceMocapLandingPage, {
      onExploreDemo: () => {},
      exploreDemoHref: '/apps/face-mocap/index.html#demo',
      theme: 'violet'
    })
  );

  // 3. Single-Product Branding
  assert.ok(html.includes('Face Motion Capture'), 'Title must be Face Motion Capture');
  assert.ok(html.includes('MediaPipe 52 ARKit Blendshapes'), 'Badge must specify ARKit blendshapes');
  assert.ok(html.includes('Browser-Based Facial Motion Capture'), 'Hero title must be present');

  // 4. Hero Interactive Telemetry Stage
  assert.ok(html.includes('vs-mocap-hero-stage'), 'Hero mocap stage must be rendered');
  assert.ok(html.includes('Live Landmark Tracking: 60 FPS'), 'Telemetry tracking indicator present');
  assert.ok(html.includes('EyeBlinkLeft'), 'Blendshape telemetry EyeBlinkLeft present');
  assert.ok(html.includes('JawOpen'), 'Blendshape telemetry JawOpen present');
  assert.ok(html.includes('MouthSmile'), 'Blendshape telemetry MouthSmile present');
  assert.ok(html.includes('BrowInnerUp'), 'Blendshape telemetry BrowInnerUp present');

  // 5. Overview Section with Telemetry Card
  assert.ok(html.includes('id="overview"'), 'Overview section anchor must exist');
  assert.ok(html.includes('mocap_landmarks_measurement.svg'), 'Overview must render landmark telemetry SVG');
  assert.ok(html.includes('Precision Facial Landmark Kinematics'), 'Overview heading present');

  // 6. Bento Features Section
  assert.ok(html.includes('id="features"'), 'Features section anchor must exist');
  assert.ok(html.includes('468-Point Dense Face Mesh'), 'Feature 1 present');
  assert.ok(html.includes('52 ARKit Blendshapes'), 'Feature 2 present');
  assert.ok(html.includes('Unreal Engine LiveLink'), 'Feature 3 present');
  assert.ok(html.includes('100% On-Device Inference'), 'Feature 4 present');
  assert.ok(html.includes('Adaptive Jitter Filter'), 'Feature 5 present');
  assert.ok(html.includes('Real-Time 3D Viewport'), 'Feature 6 present');

  // 7. Visual Showcase Section
  assert.ok(html.includes('id="showcase"'), 'Showcase section anchor must exist');
  assert.ok(html.includes('MetaHuman LiveLink'), 'Showcase item 1 present');
  assert.ok(html.includes('Cartoon 3D Avatar'), 'Showcase item 2 present');
  assert.ok(html.includes('468 Mesh Topology'), 'Showcase item 3 present');

  // 8. Benefits & Production Metrics
  assert.ok(html.includes('id="benefits"'), 'Benefits section anchor must exist');
  assert.ok(html.includes('60 FPS'), 'Metric 60 FPS present');
  assert.ok(html.includes('0 ms'), 'Zero latency metric present');
  assert.ok(html.includes('100%'), 'On-device metric present');

  // 9. Industry Use Cases Section
  assert.ok(html.includes('id="use-cases"'), 'Use cases section anchor must exist');
  assert.ok(html.includes('Unreal MetaHuman Previz'), 'Use case 1 present');
  assert.ok(html.includes('Low-Latency Avatar Broadcast'), 'Use case 2 present');
  assert.ok(html.includes('Rapid Facial Pre-Visualization'), 'Use case 3 present');
  assert.ok(html.includes('Interactive WebXR Avatars'), 'Use case 4 present');

  // 10. Technical Specifications Section
  assert.ok(html.includes('id="specs"'), 'Specs section anchor must exist');
  assert.ok(html.includes('MediaPipe Tasks Vision (Google Research)'), 'Specs pipeline present');
  assert.ok(html.includes('127.0.0.1:5000 (Unreal Engine LiveLink)'), 'Specs streaming present');

  // 11. Navigation Anchors and CTAs
  ['overview', 'features', 'showcase', 'use-cases', 'benefits', 'specs'].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), 'Header Explore Demo CTA present');
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), 'Hero Primary CTA present');
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), 'Pre-Footer CTA present');
  assert.ok(html.includes('href="/apps/face-mocap/index.html#demo"'), 'CTA must link to face mocap demo route');

  // 12. Theme Switching
  ['violet', 'indigo', 'orchid'].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React.createElement(FaceMocapLandingPage, {
        onExploreDemo: () => {},
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});

test('Jewelry Configurator Landing Page Architecture & QA Verification', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // 1. Verify Assets on Disk
  const assets = [
    'public/logos/jewel.png',
    'public/models/ring.glb',
    'public/models/ring2.glb',
    'public/models/diamonds.glb',
    'public/logos/trikomi.png'
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 100, `Asset ${asset} must have valid content`);
  });

  // 2. Render HTML
  const html = renderToStaticMarkup(
    React.createElement(JewelryLandingPage, {
      onExploreDemo: () => {},
      exploreDemoHref: '/apps/jewelry-configurator/index.html#demo',
      theme: 'orchid'
    })
  );

  // 3. Single-Product Branding
  assert.ok(html.includes('Jewelry Configurator'), 'Title must be Jewelry Configurator');
  assert.ok(html.includes('Ray-Traced Spectral Dispersion'), 'Badge must specify spectral dispersion');
  assert.ok(html.includes('Photorealistic 3D Jewelry &amp; Ray-Traced Diamond Studio'), 'Hero title present');

  // 4. Hero Luxury Stage with Cauchy Dispersion Badges
  assert.ok(html.includes('vs-jewelry-hero-stage'), 'Hero jewelry stage must be rendered');
  assert.ok(html.includes('Crown Caustic Fire'), 'Hero dispersion pin present');
  assert.ok(html.includes('Anisotropic Metal'), 'Hero metal pin present');
  assert.ok(html.includes('Abbe 58.6'), 'Hero Abbe number badge present');
  assert.ok(html.includes('18K Yellow Gold'), 'Metal selector option 1 present');
  assert.ok(html.includes('Rose Gold'), 'Metal selector option 2 present');
  assert.ok(html.includes('Platinum 950'), 'Metal selector option 3 present');
  assert.ok(html.includes('White Gold'), 'Metal selector option 4 present');

  // 5. Overview Section with Optical Analysis Card
  assert.ok(html.includes('id="overview"'), 'Overview section anchor must exist');
  assert.ok(html.includes('Sub-Surface Refraction'), 'Overview heading present');
  assert.ok(html.includes('Accurate Spectral Fire'), 'Optical analysis point 1 present');
  assert.ok(html.includes('Physical Diamond Refraction (Abbe 58.6)'), 'Diamond optical card present');

  // 6. Bento Features Section
  assert.ok(html.includes('id="features"'), 'Features section anchor must exist');
  assert.ok(html.includes('Ray-Traced Spectral Dispersion'), 'Feature 1 present');
  assert.ok(html.includes('Precious Metal Alloys'), 'Feature 2 present');
  assert.ok(html.includes('Interactive Diamond Cuts'), 'Feature 3 present');
  assert.ok(html.includes('Studio Lighting Presets'), 'Feature 4 present');
  assert.ok(html.includes('Parametric Carat Sizing'), 'Feature 5 present');
  assert.ok(html.includes('4K Studio Snapshot Export'), 'Feature 6 present');

  // 7. Visual Showcase Section
  assert.ok(html.includes('id="showcase"'), 'Showcase section anchor must exist');
  assert.ok(html.includes('Classic Solitaire'), 'Showcase item 1 present');
  assert.ok(html.includes('Halo Setting'), 'Showcase item 2 present');
  assert.ok(html.includes('Gemstone Cluster'), 'Showcase item 3 present');

  // 8. Benefits & Luxury Metrics
  assert.ok(html.includes('id="benefits"'), 'Benefits section anchor must exist');
  assert.ok(html.includes('60 FPS'), 'Metric 60 FPS present');
  assert.ok(html.includes('Abbe 58.6'), 'Abbe number metric present');
  assert.ok(html.includes('3.4x'), 'Conversion uplift metric present');
  assert.ok(html.includes('100%'), 'Material fidelity metric present');

  // 9. Luxury Use Cases Section
  assert.ok(html.includes('id="use-cases"'), 'Use cases section anchor must exist');
  assert.ok(html.includes('Bespoke Atelier Consultations'), 'Use case 1 present');
  assert.ok(html.includes('Custom Engagement Ring Builders'), 'Use case 2 present');
  assert.ok(html.includes('Certified Diamond Visualizer'), 'Use case 3 present');
  assert.ok(html.includes('In-Store Interactive Kiosks'), 'Use case 4 present');

  // 10. Technical Specifications Section
  assert.ok(html.includes('id="specs"'), 'Specs section anchor must exist');
  assert.ok(html.includes('Three.js WebGPU / DiamondPlugin'), 'Specs renderer present');
  assert.ok(html.includes('Cauchy equation with Abbe coefficient (V = 58.6)'), 'Specs shader present');

  // 11. Navigation Anchors and CTAs
  ['overview', 'features', 'showcase', 'use-cases', 'benefits', 'specs'].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), 'Header Explore Demo CTA present');
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), 'Hero Primary CTA present');
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), 'Pre-Footer CTA present');
  assert.ok(html.includes('href="/apps/jewelry-configurator/index.html#demo"'), 'CTA must link to jewelry demo route');

  // 12. Theme Switching
  ['violet', 'indigo', 'orchid'].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React.createElement(JewelryLandingPage, {
        onExploreDemo: () => {},
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});

test('Box Configurator Landing Page Architecture & QA Verification', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // 1. Verify Assets on Disk
  const assets = [
    'public/logos/box.png',
    'public/logos/trikomi.png'
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 100, `Asset ${asset} must have valid content`);
  });

  // 2. Render HTML
  const html = renderToStaticMarkup(
    React.createElement(BoxLandingPage, {
      onExploreDemo: () => {},
      exploreDemoHref: '/apps/box-configurator/index.html#demo',
      theme: 'indigo'
    })
  );

  // 3. Single-Product Branding
  assert.ok(html.includes('Box Configurator'), 'Title must be Box Configurator');
  assert.ok(html.includes('Parametric 3D Dieline Engine'), 'Badge must specify dieline engine');
  assert.ok(html.includes('Parametric 3D Packaging Design &amp; Real-Time Dieline Studio'), 'Hero title present');

  // 4. Hero Parametric Stage with Fold Sequence Slider & Dimensions
  assert.ok(html.includes('vs-box-hero-stage'), 'Hero box stage must be rendered');
  assert.ok(html.includes('Width: 220mm'), 'Dimension chip Width present');
  assert.ok(html.includes('Height: 160mm'), 'Dimension chip Height present');
  assert.ok(html.includes('Depth: 75mm'), 'Dimension chip Depth present');
  assert.ok(html.includes('Interactive Fold Sequence'), 'Slider label present');
  assert.ok(html.includes('MAILER BOX'), 'Template button 1 present');
  assert.ok(html.includes('TUCK END'), 'Template button 2 present');
  assert.ok(html.includes('OPEN TRAY'), 'Template button 3 present');

  // 5. Overview Section with Dieline SVG Diagram Card
  assert.ok(html.includes('id="overview"'), 'Overview section anchor must exist');
  assert.ok(html.includes('Precision Carton Kinematics'), 'Overview heading present');
  assert.ok(html.includes('FEFCO Standard Vector'), 'Dieline chip present');
  assert.ok(html.includes('Side A'), 'Panel label Side A present');
  assert.ok(html.includes('Front Panel'), 'Panel label Front Panel present');
  assert.ok(html.includes('Automatic Flap &amp; Tab Grading'), 'Highlight 1 present');

  // 6. Bento Features Section
  assert.ok(html.includes('id="features"'), 'Features section anchor must exist');
  assert.ok(html.includes('Real-Time Carton Kinematics'), 'Feature 1 present');
  assert.ok(html.includes('Interactive 2D Decal Projection'), 'Feature 2 present');
  assert.ok(html.includes('Standard Packaging Library'), 'Feature 3 present');
  assert.ok(html.includes('Production Vector Dieline Export'), 'Feature 4 present');
  assert.ok(html.includes('Instant Dimension Scaling'), 'Feature 5 present');
  assert.ok(html.includes('Substrate &amp; Foil Shaders'), 'Feature 6 present');

  // 7. Visual Showcase Section
  assert.ok(html.includes('id="showcase"'), 'Showcase section anchor must exist');
  assert.ok(html.includes('E-Commerce Mailer'), 'Showcase item 1 present');
  assert.ok(html.includes('Reverse Tuck End'), 'Showcase item 2 present');
  assert.ok(html.includes('Display Tray'), 'Showcase item 3 present');

  // 8. Benefits & Manufacturing Metrics
  assert.ok(html.includes('id="benefits"'), 'Benefits section anchor must exist');
  assert.ok(html.includes('0 sec'), 'Calculation delay metric present');
  assert.ok(html.includes('100%'), 'Vector accuracy metric present');
  assert.ok(html.includes('60 FPS'), 'Folding simulation metric present');
  assert.ok(html.includes('4+ Formats'), 'Production outputs metric present');

  // 9. Packaging Verticals Use Cases Section
  assert.ok(html.includes('id="use-cases"'), 'Use cases section anchor must exist');
  assert.ok(html.includes('Custom Branded Mailers'), 'Use case 1 present');
  assert.ok(html.includes('Reverse Tuck Folding Cartons'), 'Use case 2 present');
  assert.ok(html.includes('Point-of-Sale Counter Trays'), 'Use case 3 present');
  assert.ok(html.includes('Direct CNC Die-Cutter Export'), 'Use case 4 present');

  // 10. Technical Specifications Section
  assert.ok(html.includes('id="specs"'), 'Specs section anchor must exist');
  assert.ok(html.includes('@trikomi/core/box parametric node graph'), 'Specs kernel present');
  assert.ok(html.includes('PDF (Vector), SVG, DXF (AutoCAD / CNC)'), 'Specs formats present');

  // 11. Navigation Anchors and CTAs
  ['overview', 'features', 'showcase', 'use-cases', 'benefits', 'specs'].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), 'Header Explore Demo CTA present');
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), 'Hero Primary CTA present');
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), 'Pre-Footer CTA present');
  assert.ok(html.includes('href="/apps/box-configurator/index.html#demo"'), 'CTA must link to box demo route');

  // 12. Theme Switching
  ['violet', 'indigo', 'orchid'].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React.createElement(BoxLandingPage, {
        onExploreDemo: () => {},
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});

test('360 Virtual Tour Landing Page Architecture & QA Verification', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // 1. Verify Assets on Disk
  const assets = [
    'public/logos/360.png',
    'public/logos/trikomi.png'
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 100, `Asset ${asset} must have valid content`);
  });

  // 2. Render HTML
  const html = renderToStaticMarkup(
    React.createElement(TourLandingPage, {
      onExploreDemo: () => {},
      exploreDemoHref: '/apps/360tour/index.html#/dashboard',
      theme: 'violet'
    })
  );

  // 3. Single-Product Branding
  assert.ok(html.includes('360° Virtual Tour'), 'Title must be 360° Virtual Tour');
  assert.ok(html.includes('Three.js Spherical Panorama Engine'), 'Badge must specify spherical engine');
  assert.ok(html.includes('Immersive 360° Virtual Tour Studio &amp; Autonomous Web Viewer'), 'Hero title present');

  // 4. Hero Spherical Stage with Hotspots & Controls
  assert.ok(html.includes('vs-tour-hero-stage'), 'Hero tour stage must be rendered');
  assert.ok(html.includes('Auto-Rotate: 60 FPS'), 'Auto-rotate indicator present');
  assert.ok(html.includes('Teleport to Terrace'), 'Hotspot pin 1 present');
  assert.ok(html.includes('Fountain Audio Node'), 'Hotspot pin 2 present');
  assert.ok(html.includes('Suite Amenities Info'), 'Hotspot pin 3 present');
  assert.ok(html.includes('Heading: 240° SW'), 'Compass heading present');
  assert.ok(html.includes('LOBBY'), 'Scene button 1 present');
  assert.ok(html.includes('SUITE'), 'Scene button 2 present');
  assert.ok(html.includes('ROOFTOP'), 'Scene button 3 present');

  // 5. Overview Section with Sphere Projection Card
  assert.ok(html.includes('id="overview"'), 'Overview section anchor must exist');
  assert.ok(html.includes('Precision Panoramic Spherical Mapping'), 'Overview heading present');
  assert.ok(html.includes('Equirectangular 2:1'), 'Sphere chip present');
  assert.ok(html.includes('Sub-Frame Spherical Interpolation'), 'Highlight 1 present');
  assert.ok(html.includes('Zero-Cloud Private Storage'), 'Highlight 2 present');

  // 6. Bento Features Section
  assert.ok(html.includes('id="features"'), 'Features section anchor must exist');
  assert.ok(html.includes('Equirectangular Spherical Engine'), 'Feature 1 present');
  assert.ok(html.includes('Interactive Hotspot Node Graph'), 'Feature 2 present');
  assert.ok(html.includes('Offline OPFS Client Storage'), 'Feature 3 present');
  assert.ok(html.includes('Autonomous Standalone ZIP Export'), 'Feature 4 present');
  assert.ok(html.includes('Directional Spatial Audio'), 'Feature 5 present');
  assert.ok(html.includes('Custom Nadir &amp; Floor Concealment'), 'Feature 6 present');

  // 7. Visual Showcase Section
  assert.ok(html.includes('id="showcase"'), 'Showcase section anchor must exist');
  assert.ok(html.includes('Luxury Architecture'), 'Showcase item 1 present');
  assert.ok(html.includes('Hospitality Suites'), 'Showcase item 2 present');
  assert.ok(html.includes('Museum Exhibition'), 'Showcase item 3 present');

  // 8. Benefits & Portability Metrics
  assert.ok(html.includes('id="benefits"'), 'Benefits section anchor must exist');
  assert.ok(html.includes('60 FPS'), 'Panorama motion metric present');
  assert.ok(html.includes('0 MB'), 'Zero cloud storage fees metric present');
  assert.ok(html.includes('&lt; 1 sec'), 'Scene switch latency metric present');
  assert.ok(html.includes('1-Click'), 'Autonomous export metric present');

  // 9. Virtual Verticals Use Cases Section
  assert.ok(html.includes('id="use-cases"'), 'Use cases section anchor must exist');
  assert.ok(html.includes('Virtual Open Houses &amp; Villas'), 'Use case 1 present');
  assert.ok(html.includes('Interactive Hotel Suite Walkthroughs'), 'Use case 2 present');
  assert.ok(html.includes('Digitized Heritage &amp; Art Tours'), 'Use case 3 present');
  assert.ok(html.includes('BIM Facility Inspection Walks'), 'Use case 4 present');

  // 10. Technical Specifications Section
  assert.ok(html.includes('id="specs"'), 'Specs section anchor must exist');
  assert.ok(html.includes('Inverted normal equirectangular sphere (60 segments)'), 'Specs geometry present');
  assert.ok(html.includes('Origin Private File System (OPFS) + idb-keyval'), 'Specs storage present');

  // 11. Navigation Anchors and CTAs
  ['overview', 'features', 'showcase', 'use-cases', 'benefits', 'specs'].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), 'Header Explore Demo CTA present');
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), 'Hero Primary CTA present');
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), 'Pre-Footer CTA present');
  assert.ok(html.includes('href="/apps/360tour/index.html#/dashboard"'), 'CTA must link to tour dashboard route');

  // 12. Theme Switching
  ['violet', 'indigo', 'orchid'].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React.createElement(TourLandingPage, {
        onExploreDemo: () => {},
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});

test('Eyewear Try-On Landing Page Architecture & QA Verification', () => {
  let demoLaunched = false;
  const html = renderToStaticMarkup(
    React.createElement(EyewearLandingPage, {
      onExploreDemo: () => {
        demoLaunched = true;
      },
      exploreDemoHref: '/apps/eyewear-tryon/index.html#demo',
      theme: 'violet'
    })
  );

  // 1. Single-product identity & branding
  assert.ok(html.includes('Eyewear Try-On'), 'Product title must be Eyewear Try-On');
  assert.ok(html.includes('WebGPU AR Facial Fitting'), 'Product badge must be WebGPU AR Facial Fitting');
  assert.ok(html.includes('src="/logos/eyewear.png"'), 'Brand logo must be eyewear.png');

  // 2. VictorShell UI Kit root & theme
  assert.ok(html.includes('vs-product-landing-page'), 'Must use landing page container class');
  assert.ok(html.includes('vs-ui-root'), 'Must include vs-ui-root class for design tokens');
  assert.ok(html.includes('data-accent="violet"'), 'Default theme must be violet');

  // 3. Hero section & interactive stage
  assert.ok(html.includes('vs-eyewear-hero-stage'), 'Hero eyewear stage must be rendered');
  assert.ok(html.includes('Tracking: 478 Landmark Lock'), 'Landmark tracking chip present');
  assert.ok(html.includes('PD: 63.5 mm'), 'PD gauge chip present');
  assert.ok(html.includes('Occluder: ACTIVE'), 'Cranial occluder chip present');
  assert.ok(html.includes('Aviator Classic'), 'Aviator silhouette button present');
  assert.ok(html.includes('Wayfarer Style'), 'Wayfarer silhouette button present');
  assert.ok(html.includes('Clear AR'), 'Lens coating button present');
  assert.ok(html.includes('Brushed Titanium'), 'Frame material button present');

  // 4. Overview Section with Anatomical Card
  assert.ok(html.includes('id="overview"'), 'Overview section anchor must exist');
  assert.ok(html.includes('Clinical Precision Meets High-Fashion 3D Realism'), 'Overview heading present');
  assert.ok(html.includes('Cranial Depth &amp; IPD Geometry'), 'Anatomical card present');
  assert.ok(html.includes('478'), 'Landmark count metric present');

  // 5. Bento Features Section
  assert.ok(html.includes('id="features"'), 'Features section anchor must exist');
  assert.ok(html.includes('478-Point 3D Facial Landmarks'), 'Feature 1 present');
  assert.ok(html.includes('Automated Pupillary Distance (PD)'), 'Feature 2 present');
  assert.ok(html.includes('Full Cranial 3D Head Occluder'), 'Feature 3 present');
  assert.ok(html.includes('PBR Optics &amp; Anti-Reflective Shaders'), 'Feature 4 present');
  assert.ok(html.includes('6 Curated Designer Silhouettes'), 'Feature 5 present');
  assert.ok(html.includes('Universal Zero-Plugin Web Engine'), 'Feature 6 present');

  // 6. Visual Showcase Section
  assert.ok(html.includes('id="showcase"'), 'Showcase section anchor must exist');
  assert.ok(html.includes('Optical Prescription Fitting'), 'Showcase item 1 present');
  assert.ok(html.includes('Designer Sunglasses &amp; Coatings'), 'Showcase item 2 present');
  assert.ok(html.includes('Performance Sports Wraps'), 'Showcase item 3 present');

  // 7. Benefits Section
  assert.ok(html.includes('id="benefits"'), 'Benefits section anchor must exist');
  assert.ok(html.includes('Depth Pass'), 'Occlusion metric present');
  assert.ok(html.includes('±0.8 mm'), 'PD accuracy metric present');
  assert.ok(html.includes('&lt; 16 ms'), 'Latency metric present');

  // 8. Industry Verticals Use Cases Section
  assert.ok(html.includes('id="use-cases"'), 'Use cases section anchor must exist');
  assert.ok(html.includes('Direct-to-Consumer (D2C) Optical'), 'Use case 1 present');
  assert.ok(html.includes('Luxury Fashion &amp; Designer Houses'), 'Use case 2 present');
  assert.ok(html.includes('Telehealth &amp; Digital Optometry'), 'Use case 3 present');
  assert.ok(html.includes('Custom Bespoke &amp; 3D Printed Eyewear'), 'Use case 4 present');

  // 9. Technical Specifications Section
  assert.ok(html.includes('id="specs"'), 'Specs section anchor must exist');
  assert.ok(html.includes('MediaPipe Vision Tasks (478 3D landmarks, GPU accelerated)'), 'Specs tracking present');
  assert.ok(html.includes('head_occluder.obj'), 'Specs occluder present');

  // 10. Navigation Anchors and CTAs
  ['overview', 'features', 'showcase', 'use-cases', 'benefits', 'specs'].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), 'Header Explore Demo CTA present');
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), 'Hero Primary CTA present');
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), 'Pre-Footer CTA present');
  assert.ok(html.includes('href="/apps/eyewear-tryon/index.html#demo"'), 'CTA must link to eyewear demo route');

  // 11. Theme Switching
  ['violet', 'indigo', 'orchid'].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React.createElement(EyewearLandingPage, {
        onExploreDemo: () => {},
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});

test('3D Viewer Landing Page Architecture & QA Verification', () => {
  let demoLaunched = false;
  const html = renderToStaticMarkup(
    React.createElement(ViewerLandingPage, {
      onExploreDemo: () => {
        demoLaunched = true;
      },
      exploreDemoHref: '/apps/viewer/index.html#demo',
      theme: 'indigo'
    })
  );

  // 1. Single-product identity & branding
  assert.ok(html.includes('3D Viewer'), 'Product title must be 3D Viewer');
  assert.ok(html.includes('WebGPU Engine &amp; Post-Processing'), 'Product badge must be WebGPU Engine & Post-Processing');
  assert.ok(html.includes('VictorShell'), 'Brand name must be VictorShell');

  // 2. VictorShell UI Kit root & theme
  assert.ok(html.includes('vs-product-landing-template'), 'Must use landing page container class');
  assert.ok(html.includes('vs-ui-root'), 'Must include vs-ui-root class for design tokens');
  assert.ok(html.includes('data-accent="indigo"'), 'Default theme must be indigo');

  // 3. Hero section & interactive stage
  assert.ok(html.includes('vs-viewer-hero-stage'), 'Hero viewer stage must be rendered');
  assert.ok(html.includes('Three.js WebGPU Active'), 'WebGPU active indicator present');
  assert.ok(html.includes('60 FPS'), 'FPS metric present');
  assert.ok(html.includes('PBR'), 'PBR mode button present');
  assert.ok(html.includes('WIREFRAME'), 'Wireframe mode button present');
  assert.ok(html.includes('STUDIO'), 'Studio mode button present');
  assert.ok(html.includes('DIAMOND'), 'Diamond mode button present');
  assert.ok(html.includes('Point-to-Point 3D Measurement'), 'Measurement pin present');
  assert.ok(html.includes('8thWall SLAM Ready'), 'WebAR pin present');

  // 4. Overview Section with PBR Channel Pipeline Card
  assert.ok(html.includes('id="overview"'), 'Overview section anchor must exist');
  assert.ok(html.includes('Cinema-Grade Shading, Kinematics &amp; Post-Processing'), 'Overview heading present');
  assert.ok(html.includes('Real-Time PBR Channel Pipeline'), 'PBR pipeline card title present');
  assert.ok(html.includes('ThreeViewer.ts'), 'ThreeViewer chip present');
  assert.ok(html.includes('Physically Based Shading (PBR)'), 'Highlight 1 present');
  assert.ok(html.includes('Point-to-Point 3D Measurement Tool'), 'Highlight 2 present');
  assert.ok(html.includes('Multi-Track Kinematics Timeline'), 'Highlight 3 present');

  // 5. Bento Features Section
  assert.ok(html.includes('id="features"'), 'Features section anchor must exist');
  assert.ok(html.includes('WebGPU &amp; WebGL2 Hybrid Pipeline'), 'Feature 1 present');
  assert.ok(html.includes('PBR Material &amp; Texture Editor'), 'Feature 2 present');
  assert.ok(html.includes('Cinematic Post-Processing Stack'), 'Feature 3 present');
  assert.ok(html.includes('Precision 3D Measurement Overlay'), 'Feature 4 present');
  assert.ok(html.includes('Multi-Track Animation Timeline'), 'Feature 5 present');
  assert.ok(html.includes('Instant 8thWall SLAM WebAR'), 'Feature 6 present');

  // 6. Visual Showcase Section
  assert.ok(html.includes('id="showcase"'), 'Showcase section anchor must exist');
  assert.ok(html.includes('PBR Realistic Studio'), 'Showcase item 1 present');
  assert.ok(html.includes('Mesh &amp; Wireframe'), 'Showcase item 2 present');
  assert.ok(html.includes('Kinematics Timeline'), 'Showcase item 3 present');
  assert.ok(html.includes('Augmented Reality'), 'Showcase item 4 present');

  // 7. Benefits Section
  assert.ok(html.includes('id="benefits"'), 'Benefits section anchor must exist');
  assert.ok(html.includes('60 FPS'), '60 FPS metric present');
  assert.ok(html.includes('&lt; 50ms'), 'Latency metric present');
  assert.ok(html.includes('$0 / hr'), 'GPU cost metric present');
  assert.ok(html.includes('4K UHD'), 'Resolution metric present');

  // 8. Industry Verticals Use Cases Section
  assert.ok(html.includes('id="use-cases"'), 'Use cases section anchor must exist');
  assert.ok(html.includes('Interactive 3D Product Showrooms'), 'Use case 1 present');
  assert.ok(html.includes('Mechanical Assembly &amp; Tolerances'), 'Use case 2 present');
  assert.ok(html.includes('Digital Asset &amp; Rig Validation'), 'Use case 3 present');
  assert.ok(html.includes('Ray-Traced Spectral Dispersion'), 'Use case 4 present');

  // 9. Technical Specifications Section
  assert.ok(html.includes('id="specs"'), 'Specs section anchor must exist');
  assert.ok(html.includes('Three.js WebGPU with WebGL2 Fallback'), 'Specs renderer present');
  assert.ok(html.includes('@trikomi/core &amp; ThreeViewer'), 'Specs SDK present');
  assert.ok(html.includes('BloomPlugin with luminance thresholding'), 'Specs bloom present');
  assert.ok(html.includes('Screen Space Reflections (SSR) &amp; SSAO / SSGI'), 'Specs SSR present');
  assert.ok(html.includes('Physical Depth of Field (DOF) with focal distance'), 'Specs DOF present');
  assert.ok(html.includes('MeasurementPlugin point-to-point vertex raycaster'), 'Specs measurement present');
  assert.ok(html.includes('Niantic 8thWall SLAM SDK (Surface Tracking)'), 'Specs WebAR present');

  // 10. Navigation Anchors and CTAs
  ['overview', 'features', 'showcase', 'use-cases', 'benefits', 'specs'].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), 'Header Explore Demo CTA present');
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), 'Hero Primary CTA present');
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), 'Pre-Footer CTA present');
  assert.ok(html.includes('href="/apps/viewer/index.html#demo"'), 'CTA must link to viewer demo route');

  // 11. Theme Switching
  ['violet', 'indigo', 'orchid'].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React.createElement(ViewerLandingPage, {
        onExploreDemo: () => {},
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});

test('Responsive Header and Navbar QA Verification across all 7 Landing Pages', () => {
  const pages = [
    { name: 'Sportswear', component: SportswearLandingPage },
    { name: 'Face Mocap', component: FaceMocapLandingPage },
    { name: 'Jewelry', component: JewelryLandingPage },
    { name: 'Box', component: BoxLandingPage },
    { name: '360 Tour', component: TourLandingPage },
    { name: 'Eyewear Try-On', component: EyewearLandingPage },
    { name: '3D Viewer', component: ViewerLandingPage }
  ];

  for (const { name, component } of pages) {
    const html = renderToStaticMarkup(
      React.createElement(component, {
        onExploreDemo: () => {},
        exploreDemoHref: '#demo'
      })
    );

    // 1. Header structure & layout
    assert.ok(html.includes('vs-landing-header'), `${name} landing page must render vs-landing-header`);
    assert.ok(html.includes('vs-landing-header__container'), `${name} must render vs-landing-header__container`);
    assert.ok(html.includes('vs-landing-header__brand-group'), `${name} must render vs-landing-header__brand-group`);
    assert.ok(html.includes('vs-landing-header__brand-meta'), `${name} must render brand-meta for responsive truncation`);
    assert.ok(html.includes('vs-landing-header__brand-title'), `${name} must render brand-title`);
    assert.ok(html.includes('vs-landing-header__product-title'), `${name} must render product-title`);

    // 2. Navigation items
    assert.ok(html.includes('vs-landing-header__nav-wrapper'), `${name} must render desktop nav wrapper`);
    assert.ok(html.includes('vs-landing-nav--horizontal'), `${name} must render horizontal nav list`);

    // 3. Responsive CTA Button with dual text spans
    assert.ok(html.includes('vs-landing-header__cta-btn'), `${name} must render CTA button`);
    assert.ok(html.includes('vs-landing-header__cta-text--full'), `${name} must render full label span for desktop/laptop`);
    assert.ok(html.includes('vs-landing-header__cta-text--short'), `${name} must render compact short label span for mobile`);

    // 4. Hamburger drawer toggle
    assert.ok(html.includes('vs-landing-header__mobile-toggle'), `${name} must render mobile toggle button`);
    assert.ok(html.includes('data-testid="mobile-nav-toggle"'), `${name} must have testid for mobile toggle`);
  }

  // Verify responsive CSS rules in landing.css
  const css = readFileSync(new URL('../packages/ui-kit/src/styles/landing.css', import.meta.url), 'utf-8');
  assert.ok(css.includes('@media (max-width: 1140px)'), 'CSS must include 1140px breakpoint collapsing nav to mobile toggle');
  assert.ok(css.includes('@media (max-width: 860px)'), 'CSS must include 860px tablet breakpoint');
  assert.ok(css.includes('@media (max-width: 520px)'), 'CSS must include 520px mobile breakpoint');
  assert.ok(css.includes('@media (max-width: 360px)'), 'CSS must include 360px ultra-compact mobile breakpoint');
  assert.ok(css.includes('.vs-landing-header__cta-text--short'), 'CSS must define styles for compact CTA text');
  assert.ok(css.includes('.vs-landing-header__cta-text--full'), 'CSS must toggle full CTA text off on narrow mobile');
  assert.ok(css.includes('max-width: 100vw'), 'Header must constrain max-width to 100vw');
});
