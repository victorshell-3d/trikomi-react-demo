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
import { TourInspector } from '../apps/360tour/src/components/TourInspector.jsx';
import MediaModal from '../apps/360tour/src/components/MediaModal.jsx';
import FloorPlanModal from '../apps/360tour/src/components/FloorPlanModal.jsx';

// Sample mock tour data
const mockTourData = {
  id: 'tour-101',
  title: 'Penthouse Panorama Luxury Tour',
  settings: {
    autoRotate: true,
    autoRotateSpeed: 0.5,
    global_audio_url: 'audio/ambient-lounge.mp3',
    floorPlan: { enabled: true, image: 'maps/floorplan.png' }
  },
  scenes: [
    {
      id: 'scene-1',
      name: 'Grand Foyer',
      panorama: 'panos/foyer.jpg',
      floorPlanPosition: { x: 25, y: 30 },
      hotspots: [
        { id: 'hs-1', label: 'Walk to Living Room', targetSceneId: 'scene-2', targetYaw: 180 },
        { id: 'hs-2', label: 'Terrace Entrance', targetSceneId: 'scene-3', targetYaw: 90 }
      ],
      shapes: [
        { id: 'sh-1', name: 'Marble Chandelier', actionType: 'show_image', media: { url: 'img/chandelier.jpg', title: 'Italian Marble Chandelier' } },
        { id: 'sh-2', name: 'Architectural Spec Sheet', actionType: 'open_url', url: 'https://trikomi.com/specs' }
      ],
      audio_points: [
        { id: 'ap-1', name: 'Foyer Fountain Sound', url: 'audio/water.mp3', position: [0, 0, 5], distance: 10 }
      ]
    },
    {
      id: 'scene-2',
      name: 'Panoramic Living Room',
      panorama: 'panos/living.jpg',
      floorPlanPosition: { x: 50, y: 45 },
      hotspots: [
        { id: 'hs-3', label: 'Return to Foyer', targetSceneId: 'scene-1', targetYaw: 0 }
      ],
      shapes: [],
      audio_points: []
    },
    {
      id: 'scene-3',
      name: 'Skyline Terrace',
      panorama: 'panos/terrace.jpg',
      floorPlanPosition: { x: 80, y: 70 },
      hotspots: [],
      shapes: [],
      audio_points: []
    }
  ]
};

// --------------------------------------------------------------------------
// 1. TourInspector Component Tests
// --------------------------------------------------------------------------
test('TourInspector renders GlassInspectorDrawer with all 5 tabs and title', () => {
  const html = renderToStaticMarkup(
    React.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {},
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: 'scene-1',
      onSelectScene: () => {},
      activeTab: 'scenes',
      onTabChange: () => {},
      isMuted: false,
      onToggleMute: () => {},
      isAutoRotate: true,
      onToggleAutoRotate: () => {}
    })
  );

  assert.ok(html.includes('vs-glass-inspector-drawer'), 'Should render drawer container');
  assert.ok(html.includes('360° Tour Explorer'), 'Should render drawer title');
  assert.ok(html.includes('Penthouse Panorama Luxury Tour'), 'Should render drawer subtitle');
  assert.ok(html.includes('Scenes (3)'), 'Should render Scenes tab with scene count');
  assert.ok(html.includes('Hotspots (2)'), 'Should render Hotspots tab with count');
  assert.ok(html.includes('Media (2)'), 'Should render Media tab with count');
  assert.ok(html.includes('Audio'), 'Should render Audio tab');
  assert.ok(html.includes('Settings'), 'Should render Settings tab');
  assert.ok(html.includes('Mute Sound'), 'Should render mute sound footer button');
  assert.ok(html.includes('Stop Rotate'), 'Should render stop rotate footer button');
});

