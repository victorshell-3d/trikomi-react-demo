import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  VictorShellThemeProvider,
  useVictorShellTheme,
  AppHeaderBar,
  FloatingControlDock,
  CanvasControlToolbar
} from '@trikomi/ui-kit';
import { EyewearInspector } from '../apps/eyewear-tryon/src/EyewearInspector.jsx';

// Mock model data matching AVAILABLE_MODELS
const mockModels = [
  { name: 'Aviator Classic', url: 'models/glasses1.glb', thumb: 'thumbs/glasses1.png', scale: 0.3 },
  { name: 'Sport Wrap', url: 'models/glasses2.glb', thumb: 'thumbs/glasses2.png', scale: 0.3 },
  { name: 'Wayfarer Style', url: 'models/glasses3.glb', thumb: 'thumbs/glasses3.png', scale: 0.3 },
  { name: 'Round Metal', url: 'models/glasses4.glb', thumb: 'thumbs/glasses4.png', scale: 0.3 },
  { name: 'Clubmaster', url: 'models/glasses5.glb', thumb: 'thumbs/glasses5.png', scale: 0.3 },
  { name: 'Hexagonal', url: 'models/glasses6.glb', thumb: 'thumbs/glasses6.png', scale: 0.3 }
];

// Mock MobX store matching Store.jsx
function createMockStore() {
  return {
    camera: undefined,
    cameras: [
      { deviceId: 'cam-1', label: 'FaceTime HD Camera' },
      { deviceId: 'cam-2', label: 'External USB Webcam' }
    ],
    grid: false,
    tracking: true,
    mirror: true,
    loaded: true,
    naturalLighting: true,
    modelIndex: 0,
    glassConfigs: {
      meshes: ['Frame_Mesh', 'Lens_Mesh'],
      materials: ['Glasses_Frame_Mat', 'Glasses_Lens_Mat']
    },
    materialProps: {
      'Glasses_Frame_Mat': { color: '#222222', opacity: 1.0 },
      'Glasses_Lens_Mat': { color: '#111111', opacity: 0.7 }
    },
    showOccluderWireframe: false,
    showDummyGlasses: false,
    recording: false
  };
}

// --------------------------------------------------------------------------
// 1. EyewearInspector Component Tests
// --------------------------------------------------------------------------
test('EyewearInspector renders GlassInspectorDrawer with all 5 tabs and title', () => {
  const store = createMockStore();
  const html = renderToStaticMarkup(
    React.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'models',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {},
      store
    })
  );

  assert.ok(html.includes('vs-glass-inspector-drawer'), 'Should render drawer container');
  assert.ok(html.includes('Eyewear AR Studio'), 'Should render drawer title');
  assert.ok(html.includes('Aviator Classic'), 'Should render current model subtitle');
  assert.ok(html.includes('Styles (6)'), 'Should render Styles tab with model count');
  assert.ok(html.includes('Frame'), 'Should render Frame tab');
  assert.ok(html.includes('Lenses'), 'Should render Lenses tab');
  assert.ok(html.includes('Camera'), 'Should render Camera tab');
  assert.ok(html.includes('Tools'), 'Should render Tools tab');
  assert.ok(html.includes('Mirror: On'), 'Should render mirror footer toggle');
  assert.ok(html.includes('Show Occluder'), 'Should render occluder footer toggle');
});

test('EyewearInspector renders Styles model catalog with active selection badge', () => {
  const store = createMockStore();
  let selectedIndex = null;
  const html = renderToStaticMarkup(
    React.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'models',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 1,
      onSelectModel: (idx) => { selectedIndex = idx; },
      store
    })
  );

  assert.ok(html.includes('Select Eyewear Frame (6)'), 'Should render catalog header');
  assert.ok(html.includes('Aviator Classic'), 'Should render first model');
  assert.ok(html.includes('Sport Wrap'), 'Should render second model');
  assert.ok(html.includes('Wayfarer Style'), 'Should render third model');
  assert.ok(html.includes('Round Metal'), 'Should render fourth model');
  assert.ok(html.includes('Clubmaster'), 'Should render fifth model');
  assert.ok(html.includes('Hexagonal'), 'Should render sixth model');
  assert.ok(html.includes('Selected'), 'Should render Selected badge on active model');
});

