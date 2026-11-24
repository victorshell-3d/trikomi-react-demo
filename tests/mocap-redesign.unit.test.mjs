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
import { MocapInspector } from '../apps/face-mocap/src/MocapInspector.jsx';
import { LiveLinkHelpModal } from '../apps/face-mocap/src/LiveLinkHelpModal.jsx';
import store from '../apps/face-mocap/src/Store.jsx';

// --------------------------------------------------------------------------
// 1. MocapInspector Drawer & Tabs Tests
// --------------------------------------------------------------------------
test('MocapInspector renders GlassInspectorDrawer with all 5 tabs and title', () => {
  const html = renderToStaticMarkup(
    React.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'avatar',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('vs-glass-inspector-drawer'), 'Should render drawer container');
  assert.ok(html.includes('Face Mocap Studio'), 'Should render drawer title');
  assert.ok(html.includes('Avatar'), 'Should render Avatar tab');
  assert.ok(html.includes('Camera'), 'Should render Camera tab');
  assert.ok(html.includes('Blendshapes'), 'Should render Blendshapes tab');
  assert.ok(html.includes('LiveLink'), 'Should render LiveLink tab');
  assert.ok(html.includes('Settings'), 'Should render Settings tab');
  assert.ok(html.includes('Reset'), 'Should render Reset footer button');
  assert.ok(html.includes('Record'), 'Should render Record footer button');
  assert.ok(html.includes('LiveLink') || html.includes('Live'), 'Should render LiveLink footer button');
});

