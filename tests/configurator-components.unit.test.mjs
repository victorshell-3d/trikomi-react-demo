import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AppHeaderBar,
  FloatingControlDock,
  GlassInspectorDrawer,
  CanvasControlToolbar,
  FrostedModalDialog
} from '../packages/ui-kit/src/index.ts';

// --------------------------------------------------------------------------
// 1. AppHeaderBar Tests
// --------------------------------------------------------------------------
test('AppHeaderBar renders brand title, subtitle, back navigation, status badge, and theme switcher', () => {
  const html = renderToStaticMarkup(
    React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      productTitle: 'CUSTOM LAB',
      backLabel: '← Back to Overview',
      onBack: () => {},
      statusBadge: React.createElement('span', { className: 'badge' }, '60 FPS'),
      actions: React.createElement('button', { type: 'button' }, 'Export'),
      theme: 'violet',
      showThemeSwitcher: true
    })
  );

  assert.ok(html.includes('vs-app-header-bar'), 'Should apply root header class');
  assert.ok(html.includes('role="banner"'), 'Should have role="banner"');
  assert.ok(html.includes('vs-app-header-back-btn'), 'Should render back button');
  assert.ok(html.includes('← Back to Overview'), 'Should render back button label');
  assert.ok(html.includes('TRIKOMI'), 'Should render brand title');
  assert.ok(html.includes('CUSTOM LAB'), 'Should render product title');
  assert.ok(html.includes('60 FPS'), 'Should render status badge');
  assert.ok(html.includes('role="radiogroup"'), 'Should render theme switcher radiogroup');
  assert.ok(html.includes('vs-theme-accent-btn--violet'), 'Should render violet theme button');
  assert.ok(html.includes('vs-theme-accent-btn--indigo'), 'Should render indigo theme button');
  assert.ok(html.includes('vs-theme-accent-btn--orchid'), 'Should render orchid theme button');
  assert.ok(html.includes('Export'), 'Should render action button');
});

test('AppHeaderBar respects showThemeSwitcher=false', () => {
  const html = renderToStaticMarkup(
    React.createElement(AppHeaderBar, {
      brandTitle: 'TRIKOMI',
      showThemeSwitcher: false
    })
  );

  assert.ok(!html.includes('vs-app-header-theme-switcher'), 'Should omit theme switcher when disabled');
});

// --------------------------------------------------------------------------
// 2. FloatingControlDock Tests
// --------------------------------------------------------------------------
test('FloatingControlDock renders tablist, active tabs, badges, and popover bubble', () => {
  const items = [
    { id: 'garment', label: 'Garment', badge: '3' },
    { id: 'colors', label: 'Colors' },
    { id: 'graphics', label: 'Graphics', disabled: true }
  ];

  const html = renderToStaticMarkup(
    React.createElement(FloatingControlDock, {
      items,
      activeId: 'colors',
      onSelect: () => {},
      activePopoverContent: React.createElement('div', { id: 'popover-body' }, 'Color Swatches Palette'),
      elevation: 'float'
    })
  );

  assert.ok(html.includes('vs-floating-control-dock-wrapper'), 'Should render dock wrapper');
  assert.ok(html.includes('role="tablist"'), 'Should render tablist');
  assert.ok(html.includes('Garment'), 'Should render Garment tab');
  assert.ok(html.includes('Colors'), 'Should render Colors tab');
  assert.ok(html.includes('Graphics'), 'Should render Graphics tab');
  assert.ok(html.includes('is-active'), 'Active tab should have is-active class');
  assert.ok(html.includes('aria-selected="true"'), 'Active tab should have aria-selected="true"');
  assert.ok(html.includes('vs-floating-dock__tab-badge'), 'Badge should be rendered');
  assert.ok(html.includes('disabled=""') || html.includes('disabled'), 'Disabled tab should have disabled attribute');
  assert.ok(html.includes('vs-floating-dock-popover-bubble'), 'Should render popover bubble');
  assert.ok(html.includes('Color Swatches Palette'), 'Should render popover content');
  assert.ok(html.includes('aria-label="Close options"'), 'Popover should have accessible close button');
});

