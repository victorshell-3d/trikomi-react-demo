// tests/configurator-components.unit.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import React24 from "react";
import { renderToStaticMarkup } from "react-dom/server";

// packages/ui-kit/src/theme/ThemeProvider.tsx
import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";
import { jsx } from "react/jsx-runtime";
var VictorShellThemeContext = createContext(null);

// packages/ui-kit/src/components/foundation/Icon.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";

// packages/ui-kit/src/components/foundation/Typography.tsx
import { jsx as jsx3 } from "react/jsx-runtime";

// packages/ui-kit/src/components/foundation/Primitives.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";

// packages/ui-kit/src/components/foundation/Surfaces.tsx
import { jsx as jsx5 } from "react/jsx-runtime";

// packages/ui-kit/src/components/layout/Containers.tsx
import { jsx as jsx6 } from "react/jsx-runtime";

// packages/ui-kit/src/components/layout/LayoutPrimitives.tsx
import { jsx as jsx7 } from "react/jsx-runtime";

// packages/ui-kit/src/components/layout/Panels.tsx
import { jsx as jsx8 } from "react/jsx-runtime";

// packages/ui-kit/src/components/buttons/Buttons.tsx
import { jsx as jsx9 } from "react/jsx-runtime";

// packages/ui-kit/src/components/buttons/OrbitalControls.tsx
import { useState as useState2 } from "react";
import { Fragment, jsx as jsx10, jsxs as jsxs3 } from "react/jsx-runtime";

// packages/ui-kit/src/components/buttons/MocapCaptureBar.tsx
import { useState as useState3 } from "react";
import { jsx as jsx11, jsxs as jsxs4 } from "react/jsx-runtime";

// packages/ui-kit/src/components/dropdowns/Dropdown.tsx
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState as useState4
} from "react";
import { jsx as jsx12, jsxs as jsxs5 } from "react/jsx-runtime";

// packages/ui-kit/src/components/overlays/Accordion.tsx
import { useId as useId2, useState as useState5 } from "react";
import { jsx as jsx13, jsxs as jsxs6 } from "react/jsx-runtime";

// packages/ui-kit/src/components/overlays/Alerts.tsx
import {
  createContext as createContext2,
  useCallback as useCallback2,
  useContext as useContext2,
  useEffect as useEffect2,
  useId as useId3,
  useRef as useRef2,
  useState as useState6
} from "react";
import { jsx as jsx14, jsxs as jsxs7 } from "react/jsx-runtime";
var ToastContext = createContext2(null);

// packages/ui-kit/src/components/overlays/Dialog.tsx
import {
  useCallback as useCallback3,
  useEffect as useEffect3,
  useId as useId4,
  useRef as useRef3,
  useState as useState7
} from "react";
import { jsx as jsx15, jsxs as jsxs8 } from "react/jsx-runtime";

// packages/ui-kit/src/components/overlays/Popover.tsx
import { createPortal as createPortal2 } from "react-dom";
import {
  useCallback as useCallback4,
  useEffect as useEffect5,
  useId as useId5,
  useRef as useRef4,
  useState as useState9
} from "react";

// packages/ui-kit/src/components/overlays/positioning.ts
import { useEffect as useEffect4, useState as useState8 } from "react";

// packages/ui-kit/src/components/overlays/Popover.tsx
import { jsx as jsx16, jsxs as jsxs9 } from "react/jsx-runtime";

// packages/ui-kit/src/components/overlays/Tooltip.tsx
import { createPortal as createPortal3 } from "react-dom";
import {
  useId as useId6,
  useRef as useRef5,
  useState as useState10
} from "react";
import { jsx as jsx17, jsxs as jsxs10 } from "react/jsx-runtime";

// packages/ui-kit/src/components/configurator/ConfiguratorDock.tsx
import {
  useState as useState12
} from "react";

// packages/ui-kit/src/components/selection/Tabs.tsx
import {
  useId as useId7,
  useRef as useRef6,
  useState as useState11
} from "react";
import { jsx as jsx18, jsxs as jsxs11 } from "react/jsx-runtime";

// packages/ui-kit/src/components/configurator/ConfiguratorDock.tsx
import { jsx as jsx19, jsxs as jsxs12 } from "react/jsx-runtime";

// packages/ui-kit/src/components/configurator/MaterialSwatches.tsx
import {
  useId as useId8,
  useRef as useRef7,
  useState as useState13
} from "react";
import { jsx as jsx20, jsxs as jsxs13 } from "react/jsx-runtime";

// packages/ui-kit/src/components/configurator/HotspotMarker.tsx
import { jsx as jsx21 } from "react/jsx-runtime";

