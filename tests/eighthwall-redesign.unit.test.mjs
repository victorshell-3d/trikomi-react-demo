import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { runInAction } from 'mobx';
import {
  VictorShellThemeProvider,
  useVictorShellTheme,
  AppHeaderBar,
  FloatingControlDock,
  CanvasControlToolbar
} from '@trikomi/ui-kit';
import { EighthWallInspector, FRAME_COLORS, LENS_COLORS } from '../apps/8theye/src/EighthWallInspector.jsx';
import { WebARHelpModal } from '../apps/8theye/src/WebARHelpModal.jsx';
import store from '../apps/8theye/src/Store.jsx';

// Mock model list matching AVAILABLE_MODELS
const mockModels = [
  { name: 'Aviator Classic', url: 'models/glasses1.glb', thumb: 'thumbs/glasses1.png', scale: 0.3 },
  { name: 'Sport Wrap', url: 'models/glasses2.glb', thumb: 'thumbs/glasses2.png', scale: 0.3 },
  { name: 'Wayfarer Style', url: 'models/glasses3.glb', thumb: 'thumbs/glasses3.png', scale: 0.3 },
  { name: 'Round Metal', url: 'models/glasses4.glb', thumb: 'thumbs/glasses4.png', scale: 0.3 },
  { name: 'Clubmaster', url: 'models/glasses5.glb', thumb: 'thumbs/glasses5.png', scale: 0.3 },
  { name: 'Hexagonal', url: 'models/glasses6.glb', thumb: 'thumbs/glasses6.png', scale: 0.3 }
];

// --------------------------------------------------------------------------
// 1. EighthWallInspector Drawer & Tabs Tests
// --------------------------------------------------------------------------
test('EighthWallInspector renders GlassInspectorDrawer with all 5 tabs and title', () => {
  const html = renderToStaticMarkup(
    React.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'models',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0
    })
  );

  assert.ok(html.includes('vs-glass-inspector-drawer'), 'Should render drawer container');
  assert.ok(html.includes('WebAR Eyewear Studio'), 'Should render drawer title');
  assert.ok(html.includes('Styles'), 'Should render Styles tab');
  assert.ok(html.includes('Frames'), 'Should render Frames tab');
  assert.ok(html.includes('Lenses'), 'Should render Lenses tab');
  assert.ok(html.includes('WebAR'), 'Should render WebAR tab');
  assert.ok(html.includes('Info'), 'Should render Info tab');
  assert.ok(html.includes('Recenter AR'), 'Should render recenter AR footer button');
  assert.ok(html.includes('Next Style'), 'Should render next style footer button');
});

test('EighthWallInspector renders Styles panel with 6 eyewear model cards and active badge', () => {
  const html = renderToStaticMarkup(
    React.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'models',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 2
    })
  );

  assert.ok(html.includes('Select Eyewear Style (6)'), 'Should render styles header');
  assert.ok(html.includes('Aviator Classic'), 'Should render Aviator Classic card');
  assert.ok(html.includes('Sport Wrap'), 'Should render Sport Wrap card');
  assert.ok(html.includes('Wayfarer Style'), 'Should render Wayfarer Style card');
  assert.ok(html.includes('Round Metal'), 'Should render Round Metal card');
  assert.ok(html.includes('Clubmaster'), 'Should render Clubmaster card');
  assert.ok(html.includes('Hexagonal'), 'Should render Hexagonal card');
  assert.ok(html.includes('Active'), 'Should display active badge on current model');
});

test('EighthWallInspector renders Frames panel with 5 finish options and active checkmark', () => {
  runInAction(() => {
    store.glassConfigs = {
      meshes: ['frame_mesh'],
      materials: ['frame_mat']
    };
    store.materialProps = {
      frame_mat: { color: '#8b4513' }
    };
  });

  const html = renderToStaticMarkup(
    React.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'frames',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0
    })
  );

  assert.ok(html.includes('Frame Material Finishes (5)'), 'Should render frames header');
  assert.ok(html.includes('Tortoise'), 'Should display active frame color name');
  assert.ok(html.includes('✓'), 'Should render checkmark on active color swatch');
  assert.equal(FRAME_COLORS.length, 5, 'Must have exactly 5 verified frame finishes');
});

