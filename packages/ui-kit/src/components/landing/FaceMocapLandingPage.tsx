import React, { useState } from 'react';
import { ProductLandingTemplate } from './ProductLandingTemplate';
import type { FeatureItem } from './LandingFeatures';
import type { BenefitItem } from './LandingBenefits';
import type { ShowcaseItem } from './LandingVisualShowcase';
import type { LandingNavLink } from './LandingNav';

export interface FaceMocapLandingPageProps {
  /** Callback to launch the actual Face Mocap 3D demo. */
  onExploreDemo: () => void;
  /** Destination route for the demo. Defaults to '/apps/face-mocap/index.html#demo'. */
  exploreDemoHref?: string;
  /** Active theme accent. Defaults to 'violet'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * FaceMocapLandingPage
 *
 * Dedicated, premium single-product landing page for the VictorShell Face Motion Capture SDK.
 * Built using the Frosted Glass design system and Task 22/23/24 reusable components.
 * Focuses exclusively on Face Mocap capabilities:
 * - MediaPipe Tasks Vision dense 468 3D facial landmark tracking
 * - 52 standard ARKit expression blendshapes (eyes, jaw, mouth, brows)
 * - WebSocket LiveLink streaming to Unreal Engine (port 5000) and Unity
 * - 100% client-side inference with zero cloud latency and total privacy
 * - Multi-avatar support (MetaHumans, stylized avatars, wireframe mesh)
 */
export const FaceMocapLandingPage: React.FC<FaceMocapLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/face-mocap/index.html#demo',
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

  // Verified Features from MediaSelector.jsx, LiveLink.jsx, and Store.jsx
  const features: FeatureItem[] = [
    {
      id: 'dense-landmarks',
      title: '468-Point Dense Face Mesh',
      description:
        'Continuous sub-millimeter 3D facial landmark tracking detecting micro-expressions, gaze direction, and eyelid geometry in real time.',
      badge: 'MediaPipe Vision',
      highlight: true
    },
    {
      id: 'arkit-blendshapes',
      title: '52 ARKit Blendshapes',
      description:
        'Accurate 1:1 extraction of 52 standard ARKit facial blendshape weights, fully rigged for instant MetaHuman and character animation.',
      badge: 'Standard ARKit'
    },
    {
      id: 'livelink-stream',
      title: 'Unreal Engine LiveLink',
      description:
        'Built-in WebSocket streaming client broadcasting timecoded JSON blendshape packets directly to Unreal Engine LiveLink at 127.0.0.1:5000.',
      badge: 'WebSocket LiveLink'
    },
    {
      id: 'zero-cloud-fees',
      title: '100% On-Device Inference',
      description:
        'All computer vision neural networks execute locally via WebAssembly and WebGPU. No video frames leave your machine, ensuring full biometric privacy.',
      badge: 'Zero Cloud Cost'
    },
    {
      id: 'adaptive-smoothing',
      title: 'Adaptive Jitter Filter',
      description:
        'Tunable smoothstep and Kalman filtering dampens webcam sensor noise while preserving rapid emotional transitions and lip sync articulation.',
      badge: 'Sub-Pixel Filter'
    },
    {
      id: 'multi-avatar-stage',
      title: 'Real-Time 3D Viewport',
      description:
        'Interactive Three.js viewport rendering synchronized 3D cartoon avatars (raccoon_head_small.glb) and anatomical head occluders.',
      badge: 'Three.js WebGPU'
    }
  ];