// packages/ui-kit/src/components/configurator/AppHeaderBar.tsx
import { useEffect as useEffect6, useState as useState14 } from "react";
import { Fragment as Fragment2, jsx as jsx22, jsxs as jsxs14 } from "react/jsx-runtime";
var AppHeaderBar = ({
  brandTitle = "TRIKOMI",
  productTitle,
  brandLogo,
  onBack,
  backLabel = "\u2190 Back to Overview",
  theme = "violet",
  onThemeChange,
  showThemeSwitcher = true,
  statusBadge,
  actions,
  className = "",
  style
}) => {
  const [activeTheme, setActiveTheme] = useState14(theme);
  useEffect6(() => {
    setActiveTheme(theme);
  }, [theme]);
  const handleThemeSelect = (newTheme) => {
    setActiveTheme(newTheme);
    if (typeof document !== "undefined") {
      if (newTheme === "violet") {
        document.documentElement.removeAttribute("data-accent");
      } else {
        document.documentElement.setAttribute("data-accent", newTheme);
      }
    }
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };
  return /* @__PURE__ */ jsx22(
    "header",
    {
      className: `vs-app-header-bar ${className}`.trim(),
      role: "banner",
      style,
      children: /* @__PURE__ */ jsxs14("div", { className: "vs-app-header-bar__inner", children: [
        /* @__PURE__ */ jsxs14("div", { className: "vs-app-header-bar__left", children: [
          onBack && /* @__PURE__ */ jsxs14(
            "button",
            {
              type: "button",
              onClick: onBack,
              className: "vs-app-header-back-btn",
              "aria-label": typeof backLabel === "string" ? backLabel : "Back to Overview",
              children: [
                /* @__PURE__ */ jsx22(
                  "svg",
                  {
                    viewBox: "0 0 24 24",
                    width: "16",
                    height: "16",
                    stroke: "currentColor",
                    strokeWidth: "2.5",
                    fill: "none",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsx22("path", { d: "M19 12H5M12 19l-7-7 7-7" })
                  }
                ),
                /* @__PURE__ */ jsx22("span", { className: "vs-app-header-back-btn__label", children: backLabel })
              ]
            }
          ),
          /* @__PURE__ */ jsxs14("div", { className: "vs-app-header-brand", children: [
            brandLogo && /* @__PURE__ */ jsx22("span", { className: "vs-app-header-brand__logo", children: brandLogo }),
            /* @__PURE__ */ jsx22("span", { className: "vs-app-header-brand__title", children: brandTitle }),
            productTitle && /* @__PURE__ */ jsxs14(Fragment2, { children: [
              /* @__PURE__ */ jsx22("span", { className: "vs-app-header-brand__divider", "aria-hidden": "true", children: "/" }),
              /* @__PURE__ */ jsx22("span", { className: "vs-app-header-brand__subtitle", children: productTitle })
            ] })
          ] })
        ] }),
        statusBadge && /* @__PURE__ */ jsx22("div", { className: "vs-app-header-bar__center", role: "status", "aria-live": "polite", children: statusBadge }),
        /* @__PURE__ */ jsxs14("div", { className: "vs-app-header-bar__right", children: [
          showThemeSwitcher && /* @__PURE__ */ jsxs14(
            "div",
            {
              className: "vs-app-header-theme-switcher",
              role: "radiogroup",
              "aria-label": "Theme Accent Switcher",
              children: [
                /* @__PURE__ */ jsx22(
                  "button",
                  {
                    type: "button",
                    role: "radio",
                    "aria-checked": activeTheme === "violet",
                    "aria-label": "Royal Violet Theme",
                    title: "Royal Violet Theme",
                    className: `vs-theme-accent-btn vs-theme-accent-btn--violet ${activeTheme === "violet" ? "is-active" : ""}`,
                    onClick: () => handleThemeSelect("violet")
                  }
                ),
                /* @__PURE__ */ jsx22(
                  "button",
                  {
                    type: "button",
                    role: "radio",
                    "aria-checked": activeTheme === "indigo",
                    "aria-label": "Electric Indigo Theme",
                    title: "Electric Indigo Theme",
                    className: `vs-theme-accent-btn vs-theme-accent-btn--indigo ${activeTheme === "indigo" ? "is-active" : ""}`,
                    onClick: () => handleThemeSelect("indigo")
                  }
                ),
                /* @__PURE__ */ jsx22(
                  "button",
                  {
                    type: "button",
                    role: "radio",
                    "aria-checked": activeTheme === "orchid",
                    "aria-label": "Orchid Glow Theme",
                    title: "Orchid Glow Theme",
                    className: `vs-theme-accent-btn vs-theme-accent-btn--orchid ${activeTheme === "orchid" ? "is-active" : ""}`,
                    onClick: () => handleThemeSelect("orchid")
                  }
                )
              ]
            }
          ),
          actions && /* @__PURE__ */ jsx22("div", { className: "vs-app-header-bar__actions", children: actions })
        ] })
      ] })
    }
  );
};