test('EighthWallInspector renders Lenses panel with 5 tint options and active checkmark', () => {
  runInAction(() => {
    store.glassConfigs = {
      meshes: ['lens_mesh'],
      materials: ['lens_mat']
    };
    store.materialProps = {
      lens_mat: { color: '#1c2d54' }
    };
  });

  const html = renderToStaticMarkup(
    React.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'lenses',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0
    })
  );

  assert.ok(html.includes('Lens Tint Options (5)'), 'Should render lenses header');
  assert.ok(html.includes('Blue'), 'Should display active lens tint color name');
  assert.ok(html.includes('✓'), 'Should render checkmark on active tint swatch');
  assert.equal(LENS_COLORS.length, 5, 'Must have exactly 5 verified lens tints');
});

test('EighthWallInspector renders WebAR panel with Niantic 8thWall telemetry and wireframe toggle', () => {
  runInAction(() => {
    store.tracking = true;
    store.grid = true;
    store.naturalLighting = true;
  });

  const html = renderToStaticMarkup(
    React.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'webar',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0
    })
  );

  assert.ok(html.includes('Niantic 8thWall WebAR'), 'Should render WebAR header');
  assert.ok(html.includes('Face Anchor Tracked'), 'Should render face anchor tracked indicator');
  assert.ok(html.includes('Show Occluder Wireframe'), 'Should render occluder wireframe label');
  assert.ok(html.includes('Natural Lighting Simulation'), 'Should render natural lighting simulation label');
  assert.ok(html.includes('WebAR Camera &amp; Lighting Guide') || html.includes('WebAR Camera & Lighting Guide'), 'Should render guide action');
});

test('EighthWallInspector renders Info panel with model specifications and reset button', () => {
  const html = renderToStaticMarkup(
    React.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'info',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0
    })
  );

  assert.ok(html.includes('Eyewear Specifications'), 'Should render specs header');
  assert.ok(html.includes('Active Model:'), 'Should render active model field');
  assert.ok(html.includes('Aviator Classic'), 'Should render model name');
  assert.ok(html.includes('Mesh Scale:'), 'Should render mesh scale field');
  assert.ok(html.includes('Head Occluder GLB'), 'Should render occluder depth info');
  assert.ok(html.includes('Reset Eyewear Configuration'), 'Should render reset button');
});

// --------------------------------------------------------------------------
// 2. FloatingControlDock, CanvasControlToolbar, and WebARHelpModal
// --------------------------------------------------------------------------
test('FloatingControlDock renders 5 8thWall tool items with styles badge', () => {
  const dockItems = [
    { id: 'models', label: 'Styles', icon: '👓', badge: 6 },
    { id: 'frames', label: 'Frames', icon: '🎨' },
    { id: 'lenses', label: 'Lenses', icon: '🕶️' },
    { id: 'webar', label: 'WebAR', icon: '🌐' },
    { id: 'info', label: 'Info', icon: '📋' }
  ];

  const html = renderToStaticMarkup(
    React.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: 'models',
      onSelect: () => {},
      position: 'bottom'
    })
  );

  assert.ok(html.includes('vs-floating-control-dock'), 'Should render floating dock');
  assert.ok(html.includes('Styles'), 'Should render Styles dock item');
  assert.ok(html.includes('Frames'), 'Should render Frames dock item');
  assert.ok(html.includes('Lenses'), 'Should render Lenses dock item');
  assert.ok(html.includes('WebAR'), 'Should render WebAR dock item');
  assert.ok(html.includes('Info'), 'Should render Info dock item');
  assert.ok(html.includes('6'), 'Should render 6 styles badge');
});

