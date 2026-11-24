import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Accordion,
  Alert,
  AvatarStack,
  Button,
  ConfiguratorDock,
  DataChecklist,
  DataTable,
  Drawer,
  DockDivider,
  DockItem,
  Dropdown,
  EmailInput,
  FloatingLabelInput,
  Form,
  FormField,
  FormLayout,
  HotspotMarker,
  Icon,
  InputAddon,
  InputGroup,
  MaterialSwatchGroup,
  Modal,
  NumberInput,
  NavigationRail,
  Pagination,
  PasswordInput,
  RangeSlider,
  SearchInput,
  SegmentedControl,
  Skeleton,
  StatusIndicator,
  Spinner,
  Switch,
  Tabs,
  Textarea,
  TextInput,
  TourSceneSwitcher,
  ToastProvider,
  UploadDropzone,
  VictorShellThemeProvider,
  useToast,
  type DropdownGroup,
  type DataTableColumn,
  type MaterialSwatchOption,
  type SegmentedControlOption
} from '@trikomi/ui-kit';
//mport '@trikomi/ui-kit/styles.css';

const actionGroups: DropdownGroup[] = [{
  label: 'Actions',
  options: [
    { value: 'first', label: 'First action' },
    { value: 'second', label: 'Second action' },
    { value: 'unavailable', label: 'Unavailable action', disabled: true },
    { value: 'last', label: 'Last action' }
  ]
}];

const multipleGroups: DropdownGroup[] = [{
  label: 'Layers',
  options: [
    { value: 'ambient', label: 'Ambient layer' },
    { value: 'reflections', label: 'Reflections layer' },
    { value: 'disabled', label: 'Unavailable layer', disabled: true }
  ]
}];

const tabs = [
  { value: 'studio', label: '3D Studio', content: <p>Studio panel</p> },
  { value: 'ar', label: 'AR Preview', content: <p>AR panel</p> }
];

const modes = [
  { value: 'live', label: 'Live Capture' },
  { value: 'recording', label: 'Recording' },
  { value: 'tracking', label: 'Tracking' },
  { value: 'settings', label: 'Settings' },
  { value: 'export', label: 'Export' }
];

const railItems = [
  { value: 'frames', label: 'Frames', icon: <Icon><path d="M2 12h20" /><circle cx="6.5" cy="12" r="3.5" /><circle cx="17.5" cy="12" r="3.5" /></Icon> },
  { value: 'lenses', label: 'Lenses', icon: <Icon><circle cx="12" cy="12" r="8" /></Icon> },
  { value: 'color', label: 'Color', icon: <Icon><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></Icon> },
  { value: 'fit', label: 'Fit', icon: <Icon><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /></Icon> }
];

const materialOptions: MaterialSwatchOption[] = [
  { value: 'glossy', label: 'Glossy', background: 'radial-gradient(circle at 30% 25%, #D8B4FE, #6E2CF2 55%, #2E0B7A)' },
  { value: 'metallic', label: 'Metallic', background: 'radial-gradient(circle at 30% 25%, #FFFFFF, #A1A1AA 60%, #52525B)' },
  { value: 'matte', label: 'Matte', background: '#C4B5FD', boxShadow: 'none' },
  { value: 'chrome', label: 'Chrome', background: 'linear-gradient(135deg, #FFFFFF 0%, #3F3F46 48%, #E4E4E7 52%, #18181B 100%)' },
  { value: 'glass', label: 'Glass', background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), rgba(226,232,240,0.45))', border: '1px solid #CBD5E1' },
  { value: 'carbon', label: 'Carbon', background: 'repeating-linear-gradient(45deg, #1F2937, #1F2937 3px, #374151 3px, #374151 6px)' }
];

const tourScenes: SegmentedControlOption[] = [
  { value: 'entrance', label: 'Entrance' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'lounge', label: 'Lounge' }
];

const assetRows = [
  { id: 'jersey', asset: 'Aero Pro Jersey #10', studio: 'Sportswear Studio', polyCount: 48200, status: 'Published', action: 'Inspect' },
  { id: 'ring', asset: 'Solitaire Rose Halo Ring', studio: 'Bespoke Jewelry', polyCount: 92450, status: 'Published', action: 'Inspect' },
  { id: 'glasses', asset: 'Wayfarer UV400 Carbon', studio: 'Virtual Eyewear', polyCount: 31800, status: 'Baking PBR', action: 'Queue' }
];

