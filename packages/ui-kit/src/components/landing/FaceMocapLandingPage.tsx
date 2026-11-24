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
  // Navigation anchors for the single-page scroll layout
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Tracking Tech', href: '#showcase' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#specs' }
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

  // Interactive state for hero visual simulation
  const [activeAvatar, setActiveAvatar] = useState<'raccoon' | 'metahuman' | 'mesh'>('raccoon');
  const [isTrackingActive, setIsTrackingActive] = useState<boolean>(true);

  // Hero visual stage with simulated blendshape meters and live telemetry
  const heroVisual = (
    <div className="vs-mocap-hero-stage" data-testid="mocap-hero-stage">
      <div className="vs-mocap-hero-stage__backdrop" aria-hidden="true" />

      <div className="vs-mocap-hero-stage__controls">
        <button
          type="button"
          className="vs-mocap-hero-stage__indicator"
          onClick={() => setIsTrackingActive((prev) => !prev)}
          title="Click to toggle simulation"
          style={{ background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span className={`vs-mocap-hero-stage__dot ${isTrackingActive ? 'is-active' : ''}`} />
          {isTrackingActive ? 'Live Landmark Tracking: 60 FPS' : 'Tracking Paused'}
        </button>
        <div className="vs-mocap-hero-stage__avatars">
          {(['raccoon', 'metahuman', 'mesh'] as const).map((avatar) => (
            <button
              key={avatar}
              type="button"
              className={`vs-mocap-avatar-btn ${activeAvatar === avatar ? 'is-active' : ''}`}
              onClick={() => setActiveAvatar(avatar)}
              aria-label={`Select ${avatar} avatar`}
            >
              {avatar === 'raccoon' ? 'AVATAR' : avatar === 'metahuman' ? 'METAHUMAN' : 'MESH'}
            </button>
          ))}
        </div>
      </div>

      <div className="vs-mocap-hero-stage__viewport">
        <img
          src="/logos/facemocap.png"
          alt="Face Motion Capture 3D Avatar"
          className="vs-mocap-hero-stage__avatar"
        />

        {/* Live Blendshape Telemetry Meters */}
        <div className="vs-mocap-telemetry-panel">
          <div className="vs-mocap-telemetry-row">
            <span className="vs-mocap-telemetry-label">EyeBlinkLeft</span>
            <div className="vs-mocap-telemetry-bar"><div className="vs-mocap-telemetry-fill" style={{ width: '82%' }} /></div>
            <span className="vs-mocap-telemetry-val">0.82</span>
          </div>
          <div className="vs-mocap-telemetry-row">
            <span className="vs-mocap-telemetry-label">JawOpen</span>
            <div className="vs-mocap-telemetry-bar"><div className="vs-mocap-telemetry-fill" style={{ width: '64%' }} /></div>
            <span className="vs-mocap-telemetry-val">0.64</span>
          </div>
          <div className="vs-mocap-telemetry-row">
            <span className="vs-mocap-telemetry-label">MouthSmile</span>
            <div className="vs-mocap-telemetry-bar"><div className="vs-mocap-telemetry-fill" style={{ width: '91%' }} /></div>
            <span className="vs-mocap-telemetry-val">0.91</span>
          </div>
          <div className="vs-mocap-telemetry-row">
            <span className="vs-mocap-telemetry-label">BrowInnerUp</span>
            <div className="vs-mocap-telemetry-bar"><div className="vs-mocap-telemetry-fill" style={{ width: '48%' }} /></div>
            <span className="vs-mocap-telemetry-val">0.48</span>
          </div>
        </div>

        <div className="vs-mocap-hero-stage__status-badge">
          <span>LiveLink: ws://127.0.0.1:5000</span>
        </div>
      </div>

      <div className="vs-mocap-hero-stage__footer">
        <div className="vs-mocap-hero-stage__meta">
          <span className="vs-mocap-hero-stage__meta-label">Selected Avatar Rig</span>
          <span className="vs-mocap-hero-stage__meta-val">
            {activeAvatar === 'raccoon' ? 'Stylized Raccoon (raccoon_head_small.glb)' : activeAvatar === 'metahuman' ? 'Unreal MetaHuman LiveLink Stream' : 'Dense 468 Landmark Occluder Mesh'}
          </span>
        </div>
        <button
          type="button"
          onClick={onExploreDemo}
          className="vs-mocap-hero-stage__quick-btn vs-btn-secondary"
          data-testid="hero-quick-launch-btn"
        >
          Launch Mocap Studio →
        </button>
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="Face Motion Capture"
      productBadge="MediaPipe 52 ARKit Blendshapes"
      productTagline="Real-time browser face tracking with zero cloud latency and LiveLink streaming to Unreal Engine & Unity."
      brandName="VictorShell"
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Launch Mocap Studio"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-facemocap-landing-page ${className}`.trim()}
      heroProps={{
        title: 'Browser-Based Facial Motion Capture & LiveLink Streaming',
        subtitle: 'Sub-Millisecond 52 Blendshape Tracking for Unreal Engine & Unity',
        badge: 'Interactive WebGPU Mocap',
        description:
          'Capture nuanced human facial expressions in real-time using standard webcams. Stream 52 ARKit-compatible expression blendshapes and 6-DOF head rotation directly to MetaHumans, VTuber avatars, and game characters via WebSockets and LiveLink.',
        exploreDemoLabel: 'Launch Mocap Studio',
        secondaryCta: {
          label: 'View Tech Specs',
          href: '#specs'
        },
        stats: [
          { value: '52 Shapes', label: 'ARKit Blendshapes', hint: 'Universal facial channels' },
          { value: '60 FPS', label: 'Tracking Speed', hint: 'Zero jitter webcam stream' },
          { value: '0 ms', label: 'Cloud Latency', hint: '100% on-device inference' }
        ],
        visual: heroVisual,
        visualPosition: 'right'
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
        layout: 'bento',
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

      {/* Product Technical Specs Section */}
      <section className="vs-landing-specs" id="specs" data-testid="mocap-specs-section">
        <div className="vs-landing-specs__container">
          <div className="vs-landing-specs__header">
            <span className="vs-landing-specs__badge">Technical Specifications</span>
            <h2 className="vs-landing-specs__title">Engine &amp; Tracking Specifications</h2>
            <p className="vs-landing-specs__subtitle">
              Verified specifications powering the VictorShell Face Motion Capture SDK.
            </p>
          </div>

          <div className="vs-landing-specs__grid">
            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">Computer Vision &amp; Tracking</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Neural Network</dt>
                  <dd>MediaPipe Tasks Vision (Google Research)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Landmarks</dt>
                  <dd>468 3D dense facial points + iris tracking</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Blendshapes</dt>
                  <dd>52 Apple ARKit standard blendshape channels</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Inference Runtime</dt>
                  <dd>WebAssembly (WASM) &amp; WebGL / WebGPU acceleration</dd>
                </div>
              </dl>
            </div>

            <div className="vs-landing-specs__card">
              <h3 className="vs-landing-specs__card-title">LiveLink &amp; Output Streaming</h3>
              <dl className="vs-landing-specs__list">
                <div className="vs-landing-specs__row">
                  <dt>Streaming Protocol</dt>
                  <dd>WebSocket (JSON packet stream)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Default Target</dt>
                  <dd>127.0.0.1:5000 (Unreal Engine LiveLink)</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Engine Target</dt>
                  <dd>Unreal Engine 4/5, Unity, Blender, WebXR</dd>
                </div>
                <div className="vs-landing-specs__row">
                  <dt>Data Privacy</dt>
                  <dd>100% Client-Side · Zero Server Telemetry</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </ProductLandingTemplate>
  );
};
