// tests/eyewear-redesign.unit.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import React25, { act } from "react";
import { createRoot } from "react-dom/client";
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
function VictorShellThemeProvider({
  children,
  initialAccent = "violet",
  className
}) {
  const [accent, setAccent] = useState(initialAccent);
  const contextValue = useMemo(() => ({ accent, setAccent }), [accent]);
  const rootClassName = ["vs-ui-root", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx(VictorShellThemeContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx("div", { className: rootClassName, "data-accent": accent, children }) });
}
function useVictorShellTheme() {
  const context = useContext(VictorShellThemeContext);
  if (!context) {
    throw new Error("useVictorShellTheme must be used within a VictorShellThemeProvider");
  }
  return context;
}

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

// apps/eyewear-tryon/src/EyewearInspector.jsx
import React24 from "react";
import { observer } from "mobx-react-lite";

// apps/eyewear-tryon/src/Store.jsx
import { observable } from "mobx";
var store = observable({
  camera: void 0,
  cameras: [],
  runningMode: "VIDEO",
  canvasElement: void 0,
  grid: false,
  tracking: false,
  mirror: true,
  loaded: false,
  naturalLighting: true,
  modelIndex: 0,
  // Dynamic Configurator State
  glassConfigs: {
    meshes: [],
    materials: []
  },
  meshVisibility: {},
  materialProps: {},
  lipstick: false,
  lipstickColor: "#ff0055",
  lipstickOpacity: 0.6,
  showOccluderWireframe: false,
  showDummyGlasses: false,
  fetchCameras() {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((_res) => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const newCameras = [];
          devices.forEach((device) => {
            if (device.kind === "videoinput") {
              newCameras.push(device);
            }
          });
          this.cameras = newCameras;
        }).catch((err) => {
          console.error("Error retrieving devices: ", err);
        });
      }).catch((err) => {
        console.warn("Camera access denied or unavailable", err);
      });
    } else {
      console.warn("navigator.mediaDevices is undefined. Secure context (HTTPS) is required for camera access.");
    }
  }
});
var keyFrames = [];
var Store_default = store;

