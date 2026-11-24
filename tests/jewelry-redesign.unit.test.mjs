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
import {
  JewelryInspector,
  PRECIOUS_METALS
} from '../apps/jewelry-configurator/src/components/JewelryInspector.tsx';

// Mock ring settings matching AVAILABLE_RINGS
const mockRings = [
  { name: 'Classic Solitaire', url: 'models/ring.glb', thumb: 'thumbs/ring1.png' },
  { name: 'Halo Setting', url: 'models/ring2.glb', thumb: 'thumbs/ring2.png' }
];

// Mock diamond thumbnails map
const mockDiamondThumbs = {
  'Round': 'thumbs/round.png',
  'Princess': 'thumbs/princess.png',
  'Emerald': 'thumbs/emerald.png',
  'Oval': 'thumbs/oval.png',
  'Cushion': 'thumbs/cushion.png',
  'Pear': 'thumbs/pear.png',
  'Heart': 'thumbs/heart.png',
  'Radiant': 'thumbs/radiant.png',
  'Marquise': 'thumbs/marquise.png',
  'Asscher': 'thumbs/asscher.png'
};

// --------------------------------------------------------------------------
// 1. JewelryInspector Component Tests
// --------------------------------------------------------------------------
test('JewelryInspector renders GlassInspectorDrawer with all 5 tabs and title', () => {
  const html = renderToStaticMarkup(
    React.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'rings',
      onTabChange: () => {},
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {},
      diamondThumbs: mockDiamondThumbs,
      activeShape: 'Round',
      onSelectShape: () => {},
      zRotation: 0,
      onRotationChange: () => {},
      scale: 100,
      onScaleChange: () => {},
      yOffset: 0,
      onYOffsetChange: () => {},
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {},
      isBloomActive: true,
      onToggleBloom: () => {},
      onResetView: () => {},
      onExportGLTF: () => {}
    })
  );

  assert.ok(html.includes('vs-glass-inspector-drawer'), 'Should render drawer container');
  assert.ok(html.includes('Jewelry Studio'), 'Should render drawer title');
  assert.ok(html.includes('Classic Solitaire'), 'Should render current ring subtitle');
  assert.ok(html.includes('Setting (2)'), 'Should render Setting tab with ring count');
  assert.ok(html.includes('Diamond (10)'), 'Should render Diamond tab with shape count');
  assert.ok(html.includes('Metals'), 'Should render Metals tab');
  assert.ok(html.includes('Optics'), 'Should render Optics tab');
  assert.ok(html.includes('Price'), 'Should render Price tab');
  assert.ok(html.includes('Reset View'), 'Should render reset view footer button');
  assert.ok(html.includes('Export 3D'), 'Should render export 3D footer button');
});

test('JewelryInspector renders Setting panel with active Solitaire selection', () => {
  let selectedIndex = null;
  const html = renderToStaticMarkup(
    React.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'rings',
      onTabChange: () => {},
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: (idx) => { selectedIndex = idx; },
      diamondThumbs: mockDiamondThumbs,
      activeShape: 'Round',
      onSelectShape: () => {},
      zRotation: 0,
      onRotationChange: () => {},
      scale: 100,
      onScaleChange: () => {},
      yOffset: 0,
      onYOffsetChange: () => {},
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {}
    })
  );

  assert.ok(html.includes('Select Ring Setting (2)'), 'Should render setting header');
  assert.ok(html.includes('Classic Solitaire'), 'Should render Solitaire option');
  assert.ok(html.includes('Halo Setting'), 'Should render Halo option');
  assert.ok(html.includes('Active Setting'), 'Should highlight active setting badge');
});

test('JewelryInspector renders Diamond cut catalog with thumbnail grid and cut count', () => {
  const html = renderToStaticMarkup(
    React.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'gemstones',
      onTabChange: () => {},
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {},
      diamondThumbs: mockDiamondThumbs,
      activeShape: 'Round',
      onSelectShape: () => {},
      zRotation: 45,
      onRotationChange: () => {},
      scale: 120,
      onScaleChange: () => {},
      yOffset: 0,
      onYOffsetChange: () => {},
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {}
    })
  );

  assert.ok(html.includes('Center Stone Cut &amp; Geometry'), 'Should render gemstone cut header');
  assert.ok(html.includes('Round'), 'Should render Round diamond cut');
  assert.ok(html.includes('Princess'), 'Should render Princess diamond cut');
  assert.ok(html.includes('Emerald'), 'Should render Emerald diamond cut');
  assert.ok(html.includes('Asscher'), 'Should render Asscher diamond cut');
});