test('EyewearInspector renders Frame panel with color swatches when activeTab="frames"', () => {
  const store = createMockStore();
  const html = renderToStaticMarkup(
    React.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'frames',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {},
      store
    })
  );

  assert.ok(html.includes('Frame Material &amp; Color') || html.includes('Frame Material & Color'), 'Should render frame header');
  assert.ok(html.includes('Black'), 'Should render Black frame option');
  assert.ok(html.includes('Tortoise'), 'Should render Tortoise frame option');
  assert.ok(html.includes('Silver'), 'Should render Silver frame option');
  assert.ok(html.includes('Gold'), 'Should render Gold frame option');
  assert.ok(html.includes('Clear'), 'Should render Clear frame option');
});

test('EyewearInspector renders Lenses panel with tint options when activeTab="lenses"', () => {
  const store = createMockStore();
  const html = renderToStaticMarkup(
    React.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'lenses',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {},
      store
    })
  );

  assert.ok(html.includes('Lens Tint &amp; Optics') || html.includes('Lens Tint & Optics'), 'Should render lens header');
  assert.ok(html.includes('Dark Tint'), 'Should render Dark tint');
  assert.ok(html.includes('Green Tint'), 'Should render Green tint');
  assert.ok(html.includes('Brown Tint'), 'Should render Brown tint');
  assert.ok(html.includes('Blue Tint'), 'Should render Blue tint');
  assert.ok(html.includes('Purple Tint'), 'Should render Purple tint');
});

test('EyewearInspector renders Camera panel with camera select and mirror options', () => {
  const store = createMockStore();
  const html = renderToStaticMarkup(
    React.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'camera',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {},
      store
    })
  );

  assert.ok(html.includes('AR Video &amp; Camera') || html.includes('AR Video & Camera'), 'Should render camera header');
  assert.ok(html.includes('Camera Source'), 'Should render camera source select label');
  assert.ok(html.includes('FaceTime HD Camera'), 'Should list first camera option');
  assert.ok(html.includes('External USB Webcam'), 'Should list second camera option');
  assert.ok(html.includes('Mirror Video Feed'), 'Should render mirror video checkbox');
  assert.ok(html.includes('Natural Lighting Simulation'), 'Should render natural lighting checkbox');
});

test('EyewearInspector renders Tools/Debug panel with wireframe and blendshapes controls', () => {
  const store = createMockStore();
  const html = renderToStaticMarkup(
    React.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'debug',
      onTabChange: () => {},
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {},
      store
    })
  );

  assert.ok(html.includes('Try-On Tools &amp; Developer Debug') || html.includes('Try-On Tools & Developer Debug'), 'Should render tools header');
  assert.ok(html.includes('Show Occluder Wireframe'), 'Should render occluder wireframe toggle');
  assert.ok(html.includes('Show Dummy Reference Glasses'), 'Should render dummy glasses toggle');
  assert.ok(html.includes('Show Viewport Grid'), 'Should render viewport grid toggle');
  assert.ok(html.includes('Record Blendshapes CSV'), 'Should render blendshape CSV recording button');
});

// --------------------------------------------------------------------------
// 2. FloatingControlDock & CanvasControlToolbar Integration Tests
// --------------------------------------------------------------------------
test('FloatingControlDock renders 5 eyewear control items with styles badge', () => {
  const dockItems = [
    { id: 'models', label: 'Styles', icon: '👓', badge: 6 },
    { id: 'frames', label: 'Frame', icon: '🎨' },
    { id: 'lenses', label: 'Lenses', icon: '🕶️' },
    { id: 'camera', label: 'Camera', icon: '📹' },
    { id: 'debug', label: 'Tools', icon: '⚙️' }
  ];

  const html = renderToStaticMarkup(
    React.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: 'models',
      onSelect: () => {}
    })
  );

  assert.ok(html.includes('vs-floating-control-dock'), 'Should render floating control dock');
  assert.ok(html.includes('Styles'), 'Should render Styles dock item');
  assert.ok(html.includes('Frame'), 'Should render Frame dock item');
  assert.ok(html.includes('Lenses'), 'Should render Lenses dock item');
  assert.ok(html.includes('Camera'), 'Should render Camera dock item');
  assert.ok(html.includes('Tools'), 'Should render Tools dock item');
});

