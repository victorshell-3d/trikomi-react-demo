import { useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Accordion,
  Alert,
  AvatarStack,
  Badge,
  Button,
  Caption,
  Checkbox,
  CheckboxGroup,
  ContentContainer,
  ContentPanel,
  ConfiguratorDock,
  DataChecklist,
  DataTable,
  Divider,
  DockDivider,
  DockItem,
  Dropdown,
  Drawer,
  EmailInput,
  ElevatedPanel,
  Flex,
  FluidContainer,
  Form,
  FormField,
  FormLayout,
  FloatingLabelInput,
  GlassPanel,
  Grid,
  GridItem,
  Heading,
  HotspotMarker,
  Icon,
  IconButton,
  Inline,
  InputAddon,
  InputGroup,
  Label,
  MaterialSwatchGroup,
  MocapCaptureBar,
  Modal,
  NavigationRail,
  NumberInput,
  OrbitalControls,
  PageContainer,
  Pagination,
  PasswordInput,
  Popover,
  Radio,
  RadioGroup,
  RangeSlider,
  SearchInput,
  SegmentedControl,
  SectionContainer,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  StatusIndicator,
  SurfaceContainer,
  SurfacePanel,
  Switch,
  Tabs,
  Text,
  TextInput,
  Textarea,
  ToastProvider,
  Tooltip,
  TourSceneSwitcher,
  UploadDropzone,
  VictorShellThemeProvider,
  useToast,
  useVictorShellTheme,
  type DataTableColumn,
  type DropdownGroup,
  type MaterialSwatchOption,
  type NavigationRailOption,
  type OrbitalMode,
  type SegmentedControlOption
} from '@trikomi/ui-kit';

interface AssetRow {
  id: string;
  asset: string;
  category: string;
  polygons: number;
  status: 'Ready' | 'Processing';
}

const dropdownGroups: DropdownGroup[] = [{
  label: 'Project actions',
  options: [
    { value: 'duplicate', label: 'Duplicate project' },
    { value: 'export', label: 'Export asset', shortcut: '⌘E' },
    { value: 'archive', label: 'Archive project', danger: true }
  ]
}];

const tabs = [
  { value: 'overview', label: 'Overview', content: <Text>Reusable components, shared tokens, and accessible interactions in one package.</Text> },
  { value: 'usage', label: 'Usage', content: <Text>Import from <code>@trikomi/ui-kit</code> and load <code>@trikomi/ui-kit/styles.css</code> once.</Text> }
];

const themeOptions: SegmentedControlOption[] = [
  { value: 'violet', label: 'Royal Violet' },
  { value: 'indigo', label: 'Electric Indigo' },
  { value: 'orchid', label: 'Orchid Glow' }
];

const demoSections = [
  { id: 'foundations', label: 'Foundations & Design Tokens' },
  { id: 'typography', label: 'Typography & Icons' },
  { id: 'layout', label: 'Layout Components' },
  { id: 'buttons', label: 'Buttons & Orbital Controls' },
  { id: 'popovers', label: 'Dropdowns, Popovers & Tooltips' },
  { id: 'selection', label: 'Checkbox, Radio & Switch' },
  { id: 'tabs', label: 'Tabs & Navigation Rails' },
  { id: 'configurator', label: 'Configurator Docks, Swatches & Hotspots' },
  { id: 'forms', label: 'Forms, Inputs & Validation' },
  { id: 'uploads', label: 'Upload Components & Sliders' },
  { id: 'data', label: 'Data Display, Tables & Pagination' },
  { id: 'alerts', label: 'Alerts & Notifications' },
  { id: 'overlays', label: 'Modals, Drawers & Accordions' }
] as const;

const captureModes: SegmentedControlOption[] = [
  { value: 'studio', label: 'Studio' },
  { value: 'ar', label: 'AR' },
  { value: '360', label: '360°' }
];