test('JewelryInspector renders Diamond transform controls (carat scale, rotation, table height)', () => {
  const html = renderToStaticMarkup(
    React.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'gemstones',
      onTabChange: () => {},
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {},
      diamondThumbs: mockDiamondThumbs,
      activeShape: 'Round',
      onSelectShape: () => {},
      zRotation: 45,
      onRotationChange: () => {},
      scale: 120,
      onScaleChange: () => {},
      yOffset: 5,
      onYOffsetChange: () => {},
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {}
    })
  );

  assert.ok(html.includes('Diamond Scale (Carat Equiv.)'), 'Should render scale label');
  assert.ok(html.includes('(120%)'), 'Should render scale percentage value');
  assert.ok(html.includes('Orientation Angle'), 'Should render rotation label');
  assert.ok(html.includes('45°'), 'Should render rotation degrees value');
  assert.ok(html.includes('Setting Height Offset'), 'Should render table height offset label');
  assert.ok(html.includes('>5</span>'), 'Should render table height offset value');
});

test('JewelryInspector renders Precious Metals catalog with 4 swatches and active alloy badge', () => {
  const html = renderToStaticMarkup(
    React.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'metals',
      onTabChange: () => {},
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {},
      diamondThumbs: mockDiamondThumbs,
      activeShape: 'Round',
      onSelectShape: () => {},
      zRotation: 0,
      onRotationChange: () => {},
      scale: 100,
      onScaleChange: () => {},
      yOffset: 0,
      onYOffsetChange: () => {},
      selectedMetal: PRECIOUS_METALS[1], // White Gold
      onSelectMetal: () => {}
    })
  );

  assert.ok(html.includes('Precious Metal Alloy &amp; Band'), 'Should render metals header');
  assert.ok(html.includes('18K Yellow Gold'), 'Should render Yellow Gold option');
  assert.ok(html.includes('18K White Gold'), 'Should render White Gold option');
  assert.ok(html.includes('18K Rose Gold'), 'Should render Rose Gold option');
  assert.ok(html.includes('Platinum 950'), 'Should render Platinum option');
  assert.ok(html.includes('✓'), 'Should render checkmark badge on selected metal');
});

test('JewelryInspector renders Optics panel with dispersion, IOR, and Bloom shimmer toggle', () => {
  const html = renderToStaticMarkup(
    React.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'optics',
      onTabChange: () => {},
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {},
      diamondThumbs: mockDiamondThumbs,
      activeShape: 'Round',
      onSelectShape: () => {},
      zRotation: 0,
      onRotationChange: () => {},
      scale: 100,
      onScaleChange: () => {},
      yOffset: 0,
      onYOffsetChange: () => {},
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {},
      isBloomActive: true,
      onToggleBloom: () => {}
    })
  );

  assert.ok(html.includes('Optical Dispersion &amp; Post-Processing'), 'Should render optics header');
  assert.ok(html.includes('Diamond Bloom Shimmer'), 'Should render bloom toggle label');
  assert.ok(html.includes('Specular glint &amp; refractive dispersion'), 'Should render bloom subtitle');
  assert.ok(html.includes('spectral dispersion shaders'), 'Should render optics explanation');
});

test('JewelryInspector renders Price breakdown and total estimate calculated dynamically', () => {
  const html = renderToStaticMarkup(
    React.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'summary',
      onTabChange: () => {},
      rings: mockRings,
      activeRingIndex: 0, // Solitaire ($1,950)
      onSelectRing: () => {},
      diamondThumbs: mockDiamondThumbs,
      activeShape: 'Round',
      onSelectShape: () => {},
      zRotation: 0,
      onRotationChange: () => {},
      scale: 100, // 100% carat ($1,800)
      onScaleChange: () => {},
      yOffset: 0,
      onYOffsetChange: () => {},
      selectedMetal: PRECIOUS_METALS[0], // Yellow Gold ($650)
      onSelectMetal: () => {}
    })
  );

  // Total: 1950 + 650 + 1800 = $4,400 USD
  assert.ok(html.includes('Bespoke Ring Specification'), 'Should render pricing specification header');
  assert.ok(html.includes('Classic Solitaire'), 'Should render ring style');
  assert.ok(html.includes('18K Yellow Gold'), 'Should render metal alloy');
  assert.ok(html.includes('Estimated Price:'), 'Should render estimated price label');
  assert.ok(html.includes('$4,400 USD'), 'Should render total dynamic valuation');
  assert.ok(html.includes('Reserve Ring / Request Consultation'), 'Should render reserve action button');
});

