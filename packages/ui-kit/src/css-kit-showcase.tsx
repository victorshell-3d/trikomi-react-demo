import { useEffect, useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import {
  VictorShellThemeProvider,
  useVictorShellTheme
} from '@trikomi/ui-kit';
import victorshellLogoUrl from './assets/victorshell-logo.png';

type ConfiguratorPreset = 'showcase-dark' | 'showcase-cobalt' | 'dark-indigo' | 'dark-cyan';

interface DropdownOption {
  value: string;
  label: string;
  shortcut?: string;
  danger?: boolean;
}

const DROPDOWN_OPTIONS: DropdownOption[] = [
  { value: 'pbr-metallic', label: 'PBR Metallic Clearcoat', shortcut: 'M' },
  { value: 'sublimation-mesh', label: 'UV Sublimation Mesh', shortcut: 'U' },
  { value: 'frosted-acrylic', label: 'Frosted Acrylic Glass', shortcut: 'F' },
  { value: 'reset-shader', label: 'Reset Material Shader', danger: true }
];

const SWATCH_ITEMS = [
  { id: 'cyan', label: 'Cyber Cyan', cls: 'vs-showcase-swatch--cyan' },
  { id: 'blue', label: 'Cobalt Blue', cls: 'vs-showcase-swatch--blue' },
  { id: 'silver', label: 'Titanium Slate', cls: 'vs-showcase-swatch--silver' },
  { id: 'emerald', label: 'Signal Emerald', cls: 'vs-showcase-swatch--emerald' },
  { id: 'amber', label: 'Amber Gold', cls: 'vs-showcase-swatch--amber' },
  { id: 'danger', label: 'Rose Crimson', cls: 'vs-showcase-swatch--danger' }
];

interface TableRowRecord {
  id: string;
  module: string;
  layer: string;
  category: 'Primitives' | 'Patterns' | 'Layouts';
  contrast: string;
  status: 'AAA Pass' | 'AA Pass' | 'Verified';
  variant: 'success' | 'cyan' | 'accent';
  sizeKb: number;
}

const TABLE_RECORDS: TableRowRecord[] = [
  { id: 'r1', module: 'buttons.css', layer: '@vs.primitives', category: 'Primitives', contrast: '10.4:1', status: 'AAA Pass', variant: 'success', sizeKb: 4.1 },
  { id: 'r2', module: 'inputs.css', layer: '@vs.primitives', category: 'Primitives', contrast: '8.9:1', status: 'AAA Pass', variant: 'success', sizeKb: 5.4 },
  { id: 'r3', module: 'tables.css', layer: '@vs.patterns', category: 'Patterns', contrast: '11.2:1', status: 'AAA Pass', variant: 'cyan', sizeKb: 2.9 },
  { id: 'r4', module: 'dialogs.css', layer: '@vs.patterns', category: 'Patterns', contrast: '9.4:1', status: 'AA Pass', variant: 'accent', sizeKb: 3.3 },
  { id: 'r5', module: 'sidebar-layout.css', layer: '@vs.layouts', category: 'Layouts', contrast: '11.8:1', status: 'Verified', variant: 'cyan', sizeKb: 2.6 },
  { id: 'r6', module: 'overlays.css', layer: '@vs.patterns', category: 'Patterns', contrast: '8.2:1', status: 'AA Pass', variant: 'accent', sizeKb: 3.6 },
  { id: 'r7', module: 'selection.css', layer: '@vs.primitives', category: 'Primitives', contrast: '9.7:1', status: 'AAA Pass', variant: 'success', sizeKb: 4.4 },
  { id: 'r8', module: 'containers.css', layer: '@vs.layouts', category: 'Layouts', contrast: '10.1:1', status: 'Verified', variant: 'cyan', sizeKb: 2.1 }
];

const NAV_SECTIONS = [
  { id: 'buttons', index: '01', label: 'Buttons' },
  { id: 'cards', index: '02', label: 'Cards & Badges' },
  { id: 'tables', index: '03', label: 'Data Tables' },
  { id: 'forms', index: '04', label: 'Forms & Inputs' },
  { id: 'selection', index: '05', label: 'Selection' },
  { id: 'overlays', index: '06', label: 'Modals & Tooltips' },
  { id: 'layouts', index: '07', label: 'Layouts & Configurator' }
];

const VERIFIED_SOCIAL_LINKS = [
  {
    id: 'linkedin',
    label: 'VictorShell on LinkedIn',
    href: 'https://www.linkedin.com/company/victorshelltech',
    icon: (
      <svg className="vs-showcase-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    )
  },
  {
    id: 'github',
    label: 'VictorShell on GitHub',
    href: 'https://github.com/victorshell-3d',
    icon: (
      <svg className="vs-showcase-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
      </svg>
    )
  },
  {
    id: 'youtube',
    label: 'VictorShell on YouTube',
    href: 'https://www.youtube.com/channel/UCGsg66t7Biam88O0HvbqWFA',
    icon: (
      <svg className="vs-showcase-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
      </svg>
    )
  },
  {
    id: 'twitter',
    label: 'VictorShell on X (Twitter)',
    href: 'https://twitter.com/victorshelltech',
    icon: (
      <svg className="vs-showcase-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    id: 'facebook',
    label: 'VictorShell on Facebook',
    href: 'https://www.facebook.com/victorshelltech',
    icon: (
      <svg className="vs-showcase-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
      </svg>
    )
  }
];

function CssModuleKitShowcase() {
  const { setAccent, themeMode, setThemeMode } = useVictorShellTheme();
  const [preset, setPreset] = useState<ConfiguratorPreset>('showcase-dark');
  const [activeNavTab, setActiveNavTab] = useState<string>('buttons');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState<boolean>(false);

  // Interactive Data Table State
  const [tableQuery, setTableQuery] = useState<string>('');
  const [tableCategory, setTableCategory] = useState<'all' | 'Primitives' | 'Patterns' | 'Layouts'>('all');
  const [tableSortField, setTableSortField] = useState<'module' | 'category' | 'sizeKb'>('module');
  const [tableSortAsc, setTableSortAsc] = useState<boolean>(true);
  const [tablePage, setTablePage] = useState<number>(1);

  // Interactive Cards & Alerts & Media
  const [selectedCard, setSelectedCard] = useState<string>('glass');
  const [alertsVisible, setAlertsVisible] = useState({
    info: true,
    success: true,
    warning: true,
    error: true
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dropzoneDragging, setDropzoneDragging] = useState<boolean>(false);

  // Interactive Inputs & Forms
  const [projectName, setProjectName] = useState<string>('VictorShell Titanium Frame');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notes, setNotes] = useState<string>('Testing Vanilla CSS tokens across responsive viewports.');
  const [sliderValue, setSliderValue] = useState<number>(65);
  const [stepperValue, setStepperValue] = useState<number>(24);
  const [swatchHex, setSwatchHex] = useState<string>('#00D5FF');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formHasError, setFormHasError] = useState<boolean>(false);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('pbr-metallic');

  // Selection Controls
  const [activeTab, setActiveTab] = useState<'materials' | 'lighting' | 'camera'>('materials');
  const [activeRailTool, setActiveRailTool] = useState<'orbit' | 'measure' | 'material'>('orbit');
  const [switchAutoRotate, setSwitchAutoRotate] = useState<boolean>(true);
  const [switchGrid, setSwitchGrid] = useState<boolean>(false);
  const [checkboxShadows, setCheckboxShadows] = useState<boolean>(true);
  const [checkboxBloom, setCheckboxBloom] = useState<boolean>(false);
  const [radioQuality, setRadioQuality] = useState<'standard' | 'ultra'>('ultra');

  // Overlays & Modals & Drawers
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [tooltipPinned, setTooltipPinned] = useState<boolean>(false);
  const [tooltipHovered, setTooltipHovered] = useState<boolean>(false);

  // Configurator HUD Preview Stage
  const [stageDrawerCollapsed, setStageDrawerCollapsed] = useState<boolean>(false);
  const [stageDrawerTab, setStageDrawerTab] = useState<'finish' | 'camera'>('finish');
  const [activeSwatch, setActiveSwatch] = useState<string>('cyan');
  const [dockTab, setDockTab] = useState<'presets' | 'studio' | 'export'>('presets');
  const [dockPopoverOpen, setDockPopoverOpen] = useState<boolean>(false);
  const [recordingActive, setRecordingActive] = useState<boolean>(false);

  // Enforce Dark Futuristic theme even if previous sessions wrote 'light' to localStorage
  useEffect(() => {
    if (themeMode !== 'dark') {
      setThemeMode('dark');
    }
    setAccent('indigo');
  }, [themeMode, setThemeMode, setAccent]);

  const handleToggleDarkTone = () => {
    setPreset((prev) => (prev === 'showcase-cobalt' ? 'showcase-dark' : 'showcase-cobalt'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const id = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(id);
  }, [toastMessage]);

  // ESC key dismissal for overlays & mobile sidebar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (sidebarOpen) setSidebarOpen(false);
      if (modalOpen) setModalOpen(false);
      if (drawerOpen) setDrawerOpen(false);
      if (dropdownOpen) setDropdownOpen(false);
      if (popoverOpen) setPopoverOpen(false);
      if (tooltipPinned) setTooltipPinned(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen, modalOpen, drawerOpen, dropdownOpen, popoverOpen, tooltipPinned]);

  const handleSortColumn = (field: 'module' | 'category' | 'sizeKb') => {
    if (tableSortField === field) {
      setTableSortAsc((prev) => !prev);
    } else {
      setTableSortField(field);
      setTableSortAsc(true);
    }
    setTablePage(1);
  };

  const filteredRows = TABLE_RECORDS.filter((row) => {
    const matchesCategory = tableCategory === 'all' || row.category === tableCategory;
    const normalizedQuery = tableQuery.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      row.module.toLowerCase().includes(normalizedQuery) ||
      row.layer.toLowerCase().includes(normalizedQuery) ||
      row.status.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const cmp =
      tableSortField === 'sizeKb'
        ? a.sizeKb - b.sizeKb
        : a[tableSortField].localeCompare(b[tableSortField]);
    return tableSortAsc ? cmp : -cmp;
  });

  const rowsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
  const safePage = Math.min(tablePage, totalPages);
  const pagedRows = sortedRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setFormHasError(true);
      setFormSubmitted(false);
      return;
    }
    setFormHasError(false);
    setFormSubmitted(true);
    showToast(`Saved "${projectName.trim()}"`);
  };

  const selectedDropdownLabel =
    DROPDOWN_OPTIONS.find((opt) => opt.value === selectedMaterial)?.label ?? 'Select shader';

  const resolvedPresetAttr = preset === 'showcase-cobalt' ? 'showcase-dark' : preset;

  return (
    <div
      className="vs-showcase-page vs-kit-root"
      data-testid="css-kit-showcase"
      data-vs-preset={resolvedPresetAttr}
      data-showcase-tone={preset === 'showcase-cobalt' ? 'blue' : undefined}
      data-theme="dark"
      data-accent="indigo"
    >
      {/* Top Configurator Header Bar (05-configurator/header-bar.css) */}
      <header className="vs-cfg-header" role="banner">
        <div className="vs-cfg-header__inner">
          <div className="vs-cfg-header__left">
            <button
              type="button"
              data-testid="sidebar-toggle-btn"
              className="vs-cfg-header__back-btn vs-showcase-nav-toggle"
              aria-expanded={sidebarOpen}
              aria-controls="showcase-sidebar"
              aria-label="Toggle section navigation"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <span aria-hidden="true">☰</span>
              <span className="vs-cfg-header__back-label">Menu</span>
            </button>
            <button
              type="button"
              className="vs-cfg-header__back-btn vs-showcase-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span aria-hidden="true">↑</span>
              <span className="vs-cfg-header__back-label">Module Kit</span>
            </button>
            <div className="vs-cfg-header__brand">
              <span className="vs-cfg-header__brand-title">VictorShell</span>
              <span className="vs-cfg-header__brand-divider" aria-hidden="true">/</span>
              <span className="vs-cfg-header__brand-subtitle">CSS Module Kit</span>
            </div>
          </div>

          <div className="vs-cfg-header__right">
            <div className="vs-showcase-header-controls">
              <button
                type="button"
                data-testid="dark-tone-toggle"
                className="vs-btn vs-btn--glass vs-btn--sm vs-btn--pill"
                onClick={handleToggleDarkTone}
              >
                {preset === 'showcase-cobalt' ? '◈ Cyber Cyan' : '◆ Cobalt Blue'}
              </button>

              <select
                aria-label="Dark studio preset"
                data-testid="preset-select"
                className="vs-input vs-input--sm vs-hide-mobile vs-showcase-select-inline"
                value={preset}
                onChange={(e) => setPreset(e.target.value as ConfiguratorPreset)}
              >
                <option value="showcase-dark">Preset: Dark Cyan</option>
                <option value="showcase-cobalt">Preset: Dark Blue</option>
                <option value="dark-indigo">Preset: Slate Indigo</option>
                <option value="dark-cyan">Preset: Obsidian Cyan</option>
              </select>

              <button
                type="button"
                data-testid="header-drawer-toggle"
                className={`vs-cfg-header__drawer-toggle ${headerDrawerOpen ? 'is-active' : ''}`}
                onClick={() => {
                  setHeaderDrawerOpen((prev) => !prev);
                  setDrawerOpen((prev) => !prev);
                }}
              >
                <span aria-hidden="true">⚙</span>
                <span className="vs-hide-xs">Drawer</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="vs-nav-shell">
        <div
          className={`vs-nav-shell__overlay ${sidebarOpen ? 'is-open' : ''}`}
          aria-hidden={!sidebarOpen}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          id="showcase-sidebar"
          data-testid="showcase-sidebar"
          className={`vs-nav-shell__sidebar ${sidebarOpen ? 'is-open' : ''}`}
          aria-label="CSS Module Kit Sections"
        >
          <div className="vs-nav-shell__sidebar-head">
            <div className="vs-stack vs-stack--xs">
              <span className="vs-label vs-label--tone-accent">Studio Kit v2</span>
              <span className="vs-text vs-text--small vs-text--tone-secondary">UI System Navigator</span>
            </div>
            <button
              type="button"
              data-testid="sidebar-close-btn"
              className="vs-icon-btn vs-icon-btn--sm vs-showcase-sidebar-close"
              aria-label="Close navigation menu"
              onClick={() => setSidebarOpen(false)}
            >✕</button>
          </div>

          <nav aria-label="Showcase sections">
            <ul className="vs-nav-menu">
              {NAV_SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className={`vs-nav-menu__link ${activeNavTab === sec.id ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveNavTab(sec.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="vs-nav-menu__label">
                      <span className="vs-nav-menu__index">{sec.index}</span>
                      <span>{sec.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="vs-showcase-sidebar-meta">
            <div className="vs-form__field">
              <label htmlFor="sidebar-preset-select" className="vs-form__label">Dark Studio Preset</label>
              <select
                id="sidebar-preset-select"
                className="vs-input vs-input--sm"
                value={preset}
                onChange={(e) => setPreset(e.target.value as ConfiguratorPreset)}
              >
                <option value="showcase-dark">Dark Cyan (#00D5FF)</option>
                <option value="showcase-cobalt">Dark Blue (#3B82F6)</option>
                <option value="dark-indigo">Slate Indigo</option>
                <option value="dark-cyan">Obsidian Cyan</option>
              </select>
            </div>
            <div className="vs-cluster vs-cluster--xs">
              {([
                { id: 'showcase-dark', label: 'Cyan' },
                { id: 'showcase-cobalt', label: 'Blue' }
              ] as const).map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  className={`vs-btn vs-btn--sm vs-btn--pill ${preset === tone.id ? 'vs-btn--primary' : 'vs-btn--secondary'}`}
                  onClick={() => setPreset(tone.id)}
                >{tone.label}</button>
              ))}
            </div>
          </div>
        </aside>

        <main className="vs-nav-shell__main vs-showcase-main">
          <div className="vs-nav-shell__content">
          {/* Hero Summary Banner */}
          <section className="vs-showcase-hero">
            <div className="vs-card vs-card--glass vs-card--elevated">
              <div className="vs-card__header vs-stack-mobile">
                <div className="vs-card__heading">
                  <div className="vs-showcase-chip-row">
                    <span className="vs-badge vs-badge--accent vs-badge--md">
                      <span className="vs-badge__dot" aria-hidden="true" />
                      Vanilla CSS Module Kit
                    </span>
                    <span className="vs-badge vs-badge--neutral vs-badge--sm">
                      @layer Cascade
                    </span>
                    <span className="vs-badge vs-badge--success vs-badge--sm">
                      Theme: dark
                    </span>
                    <span className="vs-badge vs-badge--outline vs-badge--sm">
                      Preset: {preset}
                    </span>
                  </div>
                  <h1 className="vs-heading vs-heading--display">
                    Reusable <span className="vs-title-gradient">CSS Module Kit</span> Showcase
                  </h1>
                  <p className="vs-text vs-text--body vs-text--tone-muted">
                    Isolated visual QA harness exercising every token, primitive, pattern, layout utility, responsive breakpoint, and theme preset in <code>entrypoints/configurator-kit.css</code>.
                  </p>
                </div>

                <div className="vs-card__actions vs-stack-mobile">
                  <button
                    type="button"
                    data-testid="open-modal-btn"
                    className="vs-btn vs-btn--primary vs-btn--pill"
                    onClick={() => setModalOpen(true)}
                  >
                    Open Modal
                  </button>
                  <button
                    type="button"
                    data-testid="open-drawer-btn"
                    className="vs-btn vs-btn--outline vs-btn--pill"
                    onClick={() => setDrawerOpen(true)}
                  >
                    Open Drawer
                  </button>
                </div>
              </div>

              <div className="vs-card__body">
                <div className="vs-showcase-nav-pills">
                  {NAV_SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`vs-btn vs-btn--sm vs-btn--pill ${activeNavTab === sec.id ? 'vs-btn--tonal is-active' : 'vs-btn--ghost'}`}
                      onClick={() => setActiveNavTab(sec.id)}
                    >
                      {sec.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="vs-card__footer vs-stack-mobile">
                <div className="vs-cluster vs-cluster--sm">
                  <span className="vs-status vs-status--success">
                    <span className="vs-status__dot" aria-hidden="true" />
                    <span className="vs-status__label">Zero Tailwind / Zero Bootstrap</span>
                  </span>
                  <span className="vs-status vs-status--info">
                    <span className="vs-status__dot" aria-hidden="true" />
                    <span className="vs-status__label">42 Modules · 206 Tokens</span>
                  </span>
                </div>
                <div className="vs-cluster vs-cluster--sm">
                  <span className="vs-text vs-text--caption vs-text--tone-muted">Theme shortcuts:</span>
                  <kbd className="vs-kbd">ESC</kbd>
                  <span className="vs-text vs-text--caption vs-text--tone-muted">closes overlays</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 1: Buttons (02-primitives/buttons.css) */}
          <section id="buttons" className="vs-showcase-section" aria-labelledby="sec-buttons-title">
            <div className="vs-showcase-section__head">
              <span className="vs-label vs-label--tone-accent">01 · Primitives</span>
              <h2 id="sec-buttons-title" className="vs-heading vs-heading--section">
                Buttons, Sizes &amp; Icon Triggers
              </h2>
            </div>

            <div className="vs-grid vs-grid--2">
              <div className="vs-card vs-card--glass">
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Button Variants &amp; States</h3>
                    <p className="vs-card__subtitle">Primary, secondary, outline, glass, tonal, ghost, danger, active &amp; disabled</p>
                  </div>
                </div>
                <div className="vs-card__body vs-stack vs-stack--md">
                  <div className="vs-cluster">
                    <button type="button" className="vs-btn vs-btn--primary">Primary</button>
                    <button type="button" className="vs-btn vs-btn--secondary">Secondary</button>
                    <button type="button" className="vs-btn vs-btn--outline">Outline</button>
                    <button type="button" className="vs-btn vs-btn--glass">Glass</button>
                    <button type="button" className="vs-btn vs-btn--tonal">Tonal</button>
                    <button type="button" className="vs-btn vs-btn--ghost">Ghost</button>
                    <button type="button" className="vs-btn vs-btn--danger">Danger</button>
                  </div>

                  <hr className="vs-divider vs-divider--horizontal" />

                  <div className="vs-cluster">
                    <button type="button" className="vs-btn vs-btn--primary is-active">Active Primary</button>
                    <button type="button" className="vs-btn vs-btn--outline is-active">Active Outline</button>
                    <button type="button" className="vs-btn vs-btn--tonal is-active">Active Tonal</button>
                    <button type="button" className="vs-btn vs-btn--primary" disabled>Disabled</button>
                  </div>
                </div>
              </div>

              <div className="vs-card vs-card--glass">
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Sizes, Shapes &amp; Icon Buttons</h3>
                    <p className="vs-card__subtitle">Small, medium, large, pill, block and circular icon triggers</p>
                  </div>
                </div>
                <div className="vs-card__body vs-stack vs-stack--md">
                  <div className="vs-cluster">
                    <button type="button" className="vs-btn vs-btn--primary vs-btn--sm">Small</button>
                    <button type="button" className="vs-btn vs-btn--primary vs-btn--md">Medium</button>
                    <button type="button" className="vs-btn vs-btn--primary vs-btn--lg">Large</button>
                    <button type="button" className="vs-btn vs-btn--outline vs-btn--pill vs-btn--sm">Pill SM</button>
                    <button type="button" className="vs-btn vs-btn--glass vs-btn--pill vs-btn--lg">Pill LG</button>
                  </div>

                  <div className="vs-cluster">
                    <button type="button" className="vs-icon-btn vs-icon-btn--sm" aria-label="Zoom out">−</button>
                    <button type="button" className="vs-icon-btn vs-icon-btn--md" aria-label="Reset camera">⟲</button>
                    <button type="button" className="vs-icon-btn vs-icon-btn--lg is-active" aria-label="Snapshot">✦</button>
                    <button type="button" className="vs-icon-btn vs-icon-btn--md" disabled aria-label="Locked">🔒</button>
                    <button type="button" className="vs-btn vs-btn--tonal vs-btn--icon" aria-label="Settings">⚙</button>
                  </div>

                  <button type="button" className="vs-btn vs-btn--primary vs-btn--block">
                    <span className="vs-btn__icon" aria-hidden="true">↗</span>
                    <span className="vs-btn__label">Full-Width Block Action (.vs-btn--block)</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Cards, Typography, Badges, Alerts & Media */}
          <section id="cards" className="vs-showcase-section" aria-labelledby="sec-cards-title">
            <div className="vs-showcase-section__head">
              <span className="vs-label vs-label--tone-accent">02 · Surfaces, Type &amp; Feedback</span>
              <h2 id="sec-cards-title" className="vs-heading vs-heading--section">
                Cards, Typography, Badges &amp; Alerts
              </h2>
            </div>

            <div className="vs-grid vs-grid--3">
              {[
                { key: 'glass', title: 'Frosted Glass Card', badge: 'Default Glass', cls: 'vs-card--glass vs-card--interactive' },
                { key: 'strong', title: 'Strong Elevated Card', badge: 'Floating Elevation', cls: 'vs-card--strong vs-card--elevated vs-card--interactive' },
                { key: 'stage', title: 'Dashed Stage Card', badge: 'Drop Stage', cls: 'vs-card--stage vs-card--interactive' }
              ].map((item) => (
                <div
                  key={item.key}
                  role="button"
                  tabIndex={0}
                  className={`vs-card ${item.cls} ${selectedCard === item.key ? 'is-selected' : ''}`}
                  onClick={() => setSelectedCard(item.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCard(item.key);
                    }
                  }}
                >
                  <div className="vs-card__header">
                    <div className="vs-card__heading">
                      <h3 className="vs-card__title">{item.title}</h3>
                      <p className="vs-card__subtitle">Click card to toggle `.is-selected` ring</p>
                    </div>
                    <span className="vs-badge vs-badge--accent vs-badge--sm">{item.badge}</span>
                  </div>
                  <div className="vs-card__body">
                    <p className="vs-text vs-text--small vs-text--tone-muted">
                      Uses tokenized border, blur, shadow, and responsive padding from <code>02-primitives/cards.css</code>.
                    </p>
                  </div>
                  <div className="vs-card__footer">
                    <span className="vs-text vs-text--mono vs-text--tone-accent">.{item.cls.split(' ')[0]}</span>
                    <span className="vs-badge vs-badge--neutral vs-badge--sm">
                      {selectedCard === item.key ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="vs-grid vs-grid--2 vs-showcase-mt-6">
              {/* Typography & Badges Card */}
              <div className="vs-card vs-card--glass">
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Typography Hierarchy &amp; Badges</h3>
                    <p className="vs-card__subtitle">Headings, body tones, mono metrics, keycaps &amp; semantic badges</p>
                  </div>
                </div>
                <div className="vs-card__body vs-stack vs-stack--sm">
                  <div className="vs-heading vs-heading--page">Page Heading (.vs-heading--page)</div>
                  <div className="vs-heading vs-heading--subheading">Subheading (.vs-heading--subheading)</div>
                  <p className="vs-text vs-text--body">Body copy with balanced line height (.vs-text--body)</p>
                  <p className="vs-text vs-text--small vs-text--tone-secondary">Secondary slate copy (.vs-text--tone-secondary)</p>
                  <p className="vs-text vs-text--small vs-text--tone-muted">Muted metadata text (.vs-text--small .vs-text--tone-muted)</p>
                  <p className="vs-text vs-text--caption vs-text--tone-subtle">Subtle caption helper (.vs-text--caption .vs-text--tone-subtle)</p>

                  <div className="vs-showcase-divider-demo">
                    <span className="vs-text vs-text--mono">1920 × 1080</span>
                    <span className="vs-divider vs-divider--vertical" />
                    <span className="vs-text vs-text--mono vs-text--tone-accent">60 FPS WebGPU</span>
                    <span className="vs-divider vs-divider--vertical" />
                    <kbd className="vs-kbd">Ctrl+K</kbd>
                  </div>

                  <hr className="vs-divider vs-divider--horizontal" />

                  <div className="vs-cluster vs-cluster--sm">
                    <span className="vs-badge vs-badge--neutral vs-badge--sm">Neutral SM</span>
                    <span className="vs-badge vs-badge--accent vs-badge--md"><span className="vs-badge__dot" />Accent MD</span>
                    <span className="vs-badge vs-badge--cyan vs-badge--md"><span className="vs-badge__dot" />Blue MD</span>
                    <span className="vs-badge vs-badge--success vs-badge--md">Success</span>
                    <span className="vs-badge vs-badge--warning vs-badge--md">Warning</span>
                    <span className="vs-badge vs-badge--danger vs-badge--md">Danger</span>
                    <span className="vs-badge vs-badge--outline vs-badge--lg">Outline LG</span>
                  </div>
                </div>
              </div>

              {/* Alerts, Loaders & Upload Card */}
              <div className="vs-card vs-card--glass">
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Alerts, Toast &amp; Media States</h3>
                    <p className="vs-card__subtitle">Semantic alert banners, spinners, skeletons &amp; dropzone</p>
                  </div>
                  <button
                    type="button"
                    data-testid="trigger-toast-btn"
                    className="vs-btn vs-btn--tonal vs-btn--sm vs-btn--pill"
                    onClick={() => showToast('Toast triggered via .vs-toast.is-visible')}
                  >
                    Show Toast
                  </button>
                </div>
                <div className="vs-card__body vs-stack vs-stack--sm">
                  {alertsVisible.info && (
                    <div className="vs-alert vs-alert--info" role="status">
                      <span className="vs-alert__icon" aria-hidden="true">i</span>
                      <span className="vs-alert__content">
                        <strong className="vs-alert__title">Info:</strong>{' '}
                        <span className="vs-alert__description">Dark Futuristic tokens synced across all cards &amp; overlays.</span>
                      </span>
                      <button
                        type="button"
                        className="vs-alert__dismiss"
                        aria-label="Dismiss info alert"
                        onClick={() => setAlertsVisible((a) => ({ ...a, info: false }))}
                      >✕</button>
                    </div>
                  )}
                  {alertsVisible.success && (
                    <div className="vs-alert vs-alert--success" role="status">
                      <span className="vs-alert__icon" aria-hidden="true">✓</span>
                      <span className="vs-alert__content">
                        <strong className="vs-alert__title">Success:</strong>{' '}
                        <span className="vs-alert__description">All 40 Vanilla CSS modules verified cleanly.</span>
                      </span>
                    </div>
                  )}
                  {alertsVisible.warning && (
                    <div className="vs-alert vs-alert--warning" role="status">
                      <span className="vs-alert__icon" aria-hidden="true">!</span>
                      <span className="vs-alert__content">
                        <strong className="vs-alert__title">Warning:</strong>{' '}
                        <span className="vs-alert__description">WCAG AA contrast verified on #080D18, #111827 &amp; #1E293B surfaces.</span>
                      </span>
                    </div>
                  )}
                  {alertsVisible.error && (
                    <div className="vs-alert vs-alert--error" role="alert">
                      <span className="vs-alert__icon" aria-hidden="true">×</span>
                      <span className="vs-alert__content">
                        <strong className="vs-alert__title">Error / Danger:</strong>{' '}
                        <span className="vs-alert__description">Supports both .vs-alert--danger and .vs-alert--error.</span>
                      </span>
                    </div>
                  )}

                  {!alertsVisible.info && (
                    <button
                      type="button"
                      className="vs-btn vs-btn--ghost vs-btn--sm"
                      onClick={() => setAlertsVisible((a) => ({ ...a, info: true }))}
                    >
                      Restore Info Alert
                    </button>
                  )}

                  <div className="vs-flex vs-flex--between">
                    <div className="vs-cluster vs-cluster--sm">
                      <span className="vs-spinner vs-spinner--sm" aria-label="Loading small" />
                      <span className="vs-spinner" aria-label="Loading medium" />
                      <span className="vs-spinner vs-spinner--lg" aria-label="Loading large" />
                    </div>
                    <div className="vs-showcase-skeleton-row vs-w-full">
                      <div className="vs-skeleton vs-showcase-skeleton-avatar" />
                      <div className="vs-showcase-skeleton-lines">
                        <div className="vs-skeleton vs-showcase-skeleton-line" />
                        <div className="vs-skeleton vs-showcase-skeleton-line vs-showcase-skeleton-line--short" />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`vs-upload-dropzone ${dropzoneDragging ? 'is-dragging' : ''}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDropzoneDragging(true);
                    }}
                    onDragLeave={() => setDropzoneDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDropzoneDragging(false);
                      showToast('Dropzone received asset preview');
                    }}
                  >
                    <span className="vs-upload-dropzone__title">Drop GLB / HDRI Texture Here</span>
                    <span className="vs-upload-dropzone__hint">`.vs-upload-dropzone` interactive drag state</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Data Tables & Pagination (03-patterns/tables.css) */}
          <section id="tables" className="vs-showcase-section" aria-labelledby="sec-tables-title">
            <div className="vs-showcase-section__head">
              <span className="vs-label vs-label--tone-accent">03 · Data Display</span>
              <h2 id="sec-tables-title" className="vs-heading vs-heading--section">
                Responsive Data Table &amp; Pagination
              </h2>
            </div>

            <div className="vs-card vs-card--glass">
              <div className="vs-card__header">
                <div className="vs-card__heading">
                  <h3 className="vs-card__title">CSS Module Inventory &amp; Contrast Audit</h3>
                  <p className="vs-card__subtitle">Sortable `.vs-table` with responsive horizontal scroll wrapper &amp; `.vs-pagination`</p>
                </div>
                <span className="vs-badge vs-badge--success vs-badge--sm">{sortedRows.length} modules</span>
              </div>

              <div className="vs-card__body">
                <div className="vs-table">
                  <div className="vs-table__toolbar">
                    <div className="vs-input__search-wrap vs-showcase-table-search">
                      <span className="vs-input__icon" aria-hidden="true">⌕</span>
                      <input
                        type="search"
                        aria-label="Filter CSS modules"
                        data-testid="table-search-input"
                        className="vs-input"
                        placeholder="Filter by file or layer..."
                        value={tableQuery}
                        onChange={(e) => {
                          setTableQuery(e.target.value);
                          setTablePage(1);
                        }}
                      />
                    </div>

                    <div className="vs-cluster vs-cluster--xs" role="group" aria-label="Filter by category">
                      {(['all', 'Primitives', 'Patterns', 'Layouts'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`vs-btn vs-btn--sm vs-btn--pill ${tableCategory === cat ? 'vs-btn--primary' : 'vs-btn--secondary'}`}
                          onClick={() => {
                            setTableCategory(cat);
                            setTablePage(1);
                          }}
                        >
                          {cat === 'all' ? 'All' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="vs-table__scroll" tabIndex={0} aria-label="CSS Modules table scroll region">
                    <table className="vs-table__element" data-testid="kit-data-table">
                      <thead>
                        <tr>
                          <th className="vs-table__th" scope="col">
                            <button
                              type="button"
                              data-testid="sort-module-btn"
                              className={`vs-table__sort ${tableSortField === 'module' ? 'is-sorted' : ''}`}
                              onClick={() => handleSortColumn('module')}
                            >
                              <span>Module</span>
                              <span aria-hidden="true">{tableSortField === 'module' ? (tableSortAsc ? '↑' : '↓') : '↕'}</span>
                            </button>
                          </th>
                          <th className="vs-table__th" scope="col">
                            <button
                              type="button"
                              className={`vs-table__sort ${tableSortField === 'category' ? 'is-sorted' : ''}`}
                              onClick={() => handleSortColumn('category')}
                            >
                              <span>Category</span>
                              <span aria-hidden="true">{tableSortField === 'category' ? (tableSortAsc ? '↑' : '↓') : '↕'}</span>
                            </button>
                          </th>
                          <th className="vs-table__th" scope="col">Cascade Layer</th>
                          <th className="vs-table__th" scope="col">WCAG Status</th>
                          <th className="vs-table__th vs-table__th--right" scope="col">
                            <button
                              type="button"
                              className={`vs-table__sort ${tableSortField === 'sizeKb' ? 'is-sorted' : ''}`}
                              onClick={() => handleSortColumn('sizeKb')}
                            >
                              <span>Raw Size</span>
                              <span aria-hidden="true">{tableSortField === 'sizeKb' ? (tableSortAsc ? '↑' : '↓') : '↕'}</span>
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedRows.length === 0 ? (
                          <tr className="vs-table__row">
                            <td className="vs-table__td" colSpan={5}>
                              No CSS modules match the active search filter.
                            </td>
                          </tr>
                        ) : (
                          pagedRows.map((row) => (
                            <tr key={row.id} className="vs-table__row">
                              <td className="vs-table__td vs-table__td--primary">{row.module}</td>
                              <td className="vs-table__td">{row.category}</td>
                              <td className="vs-table__td vs-table__td--mono">{row.layer}</td>
                              <td className="vs-table__td">
                                <span className={`vs-badge vs-badge--${row.variant} vs-badge--sm`}>
                                  {row.status} ({row.contrast})
                                </span>
                              </td>
                              <td className="vs-table__td vs-table__td--right vs-table__td--mono">
                                {row.sizeKb.toFixed(1)} KB
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="vs-pagination" data-testid="table-pagination">
                    <span className="vs-pagination__info">
                      Page <strong>{safePage}</strong> of <strong>{totalPages}</strong> · Showing {pagedRows.length} of {sortedRows.length}
                    </span>
                    <div className="vs-pagination__pages">
                      <button
                        type="button"
                        className="vs-pagination__btn"
                        disabled={safePage <= 1}
                        onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                      >Prev</button>
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`vs-pagination__btn ${safePage === pageNum ? 'is-active' : ''}`}
                          onClick={() => setTablePage(pageNum)}
                        >{pageNum}</button>
                      ))}
                      <button
                        type="button"
                        className="vs-pagination__btn"
                        disabled={safePage >= totalPages}
                        onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                      >Next</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: Forms, Inputs, Textareas & Dropdowns */}
          <section id="forms" className="vs-showcase-section" aria-labelledby="sec-forms-title">
            <div className="vs-showcase-section__head">
              <span className="vs-label vs-label--tone-accent">04 · Data Entry</span>
              <h2 id="sec-forms-title" className="vs-heading vs-heading--section">
                Forms, Inputs, Steppers &amp; Dropdowns
              </h2>
            </div>

            <div className="vs-grid vs-grid--2">
              <form className="vs-card vs-card--glass vs-form" onSubmit={handleFormSubmit} noValidate>
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Structured Form Layout</h3>
                    <p className="vs-card__subtitle">Responsive 2-column `.vs-form__grid--2` with live validation</p>
                  </div>
                </div>

                <div className="vs-form__section">
                  <h4 className="vs-form__section-title">Project Specification</h4>
                  <div className="vs-form__grid vs-form__grid--2">
                    <div className="vs-form__field">
                      <div className="vs-form__label-row">
                        <label htmlFor="kit-proj-name" className="vs-form__label">
                          Model Name <span className="vs-form__required">*</span>
                        </label>
                      </div>
                      <input
                        id="kit-proj-name"
                        type="text"
                        className={`vs-input ${formHasError ? 'vs-input--error' : formSubmitted ? 'vs-input--success' : ''}`}
                        value={projectName}
                        onChange={(e) => {
                          setProjectName(e.target.value);
                          if (formHasError) setFormHasError(false);
                        }}
                        placeholder="Enter model title"
                      />
                      {formHasError ? (
                        <p className="vs-form__error">Model name is required.</p>
                      ) : formSubmitted ? (
                        <p className="vs-form__success">Valid configuration identifier.</p>
                      ) : (
                        <p className="vs-form__hint">Clear field &amp; submit to preview error state.</p>
                      )}
                    </div>

                    <div className="vs-form__field">
                      <label htmlFor="kit-scale-input" className="vs-form__label">Prefixed URL / Scale</label>
                      <div className="vs-input__group">
                        <span className="vs-input__addon">https://</span>
                        <input
                          id="kit-scale-input"
                          type="text"
                          className="vs-input"
                          defaultValue="assets.trikomi.io/v2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vs-form__field">
                  <label htmlFor="kit-search-input" className="vs-form__label">Search Input Pill</label>
                  <div className="vs-input__search-wrap">
                    <span className="vs-input__icon" aria-hidden="true">⌕</span>
                    <input
                      id="kit-search-input"
                      type="search"
                      className="vs-input"
                      placeholder="Search shaders, finishes, or HDRIs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="vs-input__shortcut">⌘K</span>
                  </div>
                </div>

                <div className="vs-form__field vs-textarea">
                  <label htmlFor="kit-notes-area" className="vs-form__label">Production Notes</label>
                  <textarea
                    id="kit-notes-area"
                    className="vs-input vs-textarea__field"
                    maxLength={140}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <span className="vs-textarea__counter">{notes.length} / 140</span>
                </div>

                <div className="vs-form__actions">
                  <button
                    type="button"
                    className="vs-btn vs-btn--ghost vs-btn--sm"
                    onClick={() => {
                      setProjectName('');
                      setFormHasError(true);
                    }}
                  >
                    Test Error State
                  </button>
                  <button type="submit" className="vs-btn vs-btn--primary vs-btn--sm vs-btn--pill">
                    Save Spec
                  </button>
                </div>
              </form>

              {/* Sliders, Steppers, Color Field & Dropdown */}
              <div className="vs-card vs-card--glass vs-stack vs-stack--md">
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Configurator Inputs &amp; Dropdowns</h3>
                    <p className="vs-card__subtitle">Range slider, numeric dimension stepper, color swatch &amp; menu</p>
                  </div>
                </div>

                <div className="vs-range">
                  <div className="vs-range__header">
                    <label htmlFor="kit-range-light" className="vs-range__label">Environment Exposure</label>
                    <span className="vs-range__value">{sliderValue}%</span>
                  </div>
                  <input
                    id="kit-range-light"
                    type="range"
                    min={0}
                    max={100}
                    className="vs-range__slider"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                  />
                </div>

                <div className="vs-form__grid vs-form__grid--2">
                  <div className="vs-form__field">
                    <span className="vs-form__label">Box Depth (cm)</span>
                    <div className="vs-stepper">
                      <button
                        type="button"
                        className="vs-stepper__btn"
                        aria-label="Decrease depth"
                        onClick={() => setStepperValue((v) => Math.max(1, v - 1))}
                      >−</button>
                      <input
                        aria-label="Depth value"
                        type="number"
                        className="vs-stepper__field"
                        value={stepperValue}
                        onChange={(e) => setStepperValue(Number(e.target.value) || 1)}
                      />
                      <button
                        type="button"
                        className="vs-stepper__btn"
                        aria-label="Increase depth"
                        onClick={() => setStepperValue((v) => v + 1)}
                      >+</button>
                    </div>
                  </div>

                  <div className="vs-form__field">
                    <label htmlFor="kit-color-hex" className="vs-form__label">Custom Coat Color</label>
                    <div className="vs-color-field">
                      <span className="vs-color-field__swatch">
                        <input
                          id="kit-color-hex"
                          type="color"
                          className="vs-color-field__input"
                          value={swatchHex}
                          onChange={(e) => setSwatchHex(e.target.value)}
                        />
                      </span>
                      <span className="vs-color-field__hex">{swatchHex}</span>
                    </div>
                  </div>
                </div>

                <div className="vs-form__field">
                  <label htmlFor="kit-disabled-input" className="vs-form__label">Disabled Input</label>
                  <input
                    id="kit-disabled-input"
                    type="text"
                    className="vs-input"
                    value="Read-only calibrated mesh lock"
                    disabled
                  />
                </div>

                <div className="vs-form__field">
                  <span className="vs-form__label">Custom BEM Dropdown (.vs-dropdown)</span>
                  <div className="vs-dropdown vs-dropdown--full">
                    <button
                      type="button"
                      data-testid="kit-dropdown-trigger"
                      className="vs-btn vs-btn--glass vs-dropdown__trigger"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="menu"
                      onClick={() => setDropdownOpen((o) => !o)}
                    >
                      <span className="vs-dropdown__trigger-content">
                        <span className="vs-dropdown__trigger-icon" aria-hidden="true">◈</span>
                        <span className="vs-dropdown__trigger-label">{selectedDropdownLabel}</span>
                      </span>
                      <span className="vs-dropdown__chevron" aria-hidden="true">▾</span>
                    </button>

                    <div
                      className={`vs-dropdown__menu ${dropdownOpen ? 'is-open' : ''}`}
                      role="menu"
                      data-testid="kit-dropdown-menu"
                    >
                      <div className="vs-dropdown__header">
                        <div className="vs-flex vs-flex--between">
                          <span className="vs-text vs-text--small vs-text--tone-accent">Shader Presets</span>
                          <span className="vs-dropdown__count">{DROPDOWN_OPTIONS.length}</span>
                        </div>
                      </div>
                      <div className="vs-dropdown__group">
                        <div className="vs-dropdown__group-label">Material Graph</div>
                        {DROPDOWN_OPTIONS.map((opt, idx) => (
                          <div key={opt.value}>
                            {idx === DROPDOWN_OPTIONS.length - 1 && <div className="vs-dropdown__divider" />}
                            <button
                              type="button"
                              role="menuitem"
                              className={`vs-dropdown__item ${selectedMaterial === opt.value ? 'is-selected' : ''} ${opt.danger ? 'is-danger' : ''}`}
                              onClick={() => {
                                if (opt.danger) {
                                  setSelectedMaterial('pbr-metallic');
                                  showToast('Shader reset to PBR Metallic');
                                } else {
                                  setSelectedMaterial(opt.value);
                                }
                                setDropdownOpen(false);
                              }}
                            >
                              <span>{opt.label}</span>
                              {opt.shortcut ? (
                                <span className="vs-dropdown__kbd">{opt.shortcut}</span>
                              ) : selectedMaterial === opt.value ? (
                                <span className="vs-dropdown__check">✓</span>
                              ) : null}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: Selection Controls */}
          <section id="selection" className="vs-showcase-section" aria-labelledby="sec-selection-title">
            <div className="vs-showcase-section__head">
              <span className="vs-label vs-label--tone-accent">05 · Selection &amp; Controls</span>
              <h2 id="sec-selection-title" className="vs-heading vs-heading--section">
                Tabs, Switches, Checkboxes, Radios &amp; Tool Rail
              </h2>
            </div>

            <div className="vs-grid vs-grid--3">
              {/* Tabs + Vertical Rail */}
              <div className="vs-card vs-card--glass">
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Segmented Tabs &amp; Rail</h3>
                  </div>
                </div>
                <div className="vs-card__body vs-stack vs-stack--md">
                  <div className="vs-tabs">
                    <div className="vs-tabs__list" role="tablist" aria-label="Inspector sections">
                      {(['materials', 'lighting', 'camera'] as const).map((tabKey) => (
                        <button
                          key={tabKey}
                          type="button"
                          role="tab"
                          aria-selected={activeTab === tabKey}
                          className={`vs-tabs__pill ${activeTab === tabKey ? 'is-active' : ''}`}
                          onClick={() => setActiveTab(tabKey)}
                        >
                          {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="vs-card vs-card--compact vs-card--stage" role="tabpanel">
                      <p className="vs-text vs-text--small">
                        Active Panel: <strong className="vs-text--tone-accent">{activeTab}</strong> presets loaded.
                      </p>
                    </div>
                  </div>

                  <div className="vs-flex vs-flex--between">
                    <nav className="vs-rail" aria-label="Tool rail">
                      {([
                        { id: 'orbit', icon: '◎', label: 'Orbit' },
                        { id: 'measure', icon: '📏', label: 'Measure' },
                        { id: 'material', icon: '◆', label: 'PBR' }
                      ] as const).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`vs-rail__item ${activeRailTool === item.id ? 'is-active' : ''}`}
                          onClick={() => setActiveRailTool(item.id)}
                        >
                          <span aria-hidden="true">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </nav>
                    <div className="vs-stack vs-stack--xs">
                      <span className="vs-label vs-label--tone-muted">Active Tool</span>
                      <span className="vs-badge vs-badge--accent vs-badge--md">{activeRailTool}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Switches */}
              <div className="vs-card vs-card--glass">
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Toggle Switches</h3>
                    <p className="vs-card__subtitle">Interactive, described &amp; disabled `.vs-switch` controls</p>
                  </div>
                </div>
                <div className="vs-card__body vs-stack vs-stack--md">
                  <label className="vs-choice vs-choice--between vs-choice--described">
                    <span className="vs-choice__copy">
                      <span className="vs-choice__label">Auto-Rotate Turntable</span>
                      <span className="vs-choice__description">Orbits 3D product smoothly at 12°/s</span>
                    </span>
                    <span className="vs-switch">
                      <input
                        type="checkbox"
                        className="vs-switch__input"
                        checked={switchAutoRotate}
                        onChange={(e) => setSwitchAutoRotate(e.target.checked)}
                      />
                      <span className="vs-switch__track" />
                    </span>
                  </label>

                  <label className="vs-choice vs-choice--between">
                    <span className="vs-choice__label">Show Calibration Grid</span>
                    <span className="vs-switch">
                      <input
                        type="checkbox"
                        className="vs-switch__input"
                        checked={switchGrid}
                        onChange={(e) => setSwitchGrid(e.target.checked)}
                      />
                      <span className="vs-switch__track" />
                    </span>
                  </label>

                  <label className="vs-choice vs-choice--between">
                    <span className="vs-choice__label vs-text--tone-subtle">WebGPU Locked (Disabled)</span>
                    <span className="vs-switch">
                      <input
                        type="checkbox"
                        className="vs-switch__input"
                        checked
                        disabled
                        readOnly
                      />
                      <span className="vs-switch__track" />
                    </span>
                  </label>
                </div>
              </div>

              {/* Checkboxes & Radios */}
              <div className="vs-card vs-card--glass">
                <div className="vs-card__header">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Checkboxes &amp; Radios</h3>
                    <p className="vs-card__subtitle">Multi-select rendering flags &amp; quality radios</p>
                  </div>
                </div>
                <div className="vs-card__body vs-stack vs-stack--sm">
                  <label className="vs-choice">
                    <input
                      type="checkbox"
                      className="vs-checkbox"
                      checked={checkboxShadows}
                      onChange={(e) => setCheckboxShadows(e.target.checked)}
                    />
                    <span className="vs-choice__label">Contact Ground Shadows</span>
                  </label>

                  <label className="vs-choice">
                    <input
                      type="checkbox"
                      className="vs-checkbox"
                      checked={checkboxBloom}
                      onChange={(e) => setCheckboxBloom(e.target.checked)}
                    />
                    <span className="vs-choice__label">ACES Filmic Bloom</span>
                  </label>

                  <label className="vs-choice">
                    <input type="checkbox" className="vs-checkbox" disabled readOnly />
                    <span className="vs-choice__label vs-text--tone-subtle">Disabled Option</span>
                  </label>

                  <hr className="vs-divider vs-divider--horizontal" />

                  <label className="vs-choice">
                    <input
                      type="radio"
                      name="kit-quality"
                      className="vs-radio"
                      checked={radioQuality === 'standard'}
                      onChange={() => setRadioQuality('standard')}
                    />
                    <span className="vs-choice__label">Standard 1x Viewport</span>
                  </label>

                  <label className="vs-choice">
                    <input
                      type="radio"
                      name="kit-quality"
                      className="vs-radio"
                      checked={radioQuality === 'ultra'}
                      onChange={() => setRadioQuality('ultra')}
                    />
                    <span className="vs-choice__label">Ultra 2x Supersampled</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: Modals, Drawers, Tooltips & Popovers */}
          <section id="overlays" className="vs-showcase-section" aria-labelledby="sec-overlays-title">
            <div className="vs-showcase-section__head">
              <span className="vs-label vs-label--tone-accent">06 · Overlays</span>
              <h2 id="sec-overlays-title" className="vs-heading vs-heading--section">
                Modals, Drawers, Popovers &amp; Tooltips
              </h2>
            </div>

            <div className="vs-card vs-card--glass">
              <div className="vs-card__body vs-flex vs-flex--between vs-flex--wrap">
                <div className="vs-cluster">
                  <button
                    type="button"
                    data-testid="section-modal-trigger"
                    className="vs-btn vs-btn--primary"
                    onClick={() => setModalOpen(true)}
                  >
                    Launch Modal Dialog
                  </button>
                  <button
                    type="button"
                    data-testid="section-drawer-trigger"
                    className="vs-btn vs-btn--outline"
                    onClick={() => setDrawerOpen(true)}
                  >
                    Launch Slide Drawer
                  </button>

                  {/* Popover Trigger */}
                  <div className="vs-popover">
                    <button
                      type="button"
                      data-testid="popover-trigger"
                      className="vs-btn vs-btn--glass"
                      aria-expanded={popoverOpen}
                      onClick={() => setPopoverOpen((p) => !p)}
                    >
                      {popoverOpen ? 'Close Popover' : 'Toggle Popover'}
                    </button>
                    <div
                      className={`vs-popover__panel ${popoverOpen ? 'is-open' : ''}`}
                      role="dialog"
                      aria-label="Popover preview"
                      data-testid="popover-panel"
                    >
                      <div className="vs-stack vs-stack--xs">
                        <strong>Camera Telemetry</strong>
                        <span className="vs-text vs-text--caption vs-text--tone-muted">
                          FOV 42° · Orbit damping 0.08 · PBR studio env active.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tooltip Trigger (Hover + Focus + Click Pin) */}
                <div className="vs-tooltip">
                  <button
                    type="button"
                    data-testid="tooltip-trigger"
                    className="vs-btn vs-btn--tonal vs-btn--pill"
                    onMouseEnter={() => setTooltipHovered(true)}
                    onMouseLeave={() => setTooltipHovered(false)}
                    onFocus={() => setTooltipHovered(true)}
                    onBlur={() => setTooltipHovered(false)}
                    onClick={() => setTooltipPinned((p) => !p)}
                  >
                    Hover or Click Tooltip
                  </button>
                  <span
                    className={`vs-tooltip__bubble vs-tooltip__bubble--end ${(tooltipHovered || tooltipPinned) ? 'is-visible' : ''}`}
                    role="tooltip"
                    data-testid="tooltip-bubble"
                  >
                    CSS Module Kit Tooltip (.vs-tooltip__bubble)
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: Layouts, Spacing, Responsive Utilities & Configurator Modules */}
          <section id="layouts" className="vs-showcase-section" aria-labelledby="sec-layouts-title">
            <div className="vs-showcase-section__head">
              <span className="vs-label vs-label--tone-accent">07 · Architecture &amp; Configurator Chrome</span>
              <h2 id="sec-layouts-title" className="vs-heading vs-heading--section">
                Grid, Flex, Spacing, Responsive Utilities &amp; 3D HUD Stage
              </h2>
            </div>

            <div className="vs-stack vs-stack--lg">
              {/* Responsive Grid & Visibility Demo */}
              <div className="vs-card vs-card--glass">
                <div className="vs-card__header vs-stack-mobile">
                  <div className="vs-card__heading">
                    <h3 className="vs-card__title">Grid, Flex, Spacing &amp; Responsive Utilities</h3>
                    <p className="vs-card__subtitle">`.vs-grid--4`, `.vs-stack`, `.vs-cluster`, `.vs-hide-tablet`, `.vs-hide-mobile`, `.vs-show-mobile`</p>
                  </div>
                  <div className="vs-cluster vs-cluster--sm">
                    <span className="vs-badge vs-badge--accent vs-badge--sm vs-hide-tablet">Desktop (&gt;1024px)</span>
                    <span className="vs-badge vs-badge--warning vs-badge--sm vs-hide-mobile">Wide (&gt;768px)</span>
                    <span className="vs-badge vs-badge--success vs-badge--sm vs-show-mobile">Mobile Active (&lt;=768px)</span>
                  </div>
                </div>

                <div className="vs-card__body vs-stack vs-stack--md">
                  <div className="vs-grid vs-grid--4 vs-grid--tight">
                    <div className="vs-showcase-spacing-box">Col 1 · gap: space-3</div>
                    <div className="vs-showcase-spacing-box">Col 2 · 4-col desktop</div>
                    <div className="vs-showcase-spacing-box">Col 3 · 2-col tablet</div>
                    <div className="vs-showcase-spacing-box">Col 4 · 1-col mobile</div>
                  </div>

                  <div className="vs-flex vs-flex--between vs-stack-mobile">
                    <div className="vs-cluster vs-cluster--xs">
                      <span className="vs-showcase-chip-row">
                        <span className="vs-badge vs-badge--neutral vs-badge--sm">--vs-space-2</span>
                        <span className="vs-badge vs-badge--neutral vs-badge--sm">--vs-space-4</span>
                        <span className="vs-badge vs-badge--neutral vs-badge--sm">--vs-space-6</span>
                      </span>
                    </div>
                    <button type="button" className="vs-btn vs-btn--secondary vs-btn--sm vs-full-mobile">
                      Responsive Full-Mobile Button (.vs-full-mobile)
                    </button>
                  </div>
                </div>
              </div>

              {/* Configurator Module Preview Stage (05-configurator/*) */}
              <div className="vs-showcase-hud-stage" aria-label="Configurator modules live preview stage">
                <div className="vs-showcase-hud-stage__orb" aria-hidden="true" />

                {/* Measurement Projection Tag + Hotspot Pin */}
                <span className="vs-cfg-measure-tag vs-showcase-measure--x">W: 42.0 cm</span>
                <span className="vs-cfg-measure-tag vs-showcase-measure--y">H: 18.5 cm</span>
                <button
                  type="button"
                  className="vs-cfg-hotspot vs-showcase-hotspot-pin"
                  aria-label="Inspect material hotspot"
                  onClick={() => setStageDrawerCollapsed(false)}
                />

                {/* Canvas Control Toolbar */}
                <div className="vs-cfg-toolbar vs-cfg-toolbar--bottom-left vs-hide-xs">
                  <button
                    type="button"
                    className="vs-cfg-toolbar__btn is-active"
                    aria-label="Orbit tool"
                  >◎</button>
                  <button
                    type="button"
                    className="vs-cfg-toolbar__btn"
                    aria-label="Wireframe"
                  >❖</button>
                  <span className="vs-cfg-toolbar__divider" />
                  <button
                    type="button"
                    className="vs-cfg-toolbar__btn"
                    aria-label="Collapse drawer"
                    onClick={() => setStageDrawerCollapsed((c) => !c)}
                  >⇄</button>
                </div>

                {/* Configurator Inspector Drawer + Swatches */}
                <aside
                  className={`vs-cfg-drawer vs-cfg-drawer--right ${stageDrawerCollapsed ? 'is-collapsed' : ''}`}
                  aria-label="Configurator inspector preview"
                >
                  <div
                    className="vs-cfg-drawer__handle"
                    role="button"
                    tabIndex={0}
                    aria-label="Toggle drawer height"
                    onClick={() => setStageDrawerCollapsed((c) => !c)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setStageDrawerCollapsed((c) => !c);
                    }}
                  />
                  <div className="vs-cfg-drawer__header">
                    <div>
                      <h3 className="vs-cfg-drawer__title">Inspector HUD</h3>
                      <p className="vs-cfg-drawer__subtitle">05-configurator/inspector-drawer</p>
                    </div>
                    <button
                      type="button"
                      className="vs-icon-btn vs-icon-btn--sm"
                      aria-label="Close stage drawer"
                      onClick={() => setStageDrawerCollapsed(true)}
                    >✕</button>
                  </div>

                  <div className="vs-cfg-drawer__tabs">
                    <button
                      type="button"
                      className={`vs-cfg-drawer__tab ${stageDrawerTab === 'finish' ? 'is-active' : ''}`}
                      onClick={() => setStageDrawerTab('finish')}
                    >Finish</button>
                    <button
                      type="button"
                      className={`vs-cfg-drawer__tab ${stageDrawerTab === 'camera' ? 'is-active' : ''}`}
                      onClick={() => setStageDrawerTab('camera')}
                    >Capture</button>
                  </div>

                  <div className="vs-cfg-drawer__body vs-scroll">
                    {stageDrawerTab === 'finish' ? (
                      <div className="vs-cfg-swatches">
                        <div className="vs-cfg-swatches__header">
                          <span className="vs-cfg-swatches__title">PBR Finish</span>
                          <span className="vs-cfg-swatches__active">
                            {SWATCH_ITEMS.find((s) => s.id === activeSwatch)?.label}
                          </span>
                        </div>
                        <div className="vs-cfg-swatches__grid">
                          {SWATCH_ITEMS.map((sw) => (
                            <button
                              key={sw.id}
                              type="button"
                              className={`vs-cfg-swatch ${activeSwatch === sw.id ? 'is-selected' : ''}`}
                              onClick={() => setActiveSwatch(sw.id)}
                            >
                              <span className={`vs-cfg-swatch__orb ${sw.cls}`} />
                              <span className="vs-cfg-swatch__name">{sw.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="vs-stack vs-stack--sm">
                        <div className="vs-cfg-capture-bar">
                          <button
                            type="button"
                            className={`vs-cfg-record-btn ${recordingActive ? 'is-recording' : ''}`}
                            aria-label="Toggle capture recording"
                            onClick={() => setRecordingActive((r) => !r)}
                          >
                            <span className="vs-cfg-record-btn__dot" />
                          </button>
                          <span className="vs-text vs-text--small">
                            {recordingActive ? 'Recording…' : 'Ready to Capture'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </aside>

                {/* Bottom Floating Control Dock */}
                <div className="vs-cfg-dock vs-cfg-dock--bottom">
                  {dockPopoverOpen && (
                    <div className="vs-cfg-dock__popover">
                      <div className="vs-flex vs-flex--between">
                        <span className="vs-text vs-text--small">Dock Popover (.vs-cfg-dock__popover)</span>
                        <button
                          type="button"
                          className="vs-btn vs-btn--ghost vs-btn--sm"
                          onClick={() => setDockPopoverOpen(false)}
                        >✕</button>
                      </div>
                    </div>
                  )}
                  <div className="vs-cfg-dock__pill">
                    {(['presets', 'studio', 'export'] as const).map((dKey) => (
                      <button
                        key={dKey}
                        type="button"
                        className={`vs-cfg-dock__tab ${dockTab === dKey ? 'is-active' : ''}`}
                        onClick={() => {
                          setDockTab(dKey);
                          setDockPopoverOpen((prev) => dKey === dockTab ? !prev : true);
                        }}
                      >
                        <span>{dKey.charAt(0).toUpperCase() + dKey.slice(1)}</span>
                        {dKey === 'presets' && <span className="vs-cfg-dock__tab-badge">6</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Showcase Footer */}
          <footer
            className="vs-showcase-footer"
            role="contentinfo"
            data-testid="showcase-footer"
          >
            <div className="vs-showcase-footer__brand">
              <a
                href="https://victorshell.com"
                target="_blank"
                rel="noopener noreferrer"
                className="vs-showcase-footer__logo-link"
                aria-label="VictorShell Official Website"
                data-testid="showcase-footer-logo-link"
              >
                <img
                  src={victorshellLogoUrl}
                  alt="VictorShell"
                  width={369}
                  height={84}
                  className="vs-showcase-footer__logo"
                  data-testid="showcase-footer-logo"
                />
              </a>
              <p
                className="vs-showcase-footer__copyright"
                data-testid="showcase-footer-copyright"
              >
                © 2026 VictorShell. All rights reserved.
              </p>
            </div>

            <div className="vs-showcase-footer__social-wrap">
              <span className="vs-showcase-footer__social-label">
                Connect with VictorShell
              </span>
              <nav
                className="vs-showcase-footer__social-list"
                aria-label="VictorShell official social links"
              >
                {VERIFIED_SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vs-showcase-footer__social-link"
                    aria-label={item.label}
                    title={item.label}
                    data-testid={`footer-social-${item.id}`}
                  >
                    {item.icon}
                  </a>
                ))}
              </nav>
            </div>
          </footer>
          </div>
        </main>
      </div>

      {/* Modal Overlay (.vs-modal__backdrop & .vs-modal__panel) */}
      <div
        className={`vs-modal__backdrop ${modalOpen ? 'is-open' : ''}`}
        aria-hidden={!modalOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalOpen(false);
        }}
      >
        <div
          className="vs-modal__panel vs-modal__panel--md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="showcase-modal-title"
          data-testid="showcase-modal-dialog"
        >
          <div className="vs-modal__header">
            <div className="vs-modal__heading">
              <h2 id="showcase-modal-title" className="vs-modal__title">CSS Module Kit Modal</h2>
              <p className="vs-modal__subtitle">Styled by 03-patterns/dialogs.css inside @layer vs.patterns</p>
            </div>
            <button
              type="button"
              className="vs-icon-btn vs-icon-btn--sm"
              aria-label="Close modal"
              onClick={() => setModalOpen(false)}
            >✕</button>
          </div>
          <div className="vs-modal__body vs-stack vs-stack--sm">
            <p className="vs-text vs-text--body">
              Verifies dark backdrop scrim, elevated modal panel styling, active preset theme inheritance, and responsive mobile bottom-sheet transformation below 768px.
            </p>
            <div className="vs-alert vs-alert--info">
              <span className="vs-alert__icon" aria-hidden="true">i</span>
              <span className="vs-alert__content">
                <strong className="vs-alert__title">Active Mode:</strong>{' '}
                <span className="vs-alert__description">{themeMode} · tone={preset === 'showcase-cobalt' ? 'blue' : 'cyan'} · preset={preset}</span>
              </span>
            </div>
          </div>
          <div className="vs-modal__footer">
            <button type="button" className="vs-btn vs-btn--glass vs-btn--sm" onClick={() => setModalOpen(false)}>
              Close
            </button>
            <button
              type="button"
              className="vs-btn vs-btn--primary vs-btn--sm vs-btn--pill"
              onClick={() => {
                setModalOpen(false);
                showToast('Modal action confirmed');
              }}
            >
              Confirm Spec
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Drawer (.vs-drawer__backdrop & .vs-drawer__panel) */}
      <div
        className={`vs-drawer__backdrop ${drawerOpen ? 'is-open' : ''}`}
        aria-hidden={!drawerOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setDrawerOpen(false);
            setHeaderDrawerOpen(false);
          }
        }}
      >
        <div
          className="vs-drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="showcase-drawer-title"
          data-testid="showcase-drawer-panel"
        >
          <div className="vs-drawer__header">
            <div className="vs-drawer__heading">
              <h2 id="showcase-drawer-title" className="vs-drawer__title">Theme &amp; Kit Controls</h2>
              <p className="vs-drawer__subtitle">03-patterns/dialogs.css slide-over drawer</p>
            </div>
            <button
              type="button"
              className="vs-icon-btn vs-icon-btn--sm"
              aria-label="Close drawer"
              onClick={() => {
                setDrawerOpen(false);
                setHeaderDrawerOpen(false);
              }}
            >✕</button>
          </div>
          <div className="vs-drawer__body vs-stack vs-stack--md">
            <div className="vs-form__field">
              <span className="vs-form__label">Accent Tone</span>
              <div className="vs-cluster vs-cluster--sm">
                {([
                  { id: 'showcase-dark', label: 'Cyber Cyan' },
                  { id: 'showcase-cobalt', label: 'Cobalt Blue' }
                ] as const).map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    className={`vs-btn vs-btn--sm vs-btn--pill ${preset === tone.id ? 'vs-btn--primary' : 'vs-btn--glass'}`}
                    onClick={() => setPreset(tone.id)}
                  >{tone.label}</button>
                ))}
              </div>
            </div>

            <div className="vs-form__field">
              <span className="vs-form__label">Dark Theme Preset</span>
              <div className="vs-stack vs-stack--xs">
                {(['showcase-dark', 'showcase-cobalt', 'dark-indigo', 'dark-cyan'] as const).map((pre) => (
                  <button
                    key={pre}
                    type="button"
                    className={`vs-btn vs-btn--sm ${preset === pre ? 'vs-btn--primary' : 'vs-btn--secondary'}`}
                    onClick={() => setPreset(pre)}
                  >{pre}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="vs-drawer__footer">
            <button
              type="button"
              className="vs-btn vs-btn--primary vs-btn--sm vs-btn--pill"
              onClick={() => {
                setDrawerOpen(false);
                setHeaderDrawerOpen(false);
              }}
            >Done</button>
          </div>
        </div>
      </div>

      {/* Toast Banner (.vs-toast) */}
      <div
        className={`vs-toast ${toastMessage ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
        data-testid="showcase-toast"
      >
        <span className="vs-status__dot" aria-hidden="true" />
        <span>{toastMessage ?? ''}</span>
      </div>
    </div>
  );
}

function ShowcaseRoot() {
  return (
    <VictorShellThemeProvider initialAccent="indigo" initialThemeMode="dark">
      <CssModuleKitShowcase />
    </VictorShellThemeProvider>
  );
}

// Clear stale light-mode preferences before ThemeProvider hydrates
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    window.localStorage.setItem('vs_theme_mode', 'dark');
    window.localStorage.setItem('vs_theme_accent', 'indigo');
  } catch {
    // Ignore storage errors
  }
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('CSS Module Kit showcase root element not found.');
createRoot(rootEl).render(<ShowcaseRoot />);