test('TourInspector renders Scenes list with current active scene badge', () => {
  const html = renderToStaticMarkup(
    React.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {},
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: 'scene-1',
      onSelectScene: () => {},
      activeTab: 'scenes',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Tour Locations (3)'), 'Should render locations header');
  assert.ok(html.includes('Grand Foyer'), 'Should render first scene title');
  assert.ok(html.includes('Panoramic Living Room'), 'Should render second scene title');
  assert.ok(html.includes('Skyline Terrace'), 'Should render third scene title');
  assert.ok(html.includes('Current'), 'Should render Current badge for active scene');
  assert.ok(html.includes('2 hotspots • 2 shapes'), 'Should render hotspots and shapes count for active scene');
});

test('TourInspector renders Hotspots panel when activeTab="hotspots"', () => {
  const html = renderToStaticMarkup(
    React.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {},
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: 'scene-1',
      onSelectScene: () => {},
      activeTab: 'hotspots',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Interactive Hotspots in Grand Foyer'), 'Should render hotspots header');
  assert.ok(html.includes('Walk to Living Room'), 'Should render first hotspot label');
  assert.ok(html.includes('Target: Panoramic Living Room'), 'Should display target scene name');
  assert.ok(html.includes('Terrace Entrance'), 'Should render second hotspot label');
  assert.ok(html.includes('Target: Skyline Terrace'), 'Should display target scene name');
});

test('TourInspector renders Media panel when activeTab="shapes"', () => {
  const html = renderToStaticMarkup(
    React.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {},
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: 'scene-1',
      onSelectScene: () => {},
      activeTab: 'shapes',
      onTabChange: () => {}
    })
  );

  assert.ok(html.includes('Media Shapes &amp; Embedded Elements') || html.includes('Media Shapes & Embedded Elements'), 'Should render shapes header');
  assert.ok(html.includes('Marble Chandelier'), 'Should render chandelier shape name');
  assert.ok(html.includes('Architectural Spec Sheet'), 'Should render spec sheet shape name');
  assert.ok(html.includes('Action: show_image'), 'Should display image action badge');
  assert.ok(html.includes('Action: open_url'), 'Should display url action badge');
});

test('TourInspector renders Audio panel when activeTab="audio"', () => {
  const html = renderToStaticMarkup(
    React.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {},
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: 'scene-1',
      onSelectScene: () => {},
      activeTab: 'audio',
      onTabChange: () => {},
      isMuted: true
    })
  );

  assert.ok(html.includes('Spatial Audio Sources'), 'Should render audio section header');
  assert.ok(html.includes('Audio Playback'), 'Should render playback status title');
  assert.ok(html.includes('Muted'), 'Should show audio status as Muted');
  assert.ok(html.includes('Audio points in current scene: 1'), 'Should display audio point count');
});

test('TourInspector renders Settings panel when activeTab="settings"', () => {
  const html = renderToStaticMarkup(
    React.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {},
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: 'scene-1',
      onSelectScene: () => {},
      activeTab: 'settings',
      onTabChange: () => {},
      isAutoRotate: true
    })
  );

  assert.ok(html.includes('Viewer Configuration'), 'Should render settings header');
  assert.ok(html.includes('Auto-Rotate'), 'Should display auto-rotate control');
  assert.ok(html.includes('Continuous 360° rotation'), 'Should display auto-rotation description');
  assert.ok(html.includes('Stop'), 'Should display Stop button when isAutoRotate=true');
});

// --------------------------------------------------------------------------
// 2. FloatingControlDock & CanvasControlToolbar Integration Tests
// --------------------------------------------------------------------------
test('FloatingControlDock renders 5 tour control items with live badges', () => {
  const dockItems = [
    { id: 'scenes', label: 'Scenes', icon: '🖼️', badge: 3 },
    { id: 'hotspots', label: 'Hotspots', icon: '📍', badge: 2 },
    { id: 'shapes', label: 'Media', icon: '✨', badge: 2 },
    { id: 'audio', label: 'Audio', icon: '🔊' },
    { id: 'floorplan', label: 'Minimap', icon: '🗺️' }
  ];

  const html = renderToStaticMarkup(
    React.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: 'scenes',
      onSelect: () => {}
    })
  );

  assert.ok(html.includes('vs-floating-control-dock'), 'Should render floating control dock');
  assert.ok(html.includes('Scenes'), 'Should render Scenes dock item');
  assert.ok(html.includes('Hotspots'), 'Should render Hotspots dock item');
  assert.ok(html.includes('Media'), 'Should render Media dock item');
  assert.ok(html.includes('Audio'), 'Should render Audio dock item');
  assert.ok(html.includes('Minimap'), 'Should render Minimap dock item');
});

