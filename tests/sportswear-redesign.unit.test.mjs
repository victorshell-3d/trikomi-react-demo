import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  VictorShellThemeProvider,
  useVictorShellTheme,
  AppHeaderBar
} from '@trikomi/ui-kit';
import { SportswearInspector } from '../apps/sportswear-configurator/src/components/SportswearInspector';
import { MobileConfigDock } from '../apps/sportswear-configurator/src/components/MobileConfigDock';
import { OrderFormModal } from '../apps/sportswear-configurator/src/components/OrderFormModal';
import { configStore, ConfigStoreContext } from '../apps/sportswear-configurator/src/store/ConfiguratorStore';

// Helper to wrap with ConfigStoreContext
function withStore(element) {
  return React.createElement(ConfigStoreContext.Provider, { value: configStore }, element);
}

// --------------------------------------------------------------------------
// 1. SportswearInspector Component Tests
// --------------------------------------------------------------------------
test('SportswearInspector renders GlassInspectorDrawer with all 5 tabs', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {},
        activeTab: 'color',
        onTabChange: () => {}
      })
    )
  );

  assert.ok(html.includes('vs-glass-inspector-drawer'), 'Should render drawer container');
  assert.ok(html.includes('Customize Garment'), 'Should render drawer title');
  assert.ok(html.includes('Sportswear 3D Studio'), 'Should render drawer subtitle');
  assert.ok(html.includes('Color'), 'Should render Color tab');
  assert.ok(html.includes('Fabric'), 'Should render Fabric tab');
  assert.ok(html.includes('Logo'), 'Should render Logo tab');
  assert.ok(html.includes('Text'), 'Should render Text tab');
  assert.ok(html.includes('Finish'), 'Should render Finish tab');
  assert.ok(html.includes('Generate Tech Pack &amp; Order') || html.includes('Generate Tech Pack & Order'), 'Should render footer action');
});

test('SportswearInspector renders Color panel controls when activeTab="color"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {},
        activeTab: 'color',
        onTabChange: () => {}
      })
    )
  );

  assert.ok(html.includes('Select Layer'), 'Should render layer selection');
  assert.ok(html.includes('Palette Swatches'), 'Should render palette swatches ribbon');
});

test('SportswearInspector renders Fabric panel controls when activeTab="texture"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {},
        activeTab: 'texture',
        onTabChange: () => {}
      })
    )
  );

  assert.ok(html.includes('Garment Fabric Weave'), 'Should render fabric weave title');
  assert.ok(html.includes('mesh Weave'), 'Should render mesh option');
  assert.ok(html.includes('knit Weave'), 'Should render knit option');
  assert.ok(html.includes('smooth Weave'), 'Should render smooth option');
});

test('SportswearInspector renders Logo panel controls when activeTab="logo"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {},
        activeTab: 'logo',
        onTabChange: () => {}
      })
    )
  );

  assert.ok(html.includes('Upload Vector / Image Decal'), 'Should render upload decal button');
  assert.ok(html.includes('Applied Decals'), 'Should render applied decals header');
});

test('SportswearInspector renders Text panel controls when activeTab="text"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {},
        activeTab: 'text',
        onTabChange: () => {}
      })
    )
  );

  assert.ok(html.includes('Add Player Name / Number'), 'Should render player name/number header');
  assert.ok(html.includes('placeholder="e.g. 10 / NEYMAR"'), 'Should render text input');
  assert.ok(html.includes('Active Embroidery Overlays'), 'Should render active overlays header');
});

test('SportswearInspector renders Finishing panel controls when activeTab="finishing"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {},
        activeTab: 'finishing',
        onTabChange: () => {}
      })
    )
  );

  assert.ok(html.includes('Customization Summary'), 'Should render customization summary');
  assert.ok(html.includes('Quality Verification'), 'Should render quality verification');
  assert.ok(html.includes('Finish &amp; Request Tech Pack') || html.includes('Finish & Request Tech Pack'), 'Should render finish button');
});

// --------------------------------------------------------------------------
// 2. MobileConfigDock Component Tests
// --------------------------------------------------------------------------
test('MobileConfigDock renders FloatingControlDock with 5 tool tabs and live badges', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(MobileConfigDock, {
        activePanel: null,
        onSelectPanel: () => {},
        isMobile: false
      })
    )
  );

  assert.ok(html.includes('vs-floating-control-dock'), 'Should render floating dock container');
  assert.ok(html.includes('Color'), 'Should render Color tool');
  assert.ok(html.includes('Fabric'), 'Should render Fabric tool');
  assert.ok(html.includes('Logo'), 'Should render Logo tool');
  assert.ok(html.includes('Text'), 'Should render Text tool');
  assert.ok(html.includes('Finish'), 'Should render Finish tool');
});