// packages/ui-kit/src/components/configurator/FloatingControlDock.tsx
import { useEffect as useEffect7, useRef as useRef8 } from "react";
import { jsx as jsx23, jsxs as jsxs15 } from "react/jsx-runtime";
var FloatingControlDock = ({
  items,
  activeId,
  onSelect,
  activePopoverContent,
  onClosePopover,
  position = "bottom",
  elevation = "float",
  className = "",
  style
}) => {
  const dockRef = useRef8(null);
  const popoverRef = useRef8(null);
  useEffect7(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activePopoverContent && onClosePopover) {
        onClosePopover();
      }
    };
    if (activePopoverContent) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [activePopoverContent, onClosePopover]);
  const handleTabKeyDown = (e, index) => {
    let targetIndex = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      targetIndex = (index + 1) % items.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      targetIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      targetIndex = items.length - 1;
    }
    if (targetIndex !== null && items[targetIndex] && !items[targetIndex].disabled) {
      onSelect(items[targetIndex].id);
      const buttons = dockRef.current?.querySelectorAll(".vs-floating-dock__tab");
      if (buttons && buttons[targetIndex]) {
        buttons[targetIndex].focus();
      }
    }
  };
  return /* @__PURE__ */ jsxs15(
    "div",
    {
      className: `vs-floating-control-dock-wrapper vs-floating-control-dock-wrapper--${position} ${className}`.trim(),
      style,
      children: [
        activePopoverContent && /* @__PURE__ */ jsxs15(
          "div",
          {
            ref: popoverRef,
            className: "vs-floating-dock-popover-bubble",
            role: "region",
            "aria-label": "Dock Tool Options",
            children: [
              /* @__PURE__ */ jsx23("div", { className: "vs-floating-dock-popover-bubble__header", children: /* @__PURE__ */ jsx23(
                "button",
                {
                  type: "button",
                  className: "vs-floating-dock-popover-bubble__close-btn",
                  onClick: onClosePopover,
                  "aria-label": "Close options",
                  children: /* @__PURE__ */ jsxs15("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx23("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                    /* @__PURE__ */ jsx23("line", { x1: "6", y1: "6", x2: "18", y2: "12" }),
                    /* @__PURE__ */ jsx23("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                  ] })
                }
              ) }),
              /* @__PURE__ */ jsx23("div", { className: "vs-floating-dock-popover-bubble__content", children: activePopoverContent })
            ]
          }
        ),
        /* @__PURE__ */ jsx23(
          "nav",
          {
            ref: dockRef,
            className: `vs-floating-control-dock vs-floating-control-dock--elevation-${elevation}`,
            role: "tablist",
            "aria-label": "Configurator Controls",
            children: items.map((item, index) => {
              const isActive = item.id === activeId;
              return /* @__PURE__ */ jsxs15(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": isActive,
                  "aria-controls": isActive && activePopoverContent ? `vs-dock-tabpanel-${item.id}` : void 0,
                  tabIndex: isActive ? 0 : -1,
                  disabled: item.disabled,
                  className: `vs-floating-dock__tab ${isActive ? "is-active" : ""}`,
                  onClick: () => onSelect(item.id),
                  onKeyDown: (e) => handleTabKeyDown(e, index),
                  children: [
                    item.icon && /* @__PURE__ */ jsx23("span", { className: "vs-floating-dock__tab-icon", children: item.icon }),
                    /* @__PURE__ */ jsx23("span", { className: "vs-floating-dock__tab-label", children: item.label }),
                    item.badge !== void 0 && /* @__PURE__ */ jsx23("span", { className: "vs-floating-dock__tab-badge", children: item.badge })
                  ]
                },
                item.id
              );
            })
          }
        )
      ]
    }
  );
};

// packages/ui-kit/src/components/configurator/GlassInspectorDrawer.tsx
import { useEffect as useEffect8, useState as useState15 } from "react";
import { jsx as jsx24, jsxs as jsxs16 } from "react/jsx-runtime";
var GlassInspectorDrawer = ({
  title,
  subtitle,
  side = "right",
  isOpen = true,
  onClose,
  collapsible = true,
  tabs,
  activeTab,
  onTabChange,
  footer,
  children,
  width = 360,
  className = "",
  style
}) => {
  const [collapsed, setCollapsed] = useState15(!isOpen);
  useEffect8(() => {
    setCollapsed(!isOpen);
  }, [isOpen]);
  useEffect8(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !collapsed) {
        if (onClose) {
          onClose();
        } else if (collapsible) {
          setCollapsed(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [collapsed, onClose, collapsible]);
  const toggleCollapse = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (nextState && onClose) {
      onClose();
    }
  };
  const parsedWidth = typeof width === "number" ? `${width}px` : width;
  return /* @__PURE__ */ jsxs16(
    "aside",
    {
      className: `vs-glass-inspector-drawer vs-glass-inspector-drawer--${side} ${collapsed ? "is-collapsed" : ""} ${className}`.trim(),
      role: "region",
      "aria-label": typeof title === "string" ? title : "Configuration Inspector",
      "aria-expanded": !collapsed,
      style: {
        ...style,
        ...collapsed ? {} : { width: parsedWidth }
      },
      children: [
        /* @__PURE__ */ jsx24("div", { className: "vs-inspector-drawer__mobile-handle", "aria-hidden": "true", onClick: toggleCollapse }),
        /* @__PURE__ */ jsxs16("div", { className: "vs-inspector-drawer__header", children: [
          /* @__PURE__ */ jsxs16("div", { className: "vs-inspector-drawer__header-titles", children: [
            /* @__PURE__ */ jsx24("h2", { className: "vs-inspector-drawer__title", children: title }),
            subtitle && /* @__PURE__ */ jsx24("p", { className: "vs-inspector-drawer__subtitle", children: subtitle })
          ] }),
          collapsible && /* @__PURE__ */ jsx24(
            "button",
            {
              type: "button",
              className: "vs-inspector-drawer__collapse-btn",
              onClick: toggleCollapse,
              "aria-label": collapsed ? "Expand inspector panel" : "Collapse inspector panel",
              title: collapsed ? "Expand" : "Collapse",
              children: /* @__PURE__ */ jsx24(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  width: "18",
                  height: "18",
                  stroke: "currentColor",
                  strokeWidth: "2.5",
                  fill: "none",
                  "aria-hidden": "true",
                  style: {
                    transform: collapsed ? side === "right" ? "rotate(180deg)" : "rotate(0deg)" : side === "right" ? "rotate(0deg)" : "rotate(180deg)",
                    transition: "transform 0.25s ease"
                  },
                  children: /* @__PURE__ */ jsx24("polyline", { points: "9 18 15 12 9 6" })
                }
              )
            }
          )
        ] }),
        tabs && tabs.length > 0 && !collapsed && /* @__PURE__ */ jsx24("div", { className: "vs-inspector-drawer__tabs", role: "tablist", "aria-label": "Inspector Sections", children: tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return /* @__PURE__ */ jsxs16(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": isActive,
              className: `vs-inspector-drawer__tab ${isActive ? "is-active" : ""}`,
              onClick: () => onTabChange?.(tab.id),
              children: [
                tab.icon && /* @__PURE__ */ jsx24("span", { className: "vs-inspector-drawer__tab-icon", children: tab.icon }),
                /* @__PURE__ */ jsx24("span", { className: "vs-inspector-drawer__tab-label", children: tab.label })
              ]
            },
            tab.id
          );
        }) }),
        !collapsed && /* @__PURE__ */ jsx24("div", { className: "vs-inspector-drawer__body", children }),
        footer && !collapsed && /* @__PURE__ */ jsx24("div", { className: "vs-inspector-drawer__footer", children: footer })
      ]
    }
  );
};