// apps/eyewear-tryon/src/Recorder.jsx
var hours = 0;
var minutes = 0;
var seconds = 0;
var frames = 0;
function startTimecode() {
  hours = 0;
  minutes = 0;
  seconds = 0;
  frames = 0;
  Store_default.recording = true;
}
function recordBlendshapesToCSV() {
  if (Store_default.recording) {
    Store_default.recording = void 0;
    downloadCSV(jsonArrayToCSV(keyFrames), "BlendshapeData.csv");
    keyFrames.length = 0;
    return;
  }
  startTimecode();
}
function jsonArrayToCSV(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    console.error("Invalid JSON array");
    return null;
  }
  const keys = Object.keys(jsonArray[0]);
  const header = keys.join(",");
  const rows = jsonArray.map((obj) => {
    return keys.map((key) => {
      const value = obj[key] !== void 0 ? obj[key] : "";
      if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(",");
  });
  const csvContent = [header, ...rows].join("\n");
  return csvContent;
}
function downloadCSV(content, fileName) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// apps/eyewear-tryon/src/EyewearInspector.jsx
var FRAME_COLORS = [
  { name: "Black", hex: "#222222" },
  { name: "Tortoise", hex: "#8b4513" },
  { name: "Silver", hex: "#e0e0e0" },
  { name: "Gold", hex: "#d4af37" },
  { name: "Clear", hex: "#ffffff" }
];
var LENS_COLORS = [
  { name: "Dark", hex: "#111111" },
  { name: "Green", hex: "#1d3e2b" },
  { name: "Brown", hex: "#4a2f1d" },
  { name: "Blue", hex: "#1c2d54" },
  { name: "Purple", hex: "#3b1c54" }
];
var EyewearInspector = observer(({
  isOpen = true,
  onClose,
  activeTab = "models",
  onTabChange,
  models = [],
  activeModelIndex = 0,
  onSelectModel,
  store: store2,
  className = ""
}) => {
  const currentModel = models[activeModelIndex] || models[0];
  const tabs = [
    { id: "models", label: `Styles (${models.length})` },
    { id: "frames", label: "Frame" },
    { id: "lenses", label: "Lenses" },
    { id: "camera", label: "Camera" },
    { id: "debug", label: "Tools" }
  ];
  const frameMatName = (store2?.glassConfigs?.materials || []).find((m) => m.toLowerCase().includes("frame"));
  const lensMatName = (store2?.glassConfigs?.materials || []).find((m) => m.toLowerCase().includes("lens"));
  const handleApplyFrameColor = (color) => {
    if (!store2 || !frameMatName) return;
    const p = { ...store2.materialProps[frameMatName] || {} };
    p.color = color.hex;
    if (color.name === "Clear") {
      p.opacity = 0.5;
      p.transparent = true;
    } else {
      p.opacity = 1;
    }
    store2.materialProps[frameMatName] = p;
  };
  const handleApplyLensColor = (color) => {
    if (!store2 || !lensMatName) return;
    const p = { ...store2.materialProps[lensMatName] || {} };
    p.color = color.hex;
    p.opacity = 0.7;
    store2.materialProps[lensMatName] = p;
  };
  const handleCameraChange = (e) => {
    const deviceId = e.target.value;
    if (navigator.mediaDevices && store2?.camera) {
      navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      }).then((stream) => {
        store2.camera.srcObject = stream;
      }).catch((err) => {
        console.warn("Failed to switch camera:", err);
      });
    }
  };
  return /* @__PURE__ */ React24.createElement(
    GlassInspectorDrawer,
    {
      title: "Eyewear AR Studio",
      subtitle: currentModel?.name || "Virtual Try-On Fitting",
      isOpen,
      onClose,
      tabs,
      activeTab,
      onTabChange,
      side: "right",
      width: 360,
      className: `vs-eyewear-inspector ${className}`.trim(),
      footer: /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", gap: "8px", width: "100%" } }, /* @__PURE__ */ React24.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-secondary",
          style: { flex: 1, padding: "8px 12px", fontSize: "0.8rem" },
          onClick: () => {
            if (store2) store2.mirror = !store2.mirror;
          }
        },
        store2?.mirror ? "\u{1FA9E} Mirror: On" : "\u{1FA9E} Mirror: Off"
      ), /* @__PURE__ */ React24.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-secondary",
          style: { flex: 1, padding: "8px 12px", fontSize: "0.8rem" },
          onClick: () => {
            if (store2) store2.showOccluderWireframe = !store2.showOccluderWireframe;
          }
        },
        store2?.showOccluderWireframe ? "Hide Occluder" : "Show Occluder"
      ))
    },
    /* @__PURE__ */ React24.createElement("div", { className: "vs-eyewear-inspector-body", style: { display: "flex", flexDirection: "column", gap: "14px" } }, activeTab === "models" && /* @__PURE__ */ React24.createElement("div", { className: "vs-eyewear-models-list", style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Select Eyewear Frame (", models.length, ")"), /* @__PURE__ */ React24.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" } }, models.map((model, idx) => {
      const isActive = activeModelIndex === idx;
      return /* @__PURE__ */ React24.createElement(
        "div",
        {
          key: model.name,
          role: "button",
          tabIndex: 0,
          onClick: () => onSelectModel && onSelectModel(idx),
          className: `vs-eyewear-card ${isActive ? "is-active" : ""}`,
          style: {
            padding: "12px 10px",
            borderRadius: "12px",
            background: isActive ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.45)",
            border: isActive ? "1px solid var(--vs-primary)" : "1px solid rgba(255, 255, 255, 0.65)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            textAlign: "center",
            transition: "all 0.2s ease"
          }
        },
        /* @__PURE__ */ React24.createElement(
          "div",
          {
            style: {
              width: "72px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.04)",
              borderRadius: "8px",
              padding: "4px"
            }
          },
          model.thumb ? /* @__PURE__ */ React24.createElement(
            "img",
            {
              src: model.thumb,
              alt: model.name,
              style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }
            }
          ) : /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "1.4rem" } }, "\u{1F453}")
        ),
        /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--vs-ink)" } }, model.name), isActive && /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.7rem", color: "var(--vs-primary)", fontWeight: 700 } }, "Selected"))
      );
    }))), activeTab === "frames" && /* @__PURE__ */ React24.createElement("div", { className: "vs-eyewear-frame-panel", style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Frame Material & Color"), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, FRAME_COLORS.map((c) => {
      const isSelected = store2?.materialProps[frameMatName]?.color === c.hex;
      return /* @__PURE__ */ React24.createElement(
        "button",
        {
          key: c.name,
          type: "button",
          onClick: () => handleApplyFrameColor(c),
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: "10px",
            background: isSelected ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.45)",
            border: isSelected ? "1px solid var(--vs-primary)" : "1px solid rgba(255, 255, 255, 0.65)",
            cursor: "pointer"
          }
        },
        /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ React24.createElement(
          "span",
          {
            style: {
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: c.hex,
              border: "1px solid rgba(0,0,0,0.15)",
              display: "inline-block"
            }
          }
        ), /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, c.name)),
        isSelected && /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.8rem", color: "var(--vs-primary)", fontWeight: 700 } }, "\u2713")
      );
    }))), activeTab === "lenses" && /* @__PURE__ */ React24.createElement("div", { className: "vs-eyewear-lens-panel", style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Lens Tint & Optics"), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, LENS_COLORS.map((c) => {
      const isSelected = store2?.materialProps[lensMatName]?.color === c.hex;
      return /* @__PURE__ */ React24.createElement(
        "button",
        {
          key: c.name,
          type: "button",
          onClick: () => handleApplyLensColor(c),
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: "10px",
            background: isSelected ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.45)",
            border: isSelected ? "1px solid var(--vs-primary)" : "1px solid rgba(255, 255, 255, 0.65)",
            cursor: "pointer"
          }
        },
        /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ React24.createElement(
          "span",
          {
            style: {
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: c.hex,
              border: "1px solid rgba(0,0,0,0.15)",
              display: "inline-block"
            }
          }
        ), /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, c.name, " Tint")),
        isSelected && /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.8rem", color: "var(--vs-primary)", fontWeight: 700 } }, "\u2713")
      );
    }))), activeTab === "camera" && /* @__PURE__ */ React24.createElement("div", { className: "vs-eyewear-camera-panel", style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "AR Video & Camera"), store2?.cameras && store2.cameras.length > 0 && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, /* @__PURE__ */ React24.createElement("label", { style: { fontSize: "0.75rem", color: "var(--vs-ink-muted)", fontWeight: 600 } }, "Camera Source"), /* @__PURE__ */ React24.createElement(
      "select",
      {
        className: "vs-select",
        onChange: handleCameraChange,
        style: {
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          background: "rgba(255, 255, 255, 0.55)",
          color: "var(--vs-ink)",
          fontSize: "0.85rem"
        }
      },
      store2.cameras.map((cam, idx) => /* @__PURE__ */ React24.createElement("option", { key: cam.deviceId || idx, value: cam.deviceId }, cam.label || `Camera ${idx + 1}`))
    )), /* @__PURE__ */ React24.createElement(
      "label",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, "Mirror Video Feed"),
      /* @__PURE__ */ React24.createElement(
        "input",
        {
          type: "checkbox",
          checked: store2?.mirror ?? true,
          onChange: (e) => {
            if (store2) store2.mirror = e.target.checked;
          }
        }
      )
    ), /* @__PURE__ */ React24.createElement(
      "label",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, "Natural Lighting Simulation"),
      /* @__PURE__ */ React24.createElement(
        "input",
        {
          type: "checkbox",
          checked: store2?.naturalLighting ?? true,
          onChange: (e) => {
            if (store2) store2.naturalLighting = e.target.checked;
          }
        }
      )
    )), activeTab === "debug" && /* @__PURE__ */ React24.createElement("div", { className: "vs-eyewear-tools-panel", style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Try-On Tools & Developer Debug"), /* @__PURE__ */ React24.createElement(
      "label",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, "Show Occluder Wireframe"),
      /* @__PURE__ */ React24.createElement(
        "input",
        {
          type: "checkbox",
          checked: store2?.showOccluderWireframe ?? false,
          onChange: (e) => {
            if (store2) store2.showOccluderWireframe = e.target.checked;
          }
        }
      )
    ), /* @__PURE__ */ React24.createElement(
      "label",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, "Show Dummy Reference Glasses"),
      /* @__PURE__ */ React24.createElement(
        "input",
        {
          type: "checkbox",
          checked: store2?.showDummyGlasses ?? false,
          onChange: (e) => {
            if (store2) store2.showDummyGlasses = e.target.checked;
          }
        }
      )
    ), /* @__PURE__ */ React24.createElement(
      "label",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          cursor: "pointer"
        }
      },
      /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, "Show Viewport Grid"),
      /* @__PURE__ */ React24.createElement(
        "input",
        {
          type: "checkbox",
          checked: store2?.grid ?? false,
          onChange: (e) => {
            if (store2) store2.grid = e.target.checked;
          }
        }
      )
    ), /* @__PURE__ */ React24.createElement(
      "button",
      {
        type: "button",
        className: `vs-btn ${store2?.recording ? "vs-btn-danger" : "vs-btn-primary"}`,
        style: { width: "100%", padding: "10px", marginTop: "6px" },
        onClick: recordBlendshapesToCSV,
        disabled: !store2?.tracking
      },
      store2?.recording ? "Stop Recording" : "Record Blendshapes CSV"
    )))
  );
});