test('MobileConfigDock renders spring-up popover bubble when isMobile=true and activePanel="color"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(MobileConfigDock, {
        activePanel: 'color',
        onSelectPanel: () => {},
        isMobile: true
      })
    )
  );

  assert.ok(html.includes('vs-floating-dock-popover-bubble'), 'Should render popover bubble on mobile');
  assert.ok(html.includes('tooltip-color-wrap'), 'Should render mobile color panel');
  assert.ok(html.includes('layer-numbers-bar'), 'Should render layer number selector');
});

test('MobileConfigDock suppresses popover bubble when isMobile=false (Desktop / Tablet)', () => {
  const html = renderToStaticMarkup(
    withStore(
      React.createElement(MobileConfigDock, {
        activePanel: 'color',
        onSelectPanel: () => {},
        isMobile: false
      })
    )
  );

  assert.ok(!html.includes('vs-floating-dock-popover-bubble'), 'Should suppress popover bubble when not mobile');
});

// --------------------------------------------------------------------------
// 3. OrderFormModal Component Tests
// --------------------------------------------------------------------------
test('OrderFormModal renders FrostedModalDialog when showOrderForm=true', () => {
  configStore.setShowOrderForm(true);

  const html = renderToStaticMarkup(
    withStore(React.createElement(OrderFormModal))
  );

  assert.ok(html.includes('vs-frosted-modal-backdrop'), 'Should render frosted modal backdrop');
  assert.ok(html.includes('vs-frosted-modal-dialog'), 'Should render frosted modal dialog');
  assert.ok(html.includes('Tech Pack / Order Form'), 'Should render modal title');
  assert.ok(html.includes('Sportswear Configurator Details'), 'Should render modal subtitle');
  assert.ok(html.includes('TechPackExport'), 'Should render tech pack export DOM element');
  assert.ok(html.includes('Download PDF'), 'Should render PDF download button');

  // Reset store
  configStore.setShowOrderForm(false);
});

test('OrderFormModal returns null when showOrderForm=false', () => {
  configStore.setShowOrderForm(false);

  const html = renderToStaticMarkup(
    withStore(React.createElement(OrderFormModal))
  );

  assert.equal(html, '', 'Should render nothing when modal is closed');
});

// --------------------------------------------------------------------------
// 4. Theme Integration & Persistence Tests
// --------------------------------------------------------------------------
test('AppHeaderBar connects dynamically to VictorShellThemeProvider accent', () => {
  function ThemeStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      productTitle: 'SPORTSWEAR LAB',
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true
    });
  }

  const html = renderToStaticMarkup(
    React.createElement(VictorShellThemeProvider, { initialAccent: 'indigo' },
      React.createElement(ThemeStage)
    )
  );

  assert.ok(html.includes('data-accent="indigo"'), 'Root should carry initial data-accent="indigo"');
  assert.ok(html.includes('vs-theme-accent-btn--indigo is-active'), 'AppHeaderBar should have active indigo theme pill');
});