function createAssetColumns(onAction: (row: typeof assetRows[number]) => void): DataTableColumn<typeof assetRows[number]>[] {
  return [
  { id: 'asset', header: 'Asset Name', value: (row) => row.asset, sortable: true },
  { id: 'studio', header: 'Studio Module', value: (row) => row.studio, sortable: true },
  {
    id: 'polyCount',
    header: 'Poly Count',
    value: (row) => row.polyCount,
    render: (row) => <span className="vs-data-table__mono">{row.polyCount.toLocaleString()} tris</span>,
    sortable: true
  },
  {
    id: 'status',
    header: 'Status',
    value: (row) => row.status,
    render: (row) => (
      <StatusIndicator
        className="vs-data-table__status-pill"
        status={row.status === 'Published' ? 'success' : 'warning'}
        label={row.status}
      />
    )
  },
  {
    id: 'action',
    header: 'Action',
    value: (row) => row.action,
    align: 'right',
    render: (row) => (
      <Button
        variant={row.action === 'Inspect' ? 'tonal' : 'glass'}
        size="small"
        data-testid={`asset-action-${row.id}`}
        onClick={() => onAction(row)}
      >
        {row.action}
      </Button>
    )
  }
  ];
}

const mocapItems = [
  { id: 'face', label: 'Face Detection', complete: true },
  { id: 'expression', label: 'Expression Capture', complete: true },
  { id: 'movement', label: 'Head Movement', complete: true },
  { id: 'sync', label: 'Real-time Sync', complete: true }
];

const collaborators = [
  { id: 'm', label: 'Morgan', initials: 'M' },
  { id: 'a', label: 'Alex', initials: 'A' },
  { id: 's', label: 'Sam', initials: 'S' }
];

const accordionItems = [
  {
    id: 'glass',
    title: '01. Frosted Glassmorphism & Border Rules',
    content: <>Combines <code className="vs-mono">rgba(255,255,255,0.78)</code> with <code className="vs-mono">backdrop-filter: blur(20px)</code> and a 1px white rim highlight.</>
  },
  {
    id: 'spatial',
    title: '02. Spatial 360° & AR Orbital Controls',
    content: <>Circular orbital buttons use <code className="vs-mono">60px</code> pill geometry with active royal violet gradients.</>
  }
];

function ToastTrigger() {
  const showToast = useToast();
  return (
    <div className="vs-toast-test-actions">
      <Button data-testid="toast-trigger" onClick={() => showToast('Live studio toast triggered!')}>
        Trigger Toast
      </Button>
      <Button
        variant="glass"
        data-testid="toast-replace"
        onClick={() => showToast('Toast replacement confirmed.')}
      >
        Replace Toast
      </Button>
    </div>
  );
}