const railOptions: NavigationRailOption[] = [
  { value: 'product', label: 'Product', icon: <Icon><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></Icon> },
  { value: 'materials', label: 'Materials', icon: <Icon><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" /></Icon> },
  { value: 'settings', label: 'Settings', icon: <Icon><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.9Z" /></Icon> }
];

const sceneOptions: SegmentedControlOption[] = [
  { value: 'studio', label: 'Studio' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'outdoor', label: 'Outdoor' }
];

const materialOptions: MaterialSwatchOption[] = [
  { value: 'violet', label: 'Violet glass', background: 'radial-gradient(circle at 30% 25%, #E9D5FF, #7C3AED 58%, #2E1065)' },
  { value: 'silver', label: 'Brushed silver', background: 'linear-gradient(135deg, #F8FAFC, #94A3B8 52%, #E2E8F0)' },
  { value: 'rose', label: 'Rose metal', background: 'linear-gradient(135deg, #FBCFE8, #BE185D 55%, #831843)' },
  { value: 'carbon', label: 'Carbon', background: 'repeating-linear-gradient(45deg, #1F2937, #1F2937 3px, #374151 3px, #374151 6px)' }
];

const assetRows: AssetRow[] = [
  { id: 'ring', asset: 'Solitaire Halo Ring', category: 'Jewelry', polygons: 92450, status: 'Ready' },
  { id: 'frame', asset: 'Arc Optical Frame', category: 'Eyewear', polygons: 31800, status: 'Ready' },
  { id: 'sneaker', asset: 'Aero Runner', category: 'Footwear', polygons: 58700, status: 'Processing' }
];

const assetColumns: DataTableColumn<AssetRow>[] = [
  { id: 'asset', header: 'Asset', value: (row) => row.asset, sortable: true },
  { id: 'category', header: 'Category', value: (row) => row.category, sortable: true },
  {
    id: 'polygons',
    header: 'Polygons',
    value: (row) => row.polygons,
    render: (row) => <span className="vs-data-table__mono">{row.polygons.toLocaleString()}</span>,
    sortable: true
  },
  {
    id: 'status',
    header: 'Status',
    value: (row) => row.status,
    render: (row) => (
      <StatusIndicator
        status={row.status === 'Ready' ? 'success' : 'warning'}
        label={row.status}
      />
    )
  }
];

const checklistItems = [
  { id: 'geometry', label: 'Geometry optimized', complete: true },
  { id: 'materials', label: 'Materials assigned', complete: true },
  { id: 'preview', label: 'Preview rendered', complete: false }
];

const collaborators = [
  { id: 'maya', label: 'Maya', initials: 'M' },
  { id: 'lee', label: 'Lee', initials: 'L' },
  { id: 'ari', label: 'Ari', initials: 'A' }
];

const accordionItems = [
  { id: 'tokens', title: 'Shared design tokens', content: <Text>Theme accents are provided by one theme root and inherited through CSS custom properties.</Text> },
  { id: 'composition', title: 'Composable interactions', content: <Text>Use the public components together while keeping application state in the consuming React app.</Text> }
];

function ThemeControls() {
  const { accent, setAccent } = useVictorShellTheme();

  return (
    <div className="demo-theme-controls">
      <Caption>Theme</Caption>
      <SegmentedControl
        className="demo-theme-switcher"
        data-testid="theme-switcher"
        label="Color theme"
        options={themeOptions}
        value={accent}
        onValueChange={(value) => {
          if (value === 'violet' || value === 'indigo' || value === 'orchid') {
            setAccent(value);
          }
        }}
      />
    </div>
  );
}

function DemoSectionNavigation() {
  return (
    <nav className="demo-nav" aria-label="UI Kit sections">
      <ol>
        {demoSections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SectionTitle({
  id,
  eyebrow,
  title,
  description
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="demo-section-title">
      <span className="demo-eyebrow">{eyebrow}</span>
      <Heading level={2} id={id}>{title}</Heading>
      <Text tone="muted">{description}</Text>
    </header>
  );
}

function IntegrationDemo() {
  const showToast = useToast();
  const [orbitalMode, setOrbitalMode] = useState<OrbitalMode>('3d');
  const [recording, setRecording] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [sliderValue, setSliderValue] = useState(64);
  const [alertOpen, setAlertOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [quality, setQuality] = useState('balanced');
  const [autoRotate, setAutoRotate] = useState(true);
  const [previewMode, setPreviewMode] = useState('3d');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCapture, setActiveCapture] = useState('studio');
  const [activeTool, setActiveTool] = useState('product');
  const [activeScene, setActiveScene] = useState('studio');
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(['tokens']);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    showToast('Configuration saved.');
  };

  return (
    <PageContainer className="demo-page">
      <div className="demo-shell">
        <aside className="demo-sidebar">
          <span className="demo-eyebrow">Component library</span>
          <Heading level={3}>Browse sections</Heading>
          <DemoSectionNavigation />
          <Text variant="small" tone="muted">13 interactive modules built from the shared React component package.</Text>
        </aside>
        <div className="demo-main">
      <header className="demo-header">
        <a className="demo-brand" href="#top" aria-label="VictorShell UI Kit home">
          <span className="demo-brand-mark" aria-hidden="true">V</span>
          <span><strong>VictorShell</strong><small>React UI Kit</small></span>
        </a>
        <ThemeControls />
        <details className="demo-mobile-nav">
          <summary>
            <span>Browse all 13 sections</span>
            <Icon size={16} aria-hidden="true"><polyline points="6 9 12 15 18 9" /></Icon>
          </summary>
          <DemoSectionNavigation />
        </details>
      </header>

      <main id="top">
        <section className="demo-hero">
          <span className="demo-eyebrow">Component library / Integration demo</span>
          <Heading level={1}>Frosted Glass UI Kit</Heading>
          <Text tone="muted">A working showcase of shared React components, design tokens, and interactions for configurator applications.</Text>
          <div className="demo-hero-meta">
            <Badge variant="accent">React component library</Badge>
            <StatusIndicator status="success" label="Theme-aware" />
          </div>
        </section>

        <div className="demo-content">
          <section id="foundations" className="demo-section" aria-labelledby="foundations-title">
            <SectionTitle
              id="foundations-title"
              eyebrow="01 / 13 · Foundations"
              title="Foundations & Design Tokens"
              description="Shared theme variables drive accent colors, glass surfaces, typography, and elevation throughout the package."
            />
            <Grid columns={{ base: 1, md: 2 }} className="demo-token-grid">
              {[
                { label: 'Accent gradient', variable: '--vs-primary-gradient' },
                { label: 'Strong glass', variable: '--vs-glass-strong' },
                { label: 'Tonal surface', variable: '--vs-tonal-lavender' },
                { label: 'Primary ink', variable: '--vs-ink' }
              ].map((token) => (
                <SurfaceContainer key={token.variable} variant="strong" className="demo-token-card">
                  <span
                    className="demo-token-swatch"
                    style={{ background: `var(${token.variable})` }}
                    aria-hidden="true"
                  />
                  <span>
                    <strong>{token.label}</strong>
                    <Text variant="mono" tone="muted">{token.variable}</Text>
                  </span>
                </SurfaceContainer>
              ))}
            </Grid>
            <GlassPanel className="demo-card">
              <Heading level={3}>Semantic status and accent</Heading>
              <Inline className="demo-foundation-examples">
                <Badge>Draft</Badge>
                <Badge variant="accent">Theme accent</Badge>
                <StatusIndicator status="success" label="Synced" />
                <StatusIndicator status="warning" label="Review recommended" />
                <StatusIndicator status="info" label="Theme-aware" />
              </Inline>
              <Divider />
              <Text variant="small" tone="muted">Spacing, radii, blur, shadows, and font families are shared CSS custom properties.</Text>
            </GlassPanel>
          </section>

          <section id="typography" className="demo-section" aria-labelledby="typography-title">
            <SectionTitle
              id="typography-title"
              eyebrow="02 / 13 · Type & iconography"
              title="Typography & Icons"
              description="Use the exported type hierarchy, tones, labels, captions, and scalable SVG icon primitive."
            />
            <Grid columns={{ base: 1, md: 2 }} className="demo-showcase-grid">
              <ContentPanel className="demo-card">
                <Heading level={3}>Type hierarchy</Heading>
                <Heading level={2} variant="display">Display heading</Heading>
                <Heading level={3}>Section heading</Heading>
                <Heading level={4} tone="accent">Accent subheading</Heading>
                <Text>Body copy uses the shared sans-serif family and readable line-height.</Text>
                <Text variant="small" tone="muted">Supporting information is smaller and lower contrast.</Text>
                <Text variant="mono">--vs-primary · 0.875rem</Text>
                <Label tone="accent">FIELD LABEL</Label>
                <Caption>Caption · secondary details and metadata</Caption>
              </ContentPanel>
              <SurfacePanel variant="stage" className="demo-card demo-icon-card">
                <Heading level={3}>Icons scale with their context</Heading>
                <Inline className="demo-icon-examples">
                  <Icon aria-label="Package layers" size={20}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></Icon>
                  <Icon aria-label="Materials" size={24}><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" /></Icon>
                  <Icon aria-label="Settings" size={28}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a7.5 7.5 0 0 0 0-6l1.5-1.2-1.5-2.6-1.9.7a7.5 7.5 0 0 0-5.1-1.5L12 2h-3l-.4 2.4a7.5 7.5 0 0 0-2.5 1.5l-2-.7-1.5 2.6L4.1 9a7.5 7.5 0 0 0 0 6l-1.5 1.2 1.5 2.6 2-.7a7.5 7.5 0 0 0 2.5 1.5L9 22h3l.4-2.4a7.5 7.5 0 0 0 2.5-1.5l2 .7 1.5-2.6L19.4 15Z" /></Icon>
                </Inline>
                <Text variant="small" tone="muted">Icon is a reusable SVG wrapper; pass paths and an accessible name when meaningful.</Text>
              </SurfacePanel>
            </Grid>
          </section>

          <section id="layout" className="demo-section" aria-labelledby="layout-title">
            <SectionTitle
              id="layout-title"
              eyebrow="03 / 13 · Containers & surfaces"
              title="Layout Components"
              description="Compose responsive containers, grids, flex rows, stacks, and frosted surface variants."
            />
            <SectionContainer className="demo-layout-samples">
              <Grid columns={{ base: 1, md: 2 }} className="demo-showcase-grid">
                <ContentPanel className="demo-card">
                  <Heading level={3}>Content and fluid containers</Heading>
                  <ContentContainer className="demo-layout-inset">
                    <Text variant="small">ContentContainer constrains reading width.</Text>
                  </ContentContainer>
                  <FluidContainer className="demo-layout-inset">
                    <Text variant="small">FluidContainer uses the available width.</Text>
                  </FluidContainer>
                </ContentPanel>
                <ElevatedPanel className="demo-card">
                  <Heading level={3}>Surface hierarchy</Heading>
                  <GlassPanel className="demo-layout-inset">
                    <Text variant="small">GlassPanel · ambient elevation</Text>
                  </GlassPanel>
                  <SurfacePanel variant="strong" padding="var(--vs-space-3)">
                    <Text variant="small">SurfacePanel · strong variant</Text>
                  </SurfacePanel>
                  <SurfaceContainer variant="stage" className="demo-layout-inset">
                    <Text variant="small">SurfaceContainer · stage variant</Text>
                  </SurfaceContainer>
                </ElevatedPanel>
              </Grid>
              <Grid columns={{ base: 1, md: 2 }} className="demo-layout-primitives">
                <GridItem span="full" className="demo-layout-grid-item">
                  <Flex gap="var(--vs-space-3)" align="center" wrap="wrap">
                    <Badge variant="accent">Flex</Badge>
                    <Text variant="small">Responsive direction, alignment, gap, and wrapping.</Text>
                    <Spacer />
                    <Button size="small" variant="outline">Action</Button>
                  </Flex>
                </GridItem>
                <GridItem className="demo-layout-grid-item">
                  <Stack gap="var(--vs-space-2)">
                    <Text variant="small">Stack arranges content vertically.</Text>
                    <Inline><Badge>Inline</Badge><Badge variant="accent">Wrap-ready</Badge></Inline>
                  </Stack>
                </GridItem>
                <GridItem className="demo-layout-grid-item">
                  <Text variant="small">GridItem supports responsive column spans.</Text>
                </GridItem>
              </Grid>
            </SectionContainer>
          </section>

          <section id="buttons" className="demo-section" aria-labelledby="buttons-title">
            <SectionTitle
              id="buttons-title"
              eyebrow="04 / 13 · Actions"
              title="Buttons & Orbital Controls"
              description="Compare button variants and sizes, then change the active viewport and capture state."
            />
            <GlassPanel className="demo-card">
              <Heading level={3}>Button variants and states</Heading>
              <Inline className="demo-button-samples">
                <Button onClick={() => showToast('Primary action selected.')}>Primary</Button>
                <Button variant="gradient">Gradient</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="tonal">Tonal</Button>
                <Button variant="ghost">Ghost</Button>
                <Button disabled>Disabled</Button>
                <IconButton label="Show notification" size="small" onClick={() => showToast('Icon button activated.')}>
                  <Icon><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></Icon>
                </IconButton>
              </Inline>
              <Inline className="demo-button-sizes">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </Inline>
              <Divider />
              <Heading level={3}>Viewport and capture</Heading>
              <OrbitalControls value={orbitalMode} onValueChange={setOrbitalMode} aria-label="Preview mode" />
              <Text variant="caption" tone="muted">Active viewport: {orbitalMode.toUpperCase()}</Text>
              <MocapCaptureBar
                recording={recording}
                onRecordingChange={setRecording}
                onSnapshot={() => showToast('Snapshot captured.')}
                onPause={() => showToast('Capture paused.')}
              />
            </GlassPanel>
          </section>

          <section id="popovers" className="demo-section" aria-labelledby="popovers-title">
            <SectionTitle
              id="popovers-title"
              eyebrow="05 / 13 · Floating controls"
              title="Dropdowns, Popovers & Tooltips"
              description="Open the action menu, reveal a contextual panel, or focus the tooltip trigger with a keyboard."
            />
            <GlassPanel className="demo-card">
              <Heading level={3}>Menus and contextual help</Heading>
              <Inline className="demo-floating-examples">
                <Dropdown
                  label="Project actions"
                  groups={dropdownGroups}
                  onSelect={(option) => showToast(`${option.label} selected.`)}
                />
                <Popover
                  label="Quick project details"
                  triggerLabel="Open project details"
                  triggerContent="Project details"
                >
                  <Heading level={4}>Northstar eyewear</Heading>
                  <Text variant="small" tone="muted">Updated moments ago · 3 collaborators</Text>
                </Popover>
                <Tooltip content="Tooltips also appear when this control receives keyboard focus.">
                  {(triggerProps) => <Button variant="tonal" {...triggerProps}>Hover or focus</Button>}
                </Tooltip>
              </Inline>
            </GlassPanel>
          </section>

          <section id="selection" className="demo-section" aria-labelledby="selection-title">
            <SectionTitle
              id="selection-title"
              eyebrow="06 / 13 · Selection controls"
              title="Checkbox, Radio & Switch"
              description="Explore labeled native controls, descriptions, grouped choices, and controlled state."
            />
            <Grid columns={{ base: 1, md: 2 }} className="demo-showcase-grid">
              <ContentPanel className="demo-card">
                <Heading level={3}>Checkbox and radio</Heading>
                <Checkbox
                  label="Snap to grid"
                  description="Align changes to the nearest guide."
                  checked={snapToGrid}
                  onChange={(event) => setSnapToGrid(event.currentTarget.checked)}
                />
                <Radio
                  label="3D preview"
                  name="preview-mode"
                  value="3d"
                  checked={previewMode === '3d'}
                  onChange={(event) => setPreviewMode(event.currentTarget.value)}
                />
                <Radio
                  label="AR preview"
                  name="preview-mode"
                  value="ar"
                  checked={previewMode === 'ar'}
                  onChange={(event) => setPreviewMode(event.currentTarget.value)}
                />
                <Text variant="small" tone="muted">Preview mode: {previewMode.toUpperCase()}</Text>
                <CheckboxGroup
                  legend="Rendering options"
                  defaultValue={['shadows']}
                  options={[
                    { value: 'shadows', label: 'Soft shadows' },
                    { value: 'reflections', label: 'Floor reflections' }
                  ]}
                />
              </ContentPanel>
              <ElevatedPanel className="demo-card">
                <Heading level={3}>Radio group and switch</Heading>
                <RadioGroup
                  legend="Render quality"
                  name="demo-quality"
                  value={quality}
                  onChange={setQuality}
                  options={[
                    { value: 'balanced', label: 'Balanced' },
                    { value: 'high', label: 'High detail' }
                  ]}
                />
                <Switch
                  label="Auto-rotate preview"
                  checked={autoRotate}
                  onChange={(event) => setAutoRotate(event.currentTarget.checked)}
                />
                <Text variant="small" tone="muted">Quality: {quality} · Auto-rotate: {autoRotate ? 'on' : 'off'}</Text>
              </ElevatedPanel>
            </Grid>
          </section>

          <section id="tabs" className="demo-section" aria-labelledby="tabs-title">
            <SectionTitle
              id="tabs-title"
              eyebrow="07 / 13 · Navigation controls"
              title="Tabs & Navigation Rails"
              description="Switch content with tabs, choose a segmented mode, and navigate tools using the keyboard."
            />
            <Grid columns={{ base: 1, md: 2 }} className="demo-showcase-grid">
              <ContentPanel className="demo-card">
                <Heading level={3}>Tabs and segmented choices</Heading>
                <Tabs label="Demo panels" options={tabs} value={activeTab} onValueChange={setActiveTab} />
                <SegmentedControl
                  label="Capture destination"
                  options={captureModes}
                  value={activeCapture}
                  onValueChange={setActiveCapture}
                />
                <Text variant="small" tone="muted">Capture destination: {activeCapture.toUpperCase()}</Text>
              </ContentPanel>
              <SurfacePanel variant="glass" className="demo-card">
                <Heading level={3}>Product setup rail</Heading>
                <NavigationRail
                  label="Product setup"
                  options={railOptions}
                  value={activeTool}
                  onValueChange={setActiveTool}
                />
                <Text variant="small" tone="muted">Active tool: {activeTool}</Text>
              </SurfacePanel>
            </Grid>
          </section>

          <section id="configurator" className="demo-section" aria-labelledby="configurator-title">
            <SectionTitle
              id="configurator-title"
              eyebrow="08 / 13 · 3D configurator controls"
              title="Configurator Docks, Swatches & Hotspots"
              description="Dock actions, material selection, scene switching, and an interactive hotspot are ready to compose."
            />
            <GlassPanel className="demo-card demo-configurator">
              <ConfiguratorDock label="Material configurator">
                <DockItem label="Finish" icon={<span className="demo-swatch-icon" aria-hidden="true" />} onClick={() => showToast('Finish controls selected.')} />
                <DockDivider />
                <DockItem label="Lighting" icon={<Icon><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></Icon>} onClick={() => showToast('Lighting controls selected.')} />
              </ConfiguratorDock>
              <MaterialSwatchGroup
                title="Material finish"
                options={materialOptions}
                defaultValue="violet"
                onSelect={(option) => showToast(`${option.label} selected.`)}
              />
              <div className="demo-scene-row">
                <div>
                  <Heading level={4}>360° scene</Heading>
                  <Text variant="small" tone="muted">Move between preview environments.</Text>
                </div>
                <TourSceneSwitcher
                  label="Preview scene"
                  options={sceneOptions}
                  value={activeScene}
                  onValueChange={setActiveScene}
                />
              </div>
              <div className="demo-hotspot-stage">
                <span>Interactive product preview area</span>
                <HotspotMarker label="Material hotspot: polished violet glass" onActivate={() => showToast('Material hotspot activated.')} />
              </div>
            </GlassPanel>
          </section>

          <section id="forms" className="demo-section" aria-labelledby="forms-title">
            <SectionTitle
              id="forms-title"
              eyebrow="09 / 13 · Form controls"
              title="Forms, Inputs & Validation"
              description="Use labeled inputs, validation rules, helper text, and success feedback in a real form."
            />
            <ContentPanel className="demo-card">
              <Form onSubmit={handleSubmit}>
                <FormLayout>
                  <FormField label="Project name" required helperText="Choose a name for this configuration." rules={{ minLength: { value: 3, message: 'Enter at least 3 characters.' } }}>
                    <TextInput name="projectName" placeholder="Northstar frame" />
                  </FormField>
                  <FormField label="Email" required successMessage="Email format looks good." rules={{ email: true }}>
                    <EmailInput name="email" placeholder="studio@example.com" />
                  </FormField>
                  <FormField label="Access password">
                    <PasswordInput name="password" placeholder="Enter password" />
                  </FormField>
                  <FormField label="Quantity" rules={{ min: { value: 1, message: 'Quantity must be at least one.' }, max: 30 }}>
                    <NumberInput name="quantity" min={1} max={30} defaultValue={4} />
                  </FormField>
                  <FormField label="External model URL">
                    <InputGroup label="Model URL">
                      <InputAddon>https://</InputAddon>
                      <TextInput name="modelUrl" placeholder="models.example.com/item" />
                    </InputGroup>
                  </FormField>
                  <FloatingLabelInput label="Search library" name="librarySearch" placeholder=" " />
                  <FormField label="Notes">
                    <Textarea name="notes" rows={3} placeholder="Add configuration notes..." />
                  </FormField>
                  <FormField label="Search components">
                    <SearchInput name="componentSearch" placeholder="Search..." shortcut={null} />
                  </FormField>
                </FormLayout>
                <div className="demo-form-actions">
                  <Button type="submit">Save configuration</Button>
                  {submitted && <StatusIndicator status="success" label="Saved" />}
                </div>
              </Form>
            </ContentPanel>
          </section>

          <section id="uploads" className="demo-section" aria-labelledby="uploads-title">
            <SectionTitle
              id="uploads-title"
              eyebrow="10 / 13 · Files & ranges"
              title="Upload Components & Sliders"
              description="Select or drop a local file and adjust range inputs. No server upload is performed."
            />
            <Grid columns={{ base: 1, md: 2 }} className="demo-showcase-grid">
              <ContentPanel className="demo-card">
                <Heading level={3}>Client-side file selection</Heading>
                <UploadDropzone
                  label="Drop a 3D model or texture"
                  description="Supports GLB, USDZ, OBJ, and PNG · up to 25 MB"
                  accept=".glb,.usdz,.obj,.png"
                  maxSize={25 * 1024 * 1024}
                  onFileChange={(file) => setSelectedFileName(file?.name ?? '')}
                />
                <StatusIndicator
                  status={selectedFileName ? 'success' : 'info'}
                  label={selectedFileName ? `Selected locally: ${selectedFileName}` : 'No file selected'}
                />
              </ContentPanel>
              <ElevatedPanel className="demo-card">
                <Heading level={3}>Range controls</Heading>
                <FormField label={`Rotation · ${sliderValue}°`}>
                  <RangeSlider
                    name="rotation"
                    min={0}
                    max={180}
                    step={5}
                    value={sliderValue}
                    onChange={(event) => setSliderValue(Number(event.currentTarget.value))}
                    formatValue={(value) => `${value}°`}
                  />
                </FormField>
                <FormField label="Quality preset">
                  <RangeSlider
                    name="qualityPreset"
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={3}
                    formatValue={(value) => ['Draft', 'Preview', 'Balanced', 'High', 'Ultra'][value - 1]}
                  />
                </FormField>
              </ElevatedPanel>
            </Grid>
          </section>

          <section id="data" className="demo-section" aria-labelledby="data-title">
            <SectionTitle
              id="data-title"
              eyebrow="11 / 13 · Data & tables"
              title="Data Display, Tables & Pagination"
              description="Searchable, sortable table rows work alongside checklist, avatar, loading, and pagination components."
            />
            <GlassPanel className="demo-card">
              <DataTable
                label="Configurator asset library"
                columns={assetColumns}
                rows={assetRows}
                getRowKey={(row) => row.id}
              />
              <Pagination totalPages={8} page={activePage} onPageChange={setActivePage} />
              <div className="demo-data-grid">
                <DataChecklist title="Publish checklist" items={checklistItems} />
                <ElevatedPanel className="demo-data-meta">
                  <AvatarStack label="Studio collaborators" collaborators={collaborators} remainingCount={2} />
                  <div className="demo-inline">
                    <Spinner label="Rendering preview" />
                    <span>Rendering preview</span>
                  </div>
                  <div className="demo-skeleton-row" aria-busy="true" aria-label="Loading asset metadata">
                    <Skeleton width="44px" height="44px" />
                    <span><Skeleton width="180px" height="12px" /><Skeleton width="130px" height="10px" /></span>
                  </div>
                </ElevatedPanel>
              </div>
            </GlassPanel>
          </section>

          <section id="alerts" className="demo-section" aria-labelledby="alerts-title">
            <SectionTitle
              id="alerts-title"
              eyebrow="12 / 13 · Feedback"
              title="Alerts & Notifications"
              description="See semantic alert variants and trigger live toast notifications with the shared provider."
            />
            <GlassPanel className="demo-card">
              <div className="demo-alert-stack">
                {alertOpen && (
                  <Alert
                    variant="info"
                    title="Configuration ready"
                    description="Your current settings can be previewed or exported."
                    onDismiss={() => setAlertOpen(false)}
                  />
                )}
                <Alert variant="success" title="Asset synced" description="The latest material settings are saved." dismissible={false} />
                <Alert variant="warning" title="Preview note" description="High-detail materials may take longer to render." dismissible={false} />
                <Alert variant="error" title="Action required" description="Review the required project fields before publishing." dismissible={false} />
              </div>
              <Inline>
                <Button data-testid="demo-toast-trigger" onClick={() => showToast('Live UI Kit notification.')}>Show notification</Button>
                <Button variant="tonal" disabled={alertOpen} onClick={() => setAlertOpen(true)}>Restore info alert</Button>
              </Inline>
            </GlassPanel>
          </section>

          <section id="overlays" className="demo-section" aria-labelledby="overlays-title">
            <SectionTitle
              id="overlays-title"
              eyebrow="13 / 13 · Dialogs & disclosure"
              title="Modals, Drawers & Accordions"
              description="Open accessible overlays and expand multiple informational panels."
            />
            <GlassPanel className="demo-card">
              <div className="demo-inline">
                <Button data-testid="demo-modal-open" variant="glass" onClick={() => setModalOpen(true)}>Open modal</Button>
                <Button data-testid="demo-drawer-open" variant="outline" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
              </div>
              <Accordion
                label="Integration notes"
                items={accordionItems}
                openItemIds={openAccordionItems}
                onOpenChange={setOpenAccordionItems}
              />
              <Text variant="small" tone="muted">Open panels: {openAccordionItems.length}</Text>
            </GlassPanel>
          </section>

          <footer className="demo-footer">
            <Text variant="small" tone="muted">VictorShell React UI Kit · shared package exports and styles</Text>
            <a href="#top">Back to top ↑</a>
          </footer>
        </div>
      </main>
      </div>
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Export configuration"
        description="Review your current selection before exporting."
        footer={
          <>
            <Button variant="glass" size="small" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button data-testid="demo-modal-export" size="small" onClick={() => {
              setModalOpen(false);
              showToast('Configuration exported.');
            }}>Export asset</Button>
          </>
        }
      >
        <div className="vs-modal__summary">
          <div className="vs-modal__summary-row"><span>Material</span><strong>Violet glass</strong></div>
          <div className="vs-modal__summary-row"><span>Rotation</span><strong className="vs-mono">{sliderValue}°</strong></div>
        </div>
      </Modal>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Preview settings"
        description="Adjust the presentation of this asset."
        footer={
          <>
            <Button variant="glass" size="small" onClick={() => setDrawerOpen(false)}>Close</Button>
            <Button data-testid="demo-drawer-apply" size="small" onClick={() => {
              setDrawerOpen(false);
              showToast('Preview settings applied.');
            }}>Apply</Button>
          </>
        }
      >
        <Switch className="vs-drawer__setting" label="Auto-rotate" defaultChecked />
        <Switch className="vs-drawer__setting" label="Show floor reflections" />
        <FormField label="Environment">
          <select className="vs-input" defaultValue="studio">
            <option value="studio">Softbox studio</option>
            <option value="gallery">Gallery</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </FormField>
      </Drawer>
    </PageContainer>
  );
}

function DemoRoot() {
  return (
    <VictorShellThemeProvider className="demo-theme" initialAccent="violet">
      <ToastProvider>
        <IntegrationDemo />
      </ToastProvider>
    </VictorShellThemeProvider>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('UI Kit demo root element was not found.');
createRoot(rootElement).render(<DemoRoot />);