test('CanvasControlToolbar renders top-right AR viewport controls without fake snapshot', () => {
  const store = createMockStore();
  const html = renderToStaticMarkup(
    React.createElement(CanvasControlToolbar, {
      position: 'top-right',
      extraActions: React.createElement('div', { className: 'extra-eyewear-actions' },
        React.createElement('button', { className: 'mirror-btn' }, '🪞'),
        React.createElement('button', { className: 'occluder-btn' }, '📐'),
        React.createElement('button', { className: 'grid-btn' }, '▦'),
        React.createElement('button', { className: 'fs-btn' }, '⛶')
      )
    })
  );

  assert.ok(html.includes('vs-canvas-control-toolbar'), 'Should render canvas toolbar');
  assert.ok(html.includes('vs-canvas-control-toolbar--top-right'), 'Should use top-right placement');
  assert.ok(html.includes('mirror-btn'), 'Should render mirror action');
  assert.ok(html.includes('occluder-btn'), 'Should render occluder wireframe action');
  assert.ok(html.includes('grid-btn'), 'Should render grid action');
  assert.ok(!html.includes('snapshot'), 'Must not render non-existent snapshot action');
  assert.ok(!html.includes('capture'), 'Must not render non-existent capture action');
});

// --------------------------------------------------------------------------
// 3. AppHeaderBar Theme Switching & Persistence Across Re-renders
// --------------------------------------------------------------------------
test('AppHeaderBar renders eyewear branding, style status badge, and theme switcher', () => {
  function EyewearHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      productTitle: 'EYEWEAR AR STUDIO',
      backLabel: '← Back to Overview',
      onBack: () => {},
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React.createElement('span', { className: 'vs-eyewear-badge' }, 'Aviator Classic')
    });
  }

  const html = renderToStaticMarkup(
    React.createElement(VictorShellThemeProvider, { initialAccent: 'indigo' },
      React.createElement(EyewearHeaderStage)
    )
  );

  assert.ok(html.includes('TRIKOMI'), 'Should render brand title');
  assert.ok(html.includes('EYEWEAR AR STUDIO'), 'Should render product title');
  assert.ok(html.includes('← Back to Overview'), 'Should render back button');
  assert.ok(html.includes('Aviator Classic'), 'Should render active eyewear status badge');
  assert.ok(html.includes('data-accent="indigo"'), 'Provider root should have initial data-accent="indigo"');
  assert.ok(html.includes('vs-theme-accent-btn--indigo is-active'), 'AppHeaderBar should have active indigo theme button');
});