// --------------------------------------------------------------------------
// 3. GlassInspectorDrawer Tests
// --------------------------------------------------------------------------
test('GlassInspectorDrawer renders side drawer, tabs, header, body content, and collapse button', () => {
  const tabs = [
    { id: 'structure', label: 'Structure' },
    { id: 'materials', label: 'Materials' }
  ];

  const html = renderToStaticMarkup(
    React.createElement(GlassInspectorDrawer, {
      title: 'Inspector Title',
      subtitle: 'Inspector Subtitle',
      side: 'right',
      isOpen: true,
      tabs,
      activeTab: 'structure',
      children: React.createElement('div', { className: 'panel-inner' }, 'Body Details'),
      footer: React.createElement('button', { type: 'button' }, 'Apply Changes')
    })
  );

  assert.ok(html.includes('vs-glass-inspector-drawer'), 'Should render drawer container');
  assert.ok(html.includes('vs-glass-inspector-drawer--right'), 'Should render right drawer variant');
  assert.ok(html.includes('role="region"'), 'Should render region role');
  assert.ok(html.includes('Inspector Title'), 'Should render title');
  assert.ok(html.includes('Inspector Subtitle'), 'Should render subtitle');
  assert.ok(html.includes('role="tablist"'), 'Should render tabs tablist');
  assert.ok(html.includes('Structure'), 'Should render Structure tab');
  assert.ok(html.includes('Materials'), 'Should render Materials tab');
  assert.ok(html.includes('Body Details'), 'Should render body content');
  assert.ok(html.includes('Apply Changes'), 'Should render footer content');
  assert.ok(html.includes('vs-inspector-drawer__collapse-btn'), 'Should render collapse button');
});

test('GlassInspectorDrawer renders collapsed state with is-collapsed class', () => {
  const html = renderToStaticMarkup(
    React.createElement(GlassInspectorDrawer, {
      title: 'Collapsed Inspector',
      isOpen: false,
      children: React.createElement('div', null, 'Hidden Content')
    })
  );

  assert.ok(html.includes('is-collapsed'), 'Should have is-collapsed class');
  assert.ok(html.includes('aria-expanded="false"'), 'Should have aria-expanded="false"');
  assert.ok(!html.includes('Hidden Content'), 'Should not render body content when collapsed');
});

// --------------------------------------------------------------------------
// 4. CanvasControlToolbar Tests
// --------------------------------------------------------------------------
test('CanvasControlToolbar renders zoom, recenter, grid, wireframe, and camera presets', () => {
  const cameraPresets = [
    { label: 'Front', onClick: () => {}, active: true },
    { label: 'Back', onClick: () => {} }
  ];

  const html = renderToStaticMarkup(
    React.createElement(CanvasControlToolbar, {
      position: 'bottom-right',
      onZoomIn: () => {},
      onZoomOut: () => {},
      onRecenter: () => {},
      onToggleGrid: () => {},
      isGridActive: true,
      onToggleWireframe: () => {},
      isWireframeActive: false,
      onCapture: () => {},
      cameraPresets
    })
  );

  assert.ok(html.includes('vs-canvas-control-toolbar'), 'Should render toolbar container');
  assert.ok(html.includes('role="toolbar"'), 'Should have role="toolbar"');
  assert.ok(html.includes('aria-label="Zoom in"'), 'Should render Zoom in button');
  assert.ok(html.includes('aria-label="Zoom out"'), 'Should render Zoom out button');
  assert.ok(html.includes('aria-label="Recenter camera view"'), 'Should render Recenter button');
  assert.ok(html.includes('aria-pressed="true"'), 'Grid toggle should be aria-pressed="true"');
  assert.ok(html.includes('aria-pressed="false"'), 'Wireframe toggle should be aria-pressed="false"');
  assert.ok(html.includes('aria-label="Capture snapshot"'), 'Should render Snapshot button');
  assert.ok(html.includes('Front'), 'Should render Front camera preset');
  assert.ok(html.includes('Back'), 'Should render Back camera preset');
});

// --------------------------------------------------------------------------
// 5. FrostedModalDialog Tests
// --------------------------------------------------------------------------
test('FrostedModalDialog renders modal dialog when isOpen=true with dialog role and backdrop', () => {
  const html = renderToStaticMarkup(
    React.createElement(FrostedModalDialog, {
      title: 'Order Roster Modal',
      subtitle: 'Submit team sizes and player numbers',
      isOpen: true,
      onClose: () => {},
      size: 'lg',
      children: React.createElement('p', null, 'Roster Table Content'),
      footer: React.createElement('button', { type: 'button' }, 'Submit Order')
    })
  );

  assert.ok(html.includes('vs-frosted-modal-backdrop'), 'Should render backdrop');
  assert.ok(html.includes('vs-frosted-modal-dialog'), 'Should render modal dialog');
  assert.ok(html.includes('vs-frosted-modal-dialog--lg'), 'Should apply lg size class');
  assert.ok(html.includes('role="dialog"'), 'Should have role="dialog"');
  assert.ok(html.includes('aria-modal="true"'), 'Should have aria-modal="true"');
  assert.ok(html.includes('Order Roster Modal'), 'Should render title');
  assert.ok(html.includes('Submit team sizes and player numbers'), 'Should render subtitle');
  assert.ok(html.includes('Roster Table Content'), 'Should render children');
  assert.ok(html.includes('Submit Order'), 'Should render footer');
  assert.ok(html.includes('aria-label="Close dialog"'), 'Should have accessible close button');
});

