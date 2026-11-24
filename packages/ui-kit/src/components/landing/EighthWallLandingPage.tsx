import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface EighthWallLandingPageProps {
  /** Callback to launch the actual 8thWall Eyewear WebAR demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/8theye/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'orchid'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * EighthWallLandingPage
 *
 * Dedicated, premium single-product landing page for the VictorShell 8thWall WebAR Eyewear Studio.
 * Built using the Frosted Glass design system and Task 22/23/24 reusable components.
 * Focuses exclusively on In-Browser Markerless WebAR:
 * - Powered by the Niantic 8thWall WebAR engine (window.XR8, @trikomi/core/8thwall, EighthWallSDK)
 * - Zero-install mobile browser execution in mobile Safari (iOS) and mobile Chrome (Android)
 * - Seamless desktop-to-mobile QR handoff for instantaneous camera activation
 * - Calibrated 3D head occlusion (models/head-occluder.glb) for natural temple depth
 * - Real-time runtime material recoloring (window.applyMaterialColor)
 * - Omnichannel marketing embeds for social campaigns, in-store displays, and e-commerce checkouts
 */
export const EighthWallLandingPage: React.FC<EighthWallLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/8theye/index.html#demo',
  theme = 'orchid',
  className = ''
}) => {
  // Navigation anchors for single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'AR Experience', href: '#showcase' },
    { label: 'Omnichannel Verticals', href: '#use-cases' },
    { label: 'Frictionless WebAR', href: '#benefits' },
    { label: 'Tech Specs', href: '#specs' }
  ];

  // Interactive state for hero stage
  const [activeFrameFinish, setActiveFrameFinish] = useState<string>('Gunmetal Titanium');
  const [activePlatform, setActivePlatform] = useState<'ios' | 'android'>('ios');
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);

  const finishes = [
    { id: 'gunmetal', label: 'Gunmetal Titanium', hex: '#64748B', finish: 'Satin Metal' },
    { id: 'obsidian', label: 'Obsidian Black', hex: '#0F172A', finish: 'Matte PVD' },
    { id: 'rosegold', label: 'Rose Gold', hex: '#FB7185', finish: '18K Polished' },
    { id: 'havana', label: 'Havana Tortoise', hex: '#854D0E', finish: 'Italian Acetate' }
  ];

  const currentFinish = finishes.find((f) => f.label === activeFrameFinish) || finishes[0];

  // 6 Verified Bento Features
  const features: FeatureItem[] = [
    {
      id: 'markerless-webar',
      title: 'Markerless WebAR Face Tracking',
      description:
        'Powered by Niantic 8thWall (window.XR8) with continuous 6-DoF SLAM tracking, delivering rock-solid face anchor stabilization without requiring special targets or markers.',
      badge: 'Niantic 8thWall Engine',
      highlight: true
    },
    {
      id: 'zero-app-install',
      title: 'Zero-Friction In-Browser AR',
      description:
        'Eliminates app store drop-off entirely. Consumers tap a direct link or scan a QR code to launch full camera augmented reality right inside mobile Safari or Chrome.',
      badge: 'Zero App Downloads'
    },
    {
      id: 'qr-handoff',
      title: 'Desktop-to-Mobile QR Handoff',
      description:
        'Built-in QR code generation allows desktop shoppers to instantly transition to their mobile device’s front-facing selfie camera with session state preserved.',
      badge: 'Seamless Continuity'
    },
    {
      id: 'runtime-material-recolor',
      title: 'Real-Time Dynamic Material Recoloring',
      description:
        'Exposes the window.applyMaterialColor API for instant frame color and texture swaps without reloading models or interrupting the active AR camera session.',
      badge: 'Live Customization'
    },
    {
      id: 'calibrated-head-occlusion',
      title: 'Calibrated 3D Head Occlusion',
      description:
        'Uses an optimized head-occluder.glb mesh pinned to the face anchor, ensuring temple arms wrap behind human ears and hair naturally with proper depth sorting.',
      badge: 'Depth Sorting'
    },
    {
      id: 'omnichannel-marketing',
      title: 'Embeddable Campaign Architecture',
      description:
        'Easily embedded into Shopify storefronts, social media ads, interactive display kiosks, and printed packaging for cohesive omnichannel reach.',
      badge: 'Omnichannel Ready'
    }
  ];

  // 3 Showcase Modes
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'mobile-direct',
      label: 'Mobile WebAR Direct Experience',
      badge: 'Mobile Browser AR',
      description:
        'Runs natively in mobile Safari (iOS 14+) and mobile Chrome (Android 10+) without downloading apps from Apple App Store or Google Play.',
      visual: (
        <div className="vs-showcase-visual-card">
          <div className="vs-showcase-visual-badge">In-Browser Camera Stream</div>
          <div className="vs-showcase-visual-metric">WebKit iOS · Blink Android · 60 FPS</div>
        </div>
      )
    },
    {
      id: 'finish-palette',
      label: 'Interactive Frame Finishing Palette',
      badge: 'Real-Time Recoloring',
      description:
        'Switch between satin metals, matte PVD coats, polished gold, and translucent acetate textures with sub-second uniform parameter updates.',
      visual: (
        <div className="vs-showcase-visual-card">
          <div className="vs-showcase-visual-badge">Live PBR Uniform Recolor</div>
          <div className="vs-showcase-visual-metric">applyMaterialColor() · Zero Reload</div>
        </div>
      )
    },
    {
      id: 'retail-activation',
      label: 'Omnichannel QR Retail Activation',
      badge: 'In-Store & Print Displays',
      description:
        'Place dynamic QR codes on storefront windows, retail mirrors, and print lookbooks to let shoppers try on frames anywhere, anytime.',
      visual: (
        <div className="vs-showcase-visual-card">
          <div className="vs-showcase-visual-badge">Instant QR Handoff</div>
          <div className="vs-showcase-visual-metric">24/7 Storefront Window Try-On</div>
        </div>
      )
    }
  ];

  // 4 Core Technical Benefits
  const benefits: BenefitItem[] = [
    {
      id: 'benefit-zero-download',
      title: 'No App Store Barrier',
      description:
        'By running completely in the mobile web browser, 8thWall WebAR eliminates the 70%+ user drop-off associated with forcing native application installations.',
      metric: '0 Apps',
      metricLabel: 'Zero Download Friction'
    },
    {
      id: 'benefit-slam-fidelity',
      title: 'Industrial-Strength SLAM',
      description:
        'Niantic’s proprietary computer vision SLAM engine delivers rock-solid face anchor tracking with rapid re-acquisition during head turns and quick movements.',
      metric: '6-DoF',
      metricLabel: 'Markerless Face Anchor'
    },
    {
      id: 'benefit-speed',
      title: 'Sub-3 Second Cold Start',
      description:
        'Optimized Draco asset compression and streamlined WebAssembly pipelines ensure the AR experience launches in under 2.8 seconds over standard 4G/5G connections.',
      metric: '< 2.8 s',
      metricLabel: 'Cold Start Launch'
    },
    {
      id: 'benefit-reach',
      title: 'Universal Device Reach',
      description:
        'Supports over 3.5 billion iOS and Android smartphones globally through native WebRTC camera APIs and WebGL graphics standards.',
      metric: '3.5B+',
      metricLabel: 'Compatible Smartphones'
    }
  ];

  // Technical Specifications Table
  const technicalSpecs = [
    { label: 'WebAR Tracking Engine', value: 'Niantic 8thWall Engine (window.XR8) + @trikomi/core/8thwall' },
    { label: 'Tracking Architecture', value: '6-DoF SLAM + biometric facial anchor kinematics' },
    { label: 'Head Occluder Model', value: 'Draco-compressed head-occluder.glb pinned to face coordinate space' },
    { label: 'Runtime Customization', value: 'window.applyMaterialColor(matName, colorHex) real-time API' },
    { label: 'Browser Engine', value: 'Mobile Safari (WebKit iOS 14+), Mobile Chrome (Blink Android 10+)' },
    { label: 'Camera Pipeline', value: 'WebRTC getUserMedia with automatic front-facing sensor handoff' },
    { label: 'Frame Rate', value: 'Smooth 60 FPS lock with hardware-accelerated WebGL 2.0' },
    { label: 'Privacy & Security', value: '100% client-side computer vision; zero sensor frames sent to cloud' }
  ];

  // Hero Interactive Visual Stage
  const heroVisual = (
    <div className="vs-8theye-hero-stage">
      <div className="vs-8theye-hero-stage__backdrop" />

      {/* Stage Header HUD */}
      <div className="vs-8theye-hero-stage__hud">
        <div className="vs-8theye-hud-chip vs-8theye-hud-chip--active">
          <span className="vs-8theye-hud-dot" />
          <span>8thWall XR8 Engine · 6-DoF SLAM</span>
        </div>
        <div className="vs-8theye-hud-chip">
          <span>60 FPS</span>
        </div>
        <div
          className="vs-8theye-hud-chip vs-8theye-hud-chip--toggle"
          onClick={() => setQrModalOpen(!qrModalOpen)}
          title="Show Mobile QR Code"
          role="button"
          tabIndex={0}
        >
          <span>📱 {qrModalOpen ? 'Hide QR' : 'Mobile QR'}</span>
        </div>
      </div>

      {/* Mobile Device WebAR Simulation Card */}
      <div className="vs-8theye-phone-frame">
        <div className="vs-8theye-phone-notch">
          <span className="vs-8theye-phone-speaker" />
          <span className="vs-8theye-phone-cam" />
        </div>

        <div className="vs-8theye-phone-screen">
          {/* Simulated WebAR Camera Viewport */}
          <div className="vs-8theye-camera-view">
            {/* Tracking Grid Overlay */}
            <div className="vs-8theye-tracking-grid">
              <div className="vs-8theye-tracking-reticle" />
              <div className="vs-8theye-face-anchor">
                <span className="vs-8theye-anchor-box" />
                <span className="vs-8theye-anchor-label">Face Anchor: Locked</span>
              </div>
            </div>

            {/* Glasses Vector Rendering */}
            <div className="vs-8theye-glasses-layer">
              <svg
                className="vs-8theye-glasses-svg"
                viewBox="0 0 360 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Temple Arms */}
                <path
                  d="M 25 65 Q 60 55 95 60"
                  stroke={currentFinish.hex}
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={0.6}
                />
                <path
                  d="M 335 65 Q 300 55 265 60"
                  stroke={currentFinish.hex}
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={0.6}
                />

                {/* Left Lens & Rim */}
                <rect
                  x="75"
                  y="40"
                  width="85"
                  height="60"
                  rx="18"
                  fill="rgba(162, 28, 175, 0.25)"
                  stroke={currentFinish.hex}
                  strokeWidth="5"
                />
                <path
                  d="M 90 48 L 130 48 L 112 90 L 80 90 Z"
                  fill="rgba(255, 255, 255, 0.32)"
                />

                {/* Bridge */}
                <path
                  d="M 160 62 Q 180 54 200 62"
                  stroke={currentFinish.hex}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Right Lens & Rim */}
                <rect
                  x="200"
                  y="40"
                  width="85"
                  height="60"
                  rx="18"
                  fill="rgba(162, 28, 175, 0.25)"
                  stroke={currentFinish.hex}
                  strokeWidth="5"
                />
                <path
                  d="M 215 48 L 255 48 L 237 90 L 205 90 Z"
                  fill="rgba(255, 255, 255, 0.32)"
                />
              </svg>
            </div>

            {/* Mobile Browser Address Bar Simulation */}
            <div className="vs-8theye-url-bar">
              <span className="vs-8theye-lock-icon">🔒</span>
              <span className="vs-8theye-url-text">
                {activePlatform === 'ios' ? 'safari.app / victorshell.com/webar' : 'chrome.app / victorshell.com/webar'}
              </span>
              <span className="vs-8theye-refresh-icon">↻</span>
            </div>

            {/* Live Model Meta Overlay */}
            <div className="vs-8theye-screen-meta">
              <span className="vs-8theye-screen-meta__title">Aviator Classic AR</span>
              <span className="vs-8theye-screen-meta__finish">Finish: {currentFinish.label}</span>
            </div>
          </div>
        </div>

        {/* QR Code Overlay when active */}
        {qrModalOpen && (
          <div className="vs-8theye-qr-overlay">
            <div className="vs-8theye-qr-card">
              <span className="vs-8theye-qr-title">Scan for Instant Mobile WebAR</span>
              <div className="vs-8theye-qr-box">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="vs-8theye-qr-svg">
                  <rect width="100" height="100" fill="#FFFFFF" rx="8" />
                  {/* Position detection corners */}
                  <rect x="10" y="10" width="24" height="24" fill="#6E2CF2" rx="4" />
                  <rect x="14" y="14" width="16" height="16" fill="#FFFFFF" />
                  <rect x="18" y="18" width="8" height="8" fill="#6E2CF2" />

                  <rect x="66" y="10" width="24" height="24" fill="#6E2CF2" rx="4" />
                  <rect x="70" y="14" width="16" height="16" fill="#FFFFFF" />
                  <rect x="74" y="18" width="8" height="8" fill="#6E2CF2" />

                  <rect x="10" y="66" width="24" height="24" fill="#6E2CF2" rx="4" />
                  <rect x="14" y="70" width="16" height="16" fill="#FFFFFF" />
                  <rect x="18" y="74" width="8" height="8" fill="#6E2CF2" />

                  {/* QR Data Pattern */}
                  <rect x="42" y="12" width="6" height="6" fill="#1A162B" />
                  <rect x="52" y="12" width="6" height="6" fill="#1A162B" />
                  <rect x="42" y="24" width="6" height="6" fill="#1A162B" />
                  <rect x="48" y="32" width="6" height="6" fill="#1A162B" />
                  <rect x="12" y="44" width="6" height="6" fill="#1A162B" />
                  <rect x="24" y="44" width="6" height="6" fill="#1A162B" />
                  <rect x="36" y="44" width="6" height="6" fill="#1A162B" />
                  <rect x="48" y="44" width="6" height="6" fill="#1A162B" />
                  <rect x="60" y="44" width="6" height="6" fill="#1A162B" />
                  <rect x="72" y="44" width="6" height="6" fill="#1A162B" />
                  <rect x="84" y="44" width="6" height="6" fill="#1A162B" />
                  <rect x="42" y="56" width="6" height="6" fill="#1A162B" />
                  <rect x="54" y="56" width="6" height="6" fill="#1A162B" />
                  <rect x="66" y="56" width="6" height="6" fill="#1A162B" />
                  <rect x="42" y="68" width="6" height="6" fill="#1A162B" />
                  <rect x="54" y="68" width="6" height="6" fill="#1A162B" />
                  <rect x="78" y="68" width="6" height="6" fill="#1A162B" />
                  <rect x="42" y="80" width="6" height="6" fill="#1A162B" />
                  <rect x="60" y="80" width="6" height="6" fill="#1A162B" />
                  <rect x="72" y="80" width="6" height="6" fill="#1A162B" />
                </svg>
              </div>
              <span className="vs-8theye-qr-sub">Open camera on iOS Safari or Android Chrome</span>
            </div>
          </div>
        )}

        {/* Platform Switcher & Color Customizer Controls */}
        <div className="vs-8theye-controls-panel">
          <div className="vs-8theye-controls-row">
            <span className="vs-8theye-controls-label">MOBILE BROWSER</span>
            <div className="vs-8theye-pill-group">
              <button
                type="button"
                className={`vs-8theye-pill-btn ${activePlatform === 'ios' ? 'is-active' : ''}`}
                onClick={() => setActivePlatform('ios')}
              >
                Apple Safari (iOS)
              </button>
              <button
                type="button"
                className={`vs-8theye-pill-btn ${activePlatform === 'android' ? 'is-active' : ''}`}
                onClick={() => setActivePlatform('android')}
              >
                Google Chrome (Android)
              </button>
            </div>
          </div>

          <div className="vs-8theye-controls-row">
            <span className="vs-8theye-controls-label">LIVE FRAME FINISH</span>
            <div className="vs-8theye-pill-group">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`vs-8theye-pill-btn vs-8theye-pill-btn--color ${
                    activeFrameFinish === f.label ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveFrameFinish(f.label)}
                >
                  <span className="vs-8theye-swatch-dot" style={{ background: f.hex }} />
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Overview QR Activation Visual Card
  const overviewVisual = (
    <div className="vs-8theye-activation-card">
      <div className="vs-8theye-activation-card__header">
        <span className="vs-8theye-activation-card__title">Frictionless In-Browser AR Funnel</span>
        <span className="vs-8theye-activation-card__badge">Zero App Friction</span>
      </div>
      <div className="vs-8theye-activation-card__body">
        <div className="vs-8theye-funnel-step">
          <span className="vs-8theye-funnel-num">01</span>
          <div className="vs-8theye-funnel-meta">
            <span className="vs-8theye-funnel-title">Scan or Click Link</span>
            <span className="vs-8theye-funnel-desc">User taps link in social ad or scans QR on desktop</span>
          </div>
        </div>
        <div className="vs-8theye-funnel-step">
          <span className="vs-8theye-funnel-num">02</span>
          <div className="vs-8theye-funnel-meta">
            <span className="vs-8theye-funnel-title">Instant Camera Stream</span>
            <span className="vs-8theye-funnel-desc">WebAssembly initializes in &lt; 2.8s directly in browser</span>
          </div>
        </div>
        <div className="vs-8theye-funnel-step">
          <span className="vs-8theye-funnel-num">03</span>
          <div className="vs-8theye-funnel-meta">
            <span className="vs-8theye-funnel-title">6-DoF Fitting &amp; Checkout</span>
            <span className="vs-8theye-funnel-desc">Real-time style verification drives high-intent conversion</span>
          </div>
        </div>
      </div>
      <div className="vs-8theye-activation-card__footer">
        <span className="vs-8theye-activation-card__note">
          3.5 Billion+ AR-capable mobile devices supported worldwide · Powered by Niantic 8thWall
        </span>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="8thWall WebAR Eyewear"
      productBadge="Markerless Mobile WebAR"
      productTagline="Instant in-browser WebAR camera fitting with zero app download friction."
      brandName="VictorShell"
      brandLogo={<img src="/logos/eyewear.png" alt="8thWall Eyewear Logo" style={{ width: 26, height: 26, objectFit: 'contain' }} />}
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoHref={exploreDemoHref}
      exploreDemoLabel="Explore 8thWall Demo"
      navLinks={navLinks}
      className={`vs-8theye-landing-page ${className}`.trim()}
      heroProps={{
        title: 'Markerless WebAR Eyewear Try-On with Instant QR Activation',
        subtitle: 'Niantic 8thWall SLAM & 6-DoF Face Tracking Directly in Mobile Web Browsers',
        badge: 'Markerless Mobile WebAR',
        description:
          'Deploy world-class augmented reality eyewear try-on without app store downloads. Driven by the 8thWall WebAR engine and Trikomi 3D runtime, users access instant camera fitting in mobile Safari and Chrome with zero installation friction.',
        stats: [
          { value: '0 Apps', label: 'Zero Install', hint: 'Instant browser link' },
          { value: '< 2.8s', label: 'Activation Time', hint: 'Fast web cold start' },
          { value: '6-DoF', label: 'SLAM Tracking', hint: 'Markerless face stability' },
          { value: '3.2x', label: 'Engagement Rate', hint: 'Vs static ad campaigns' }
        ],
        visual: heroVisual
      }}
      overviewProps={{
        id: 'overview',
        badge: 'Break Free from App Store Walls',
        title: 'The World’s Leading Web-Based Augmented Reality Eyewear Engine',
        subtitle: 'Break Free from App Store Walls with Instant Browser Try-On',
        description:
          'VictorShell 8thWall Eyewear combines the industry-leading markerless SLAM and facial tracking of Niantic’s 8thWall engine with our high-fidelity 3D WebGL configurator pipeline. Rather than forcing users to download bulky native applications from the App Store or Google Play, users simply tap a link or scan a QR code to experience instantaneous camera-based AR try-on directly inside mobile Safari or Chrome.',
        highlights: [
          {
            title: '100% In-Browser WebAR',
            text: 'Runs natively in mobile Safari (iOS) and mobile Chrome (Android) without native apps.'
          },
          {
            title: 'Instant Desktop-to-Mobile QR Handoff',
            text: 'Seamless transition from desktop shopping to mobile front-facing camera AR.'
          },
          {
            title: 'Real-Time Material Tinting',
            text: 'Change frame colors and optical finishes on the fly with zero reload latency.'
          },
          {
            title: 'Calibrated 3D Head Occlusion',
            text: 'Pinned head-occluder volume ensures realistic temple arm tucking.'
          }
        ],
        visual: overviewVisual
      }}
      featuresProps={{
        id: 'features',
        badge: 'Next-Gen WebAR Capabilities',
        sectionTitle: 'Engineered for Viral Reach & Zero Friction',
        sectionSubtitle:
          'By combining Niantic 8thWall SLAM tracking, calibrated 3D head occlusion, real-time material recoloring, and instant QR code handoff, VictorShell 8thWall delivers the ultimate frictionless shopping funnel.',
        layout: 'bento',
        columns: 3,
        features: features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Frictionless AR Funnels',
        sectionTitle: 'WebAR Experiences & Campaign Activations',
        sectionSubtitle:
          'Explore mobile web camera direct try-on, live frame finishing swatches, and retail QR activations.',
        items: showcaseItems
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Conversion & Reach Metrics',
        sectionTitle: 'Why Brands Scale Faster with 8thWall WebAR',
        sectionSubtitle: 'Zero app store friction, 6-DoF SLAM stability, and sub-3 second cold starts.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive WebAR Studio',
        title: 'Launch the 8thWall WebAR Eyewear Studio',
        description:
          'Experience instantaneous markerless WebAR face tracking, live material recoloring, and frictionless mobile browser try-on.',
        exploreDemoLabel: 'Explore 8thWall Demo',
        exploreDemoHref: exploreDemoHref,
        note: 'Instant web activation · No App Store download · Compatible with iOS Safari and Android Chrome'
      }}
    >
      {/* Industry Verticals Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="8theye-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Industry Verticals</span>
            <h2 className="vs-landing-use-cases__title">Purpose-Built for Omnichannel Retailing &amp; Viral Marketing</h2>
            <p className="vs-landing-use-cases__subtitle">
              From global social ads and window QR displays to high-volume e-commerce storefronts.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-ads">
              <div className="vs-use-case-card__icon" aria-hidden="true">📱</div>
              <span className="vs-use-case-card__tag">Digital Marketing &amp; Ads</span>
              <h3 className="vs-use-case-card__title">Global Social &amp; Digital Ads</h3>
              <p className="vs-use-case-card__desc">
                Achieve 3.2x higher customer engagement compared to static digital display ads by linking social media campaigns directly to an instant in-browser WebAR camera session.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-window">
              <div className="vs-use-case-card__icon" aria-hidden="true">🪟</div>
              <span className="vs-use-case-card__tag">Smart Retail &amp; Kiosks</span>
              <h3 className="vs-use-case-card__title">In-Store Retail &amp; Window QR Displays</h3>
              <p className="vs-use-case-card__desc">
                Drive 24/7 retail engagement by placing interactive QR codes in shopfront windows, allowing after-hours passersby to try on the season’s catalog directly on their smartphones.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-ecommerce">
              <div className="vs-use-case-card__icon" aria-hidden="true">🛍️</div>
              <span className="vs-use-case-card__tag">Online Fashion Brands</span>
              <h3 className="vs-use-case-card__title">High-Volume Eyewear E-Commerce</h3>
              <p className="vs-use-case-card__desc">
                Integrate into product description pages with a single click button that opens front-facing camera WebAR, boosting checkout conversion and slashing fit-related returns.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-events">
              <div className="vs-use-case-card__icon" aria-hidden="true">🎪</div>
              <span className="vs-use-case-card__tag">Experiential Marketing</span>
              <h3 className="vs-use-case-card__title">Pop-Up Events &amp; Brand Activations</h3>
              <p className="vs-use-case-card__desc">
                Deploy touchless AR try-on experiences at runway shows, trade exhibitions, and influencer launch events without provisioning dedicated hardware or native app builds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Technical Specs Section */}
      <section className="vs-landing-specs" id="specs" data-testid="8theye-specs-section">
        <div className="vs-landing-specs__container">
          <div className="vs-landing-specs__header">
            <span className="vs-landing-specs__badge">Engineering Specifications</span>
            <h2 className="vs-landing-specs__title">Technical Architecture &amp; Performance</h2>
            <p className="vs-landing-specs__subtitle">
              Niantic 8thWall WebAR standards, sensor pipelines, and browser runtime performance.
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