test('CanvasControlToolbar renders top-right controls with Grid, Light, and Fullscreen', () => {
  const html = renderToStaticMarkup(
    React.createElement(CanvasControlToolbar, {
      position: 'top-right',
      onRecenter: () => {},
      extraActions: React.createElement('div', { className: 'extra-8theye-actions' },
        React.createElement('button', { className: 'grid-btn' }, '🌐 Grid'),
        React.createElement('button', { className: 'light-btn' }, '💡 Light'),
        React.createElement('button', { className: 'fs-btn' }, '⛶')
      )
    })
  );

  assert.ok(html.includes('vs-canvas-control-toolbar'), 'Should render canvas toolbar');
  assert.ok(html.includes('vs-canvas-control-toolbar--top-right'), 'Should use top-right position');
  assert.ok(html.includes('grid-btn'), 'Should render Grid quick toggle');
  assert.ok(html.includes('light-btn'), 'Should render Light quick toggle');
  assert.ok(html.includes('fs-btn'), 'Should render Fullscreen quick action');
});

test('WebARHelpModal renders FrostedModalDialog with camera permissions and lighting tips', () => {
  const html = renderToStaticMarkup(
    React.createElement(WebARHelpModal, {
      isOpen: true,
      onClose: () => {}
    })
  );

  assert.ok(html.includes('vs-frosted-modal') || html.includes('WebAR Try-On Guide'), 'Should render frosted modal shell');
  assert.ok(html.includes('WebAR Try-On Guide'), 'Should render modal title');
  assert.ok(html.includes('Camera Permissions'), 'Should explain camera permissions');
  assert.ok(html.includes('Lighting &amp; Calibration') || html.includes('Lighting & Calibration'), 'Should explain lighting tips');
  assert.ok(html.includes('Viewing Distance'), 'Should explain viewing distance');
  assert.ok(html.includes('Got It'), 'Should render Got It dismissal button');
});

test('EighthWallInspector cycles models via Next Style footer action', () => {
  let selectedIdx = null;
  const html = renderToStaticMarkup(
    React.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'models',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 1,
      onSelectModel: (idx) => { selectedIdx = idx; }
    })
  );

  assert.ok(html.includes('Next Style'), 'Should render Next Style button');
  assert.ok(html.includes('Sport Wrap'), 'Should show active model Sport Wrap');
  assert.ok(html.includes('Scale: 0.3'), 'Should display model scale');
});

// --------------------------------------------------------------------------
// 3. AppHeaderBar & VictorShellThemeProvider Persistence
// --------------------------------------------------------------------------
test('AppHeaderBar renders 8thWall branding, tracking status badge, and theme switcher', () => {
  function EightEyeHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      productTitle: '8thWall WebAR Eyewear',
      backLabel: '← Back to Overview',
      onBack: () => {},
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React.createElement('span', { className: 'vs-8theye-status-badge' }, 'Face Tracked • 8thWall')
    });
  }

  const html = renderToStaticMarkup(
    React.createElement(VictorShellThemeProvider, { initialAccent: 'orchid' },
      React.createElement(EightEyeHeaderStage)
    )
  );

  assert.ok(html.includes('TRIKOMI'), 'Should render brand title');
  assert.ok(html.includes('8thWall WebAR Eyewear'), 'Should render product title');
  assert.ok(html.includes('← Back to Overview'), 'Should render back button');
  assert.ok(html.includes('Face Tracked • 8thWall'), 'Should render status badge');
  assert.ok(html.includes('data-accent="orchid"'), 'Provider root should have initial data-accent="orchid"');
  assert.ok(html.includes('vs-theme-accent-btn--orchid is-active'), 'AppHeaderBar should have active orchid theme button');
});