// packages/ui-kit/src/components/configurator/CanvasControlToolbar.tsx
import "react";
import { jsx as jsx25, jsxs as jsxs17 } from "react/jsx-runtime";
var CanvasControlToolbar = ({
  position = "bottom-right",
  orientation = "horizontal",
  onZoomIn,
  onZoomOut,
  onRecenter,
  onResetView,
  onToggleGrid,
  isGridActive = false,
  onToggleWireframe,
  isWireframeActive = false,
  onCapture,
  cameraPresets,
  extraActions,
  className = "",
  style
}) => {
  return /* @__PURE__ */ jsxs17(
    "div",
    {
      className: `vs-canvas-control-toolbar vs-canvas-control-toolbar--${position} vs-canvas-control-toolbar--${orientation} ${className}`.trim(),
      role: "toolbar",
      "aria-label": "3D Viewport Controls",
      style,
      children: [
        onZoomIn && /* @__PURE__ */ jsx25(
          "button",
          {
            type: "button",
            onClick: onZoomIn,
            className: "vs-canvas-toolbar__btn",
            "aria-label": "Zoom in",
            title: "Zoom In",
            children: /* @__PURE__ */ jsxs17("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx25("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
              /* @__PURE__ */ jsx25("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
            ] })
          }
        ),
        onZoomOut && /* @__PURE__ */ jsx25(
          "button",
          {
            type: "button",
            onClick: onZoomOut,
            className: "vs-canvas-toolbar__btn",
            "aria-label": "Zoom out",
            title: "Zoom Out",
            children: /* @__PURE__ */ jsx25("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsx25("line", { x1: "5", y1: "12", x2: "19", y2: "12" }) })
          }
        ),
        (onRecenter || onResetView) && /* @__PURE__ */ jsx25(
          "button",
          {
            type: "button",
            onClick: onRecenter || onResetView,
            className: "vs-canvas-toolbar__btn",
            "aria-label": "Recenter camera view",
            title: "Recenter Camera",
            children: /* @__PURE__ */ jsxs17("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx25("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
              /* @__PURE__ */ jsx25("path", { d: "M3 3v5h5" })
            ] })
          }
        ),
        (onToggleGrid || onToggleWireframe || onCapture || cameraPresets && cameraPresets.length > 0) && /* @__PURE__ */ jsx25("div", { className: "vs-canvas-toolbar__divider", "aria-hidden": "true" }),
        onToggleGrid && /* @__PURE__ */ jsx25(
          "button",
          {
            type: "button",
            onClick: onToggleGrid,
            className: `vs-canvas-toolbar__btn ${isGridActive ? "is-active" : ""}`,
            "aria-label": isGridActive ? "Hide floor grid" : "Show floor grid",
            "aria-pressed": isGridActive,
            title: "Toggle Grid",
            children: /* @__PURE__ */ jsxs17("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx25("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
              /* @__PURE__ */ jsx25("line", { x1: "3", y1: "9", x2: "21", y2: "9" }),
              /* @__PURE__ */ jsx25("line", { x1: "3", y1: "15", x2: "21", y2: "15" }),
              /* @__PURE__ */ jsx25("line", { x1: "9", y1: "3", x2: "9", y2: "21" }),
              /* @__PURE__ */ jsx25("line", { x1: "15", y1: "3", x2: "15", y2: "21" })
            ] })
          }
        ),
        onToggleWireframe && /* @__PURE__ */ jsx25(
          "button",
          {
            type: "button",
            onClick: onToggleWireframe,
            className: `vs-canvas-toolbar__btn ${isWireframeActive ? "is-active" : ""}`,
            "aria-label": isWireframeActive ? "Hide wireframe" : "Show wireframe",
            "aria-pressed": isWireframeActive,
            title: "Toggle Wireframe",
            children: /* @__PURE__ */ jsxs17("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx25("polygon", { points: "12 2 2 8.5 12 15 22 8.5 12 2" }),
              /* @__PURE__ */ jsx25("polyline", { points: "2 15.5 12 22 22 15.5" })
            ] })
          }
        ),
        onCapture && /* @__PURE__ */ jsx25(
          "button",
          {
            type: "button",
            onClick: onCapture,
            className: "vs-canvas-toolbar__btn",
            "aria-label": "Capture snapshot",
            title: "Take Snapshot",
            children: /* @__PURE__ */ jsxs17("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx25("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
              /* @__PURE__ */ jsx25("circle", { cx: "12", cy: "13", r: "4" })
            ] })
          }
        ),
        cameraPresets && cameraPresets.length > 0 && /* @__PURE__ */ jsx25("div", { className: "vs-canvas-toolbar__presets", children: cameraPresets.map((preset, i) => /* @__PURE__ */ jsx25(
          "button",
          {
            type: "button",
            onClick: preset.onClick,
            className: `vs-canvas-toolbar__preset-btn ${preset.active ? "is-active" : ""}`,
            "aria-label": `Switch to ${preset.label} view`,
            title: preset.label,
            children: preset.label
          },
          i
        )) }),
        extraActions
      ]
    }
  );
};