test('CanvasControlToolbar renders top-right viewport controls with auto-rotate and sound actions', () => {
  let recentered = false;
  const html = renderToStaticMarkup(
    React.createElement(CanvasControlToolbar, {
      position: 'top-right',
      onRecenter: () => { recentered = true; },
      extraActions: React.createElement('div', { className: 'extra-tour-actions' },
        React.createElement('button', { className: 'auto-rotate-btn' }, '🔄'),
        React.createElement('button', { className: 'mute-btn' }, '🔊')
      )
    })
  );

  assert.ok(html.includes('vs-canvas-control-toolbar'), 'Should render canvas toolbar');
  assert.ok(html.includes('vs-canvas-control-toolbar--top-right'), 'Should use top-right placement');
  assert.ok(html.includes('extra-tour-actions'), 'Should render extra tour actions slot');
  assert.ok(html.includes('auto-rotate-btn'), 'Should render auto rotate action');
  assert.ok(html.includes('mute-btn'), 'Should render mute sound action');
});

// --------------------------------------------------------------------------
// 3. FrostedModalDialog Modals in 360 Tour (MediaModal & FloorPlanModal)
// --------------------------------------------------------------------------
test('MediaModal renders FrostedModalDialog with image/media content when isOpen=true', () => {
  const html = renderToStaticMarkup(
    React.createElement(MediaModal, {
      isOpen: true,
      onClose: () => {},
      content: {
        type: 'image',
        url: 'img/chandelier.jpg',
        title: 'Italian Marble Chandelier',
        description: 'Hand-crafted Murano glass and Carrara marble fixture.'
      },
      tourId: 'tour-101'
    })
  );

  assert.ok(html.includes('vs-frosted-modal-backdrop'), 'Should render frosted modal backdrop');
  assert.ok(html.includes('vs-frosted-modal-dialog'), 'Should render frosted modal dialog');
  assert.ok(html.includes('Italian Marble Chandelier'), 'Should render modal title');
  assert.ok(html.includes('Hand-crafted Murano glass and Carrara marble fixture.'), 'Should render media description');
  assert.ok(html.includes('Close'), 'Should render modal close button');
});

test('FloorPlanModal renders FrostedModalDialog with map tools and scene list', () => {
  const html = renderToStaticMarkup(
    React.createElement(FloorPlanModal, {
      isOpen: true,
      onClose: () => {},
      tourId: 'tour-101',
      tourSettings: mockTourData.settings,
      onUpdateSettings: async () => {},
      scenes: mockTourData.scenes,
      onUpdateScene: async () => {}
    })
  );

  assert.ok(html.includes('vs-frosted-modal-backdrop'), 'Should render frosted modal backdrop');
  assert.ok(html.includes('vs-frosted-modal-dialog'), 'Should render frosted modal dialog');
  assert.ok(html.includes('Floor Plan Manager'), 'Should render modal title');
  assert.ok(html.includes('Place scene navigation dots on your 2D architectural map'), 'Should render modal subtitle');
  assert.ok(html.includes('Minimap Enabled'), 'Should display minimap enable status');
  assert.ok(html.includes('Grand Foyer'), 'Should list first scene');
  assert.ok(html.includes('Panoramic Living Room'), 'Should list second scene');
  assert.ok(html.includes('Skyline Terrace'), 'Should list third scene');
});

// --------------------------------------------------------------------------
// 4. AppHeaderBar Theme Switching & Persistence Across Re-renders
// --------------------------------------------------------------------------
test('AppHeaderBar renders 360 tour branding, scene status badge, and theme switcher', () => {
  function TourHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      productTitle: '360° Virtual Tour',
      backLabel: '← Back to Dashboard',
      onBack: () => {},
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React.createElement('span', { className: 'vs-scene-badge' }, 'Grand Foyer')
    });
  }

  const html = renderToStaticMarkup(
    React.createElement(VictorShellThemeProvider, { initialAccent: 'indigo' },
      React.createElement(TourHeaderStage)
    )
  );

  assert.ok(html.includes('TRIKOMI'), 'Should render brand title');
  assert.ok(html.includes('360° Virtual Tour'), 'Should render product title');
  assert.ok(html.includes('← Back to Dashboard'), 'Should render back button');
  assert.ok(html.includes('Grand Foyer'), 'Should render active scene status badge');
  assert.ok(html.includes('data-accent="indigo"'), 'Provider root should have initial data-accent="indigo"');
  assert.ok(html.includes('vs-theme-accent-btn--indigo is-active'), 'AppHeaderBar should have active indigo theme button');
});

test('VictorShellThemeProvider persists custom theme selection across re-renders in 360 tour', () => {
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
        productTitle: '360° Virtual Tour',
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
