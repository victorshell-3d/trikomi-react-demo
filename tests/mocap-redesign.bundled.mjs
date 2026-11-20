// tests/mocap-redesign.unit.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import React26, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { runInAction } from "mobx";

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

// apps/face-mocap/src/MocapInspector.jsx
import React24, { useState as useState31, useMemo as useMemo2 } from "react";
import { observer } from "mobx-react-lite";

// apps/face-mocap/src/Store.jsx
import { observable } from "mobx";
var store = observable({
  camera: "",
  avatar: "raccoon",
  cameras: [],
  runningMode: "VIDEO",
  recording: false,
  canvasElement: void 0,
  grid: false,
  tracking: false,
  time: "",
  smoothStep: 0.5,
  mirror: true,
  serverAddress: "127.0.0.1:5000",
  connected: false,
  booster: false,
  blendshapes: {},
  loaded: false
});
var boosters = {};
var Store_default = store;
if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({ video: true }).then((_res) => {
    navigator.mediaDevices.enumerateDevices().then(function(devices) {
      devices.forEach(function(device) {
        if (device.kind === "videoinput") {
          store.cameras.push(device);
        }
      });
    }).catch(function(err) {
      console.error("Error retrieving devices: ", err);
    });
  }).catch((err) => {
    console.warn("Camera access denied or unavailable", err);
  });
} else {
  console.warn("navigator.mediaDevices is undefined. Secure context (HTTPS) is required for camera access.");
}