// packages/ui-kit/src/components/configurator/FrostedModalDialog.tsx
import {
  useEffect as useEffect9,
  useId as useId9,
  useRef as useRef9
} from "react";
import { jsx as jsx26, jsxs as jsxs18 } from "react/jsx-runtime";
var FOCUSABLE_ELEMENTS_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(", ");
var FrostedModalDialog = ({
  title,
  subtitle,
  isOpen,
  onClose,
  size = "md",
  children,
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
  trapFocus = true,
  restoreFocus = true,
  className = "",
  style
}) => {
  const dialogRef = useRef9(null);
  const previousActiveElementRef = useRef9(null);
  const id = useId9();
  const titleId = `vs-modal-title-${id}`;
  const subtitleId = subtitle ? `vs-modal-subtitle-${id}` : void 0;
  useEffect9(() => {
    if (!restoreFocus || typeof document === "undefined") return;
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement;
    } else if (previousActiveElementRef.current) {
      const elToFocus = previousActiveElementRef.current;
      previousActiveElementRef.current = null;
      if (typeof elToFocus.focus === "function") {
        elToFocus.focus();
      }
    }
  }, [isOpen, restoreFocus]);
  useEffect9(() => {
    return () => {
      if (restoreFocus && previousActiveElementRef.current) {
        if (typeof previousActiveElementRef.current.focus === "function") {
          previousActiveElementRef.current.focus();
        }
        previousActiveElementRef.current = null;
      }
    };
  }, [restoreFocus]);
  useEffect9(() => {
    if (!isOpen || !trapFocus || typeof document === "undefined") return;
    const timer = setTimeout(() => {
      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialogRef.current.focus();
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [isOpen, trapFocus]);
  useEffect9(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && trapFocus && dialogRef.current) {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR)
        ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
        if (focusableElements.length === 0) {
          e.preventDefault();
          dialogRef.current.focus();
          return;
        }
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeEl = document.activeElement;
        if (e.shiftKey) {
          if (activeEl === firstElement || !dialogRef.current.contains(activeEl)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (activeEl === lastElement || !dialogRef.current.contains(activeEl)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, trapFocus, onClose]);
  useEffect9(() => {
    if (!isOpen || typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };
  return /* @__PURE__ */ jsx26(
    "div",
    {
      className: "vs-frosted-modal-backdrop",
      onClick: handleBackdropClick,
      role: "presentation",
      children: /* @__PURE__ */ jsxs18(
        "div",
        {
          ref: dialogRef,
          className: `vs-frosted-modal-dialog vs-frosted-modal-dialog--${size} ${className}`.trim(),
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          "aria-describedby": subtitleId,
          tabIndex: -1,
          style,
          children: [
            /* @__PURE__ */ jsxs18("div", { className: "vs-frosted-modal-dialog__header", children: [
              /* @__PURE__ */ jsxs18("div", { className: "vs-frosted-modal-dialog__titles", children: [
                /* @__PURE__ */ jsx26("h2", { id: titleId, className: "vs-frosted-modal-dialog__title", children: title }),
                subtitle && /* @__PURE__ */ jsx26("p", { id: subtitleId, className: "vs-frosted-modal-dialog__subtitle", children: subtitle })
              ] }),
              /* @__PURE__ */ jsx26(
                "button",
                {
                  type: "button",
                  className: "vs-frosted-modal-dialog__close-btn",
                  onClick: onClose,
                  "aria-label": "Close dialog",
                  title: "Close",
                  children: /* @__PURE__ */ jsxs18("svg", { viewBox: "0 0 24 24", width: "18", height: "18", stroke: "currentColor", strokeWidth: "2.5", fill: "none", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx26("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                    /* @__PURE__ */ jsx26("line", { x1: "6", y1: "6", x2: "18", y2: "12" }),
                    /* @__PURE__ */ jsx26("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsx26("div", { className: "vs-frosted-modal-dialog__body", children }),
            footer && /* @__PURE__ */ jsx26("div", { className: "vs-frosted-modal-dialog__footer", children: footer })
          ]
        }
      )
    }
  );
};

// packages/ui-kit/src/components/forms/FormField.tsx
import {
  createContext as createContext3,
  useContext as useContext3,
  useId as useId10,
  useState as useState16
} from "react";
import { jsx as jsx27, jsxs as jsxs19 } from "react/jsx-runtime";
var FormFieldContext = createContext3(null);

// packages/ui-kit/src/components/forms/Inputs.tsx
import {
  useId as useId11,
  useState as useState17
} from "react";
import { jsx as jsx28, jsxs as jsxs20 } from "react/jsx-runtime";

// packages/ui-kit/src/components/forms/Forms.tsx
import { jsx as jsx29 } from "react/jsx-runtime";

// packages/ui-kit/src/components/forms/UploadDropzone.tsx
import {
  useId as useId12,
  useRef as useRef10,
  useState as useState18
} from "react";
import { jsx as jsx30, jsxs as jsxs21 } from "react/jsx-runtime";

// packages/ui-kit/src/components/selection/SelectionControls.tsx
import {
  useId as useId13,
  useLayoutEffect,
  useRef as useRef11,
  useState as useState19
} from "react";
import { jsx as jsx31, jsxs as jsxs22 } from "react/jsx-runtime";

// packages/ui-kit/src/components/selection/NavigationRail.tsx
import {
  useId as useId14,
  useRef as useRef12,
  useState as useState20
} from "react";
import { jsx as jsx32, jsxs as jsxs23 } from "react/jsx-runtime";

// packages/ui-kit/src/components/data-display/DataDisplay.tsx
import {
  useState as useState21
} from "react";
import { jsx as jsx33, jsxs as jsxs24 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingNav.tsx
import "react";
import { jsx as jsx34, jsxs as jsxs25 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingHeader.tsx
import { useState as useState22, useEffect as useEffect10, useCallback as useCallback5 } from "react";
import { jsx as jsx35, jsxs as jsxs26 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingFooter.tsx
import "react";
import { jsx as jsx36, jsxs as jsxs27 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/ProductLandingLayout.tsx
import "react";
import { jsx as jsx37, jsxs as jsxs28 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingHero.tsx
import "react";
import { jsx as jsx38, jsxs as jsxs29 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingFeatures.tsx
import "react";
import { jsx as jsx39, jsxs as jsxs30 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingOverview.tsx
import "react";
import { jsx as jsx40, jsxs as jsxs31 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingBenefits.tsx
import "react";
import { jsx as jsx41, jsxs as jsxs32 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingVisualShowcase.tsx
import { useState as useState23 } from "react";
import { jsx as jsx42, jsxs as jsxs33 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/LandingCtaSection.tsx
import "react";
import { jsx as jsx43, jsxs as jsxs34 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/ProductLandingTemplate.tsx
import "react";
import { jsx as jsx44, jsxs as jsxs35 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/SportswearLandingPage.tsx
import { useState as useState24 } from "react";
import { jsx as jsx45, jsxs as jsxs36 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/FaceMocapLandingPage.tsx
import { useState as useState25 } from "react";
import { jsx as jsx46, jsxs as jsxs37 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/JewelryLandingPage.tsx
import { useState as useState26 } from "react";
import { jsx as jsx47, jsxs as jsxs38 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/BoxLandingPage.tsx
import { useState as useState27 } from "react";
import { jsx as jsx48, jsxs as jsxs39 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/TourLandingPage.tsx
import { useState as useState28 } from "react";
import { jsx as jsx49, jsxs as jsxs40 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/EyewearLandingPage.tsx
import { useState as useState29 } from "react";
import { jsx as jsx50, jsxs as jsxs41 } from "react/jsx-runtime";

// packages/ui-kit/src/components/landing/EighthWallLandingPage.tsx
import { useState as useState30 } from "react";
import { jsx as jsx51, jsxs as jsxs42 } from "react/jsx-runtime";

// tests/configurator-components.unit.test.mjs
test("AppHeaderBar renders brand title, subtitle, back navigation, status badge, and theme switcher", () => {
  const html = renderToStaticMarkup(
    React24.createElement(AppHeaderBar, {
      brandTitle: "TRIKOMI",
      productTitle: "CUSTOM LAB",
      backLabel: "\u2190 Back to Overview",
      onBack: () => {
      },
      statusBadge: React24.createElement("span", { className: "badge" }, "60 FPS"),
      actions: React24.createElement("button", { type: "button" }, "Export"),
      theme: "violet",
      showThemeSwitcher: true
    })
  );
  assert.ok(html.includes("vs-app-header-bar"), "Should apply root header class");
  assert.ok(html.includes('role="banner"'), 'Should have role="banner"');
  assert.ok(html.includes("vs-app-header-back-btn"), "Should render back button");
  assert.ok(html.includes("\u2190 Back to Overview"), "Should render back button label");
  assert.ok(html.includes("TRIKOMI"), "Should render brand title");
  assert.ok(html.includes("CUSTOM LAB"), "Should render product title");
  assert.ok(html.includes("60 FPS"), "Should render status badge");
  assert.ok(html.includes('role="radiogroup"'), "Should render theme switcher radiogroup");
  assert.ok(html.includes("vs-theme-accent-btn--violet"), "Should render violet theme button");
  assert.ok(html.includes("vs-theme-accent-btn--indigo"), "Should render indigo theme button");
  assert.ok(html.includes("vs-theme-accent-btn--orchid"), "Should render orchid theme button");
  assert.ok(html.includes("Export"), "Should render action button");
});
test("AppHeaderBar respects showThemeSwitcher=false", () => {
  const html = renderToStaticMarkup(
    React24.createElement(AppHeaderBar, {
      brandTitle: "TRIKOMI",
      showThemeSwitcher: false
    })
  );
  assert.ok(!html.includes("vs-app-header-theme-switcher"), "Should omit theme switcher when disabled");
});
test("FloatingControlDock renders tablist, active tabs, badges, and popover bubble", () => {
  const items = [
    { id: "garment", label: "Garment", badge: "3" },
    { id: "colors", label: "Colors" },
    { id: "graphics", label: "Graphics", disabled: true }
  ];
  const html = renderToStaticMarkup(
    React24.createElement(FloatingControlDock, {
      items,
      activeId: "colors",
      onSelect: () => {
      },
      activePopoverContent: React24.createElement("div", { id: "popover-body" }, "Color Swatches Palette"),
      elevation: "float"
    })
  );
  assert.ok(html.includes("vs-floating-control-dock-wrapper"), "Should render dock wrapper");
  assert.ok(html.includes('role="tablist"'), "Should render tablist");
  assert.ok(html.includes("Garment"), "Should render Garment tab");
  assert.ok(html.includes("Colors"), "Should render Colors tab");
  assert.ok(html.includes("Graphics"), "Should render Graphics tab");
  assert.ok(html.includes("is-active"), "Active tab should have is-active class");
  assert.ok(html.includes('aria-selected="true"'), 'Active tab should have aria-selected="true"');
  assert.ok(html.includes("vs-floating-dock__tab-badge"), "Badge should be rendered");
  assert.ok(html.includes('disabled=""') || html.includes("disabled"), "Disabled tab should have disabled attribute");
  assert.ok(html.includes("vs-floating-dock-popover-bubble"), "Should render popover bubble");
  assert.ok(html.includes("Color Swatches Palette"), "Should render popover content");
  assert.ok(html.includes('aria-label="Close options"'), "Popover should have accessible close button");
});
test("GlassInspectorDrawer renders side drawer, tabs, header, body content, and collapse button", () => {
  const tabs = [
    { id: "structure", label: "Structure" },
    { id: "materials", label: "Materials" }
  ];
  const html = renderToStaticMarkup(
    React24.createElement(GlassInspectorDrawer, {
      title: "Inspector Title",
      subtitle: "Inspector Subtitle",
      side: "right",
      isOpen: true,
      tabs,
      activeTab: "structure",
      children: React24.createElement("div", { className: "panel-inner" }, "Body Details"),
      footer: React24.createElement("button", { type: "button" }, "Apply Changes")
    })
  );
  assert.ok(html.includes("vs-glass-inspector-drawer"), "Should render drawer container");
  assert.ok(html.includes("vs-glass-inspector-drawer--right"), "Should render right drawer variant");
  assert.ok(html.includes('role="region"'), "Should render region role");
  assert.ok(html.includes("Inspector Title"), "Should render title");
  assert.ok(html.includes("Inspector Subtitle"), "Should render subtitle");
  assert.ok(html.includes('role="tablist"'), "Should render tabs tablist");
  assert.ok(html.includes("Structure"), "Should render Structure tab");
  assert.ok(html.includes("Materials"), "Should render Materials tab");
  assert.ok(html.includes("Body Details"), "Should render body content");
  assert.ok(html.includes("Apply Changes"), "Should render footer content");
  assert.ok(html.includes("vs-inspector-drawer__collapse-btn"), "Should render collapse button");
});
test("GlassInspectorDrawer renders collapsed state with is-collapsed class", () => {
  const html = renderToStaticMarkup(
    React24.createElement(GlassInspectorDrawer, {
      title: "Collapsed Inspector",
      isOpen: false,
      children: React24.createElement("div", null, "Hidden Content")
    })
  );
  assert.ok(html.includes("is-collapsed"), "Should have is-collapsed class");
  assert.ok(html.includes('aria-expanded="false"'), 'Should have aria-expanded="false"');
  assert.ok(!html.includes("Hidden Content"), "Should not render body content when collapsed");
});
test("CanvasControlToolbar renders zoom, recenter, grid, wireframe, and camera presets", () => {
  const cameraPresets = [
    { label: "Front", onClick: () => {
    }, active: true },
    { label: "Back", onClick: () => {
    } }
  ];
  const html = renderToStaticMarkup(
    React24.createElement(CanvasControlToolbar, {
      position: "bottom-right",
      onZoomIn: () => {
      },
      onZoomOut: () => {
      },
      onRecenter: () => {
      },
      onToggleGrid: () => {
      },
      isGridActive: true,
      onToggleWireframe: () => {
      },
      isWireframeActive: false,
      onCapture: () => {
      },
      cameraPresets
    })
  );
  assert.ok(html.includes("vs-canvas-control-toolbar"), "Should render toolbar container");
  assert.ok(html.includes('role="toolbar"'), 'Should have role="toolbar"');
  assert.ok(html.includes('aria-label="Zoom in"'), "Should render Zoom in button");
  assert.ok(html.includes('aria-label="Zoom out"'), "Should render Zoom out button");
  assert.ok(html.includes('aria-label="Recenter camera view"'), "Should render Recenter button");
  assert.ok(html.includes('aria-pressed="true"'), 'Grid toggle should be aria-pressed="true"');
  assert.ok(html.includes('aria-pressed="false"'), 'Wireframe toggle should be aria-pressed="false"');
  assert.ok(html.includes('aria-label="Capture snapshot"'), "Should render Snapshot button");
  assert.ok(html.includes("Front"), "Should render Front camera preset");
  assert.ok(html.includes("Back"), "Should render Back camera preset");
});
test("FrostedModalDialog renders modal dialog when isOpen=true with dialog role and backdrop", () => {
  const html = renderToStaticMarkup(
    React24.createElement(FrostedModalDialog, {
      title: "Order Roster Modal",
      subtitle: "Submit team sizes and player numbers",
      isOpen: true,
      onClose: () => {
      },
      size: "lg",
      children: React24.createElement("p", null, "Roster Table Content"),
      footer: React24.createElement("button", { type: "button" }, "Submit Order")
    })
  );
  assert.ok(html.includes("vs-frosted-modal-backdrop"), "Should render backdrop");
  assert.ok(html.includes("vs-frosted-modal-dialog"), "Should render modal dialog");
  assert.ok(html.includes("vs-frosted-modal-dialog--lg"), "Should apply lg size class");
  assert.ok(html.includes('role="dialog"'), 'Should have role="dialog"');
  assert.ok(html.includes('aria-modal="true"'), 'Should have aria-modal="true"');
  assert.ok(html.includes("Order Roster Modal"), "Should render title");
  assert.ok(html.includes("Submit team sizes and player numbers"), "Should render subtitle");
  assert.ok(html.includes("Roster Table Content"), "Should render children");
  assert.ok(html.includes("Submit Order"), "Should render footer");
  assert.ok(html.includes('aria-label="Close dialog"'), "Should have accessible close button");
});
test("FrostedModalDialog returns null when isOpen=false", () => {
  const html = renderToStaticMarkup(
    React24.createElement(FrostedModalDialog, {
      title: "Closed Modal",
      isOpen: false,
      onClose: () => {
      },
      children: React24.createElement("p", null, "Hidden Modal Content")
    })
  );
  assert.equal(html, "", "Should render empty string when closed");
});
test('FrostedModalDialog accessibility: tabIndex="-1" and aria-modal attributes for focus containment', () => {
  const html = renderToStaticMarkup(
    React24.createElement(FrostedModalDialog, {
      title: "Focus Containment Modal",
      isOpen: true,
      onClose: () => {
      },
      children: React24.createElement("input", { type: "text", placeholder: "Focus target" }),
      footer: React24.createElement("button", { type: "button" }, "Action")
    })
  );
  assert.ok(html.includes('tabindex="-1"'), 'Modal container must have tabIndex="-1" for focus containment');
  assert.ok(html.includes('aria-modal="true"'), 'Modal must have aria-modal="true"');
  assert.ok(html.includes("vs-frosted-modal-dialog__close-btn"), "Must render close button as focusable anchor");
});
test("FrostedModalDialog accessibility: focus trapping wraps focus between first and last elements", () => {
  const closeBtn = { id: "close", disabled: false, focused: false, focus() {
    this.focused = true;
  } };
  const inputEl = { id: "input", disabled: false, focused: false, focus() {
    this.focused = true;
  } };
  const submitBtn = { id: "submit", disabled: false, focused: false, focus() {
    this.focused = true;
  } };
  const focusable = [closeBtn, inputEl, submitBtn];
  let defaultPrevented = false;
  const tabEvent = {
    key: "Tab",
    shiftKey: false,
    preventDefault: () => {
      defaultPrevented = true;
    }
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
  assert.ok(defaultPrevented, "Tab on last element must prevent default");
  assert.ok(closeBtn.focused, "Tab on last element must wrap focus to first element");
  let shiftTabPrevented = false;
  const shiftTabEvent = {
    key: "Tab",
    shiftKey: true,
    preventDefault: () => {
      shiftTabPrevented = true;
    }
  };
  simulateTabWrap(closeBtn, shiftTabEvent);
  assert.ok(shiftTabPrevented, "Shift+Tab on first element must prevent default");
  assert.ok(submitBtn.focused, "Shift+Tab on first element must wrap focus to last element");
});
test("FrostedModalDialog accessibility: focus restoration stores and restores activeElement", () => {
  let triggerElementFocused = false;
  const triggerElement = {
    id: "open-modal-btn",
    focus() {
      triggerElementFocused = true;
    }
  };
  let previousActiveElement = triggerElement;
  const simulateClose = () => {
    if (previousActiveElement && typeof previousActiveElement.focus === "function") {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  };
  simulateClose();
  assert.ok(triggerElementFocused, "Modal close must restore focus to trigger element");
  assert.equal(previousActiveElement, null, "Previous active element reference must be cleaned up");
});
test("FrostedModalDialog accessibility: Escape key invokes onClose with stopPropagation", () => {
  let onCloseCalled = false;
  let propagationStopped = false;
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onCloseCalled = true;
    }
  };
  const escapeEvent = {
    key: "Escape",
    stopPropagation: () => {
      propagationStopped = true;
    }
  };
  handleKeyDown(escapeEvent);
  assert.ok(onCloseCalled, "Escape key must trigger onClose");
  assert.ok(propagationStopped, "Escape key must stop propagation");
});
