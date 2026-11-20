// tests/eighthwall-redesign.unit.test.mjs
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

// apps/8theye/src/EighthWallInspector.jsx
import React24 from "react";
import { observer } from "mobx-react-lite";

// apps/8theye/src/Store.jsx
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
  isArActive: true,
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
var Store_default = store;

// apps/8theye/src/EighthWallInspector.jsx
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
var DRAWER_TABS = [
  { id: "models", label: "Styles", icon: "\u{1F453}" },
  { id: "frames", label: "Frames", icon: "\u{1F3A8}" },
  { id: "lenses", label: "Lenses", icon: "\u{1F576}\uFE0F" },
  { id: "webar", label: "WebAR", icon: "\u{1F310}" },
  { id: "info", label: "Info", icon: "\u{1F4CB}" }
];
var EighthWallInspector = observer(({
  isOpen,
  onClose,
  activeTab = "models",
  onTabChange,
  models = [],
  activeModelIndex = 0,
  onSelectModel,
  onApplyColor,
  onRecenter,
  onOpenHelp
}) => {
  const currentModel = models[activeModelIndex] || models[0] || { name: "Eyewear Model", scale: 0.3 };
  const activeFrameHex = (() => {
    for (const matName of Store_default.glassConfigs?.materials || []) {
      if (matName.toLowerCase().includes("frame") && Store_default.materialProps[matName]?.color) {
        return Store_default.materialProps[matName].color;
      }
    }
    return "#222222";
  })();
  const activeLensHex = (() => {
    for (const matName of Store_default.glassConfigs?.materials || []) {
      if (matName.toLowerCase().includes("lens") && Store_default.materialProps[matName]?.color) {
        return Store_default.materialProps[matName].color;
      }
    }
    return "#111111";
  })();
  const handleNextModel = () => {
    if (!models.length) return;
    const nextIdx = (activeModelIndex + 1) % models.length;
    if (onSelectModel) {
      onSelectModel(nextIdx);
    } else {
      Store_default.modelIndex = nextIdx;
    }
  };
  const handleResetDefaults = () => {
    if (onSelectModel) {
      onSelectModel(0);
    } else {
      Store_default.modelIndex = 0;
    }
    Store_default.grid = false;
    Store_default.naturalLighting = true;
  };
  return /* @__PURE__ */ React24.createElement(
    GlassInspectorDrawer,
    {
      isOpen,
      onClose,
      tabs: DRAWER_TABS,
      activeTab,
      onTabChange,
      title: "WebAR Eyewear Studio",
      position: "right",
      width: 360,
      footer: /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", gap: "8px", width: "100%" } }, /* @__PURE__ */ React24.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-secondary",
          style: { flex: 1, padding: "7px 12px", fontSize: "12px" },
          onClick: onRecenter || handleResetDefaults
        },
        "\u21BA Recenter AR"
      ), /* @__PURE__ */ React24.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-primary",
          style: { flex: 1, padding: "7px 12px", fontSize: "12px" },
          onClick: handleNextModel
        },
        "\u{1F453} Next Style"
      ))
    },
    /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "18px", padding: "16px" } }, activeTab === "models" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "14px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "Select Eyewear Style (", models.length, ")"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Real-time Niantic 8thWall WebAR head tracking and spatial placement.")), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, models.map((model, idx) => {
      const isActive = activeModelIndex === idx;
      return /* @__PURE__ */ React24.createElement(
        "div",
        {
          key: model.name || idx,
          onClick: () => {
            if (onSelectModel) {
              onSelectModel(idx);
            } else {
              Store_default.modelIndex = idx;
            }
          },
          style: {
            padding: "12px 14px",
            borderRadius: "12px",
            cursor: "pointer",
            border: isActive ? "2px solid var(--accent, #c084fc)" : "1px solid rgba(255, 255, 255, 0.1)",
            background: isActive ? "rgba(192, 132, 252, 0.12)" : "rgba(255, 255, 255, 0.03)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }
        },
        /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px" } }, /* @__PURE__ */ React24.createElement("div", { style: {
          width: "44px",
          height: "44px",
          borderRadius: "8px",
          background: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        } }, model.thumb ? /* @__PURE__ */ React24.createElement(
          "img",
          {
            src: model.thumb,
            alt: model.name,
            style: { width: "80%", height: "80%", objectFit: "contain" }
          }
        ) : /* @__PURE__ */ React24.createElement("span", { style: { fontSize: "20px" } }, "\u{1F453}")), /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("div", { style: { fontWeight: 700, fontSize: "13.5px", color: "#ffffff" } }, model.name), /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "11.5px", color: "rgba(255, 255, 255, 0.55)" } }, "Scale: ", model.scale || 0.3, " \u2022 3D GLTF"))),
        isActive && /* @__PURE__ */ React24.createElement("span", { className: "vs-badge vs-badge-primary", style: { fontSize: "11px", padding: "3px 8px" } }, "Active")
      );
    }))), activeTab === "frames" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "Frame Material Finishes (", FRAME_COLORS.length, ")"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Customize acetate, metallic, and transparent frame colors.")), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "10px",
      padding: "14px",
      borderRadius: "12px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, FRAME_COLORS.map((c) => {
      const isSelected = activeFrameHex.toLowerCase() === c.hex.toLowerCase();
      return /* @__PURE__ */ React24.createElement(
        "button",
        {
          key: c.name,
          type: "button",
          onClick: () => {
            if (onApplyColor) {
              onApplyColor("frame", c.hex, c.name);
            }
          },
          style: {
            aspectRatio: "1",
            borderRadius: "50%",
            background: c.hex,
            border: isSelected ? "3px solid #ffffff" : "2px solid rgba(255, 255, 255, 0.25)",
            boxShadow: isSelected ? "0 0 12px rgba(255, 255, 255, 0.6)" : "none",
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
            transition: "transform 0.15s ease"
          },
          title: c.name,
          "aria-label": `Frame color ${c.name}`
        },
        isSelected && /* @__PURE__ */ React24.createElement("span", { style: {
          color: c.name === "Clear" || c.name === "Silver" ? "#000000" : "#ffffff",
          fontSize: "13px",
          fontWeight: 900
        } }, "\u2713")
      );
    })), /* @__PURE__ */ React24.createElement("div", { style: {
      padding: "12px 14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "12.5px"
    } }, /* @__PURE__ */ React24.createElement("span", { style: { color: "rgba(255, 255, 255, 0.6)" } }, "Active Frame:"), /* @__PURE__ */ React24.createElement("span", { style: { fontWeight: 700, color: "#ffffff" } }, FRAME_COLORS.find((c) => c.hex.toLowerCase() === activeFrameHex.toLowerCase())?.name || "Custom"))), activeTab === "lenses" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "Lens Tint Options (", LENS_COLORS.length, ")"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Select UV-tinted optical coatings and gradient glass tones.")), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "10px",
      padding: "14px",
      borderRadius: "12px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, LENS_COLORS.map((c) => {
      const isSelected = activeLensHex.toLowerCase() === c.hex.toLowerCase();
      return /* @__PURE__ */ React24.createElement(
        "button",
        {
          key: c.name,
          type: "button",
          onClick: () => {
            if (onApplyColor) {
              onApplyColor("lens", c.hex, c.name);
            }
          },
          style: {
            aspectRatio: "1",
            borderRadius: "50%",
            background: c.hex,
            border: isSelected ? "3px solid #ffffff" : "2px solid rgba(255, 255, 255, 0.25)",
            boxShadow: isSelected ? "0 0 12px rgba(255, 255, 255, 0.6)" : "none",
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
            transition: "transform 0.15s ease"
          },
          title: c.name,
          "aria-label": `Lens color ${c.name}`
        },
        isSelected && /* @__PURE__ */ React24.createElement("span", { style: { color: "#ffffff", fontSize: "13px", fontWeight: 900 } }, "\u2713")
      );
    })), /* @__PURE__ */ React24.createElement("div", { style: {
      padding: "12px 14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "12.5px"
    } }, /* @__PURE__ */ React24.createElement("span", { style: { color: "rgba(255, 255, 255, 0.6)" } }, "Active Lens Tint:"), /* @__PURE__ */ React24.createElement("span", { style: { fontWeight: 700, color: "#ffffff" } }, LENS_COLORS.find((c) => c.hex.toLowerCase() === activeLensHex.toLowerCase())?.name || "Custom"))), activeTab === "webar" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "Niantic 8thWall WebAR"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "Real-time SLAM camera tracking, depth occlusion, and environment mapping.")), /* @__PURE__ */ React24.createElement("div", { style: {
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
    } }), /* @__PURE__ */ React24.createElement("div", { style: { fontSize: "12.5px", color: Store_default.tracking ? "#4ade80" : "#f59e0b", fontWeight: 600 } }, Store_default.tracking ? "Face Anchor Tracked" : "Searching for Face Anchor...")), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React24.createElement("label", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "13px", color: "#ffffff" } }, /* @__PURE__ */ React24.createElement("span", null, "Show Occluder Wireframe"), /* @__PURE__ */ React24.createElement(
      "input",
      {
        type: "checkbox",
        className: "vs-checkbox",
        checked: Store_default.grid,
        onChange: (e) => {
          Store_default.grid = e.target.checked;
        }
      }
    )), /* @__PURE__ */ React24.createElement("label", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "13px", color: "#ffffff" } }, /* @__PURE__ */ React24.createElement("span", null, "Natural Lighting Simulation"), /* @__PURE__ */ React24.createElement(
      "input",
      {
        type: "checkbox",
        className: "vs-checkbox",
        checked: Store_default.naturalLighting,
        onChange: (e) => {
          Store_default.naturalLighting = e.target.checked;
        }
      }
    ))), /* @__PURE__ */ React24.createElement(
      "button",
      {
        type: "button",
        onClick: onOpenHelp,
        className: "vs-btn vs-btn-secondary",
        style: { padding: "9px 12px", fontSize: "12.5px", textAlign: "center" }
      },
      "\u{1F4D6} WebAR Camera & Lighting Guide"
    )), activeTab === "info" && /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ React24.createElement("div", null, /* @__PURE__ */ React24.createElement("h3", { style: { margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#ffffff" } }, "Eyewear Specifications"), /* @__PURE__ */ React24.createElement("p", { style: { margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.6)" } }, "3D model metadata and optical specifications.")), /* @__PURE__ */ React24.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      fontSize: "12.5px"
    } }, /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React24.createElement("span", { style: { color: "rgba(255, 255, 255, 0.6)" } }, "Active Model:"), /* @__PURE__ */ React24.createElement("span", { style: { fontWeight: 600, color: "#ffffff" } }, currentModel.name)), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React24.createElement("span", { style: { color: "rgba(255, 255, 255, 0.6)" } }, "Mesh Scale:"), /* @__PURE__ */ React24.createElement("span", { style: { fontWeight: 600, color: "#ffffff" } }, currentModel.scale || 0.3)), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React24.createElement("span", { style: { color: "rgba(255, 255, 255, 0.6)" } }, "Occluder Depth:"), /* @__PURE__ */ React24.createElement("span", { style: { fontWeight: 600, color: "#a78bfa" } }, "Head Occluder GLB")), /* @__PURE__ */ React24.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React24.createElement("span", { style: { color: "rgba(255, 255, 255, 0.6)" } }, "Pipeline:"), /* @__PURE__ */ React24.createElement("span", { style: { fontWeight: 600, color: "#f472b6" } }, "Niantic 8thWall WebAR"))), /* @__PURE__ */ React24.createElement(
      "button",
      {
        type: "button",
        onClick: handleResetDefaults,
        className: "vs-btn vs-btn-secondary",
        style: { padding: "8px 12px", fontSize: "12.5px" }
      },
      "\u21BA Reset Eyewear Configuration"
    )))
  );
});