// tests/eyewear-redesign.unit.test.mjs
var mockModels = [
  { name: "Aviator Classic", url: "models/glasses1.glb", thumb: "thumbs/glasses1.png", scale: 0.3 },
  { name: "Sport Wrap", url: "models/glasses2.glb", thumb: "thumbs/glasses2.png", scale: 0.3 },
  { name: "Wayfarer Style", url: "models/glasses3.glb", thumb: "thumbs/glasses3.png", scale: 0.3 },
  { name: "Round Metal", url: "models/glasses4.glb", thumb: "thumbs/glasses4.png", scale: 0.3 },
  { name: "Clubmaster", url: "models/glasses5.glb", thumb: "thumbs/glasses5.png", scale: 0.3 },
  { name: "Hexagonal", url: "models/glasses6.glb", thumb: "thumbs/glasses6.png", scale: 0.3 }
];
function createMockStore() {
  return {
    camera: void 0,
    cameras: [
      { deviceId: "cam-1", label: "FaceTime HD Camera" },
      { deviceId: "cam-2", label: "External USB Webcam" }
    ],
    grid: false,
    tracking: true,
    mirror: true,
    loaded: true,
    naturalLighting: true,
    modelIndex: 0,
    glassConfigs: {
      meshes: ["Frame_Mesh", "Lens_Mesh"],
      materials: ["Glasses_Frame_Mat", "Glasses_Lens_Mat"]
    },
    materialProps: {
      "Glasses_Frame_Mat": { color: "#222222", opacity: 1 },
      "Glasses_Lens_Mat": { color: "#111111", opacity: 0.7 }
    },
    showOccluderWireframe: false,
    showDummyGlasses: false,
    recording: false
  };
}
test("EyewearInspector renders GlassInspectorDrawer with all 5 tabs and title", () => {
  const store2 = createMockStore();
  const html = renderToStaticMarkup(
    React25.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "models",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {
      },
      store: store2
    })
  );
  assert.ok(html.includes("vs-glass-inspector-drawer"), "Should render drawer container");
  assert.ok(html.includes("Eyewear AR Studio"), "Should render drawer title");
  assert.ok(html.includes("Aviator Classic"), "Should render current model subtitle");
  assert.ok(html.includes("Styles (6)"), "Should render Styles tab with model count");
  assert.ok(html.includes("Frame"), "Should render Frame tab");
  assert.ok(html.includes("Lenses"), "Should render Lenses tab");
  assert.ok(html.includes("Camera"), "Should render Camera tab");
  assert.ok(html.includes("Tools"), "Should render Tools tab");
  assert.ok(html.includes("Mirror: On"), "Should render mirror footer toggle");
  assert.ok(html.includes("Show Occluder"), "Should render occluder footer toggle");
});
test("EyewearInspector renders Styles model catalog with active selection badge", () => {
  const store2 = createMockStore();
  let selectedIndex = null;
  const html = renderToStaticMarkup(
    React25.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "models",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 1,
      onSelectModel: (idx) => {
        selectedIndex = idx;
      },
      store: store2
    })
  );
  assert.ok(html.includes("Select Eyewear Frame (6)"), "Should render catalog header");
  assert.ok(html.includes("Aviator Classic"), "Should render first model");
  assert.ok(html.includes("Sport Wrap"), "Should render second model");
  assert.ok(html.includes("Wayfarer Style"), "Should render third model");
  assert.ok(html.includes("Round Metal"), "Should render fourth model");
  assert.ok(html.includes("Clubmaster"), "Should render fifth model");
  assert.ok(html.includes("Hexagonal"), "Should render sixth model");
  assert.ok(html.includes("Selected"), "Should render Selected badge on active model");
});
test('EyewearInspector renders Frame panel with color swatches when activeTab="frames"', () => {
  const store2 = createMockStore();
  const html = renderToStaticMarkup(
    React25.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "frames",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {
      },
      store: store2
    })
  );
  assert.ok(html.includes("Frame Material &amp; Color") || html.includes("Frame Material & Color"), "Should render frame header");
  assert.ok(html.includes("Black"), "Should render Black frame option");
  assert.ok(html.includes("Tortoise"), "Should render Tortoise frame option");
  assert.ok(html.includes("Silver"), "Should render Silver frame option");
  assert.ok(html.includes("Gold"), "Should render Gold frame option");
  assert.ok(html.includes("Clear"), "Should render Clear frame option");
});
test('EyewearInspector renders Lenses panel with tint options when activeTab="lenses"', () => {
  const store2 = createMockStore();
  const html = renderToStaticMarkup(
    React25.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "lenses",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {
      },
      store: store2
    })
  );
  assert.ok(html.includes("Lens Tint &amp; Optics") || html.includes("Lens Tint & Optics"), "Should render lens header");
  assert.ok(html.includes("Dark Tint"), "Should render Dark tint");
  assert.ok(html.includes("Green Tint"), "Should render Green tint");
  assert.ok(html.includes("Brown Tint"), "Should render Brown tint");
  assert.ok(html.includes("Blue Tint"), "Should render Blue tint");
  assert.ok(html.includes("Purple Tint"), "Should render Purple tint");
});
test("EyewearInspector renders Camera panel with camera select and mirror options", () => {
  const store2 = createMockStore();
  const html = renderToStaticMarkup(
    React25.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "camera",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {
      },
      store: store2
    })
  );
  assert.ok(html.includes("AR Video &amp; Camera") || html.includes("AR Video & Camera"), "Should render camera header");
  assert.ok(html.includes("Camera Source"), "Should render camera source select label");
  assert.ok(html.includes("FaceTime HD Camera"), "Should list first camera option");
  assert.ok(html.includes("External USB Webcam"), "Should list second camera option");
  assert.ok(html.includes("Mirror Video Feed"), "Should render mirror video checkbox");
  assert.ok(html.includes("Natural Lighting Simulation"), "Should render natural lighting checkbox");
});
test("EyewearInspector renders Tools/Debug panel with wireframe and blendshapes controls", () => {
  const store2 = createMockStore();
  const html = renderToStaticMarkup(
    React25.createElement(EyewearInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "debug",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0,
      onSelectModel: () => {
      },
      store: store2
    })
  );
  assert.ok(html.includes("Try-On Tools &amp; Developer Debug") || html.includes("Try-On Tools & Developer Debug"), "Should render tools header");
  assert.ok(html.includes("Show Occluder Wireframe"), "Should render occluder wireframe toggle");
  assert.ok(html.includes("Show Dummy Reference Glasses"), "Should render dummy glasses toggle");
  assert.ok(html.includes("Show Viewport Grid"), "Should render viewport grid toggle");
  assert.ok(html.includes("Record Blendshapes CSV"), "Should render blendshape CSV recording button");
});
test("FloatingControlDock renders 5 eyewear control items with styles badge", () => {
  const dockItems = [
    { id: "models", label: "Styles", icon: "\u{1F453}", badge: 6 },
    { id: "frames", label: "Frame", icon: "\u{1F3A8}" },
    { id: "lenses", label: "Lenses", icon: "\u{1F576}\uFE0F" },
    { id: "camera", label: "Camera", icon: "\u{1F4F9}" },
    { id: "debug", label: "Tools", icon: "\u2699\uFE0F" }
  ];
  const html = renderToStaticMarkup(
    React25.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: "models",
      onSelect: () => {
      }
    })
  );
  assert.ok(html.includes("vs-floating-control-dock"), "Should render floating control dock");
  assert.ok(html.includes("Styles"), "Should render Styles dock item");
  assert.ok(html.includes("Frame"), "Should render Frame dock item");
  assert.ok(html.includes("Lenses"), "Should render Lenses dock item");
  assert.ok(html.includes("Camera"), "Should render Camera dock item");
  assert.ok(html.includes("Tools"), "Should render Tools dock item");
});
test("CanvasControlToolbar renders top-right AR viewport controls without fake snapshot", () => {
  const store2 = createMockStore();
  const html = renderToStaticMarkup(
    React25.createElement(CanvasControlToolbar, {
      position: "top-right",
      extraActions: React25.createElement(
        "div",
        { className: "extra-eyewear-actions" },
        React25.createElement("button", { className: "mirror-btn" }, "\u{1FA9E}"),
        React25.createElement("button", { className: "occluder-btn" }, "\u{1F4D0}"),
        React25.createElement("button", { className: "grid-btn" }, "\u25A6"),
        React25.createElement("button", { className: "fs-btn" }, "\u26F6")
      )
    })
  );
  assert.ok(html.includes("vs-canvas-control-toolbar"), "Should render canvas toolbar");
  assert.ok(html.includes("vs-canvas-control-toolbar--top-right"), "Should use top-right placement");
  assert.ok(html.includes("mirror-btn"), "Should render mirror action");
  assert.ok(html.includes("occluder-btn"), "Should render occluder wireframe action");
  assert.ok(html.includes("grid-btn"), "Should render grid action");
  assert.ok(!html.includes("snapshot"), "Must not render non-existent snapshot action");
  assert.ok(!html.includes("capture"), "Must not render non-existent capture action");
});
test("AppHeaderBar renders eyewear branding, style status badge, and theme switcher", () => {
  function EyewearHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React25.createElement(AppHeaderBar, {
      brandTitle: "TRIKOMI",
      productTitle: "EYEWEAR AR STUDIO",
      backLabel: "\u2190 Back to Overview",
      onBack: () => {
      },
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React25.createElement("span", { className: "vs-eyewear-badge" }, "Aviator Classic")
    });
  }
  const html = renderToStaticMarkup(
    React25.createElement(
      VictorShellThemeProvider,
      { initialAccent: "indigo" },
      React25.createElement(EyewearHeaderStage)
    )
  );
  assert.ok(html.includes("TRIKOMI"), "Should render brand title");
  assert.ok(html.includes("EYEWEAR AR STUDIO"), "Should render product title");
  assert.ok(html.includes("\u2190 Back to Overview"), "Should render back button");
  assert.ok(html.includes("Aviator Classic"), "Should render active eyewear status badge");
  assert.ok(html.includes('data-accent="indigo"'), 'Provider root should have initial data-accent="indigo"');
  assert.ok(html.includes("vs-theme-accent-btn--indigo is-active"), "AppHeaderBar should have active indigo theme button");
});
test("VictorShellThemeProvider persists custom theme selection across re-renders in eyewear try-on", () => {
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
    preventDefault() {
      this.defaultPrevented = true;
    }
    stopPropagation() {
      this._propagationStopped = true;
    }
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
      return this.attributes["class"] || this.attributes["className"] || "";
    }
    set className(val) {
      this.attributes["class"] = val;
      this.attributes["className"] = val;
    }
    addEventListener(type, fn, opts) {
      if (!this._listeners[type]) this._listeners[type] = [];
      const isCapture = typeof opts === "boolean" ? opts : opts && opts.capture;
      this._listeners[type].push({ fn, isCapture: !!isCapture });
    }
    removeEventListener(type, fn) {
      if (!this._listeners[type]) return;
      this._listeners[type] = this._listeners[type].filter((l) => l.fn !== fn);
    }
    setAttribute(k, v) {
      this.attributes[k] = v;
      if (k === "class") {
        this.attributes["className"] = v;
      }
    }
    removeAttribute(k) {
      delete this.attributes[k];
      if (k === "class") {
        delete this.attributes["className"];
      }
    }
    getAttribute(k) {
      return this.attributes[k];
    }
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
      const ev = new MockEvent("click", { bubbles: true, cancelable: true });
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
    documentElement: new MockDOMElement("HTML", null),
    _listeners: {},
    addEventListener(type, fn, opts) {
      if (!this._listeners[type]) this._listeners[type] = [];
      const isCapture = typeof opts === "boolean" ? opts : opts && opts.capture;
      this._listeners[type].push({ fn, isCapture: !!isCapture });
    },
    removeEventListener(type, fn) {
      if (!this._listeners[type]) return;
      this._listeners[type] = this._listeners[type].filter((l) => l.fn !== fn);
    },
    createElement(tag) {
      return new MockDOMElement(tag, mockDoc);
    },
    createTextNode(text) {
      return { nodeType: 3, nodeValue: text, ownerDocument: mockDoc, parentNode: null };
    }
  };
  mockDoc.documentElement.ownerDocument = mockDoc;
  const win = {
    document: mockDoc,
    HTMLIFrameElement: class {
    },
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
    let TestThemeProbe2 = function() {
      const ctx = useVictorShellTheme();
      contextValue = ctx;
      const [, setTick] = React25.useState(0);
      triggerUnrelatedUpdate = () => setTick((t) => t + 1);
      return React25.createElement(AppHeaderBar, {
        brandTitle: "TRIKOMI",
        productTitle: "EYEWEAR AR STUDIO",
        theme: ctx.accent,
        onThemeChange: ctx.setAccent,
        showThemeSwitcher: true
      });
    };
    var TestThemeProbe = TestThemeProbe2;
    let contextValue = null;
    let triggerUnrelatedUpdate = null;
    const container = mockDoc.createElement("div");
    mockDoc.documentElement.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        React25.createElement(
          VictorShellThemeProvider,
          { initialAccent: "indigo" },
          React25.createElement(TestThemeProbe2)
        )
      );
    });
    assert.equal(contextValue.accent, "indigo", "Initial theme should be Electric Indigo");
    const rootWrapper = container.childNodes[0];
    assert.equal(rootWrapper.attributes["data-accent"], "indigo", 'VictorShellThemeProvider root must have data-accent="indigo"');
    const indigoBtn = container.find((el) => el.attributes["aria-label"] === "Electric Indigo Theme");
    assert.ok(indigoBtn, "Indigo theme button must be rendered in AppHeaderBar");
    assert.ok(indigoBtn.className.includes("is-active"), "Indigo button should be active initially");
    const orchidBtn = container.find((el) => el.attributes["aria-label"] === "Orchid Glow Theme");
    assert.ok(orchidBtn, "Orchid theme button must exist in AppHeaderBar");
    act(() => {
      orchidBtn.click();
    });
    assert.equal(contextValue.accent, "orchid", "Context theme should update to Orchid after real click event");
    assert.equal(mockDoc.documentElement.getAttribute("data-accent"), "orchid", "Document data-accent should update to orchid");
    assert.equal(rootWrapper.attributes["data-accent"], "orchid", "Provider root data-accent must update to orchid");
    assert.ok(orchidBtn.className.includes("is-active"), "Orchid button must be active");
    assert.ok(!indigoBtn.className.includes("is-active"), "Indigo button must not be active");
    act(() => {
      triggerUnrelatedUpdate();
    });
    assert.equal(contextValue.accent, "orchid", "Theme should remain Orchid after unrelated component re-render");
    assert.equal(mockDoc.documentElement.getAttribute("data-accent"), "orchid", "Document data-accent should remain orchid");
    const violetBtn = container.find((el) => el.attributes["aria-label"] === "Royal Violet Theme");
    assert.ok(violetBtn, "Violet theme button must exist in AppHeaderBar");
    act(() => {
      violetBtn.click();
    });
    assert.equal(contextValue.accent, "violet", "Context theme should update to Violet after real click event");
    act(() => {
      triggerUnrelatedUpdate();
    });
    assert.equal(contextValue.accent, "violet", "Theme should remain Violet after subsequent re-renders");
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