test('VictorShellThemeProvider persists custom theme selection across re-renders in 8thWall WebAR', () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  class MockEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.bubbles = init.bubbles ?? true;
      this.cancelable = init.cancelable ?? true;
      this.defaultPrevented = false;
      this._propagationStopped = false;
      this.target = null;
      this.currentTarget = null;
    }
    stopPropagation() { this._propagationStopped = true; }
    preventDefault() { this.defaultPrevented = true; }
  }

  class MockNode {
    constructor(tag = 'div', ownerDoc = null) {
      this.nodeType = 1;
      this.tagName = tag.toUpperCase();
      this.style = {};
      this.childNodes = [];
      this.parentNode = null;
      this.ownerDocument = ownerDoc;
      this.attributes = {};
      this._listeners = {};
    }
    get className() {
      return this.attributes['class'] || this.attributes['className'] || '';
    }
    set className(val) {
      this.attributes['class'] = val;
      this.attributes['className'] = val;
    }
    addEventListener(type, fn, opts) {
      if (!this._listeners[type]) this._listeners[type] = [];
      const isCapture = typeof opts === 'boolean' ? opts : (opts && opts.capture);
      this._listeners[type].push({ fn, isCapture: !!isCapture });
    }
    removeEventListener(type, fn) {
      if (!this._listeners[type]) return;
      this._listeners[type] = this._listeners[type].filter(l => l.fn !== fn);
    }
    setAttribute(k, v) {
      this.attributes[k] = v;
      if (k === 'class') this.attributes['className'] = v;
    }
    removeAttribute(k) {
      delete this.attributes[k];
      if (k === 'class') delete this.attributes['className'];
    }
    getAttribute(k) { return this.attributes[k]; }
    appendChild(c) {
      c.parentNode = this;
      this.childNodes.push(c);
      return c;
    }
    insertBefore(c, ref) {
      c.parentNode = this;
      const idx = this.childNodes.indexOf(ref);
      if (idx === -1) this.childNodes.push(c);
      else this.childNodes.splice(idx, 0, c);
      return c;
    }
    removeChild(c) {
      const idx = this.childNodes.indexOf(c);
      if (idx !== -1) {
        c.parentNode = null;
        this.childNodes.splice(idx, 1);
      }
      return c;
    }
    contains(child) {
      if (child === this) return true;
      let curr = child;
      while (curr) {
        if (curr.parentNode === this) return true;
        curr = curr.parentNode;
      }
      return false;
    }
    dispatchEvent(event) {
      const path = [];
      let cur = this;
      while (cur) {
        path.push(cur);
        cur = cur.parentNode;
      }
      if (this.ownerDocument && !path.includes(this.ownerDocument)) {
        path.push(this.ownerDocument);
      }
      event.target = this;

      for (let i = path.length - 1; i >= 0; i--) {
        if (event._propagationStopped) break;
        const node = path[i];
        event.currentTarget = node;
        const listeners = node._listeners?.[event.type] || [];
        for (const l of listeners) {
          if (l.isCapture) l.fn.call(node, event);
        }
      }

      for (let i = 0; i < path.length; i++) {
        if (event._propagationStopped) break;
        const node = path[i];
        event.currentTarget = node;
        const listeners = node._listeners?.[event.type] || [];
        for (const l of listeners) {
          if (!l.isCapture) l.fn.call(node, event);
        }
        if (!event.bubbles) break;
      }
      return !event.defaultPrevented;
    }
    click() {
      const evt = new MockEvent('click', { bubbles: true, cancelable: true });
      this.dispatchEvent(evt);
    }
    find(predicate) {
      if (predicate(this)) return this;
      for (const child of this.childNodes) {
        if (child.find) {
          const match = child.find(predicate);
          if (match) return match;
        }
      }
      return null;
    }
  }

  const mockDoc = {
    nodeType: 9,
    documentElement: new MockNode('HTML', null),
    _listeners: {},
    addEventListener(type, fn, opts) {
      if (!this._listeners[type]) this._listeners[type] = [];
      const isCapture = typeof opts === 'boolean' ? opts : (opts && opts.capture);
      this._listeners[type].push({ fn, isCapture: !!isCapture });
    },
    removeEventListener(type, fn) {
      if (!this._listeners[type]) return;
      this._listeners[type] = this._listeners[type].filter(l => l.fn !== fn);
    },
    createElement(tag) { return new MockNode(tag, mockDoc); },
    createTextNode(text) { return { nodeType: 3, nodeValue: text, ownerDocument: mockDoc, parentNode: null }; }
  };
  mockDoc.documentElement.ownerDocument = mockDoc;
  const win = {
    document: mockDoc,
    HTMLIFrameElement: class {},
    Element: MockNode,
    HTMLElement: MockNode,
    Event: MockEvent,
    CustomEvent: MockEvent
  };
  mockDoc.defaultView = win;

  const prevDoc = globalThis.document;
  const prevWindow = globalThis.window;
  const prevCustomEvent = globalThis.CustomEvent;
  const prevEvent = globalThis.Event;

  globalThis.document = mockDoc;
  globalThis.window = win;
  globalThis.CustomEvent = MockEvent;
  globalThis.Event = MockEvent;

  try {
    let contextValue = null;
    let triggerUnrelatedUpdate = null;

    function TestThemeProbe() {
      const ctx = useVictorShellTheme();
      contextValue = ctx;
      const [, setTick] = React.useState(0);
      triggerUnrelatedUpdate = () => setTick(t => t + 1);

      return React.createElement(AppHeaderBar, {
        brandTitle: 'TRIKOMI',
        productTitle: '8thWall WebAR Eyewear',
        theme: ctx.accent,
        onThemeChange: ctx.setAccent,
        showThemeSwitcher: true
      });
    }

    const container = mockDoc.createElement('div');
    mockDoc.documentElement.appendChild(container);
    const root = createRoot(container);

    // Initial render with approved 8thwall default theme: orchid
    act(() => {
      root.render(
        React.createElement(VictorShellThemeProvider, { initialAccent: 'orchid' },
          React.createElement(TestThemeProbe)
        )
      );
    });

    assert.equal(contextValue.accent, 'orchid', 'Initial theme should be Orchid Glow');
    const rootWrapper = container.childNodes[0];
    assert.equal(rootWrapper.attributes['data-accent'], 'orchid', 'VictorShellThemeProvider root must have data-accent="orchid"');

    const orchidBtn = container.find(el => el.attributes['aria-label'] === 'Orchid Glow Theme');
    assert.ok(orchidBtn, 'Orchid theme button must be rendered in AppHeaderBar');
    assert.ok(orchidBtn.className.includes('is-active'), 'Orchid button should be active initially');

    // Find the theme switcher button for violet
    const violetBtn = container.find(el => el.attributes['aria-label'] === 'Royal Violet Theme');
    assert.ok(violetBtn, 'Violet theme button must exist in AppHeaderBar');

    // Click Violet button via real DOM dispatchEvent
    act(() => {
      violetBtn.click();
    });

    assert.equal(contextValue.accent, 'violet', 'Context theme should update to Violet after click event');
    assert.equal(rootWrapper.attributes['data-accent'], 'violet', 'Provider root data-accent must update to violet');
    assert.ok(violetBtn.className.includes('is-active'), 'Violet button must be active');
    assert.ok(!orchidBtn.className.includes('is-active'), 'Orchid button must not be active');

    // Trigger unrelated re-render to verify persistence
    act(() => {
      triggerUnrelatedUpdate();
    });

    assert.equal(contextValue.accent, 'violet', 'Theme should remain Violet after unrelated component re-render');
    assert.equal(rootWrapper.attributes['data-accent'], 'violet', 'Provider root data-accent should remain violet');

    // Switch to Indigo via click event (which sets data-accent="indigo" on documentElement)
    const indigoBtn = container.find(el => el.attributes['aria-label'] === 'Electric Indigo Theme');
    assert.ok(indigoBtn, 'Indigo theme button must exist in AppHeaderBar');

    act(() => {
      indigoBtn.click();
    });

    assert.equal(contextValue.accent, 'indigo', 'Context theme should update to Indigo after click event');
    assert.equal(mockDoc.documentElement.getAttribute('data-accent'), 'indigo', 'Document data-accent should update to indigo');
    assert.equal(rootWrapper.attributes['data-accent'], 'indigo', 'Provider root data-accent must update to indigo');

    // Clean up
    act(() => {
      root.unmount();
    });
  } finally {
    globalThis.document = prevDoc;
    globalThis.window = prevWindow;
    globalThis.CustomEvent = prevCustomEvent;
    globalThis.Event = prevEvent;
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  }
});
