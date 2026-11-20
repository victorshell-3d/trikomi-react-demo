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
  CanvasControlToolbar,
  FrostedModalDialog
} from '@trikomi/ui-kit';
import { BoxInspector } from '../apps/box-configurator/src/components/BoxInspector.tsx';
import { configStore } from '../apps/box-configurator/src/store/ConfigStore.ts';

// --------------------------------------------------------------------------
// 1. BoxInspector Component Tests
// --------------------------------------------------------------------------
test('BoxInspector renders GlassInspectorDrawer with all 5 tabs and title', () => {
  const html = renderToStaticMarkup(
    React.createElement(BoxInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'style',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('vs-glass-inspector-drawer'), 'Should render drawer container');
  assert.ok(html.includes('Box Studio'), 'Should render drawer title');
  assert.ok(html.includes('Style'), 'Should render Style tab');
  assert.ok(html.includes('Dimensions'), 'Should render Dimensions tab');
  assert.ok(html.includes('Materials'), 'Should render Materials tab');
  assert.ok(html.includes('Dieline'), 'Should render Dieline tab');
  assert.ok(html.includes('Summary'), 'Should render Summary tab');
  assert.ok(html.includes('Recenter'), 'Should render recenter footer button');
  assert.ok(html.includes('SVG Dieline'), 'Should render SVG Dieline footer button');
  assert.ok(html.includes('3D GLTF'), 'Should render 3D GLTF footer button');
});

test('BoxInspector renders Style panel with box templates catalog and active badge', () => {
  const html = renderToStaticMarkup(
    React.createElement(BoxInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'style',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Select Packaging Style'), 'Should render packaging style header');
  assert.ok(html.includes('Tuck-End Box') || html.includes('Box'), 'Should render standard box style');
  assert.ok(html.includes('Active'), 'Should highlight active box template badge');
});

test('BoxInspector renders Dimensions panel with unit switchers and parametric controls', () => {
  const html = renderToStaticMarkup(
    React.createElement(BoxInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'dimensions',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Unit System'), 'Should render unit system selector');
  assert.ok(html.includes('IN'), 'Should render Inches unit button');
  assert.ok(html.includes('MM'), 'Should render Millimeters unit button');
  assert.ok(html.includes('CM'), 'Should render Centimeters unit button');
  assert.ok(html.includes('Base Face Dimensions'), 'Should render base face dimensions section');
  assert.ok(html.includes('Main Panel Width:'), 'Should render width control');
  assert.ok(html.includes('Main Panel Height:'), 'Should render height control');
});

test('BoxInspector renders Materials panel with 5 paperboard finish options and active selection', () => {
  const html = renderToStaticMarkup(
    React.createElement(BoxInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'materials',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Paperboard Material Finish (5)'), 'Should render materials finish header');
  assert.ok(html.includes('Natural Kraft Cardboard'), 'Should render Kraft option');
  assert.ok(html.includes('Solid White Coated'), 'Should render White coated option');
  assert.ok(html.includes('Blueprint Technical Grid'), 'Should render Grid option');
  assert.ok(html.includes('✓'), 'Should render active selection checkmark');
});

test('BoxInspector renders Materials panel with preset box paint color swatches', () => {
  const html = renderToStaticMarkup(
    React.createElement(BoxInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'materials',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Base Board Hue'), 'Should render color swatch header');
  assert.ok(html.includes('Natural Kraft'), 'Should render Natural Kraft swatch');
  assert.ok(html.includes('Pure White'), 'Should render Pure White swatch');
  assert.ok(html.includes('Indigo Navy'), 'Should render Indigo Navy swatch');
});

test('BoxInspector renders Dieline panel with unfold progress slider and measurement toggle', () => {
  const html = renderToStaticMarkup(
    React.createElement(BoxInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'dieline',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Parametric Folding &amp; Layout'), 'Should render folding section header');
  assert.ok(html.includes('Unfold Progress'), 'Should render unfold progress label');
  assert.ok(html.includes('Show Dimension Annotations'), 'Should render measurement annotations toggle');
  assert.ok(html.includes('Dieline Legend:'), 'Should render dieline guide legend');
  assert.ok(html.includes('Solid Red: Outer Die-Cut Perimeter Line'), 'Should explain cut perimeter line');
  assert.ok(html.includes('Dashed Blue: Scoring &amp; Crease Fold Line'), 'Should explain crease fold line');
});

test('BoxInspector renders Summary panel with packaging specifications and dynamic unit cost', () => {
  const html = renderToStaticMarkup(
    React.createElement(BoxInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'summary',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Packaging Specifications &amp; Pricing'), 'Should render specifications header');
  assert.ok(html.includes('Box Style:'), 'Should render box style row');
  assert.ok(html.includes('Material Grade:'), 'Should render material grade row');
  assert.ok(html.includes('Flat Dieline Bounds:'), 'Should render flat dieline bounds');
  assert.ok(html.includes('Est. Unit Cost (MOQ 500):'), 'Should render unit cost label');
  assert.ok(html.includes('$'), 'Should format estimated cost in USD currency');
  assert.ok(html.includes('Request Production Sample &amp; Quote'), 'Should render action button');
});

// --------------------------------------------------------------------------
// 2. FloatingControlDock & CanvasControlToolbar Integration Tests
// --------------------------------------------------------------------------
test('FloatingControlDock renders 5 box control items in configurator', () => {
  const dockItems = [
    { id: 'style', label: 'Style', icon: '📦' },
    { id: 'dimensions', label: 'Dimensions', icon: '📐' },
    { id: 'materials', label: 'Materials', icon: '🎨' },
    { id: 'dieline', label: 'Dieline', icon: '✂️' },
    { id: 'summary', label: 'Price', icon: '📋' }
  ];

  const html = renderToStaticMarkup(
    React.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: 'style',
      onSelect: () => {},
      position: 'bottom'
    })
  );

  assert.ok(html.includes('vs-floating-control-dock'), 'Should render floating control dock');
  assert.ok(html.includes('Style'), 'Should render Style dock item');
  assert.ok(html.includes('Dimensions'), 'Should render Dimensions dock item');
  assert.ok(html.includes('Materials'), 'Should render Materials dock item');
  assert.ok(html.includes('Dieline'), 'Should render Dieline dock item');
  assert.ok(html.includes('Price'), 'Should render Price dock item');
});

test('CanvasControlToolbar renders top-right controls with Recenter, Snapshot, SVG, GLTF, and Fullscreen', () => {
  const html = renderToStaticMarkup(
    React.createElement(CanvasControlToolbar, {
      position: 'top-right',
      onRecenter: () => {},
      extraActions: React.createElement('div', { className: 'extra-box-actions' },
        React.createElement('button', { className: 'snapshot-btn' }, '📷'),
        React.createElement('button', { className: 'svg-btn' }, '✂️'),
        React.createElement('button', { className: 'gltf-btn' }, '📦'),
        React.createElement('button', { className: 'fs-btn' }, '⛶')
      )
    })
  );

  assert.ok(html.includes('vs-canvas-control-toolbar'), 'Should render canvas toolbar');
  assert.ok(html.includes('vs-canvas-control-toolbar--top-right'), 'Should use top-right placement');
  assert.ok(html.includes('snapshot-btn'), 'Should render 3D snapshot action');
  assert.ok(html.includes('svg-btn'), 'Should render SVG dieline export action');
  assert.ok(html.includes('gltf-btn'), 'Should render GLTF 3D export action');
  assert.ok(html.includes('fs-btn'), 'Should render fullscreen action');
});

test('FrostedModalDialog renders vector flap shape editor modal shell with title, subtitle, and footer action', () => {
  const html = renderToStaticMarkup(
    React.createElement(FrostedModalDialog, {
      isOpen: true,
      onClose: () => {},
      title: 'Vector Shape Editor',
      subtitle: 'Modify custom vector profile for flap-straight',
      size: 'xl',
      footer: React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', width: '100%' } },
        React.createElement('button', { className: 'vs-btn vs-btn-primary' }, 'Done Editing')
      )
    }, React.createElement('div', { className: 'vector-editor-workspace' }, 'Vector Canvas Area'))
  );

  assert.ok(html.includes('vs-frosted-modal') || html.includes('Vector Shape Editor'), 'Should render FrostedModalDialog');
  assert.ok(html.includes('Vector Shape Editor'), 'Should render dialog title');
  assert.ok(html.includes('flap-straight'), 'Should render dialog subtitle');
  assert.ok(html.includes('Done Editing'), 'Should render footer action button');
  assert.ok(html.includes('Vector Canvas Area'), 'Should render modal children workspace');
});

// --------------------------------------------------------------------------
// 3. AppHeaderBar Theme Switching & Persistence Across Re-renders
// --------------------------------------------------------------------------
test('AppHeaderBar renders box branding, active status badge, and theme switcher', () => {
  function BoxHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      productTitle: 'Box Configurator',
      backLabel: '← Back to Overview',
      onBack: () => {},
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React.createElement('span', { className: 'vs-box-badge' }, 'Mailer Box • KRAFT • 12.0 × 8.0 in')
    });
  }

  const html = renderToStaticMarkup(
    React.createElement(VictorShellThemeProvider, { initialAccent: 'indigo' },
      React.createElement(BoxHeaderStage)
    )
  );

  assert.ok(html.includes('TRIKOMI'), 'Should render brand title');
  assert.ok(html.includes('Box Configurator'), 'Should render product title');
  assert.ok(html.includes('← Back to Overview'), 'Should render back button');
  assert.ok(html.includes('Mailer Box • KRAFT • 12.0 × 8.0 in'), 'Should render status badge');
  assert.ok(html.includes('data-accent="indigo"'), 'Provider root should have initial data-accent="indigo"');
  assert.ok(html.includes('vs-theme-accent-btn--indigo is-active'), 'AppHeaderBar should have active indigo theme button');
});

test('VictorShellThemeProvider persists custom theme selection across re-renders in box configurator', () => {
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
        productTitle: 'Box Configurator',
        theme: ctx.accent,
        onThemeChange: ctx.setAccent,
        showThemeSwitcher: true
      });
    }

    const container = mockDoc.createElement('div');
    mockDoc.documentElement.appendChild(container);
    const root = createRoot(container);

    // Initial render with approved packaging default theme: indigo
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