function OverlayExamples() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openAccordionItems, setOpenAccordionItems] = useState(['glass']);
  const [overlayEvent, setOverlayEvent] = useState('none');
  const showToast = useToast();

  return (
    <section data-testid="overlay-examples" style={{ display: 'grid', gap: '16px' }}>
      <Accordion
        data-testid="demo-accordion"
        label="Studio setup notes"
        items={accordionItems}
        openItemIds={openAccordionItems}
        onOpenChange={setOpenAccordionItems}
      />
      <output data-testid="accordion-open-items">{openAccordionItems.join(',')}</output>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <Button data-testid="modal-open" onClick={() => setModalOpen(true)}>Open Export Modal</Button>
        <Button variant="glass" data-testid="drawer-open" onClick={() => setDrawerOpen(true)}>Slide-Over Drawer</Button>
      </div>
      <output data-testid="overlay-event">{overlayEvent}</output>
      <Modal
        data-testid="demo-modal"
        open={modalOpen}
        title="Export VictorShell Studio Asset"
        description="Frosted glass modal dialog component"
        onOpenChange={(open) => {
          setModalOpen(open);
          setOverlayEvent(open ? 'modal-open' : 'modal-close');
        }}
        footer={
          <>
            <Button
              variant="glass"
              size="small"
              data-testid="modal-cancel"
              onClick={() => {
                setModalOpen(false);
                setOverlayEvent('modal-close');
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              data-testid="modal-confirm"
              onClick={() => {
                setModalOpen(false);
                setOverlayEvent('modal-close');
                showToast('Asset exported successfully!');
              }}
            >
              Confirm Export
            </Button>
          </>
        }
      >
        <div className="vs-modal__summary">
          <div className="vs-modal__summary-row"><span>Active Finish:</span><strong>Glossy Royal Violet</strong></div>
          <div className="vs-modal__summary-row"><span>Telemetry Stream:</span><strong className="vs-mono">60 FPS | 1080p</strong></div>
        </div>
      </Modal>
      <Drawer
        data-testid="demo-drawer"
        open={drawerOpen}
        title="Studio Configurator Drawer"
        description="Slide-over offcanvas panel"
        onOpenChange={(open) => {
          setDrawerOpen(open);
          setOverlayEvent(open ? 'drawer-open' : 'drawer-close');
        }}
        footer={
          <>
            <Button
              variant="glass"
              size="small"
              data-testid="drawer-close"
              onClick={() => {
                setDrawerOpen(false);
                setOverlayEvent('drawer-close');
              }}
            >
              Close
            </Button>
            <Button
              size="small"
              data-testid="drawer-apply"
              onClick={() => {
                setDrawerOpen(false);
                setOverlayEvent('drawer-close');
                showToast('Studio settings applied!');
              }}
            >
              Apply
            </Button>
          </>
        }
      >
        <label className="vs-drawer__field">
          Environment HDRI
          <select className="vs-input" data-testid="drawer-environment" defaultValue="neon">
            <option value="neon">VictorShell Neon Arch Studio</option>
            <option value="daylight">Soft Daylight Cyclorama</option>
            <option value="showroom">Luxury Showroom Gallery</option>
          </select>
        </label>
        <Switch
          className="vs-drawer__setting"
          label="Raytraced Floor Reflections"
          defaultChecked
          data-testid="drawer-reflections"
        />
        <Switch
          className="vs-drawer__setting"
          label="Auto-Rotate Turntable"
          data-testid="drawer-rotation"
        />
      </Drawer>
    </section>
  );
}

function IntegrationConsumer() {
  const [selectedAction, setSelectedAction] = useState('none');
  const [selectedLayers, setSelectedLayers] = useState(['ambient']);
  const [selectedMode, setSelectedMode] = useState('live');
  const [dockAction, setDockAction] = useState('none');
  const [selectedMaterial, setSelectedMaterial] = useState('none');
  const [activeScene, setActiveScene] = useState('entrance');
  const [hotspotCount, setHotspotCount] = useState(0);
  const [email, setEmail] = useState('');
  const [sliderValue, setSliderValue] = useState(82);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('none');
  const [unrestrictedFileName, setUnrestrictedFileName] = useState('none');
  const [assetPage, setAssetPage] = useState(1);
  const [assetAction, setAssetAction] = useState('none');
  const [dismissedAlert, setDismissedAlert] = useState('none');
  const [backgroundClicks, setBackgroundClicks] = useState(0);

  return (
    <VictorShellThemeProvider>
      <ToastProvider>
       <main
         data-test-ready="box-configurator"
         style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '8px', padding: '16px' }}
       >
        <Button
          size="small"
          data-testid="background-probe"
          onClick={() => setBackgroundClicks((count) => count + 1)}
        >
          Background control
        </Button>
        <output data-testid="background-clicks">{backgroundClicks}</output>
        <section style={{ width: '100%', maxWidth: '760px', display: 'grid', gap: '12px' }}>
          <div className="vs-alert-grid" data-testid="alert-grid">
            <Alert
              data-testid="alert-info"
              variant="info"
              title="Info"
              description="Studio color profile locked to sRGB."
              onDismiss={() => setDismissedAlert('info')}
            />
            <Alert
              data-testid="alert-success"
              variant="success"
              title="Success"
              description="GLB & Tech Pack exported cleanly."
            />
            <Alert
              data-testid="alert-warning"
              variant="warning"
              title="Warning"
              description="High polygon count on mobile AR."
            />
            <Alert
              data-testid="alert-error"
              variant="error"
              title="Error"
              description="Normal map exceeds 4096px limit."
            />
          </div>
          <output data-testid="dismissed-alert">{dismissedAlert}</output>
          <ToastTrigger />
          <OverlayExamples />
        </section>
        <Button size="small" data-testid="button-small">Button</Button>
        <Button size="medium" data-testid="button-medium">Button</Button>
        <Button size="large" data-testid="button-large">Button</Button>
        <Form
          data-testid="demo-form"
          style={{ width: '100%', maxWidth: '680px' }}
          onSubmit={(event) => {
            event.preventDefault();
            setFormSubmitted(true);
          }}
        >
          <FormLayout>
            <FormField
              label="Display name"
              required
              helperText="Shown on your saved configuration."
              rules={{
                minLength: { value: 3, message: 'Use at least 3 characters.' },
                maxLength: { value: 8, message: 'Use no more than 8 characters.' }
              }}
            >
              <TextInput name="displayName" placeholder="Enter a name" data-testid="required-field" />
            </FormField>
            <FormField
              label="Email address"
              required
              helperText="We use this for saved projects."
              successMessage="Email format looks good."
              rules={{ email: true }}
            >
              <EmailInput
                name="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                data-testid="form-email"
              />
            </FormField>
            <output data-testid="controlled-email">{email}</output>
            <FormField
              label="Quantity"
              rules={{
                min: { value: 10, message: 'Quantity must be at least 10.' },
                max: { value: 50, message: 'Quantity cannot exceed 50.' }
              }}
            >
              <NumberInput name="quantity" defaultValue={20} data-testid="form-number" />
            </FormField>
            <FormField label="Password">
              <PasswordInput name="password" placeholder="Enter password" data-testid="form-password" />
            </FormField>
            <FormField label="Disabled field" disabled>
              <TextInput name="disabled" defaultValue="Unavailable" data-testid="form-disabled" />
            </FormField>
            <FormField label="Notes" rules={{ maxLength: 160 }}>
              <Textarea
                name="notes"
                maxLength={160}
                defaultValue="Initial note"
                data-testid="form-textarea"
              />
            </FormField>
            <FormField label="Search products">
              <SearchInput name="search" placeholder="Search..." shortcut="Ctrl K" data-testid="form-search" />
            </FormField>
            <FormField label="Website URL">
              <InputGroup>
                <InputAddon>https://</InputAddon>
                <TextInput name="website" placeholder="example.com" data-testid="form-group-input" />
              </InputGroup>
            </FormField>
            <FloatingLabelInput
              label="Model URL"
              name="modelUrl"
              defaultValue="https://example.com/model"
              data-testid="form-floating"
            />
            <FormField label="Rotation">
              <RangeSlider
                name="rotation"
                value={sliderValue}
                onChange={(event) => setSliderValue(Number(event.currentTarget.value))}
                data-testid="form-range"
              />
            </FormField>
            <FormField label="Stepped rotation">
              <RangeSlider
                name="steppedRotation"
                min={10}
                max={20}
                step={5}
                defaultValue={13}
                formatValue={(value) => `${value} units`}
                data-testid="stepped-range"
              />
            </FormField>
            <FormField label="3D model file">
              <UploadDropzone
                accept=".glb,.usdz,.obj,.png"
                maxSize={32}
                value={selectedUpload}
                onFileChange={setSelectedUpload}
                onError={(error) => setUploadError(error ?? 'none')}
                data-testid="mesh-upload"
              />
            </FormField>
            <output data-testid="selected-upload">{selectedUpload?.name ?? 'none'}</output>
            <output data-testid="upload-error">{uploadError}</output>
            <FormField label="Unrestricted file">
              <UploadDropzone
                label="Choose any file"
                onFileChange={(file) => setUnrestrictedFileName(file?.name ?? 'none')}
                data-testid="unrestricted-upload"
              />
            </FormField>
            <output data-testid="unrestricted-file">{unrestrictedFileName}</output>
          </FormLayout>
          <button type="submit" data-testid="form-submit">Save configuration</button>
          <output data-testid="form-submitted">{formSubmitted ? 'submitted' : 'not-submitted'}</output>
        </Form>
        <Dropdown
          label="Action menu"
          groups={actionGroups}
          onSelect={(option) => setSelectedAction(option.value)}
        />
        <Dropdown
          label="Multiple menu"
          mode="multiple"
          groups={multipleGroups}
          defaultValues={selectedLayers}
          onValuesChange={setSelectedLayers}
        />
        <Tabs label="Studio views" options={tabs} />
        <SegmentedControl
          label="Capture modes"
          options={modes}
          value={selectedMode}
          onValueChange={setSelectedMode}
        />
        <NavigationRail label="Configurator tools" options={railItems} />
        <ConfiguratorDock label="Bespoke jewelry controls" data-testid="configurator-dock">
          <DockItem
            label="Metal"
            data-testid="dock-metal"
            icon={<span className="vs-dock-metal-swatch" aria-hidden="true" style={{ background: 'radial-gradient(circle at 30% 30%, #FFE6A3, #D98A2B)' }} />}
            trailing={<Icon size={14}><polyline points="6 9 12 15 18 9" /></Icon>}
            onClick={() => setDockAction('metal')}
          />
          <DockDivider />
          <DockItem
            label="Gemstone"
            data-testid="dock-gemstone"
            icon={<Icon size={16}><polygon points="6 3 18 3 22 9 12 22 2 9 6 3" /></Icon>}
            trailing={<Icon size={14}><polyline points="6 9 12 15 18 9" /></Icon>}
            onClick={() => setDockAction('gemstone')}
          />
          <DockDivider />
          <Button size="small" data-testid="customize-dock" onClick={() => setDockAction('customize')}>
            Customize
            <Icon size={14}><polyline points="9 18 15 12 9 6" /></Icon>
          </Button>
        </ConfiguratorDock>
        <output data-testid="dock-action">{dockAction}</output>
        <div style={{ width: '100%' }}>
          <MaterialSwatchGroup
            title="3D PBR Material Swatch Picker"
            options={materialOptions}
            defaultValue="glossy"
            onSelect={(option) => setSelectedMaterial(option.value)}
            data-testid="materials-primary"
          />
          <MaterialSwatchGroup
            title="Secondary material picker"
            options={materialOptions}
            defaultValue="carbon"
            data-testid="materials-secondary"
          />
        </div>
        <output data-testid="selected-material">{selectedMaterial}</output>
        <TourSceneSwitcher
          label="360 degree tour scenes"
          options={tourScenes}
          value={activeScene}
          onValueChange={setActiveScene}
          data-testid="tour-scenes"
        />
        <output data-testid="active-scene">{activeScene}</output>
        <section data-testid="data-display-samples" style={{ width: '100%', maxWidth: '760px', display: 'grid', gap: '16px' }}>
          <DataTable
            aria-label="Asset library"
            columns={createAssetColumns((row) => setAssetAction(row.id))}
            rows={assetRows}
            label="3D Asset Library"
            getRowKey={(row) => row.id}
          />
          <output data-testid="asset-action">{assetAction}</output>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <DataChecklist title="Face MOCAP Tracking Checklist" items={mocapItems} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <AvatarStack label="Collaborators" collaborators={collaborators} remainingCount={4} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Spinner data-testid="render-spinner" label="Rendering HDRI" />
                <span>Rendering HDRI</span>
              </div>
            </div>
          </div>
          <div aria-busy="true" aria-label="Asset preview loading" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,.8)' }}>
            <Skeleton width="40px" height="40px" data-testid="asset-skeleton" />
            <span style={{ display: 'grid', flex: 1, gap: '8px' }}>
              <Skeleton width="66%" height="12px" />
              <Skeleton width="50%" height="10px" />
            </span>
            <span>Skeleton</span>
          </div>
          <Pagination
            data-testid="asset-pagination"
            totalPages={12}
            page={assetPage}
            onPageChange={setAssetPage}
          />
          <output data-testid="asset-page">{assetPage}</output>
        </section>
        <HotspotMarker
          label="Spatial Node"
          onActivate={() => setHotspotCount((count) => count + 1)}
        />
        <output data-testid="hotspot-count">{hotspotCount}</output>
        <button type="button" data-testid="outside">Outside</button>
        <output data-testid="selected-action">{selectedAction}</output>
        <output data-testid="selected-layers">{selectedLayers.join(',')}</output>
        <output data-testid="selected-mode">{selectedMode}</output>
      </main>
      </ToastProvider>
    </VictorShellThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<IntegrationConsumer />);