test('VictorShellThemeProvider persists custom theme selection across re-renders without resetting to indigo', () => {
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
      this.isTrusted = false;
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
    removeChild(c) {
      const idx = this.childNodes.indexOf(c);
      if (idx !== -1) {
        this.childNodes.splice(idx, 1);
        c.parentNode = null;
      }
      return c;
    }
    insertBefore(n, r) {
      n.parentNode = this;
      const idx = this.childNodes.indexOf(r);
      if (idx !== -1) this.childNodes.splice(idx, 0, n);
      else this.childNodes.push(n);
      return n;
    }
    dispatchEvent(event) {
      event.target = this;
      const path = [];
      let cur = this;
      while (cur) {
        path.push(cur);
        cur = cur.parentNode;
      }
      if (this.ownerDocument && !path.includes(this.ownerDocument)) {
        path.push(this.ownerDocument);
      }
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
      // Dispatches a real bubbling DOM click event through React's event listener system
      this.dispatchEvent(new MockEvent('click', { bubbles: true, cancelable: true }));
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
  globalThis.window = win;
  globalThis.document = mockDoc;
  globalThis.Event = MockEvent;

  let currentContext = null;
  let triggerUnrelatedReRender = null;
  let renderCount = 0;

  function InteractiveHarness() {
    const themeContext = useVictorShellTheme();
    currentContext = themeContext;
    const [counter, setCounter] = React.useState(0);
    triggerUnrelatedReRender = () => setCounter(c => c + 1);
    renderCount++;

    return React.createElement('div', { id: 'test-harness' },
      React.createElement(AppHeaderBar, {
        brandTitle: 'TRIKOMI',
        productTitle: 'SPORTSWEAR LAB',
        theme: themeContext.accent,
        onThemeChange: themeContext.setAccent,
        showThemeSwitcher: true
      }),
      React.createElement('span', { id: 'counter-val' }, counter)
    );
  }

  const container = mockDoc.createElement('div');
  const root = createRoot(container);

  // Requirement 2: Render VictorShellThemeProvider ONCE with initialAccent="indigo"
  // Requirement 8: Do not create new providers to simulate theme changes
  act(() => {
    root.render(
      React.createElement(VictorShellThemeProvider, { initialAccent: 'indigo' },
        React.createElement(InteractiveHarness)
      )
    );
  });

  // Requirement 7: Verify that the initial default is still Indigo
  assert.equal(currentContext.accent, 'indigo', 'Initial theme context must be indigo');
  const rootWrapper = container.childNodes[0];
  assert.equal(rootWrapper.attributes['data-accent'], 'indigo', 'VictorShellThemeProvider root must have data-accent="indigo"');

  const indigoBtn = container.find(el => el.attributes['aria-label'] === 'Electric Indigo Theme');
  assert.ok(indigoBtn, 'Indigo theme button must be rendered in AppHeaderBar');
  assert.ok(indigoBtn.className.includes('is-active'), 'Indigo button should be active initially');

  // Requirement 3: Simulate clicking the actual AppHeaderBar theme switcher to select Orchid
  const orchidBtn = container.find(el => el.attributes['aria-label'] === 'Orchid Glow Theme');
  assert.ok(orchidBtn, 'Orchid theme button must exist in AppHeaderBar');

  act(() => {
    orchidBtn.click();
  });

  // Requirement 4: Verify that the provider context and document data-accent update to orchid
  assert.equal(currentContext.accent, 'orchid', 'Provider context accent must update to orchid after click');
  assert.equal(document.documentElement.getAttribute('data-accent'), 'orchid', 'document.documentElement data-accent must update to orchid');
  assert.equal(rootWrapper.attributes['data-accent'], 'orchid', 'Provider root data-accent must update to orchid');
  assert.ok(orchidBtn.className.includes('is-active'), 'Orchid button must be active');
  assert.ok(!indigoBtn.className.includes('is-active'), 'Indigo button must not be active');

  // Requirement 5: Trigger an unrelated component re-render and verify that the selected theme remains orchid
  const rendersBefore = renderCount;
  act(() => {
    triggerUnrelatedReRender();
  });
  assert.ok(renderCount > rendersBefore, 'Component should have re-rendered');
  assert.equal(currentContext.accent, 'orchid', 'Theme must remain orchid across unrelated re-render without resetting to indigo');
  assert.equal(document.documentElement.getAttribute('data-accent'), 'orchid', 'document data-accent must remain orchid across unrelated re-render');
  assert.equal(rootWrapper.attributes['data-accent'], 'orchid', 'Provider root data-accent must remain orchid across unrelated re-render');

  // Requirement 6: Switch to Violet and verify the same behavior
  const violetBtn = container.find(el => el.attributes['aria-label'] === 'Royal Violet Theme');
  assert.ok(violetBtn, 'Violet theme button must exist in AppHeaderBar');

  act(() => {
    violetBtn.click();
  });

  // When violet is selected, AppHeaderBar removes data-accent attribute (violet is default theme in CSS)
  assert.equal(currentContext.accent, 'violet', 'Provider context accent must update to violet');
  assert.equal(document.documentElement.getAttribute('data-accent'), undefined, 'document data-accent must be removed for violet');
  assert.equal(rootWrapper.attributes['data-accent'], 'violet', 'Provider root data-accent must update to violet');
  assert.ok(violetBtn.className.includes('is-active'), 'Violet button must be active');

  // Trigger another unrelated re-render and verify violet persists
  act(() => {
    triggerUnrelatedReRender();
  });
  assert.equal(currentContext.accent, 'violet', 'Theme must remain violet across re-render without resetting to indigo');
  assert.equal(document.documentElement.getAttribute('data-accent'), undefined, 'document data-accent must remain undefined for violet across re-render');
  assert.equal(rootWrapper.attributes['data-accent'], 'violet', 'Provider root data-accent must remain violet across re-render');

  // Clean up root
  act(() => {
    root.unmount();
  });
});