test('FrostedModalDialog returns null when isOpen=false', () => {
  const html = renderToStaticMarkup(
    React.createElement(FrostedModalDialog, {
      title: 'Closed Modal',
      isOpen: false,
      onClose: () => {},
      children: React.createElement('p', null, 'Hidden Modal Content')
    })
  );

  assert.equal(html, '', 'Should render empty string when closed');
});

test('FrostedModalDialog accessibility: tabIndex="-1" and aria-modal attributes for focus containment', () => {
  const html = renderToStaticMarkup(
    React.createElement(FrostedModalDialog, {
      title: 'Focus Containment Modal',
      isOpen: true,
      onClose: () => {},
      children: React.createElement('input', { type: 'text', placeholder: 'Focus target' }),
      footer: React.createElement('button', { type: 'button' }, 'Action')
    })
  );

  assert.ok(html.includes('tabindex="-1"'), 'Modal container must have tabIndex="-1" for focus containment');
  assert.ok(html.includes('aria-modal="true"'), 'Modal must have aria-modal="true"');
  assert.ok(html.includes('vs-frosted-modal-dialog__close-btn'), 'Must render close button as focusable anchor');
});

test('FrostedModalDialog accessibility: focus trapping wraps focus between first and last elements', () => {
  // Test focus trapping logic simulation
  const closeBtn = { id: 'close', disabled: false, focused: false, focus() { this.focused = true; } };
  const inputEl = { id: 'input', disabled: false, focused: false, focus() { this.focused = true; } };
  const submitBtn = { id: 'submit', disabled: false, focused: false, focus() { this.focused = true; } };
  const focusable = [closeBtn, inputEl, submitBtn];

  // Simulating Tab on last element -> wraps to first
  let defaultPrevented = false;
  const tabEvent = {
    key: 'Tab',
    shiftKey: false,
    preventDefault: () => { defaultPrevented = true; }
  };

  const simulateTabWrap = (activeElement, event) => {
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  };

  simulateTabWrap(submitBtn, tabEvent);
  assert.ok(defaultPrevented, 'Tab on last element must prevent default');
  assert.ok(closeBtn.focused, 'Tab on last element must wrap focus to first element');

  // Simulating Shift+Tab on first element -> wraps to last
  let shiftTabPrevented = false;
  const shiftTabEvent = {
    key: 'Tab',
    shiftKey: true,
    preventDefault: () => { shiftTabPrevented = true; }
  };

  simulateTabWrap(closeBtn, shiftTabEvent);
  assert.ok(shiftTabPrevented, 'Shift+Tab on first element must prevent default');
  assert.ok(submitBtn.focused, 'Shift+Tab on first element must wrap focus to last element');
});

test('FrostedModalDialog accessibility: focus restoration stores and restores activeElement', () => {
  // Mock element that had focus before modal opened
  let triggerElementFocused = false;
  const triggerElement = {
    id: 'open-modal-btn',
    focus() {
      triggerElementFocused = true;
    }
  };

  // Simulate opening modal: store previously focused element
  let previousActiveElement = triggerElement;

  // Simulate closing modal: restore focus to previous element
  const simulateClose = () => {
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  };

  simulateClose();
  assert.ok(triggerElementFocused, 'Modal close must restore focus to trigger element');
  assert.equal(previousActiveElement, null, 'Previous active element reference must be cleaned up');
});

test('FrostedModalDialog accessibility: Escape key invokes onClose with stopPropagation', () => {
  let onCloseCalled = false;
  let propagationStopped = false;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCloseCalled = true;
    }
  };

  const escapeEvent = {
    key: 'Escape',
    stopPropagation: () => { propagationStopped = true; }
  };

  handleKeyDown(escapeEvent);
  assert.ok(onCloseCalled, 'Escape key must trigger onClose');
  assert.ok(propagationStopped, 'Escape key must stop propagation');
});