// apps/face-mocap/src/MocapInspector.jsx
var ARKIT_BLENDSHAPES = [
  // Eyes & Brows (19)
  { key: "EyeBlinkLeft", category: "eyes" },
  { key: "EyeLookDownLeft", category: "eyes" },
  { key: "EyeLookInLeft", category: "eyes" },
  { key: "EyeLookOutLeft", category: "eyes" },
  { key: "EyeLookUpLeft", category: "eyes" },
  { key: "EyeSquintLeft", category: "eyes" },
  { key: "EyeWideLeft", category: "eyes" },
  { key: "EyeBlinkRight", category: "eyes" },
  { key: "EyeLookDownRight", category: "eyes" },
  { key: "EyeLookInRight", category: "eyes" },
  { key: "EyeLookOutRight", category: "eyes" },
  { key: "EyeLookUpRight", category: "eyes" },
  { key: "EyeSquintRight", category: "eyes" },
  { key: "EyeWideRight", category: "eyes" },
  { key: "BrowDownLeft", category: "eyes" },
  { key: "BrowDownRight", category: "eyes" },
  { key: "BrowInnerUp", category: "eyes" },
  { key: "BrowOuterUpLeft", category: "eyes" },
  { key: "BrowOuterUpRight", category: "eyes" },
  // Mouth & Lips (23)
  { key: "MouthClose", category: "mouth" },
  { key: "MouthFunnel", category: "mouth" },
  { key: "MouthPucker", category: "mouth" },
  { key: "MouthLeft", category: "mouth" },
  { key: "MouthRight", category: "mouth" },
  { key: "MouthSmileLeft", category: "mouth" },
  { key: "MouthSmileRight", category: "mouth" },
  { key: "MouthFrownLeft", category: "mouth" },
  { key: "MouthFrownRight", category: "mouth" },
  { key: "MouthDimpleLeft", category: "mouth" },
  { key: "MouthDimpleRight", category: "mouth" },
  { key: "MouthStretchLeft", category: "mouth" },
  { key: "MouthStretchRight", category: "mouth" },
  { key: "MouthRollLower", category: "mouth" },
  { key: "MouthRollUpper", category: "mouth" },
  { key: "MouthShrugLower", category: "mouth" },
  { key: "MouthShrugUpper", category: "mouth" },
  { key: "MouthPressLeft", category: "mouth" },
  { key: "MouthPressRight", category: "mouth" },
  { key: "MouthLowerDownLeft", category: "mouth" },
  { key: "MouthLowerDownRight", category: "mouth" },
  { key: "MouthUpperUpLeft", category: "mouth" },
  { key: "MouthUpperUpRight", category: "mouth" },
  // Jaw & Cheeks (7)
  { key: "JawOpen", category: "jaw" },
  { key: "JawForward", category: "jaw" },
  { key: "JawLeft", category: "jaw" },
  { key: "JawRight", category: "jaw" },
  { key: "CheekPuff", category: "jaw" },
  { key: "CheekSquintLeft", category: "jaw" },
  { key: "CheekSquintRight", category: "jaw" },
  // Tongue & Nose (3)
  { key: "TongueOut", category: "other" },
  { key: "NoseSneerLeft", category: "other" },
  { key: "NoseSneerRight", category: "other" }
];
var DRAWER_TABS = [
  { id: "avatar", label: "Avatar", icon: "\u{1F3AD}" },
  { id: "camera", label: "Camera", icon: "\u{1F4F7}" },
  { id: "blendshapes", label: "Blendshapes", icon: "\u{1F4CA}" },
  { id: "livelink", label: "LiveLink", icon: "\u{1F517}" },
  { id: "settings", label: "Settings", icon: "\u2699\uFE0F" }
];
var MocapInspector = observer(({
  isOpen,
  onClose,
  activeTab = "avatar",
  onTabChange,
  onCameraChange,
  onToggleRecord,
  onOpenHelp
}) => {
  const [blendshapeCategory, setBlendshapeCategory] = useState31("all");
  const filteredBlendshapes = useMemo2(() => {
    if (blendshapeCategory === "all") return ARKIT_BLENDSHAPES;
    return ARKIT_BLENDSHAPES.filter((b) => b.category === blendshapeCategory);
  }, [blendshapeCategory]);
  const handleRecordToggle = () => {
    if (onToggleRecord) {
      onToggleRecord();
    } else {
      Store_default.recording = !Store_default.recording;
    }
  };
  const handleResetDefaults = () => {
    Store_default.avatar = "raccoon";
    Store_default.smoothStep = 0.5;
    Store_default.mirror = true;
    Store_default.grid = false;
    Store_default.booster = false;
  };
  return /* @__PURE__ */ React24.createElement(
    GlassInspectorDrawer,
    {
      isOpen,
      onClose,
      tabs: DRAWER_TABS,
      activeTab,
      onTabChange,
      title: "Face Mocap Studio",
      position: "right",
      width: 380,
      footer: /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", gap: "8px", width: "100%" } }, /* @__PURE__ */ React24.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-secondary",
          style: { flex: 1, padding: "7px 12px", fontSize: "12px" },
          onClick: handleResetDefaults
        },
        "\u21BA Reset"
      ), /* @__PURE__ */ React24.createElement(
        "button",
        {
          type: "button",
          className: `vs-btn ${Store_default.recording ? "vs-btn-danger" : "vs-btn-primary"}`,
          style: { flex: 1, padding: "7px 12px", fontSize: "12px" },
          onClick: handleRecordToggle,
          disabled: !Store_default.tracking
        },
        Store_default.recording ? "\u23F9 Stop" : "\u{1F534} Record"
      ), /* @__PURE__ */ React24.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-secondary",
          style: {
            flex: 1,
            padding: "7px 12px",
            fontSize: "12px",
            borderColor: Store_default.connected ? "rgba(74, 222, 128, 0.4)" : void 0,
            color: Store_default.connected ? "#4ade80" : void 0
          },
          onClick: () => {
            Store_default.connected = !Store_default.connected;
          }
        },
        "\u{1F517} ",
        Store_default.connected ? "Live" : "LiveLink"
      ))
    },
    /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "20px", padding: "16px" } }, activeTab === "avatar" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "Select Virtual Avatar"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Choose an expressive 3D character or accessory for real-time motion capture.")), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "10px" } }, /* @__PURE__ */ React24.createElement(
      "div",
      {
        onClick: () => {
          Store_default.avatar = "raccoon";
        },
        style: {
          padding: "14px",
          borderRadius: "12px",
          cursor: "pointer",
          border: Store_default.avatar === "raccoon" ? "2px solid var(--accent, #a855f7)" : "1px solid rgba(255, 255, 255, 0.1)",
          background: Store_default.avatar === "raccoon" ? "rgba(168, 85, 247, 0.12)" : "rgba(255, 255, 255, 0.03)",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }
      },
      /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px" } }, /* @__PURE__ */ React24.createElement("div", { style: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        background: "rgba(255, 255, 255, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
      } }, "\u{1F99D}"), /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("div", { style: { fontWeight: 700, fontSize: "14px", color: "#ffffff" } }, "Raccoon Head"), /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "12px", color: "rgba(255, 255, 255, 0.55)" } }, "52 ARKit Morph Targets \u2022 Expressive"))),
      Store_default.avatar === "raccoon" && /* @__PURE__ */ React24.createElement("span", { className: "vs-badge vs-badge-primary", style: { fontSize: "11px", padding: "3px 8px" } }, "Active")
    ), /* @__PURE__ */ React24.createElement(
      "div",
      {
        onClick: () => {
          Store_default.avatar = "glasses";
        },
        style: {
          padding: "14px",
          borderRadius: "12px",
          cursor: "pointer",
          border: Store_default.avatar === "glasses" ? "2px solid var(--accent, #a855f7)" : "1px solid rgba(255, 255, 255, 0.1)",
          background: Store_default.avatar === "glasses" ? "rgba(168, 85, 247, 0.12)" : "rgba(255, 255, 255, 0.03)",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }
      },
      /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px" } }, /* @__PURE__ */ React24.createElement("div", { style: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        background: "rgba(255, 255, 255, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
      } }, "\u{1F453}"), /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("div", { style: { fontWeight: 700, fontSize: "14px", color: "#ffffff" } }, "3D Glasses"), /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "12px", color: "rgba(255, 255, 255, 0.55)" } }, "Cranial Occluder \u2022 Accessory Try-On"))),
      Store_default.avatar === "glasses" && /* @__PURE__ */ React24.createElement("span", { className: "vs-badge vs-badge-primary", style: { fontSize: "11px", padding: "3px 8px" } }, "Active")
    )), /* @__PURE__ */ React24.createElement("div", { style: {
      padding: "12px 14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      fontSize: "12px",
      lineHeight: 1.5,
      color: "rgba(255, 255, 255, 0.7)"
    } }, /* @__PURE__ */ React24.createElement("strong", { style: { color: "#fff" } }, "Rigging Note:"), " The Raccoon avatar actively binds to all 52 Apple ARKit blendshape channels simultaneously for high-fidelity facial performance capture.")), activeTab === "camera" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "18px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "Camera & Tracking Inputs"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Select input hardware, mirror feeds, and toggle debug overlays.")), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React24.createElement("label", { style: { fontSize: "12px", fontWeight: 600, color: "rgba(255, 255, 255, 0.75)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Camera Source"), /* @__PURE__ */ React24.createElement(
      "select",
      {
        className: "vs-select",
        style: {
          width: "100%",
          padding: "9px 12px",
          borderRadius: "8px",
          background: "rgba(20, 20, 30, 0.8)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          fontSize: "13px",
          outline: "none"
        },
        onChange: (e) => onCameraChange?.(e.target.value),
        defaultValue: ""
      },
      /* @__PURE__ */ React24.createElement("option", { value: "", disabled: true }, "Select Input Camera"),
      Store_default.cameras.map((device) => /* @__PURE__ */ React24.createElement("option", { key: device.deviceId, value: device.deviceId }, device.label || `Camera ${device.deviceId.substring(0, 5)}`)),
      /* @__PURE__ */ React24.createElement("option", { value: "video" }, "\u{1F4C1} Load video from file...")
    )), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React24.createElement("label", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "13px", color: "#ffffff" } }, /* @__PURE__ */ React24.createElement("span", null, "Mirror Camera View"), /* @__PURE__ */ React24.createElement(
      "input",
      {
        type: "checkbox",
        className: "vs-checkbox",
        checked: Store_default.mirror,
        onChange: (e) => {
          Store_default.mirror = e.target.checked;
        }
      }
    )), /* @__PURE__ */ React24.createElement("label", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "13px", color: "#ffffff" } }, /* @__PURE__ */ React24.createElement("span", null, "Facial Landmarks & 3D Grid"), /* @__PURE__ */ React24.createElement(
      "input",
      {
        type: "checkbox",
        className: "vs-checkbox",
        checked: Store_default.grid,
        onChange: (e) => {
          Store_default.grid = e.target.checked;
        }
      }
    ))), /* @__PURE__ */ React24.createElement("div", { style: {
      padding: "12px 14px",
      borderRadius: "10px",
      background: Store_default.tracking ? "rgba(74, 222, 128, 0.08)" : "rgba(245, 158, 11, 0.08)",
      border: Store_default.tracking ? "1px solid rgba(74, 222, 128, 0.25)" : "1px solid rgba(245, 158, 11, 0.25)",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    } }, /* @__PURE__ */ React24.createElement("span", { style: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: Store_default.tracking ? "#4ade80" : "#f59e0b",
      boxShadow: Store_default.tracking ? "0 0 10px #4ade80" : "none"
    } }), /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "12.5px", color: Store_default.tracking ? "#4ade80" : "#f59e0b", fontWeight: 600 } }, Store_default.tracking ? "Face Detected" : "No Face Detected"))), activeTab === "blendshapes" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "52 ARKit Blendshapes (52)"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Real-time facial expression telemetry and multiplier boosters.")), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" } }, [
      { id: "all", label: "All (52)" },
      { id: "eyes", label: "Eyes & Brows" },
      { id: "mouth", label: "Mouth & Lips" },
      { id: "jaw", label: "Jaw & Cheeks" },
      { id: "other", label: "Tongue & Nose" }
    ].map((cat) => /* @__PURE__ */ React24.createElement(
      "button",
      {
        key: cat.id,
        type: "button",
        onClick: () => setBlendshapeCategory(cat.id),
        style: {
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "11.5px",
          fontWeight: 600,
          cursor: "pointer",
          border: "1px solid",
          borderColor: blendshapeCategory === cat.id ? "var(--accent, #a855f7)" : "rgba(255, 255, 255, 0.12)",
          background: blendshapeCategory === cat.id ? "var(--accent, #a855f7)" : "rgba(255, 255, 255, 0.04)",
          color: blendshapeCategory === cat.id ? "#ffffff" : "rgba(255, 255, 255, 0.7)"
        }
      },
      cat.label
    ))), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      borderRadius: "8px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "13px", fontWeight: 600, color: "#ffffff" } }, "Blendshape Boosters"), /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "11.5px", color: "rgba(255, 255, 255, 0.55)" } }, "Amplify micro-expressions")), /* @__PURE__ */ React24.createElement(
      "input",
      {
        type: "checkbox",
        className: "vs-checkbox",
        checked: Store_default.booster,
        onChange: (e) => {
          Store_default.booster = e.target.checked;
        }
      }
    )), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      maxHeight: "340px",
      overflowY: "auto",
      paddingRight: "4px"
    } }, filteredBlendshapes.map(({ key }) => {
      const rawVal = Store_default.blendshapes[key] || "0.000000";
      const numVal = parseFloat(rawVal) || 0;
      const percent = Math.min(100, Math.max(0, numVal * 100));
      return /* @__PURE__ */ React24.createElement(
        "div",
        {
          key,
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            padding: "8px 10px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }
        },
        /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "12px", fontWeight: 600, color: "#e2e8f0" }, title: key }, key), /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "11px", fontFamily: "monospace", color: "rgba(255, 255, 255, 0.7)" } }, numVal.toFixed(2))),
        /* @__PURE__ */ React24.createElement("div", { style: {
          width: "100%",
          height: "4px",
          borderRadius: "2px",
          background: "rgba(255, 255, 255, 0.08)",
          overflow: "hidden"
        } }, /* @__PURE__ */ React24.createElement("div", { style: {
          width: `${percent}%`,
          height: "100%",
          background: "linear-gradient(90deg, #818cf8 0%, #c084fc 100%)",
          transition: "width 0.05s ease-out"
        } })),
        Store_default.booster && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" } }, /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "10.5px", color: "rgba(255, 255, 255, 0.5)" } }, "Boost:"), /* @__PURE__ */ React24.createElement(
          "input",
          {
            type: "range",
            min: 0,
            max: 2,
            step: 0.05,
            defaultValue: boosters[key] !== void 0 ? boosters[key] : 1,
            onChange: (e) => {
              boosters[key] = parseFloat(e.target.value);
            },
            style: { flex: 1, height: "4px" }
          }
        ), /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "10.5px", fontFamily: "monospace", color: "rgba(255, 255, 255, 0.6)" } }, (boosters[key] !== void 0 ? boosters[key] : 1).toFixed(2), "x"))
      );
    }))), activeTab === "livelink" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "LiveLink Engine Streaming"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Broadcast facial animation curves to Unreal Engine & Unity.")), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React24.createElement("label", { style: { fontSize: "12px", fontWeight: 600, color: "rgba(255, 255, 255, 0.75)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "WebSocket Server Host"), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "13px", color: "rgba(255, 255, 255, 0.5)", fontFamily: "monospace" } }, "ws://"), /* @__PURE__ */ React24.createElement(
      "input",
      {
        type: "text",
        className: "vs-input",
        style: {
          flex: 1,
          padding: "8px 12px",
          borderRadius: "8px",
          background: "rgba(20, 20, 30, 0.8)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          fontSize: "13px",
          fontFamily: "monospace",
          outline: "none"
        },
        value: Store_default.serverAddress,
        onChange: (e) => {
          Store_default.serverAddress = e.target.value;
        }
      }
    ))), /* @__PURE__ */ React24.createElement(
      "button",
      {
        type: "button",
        className: `vs-btn ${Store_default.connected ? "vs-btn-danger" : "vs-btn-primary"}`,
        style: { padding: "10px", fontSize: "13.5px", fontWeight: 700, borderRadius: "8px" },
        onClick: () => {
          Store_default.connected = !Store_default.connected;
        }
      },
      Store_default.connected ? "Disconnect LiveLink" : "Connect LiveLink"
    ), /* @__PURE__ */ React24.createElement("div", { style: {
      padding: "10px 14px",
      borderRadius: "8px",
      background: Store_default.connected ? "rgba(74, 222, 128, 0.08)" : "rgba(255, 255, 255, 0.03)",
      border: Store_default.connected ? "1px solid rgba(74, 222, 128, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px"
    } }, /* @__PURE__ */ React24.createElement("span", null, Store_default.connected ? "\u{1F7E2}" : "\u26AA"), /* @__PURE__ */ React24.createElement("span", { style: { color: Store_default.connected ? "#4ade80" : "rgba(255, 255, 255, 0.6)" } }, Store_default.connected ? `Streaming to ws://${Store_default.serverAddress}` : "LiveLink Disconnected")), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "12.5px", fontWeight: 600, color: "#ffffff" } }, "Engine Bridge Plugins:"), /* @__PURE__ */ React24.createElement(
      "a",
      {
        href: "downloads/LiveLinkShell.zip",
        download: true,
        className: "vs-btn vs-btn-secondary",
        style: { textAlign: "center", padding: "8px 12px", fontSize: "12.5px", textDecoration: "none" }
      },
      "\u2193 LiveLinkShell (Windows UDP Relay)"
    ), /* @__PURE__ */ React24.createElement(
      "a",
      {
        href: "downloads/UnityLiveLink.unitypackage",
        download: true,
        className: "vs-btn vs-btn-secondary",
        style: { textAlign: "center", padding: "8px 12px", fontSize: "12.5px", textDecoration: "none" }
      },
      "\u2193 Unity Live Capture Package"
    ), /* @__PURE__ */ React24.createElement(
      "button",
      {
        type: "button",
        onClick: onOpenHelp,
        className: "vs-btn vs-btn-ghost",
        style: { fontSize: "12px", padding: "6px", color: "#c084fc" }
      },
      "\u{1F4D6} Open Setup Guide & Instructions"
    ))), activeTab === "settings" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "18px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "Mocap Pipeline & Telemetry"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Temporal filter smoothing, CSV recording, and diagnostic tools.")), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "13px", fontWeight: 600, color: "#ffffff" } }, "Tracking Smoother"), /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "12px", fontFamily: "monospace", color: "#a78bfa" } }, Store_default.smoothStep.toFixed(3))), /* @__PURE__ */ React24.createElement(
      "input",
      {
        type: "range",
        className: "vs-range",
        min: 0.5,
        max: 1,
        step: 5e-3,
        value: Store_default.smoothStep,
        onChange: (e) => {
          Store_default.smoothStep = parseFloat(e.target.value);
        },
        style: { width: "100%" }
      }
    ), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "rgba(255, 255, 255, 0.4)" } }, /* @__PURE__ */ React24.createElement("span", null, "0.50 (Responsive)"), /* @__PURE__ */ React24.createElement("span", null, "1.00 (Max Smooth)"))), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "13px", fontWeight: 600, color: "#ffffff" } }, "CSV Motion Capture Recording"), /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.4 } }, "Records all 52 blendshape channels at 60 FPS and downloads ", /* @__PURE__ */ React24.createElement("code", { style: { color: "#c084fc" } }, "BlendshapeData.csv"), " upon completion."), /* @__PURE__ */ React24.createElement(
      "button",
      {
        type: "button",
        className: `vs-btn ${Store_default.recording ? "vs-btn-danger" : "vs-btn-primary"}`,
        style: { padding: "9px", fontSize: "13px", fontWeight: 600, borderRadius: "8px" },
        onClick: handleRecordToggle,
        disabled: !Store_default.tracking
      },
      Store_default.recording ? "\u23F9 Stop Recording & Download CSV" : "\u{1F534} Start CSV Recording"
    )), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "12px 14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      fontSize: "12px",
      color: "rgba(255, 255, 255, 0.7)"
    } }, /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React24.createElement("span", null, "MediaPipe Vision Task:"), /* @__PURE__ */ React24.createElement("span", { style: { color: Store_default.loaded ? "#4ade80" : "#f59e0b", fontWeight: 600 } }, Store_default.loaded ? "Active" : "Initializing")), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React24.createElement("span", null, "Running Mode:"), /* @__PURE__ */ React24.createElement("span", { style: { color: "#fff" } }, Store_default.runningMode)), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React24.createElement("span", null, "Tracking Delegate:"), /* @__PURE__ */ React24.createElement("span", { style: { color: "#fff" } }, "GPU / WebGL")))))
  );
});

