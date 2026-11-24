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
  /** Active theme accent. Defaults to 'violet'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * BoxLandingPage
 *
 * Dedicated, luxury single-product landing page for the VictorShell 3D Box Configurator.
 * Built strictly according to the approved VictorShell reference design (media_1795149511293_11fa0203.jpg).
 * Features:
 * - Matching VictorShell header with Box Configurator badge
 * - 3-Column hero layout:
 *   - Left: Heading, description, dual CTAs, and 3 feature badges
 *   - Center: Large 3D mailer box preview with vertical floating toolbar, fullscreen button, and bottom carousel
 *   - Right: Floating glass customizer with Style/Material/Print/Finishing tabs, 4 box types, dimensions, and 5 material swatches
 * - 4 Bottom Feature Cards matching approved design
 * - Full Overview, Features, Use Cases, Performance, and Tech Specs sections
 */
export const BoxLandingPage: React.FC<BoxLandingPageProps> = ({
  onExploreDemo,
  exploreDemoHref = '/apps/box-configurator/index.html#demo',
  theme = 'violet',
  className = ''
}) => {
  // Navigation anchors matching reference design
  const navLinks: LandingNavLink[] = [
    { label: 'Overview', href: '#overview', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Performance', href: '#benefits' },
    { label: 'Tech Specs', href: '#cta' }
  ];

  // Interactive customizer state
  const [activeTab, setActiveTab] = useState<'style' | 'material' | 'print' | 'finishing'>('style');
  const [boxType, setBoxType] = useState<'mailer' | 'tuck' | 'rigid' | 'sleeve'>('mailer');
  const [dimensions, setDimensions] = useState({ length: 200, width: 150, height: 80 });
  const [material, setMaterial] = useState<'cardboard' | 'kraft' | 'rigid' | 'corrugated' | 'luxury'>('cardboard');
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(0);
  const [activeTool, setActiveTool] = useState<'rotate' | 'pan' | 'zoom-in' | 'zoom-out' | 'view'>('rotate');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger feedback toast on action
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 5 Carousel thumbnails
  const thumbnails = [
    { id: 'mailer', label: 'Mailer Box', src: '/images/box-thumb-mailer.png', boxType: 'mailer' as const },
    { id: 'tuck', label: 'Tuck Box', src: '/images/box-thumb-tuck.png', boxType: 'tuck' as const },
    { id: 'rigid', label: 'Rigid Box', src: '/images/box-thumb-rigid.png', boxType: 'rigid' as const },
    { id: 'kraft', label: 'Kraft Box', src: '/images/box-thumb-kraft.png', boxType: 'mailer' as const },
    { id: 'pattern', label: 'Pattern Box', src: '/images/box-thumb-pattern.png', boxType: 'mailer' as const }
  ];

  const handlePrevThumb = () => {
    const nextIdx = (activeThumbIndex - 1 + thumbnails.length) % thumbnails.length;
    setActiveThumbIndex(nextIdx);
    setBoxType(thumbnails[nextIdx].boxType);
  };

  const handleNextThumb = () => {
    const nextIdx = (activeThumbIndex + 1) % thumbnails.length;
    setActiveThumbIndex(nextIdx);
    setBoxType(thumbnails[nextIdx].boxType);
  };

  // 4 Box Types in customizer
  const boxTypes = [
    { id: 'mailer', label: 'Mailer Box', img: '/images/box-type-mailer.png', thumbIdx: 0 },
    { id: 'tuck', label: 'Tuck Box', img: '/images/box-type-tuck.png', thumbIdx: 1 },
    { id: 'rigid', label: 'Rigid Box', img: '/images/box-type-rigid.png', thumbIdx: 2 },
    { id: 'sleeve', label: 'Sleeve Box', img: '/images/box-type-sleeve.png', thumbIdx: 0 }
  ];

  // 5 Materials with swatches
  const materials = [
    { id: 'cardboard', label: 'Cardboard', color: '#C29B68', border: '#8C6737' },
    { id: 'kraft', label: 'Kraft', color: '#D7A774', border: '#A67746' },
    { id: 'rigid', label: 'Rigid', color: '#E2E2E6', border: '#BDBDC4' },
    { id: 'corrugated', label: 'Corrugated', color: '#B58756', border: '#7E562A', background: 'repeating-linear-gradient(90deg, #B58756, #B58756 3px, #8D6236 4px)' },
    { id: 'luxury', label: 'Luxury', color: '#242428', border: '#101014' }
  ];

  // Verified Features for Features section
  const features: FeatureItem[] = [
    {
      id: 'parametric-kinematics',
      title: 'Real-Time Carton Kinematics',
      description:
        'Smoothly animate continuous folding sequences from 2D flat dielines into closed 3D cartons with physics-backed hinge constraints.',
      badge: 'Hierarchical Fold',
      highlight: true
    },
    {
      id: 'vector-decals',
      title: 'Interactive 2D Decal Projection',
      description:
        'Place, scale, and rotate high-resolution brand logos, vector typography, and graphics across packaging panels using Konva 2D.',
      badge: 'Vector Mapping'
    },
    {
      id: 'standard-templates',
      title: 'Standard Packaging Library',
      description:
        'Pre-engineered industry standards including Roll-End Mailers, Reverse Tuck End cartons, and Point-of-Sale display trays.',
      badge: 'FEFCO / ECMA'
    },
    {
      id: 'dieline-export',
      title: 'Production Vector Dieline Export',
      description:
        'Generate precision CAD/CAM dielines with separated vector layers for through-cuts, crease scores, bleeds, and dimension callouts.',
      badge: 'PDF / SVG / DXF'
    },
    {
      id: 'parametric-sizing',
      title: 'Dynamic Dimension Grading',
      description:
        'Adjust width, height, and depth dynamically while internal packaging algorithms recalculate tuck flaps, dust flaps, and glue tabs.',
      badge: 'Auto-Grading'
    },
    {
      id: 'material-finishes',
      title: 'Substrate & Foil Shaders',
      description:
        'Physically simulate authentic packaging substrates including kraft board, corrugated flute, bleached white SBS, and metallic foil stamping.',
      badge: 'PBR Shaders'
    }
  ];

  // Visual Showcase Items
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'mailer-view',
      label: 'E-Commerce Mailer',
      badge: 'box-mailer',
      description:
        'Roll-End Tuck-Front (RETF) mailer box with self-locking dust flaps and reinforced side walls, engineered for premium unboxing experiences.',
      visual: (
        <div className="vs-box-preview-card">
          <div className="vs-box-preview-card__badge-row">
            <span className="vs-box-chip">box-mailer</span>
            <span className="vs-box-chip vs-box-chip--accent">Roll-End Tuck-Front</span>
          </div>
          <div className="vs-box-preview-card__visual">
            <img src="/images/box-hero-showcase.png" alt="VictorShell Mailer Box" className="vs-box-preview-card__img" loading="lazy" />
          </div>
          <div className="vs-box-preview-card__meta">
            <span className="vs-box-preview-card__title">E-Commerce Mailer Box</span>
            <span className="vs-box-preview-card__spec">Self-Locking Flaps · E-Flute Corrugated · 200×150×80mm</span>
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
        <div className="vs-box-preview-card">
          <div className="vs-box-preview-card__badge-row">
            <span className="vs-box-chip">box-tuck-end</span>
            <span className="vs-box-chip vs-box-chip--accent">Reverse Tuck Style</span>
          </div>
          <div className="vs-box-preview-card__visual">
            <img src="/images/box-type-tuck.png" alt="VictorShell Tuck End Box" className="vs-box-preview-card__img" loading="lazy" />
          </div>
          <div className="vs-box-preview-card__meta">
            <span className="vs-box-preview-card__title">Reverse Tuck End Carton</span>
            <span className="vs-box-preview-card__spec">Dual Tuck Closures · 18pt SBS Paperboard · 80×50×140mm</span>
          </div>
        </div>
      )
    },
    {
      id: 'rigid-view',
      label: 'Rigid Box Tray',
      badge: 'box-rigid',
      description:
        'Two-piece setup box with base tray and friction lid for premium luxury consumer electronics, jewelry, and gift packaging.',
      visual: (
        <div className="vs-box-preview-card">
          <div className="vs-box-preview-card__badge-row">
            <span className="vs-box-chip">box-rigid</span>
            <span className="vs-box-chip vs-box-chip--accent">Two-Piece Setup</span>
          </div>
          <div className="vs-box-preview-card__visual">
            <img src="/images/box-type-rigid.png" alt="VictorShell Rigid Box" className="vs-box-preview-card__img" loading="lazy" />
          </div>
          <div className="vs-box-preview-card__meta">
            <span className="vs-box-preview-card__title">Luxury Rigid Setup Box</span>
            <span className="vs-box-preview-card__spec">Heavy Chipboard · Embossed Linen Wrap · 180×120×45mm</span>
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

  // Center Hero Visual Showcase: 3D Box Preview + Transparent Interactive Hotspots + Right Customizer
  const heroVisual = (
    <div className="vs-box-hero-showcase" data-testid="box-hero-showcase">
      {/* Center 3D Box Preview Column */}
      <div className="vs-box-hero-stage__viewport">
        <div className="vs-box-hero-image-wrap">
          <img
            src="/images/box-hero-showcase.png"
            alt="VictorShell 3D Box Packaging Configurator - Custom Packaging Mailer Box"
            className="vs-box-hero-image"
            loading="eager"
          />

          {/* Transparent Interactive Hotspot for Floating Vertical Toolbar */}
          <div className="vs-box-hotspot-toolbar" role="toolbar" aria-label="3D Viewport Controls">
            <button
              type="button"
              className="vs-box-hotspot-btn"
              title="Rotate 3D View"
              aria-label="Rotate 3D View"
              onClick={() => {
                setActiveTool('rotate');
                showToast('3D Orbit Rotation Active');
              }}
            />
            <button
              type="button"
              className="vs-box-hotspot-btn"
              title="Pan 3D View"
              aria-label="Pan 3D View"
              onClick={() => {
                setActiveTool('pan');
                showToast('3D Pan Active');
              }}
            />
            <button
              type="button"
              className="vs-box-hotspot-btn"
              title="Zoom In"
              aria-label="Zoom In"
              onClick={() => {
                setActiveTool('zoom-in');
                showToast('Zoomed In');
              }}
            />
            <button
              type="button"
              className="vs-box-hotspot-btn"
              title="Zoom Out"
              aria-label="Zoom Out"
              onClick={() => {
                setActiveTool('zoom-out');
                showToast('Zoomed Out');
              }}
            />
            <button
              type="button"
              className="vs-box-hotspot-btn"
              title="Reset 3D Camera View"
              aria-label="Reset 3D Camera View"
              onClick={() => {
                setActiveTool('view');
                showToast('Camera View Reset');
              }}
            />
          </div>

          {/* Transparent Interactive Hotspot for Fullscreen Button */}
          <button
            type="button"
            className="vs-box-hotspot-fullscreen"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            aria-label="Toggle Fullscreen"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              showToast(isFullscreen ? 'Exited Fullscreen' : 'Entered Fullscreen');
            }}
          />

          {/* Transparent Interactive Hotspot for Bottom Thumbnail Carousel */}
          <div className="vs-box-hotspot-carousel" role="region" aria-label="Box Variations Carousel">
            <button
              type="button"
              className="vs-box-hotspot-carousel-arrow vs-box-hotspot-carousel-prev"
              title="Previous Variation"
              aria-label="Previous Box Variation"
              onClick={handlePrevThumb}
            />

            {thumbnails.map((thumb, idx) => (
              <button
                key={thumb.id}
                type="button"
                className={`vs-box-hotspot-carousel-item ${activeThumbIndex === idx ? 'is-active' : ''}`}
                title={thumb.label}
                aria-label={thumb.label}
                onClick={() => {
                  setActiveThumbIndex(idx);
                  setBoxType(thumb.boxType);
                  showToast(`Selected ${thumb.label}`);
                }}
              />
            ))}

            <button
              type="button"
              className="vs-box-hotspot-carousel-arrow vs-box-hotspot-carousel-next"
              title="Next Variation"
              aria-label="Next Box Variation"
              onClick={handleNextThumb}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Floating Glass Customizer Panel (Customize Your Box) */}
      <div className="vs-box-customizer-card" data-testid="box-customizer-card">
        <h3 className="vs-box-customizer-title">Customize Your Box</h3>

        {/* 4 Tabs: Style, Material, Print, Finishing */}
        <div className="vs-box-customizer-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'style'}
            className={`vs-box-tab-btn ${activeTab === 'style' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>Style</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'material'}
            className={`vs-box-tab-btn ${activeTab === 'material' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('material')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span>Material</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'print'}
            className={`vs-box-tab-btn ${activeTab === 'print' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('print')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Print</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'finishing'}
            className={`vs-box-tab-btn ${activeTab === 'finishing' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('finishing')}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Finishing</span>
          </button>
        </div>

        {/* Box Type Section with 4 Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <h4 className="vs-box-section-label">Box Type</h4>
          <div className="vs-box-type-grid">
            {boxTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`vs-box-type-card ${boxType === type.id ? 'is-active' : ''}`}
                onClick={() => {
                  setBoxType(type.id as any);
                  setActiveThumbIndex(type.thumbIdx);
                  showToast(`Switched to ${type.label}`);
                }}
              >
                <img src={type.img} alt={type.label} className="vs-box-type-img" />
                <span className="vs-box-type-name">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size (mm) Inputs: L 200, W 150, H 80 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <h4 className="vs-box-section-label">Size (mm)</h4>
          <div className="vs-box-dimensions-row">
            <div className="vs-box-dim-input-group">
              <span className="vs-box-dim-label">L</span>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) || 0 })}
                className="vs-box-dim-input"
                aria-label="Length in millimeters"
              />
            </div>
            <div className="vs-box-dim-input-group">
              <span className="vs-box-dim-label">W</span>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) || 0 })}
                className="vs-box-dim-input"
                aria-label="Width in millimeters"
              />
            </div>
            <div className="vs-box-dim-input-group">
              <span className="vs-box-dim-label">H</span>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) || 0 })}
                className="vs-box-dim-input"
                aria-label="Height in millimeters"
              />
            </div>
          </div>
        </div>

        {/* Material Selection Swatches: Cardboard, Kraft, Rigid, Corrugated, Luxury */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <h4 className="vs-box-section-label">Material</h4>
          <div className="vs-box-materials-row">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className={`vs-box-material-item ${material === mat.id ? 'is-active' : ''}`}
                onClick={() => {
                  setMaterial(mat.id as any);
                  showToast(`Selected ${mat.label} Material`);
                }}
              >
                <div
                  className="vs-box-material-swatch"
                  style={{
                    backgroundColor: mat.color,
                    background: mat.background || mat.color,
                    borderColor: mat.border
                  }}
                  title={mat.label}
                />
                <span className="vs-box-material-label">{mat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Update in 3D ↗ */}
        <button
          type="button"
          className="vs-box-update-btn"
          onClick={() => {
            showToast('Parametric Box Updated in 3D');
            onExploreDemo();
          }}
        >
          <span>Update in 3D</span>
          <span aria-hidden="true">↗</span>
        </button>

        {/* Optional Action Toast */}
        {toastMessage && (
          <div
            style={{
              position: 'absolute',
              bottom: '-36px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(23, 17, 38, 0.92)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(121, 0, 255, 0.25)',
              zIndex: 99
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ProductLandingTemplate
      productTitle="Box Configurator"
      productBadge="Box Configurator"
      productTagline="Real-time parametric folding, 2D vector decal projection, and production-ready dieline export."
      brandName="VictorShell™"
      brandLogo={
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7900FF, #A020F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(121, 0, 255, 0.3)'
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
      }
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel="Try Live Demo"
      exploreDemoHref={exploreDemoHref}
      navLinks={navLinks}
      className={`vs-box-landing-page ${className}`.trim()}
      heroProps={{
        title: (
          <>
            Design, Customize &amp;<br />
            Visualize Packaging<br />
            <span className="vs-gradient-text">in 3D</span>
          </>
        ),
        badge: (
          <span className="vs-box-hero-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>3D Box Packaging</span>
          </span>
        ) as any,
        description:
          'Create, customize and preview box packaging in real-time 3D with size, material, print and finishing options.',
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
        // 3 Technical Badges below CTAs matching reference
        techBadges: [
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            ),
            label: 'Real-Time',
            sublabel: '3D Preview'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            ),
            label: 'Custom',
            sublabel: 'Dimensions'
          },
          {
            icon: (
              <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--vs-primary, #7900FF)', letterSpacing: '-0.02em', lineHeight: '1' }}>
                HD
              </div>
            ),
            label: 'High-Quality',
            sublabel: 'Render'
          }
        ],
        // 4 Feature Cards at the bottom matching reference
        featureHighlights: [
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            ),
            title: 'Interactive 3D Preview',
            description: 'See your box design in real time with full 3D rotation and zoom.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            ),
            title: 'Fully Customizable',
            description: 'Change size, material, print and finishing with ease.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ),
            title: 'Production Ready',
            description: 'Create accurate, print-ready packaging designs.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            ),
            title: 'Multi-Use Packaging',
            description: 'Works for retail, eCommerce, subscription and gift boxes.'
          }
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
          'The VictorShell Box Configurator provides mathematical parametric modeling for commercial packaging. Every panel, dust flap, tuck tab, and glue joint is linked to length, width, and depth parameters for instant CAD precision.',
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
        ]
      }}
      featuresProps={{
        id: 'features',
        badge: 'Packaging Engineering',
        sectionTitle: 'Production-Grade Packaging Tools in Your Browser',
        sectionSubtitle: 'From initial dimensional concept to manufacturing-ready dielines without external CAD plugins.',
        layout: 'grid',
        columns: 3,
        features
      }}
      showcaseProps={{
        id: 'showcase',
        badge: 'Box Architectures',
        sectionTitle: 'Explore Industry Packaging Models',
        sectionSubtitle: 'Switch between e-commerce mailers, cosmetic tuck-end cartons, and retail counter display trays.',
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
    </ProductLandingTemplate>
  );
};