// apps/8theye/src/WebARHelpModal.jsx
import React25 from "react";
var WebARHelpModal = ({ isOpen, onClose }) => {
  return /* @__PURE__ */ React25.createElement(
    FrostedModalDialog,
    {
      isOpen,
      onClose,
      title: "WebAR Try-On Guide",
      subtitle: "Niantic 8thWall Face Tracking & Camera Guidelines",
      size: "md",
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
        "Got It"
      ))
    },
    /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px", color: "#e2e8f0", fontSize: "13px", lineHeight: 1.6 } }, /* @__PURE__ */ React25.createElement("div", { style: {
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", color: "#f472b6", fontWeight: 700, fontSize: "14px" } }, /* @__PURE__ */ React25.createElement("span", null, "\u{1F4F7}"), /* @__PURE__ */ React25.createElement("span", null, "Camera Permissions")), /* @__PURE__ */ React25.createElement("p", { style: { margin: 0 } }, "WebAR requires standard camera access. When prompted by your mobile browser (Safari on iOS or Chrome on Android), tap ", /* @__PURE__ */ React25.createElement("strong", { style: { color: "#fff" } }, "Allow"), ". Secure HTTPS context is mandatory.")), /* @__PURE__ */ React25.createElement("div", { style: {
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", color: "#c084fc", fontWeight: 700, fontSize: "14px" } }, /* @__PURE__ */ React25.createElement("span", null, "\u{1F4A1}"), /* @__PURE__ */ React25.createElement("span", null, "Lighting & Calibration")), /* @__PURE__ */ React25.createElement("p", { style: { margin: 0 } }, "Ensure your face is evenly illuminated with front lighting. Avoid intense backlighting or direct sun behind your head, which can impede facial anchor depth detection.")), /* @__PURE__ */ React25.createElement("div", { style: {
      padding: "14px",
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)"
    } }, /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", color: "#818cf8", fontWeight: 700, fontSize: "14px" } }, /* @__PURE__ */ React25.createElement("span", null, "\u{1F4D0}"), /* @__PURE__ */ React25.createElement("span", null, "Viewing Distance")), /* @__PURE__ */ React25.createElement("p", { style: { margin: 0 } }, "Hold your mobile device 12\u201318 inches (30\u201345 cm) from your face. The 8thWall SLAM tracking automatically scales and seats the 3D eyewear onto your nose bridge and ears.")))
  );
};