test('VictorShellThemeProvider persists custom theme selection across re-renders in eyewear try-on', () => {
  // Set up minimal React act/DOM environment for real interaction testing
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
      this.isTrusted = false; // Synthetic event per W3C specification
    }
    preventDefault() { this.defaultPrevented = true; }
    stopPropagation() { this._propagationStopped = true; }
  }

  class MockDOMElement {
    constructor(tag, ownerDoc) {
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
      if (k === 'class') {
        this.attributes['className'] = v;
      }
    }
    removeAttribute(k) {
      delete this.attributes[k];
      if (k === 'class') {
        delete this.attributes['className'];
      }
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

      // Capture phase (top-down)
      for (let i = path.length - 1; i >= 0; i--) {
        if (event._propagationStopped) break;
        const node = path[i];
        event.currentTarget = node;
        const listeners = node._listeners?.[event.type] || [];
        for (const l of listeners) {
          if (l.isCapture) l.fn.call(node, event);
        }
      }

      // Bubble phase (bottom-up)
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
      const ev = new MockEvent('click', { bubbles: true, cancelable: true });
      this.dispatchEvent(ev);
    }
    find(predicate) {
      for (const child of this.childNodes) {
        if (child.nodeType === 1) {
          if (predicate(child)) return child;
          const found = child.find(predicate);
          if (found) return found;
        }
      }
      return null;
    }
  }

  const mockDoc = {
    nodeType: 9,
    documentElement: new MockDOMElement('HTML', null),
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
    createElement(tag) { return new MockDOMElement(tag, mockDoc); },
    createTextNode(text) { return { nodeType: 3, nodeValue: text, ownerDocument: mockDoc, parentNode: null }; }
  };
  mockDoc.documentElement.ownerDocument = mockDoc;
  const win = {
    document: mockDoc,
    HTMLIFrameElement: class {},
    Element: MockDOMElement,
    HTMLElement: MockDOMElement,
    Event: MockEvent
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
        productTitle: 'EYEWEAR AR STUDIO',
        theme: ctx.accent,
        onThemeChange: ctx.setAccent,
        showThemeSwitcher: true
      });
    }

    const container = mockDoc.createElement('div');
    mockDoc.documentElement.appendChild(container);
    const root = createRoot(container);

    // Initial render with default theme: indigo
    act(() => {
      root.render(
        React.createElement(VictorShellThemeProvider, { initialAccent: 'indigo' },
          React.createElement(TestThemeProbe)
        )
      );
    });

    assert.equal(contextValue.accent, 'indigo', 'Initial theme should be Electric Indigo');
    const rootWrapper = container.childNodes[0];
    assert.equal(rootWrapper.attributes['data-accent'], 'indigo', 'VictorShellThemeProvider root must have data-accent="indigo"');

    const indigoBtn = container.find(el => el.attributes['aria-label'] === 'Electric Indigo Theme');
    assert.ok(indigoBtn, 'Indigo theme button must be rendered in AppHeaderBar');
    assert.ok(indigoBtn.className.includes('is-active'), 'Indigo button should be active initially');

    // Find the theme switcher button for orchid
    const orchidBtn = container.find(el => el.attributes['aria-label'] === 'Orchid Glow Theme');
    assert.ok(orchidBtn, 'Orchid theme button must exist in AppHeaderBar');

    // Click Orchid button via real DOM dispatchEvent
    act(() => {
      orchidBtn.click();
    });

    assert.equal(contextValue.accent, 'orchid', 'Context theme should update to Orchid after real click event');
    assert.equal(mockDoc.documentElement.getAttribute('data-accent'), 'orchid', 'Document data-accent should update to orchid');
    assert.equal(rootWrapper.attributes['data-accent'], 'orchid', 'Provider root data-accent must update to orchid');
    assert.ok(orchidBtn.className.includes('is-active'), 'Orchid button must be active');
    assert.ok(!indigoBtn.className.includes('is-active'), 'Indigo button must not be active');

    // Trigger unrelated re-render to verify persistence
    act(() => {
      triggerUnrelatedUpdate();
    });

    assert.equal(contextValue.accent, 'orchid', 'Theme should remain Orchid after unrelated component re-render');
    assert.equal(mockDoc.documentElement.getAttribute('data-accent'), 'orchid', 'Document data-accent should remain orchid');

    // Switch to Violet via real click event
    const violetBtn = container.find(el => el.attributes['aria-label'] === 'Royal Violet Theme');
    assert.ok(violetBtn, 'Violet theme button must exist in AppHeaderBar');

    act(() => {
      violetBtn.click();
    });

    assert.equal(contextValue.accent, 'violet', 'Context theme should update to Violet after real click event');

    // Trigger another unrelated re-render
    act(() => {
      triggerUnrelatedUpdate();
    });

    assert.equal(contextValue.accent, 'violet', 'Theme should remain Violet after subsequent re-renders');

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