test('MocapInspector renders Avatar panel with Raccoon Head and 3D Glasses options and active badge', () => {
  runInAction(() => {
    store.avatar = 'raccoon';
  });
  const html = renderToStaticMarkup(
    React.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'avatar',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Select Virtual Avatar'), 'Should render avatar selection header');
  assert.ok(html.includes('Raccoon Head'), 'Should render Raccoon Head card');
  assert.ok(html.includes('52 ARKit Morph Targets'), 'Should detail morph targets');
  assert.ok(html.includes('3D Glasses'), 'Should render 3D Glasses card');
  assert.ok(html.includes('Cranial Occluder'), 'Should detail occluder tracking');
  assert.ok(html.includes('Active'), 'Should display active badge on current avatar');
});

test('MocapInspector renders Camera panel with source selection, mirror view, and landmarks grid', () => {
  const html = renderToStaticMarkup(
    React.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'camera',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Camera &amp; Tracking Inputs') || html.includes('Camera & Tracking Inputs'), 'Should render camera header');
  assert.ok(html.includes('Camera Source'), 'Should render camera source label');
  assert.ok(html.includes('Mirror Camera View'), 'Should render mirror camera toggle');
  assert.ok(html.includes('Facial Landmarks &amp; 3D Grid') || html.includes('Facial Landmarks & 3D Grid'), 'Should render landmarks toggle');
  assert.ok(html.includes('Face Detected') || html.includes('No Face Detected'), 'Should render tracking indicator');
});

test('MocapInspector renders Blendshapes panel with 52 ARKit meters and category filter buttons', () => {
  const html = renderToStaticMarkup(
    React.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'blendshapes',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('52 ARKit Blendshapes'), 'Should render blendshapes header');
  assert.ok(html.includes('All (52)'), 'Should render All filter button');
  assert.ok(html.includes('Eyes &amp; Brows') || html.includes('Eyes & Brows'), 'Should render Eyes filter button');
  assert.ok(html.includes('Mouth &amp; Lips') || html.includes('Mouth & Lips'), 'Should render Mouth filter button');
  assert.ok(html.includes('Jaw &amp; Cheeks') || html.includes('Jaw & Cheeks'), 'Should render Jaw filter button');
  assert.ok(html.includes('Tongue &amp; Nose') || html.includes('Tongue & Nose'), 'Should render Other filter button');
  assert.ok(html.includes('EyeBlinkLeft'), 'Should render EyeBlinkLeft blendshape');
  assert.ok(html.includes('MouthSmileLeft'), 'Should render MouthSmileLeft blendshape');
});

test('MocapInspector renders Blendshapes booster multiplier sliders and master toggle', () => {
  runInAction(() => {
    store.booster = true;
  });
  const html = renderToStaticMarkup(
    React.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'blendshapes',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Blendshape Boosters'), 'Should render booster section');
  assert.ok(html.includes('Amplify micro-expressions'), 'Should render booster subtitle');
  assert.ok(html.includes('Boost:'), 'Should render boost multiplier label');
  assert.ok(html.includes('1.00x'), 'Should display default multiplier readout');
});

test('MocapInspector renders LiveLink panel with WebSocket URL input and connection status', () => {
  runInAction(() => {
    store.connected = false;
    store.serverAddress = '127.0.0.1:5000';
  });
  const html = renderToStaticMarkup(
    React.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'livelink',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('LiveLink Engine Streaming'), 'Should render LiveLink header');
  assert.ok(html.includes('WebSocket Server Host'), 'Should render server host label');
  assert.ok(html.includes('127.0.0.1:5000'), 'Should display configured host');
  assert.ok(html.includes('Connect LiveLink'), 'Should render Connect LiveLink button');
  assert.ok(html.includes('LiveLink Disconnected'), 'Should display disconnected state');
});

test('MocapInspector renders LiveLink panel with verified download links for LiveLinkShell and Unity Package', () => {
  const html = renderToStaticMarkup(
    React.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'livelink',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('downloads/LiveLinkShell.zip'), 'Must link to real LiveLinkShell.zip on disk');
  assert.ok(html.includes('downloads/UnityLiveLink.unitypackage'), 'Must link to real UnityLiveLink.unitypackage on disk');
  assert.ok(html.includes('Open Setup Guide &amp; Instructions') || html.includes('Open Setup Guide & Instructions'), 'Should offer setup guide button');
});

test('MocapInspector renders Settings panel with temporal smoother slider and CSV recorder', () => {
  const html = renderToStaticMarkup(
    React.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {},
      activeTab: 'settings',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Mocap Pipeline &amp; Telemetry') || html.includes('Mocap Pipeline & Telemetry'), 'Should render settings header');
  assert.ok(html.includes('Tracking Smoother'), 'Should render tracking smoother label');
  assert.ok(html.includes('0.50 (Responsive)'), 'Should display responsive smoother label');
  assert.ok(html.includes('1.00 (Max Smooth)'), 'Should display max smooth label');
  assert.ok(html.includes('CSV Motion Capture Recording'), 'Should render CSV recording section');
  assert.ok(html.includes('Start CSV Recording'), 'Should render start CSV recording button');
});

// --------------------------------------------------------------------------
// 2. FloatingControlDock, CanvasControlToolbar, and LiveLinkHelpModal
// --------------------------------------------------------------------------
test('FloatingControlDock renders 5 mocap tool items with avatar and blendshapes badges', () => {
  const dockItems = [
    { id: 'avatar', label: 'Avatar', icon: '🎭', badge: 'Raccoon' },
    { id: 'camera', label: 'Camera', icon: '📷' },
    { id: 'blendshapes', label: 'Blendshapes', icon: '📊', badge: '52' },
    { id: 'livelink', label: 'LiveLink', icon: '🔗' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const html = renderToStaticMarkup(
    React.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: 'avatar',
      onSelect: () => {},
      position: 'bottom'
    })
  );

  assert.ok(html.includes('vs-floating-control-dock'), 'Should render floating dock');
  assert.ok(html.includes('Avatar'), 'Should render Avatar dock item');
  assert.ok(html.includes('Camera'), 'Should render Camera dock item');
  assert.ok(html.includes('Blendshapes'), 'Should render Blendshapes dock item');
  assert.ok(html.includes('LiveLink'), 'Should render LiveLink dock item');
  assert.ok(html.includes('Settings'), 'Should render Settings dock item');
  assert.ok(html.includes('52'), 'Should render 52 ARKit badge');
});

test('CanvasControlToolbar renders top-right actions for Recenter, Record, Grid, LiveLink, and Fullscreen', () => {
  const html = renderToStaticMarkup(
    React.createElement(CanvasControlToolbar, {
      position: 'top-right',
      onRecenter: () => {},
      extraActions: React.createElement('div', { className: 'extra-mocap-actions' },
        React.createElement('button', { className: 'rec-btn' }, '🔴 Rec'),
        React.createElement('button', { className: 'grid-btn' }, '🌐 Grid'),
        React.createElement('button', { className: 'livelink-btn' }, '🔗 LiveLink'),
        React.createElement('button', { className: 'fs-btn' }, '⛶')
      )
    })
  );

  assert.ok(html.includes('vs-canvas-control-toolbar'), 'Should render canvas toolbar');
  assert.ok(html.includes('vs-canvas-control-toolbar--top-right'), 'Should use top-right position');
  assert.ok(html.includes('rec-btn'), 'Should render CSV recording quick action');
  assert.ok(html.includes('grid-btn'), 'Should render landmarks grid quick action');
  assert.ok(html.includes('livelink-btn'), 'Should render LiveLink quick action');
  assert.ok(html.includes('fs-btn'), 'Should render fullscreen quick action');
});

test('LiveLinkHelpModal renders FrostedModalDialog with Unreal Engine, Unity, and ARKit guide', () => {
  const html = renderToStaticMarkup(
    React.createElement(LiveLinkHelpModal, {
      isOpen: true,
      onClose: () => {}
    })
  );

  assert.ok(html.includes('vs-frosted-modal') || html.includes('LiveLink Streaming Guide'), 'Should render frosted modal shell');
  assert.ok(html.includes('LiveLink Streaming Guide'), 'Should render guide title');
  assert.ok(html.includes('Unreal Engine 5 (MetaHuman / LiveLink)'), 'Should document Unreal Engine 5');
  assert.ok(html.includes('Unity Live Capture &amp; Animation') || html.includes('Unity Live Capture & Animation'), 'Should document Unity Live Capture');
  assert.ok(html.includes('Broadcast Protocol Specifications'), 'Should detail ARKit broadcast curves');
  assert.ok(html.includes('Done'), 'Should render Done dismissal button');
});

// --------------------------------------------------------------------------
// 3. AppHeaderBar & VictorShellThemeProvider Persistence
// --------------------------------------------------------------------------
test('AppHeaderBar renders mocap branding, tracking status badge, and theme switcher', () => {
  function MocapHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      productTitle: 'Face Mocap',
      backLabel: '← Back to Overview',
      onBack: () => {},
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React.createElement('span', { className: 'vs-mocap-status-badge' }, 'Tracking Active • 52 ARKit')
    });
  }

  const html = renderToStaticMarkup(
    React.createElement(VictorShellThemeProvider, { initialAccent: 'violet' },
      React.createElement(MocapHeaderStage)
    )
  );

  assert.ok(html.includes('TRIKOMI'), 'Should render brand title');
  assert.ok(html.includes('Face Mocap'), 'Should render product title');
  assert.ok(html.includes('← Back to Overview'), 'Should render back button');
  assert.ok(html.includes('Tracking Active • 52 ARKit'), 'Should render status badge');
  assert.ok(html.includes('data-accent="violet"'), 'Provider root should have initial data-accent="violet"');
  assert.ok(html.includes('vs-theme-accent-btn--violet is-active'), 'AppHeaderBar should have active violet theme button');
});

test('VictorShellThemeProvider persists custom theme selection across re-renders in face mocap', () => {
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
        productTitle: 'Face Mocap',
        theme: ctx.accent,
        onThemeChange: ctx.setAccent,
        showThemeSwitcher: true
      });
    }

    const container = mockDoc.createElement('div');
    mockDoc.documentElement.appendChild(container);
    const root = createRoot(container);

    // Initial render with approved face mocap default theme: violet
    act(() => {
      root.render(
        React.createElement(VictorShellThemeProvider, { initialAccent: 'violet' },
          React.createElement(TestThemeProbe)
        )
      );
    });

    assert.equal(contextValue.accent, 'violet', 'Initial theme should be Royal Violet');
    const rootWrapper = container.childNodes[0];
    assert.equal(rootWrapper.attributes['data-accent'], 'violet', 'VictorShellThemeProvider root must have data-accent="violet"');

    const violetBtn = container.find(el => el.attributes['aria-label'] === 'Royal Violet Theme');
    assert.ok(violetBtn, 'Violet theme button must be rendered in AppHeaderBar');
    assert.ok(violetBtn.className.includes('is-active'), 'Violet button should be active initially');

    // Find the theme switcher button for orchid
    const orchidBtn = container.find(el => el.attributes['aria-label'] === 'Orchid Glow Theme');
    assert.ok(orchidBtn, 'Orchid theme button must exist in AppHeaderBar');

    // Click Orchid button via real DOM dispatchEvent
    act(() => {
      orchidBtn.click();
    });

    assert.equal(contextValue.accent, 'orchid', 'Context theme should update to Orchid after click event');
    assert.equal(mockDoc.documentElement.getAttribute('data-accent'), 'orchid', 'Document data-accent should update to orchid');
    assert.equal(rootWrapper.attributes['data-accent'], 'orchid', 'Provider root data-accent must update to orchid');
    assert.ok(orchidBtn.className.includes('is-active'), 'Orchid button must be active');
    assert.ok(!violetBtn.className.includes('is-active'), 'Violet button must not be active');

    // Trigger unrelated re-render to verify persistence
    act(() => {
      triggerUnrelatedUpdate();
    });

    assert.equal(contextValue.accent, 'orchid', 'Theme should remain Orchid after unrelated component re-render');
    assert.equal(mockDoc.documentElement.getAttribute('data-accent'), 'orchid', 'Document data-accent should remain orchid');

    // Switch to Indigo via click event
    const indigoBtn = container.find(el => el.attributes['aria-label'] === 'Electric Indigo Theme');
    assert.ok(indigoBtn, 'Indigo theme button must exist in AppHeaderBar');

    act(() => {
      indigoBtn.click();
    });

    assert.equal(contextValue.accent, 'indigo', 'Context theme should update to Indigo after click event');

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