  // Interactive Showcase Views
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'livelink-view',
      label: 'MetaHuman LiveLink',
      badge: 'LiveLink ws://5000',
      description:
        'Stream 52 ARKit blendshapes directly into Unreal Engine 5 to drive photorealistic MetaHuman facial rigs in real time.',
      visual: (
        <div className="vs-mocap-preview-card" data-testid="showcase-livelink-preview">
          <div className="vs-mocap-preview-card__badge-row">
            <span className="vs-mocap-chip">Unreal Engine 5</span>
            <span className="vs-mocap-chip vs-mocap-chip--accent">LiveLink Protocol</span>
          </div>
          <div className="vs-mocap-preview-card__visual">
            <img
              src="/logos/facemocap.png"
              alt="VictorShell Face Mocap LiveLink"
              className="vs-mocap-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-mocap-preview-card__meta">
            <span className="vs-mocap-preview-card__title">Unreal MetaHuman Streaming</span>
            <span className="vs-mocap-preview-card__spec">52 Blendshapes · Timecoded JSON · Port 5000</span>
          </div>
        </div>
      )
    },
    {
      id: 'avatar-view',
      label: 'Cartoon 3D Avatar',
      badge: 'raccoon_head_small.glb',
      description:
        'Drive expressive stylized 3D characters with real-time eye blinks, eyebrow arches, and lip synchronization.',
      visual: (
        <div className="vs-mocap-preview-card" data-testid="showcase-avatar-preview">
          <div className="vs-mocap-preview-card__badge-row">
            <span className="vs-mocap-chip">raccoon_head_small.glb</span>
            <span className="vs-mocap-chip vs-mocap-chip--accent">Interactive 3D Avatar</span>
          </div>
          <div className="vs-mocap-preview-card__visual">
            <img
              src="/logos/facemocap.png"
              alt="VictorShell Stylized 3D Avatar"
              className="vs-mocap-preview-card__img vs-mocap-preview-card__img--alt"
              loading="lazy"
            />
          </div>
          <div className="vs-mocap-preview-card__meta">
            <span className="vs-mocap-preview-card__title">Stylized Character Rig</span>
            <span className="vs-mocap-preview-card__spec">60 FPS WebGL2/WebGPU · 6-DOF Head Rotation</span>
          </div>
        </div>
      )
    },
    {
      id: 'mesh-view',
      label: '468 Mesh Topology',
      badge: 'mocap_landmarks.svg',
      description:
        'Inspect the raw 468-point 3D wireframe mesh with depth occluder geometry for technical motion verification.',
      visual: (
        <div className="vs-mocap-preview-card" data-testid="showcase-mesh-preview">
          <div className="vs-mocap-preview-card__badge-row">
            <span className="vs-mocap-chip">head-occluder.glb</span>
            <span className="vs-mocap-chip vs-mocap-chip--accent">Depth Landmark Mesh</span>
          </div>
          <div className="vs-mocap-preview-card__visual">
            <img
              src="/svgs/mocap_landmarks_measurement.svg"
              alt="VictorShell 468 Landmark Measurement Mesh"
              className="vs-mocap-preview-card__img"
              loading="lazy"
            />
          </div>
          <div className="vs-mocap-preview-card__meta">
            <span className="vs-mocap-preview-card__title">468-Point Mesh Topology</span>
            <span className="vs-mocap-preview-card__spec">Dense Landmark Wireframe · Sub-Millimeter Depth</span>
          </div>
        </div>
      )
    }
  ];

  // Benefits & Performance Metrics
  const benefits: BenefitItem[] = [
    {
      id: 'latency',
      title: 'Zero Cloud Latency',
      description:
        'All computer vision analysis executes locally on your device GPU. No video streaming roundtrips or server latency.',
      metric: '0 ms',
      metricLabel: 'Server Latency',
      tag: '100% On-Device'
    },
    {
      id: 'frame-rate',
      title: 'Smooth 60 FPS Tracking',
      description:
        'Lightweight MediaPipe Tasks Vision pipeline runs smoothly on standard webcams without dropped frames.',
      metric: '60 FPS',
      metricLabel: 'Webcam Tracking',
      tag: 'Performance'
    },
    {
      id: 'blendshapes-count',
      title: '52 ARKit Blendshapes',
      description:
        'Standardized facial channel weights compatible with Unreal Engine MetaHumans, Unity, and Blender.',
      metric: '52 pts',
      metricLabel: 'Expression Shapes',
      tag: 'Industry Standard'
    },
    {
      id: 'privacy',
      title: 'Complete Biometric Privacy',
      description:
        'Zero video feeds, face scans, or telemetry data are ever recorded or transmitted to external cloud servers.',
      metric: '100%',
      metricLabel: 'Privacy Guaranteed',
      tag: 'GDPR / CCPA'
    }
  ];

  // Interactive customizer state matching reference
  const [activeTab, setActiveTab] = useState<'expression' | 'character' | 'output'>('expression');
  const [activeExpression, setActiveExpression] = useState<'neutral' | 'smile' | 'wink' | 'talk' | 'laugh' | 'surprised'>('wink');

  // Hero visual showcase matching reference layout: center half-tracking raccoon, right floating customization panel
  const heroVisual = (
    <div className="vs-mocap-hero-showcase" data-testid="mocap-hero-showcase">
      {/* Center Half-Tracking Cartoon Raccoon Hero Stage */}
      <div className="vs-mocap-hero-stage__viewport">
        <div className="vs-mocap-hero-image-wrap">
          <img
            src="/images/raccoon-mocap-hero.png"
            alt="VictorShell Face Motion Capture - Half-Tracking Cartoon Raccoon Avatar"
            className="vs-mocap-hero-image"
            loading="eager"
          />
          {/* Live Tracking overlay badge */}
          <div className="vs-mocap-hero-live-badge">
            <span className="vs-mocap-hero-live-dot" />
            <span>Live Tracking</span>
          </div>
        </div>
      </div>

      {/* Right Floating Glass Customizer Panel: Customize & Preview */}
      <div className="vs-mocap-customizer-card" data-testid="mocap-customizer-card">
        <h3 className="vs-mocap-customizer-title">Customize &amp; Preview</h3>

        {/* Tabs: Expression, Character, Output */}
        <div className="vs-mocap-customizer-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'expression'}
            className={`vs-mocap-tab-btn ${activeTab === 'expression' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('expression')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span>Expression</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'character'}
            className={`vs-mocap-tab-btn ${activeTab === 'character' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('character')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
            </svg>
            <span>Character</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'output'}
            className={`vs-mocap-tab-btn ${activeTab === 'output' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span>Output</span>
          </button>
        </div>

        {/* Expression Grid: 3x2 Grid matching reference */}
        <div className="vs-mocap-expr-grid">
          {[
            { id: 'neutral', label: 'Neutral', img: '/images/mocap-expr-neutral.png' },
            { id: 'smile', label: 'Smile', img: '/images/mocap-expr-smile.png' },
            { id: 'wink', label: 'Wink', img: '/images/mocap-expr-wink.png' },
            { id: 'talk', label: 'Talk', img: '/images/mocap-expr-talk.png' },
            { id: 'laugh', label: 'Laugh', img: '/images/mocap-expr-laugh.png' },
            { id: 'surprised', label: 'Surprised', img: '/images/mocap-expr-surprised.png' }
          ].map((expr) => (
            <button
              key={expr.id}
              type="button"
              className={`vs-mocap-expr-card ${activeExpression === expr.id ? 'is-active' : ''}`}
              onClick={() => setActiveExpression(expr.id as any)}
              aria-label={expr.label}
            >
              <div className="vs-mocap-expr-avatar">
                <img src={expr.img} alt={expr.label} className="vs-mocap-expr-img" />
              </div>
              <span className="vs-mocap-expr-label">{expr.label}</span>
            </button>
          ))}
        </div>

        {/* Apply to 3D Character Button */}
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-mocap-apply-btn"
          data-testid="mocap-apply-btn"
        >
          <span>Apply to 3D Character</span>
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
      productTitle="Face MoCap Configurator"
      productBadge="Face MoCap Configurator"
      productTagline="Real-time browser face tracking with zero cloud latency and LiveLink streaming to Unreal Engine & Unity."
      brandLogo={
        <img
          src="/images/mocap-avatar-logo.png"
          alt="VictorShell Face MoCap"
          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
        />
      }
      brandName="VictorShell™"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Try Live Demo"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-facemocap-landing-page ${className}`.trim()}
      heroProps={{
        badge: (
          <span className="vs-mocap-hero-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
              <path d="M9 15s1.5 1.5 3 1.5 3-1.5 3-1.5" />
            </svg>
            <span>Face Motion Capture</span>
          </span>
        ),
        title: (
          <>
            Capture, Track &amp;<br />
            Animate Faces in <span className="vs-gradient-text">3D</span>
          </>
        ),
        description:
          'Real-time face motion capture to track expressions, blendshapes and animate realistic 3D characters.',
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '0.85', fontWeight: 800, fontSize: '11px', letterSpacing: '-0.02em', color: 'var(--vs-primary)' }}>
                <span>FPS</span>
                <span style={{ opacity: 0.5, transform: 'scaleY(-1)' }}>FPS</span>
              </div>
            ),
            label: 'Real-Time',
            sublabel: 'Tracking'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            ),
            label: 'Blendshape',
            sublabel: 'Mapping'
          },
          {
            icon: (
              <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--vs-primary)', letterSpacing: '-0.02em' }}>
                AI+
              </div>
            ),
            label: 'AI-Enhanced',
            sublabel: 'Performance'
          }
        ],
        featureHighlights: [
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
                <path d="M9 15s1.5 1.5 3 1.5 3-1.5 3-1.5" />
              </svg>
            ),
            title: 'Accurate Face Tracking',
            description: 'Track detailed facial movements with high precision.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            ),
            title: 'Blendshape Ready',
            description: 'Get real-time blendshapes for natural facial animation.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ),
            title: 'Real-Time & Low Latency',
            description: 'Smooth capture and instant animation in 3D.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            ),
            title: 'Flexible Integration',
            description: 'Easily integrate with 3D, game and virtual human pipelines.'
          }
        ],
        visual: heroVisual
      }}
      overviewProps={{
        id: 'overview',
        badge: 'Computer Vision Kinematics',
        title: 'Precision Facial Landmark Kinematics Without Hardware Markers',
        subtitle: 'From raw webcam frames to calibrated skeletal blendshapes in under 16ms',
        description:
          'Face Mocap integrates Google MediaPipe Tasks Vision with Three.js WebGPU, executing dense 468-point 3D facial mesh reconstruction directly on user GPU hardware. Without requiring specialized depth cameras or infrared rigs, actors, VTubers, and game animators achieve studio-grade motion capture anywhere.',
        highlights: [
          {
            title: 'Zero Cloud Roundtrips & Privacy',
            text: 'All computer vision neural networks run locally via WebAssembly and WebGPU. No video frames or facial biometric data ever leave the local machine.'
          },
          {
            title: 'Direct Unreal LiveLink Bridge',
            text: 'Built-in WebSocket streaming client transmits timecoded JSON blendshape packets directly to Unreal Engine LiveLink at 127.0.0.1:5000.'
          },
          {
            title: 'Adaptive Landmark Smoothing',
            text: 'Tunable Kalman and smoothstep filtering eliminates high-frequency sensor noise while preserving sharp eyebrow twitches and lip articulation.'
          }
        ],
        visual: (
          <div className="vs-mocap-measurement-card" data-testid="mocap-measurement-card">
            <div className="vs-mocap-measurement-card__header">
              <span className="vs-mocap-measurement-card__title">Dense 468 Landmark Mesh Topology</span>
              <span className="vs-mocap-chip">mocap_landmarks_measurement.svg</span>
            </div>
            <div className="vs-mocap-measurement-card__body">
              <img
                src="/svgs/mocap_landmarks_measurement.svg"
                alt="Face Mocap Landmark Topology"
                className="vs-mocap-measurement-card__img"
                loading="lazy"
              />
            </div>
            <div className="vs-mocap-measurement-card__footer">
              <span className="vs-mocap-measurement-card__note">468 3D Vertices · 52 Standard ARKit Action Units</span>
            </div>
          </div>
        )
      }}
      featuresProps={{
        id: 'features',
        badge: 'Core Technology',
        sectionTitle: 'Studio-Grade Facial Tracking in Any Browser',
        sectionSubtitle:
          'A complete suite of performance capture, smoothing, and game engine streaming tools.',
        layout: 'grid',
        columns: 3,
        features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Streaming Modes',
        sectionTitle: 'Explore Character Tracking Modes',
        sectionSubtitle:
          'Switch between game engine streaming, stylized 3D characters, and raw landmark mesh topologies.',
        items: showcaseItems
      }}
      benefitsProps={{
        id: 'benefits',
        badge: 'Performance & Privacy',
        sectionTitle: 'Why Creators and Studios Choose Face Mocap',
        sectionSubtitle: 'Zero subscription fees, zero cloud compute latency, and 100% biometric privacy.',
        variant: 'metrics',
        items: benefits
      }}
      ctaProps={{
        id: 'cta',
        badge: 'Interactive Mocap Studio',
        title: 'Experience Real-Time Face Mocap Live in Your Browser',
        description:
          'Connect your webcam and watch your facial expressions mirrored onto 3D avatars with instant LiveLink streaming ready to broadcast.',
        exploreDemoLabel: 'Launch Mocap Studio',
        exploreDemoHref: exploreDemoHref,
        note: 'Zero plugins or downloads required · Runs on standard webcams · 100% client-side'
      }}
    >
      {/* Dedicated Industry Use Cases Section */}
      <section className="vs-landing-use-cases" id="use-cases" data-testid="mocap-use-cases-section">
        <div className="vs-landing-use-cases__container">
          <div className="vs-landing-use-cases__header">
            <span className="vs-landing-use-cases__badge">Industry Solutions</span>
            <h2 className="vs-landing-use-cases__title">Engineered for Studios, Animators &amp; Streamers</h2>
            <p className="vs-landing-use-cases__subtitle">
              From AAA game cinematics to independent VTuber broadcasts.
            </p>
          </div>

          <div className="vs-landing-use-cases__grid">
            <div className="vs-use-case-card" data-testid="use-case-games">
              <div className="vs-use-case-card__icon" aria-hidden="true">🎮</div>
              <span className="vs-use-case-card__tag">Game Development &amp; VFX</span>
              <h3 className="vs-use-case-card__title">Unreal MetaHuman Previz</h3>
              <p className="vs-use-case-card__desc">
                Stream real-time facial performances directly into Unreal Engine Sequencer and Unity Animator without costly head-mounted camera rigs.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-vtuber">
              <div className="vs-use-case-card__icon" aria-hidden="true">🦊</div>
              <span className="vs-use-case-card__tag">VTubing &amp; Livestreaming</span>
              <h3 className="vs-use-case-card__title">Low-Latency Avatar Broadcast</h3>
              <p className="vs-use-case-card__desc">
                Drive stylized 3D VTuber avatars in OBS or streaming software with sub-millisecond lip sync and eye tracking powered by ordinary webcams.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-film">
              <div className="vs-use-case-card__icon" aria-hidden="true">🎬</div>
              <span className="vs-use-case-card__tag">Film &amp; Commercials</span>
              <h3 className="vs-use-case-card__title">Rapid Facial Pre-Visualization</h3>
              <p className="vs-use-case-card__desc">
                Allow directors and voice actors to audition facial dialogues and emotional acting beats in real-time virtual production sets.
              </p>
            </div>

            <div className="vs-use-case-card" data-testid="use-case-telepresence">
              <div className="vs-use-case-card__icon" aria-hidden="true">🌐</div>
              <span className="vs-use-case-card__tag">Spatial Computing</span>
              <h3 className="vs-use-case-card__title">Interactive WebXR Avatars</h3>
              <p className="vs-use-case-card__desc">
                Broadcast lightweight blendshape telemetry packets across WebRTC channels for collaborative VR meetings and social metaverse worlds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