// apps/face-mocap/src/LiveLinkHelpModal.jsx
import React25 from "react";
var LiveLinkHelpModal = ({ isOpen, onClose }) => {
  return /* @__PURE__ */ React25.createElement(
    FrostedModalDialog,
    {
      isOpen,
      onClose,
      title: "LiveLink Streaming Guide",
      subtitle: "Connect Trikomi Face Mocap to Unreal Engine MetaHumans and Unity Live Capture",
      size: "lg",
      footer: /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", justifyContent: "flex-end", width: "100%" } }, /* @__PURE__ */ React25.createElement(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "vs-btn vs-btn-primary",
          style: {
            padding: "8px 22px",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "8px",
            cursor: "pointer"
          }
        },
        "Done"
      ))
    },
    /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "20px", color: "#e2e8f0", fontSize: "13.5px", lineHeight: 1.6 } }, /* @__PURE__ */ React25.createElement("div", { style: {
      padding: "16px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#c084fc", fontWeight: 700, fontSize: "15px" } }, /* @__PURE__ */ React25.createElement("span", null, "\u{1F3AE}"), /* @__PURE__ */ React25.createElement("span", null, "Unreal Engine 5 (MetaHuman / LiveLink)")), /* @__PURE__ */ React25.createElement("ol", { style: { margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" } }, /* @__PURE__ */ React25.createElement("li", null, "Download and unzip ", /* @__PURE__ */ React25.createElement("strong", { style: { color: "#fff" } }, "LiveLinkShell (Windows)"), " from the LiveLink tab."), /* @__PURE__ */ React25.createElement("li", null, "Run ", /* @__PURE__ */ React25.createElement("code", { style: { background: "rgba(0,0,0,0.4)", padding: "2px 6px", borderRadius: "4px", color: "#a78bfa" } }, "LiveLinkShell.exe"), " to start the local UDP relay bridge on port ", /* @__PURE__ */ React25.createElement("strong", null, "11111"), "."), /* @__PURE__ */ React25.createElement("li", null, "In Unreal Engine, enable the ", /* @__PURE__ */ React25.createElement("strong", { style: { color: "#fff" } }, "Live Link"), " plugin and add a ", /* @__PURE__ */ React25.createElement("strong", null, "Live Link Subject"), " named ", /* @__PURE__ */ React25.createElement("code", { style: { background: "rgba(0,0,0,0.4)", padding: "2px 6px", borderRadius: "4px", color: "#a78bfa" } }, "Face"), "."), /* @__PURE__ */ React25.createElement("li", null, "Assign the Subject to your MetaHuman or Skeletal Mesh Live Link component."))), /* @__PURE__ */ React25.createElement("div", { style: {
      padding: "16px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#818cf8", fontWeight: 700, fontSize: "15px" } }, /* @__PURE__ */ React25.createElement("span", null, "\u{1F579}\uFE0F"), /* @__PURE__ */ React25.createElement("span", null, "Unity Live Capture & Animation")), /* @__PURE__ */ React25.createElement("ol", { style: { margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" } }, /* @__PURE__ */ React25.createElement("li", null, "Download ", /* @__PURE__ */ React25.createElement("strong", { style: { color: "#fff" } }, "UnityLiveLink.unitypackage"), " from the LiveLink tab."), /* @__PURE__ */ React25.createElement("li", null, "In Unity, go to ", /* @__PURE__ */ React25.createElement("strong", null, "Assets \u2192 Import Package \u2192 Custom Package"), " and select the downloaded package."), /* @__PURE__ */ React25.createElement("li", null, "Attach the ", /* @__PURE__ */ React25.createElement("code", { style: { background: "rgba(0,0,0,0.4)", padding: "2px 6px", borderRadius: "4px", color: "#a78bfa" } }, "TrikomiLiveLinkReceiver"), " script to your target rigged character."), /* @__PURE__ */ React25.createElement("li", null, "Ensure the WebSocket server address matches your local host (default: ", /* @__PURE__ */ React25.createElement("code", { style: { background: "rgba(0,0,0,0.4)", padding: "2px 6px", borderRadius: "4px", color: "#a78bfa" } }, "127.0.0.1:5000"), ")."))), /* @__PURE__ */ React25.createElement("div", { style: {
      padding: "16px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#f472b6", fontWeight: 700, fontSize: "15px" } }, /* @__PURE__ */ React25.createElement("span", null, "\u{1F4E1}"), /* @__PURE__ */ React25.createElement("span", null, "Broadcast Protocol Specifications")), /* @__PURE__ */ React25.createElement("p", { style: { margin: 0 } }, "Trikomi streams standard Apple ARKit-compatible blendshape curves across 52 individual facial channels, plus head rotation pitch/yaw/roll quaternions. Packets are streamed continuously over WebSocket/UDP at the engine render frequency.")))
  );
};