// --------------------------------------------------------------------------
// 2. FloatingControlDock & CanvasControlToolbar Integration Tests
// --------------------------------------------------------------------------
test('FloatingControlDock renders 5 jewelry control items in configurator', () => {
  const dockItems = [
    { id: 'rings', label: 'Setting', icon: '💍' },
    { id: 'gemstones', label: 'Diamond', icon: '💎' },
    { id: 'metals', label: 'Metals', icon: '✨' },
    { id: 'optics', label: 'Optics', icon: '🔬' },
    { id: 'summary', label: 'Price', icon: '🏷️' }
  ];

  const html = renderToStaticMarkup(
    React.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: 'rings',
      onSelect: () => {},
      position: 'bottom'
    })
  );

  assert.ok(html.includes('vs-floating-control-dock'), 'Should render floating control dock');
  assert.ok(html.includes('Setting'), 'Should render Setting dock item');
  assert.ok(html.includes('Diamond'), 'Should render Diamond dock item');
  assert.ok(html.includes('Metals'), 'Should render Metals dock item');
  assert.ok(html.includes('Optics'), 'Should render Optics dock item');
  assert.ok(html.includes('Price'), 'Should render Price dock item');
});

test('CanvasControlToolbar renders top-right controls with Recenter, Bloom, Export, and Fullscreen', () => {
  const html = renderToStaticMarkup(
    React.createElement(CanvasControlToolbar, {
      position: 'top-right',
      onRecenter: () => {},
      extraActions: React.createElement('div', { className: 'extra-jewelry-actions' },
        React.createElement('button', { className: 'bloom-btn' }, '✨'),
        React.createElement('button', { className: 'export-btn' }, '📥'),
        React.createElement('button', { className: 'fs-btn' }, '⛶')
      )
    })
  );

  assert.ok(html.includes('vs-canvas-control-toolbar'), 'Should render canvas toolbar');
  assert.ok(html.includes('vs-canvas-control-toolbar--top-right'), 'Should use top-right placement');
  assert.ok(html.includes('bloom-btn'), 'Should render bloom toggle action');
  assert.ok(html.includes('export-btn'), 'Should render export action');
  assert.ok(html.includes('fs-btn'), 'Should render fullscreen action');
});

// --------------------------------------------------------------------------
// 3. AppHeaderBar Theme Switching & Persistence Across Re-renders
// --------------------------------------------------------------------------
test('AppHeaderBar renders jewelry branding, active status badge, and theme switcher', () => {
  function JewelryHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      productTitle: 'Jewelry Configurator',
      backLabel: '← Back to Overview',
      onBack: () => {},
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React.createElement('span', { className: 'vs-jewelry-badge' }, 'Classic Solitaire • 18K Yellow Gold • $4,400 USD')
    });
  }

  const html = renderToStaticMarkup(
    React.createElement(VictorShellThemeProvider, { initialAccent: 'orchid' },
      React.createElement(JewelryHeaderStage)
    )
  );

  assert.ok(html.includes('TRIKOMI'), 'Should render brand title');
  assert.ok(html.includes('Jewelry Configurator'), 'Should render product title');
  assert.ok(html.includes('← Back to Overview'), 'Should render back button');
  assert.ok(html.includes('Classic Solitaire • 18K Yellow Gold • $4,400 USD'), 'Should render status badge');
  assert.ok(html.includes('data-accent="orchid"'), 'Provider root should have initial data-accent="orchid"');
  assert.ok(html.includes('vs-theme-accent-btn--orchid is-active'), 'AppHeaderBar should have active orchid theme button');
});

test('VictorShellThemeProvider persists custom theme selection across re-renders in jewelry configurator', () => {
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
        productTitle: 'Jewelry Configurator',
        theme: ctx.accent,
        onThemeChange: ctx.setAccent,
        showThemeSwitcher: true
      });
    }

    const container = mockDoc.createElement('div');
    mockDoc.documentElement.appendChild(container);
    const root = createRoot(container);

    // Initial render with approved luxury jewelry default theme: orchid
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

    // Find the theme switcher button for indigo
    const indigoBtn = container.find(el => el.attributes['aria-label'] === 'Electric Indigo Theme');
    assert.ok(indigoBtn, 'Indigo theme button must exist in AppHeaderBar');

    // Click Indigo button via real DOM dispatchEvent
    act(() => {
      indigoBtn.click();
    });

    assert.equal(contextValue.accent, 'indigo', 'Context theme should update to Indigo after real click event');
    assert.equal(mockDoc.documentElement.getAttribute('data-accent'), 'indigo', 'Document data-accent should update to indigo');
    assert.equal(rootWrapper.attributes['data-accent'], 'indigo', 'Provider root data-accent must update to indigo');
    assert.ok(indigoBtn.className.includes('is-active'), 'Indigo button must be active');
    assert.ok(!orchidBtn.className.includes('is-active'), 'Orchid button must not be active');

    // Trigger unrelated re-render to verify persistence
    act(() => {
      triggerUnrelatedUpdate();
    });

    assert.equal(contextValue.accent, 'indigo', 'Theme should remain Indigo after unrelated component re-render');
    assert.equal(mockDoc.documentElement.getAttribute('data-accent'), 'indigo', 'Document data-accent should remain indigo');

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
