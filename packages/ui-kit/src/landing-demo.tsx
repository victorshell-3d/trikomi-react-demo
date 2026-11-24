import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ProductLandingLayout,
  GlassPanel,
  Badge,
  Heading,
  Text,
  type VictorShellAccent,
  type LandingNavLink
} from '@trikomi/ui-kit';

const sampleNavLinks: LandingNavLink[] = [
  { id: 'overview', label: 'Overview', href: '#overview', active: true },
  { id: 'capabilities', label: 'Capabilities', href: '#capabilities' },
  { id: 'specs', label: 'Tech Specs', href: '#specs', badge: 'v1.0' },
  { id: 'docs', label: 'SDK Docs', href: '/docs/index.html', external: true }
];

function LandingSharedDemoApp() {
  const [activeTheme, setActiveTheme] = useState<VictorShellAccent>('violet');
  const [demoLaunchCount, setDemoLaunchCount] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string>('None');

  const handleExploreDemo = () => {
    setDemoLaunchCount((prev) => prev + 1);
    setLastAction('Explore Demo Triggered');
  };

  return (
    <div data-test-ready="landing-shared" data-active-theme={activeTheme}>
      <ProductLandingLayout
        productTitle="Platform Shared Studio"
        productBadge="Enterprise WebGPU"
        productTagline="Next-generation interactive 3D WebGPU visualization and customization engine."
        brandName="VictorShell"
        theme={activeTheme}
        onThemeChange={(theme) => {
          setActiveTheme(theme);
          setLastAction(`Theme changed to ${theme}`);
        }}
        onExploreDemo={handleExploreDemo}
        exploreDemoLabel="Explore Demo"
        navLinks={sampleNavLinks}
      >
        <section id="overview" style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="accent" size="medium" style={{ marginBottom: '1rem' }}>
              Task 22 Shared Architecture
            </Badge>
            <Heading level={1} style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
              Shared Landing Page Components
            </Heading>
            <Text tone="muted" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Universal Header, Navigation, Footer, and Layout components styled with the Frosted Glass design system and 3 accent themes for all seven individual product landing pages.
            </Text>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <GlassPanel elevation="ambient" radius="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>✨</div>
              <Heading level={3} style={{ marginBottom: '0.5rem' }}>Shared Header</Heading>
              <Text tone="muted" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                Sticky blurred glass header with product branding, desktop navigation, responsive mobile drawer toggle, theme switcher, and primary &quot;Explore Demo&quot; CTA.
              </Text>
            </GlassPanel>

            <GlassPanel elevation="ambient" radius="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🧭</div>
              <Heading level={3} style={{ marginBottom: '0.5rem' }}>Shared Navigation</Heading>
              <Text tone="muted" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                Semantic navigation supporting both horizontal desktop pills and vertical mobile drawer lists with active state indicator and keyboard accessibility.
              </Text>
            </GlassPanel>

            <GlassPanel elevation="ambient" radius="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🛡️</div>
              <Heading level={3} style={{ marginBottom: '0.5rem' }}>Shared Footer</Heading>
              <Text tone="muted" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                Multi-column footer layout with product tagline, engine status indicators, SDK links, copyright statement, and smooth back-to-top action.
              </Text>
            </GlassPanel>
          </div>

          {/* Interactive State Monitor */}
          <GlassPanel elevation="float" radius="card" style={{ padding: '1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Heading level={4} style={{ marginBottom: '0.5rem' }}>Demo State Monitor</Heading>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
              <div>
                <Text tone="muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Launch Count</Text>
                <div data-testid="launch-count" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{demoLaunchCount}</div>
              </div>
              <div>
                <Text tone="muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Active Accent</Text>
                <div data-testid="active-theme-name" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--vs-primary)' }}>{activeTheme}</div>
              </div>
              <div>
                <Text tone="muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Last Action</Text>
                <div data-testid="last-action" style={{ fontSize: '1rem', fontWeight: 600, marginTop: '6px' }}>{lastAction}</div>
              </div>
            </div>
          </GlassPanel>
        </section>
      </ProductLandingLayout>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<LandingSharedDemoApp />);
}