// tests/mocap-redesign.unit.test.mjs
test("MocapInspector renders GlassInspectorDrawer with all 5 tabs and title", () => {
  const html = renderToStaticMarkup(
    React26.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "avatar",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("vs-glass-inspector-drawer"), "Should render drawer container");
  assert.ok(html.includes("Face Mocap Studio"), "Should render drawer title");
  assert.ok(html.includes("Avatar"), "Should render Avatar tab");
  assert.ok(html.includes("Camera"), "Should render Camera tab");
  assert.ok(html.includes("Blendshapes"), "Should render Blendshapes tab");
  assert.ok(html.includes("LiveLink"), "Should render LiveLink tab");
  assert.ok(html.includes("Settings"), "Should render Settings tab");
  assert.ok(html.includes("Reset"), "Should render Reset footer button");
  assert.ok(html.includes("Record"), "Should render Record footer button");
  assert.ok(html.includes("LiveLink") || html.includes("Live"), "Should render LiveLink footer button");
});
test("MocapInspector renders Avatar panel with Raccoon Head and 3D Glasses options and active badge", () => {
  runInAction(() => {
    Store_default.avatar = "raccoon";
  });
  const html = renderToStaticMarkup(
    React26.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "avatar",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("Select Virtual Avatar"), "Should render avatar selection header");
  assert.ok(html.includes("Raccoon Head"), "Should render Raccoon Head card");
  assert.ok(html.includes("52 ARKit Morph Targets"), "Should detail morph targets");
  assert.ok(html.includes("3D Glasses"), "Should render 3D Glasses card");
  assert.ok(html.includes("Cranial Occluder"), "Should detail occluder tracking");
  assert.ok(html.includes("Active"), "Should display active badge on current avatar");
});
test("MocapInspector renders Camera panel with source selection, mirror view, and landmarks grid", () => {
  const html = renderToStaticMarkup(
    React26.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "camera",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("Camera &amp; Tracking Inputs") || html.includes("Camera & Tracking Inputs"), "Should render camera header");
  assert.ok(html.includes("Camera Source"), "Should render camera source label");
  assert.ok(html.includes("Mirror Camera View"), "Should render mirror camera toggle");
  assert.ok(html.includes("Facial Landmarks &amp; 3D Grid") || html.includes("Facial Landmarks & 3D Grid"), "Should render landmarks toggle");
  assert.ok(html.includes("Face Detected") || html.includes("No Face Detected"), "Should render tracking indicator");
});
test("MocapInspector renders Blendshapes panel with 52 ARKit meters and category filter buttons", () => {
  const html = renderToStaticMarkup(
    React26.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "blendshapes",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("52 ARKit Blendshapes"), "Should render blendshapes header");
  assert.ok(html.includes("All (52)"), "Should render All filter button");
  assert.ok(html.includes("Eyes &amp; Brows") || html.includes("Eyes & Brows"), "Should render Eyes filter button");
  assert.ok(html.includes("Mouth &amp; Lips") || html.includes("Mouth & Lips"), "Should render Mouth filter button");
  assert.ok(html.includes("Jaw &amp; Cheeks") || html.includes("Jaw & Cheeks"), "Should render Jaw filter button");
  assert.ok(html.includes("Tongue &amp; Nose") || html.includes("Tongue & Nose"), "Should render Other filter button");
  assert.ok(html.includes("EyeBlinkLeft"), "Should render EyeBlinkLeft blendshape");
  assert.ok(html.includes("MouthSmileLeft"), "Should render MouthSmileLeft blendshape");
});
test("MocapInspector renders Blendshapes booster multiplier sliders and master toggle", () => {
  runInAction(() => {
    Store_default.booster = true;
  });
  const html = renderToStaticMarkup(
    React26.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "blendshapes",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("Blendshape Boosters"), "Should render booster section");
  assert.ok(html.includes("Amplify micro-expressions"), "Should render booster subtitle");
  assert.ok(html.includes("Boost:"), "Should render boost multiplier label");
  assert.ok(html.includes("1.00x"), "Should display default multiplier readout");
});
test("MocapInspector renders LiveLink panel with WebSocket URL input and connection status", () => {
  runInAction(() => {
    Store_default.connected = false;
    Store_default.serverAddress = "127.0.0.1:5000";
  });
  const html = renderToStaticMarkup(
    React26.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "livelink",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("LiveLink Engine Streaming"), "Should render LiveLink header");
  assert.ok(html.includes("WebSocket Server Host"), "Should render server host label");
  assert.ok(html.includes("127.0.0.1:5000"), "Should display configured host");
  assert.ok(html.includes("Connect LiveLink"), "Should render Connect LiveLink button");
  assert.ok(html.includes("LiveLink Disconnected"), "Should display disconnected state");
});
test("MocapInspector renders LiveLink panel with verified download links for LiveLinkShell and Unity Package", () => {
  const html = renderToStaticMarkup(
    React26.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "livelink",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("downloads/LiveLinkShell.zip"), "Must link to real LiveLinkShell.zip on disk");
  assert.ok(html.includes("downloads/UnityLiveLink.unitypackage"), "Must link to real UnityLiveLink.unitypackage on disk");
  assert.ok(html.includes("Open Setup Guide &amp; Instructions") || html.includes("Open Setup Guide & Instructions"), "Should offer setup guide button");
});
test("MocapInspector renders Settings panel with temporal smoother slider and CSV recorder", () => {
  const html = renderToStaticMarkup(
    React26.createElement(MocapInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "settings",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("Mocap Pipeline &amp; Telemetry") || html.includes("Mocap Pipeline & Telemetry"), "Should render settings header");
  assert.ok(html.includes("Tracking Smoother"), "Should render tracking smoother label");
  assert.ok(html.includes("0.50 (Responsive)"), "Should display responsive smoother label");
  assert.ok(html.includes("1.00 (Max Smooth)"), "Should display max smooth label");
  assert.ok(html.includes("CSV Motion Capture Recording"), "Should render CSV recording section");
  assert.ok(html.includes("Start CSV Recording"), "Should render start CSV recording button");
});
test("FloatingControlDock renders 5 mocap tool items with avatar and blendshapes badges", () => {
  const dockItems = [
    { id: "avatar", label: "Avatar", icon: "\u{1F3AD}", badge: "Raccoon" },
    { id: "camera", label: "Camera", icon: "\u{1F4F7}" },
    { id: "blendshapes", label: "Blendshapes", icon: "\u{1F4CA}", badge: "52" },
    { id: "livelink", label: "LiveLink", icon: "\u{1F517}" },
    { id: "settings", label: "Settings", icon: "\u2699\uFE0F" }
  ];
  const html = renderToStaticMarkup(
    React26.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: "avatar",
      onSelect: () => {
      },
      position: "bottom"
    })
  );
  assert.ok(html.includes("vs-floating-control-dock"), "Should render floating dock");
  assert.ok(html.includes("Avatar"), "Should render Avatar dock item");
  assert.ok(html.includes("Camera"), "Should render Camera dock item");
  assert.ok(html.includes("Blendshapes"), "Should render Blendshapes dock item");
  assert.ok(html.includes("LiveLink"), "Should render LiveLink dock item");
  assert.ok(html.includes("Settings"), "Should render Settings dock item");
  assert.ok(html.includes("52"), "Should render 52 ARKit badge");
});
test("CanvasControlToolbar renders top-right actions for Recenter, Record, Grid, LiveLink, and Fullscreen", () => {
  const html = renderToStaticMarkup(
    React26.createElement(CanvasControlToolbar, {
      position: "top-right",
      onRecenter: () => {
      },
      extraActions: React26.createElement(
        "div",
        { className: "extra-mocap-actions" },
        React26.createElement("button", { className: "rec-btn" }, "\u{1F534} Rec"),
        React26.createElement("button", { className: "grid-btn" }, "\u{1F310} Grid"),
        React26.createElement("button", { className: "livelink-btn" }, "\u{1F517} LiveLink"),
        React26.createElement("button", { className: "fs-btn" }, "\u26F6")
      )
    })
  );
  assert.ok(html.includes("vs-canvas-control-toolbar"), "Should render canvas toolbar");
  assert.ok(html.includes("vs-canvas-control-toolbar--top-right"), "Should use top-right position");
  assert.ok(html.includes("rec-btn"), "Should render CSV recording quick action");
  assert.ok(html.includes("grid-btn"), "Should render landmarks grid quick action");
  assert.ok(html.includes("livelink-btn"), "Should render LiveLink quick action");
  assert.ok(html.includes("fs-btn"), "Should render fullscreen quick action");
});
test("LiveLinkHelpModal renders FrostedModalDialog with Unreal Engine, Unity, and ARKit guide", () => {
  const html = renderToStaticMarkup(
    React26.createElement(LiveLinkHelpModal, {
      isOpen: true,
      onClose: () => {
      }
    })
  );
  assert.ok(html.includes("vs-frosted-modal") || html.includes("LiveLink Streaming Guide"), "Should render frosted modal shell");
  assert.ok(html.includes("LiveLink Streaming Guide"), "Should render guide title");
  assert.ok(html.includes("Unreal Engine 5 (MetaHuman / LiveLink)"), "Should document Unreal Engine 5");
  assert.ok(html.includes("Unity Live Capture &amp; Animation") || html.includes("Unity Live Capture & Animation"), "Should document Unity Live Capture");
  assert.ok(html.includes("Broadcast Protocol Specifications"), "Should detail ARKit broadcast curves");
  assert.ok(html.includes("Done"), "Should render Done dismissal button");
});
test("AppHeaderBar renders mocap branding, tracking status badge, and theme switcher", () => {
  function MocapHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React26.createElement(AppHeaderBar, {
      brandTitle: "TRIKOMI",
      productTitle: "Face Mocap",
      backLabel: "\u2190 Back to Overview",
      onBack: () => {
      },
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React26.createElement("span", { className: "vs-mocap-status-badge" }, "Tracking Active \u2022 52 ARKit")
    });
  }
  const html = renderToStaticMarkup(
    React26.createElement(
      VictorShellThemeProvider,
      { initialAccent: "violet" },
      React26.createElement(MocapHeaderStage)
    )
  );
  assert.ok(html.includes("TRIKOMI"), "Should render brand title");
  assert.ok(html.includes("Face Mocap"), "Should render product title");
  assert.ok(html.includes("\u2190 Back to Overview"), "Should render back button");
  assert.ok(html.includes("Tracking Active \u2022 52 ARKit"), "Should render status badge");
  assert.ok(html.includes('data-accent="violet"'), 'Provider root should have initial data-accent="violet"');
  assert.ok(html.includes("vs-theme-accent-btn--violet is-active"), "AppHeaderBar should have active violet theme button");
});
test("VictorShellThemeProvider persists custom theme selection across re-renders in face mocap", () => {
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
    stopPropagation() {
      this._propagationStopped = true;
    }
    preventDefault() {
      this.defaultPrevented = true;
    }
  }
  class MockNode {
    constructor(tag = "div", ownerDoc = null) {
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
      if (k === "class") this.attributes["className"] = v;
    }
    removeAttribute(k) {
      delete this.attributes[k];
      if (k === "class") delete this.attributes["className"];
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
      const evt = new MockEvent("click", { bubbles: true, cancelable: true });
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
    documentElement: new MockNode("HTML", null),
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
      return new MockNode(tag, mockDoc);
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
    let TestThemeProbe2 = function() {
      const ctx = useVictorShellTheme();
      contextValue = ctx;
      const [, setTick] = React26.useState(0);
      triggerUnrelatedUpdate = () => setTick((t) => t + 1);
      return React26.createElement(AppHeaderBar, {
        brandTitle: "TRIKOMI",
        productTitle: "Face Mocap",
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
        React26.createElement(
          VictorShellThemeProvider,
          { initialAccent: "violet" },
          React26.createElement(TestThemeProbe2)
        )
      );
    });
    assert.equal(contextValue.accent, "violet", "Initial theme should be Royal Violet");
    const rootWrapper = container.childNodes[0];
    assert.equal(rootWrapper.attributes["data-accent"], "violet", 'VictorShellThemeProvider root must have data-accent="violet"');
    const violetBtn = container.find((el) => el.attributes["aria-label"] === "Royal Violet Theme");
    assert.ok(violetBtn, "Violet theme button must be rendered in AppHeaderBar");
    assert.ok(violetBtn.className.includes("is-active"), "Violet button should be active initially");
    const orchidBtn = container.find((el) => el.attributes["aria-label"] === "Orchid Glow Theme");
    assert.ok(orchidBtn, "Orchid theme button must exist in AppHeaderBar");
    act(() => {
      orchidBtn.click();
    });
    assert.equal(contextValue.accent, "orchid", "Context theme should update to Orchid after click event");
    assert.equal(mockDoc.documentElement.getAttribute("data-accent"), "orchid", "Document data-accent should update to orchid");
    assert.equal(rootWrapper.attributes["data-accent"], "orchid", "Provider root data-accent must update to orchid");
    assert.ok(orchidBtn.className.includes("is-active"), "Orchid button must be active");
    assert.ok(!violetBtn.className.includes("is-active"), "Violet button must not be active");
    act(() => {
      triggerUnrelatedUpdate();
    });
    assert.equal(contextValue.accent, "orchid", "Theme should remain Orchid after unrelated component re-render");
    assert.equal(mockDoc.documentElement.getAttribute("data-accent"), "orchid", "Document data-accent should remain orchid");
    const indigoBtn = container.find((el) => el.attributes["aria-label"] === "Electric Indigo Theme");
    assert.ok(indigoBtn, "Indigo theme button must exist in AppHeaderBar");
    act(() => {
      indigoBtn.click();
    });
    assert.equal(contextValue.accent, "indigo", "Context theme should update to Indigo after click event");
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