// tests/eighthwall-redesign.unit.test.mjs
var mockModels = [
  { name: "Aviator Classic", url: "models/glasses1.glb", thumb: "thumbs/glasses1.png", scale: 0.3 },
  { name: "Sport Wrap", url: "models/glasses2.glb", thumb: "thumbs/glasses2.png", scale: 0.3 },
  { name: "Wayfarer Style", url: "models/glasses3.glb", thumb: "thumbs/glasses3.png", scale: 0.3 },
  { name: "Round Metal", url: "models/glasses4.glb", thumb: "thumbs/glasses4.png", scale: 0.3 },
  { name: "Clubmaster", url: "models/glasses5.glb", thumb: "thumbs/glasses5.png", scale: 0.3 },
  { name: "Hexagonal", url: "models/glasses6.glb", thumb: "thumbs/glasses6.png", scale: 0.3 }
];
test("EighthWallInspector renders GlassInspectorDrawer with all 5 tabs and title", () => {
  const html = renderToStaticMarkup(
    React26.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "models",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0
    })
  );
  assert.ok(html.includes("vs-glass-inspector-drawer"), "Should render drawer container");
  assert.ok(html.includes("WebAR Eyewear Studio"), "Should render drawer title");
  assert.ok(html.includes("Styles"), "Should render Styles tab");
  assert.ok(html.includes("Frames"), "Should render Frames tab");
  assert.ok(html.includes("Lenses"), "Should render Lenses tab");
  assert.ok(html.includes("WebAR"), "Should render WebAR tab");
  assert.ok(html.includes("Info"), "Should render Info tab");
  assert.ok(html.includes("Recenter AR"), "Should render recenter AR footer button");
  assert.ok(html.includes("Next Style"), "Should render next style footer button");
});
test("EighthWallInspector renders Styles panel with 6 eyewear model cards and active badge", () => {
  const html = renderToStaticMarkup(
    React26.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "models",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 2
    })
  );
  assert.ok(html.includes("Select Eyewear Style (6)"), "Should render styles header");
  assert.ok(html.includes("Aviator Classic"), "Should render Aviator Classic card");
  assert.ok(html.includes("Sport Wrap"), "Should render Sport Wrap card");
  assert.ok(html.includes("Wayfarer Style"), "Should render Wayfarer Style card");
  assert.ok(html.includes("Round Metal"), "Should render Round Metal card");
  assert.ok(html.includes("Clubmaster"), "Should render Clubmaster card");
  assert.ok(html.includes("Hexagonal"), "Should render Hexagonal card");
  assert.ok(html.includes("Active"), "Should display active badge on current model");
});
test("EighthWallInspector renders Frames panel with 5 finish options and active checkmark", () => {
  runInAction(() => {
    Store_default.glassConfigs = {
      meshes: ["frame_mesh"],
      materials: ["frame_mat"]
    };
    Store_default.materialProps = {
      frame_mat: { color: "#8b4513" }
    };
  });
  const html = renderToStaticMarkup(
    React26.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "frames",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0
    })
  );
  assert.ok(html.includes("Frame Material Finishes (5)"), "Should render frames header");
  assert.ok(html.includes("Tortoise"), "Should display active frame color name");
  assert.ok(html.includes("\u2713"), "Should render checkmark on active color swatch");
  assert.equal(FRAME_COLORS.length, 5, "Must have exactly 5 verified frame finishes");
});
test("EighthWallInspector renders Lenses panel with 5 tint options and active checkmark", () => {
  runInAction(() => {
    Store_default.glassConfigs = {
      meshes: ["lens_mesh"],
      materials: ["lens_mat"]
    };
    Store_default.materialProps = {
      lens_mat: { color: "#1c2d54" }
    };
  });
  const html = renderToStaticMarkup(
    React26.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "lenses",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0
    })
  );
  assert.ok(html.includes("Lens Tint Options (5)"), "Should render lenses header");
  assert.ok(html.includes("Blue"), "Should display active lens tint color name");
  assert.ok(html.includes("\u2713"), "Should render checkmark on active tint swatch");
  assert.equal(LENS_COLORS.length, 5, "Must have exactly 5 verified lens tints");
});
test("EighthWallInspector renders WebAR panel with Niantic 8thWall telemetry and wireframe toggle", () => {
  runInAction(() => {
    Store_default.tracking = true;
    Store_default.grid = true;
    Store_default.naturalLighting = true;
  });
  const html = renderToStaticMarkup(
    React26.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "webar",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0
    })
  );
  assert.ok(html.includes("Niantic 8thWall WebAR"), "Should render WebAR header");
  assert.ok(html.includes("Face Anchor Tracked"), "Should render face anchor tracked indicator");
  assert.ok(html.includes("Show Occluder Wireframe"), "Should render occluder wireframe label");
  assert.ok(html.includes("Natural Lighting Simulation"), "Should render natural lighting simulation label");
  assert.ok(html.includes("WebAR Camera &amp; Lighting Guide") || html.includes("WebAR Camera & Lighting Guide"), "Should render guide action");
});
test("EighthWallInspector renders Info panel with model specifications and reset button", () => {
  const html = renderToStaticMarkup(
    React26.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "info",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 0
    })
  );
  assert.ok(html.includes("Eyewear Specifications"), "Should render specs header");
  assert.ok(html.includes("Active Model:"), "Should render active model field");
  assert.ok(html.includes("Aviator Classic"), "Should render model name");
  assert.ok(html.includes("Mesh Scale:"), "Should render mesh scale field");
  assert.ok(html.includes("Head Occluder GLB"), "Should render occluder depth info");
  assert.ok(html.includes("Reset Eyewear Configuration"), "Should render reset button");
});
test("FloatingControlDock renders 5 8thWall tool items with styles badge", () => {
  const dockItems = [
    { id: "models", label: "Styles", icon: "\u{1F453}", badge: 6 },
    { id: "frames", label: "Frames", icon: "\u{1F3A8}" },
    { id: "lenses", label: "Lenses", icon: "\u{1F576}\uFE0F" },
    { id: "webar", label: "WebAR", icon: "\u{1F310}" },
    { id: "info", label: "Info", icon: "\u{1F4CB}" }
  ];
  const html = renderToStaticMarkup(
    React26.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: "models",
      onSelect: () => {
      },
      position: "bottom"
    })
  );
  assert.ok(html.includes("vs-floating-control-dock"), "Should render floating dock");
  assert.ok(html.includes("Styles"), "Should render Styles dock item");
  assert.ok(html.includes("Frames"), "Should render Frames dock item");
  assert.ok(html.includes("Lenses"), "Should render Lenses dock item");
  assert.ok(html.includes("WebAR"), "Should render WebAR dock item");
  assert.ok(html.includes("Info"), "Should render Info dock item");
  assert.ok(html.includes("6"), "Should render 6 styles badge");
});
test("CanvasControlToolbar renders top-right controls with Grid, Light, and Fullscreen", () => {
  const html = renderToStaticMarkup(
    React26.createElement(CanvasControlToolbar, {
      position: "top-right",
      onRecenter: () => {
      },
      extraActions: React26.createElement(
        "div",
        { className: "extra-8theye-actions" },
        React26.createElement("button", { className: "grid-btn" }, "\u{1F310} Grid"),
        React26.createElement("button", { className: "light-btn" }, "\u{1F4A1} Light"),
        React26.createElement("button", { className: "fs-btn" }, "\u26F6")
      )
    })
  );
  assert.ok(html.includes("vs-canvas-control-toolbar"), "Should render canvas toolbar");
  assert.ok(html.includes("vs-canvas-control-toolbar--top-right"), "Should use top-right position");
  assert.ok(html.includes("grid-btn"), "Should render Grid quick toggle");
  assert.ok(html.includes("light-btn"), "Should render Light quick toggle");
  assert.ok(html.includes("fs-btn"), "Should render Fullscreen quick action");
});
test("WebARHelpModal renders FrostedModalDialog with camera permissions and lighting tips", () => {
  const html = renderToStaticMarkup(
    React26.createElement(WebARHelpModal, {
      isOpen: true,
      onClose: () => {
      }
    })
  );
  assert.ok(html.includes("vs-frosted-modal") || html.includes("WebAR Try-On Guide"), "Should render frosted modal shell");
  assert.ok(html.includes("WebAR Try-On Guide"), "Should render modal title");
  assert.ok(html.includes("Camera Permissions"), "Should explain camera permissions");
  assert.ok(html.includes("Lighting &amp; Calibration") || html.includes("Lighting & Calibration"), "Should explain lighting tips");
  assert.ok(html.includes("Viewing Distance"), "Should explain viewing distance");
  assert.ok(html.includes("Got It"), "Should render Got It dismissal button");
});
test("EighthWallInspector cycles models via Next Style footer action", () => {
  let selectedIdx = null;
  const html = renderToStaticMarkup(
    React26.createElement(EighthWallInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "models",
      onTabChange: () => {
      },
      models: mockModels,
      activeModelIndex: 1,
      onSelectModel: (idx) => {
        selectedIdx = idx;
      }
    })
  );
  assert.ok(html.includes("Next Style"), "Should render Next Style button");
  assert.ok(html.includes("Sport Wrap"), "Should show active model Sport Wrap");
  assert.ok(html.includes("Scale: 0.3"), "Should display model scale");
});
test("AppHeaderBar renders 8thWall branding, tracking status badge, and theme switcher", () => {
  function EightEyeHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React26.createElement(AppHeaderBar, {
      brandTitle: "TRIKOMI",
      productTitle: "8thWall WebAR Eyewear",
      backLabel: "\u2190 Back to Overview",
      onBack: () => {
      },
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React26.createElement("span", { className: "vs-8theye-status-badge" }, "Face Tracked \u2022 8thWall")
    });
  }
  const html = renderToStaticMarkup(
    React26.createElement(
      VictorShellThemeProvider,
      { initialAccent: "orchid" },
      React26.createElement(EightEyeHeaderStage)
    )
  );
  assert.ok(html.includes("TRIKOMI"), "Should render brand title");
  assert.ok(html.includes("8thWall WebAR Eyewear"), "Should render product title");
  assert.ok(html.includes("\u2190 Back to Overview"), "Should render back button");
  assert.ok(html.includes("Face Tracked \u2022 8thWall"), "Should render status badge");
  assert.ok(html.includes('data-accent="orchid"'), 'Provider root should have initial data-accent="orchid"');
  assert.ok(html.includes("vs-theme-accent-btn--orchid is-active"), "AppHeaderBar should have active orchid theme button");
});
test("VictorShellThemeProvider persists custom theme selection across re-renders in 8thWall WebAR", () => {
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
        productTitle: "8thWall WebAR Eyewear",
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
          { initialAccent: "orchid" },
          React26.createElement(TestThemeProbe2)
        )
      );
    });
    assert.equal(contextValue.accent, "orchid", "Initial theme should be Orchid Glow");
    const rootWrapper = container.childNodes[0];
    assert.equal(rootWrapper.attributes["data-accent"], "orchid", 'VictorShellThemeProvider root must have data-accent="orchid"');
    const orchidBtn = container.find((el) => el.attributes["aria-label"] === "Orchid Glow Theme");
    assert.ok(orchidBtn, "Orchid theme button must be rendered in AppHeaderBar");
    assert.ok(orchidBtn.className.includes("is-active"), "Orchid button should be active initially");
    const violetBtn = container.find((el) => el.attributes["aria-label"] === "Royal Violet Theme");
    assert.ok(violetBtn, "Violet theme button must exist in AppHeaderBar");
    act(() => {
      violetBtn.click();
    });
    assert.equal(contextValue.accent, "violet", "Context theme should update to Violet after click event");
    assert.equal(rootWrapper.attributes["data-accent"], "violet", "Provider root data-accent must update to violet");
    assert.ok(violetBtn.className.includes("is-active"), "Violet button must be active");
    assert.ok(!orchidBtn.className.includes("is-active"), "Orchid button must not be active");
    act(() => {
      triggerUnrelatedUpdate();
    });
    assert.equal(contextValue.accent, "violet", "Theme should remain Violet after unrelated component re-render");
    assert.equal(rootWrapper.attributes["data-accent"], "violet", "Provider root data-accent should remain violet");
    const indigoBtn = container.find((el) => el.attributes["aria-label"] === "Electric Indigo Theme");
    assert.ok(indigoBtn, "Indigo theme button must exist in AppHeaderBar");
    act(() => {
      indigoBtn.click();
    });
    assert.equal(contextValue.accent, "indigo", "Context theme should update to Indigo after click event");
    assert.equal(mockDoc.documentElement.getAttribute("data-accent"), "indigo", "Document data-accent should update to indigo");
    assert.equal(rootWrapper.attributes["data-accent"], "indigo", "Provider root data-accent must update to indigo");
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
