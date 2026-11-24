import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('packages/ui-kit/src/components/landing/ViewerLandingPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add ConfidenceViewerMockup component before ViewerLandingPage component
const mockupComponentCode = `
/* --------------------------------------------------------------------------
   ConfidenceViewerMockup: Interactive 3D Viewer Interface Mockup matching Reference
   -------------------------------------------------------------------------- */
interface ConfidenceViewerMockupProps {
  themeMode?: 'light' | 'dark';
  onLaunchDemo?: (e?: React.MouseEvent) => void;
}

const ConfidenceViewerMockup: React.FC<ConfidenceViewerMockupProps> = ({
  themeMode = 'dark',
  onLaunchDemo
}) => {
  const [activeSwatch, setActiveSwatch] = useState<string>('purple');
  const [activeTool, setActiveTool] = useState<string>('iso');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const swatches = [
    { id: 'silver', name: 'Pearl Silver Chrome', className: 'tk-sphere-silver' },
    { id: 'purple', name: 'Metallic Violet', className: 'tk-sphere-purple' },
    { id: 'cyan', name: 'Electric Cyan', className: 'tk-sphere-cyan' },
    { id: 'gold', name: '24K Gold', className: 'tk-sphere-gold' },
    { id: 'copper', name: 'Rose Bronze', className: 'tk-sphere-copper' },
    { id: 'obsidian', name: 'Obsidian Slate', className: 'tk-sphere-obsidian' },
  ];

  return (
    <div className="tk-mockup-frame">
      {/* Left Vertical Toolbar Panel */}
      <div className="tk-mockup-toolbar">
        {/* Tool 1: Iso Box */}
        <button
          type="button"
          className={\`tk-mockup-tool-btn \${activeTool === 'iso' ? 'is-active' : ''}\`}
          onClick={() => setActiveTool('iso')}
          title="Isometric View"
          aria-label="Isometric View"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </button>
        {/* Tool 2: Orbit Box */}
        <button
          type="button"
          className={\`tk-mockup-tool-btn \${activeTool === 'orbit' ? 'is-active' : ''}\`}
          onClick={() => {
            setActiveTool('orbit');
            setIsRotating(prev => !prev);
          }}
          title="360° Orbit Rotation"
          aria-label="360° Orbit Rotation"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M21.17 8A10 10 0 0 0 3.83 8" />
            <path d="M2.83 16a10 10 0 0 0 17.34 0" />
          </svg>
        </button>
        {/* Tool 3: Wireframe */}
        <button
          type="button"
          className={\`tk-mockup-tool-btn \${activeTool === 'wire' ? 'is-active' : ''}\`}
          onClick={() => setActiveTool('wire')}
          title="Wireframe Mesh"
          aria-label="Wireframe Mesh"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
        </button>
        {/* Tool 4: Exploded */}
        <button
          type="button"
          className={\`tk-mockup-tool-btn \${activeTool === 'layers' ? 'is-active' : ''}\`}
          onClick={() => setActiveTool('layers')}
          title="Exploded Mesh Parts"
          aria-label="Exploded Mesh Parts"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </button>
        {/* Tool 5: Gear */}
        <button
          type="button"
          className={\`tk-mockup-tool-btn \${activeTool === 'gear' ? 'is-active' : ''}\`}
          onClick={() => setActiveTool('gear')}
          title="Settings & Parameters"
          aria-label="Settings & Parameters"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Main Viewport */}
      <div className="tk-mockup-main">
        {/* Navigation Bar: Back Chevron & Fullscreen Button */}
        <div className="tk-mockup-header">
          <button
            type="button"
            className="tk-mockup-ctrl-btn"
            title="Back / Reset View"
            aria-label="Back / Reset View"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="tk-mockup-ctrl-btn"
            onClick={onLaunchDemo}
            title="Launch Fullscreen 3D Studio"
            aria-label="Launch Fullscreen 3D Studio"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>

        {/* Center 3D Model Display */}
        <div className="tk-mockup-canvas-wrap" onClick={onLaunchDemo} title="Click to launch Interactive 3D Studio">
          <img
            src="/images/purple-knot-product.png"
            alt="Real-Time 3D Torus Knot Model"
            className={\`tk-mockup-3d-img \${isRotating ? 'is-animating' : ''} swatch-\${activeSwatch}\`}
          />
        </div>

        {/* Bottom Material / Color Swatches */}
        <div className="tk-mockup-swatches">
          {swatches.map((s) => (
            <button
              key={s.id}
              type="button"
              className={\`tk-mockup-sphere \${s.className} \${activeSwatch === s.id ? 'is-active' : ''}\`}
              onClick={() => setActiveSwatch(s.id)}
              title={s.name}
              aria-label={s.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
`;

const anchorPos = content.indexOf('export const ViewerLandingPage: React.FC<ViewerLandingPageProps>');
if (anchorPos === -1) {
  console.error('Could not find ViewerLandingPage declaration anchor');
  process.exit(1);
}

content = content.slice(0, anchorPos) + mockupComponentCode + '\n' + content.slice(anchorPos);

// 2. Replace the old tk-experience-section with the new 3-part tk-confidence-section
const oldSection = `      {/* ----------------------------------------------------------------------
          5. Real-Time 3D Experience Section
             - Clean 3D Visual on the LEFT (zero text baked in)
             - Real HTML text (Badge, Heading, Description, CTA) on the RIGHT
             - Interactive 3D Studio workstation with PBR swatches
          ---------------------------------------------------------------------- */}
      <section className="tk-experience-section" id="experience">
        <div className="tk-container">
          <div className="tk-experience-grid">
            {/* Left Column: Clean 3D Visual (Zero Text) */}
            <div className="tk-experience-left">
              <div className="tk-experience-visual-card">
                <img
                  src="/images/viewer-clean-3d-visual.png"
                  alt="Real-Time 3D Torus Rendering on Terrain"
                  className="tk-experience-visual-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Real HTML Text + CTA Button + Interactive Studio */}
            <div className="tk-experience-right">
              <div className="tk-badge">REAL-TIME 3D EXPERIENCE</div>
              <h2 className="tk-section-title tk-experience-title">
                Configure with<br />
                <span className="tk-gradient-text">Confidence</span>
              </h2>
              <p className="tk-section-subtitle tk-experience-desc">
                Give your customers the power to explore, personalize and experience products in stunning 3D — in real time.
              </p>
              <div className="tk-experience-btn-wrap">
                <button
                  type="button"
                  className="tk-btn-primary"
                  onClick={handleLaunchDemo}
                  data-testid="experience-try-live-demo-btn"
                >
                  <span>Try Live Demo →</span>
                </button>
              </div>

              {/* Commercial Interactive 3D Viewer Studio Panel */}
              <div className="tk-experience-studio-wrap">
                <ViewerPreviewStudio
                  themeMode={activeMode}
                  onLaunchDemo={handleLaunchDemo}
                />
              </div>
            </div>
          </div>
        </div>
      </section>`;

const newSection = `      {/* ----------------------------------------------------------------------
          5. Configure with Confidence Section (PROMPT 26: 3-Part Composition)
             - LEFT (35%): Large glowing 3D Torus Knot with mountain landscape
             - CENTER (25%): Badge, Heading, Description, Angular CTA Button
             - RIGHT (40%): 3D Viewer interface preview with toolbar & swatches
          ---------------------------------------------------------------------- */}
      <section className="tk-confidence-section tk-experience-section" id="experience">
        <div className="tk-container">
          <div className="tk-confidence-inner">
            {/* Left Column (35%): 3D Torus Knot + Mountains Artwork */}
            <div className="tk-confidence-left">
              <img
                src="/images/viewer-confidence-knot.png"
                alt="3D Metallic Torus Knot on Mountain Landscape"
                className="tk-confidence-artwork"
                loading="lazy"
              />
            </div>

            {/* Center Column (25%): Badge, Heading, Description, CTA */}
            <div className="tk-confidence-center">
              <div className="tk-confidence-badge">REAL-TIME 3D EXPERIENCE</div>
              <h2 className="tk-confidence-title">
                Configure with<br />
                <span className="tk-gradient-confidence">Confidence</span>
              </h2>
              <p className="tk-confidence-desc">
                Give your customers the power to explore, personalize and experience products in stunning 3D — in real time.
              </p>
              <div className="tk-confidence-actions">
                <button
                  type="button"
                  className="tk-confidence-btn"
                  onClick={handleLaunchDemo}
                  data-testid="experience-try-live-demo-btn"
                >
                  <span>Try Live Demo</span>
                  <span className="tk-btn-arrow">→</span>
                </button>
              </div>
            </div>

            {/* Right Column (40%): 3D Viewer Interface Preview Mockup */}
            <div className="tk-confidence-right">
              <ConfidenceViewerMockup
                themeMode={activeMode}
                onLaunchDemo={handleLaunchDemo}
              />
            </div>
          </div>
        </div>
      </section>`;

if (!content.includes(oldSection)) {
  console.error('Could not find oldSection in ViewerLandingPage.tsx');
  process.exit(1);
}

content = content.replace(oldSection, newSection);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated ViewerLandingPage.tsx with 3-part Configure with Confidence layout!');
