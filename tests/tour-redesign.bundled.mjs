// tests/tour-redesign.unit.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import React28, { act } from "react";
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

// apps/360tour/src/components/TourInspector.jsx
import React25 from "react";
var TourInspector = ({
  isOpen = true,
  onClose,
  tourData,
  currentScene,
  currentSceneId,
  onSelectScene,
  activeTab = "scenes",
  onTabChange,
  isMuted = true,
  onToggleMute,
  isAutoRotate = false,
  onToggleAutoRotate,
  className = ""
}) => {
  const scenes = tourData?.scenes || [];
  const hotspots = currentScene?.hotspots || [];
  const shapes = currentScene?.shapes || [];
  const audioPoints = currentScene?.audio_points || [];
  const tabs = [
    { id: "scenes", label: `Scenes (${scenes.length})` },
    { id: "hotspots", label: `Hotspots (${hotspots.length})` },
    { id: "shapes", label: `Media (${shapes.length})` },
    { id: "audio", label: "Audio" },
    { id: "settings", label: "Settings" }
  ];
  return /* @__PURE__ */ React25.createElement(
    GlassInspectorDrawer,
    {
      title: "360\xB0 Tour Explorer",
      subtitle: tourData?.title || "Virtual Tour Experience",
      isOpen,
      onClose,
      tabs,
      activeTab,
      onTabChange,
      side: "right",
      width: 360,
      className: `vs-tour-inspector ${className}`.trim(),
      footer: /* @__PURE__ */ React25.createElement("div", { style: { display: "flex", gap: "8px", width: "100%" } }, /* @__PURE__ */ React25.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-secondary",
          style: { flex: 1, padding: "8px 12px", fontSize: "0.8rem" },
          onClick: onToggleMute
        },
        isMuted ? "\u{1F50A} Unmute Tour" : "\u{1F507} Mute Sound"
      ), /* @__PURE__ */ React25.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-secondary",
          style: { flex: 1, padding: "8px 12px", fontSize: "0.8rem" },
          onClick: onToggleAutoRotate
        },
        isAutoRotate ? "\u23F9 Stop Rotate" : "\u{1F504} Auto-Rotate"
      ))
    },
    /* @__PURE__ */ React25.createElement("div", { className: "vs-tour-inspector-body", style: { display: "flex", flexDirection: "column", gap: "12px" } }, activeTab === "scenes" && /* @__PURE__ */ React25.createElement("div", { className: "vs-tour-scenes-list", style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Tour Locations (", scenes.length, ")"), scenes.map((scene) => {
      const isActive = scene.id === currentSceneId;
      return /* @__PURE__ */ React25.createElement(
        "div",
        {
          key: scene.id,
          onClick: () => onSelectScene && onSelectScene(scene),
          role: "button",
          tabIndex: 0,
          className: `vs-tour-scene-card ${isActive ? "is-active" : ""}`,
          style: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "12px",
            background: isActive ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.45)",
            border: isActive ? "1px solid var(--vs-primary)" : "1px solid rgba(255, 255, 255, 0.65)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }
        },
        /* @__PURE__ */ React25.createElement(
          "div",
          {
            style: {
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0
            }
          },
          "\u{1F4CD}"
        ),
        /* @__PURE__ */ React25.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, scene.name), /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.7rem", color: "var(--vs-ink-muted)" } }, (scene.hotspots || []).length, " hotspots \u2022 ", (scene.shapes || []).length, " shapes")),
        isActive && /* @__PURE__ */ React25.createElement("span", { style: { fontSize: "0.7rem", fontWeight: 700, color: "var(--vs-primary)", textTransform: "uppercase" } }, "Current")
      );
    })), activeTab === "hotspots" && /* @__PURE__ */ React25.createElement("div", { className: "vs-tour-hotspots-list", style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Interactive Hotspots in ", currentScene?.name || "Scene"), hotspots.length === 0 ? /* @__PURE__ */ React25.createElement("div", { style: { padding: "24px", textAlign: "center", color: "var(--vs-ink-muted)", fontSize: "0.8rem" } }, "No transition hotspots in this scene.") : hotspots.map((hs, idx) => {
      const targetScene = scenes.find((s) => s.id === hs.targetSceneId);
      return /* @__PURE__ */ React25.createElement(
        "div",
        {
          key: hs.id || idx,
          onClick: () => targetScene && onSelectScene && onSelectScene(targetScene),
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.65)",
            cursor: targetScene ? "pointer" : "default"
          }
        },
        /* @__PURE__ */ React25.createElement("div", null, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, hs.label || `Hotspot #${idx + 1}`), /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.7rem", color: "var(--vs-ink-muted)" } }, "Target: ", targetScene?.name || hs.targetSceneId || "Next Scene")),
        targetScene && /* @__PURE__ */ React25.createElement("span", { style: { fontSize: "0.8rem", color: "var(--vs-primary)" } }, "\u2794")
      );
    })), activeTab === "shapes" && /* @__PURE__ */ React25.createElement("div", { className: "vs-tour-shapes-list", style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Media Shapes & Embedded Elements"), shapes.length === 0 ? /* @__PURE__ */ React25.createElement("div", { style: { padding: "24px", textAlign: "center", color: "var(--vs-ink-muted)", fontSize: "0.8rem" } }, "No polygonal media shapes attached to this scene.") : shapes.map((sh, idx) => /* @__PURE__ */ React25.createElement(
      "div",
      {
        key: sh.id || idx,
        style: {
          padding: "10px 12px",
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.65)"
        }
      },
      /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, sh.name || `Shape #${idx + 1}`),
      /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.7rem", color: "var(--vs-ink-muted)" } }, "Action: ", sh.actionType || "show_image", " \u2022 Type: ", sh.type || "polygon")
    ))), activeTab === "audio" && /* @__PURE__ */ React25.createElement("div", { className: "vs-tour-audio-list", style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Spatial Audio Sources"), /* @__PURE__ */ React25.createElement(
      "div",
      {
        style: {
          padding: "12px",
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }
      },
      /* @__PURE__ */ React25.createElement("div", null, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, "Audio Playback"), /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.7rem", color: "var(--vs-ink-muted)" } }, isMuted ? "Muted" : "Playing spatial & ambient track")),
      /* @__PURE__ */ React25.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-sm vs-btn-secondary",
          onClick: onToggleMute
        },
        isMuted ? "Unmute" : "Mute"
      )
    ), /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.75rem", color: "var(--vs-ink-muted)", marginTop: "4px" } }, "Audio points in current scene: ", audioPoints.length)), activeTab === "settings" && /* @__PURE__ */ React25.createElement("div", { className: "vs-tour-settings-view", style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" } }, "Viewer Configuration"), /* @__PURE__ */ React25.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px",
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.65)"
        }
      },
      /* @__PURE__ */ React25.createElement("div", null, /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" } }, "Auto-Rotate"), /* @__PURE__ */ React25.createElement("div", { style: { fontSize: "0.7rem", color: "var(--vs-ink-muted)" } }, "Continuous 360\xB0 rotation")),
      /* @__PURE__ */ React25.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-sm vs-btn-secondary",
          onClick: onToggleAutoRotate
        },
        isAutoRotate ? "Stop" : "Start"
      )
    )))
  );
};

// apps/360tour/src/components/MediaModal.jsx
import React26, { useState as useState32, useEffect as useEffect12 } from "react";

// apps/360tour/src/hooks/useLocalImage.js
import { useState as useState31, useEffect as useEffect11 } from "react";

// node_modules/.pnpm/@trikomi+core@file+npm-stag_48859c1c0f3bee177b063d984dc69dbd/node_modules/@trikomi/core/dist/tour/index.js
function K(t) {
  return new Promise((e, n) => {
    t.oncomplete = t.onsuccess = () => e(t.result), t.onabort = t.onerror = () => n(t.error);
  });
}
function Re(t, e) {
  let n, r = () => {
    if (n) return n;
    let a = indexedDB.open(t);
    return a.onupgradeneeded = () => a.result.createObjectStore(e), n = K(a), n.then((s) => {
      s.onclose = () => n = void 0;
    }, () => {
      n = void 0;
    }), n;
  };
  return (a, s) => r().then((o) => s(o.transaction(e, a).objectStore(e)));
}
var oe;
function z() {
  return oe || (oe = Re("keyval-store", "keyval")), oe;
}
function se(t, e = z()) {
  return e("readonly", (n) => K(n.get(t)));
}
function Q(t, e, n = z()) {
  return n("readwrite", (r) => (r.put(e, t), K(r.transaction)));
}
function pe(t, e = z()) {
  return e("readwrite", (n) => (n.delete(t), K(n.transaction)));
}
function be(t, e) {
  return t.openCursor().onsuccess = function() {
    this.result && (e(this.result), this.result.continue());
  }, K(t.transaction);
}
function ye(t = z()) {
  return t("readonly", (e) => {
    if (e.getAllKeys) return K(e.getAllKeys());
    let n = [];
    return be(e, (r) => n.push(r.key)).then(() => n);
  });
}
async function Me(t, e) {
  let n = {};
  return e && (n.mode = "readwrite"), !t.queryPermission || await t.queryPermission(n) === "granted" || await t.requestPermission(n) === "granted";
}
async function F(t) {
  let e = await se(`tour_handle_${t}`);
  if (!e) throw new Error("Tour directory not found or permission lost.");
  if (!await Me(e, true)) throw new Error("Permission denied to access tour directory.");
  return e;
}
async function $(t) {
  try {
    let r = await (await (await t.getFileHandle("tour.json")).getFile()).text();
    return JSON.parse(r);
  } catch (e) {
    if (e.name === "NotFoundError") return null;
    throw e;
  }
}
async function Z(t, e) {
  let r = await (await t.getFileHandle("tour.json", { create: true })).createWritable();
  await r.write(JSON.stringify(e, null, 2)), await r.close();
}
async function Je() {
  let e = (await ye()).filter((r) => r.startsWith("tour_handle_")), n = [];
  for (let r of e) try {
    let a = await se(r);
    if (!a) continue;
    let s = true;
    if (a.queryPermission && (s = await a.queryPermission({ mode: "read" }) === "granted"), s) {
      let o = await $(a);
      o && n.push(o);
    } else n.push({ id: r.replace("tour_handle_", ""), title: a.name || "Local Tour", needsPermission: true, status: "locked" });
  } catch (a) {
    console.warn("Could not read tour handle", r, a);
  }
  return n;
}
async function Ve() {
  if (!window.showDirectoryPicker) throw new Error("Opening a folder from your OS is not supported by your browser...");
  let t = await window.showDirectoryPicker({ mode: "readwrite" }), e = await $(t);
  if (!e) throw new Error("Selected folder does not contain a tour.json file.");
  return await Q(`tour_handle_${e.id}`, t), e;
}
async function qe(t) {
  let e = window.crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36), n;
  if (window.showDirectoryPicker) n = await window.showDirectoryPicker({ mode: "readwrite" });
  else if (navigator.storage && navigator.storage.getDirectory) n = await (await navigator.storage.getDirectory()).getDirectoryHandle(e, { create: true });
  else throw new Error("File System Access API and OPFS are not supported. Are you running on HTTPS or localhost?");
  if (await $(n)) throw new Error("Selected folder already contains a tour. Please select an empty folder.");
  let a = { id: e, title: t, description: "", status: "draft", updated_at: (/* @__PURE__ */ new Date()).toISOString(), scenes: [], settings: { autoplay: false, autoplay_speed: 1, show_minimap: false } };
  return await n.getDirectoryHandle("images", { create: true }), await Z(n, a), await Q(`tour_handle_${e}`, n), a;
}
async function je(t) {
  await pe(`tour_handle_${t}`);
}
async function Ke(t, e) {
  let n = await F(t);
  if (!n) throw new Error("Source tour handle not found");
  let r = await $(n);
  if (!r) throw new Error("Source tour data not found");
  let a = window.crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36), s;
  if (navigator.storage && navigator.storage.getDirectory) s = await navigator.storage.getDirectory();
  else throw new Error("OPFS is not supported in this browser, cannot duplicate tour.");
  let o = await s.getDirectoryHandle(a, { create: true }), l = JSON.parse(JSON.stringify(r));
  l.id = a, l.title = e, l.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  let i = await n.getDirectoryHandle("images", { create: false }).catch(() => null), c = await o.getDirectoryHandle("images", { create: true });
  if (i) {
    for await (let [y, p] of i.entries()) if (p.kind === "file") {
      let m = await p.getFile(), w = await (await c.getFileHandle(y, { create: true })).createWritable();
      await w.write(m), await w.close();
    }
  }
  return await Z(o, l), await Q(`tour_handle_${a}`, o), l;
}
async function ze(t, e) {
  let r = await (await F(t)).getDirectoryHandle("images", { create: true }), a = e.name.split(".").pop() || "jpg", o = (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36)) + "." + a, i = await (await r.getFileHandle(o, { create: true })).createWritable();
  return await i.write(e), await i.close(), `images/${o}`;
}
async function he(t, e) {
  try {
    await (await (await F(t)).getDirectoryHandle("images", { create: false })).removeEntry(e);
  } catch (n) {
    console.warn(`Failed to delete media file ${e}:`, n);
  }
}
async function Qe(t, e) {
  if (!e) return e;
  if (window.__STANDALONE__) return e.startsWith("images/") ? "./" + e : e;
  if (!e.startsWith("images/")) return e;
  let n = e.split("/")[1];
  try {
    let o = await (await (await (await F(t)).getDirectoryHandle("images")).getFileHandle(n)).getFile();
    return URL.createObjectURL(o);
  } catch (r) {
    return console.warn(`Could not load local image ${e}`, r), null;
  }
}
async function ge(t) {
  try {
    let n = await (await F(t)).getDirectoryHandle("images"), r = [];
    for await (let [a, s] of n.entries()) if (s.kind === "file") {
      let o = await s.getFile();
      r.push({ id: a, url: `images/${a}`, original_name: a, path: `images/${a}`, size: o.size });
    }
    return r;
  } catch (e) {
    return console.warn("Could not list local images", e), [];
  }
}
var rt = () => window.crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
async function at(t, e) {
  let n = await F(t), r = await $(n) || { id: t, scenes: [] }, a = e(r);
  return await Z(n, a), a;
}
async function it(t) {
  let e = await F(t), n = await $(e);
  if (!n) return { success: false };
  let r = /* @__PURE__ */ new Set();
  if (n.scenes) for (let s of n.scenes) {
    if (s.panorama && r.add(s.panorama.replace("images/", "")), s.thumbnail && r.add(s.thumbnail.replace("images/", "")), s.hotspots) for (let o of s.hotspots) o.thumbnail && r.add(o.thumbnail.replace("images/", ""));
    if (s.shapes) {
      for (let o of s.shapes) if (o.media_files) for (let l of o.media_files) l.id && r.add(l.id.replace("images/", ""));
    }
    if (s.audio_points) for (let o of s.audio_points) o.audio_url && r.add(o.audio_url.replace("images/", "")), o.url && r.add(o.url.replace("images/", ""));
  }
  let a = await ge(t);
  for (let s of a) r.has(s.id) || await he(t, s.id);
  return { success: true };
}

// apps/360tour/src/hooks/useLocalImage.js
function useLocalImage(tourId, relativePath) {
  const [objectUrl, setObjectUrl] = useState31(null);
  useEffect11(() => {
    if (!relativePath) {
      setObjectUrl(null);
      return;
    }
    if (relativePath.startsWith("blob:") || relativePath.startsWith("data:") || relativePath.startsWith("http")) {
      setObjectUrl(relativePath);
      return;
    }
    let url = null;
    let isMounted = true;
    if (window.__STANDALONE__) {
      const parts = relativePath.split("/");
      const fileName = parts[parts.length - 1];
      url = `./images/${fileName}`;
      setObjectUrl(url);
    } else {
      Qe(tourId, relativePath).then((resolvedUrl) => {
        console.log("Resolved local image:", relativePath, "to", resolvedUrl);
        if (isMounted && resolvedUrl) {
          url = resolvedUrl;
          setObjectUrl(url);
        }
      }).catch((err) => {
        console.warn("Failed to load local image", relativePath, err);
      });
    }
    return () => {
      isMounted = false;
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    };
  }, [tourId, relativePath]);
  return objectUrl;
}

// apps/360tour/src/components/MediaModal.jsx
var LocalImagePreview = ({ tourId, url, alt, className }) => {
  const localUrl = useLocalImage(tourId, url);
  return localUrl ? /* @__PURE__ */ React26.createElement("img", { src: localUrl, alt, className }) : /* @__PURE__ */ React26.createElement("div", { className: "loading-img" }, "Loading...");
};
var MediaModal = ({ isOpen, onClose, content, sourceBounds, tourId }) => {
  if (!isOpen || !content) return null;
  const renderContent = () => {
    if (content.type === "image" && content.url) {
      return /* @__PURE__ */ React26.createElement("div", { className: "media-content", style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React26.createElement(
        LocalImagePreview,
        {
          tourId,
          url: content.url,
          alt: content.title || "Shape image",
          className: "media-image"
        }
      ), content.description && /* @__PURE__ */ React26.createElement("p", { className: "media-description", style: { color: "var(--vs-ink-muted)", fontSize: "0.9rem", lineHeight: "1.5" } }, content.description));
    }
    if (content.type === "url" && content.url) {
      return /* @__PURE__ */ React26.createElement("div", { className: "media-content", style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React26.createElement("p", { className: "media-description", style: { color: "var(--vs-ink-muted)" } }, "Click below to navigate to the external link:"), /* @__PURE__ */ React26.createElement(
        "a",
        {
          href: content.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "media-link vs-btn vs-btn-primary",
          style: { display: "inline-flex", alignItems: "center", gap: "8px", wordBreak: "break-all" },
          onClick: onClose
        },
        "Open ",
        content.url,
        " \u2197"
      ), content.description && /* @__PURE__ */ React26.createElement("p", { className: "media-description", style: { color: "var(--vs-ink-muted)", fontSize: "0.85rem" } }, content.description));
    }
    if (content.type === "info" && content.content) {
      return /* @__PURE__ */ React26.createElement("div", { className: "media-content", style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React26.createElement("p", { className: "media-description", style: { color: "var(--vs-ink)", fontSize: "0.95rem", lineHeight: "1.6" } }, content.content));
    }
    return /* @__PURE__ */ React26.createElement("p", { style: { color: "var(--vs-ink-muted)" } }, "No content available");
  };
  return /* @__PURE__ */ React26.createElement(
    FrostedModalDialog,
    {
      isOpen,
      onClose,
      title: content.title || "Interactive Media",
      subtitle: content.type ? `Media Type: ${content.type.toUpperCase()}` : "Tour Hotspot",
      size: "lg",
      className: "vs-media-modal-dialog"
    },
    renderContent()
  );
};
var MediaModal_default = MediaModal;

// apps/360tour/src/components/FloorPlanModal.jsx
import React27, { useState as useState34, useRef as useRef13, useEffect as useEffect14 } from "react";

// apps/360tour/src/api/dashboardApi.js
var tourApi = {
  getTours: async () => Je(),
  getDashboard: async () => Je(),
  getTour: async (id) => $(await F(id)),
  createTour: async (data) => qe(data.title),
  updateTour: async (id, data) => at(id, (t) => ({ ...t, ...data })),
  deleteTour: async (id) => je(id),
  duplicateTour: async (id) => {
    const tour = await $(await F(id));
    const newTitle = tour ? `${tour.title} (Copy)` : "Copy of Tour";
    return await Ke(id, newTitle);
  },
  exportTour: async (_id) => {
    throw new Error("Export not supported in local mode");
  },
  updateSettings: async (id, settings) => at(id, (t) => ({ ...t, settings })),
  // Special helper to open existing from user OS
  openExisting: async () => Ve()
};
var sceneApi = {
  getScenes: async (tourId) => (await tourApi.getTour(tourId)).scenes || [],
  createScene: async (tourId, data) => {
    let newScene = null;
    await at(tourId, (t) => {
      newScene = { id: rt(), hotspots: [], shapes: [], ...data };
      t.scenes = t.scenes || [];
      t.scenes.push(newScene);
      return t;
    });
    return newScene;
  },
  updateScene: async (tourId, sceneId, data) => {
    let updatedScene = null;
    await at(tourId, (t) => {
      t.scenes = t.scenes.map((s) => {
        if (s.id === sceneId) {
          updatedScene = { ...s, ...data };
          return updatedScene;
        }
        return s;
      });
      return t;
    });
    return updatedScene;
  },
  deleteScene: async (tourId, sceneId) => {
    await at(tourId, (t) => {
      t.scenes = t.scenes.filter((s) => s.id !== sceneId);
      return t;
    });
    uploadApi.cleanOrphanedMedia(tourId).catch(console.error);
  },
  reorderScenes: async (tourId, scenes) => {
    await at(tourId, (t) => {
      t.scenes = scenes;
      return t;
    });
    return { success: true };
  },
  setDefaultScene: async (tourId, sceneId) => {
    await at(tourId, (t) => {
      t.settings = t.settings || {};
      t.settings.default_scene_id = sceneId;
      return t;
    });
    return { success: true };
  }
};
var uploadApi = {
  uploadPanorama: async (tourId, file, sceneId = null) => {
    const path = await ze(tourId, file);
    if (sceneId) {
      await sceneApi.updateScene(tourId, sceneId, { panorama: path, thumbnail: path });
    }
    return { url: path, thumbnail_url: path, path };
  },
  uploadAsset: async (tourId, file) => {
    const path = await ze(tourId, file);
    return path;
  },
  uploadShapeImage: async (tourId, file) => {
    const path = await ze(tourId, file);
    return { url: path };
  },
  uploadInfoImage: async (tourId, file) => {
    const path = await ze(tourId, file);
    return { url: path };
  },
  getShapeImages: async (tourId) => {
    return await ge(tourId);
  },
  listMedia: async (tourId, _type = null) => {
    return [];
  },
  deleteMedia: async (tourId, mediaId) => {
    const fileName = mediaId.startsWith("images/") ? mediaId.substring(7) : mediaId;
    await he(tourId, fileName);
    return { success: true };
  },
  cleanOrphanedMedia: async (tourId) => {
    return it(tourId);
  }
};

// apps/360tour/src/components/ImageSelectDialog.jsx
import { useState as useState33, useEffect as useEffect13 } from "react";
var LocalImagePreview2 = ({ tourId, url, alt }) => {
  const localUrl = useLocalImage(tourId, url);
  if (!localUrl) return /* @__PURE__ */ React.createElement("div", { className: "loading-img" }, "Loading...");
  if (url.endsWith(".mp4") || url.endsWith(".webm")) {
    return /* @__PURE__ */ React.createElement("video", { src: localUrl, muted: true, loop: true, autoPlay: true, playsInline: true, style: { maxWidth: "100%", maxHeight: "100px" } });
  }
  if (url.endsWith(".mp3") || url.endsWith(".wav")) {
    return /* @__PURE__ */ React.createElement("audio", { src: localUrl, controls: true, style: { maxWidth: "100%" } });
  }
  return /* @__PURE__ */ React.createElement("img", { src: localUrl, alt });
};
var ImageSelectDialog = ({ isOpen, onClose, tourId, onImageSelect }) => {
  const [images, setImages] = useState33([]);
  const [loading, setLoading] = useState33(false);
  const [uploading, setUploading] = useState33(false);
  const [error, setError] = useState33(null);
  useEffect13(() => {
    if (isOpen && tourId) {
      loadImages();
    }
  }, [isOpen, tourId]);
  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await uploadApi.getShapeImages(tourId);
      setImages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadApi.uploadInfoImage(tourId, file);
      await loadImages();
      e.target.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "image-dialog-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "image-dialog-container", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "image-dialog-header" }, /* @__PURE__ */ React.createElement("h3", null, "Select or Upload Media"), /* @__PURE__ */ React.createElement("button", { className: "image-dialog-close", onClick: onClose }, "\xD7")), /* @__PURE__ */ React.createElement("div", { className: "image-dialog-content" }, /* @__PURE__ */ React.createElement("label", { className: "upload-btn" }, uploading ? "Uploading..." : "Upload New Media", /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: "image/*,video/mp4,audio/mp3,audio/wav",
      onChange: handleUpload,
      disabled: uploading,
      style: { display: "none" }
    }
  )), error && /* @__PURE__ */ React.createElement("div", { className: "error-message" }, error), loading ? /* @__PURE__ */ React.createElement("div", { className: "loading" }, "Loading images...") : images.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, /* @__PURE__ */ React.createElement("p", null, "No images uploaded yet"), /* @__PURE__ */ React.createElement("p", { className: "hint" }, "Upload an image to get started")) : /* @__PURE__ */ React.createElement("div", { className: "image-grid" }, images.map((image) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: image.id,
      className: "image-card",
      onClick: () => onImageSelect(image)
    },
    /* @__PURE__ */ React.createElement("div", { className: "image-preview" }, /* @__PURE__ */ React.createElement(LocalImagePreview2, { tourId, url: image.url, alt: image.original_name })),
    /* @__PURE__ */ React.createElement("div", { className: "image-info" }, /* @__PURE__ */ React.createElement("p", { className: "image-name" }, image.original_name), image.dimensions && /* @__PURE__ */ React.createElement("span", { className: "image-dimensions" }, image.dimensions.width, " \xD7 ", image.dimensions.height))
  ))))));
};
var ImageSelectDialog_default = ImageSelectDialog;

// apps/360tour/src/components/FloorPlanModal.jsx
var FloorPlanModal = ({
  isOpen,
  onClose,
  tourId,
  tourSettings,
  onUpdateSettings,
  scenes,
  onUpdateScene
}) => {
  const [_uploading, setUploading] = useState34(false);
  const [activeToolSceneId, setActiveToolSceneId] = useState34(null);
  const [galleryOpen, setGalleryOpen] = useState34(false);
  const imageRef = useRef13(null);
  useEffect14(() => {
    if (isOpen && scenes && scenes.length > 0 && !activeToolSceneId) {
      setActiveToolSceneId(scenes[0].id);
    }
  }, [isOpen, scenes]);
  const floorPlan = tourSettings?.floorPlan || { enabled: false, image: "" };
  const localImageUrl = useLocalImage(tourId, floorPlan.image);
  if (!isOpen) return null;
  const handleToggle = async () => {
    await onUpdateSettings({
      ...tourSettings,
      floorPlan: { ...floorPlan, enabled: !floorPlan.enabled }
    });
  };
  const _handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadApi.uploadInfoImage(tourId, file);
      await onUpdateSettings({
        ...tourSettings,
        floorPlan: { ...floorPlan, image: result.url }
      });
    } catch (err) {
      console.error("Failed to upload floor plan image:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  const handleImageClick = async (e) => {
    if (!imageRef.current || !activeToolSceneId) return;
    const rect = imageRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width * 100;
    const yPct = (e.clientY - rect.top) / rect.height * 100;
    await onUpdateScene(activeToolSceneId, { floorPlanPosition: { x: xPct, y: yPct } });
  };
  const handleClearPosition = async (sceneId) => {
    await onUpdateScene(sceneId, { floorPlanPosition: null });
  };
  return /* @__PURE__ */ React27.createElement(React27.Fragment, null, /* @__PURE__ */ React27.createElement(
    FrostedModalDialog,
    {
      isOpen,
      onClose,
      title: "\u{1F5FA}\uFE0F Floor Plan Manager",
      subtitle: "Place scene navigation dots on your 2D architectural map",
      size: "xl",
      className: "vs-floorplan-modal-dialog",
      footer: /* @__PURE__ */ React27.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" } }, /* @__PURE__ */ React27.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React27.createElement("span", { style: { fontSize: "0.8rem", color: "var(--vs-ink-muted)", fontWeight: 600 } }, "Enable In Viewer:"), /* @__PURE__ */ React27.createElement(
        "button",
        {
          type: "button",
          className: `vs-btn vs-btn-sm ${floorPlan.enabled ? "vs-btn-primary" : "vs-btn-secondary"}`,
          onClick: handleToggle
        },
        floorPlan.enabled ? "Minimap Enabled" : "Minimap Disabled"
      )), /* @__PURE__ */ React27.createElement(
        "button",
        {
          type: "button",
          className: "vs-btn vs-btn-secondary",
          onClick: onClose
        },
        "Done"
      ))
    },
    /* @__PURE__ */ React27.createElement("div", { className: "floorplan-editor", style: { display: "flex", gap: "16px", minHeight: "480px" } }, /* @__PURE__ */ React27.createElement("div", { className: "floorplan-scene-list", style: { width: "260px", display: "flex", flexDirection: "column", gap: "10px" } }, /* @__PURE__ */ React27.createElement("div", { className: "floorplan-scene-list-header" }, /* @__PURE__ */ React27.createElement(
      "button",
      {
        type: "button",
        onClick: () => setGalleryOpen(true),
        className: "vs-btn vs-btn-primary vs-btn-sm",
        style: { width: "100%" }
      },
      "Select / Upload Map"
    )), /* @__PURE__ */ React27.createElement("div", { className: "floorplan-scene-list-help", style: { fontSize: "0.75rem", color: "var(--vs-ink-muted)", padding: "6px 0" } }, "1. Select a scene below.", /* @__PURE__ */ React27.createElement("br", null), "2. Click on the map to place it."), /* @__PURE__ */ React27.createElement("div", { className: "floorplan-scene-list-items", style: { display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "360px" } }, scenes.map((scene, idx) => {
      const isSelected = activeToolSceneId === scene.id;
      const isPlaced = !!scene.floorPlanPosition;
      return /* @__PURE__ */ React27.createElement(
        "div",
        {
          key: scene.id,
          onClick: () => setActiveToolSceneId(scene.id),
          className: `fp-scene-item${isSelected ? " active" : ""}`,
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderRadius: "8px",
            background: isSelected ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.45)",
            border: isSelected ? "1px solid var(--vs-primary)" : "1px solid rgba(255, 255, 255, 0.65)",
            cursor: "pointer"
          }
        },
        /* @__PURE__ */ React27.createElement("div", { className: "fp-scene-left", style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React27.createElement("div", { className: `fp-dot ${isPlaced ? "placed" : "unplaced"}`, title: isPlaced ? "Placed" : "Not Placed" }), /* @__PURE__ */ React27.createElement("span", { className: "fp-scene-name", style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--vs-ink)" } }, idx + 1, ". ", scene.name)),
        isPlaced && /* @__PURE__ */ React27.createElement(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              handleClearPosition(scene.id);
            },
            className: "fp-clear-btn",
            title: "Clear Position",
            style: { border: "none", background: "transparent", cursor: "pointer", color: "var(--vs-crimson)" }
          },
          "\u2715"
        )
      );
    }))), /* @__PURE__ */ React27.createElement("div", { className: "floorplan-canvas", style: { flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 0, 0, 0.05)", borderRadius: "12px", overflow: "hidden" } }, !floorPlan.image ? /* @__PURE__ */ React27.createElement("div", { className: "floorplan-empty", style: { textAlign: "center", padding: "32px" } }, /* @__PURE__ */ React27.createElement("div", { className: "floorplan-empty-icon", style: { fontSize: "2rem" } }, "\u{1F5FA}\uFE0F"), /* @__PURE__ */ React27.createElement("p", { style: { margin: "8px 0 4px", fontWeight: 600 } }, "No floor plan image uploaded."), /* @__PURE__ */ React27.createElement("p", { style: { fontSize: "0.75rem", color: "var(--vs-ink-muted)" } }, "Upload an image from the sidebar to begin mapping scenes.")) : !localImageUrl ? /* @__PURE__ */ React27.createElement("div", { style: { color: "var(--vs-ink-muted)" } }, "Loading map image\u2026") : /* @__PURE__ */ React27.createElement("div", { className: "floorplan-canvas-image", style: { position: "relative", maxWidth: "100%", maxHeight: "100%" } }, /* @__PURE__ */ React27.createElement(
      "img",
      {
        ref: imageRef,
        src: localImageUrl,
        alt: "Floor Plan",
        onClick: handleImageClick,
        draggable: false,
        style: { display: "block", maxWidth: "100%", maxHeight: "440px", objectFit: "contain", cursor: "crosshair" }
      }
    ), scenes.map((scene) => {
      if (!scene.floorPlanPosition) return null;
      const isSelected = scene.id === activeToolSceneId;
      return /* @__PURE__ */ React27.createElement(
        "div",
        {
          key: scene.id,
          onClick: (e) => {
            e.stopPropagation();
            setActiveToolSceneId(scene.id);
          },
          className: `floorplan-marker${isSelected ? " selected" : ""}`,
          style: {
            position: "absolute",
            left: `${scene.floorPlanPosition.x}%`,
            top: `${scene.floorPlanPosition.y}%`,
            transform: "translate(-50%, -50%)",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: isSelected ? "var(--vs-primary)" : "#10B981",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            cursor: "pointer"
          },
          title: scene.name
        },
        scenes.indexOf(scene) + 1
      );
    }))))
  ), /* @__PURE__ */ React27.createElement(
    ImageSelectDialog_default,
    {
      isOpen: galleryOpen,
      onClose: () => setGalleryOpen(false),
      tourId,
      onImageSelect: async (image) => {
        await onUpdateSettings({
          ...tourSettings,
          floorPlan: { ...floorPlan, image: image.url }
        });
        setGalleryOpen(false);
      }
    }
  ));
};
var FloorPlanModal_default = FloorPlanModal;

// tests/tour-redesign.unit.test.mjs
var mockTourData = {
  id: "tour-101",
  title: "Penthouse Panorama Luxury Tour",
  settings: {
    autoRotate: true,
    autoRotateSpeed: 0.5,
    global_audio_url: "audio/ambient-lounge.mp3",
    floorPlan: { enabled: true, image: "maps/floorplan.png" }
  },
  scenes: [
    {
      id: "scene-1",
      name: "Grand Foyer",
      panorama: "panos/foyer.jpg",
      floorPlanPosition: { x: 25, y: 30 },
      hotspots: [
        { id: "hs-1", label: "Walk to Living Room", targetSceneId: "scene-2", targetYaw: 180 },
        { id: "hs-2", label: "Terrace Entrance", targetSceneId: "scene-3", targetYaw: 90 }
      ],
      shapes: [
        { id: "sh-1", name: "Marble Chandelier", actionType: "show_image", media: { url: "img/chandelier.jpg", title: "Italian Marble Chandelier" } },
        { id: "sh-2", name: "Architectural Spec Sheet", actionType: "open_url", url: "https://trikomi.com/specs" }
      ],
      audio_points: [
        { id: "ap-1", name: "Foyer Fountain Sound", url: "audio/water.mp3", position: [0, 0, 5], distance: 10 }
      ]
    },
    {
      id: "scene-2",
      name: "Panoramic Living Room",
      panorama: "panos/living.jpg",
      floorPlanPosition: { x: 50, y: 45 },
      hotspots: [
        { id: "hs-3", label: "Return to Foyer", targetSceneId: "scene-1", targetYaw: 0 }
      ],
      shapes: [],
      audio_points: []
    },
    {
      id: "scene-3",
      name: "Skyline Terrace",
      panorama: "panos/terrace.jpg",
      floorPlanPosition: { x: 80, y: 70 },
      hotspots: [],
      shapes: [],
      audio_points: []
    }
  ]
};
test("TourInspector renders GlassInspectorDrawer with all 5 tabs and title", () => {
  const html = renderToStaticMarkup(
    React28.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {
      },
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: "scene-1",
      onSelectScene: () => {
      },
      activeTab: "scenes",
      onTabChange: () => {
      },
      isMuted: false,
      onToggleMute: () => {
      },
      isAutoRotate: true,
      onToggleAutoRotate: () => {
      }
    })
  );
  assert.ok(html.includes("vs-glass-inspector-drawer"), "Should render drawer container");
  assert.ok(html.includes("360\xB0 Tour Explorer"), "Should render drawer title");
  assert.ok(html.includes("Penthouse Panorama Luxury Tour"), "Should render drawer subtitle");
  assert.ok(html.includes("Scenes (3)"), "Should render Scenes tab with scene count");
  assert.ok(html.includes("Hotspots (2)"), "Should render Hotspots tab with count");
  assert.ok(html.includes("Media (2)"), "Should render Media tab with count");
  assert.ok(html.includes("Audio"), "Should render Audio tab");
  assert.ok(html.includes("Settings"), "Should render Settings tab");
  assert.ok(html.includes("Mute Sound"), "Should render mute sound footer button");
  assert.ok(html.includes("Stop Rotate"), "Should render stop rotate footer button");
});
test("TourInspector renders Scenes list with current active scene badge", () => {
  const html = renderToStaticMarkup(
    React28.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {
      },
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: "scene-1",
      onSelectScene: () => {
      },
      activeTab: "scenes",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("Tour Locations (3)"), "Should render locations header");
  assert.ok(html.includes("Grand Foyer"), "Should render first scene title");
  assert.ok(html.includes("Panoramic Living Room"), "Should render second scene title");
  assert.ok(html.includes("Skyline Terrace"), "Should render third scene title");
  assert.ok(html.includes("Current"), "Should render Current badge for active scene");
  assert.ok(html.includes("2 hotspots \u2022 2 shapes"), "Should render hotspots and shapes count for active scene");
});
test('TourInspector renders Hotspots panel when activeTab="hotspots"', () => {
  const html = renderToStaticMarkup(
    React28.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {
      },
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: "scene-1",
      onSelectScene: () => {
      },
      activeTab: "hotspots",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("Interactive Hotspots in Grand Foyer"), "Should render hotspots header");
  assert.ok(html.includes("Walk to Living Room"), "Should render first hotspot label");
  assert.ok(html.includes("Target: Panoramic Living Room"), "Should display target scene name");
  assert.ok(html.includes("Terrace Entrance"), "Should render second hotspot label");
  assert.ok(html.includes("Target: Skyline Terrace"), "Should display target scene name");
});
test('TourInspector renders Media panel when activeTab="shapes"', () => {
  const html = renderToStaticMarkup(
    React28.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {
      },
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: "scene-1",
      onSelectScene: () => {
      },
      activeTab: "shapes",
      onTabChange: () => {
      }
    })
  );
  assert.ok(html.includes("Media Shapes &amp; Embedded Elements") || html.includes("Media Shapes & Embedded Elements"), "Should render shapes header");
  assert.ok(html.includes("Marble Chandelier"), "Should render chandelier shape name");
  assert.ok(html.includes("Architectural Spec Sheet"), "Should render spec sheet shape name");
  assert.ok(html.includes("Action: show_image"), "Should display image action badge");
  assert.ok(html.includes("Action: open_url"), "Should display url action badge");
});
test('TourInspector renders Audio panel when activeTab="audio"', () => {
  const html = renderToStaticMarkup(
    React28.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {
      },
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: "scene-1",
      onSelectScene: () => {
      },
      activeTab: "audio",
      onTabChange: () => {
      },
      isMuted: true
    })
  );
  assert.ok(html.includes("Spatial Audio Sources"), "Should render audio section header");
  assert.ok(html.includes("Audio Playback"), "Should render playback status title");
  assert.ok(html.includes("Muted"), "Should show audio status as Muted");
  assert.ok(html.includes("Audio points in current scene: 1"), "Should display audio point count");
});
test('TourInspector renders Settings panel when activeTab="settings"', () => {
  const html = renderToStaticMarkup(
    React28.createElement(TourInspector, {
      isOpen: true,
      onClose: () => {
      },
      tourData: mockTourData,
      currentScene: mockTourData.scenes[0],
      currentSceneId: "scene-1",
      onSelectScene: () => {
      },
      activeTab: "settings",
      onTabChange: () => {
      },
      isAutoRotate: true
    })
  );
  assert.ok(html.includes("Viewer Configuration"), "Should render settings header");
  assert.ok(html.includes("Auto-Rotate"), "Should display auto-rotate control");
  assert.ok(html.includes("Continuous 360\xB0 rotation"), "Should display auto-rotation description");
  assert.ok(html.includes("Stop"), "Should display Stop button when isAutoRotate=true");
});
test("FloatingControlDock renders 5 tour control items with live badges", () => {
  const dockItems = [
    { id: "scenes", label: "Scenes", icon: "\u{1F5BC}\uFE0F", badge: 3 },
    { id: "hotspots", label: "Hotspots", icon: "\u{1F4CD}", badge: 2 },
    { id: "shapes", label: "Media", icon: "\u2728", badge: 2 },
    { id: "audio", label: "Audio", icon: "\u{1F50A}" },
    { id: "floorplan", label: "Minimap", icon: "\u{1F5FA}\uFE0F" }
  ];
  const html = renderToStaticMarkup(
    React28.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: "scenes",
      onSelect: () => {
      }
    })
  );
  assert.ok(html.includes("vs-floating-control-dock"), "Should render floating control dock");
  assert.ok(html.includes("Scenes"), "Should render Scenes dock item");
  assert.ok(html.includes("Hotspots"), "Should render Hotspots dock item");
  assert.ok(html.includes("Media"), "Should render Media dock item");
  assert.ok(html.includes("Audio"), "Should render Audio dock item");
  assert.ok(html.includes("Minimap"), "Should render Minimap dock item");
});
test("CanvasControlToolbar renders top-right viewport controls with auto-rotate and sound actions", () => {
  let recentered = false;
  const html = renderToStaticMarkup(
    React28.createElement(CanvasControlToolbar, {
      position: "top-right",
      onRecenter: () => {
        recentered = true;
      },
      extraActions: React28.createElement(
        "div",
        { className: "extra-tour-actions" },
        React28.createElement("button", { className: "auto-rotate-btn" }, "\u{1F504}"),
        React28.createElement("button", { className: "mute-btn" }, "\u{1F50A}")
      )
    })
  );
  assert.ok(html.includes("vs-canvas-control-toolbar"), "Should render canvas toolbar");
  assert.ok(html.includes("vs-canvas-control-toolbar--top-right"), "Should use top-right placement");
  assert.ok(html.includes("extra-tour-actions"), "Should render extra tour actions slot");
  assert.ok(html.includes("auto-rotate-btn"), "Should render auto rotate action");
  assert.ok(html.includes("mute-btn"), "Should render mute sound action");
});
test("MediaModal renders FrostedModalDialog with image/media content when isOpen=true", () => {
  const html = renderToStaticMarkup(
    React28.createElement(MediaModal_default, {
      isOpen: true,
      onClose: () => {
      },
      content: {
        type: "image",
        url: "img/chandelier.jpg",
        title: "Italian Marble Chandelier",
        description: "Hand-crafted Murano glass and Carrara marble fixture."
      },
      tourId: "tour-101"
    })
  );
  assert.ok(html.includes("vs-frosted-modal-backdrop"), "Should render frosted modal backdrop");
  assert.ok(html.includes("vs-frosted-modal-dialog"), "Should render frosted modal dialog");
  assert.ok(html.includes("Italian Marble Chandelier"), "Should render modal title");
  assert.ok(html.includes("Hand-crafted Murano glass and Carrara marble fixture."), "Should render media description");
  assert.ok(html.includes("Close"), "Should render modal close button");
});
test("FloorPlanModal renders FrostedModalDialog with map tools and scene list", () => {
  const html = renderToStaticMarkup(
    React28.createElement(FloorPlanModal_default, {
      isOpen: true,
      onClose: () => {
      },
      tourId: "tour-101",
      tourSettings: mockTourData.settings,
      onUpdateSettings: async () => {
      },
      scenes: mockTourData.scenes,
      onUpdateScene: async () => {
      }
    })
  );
  assert.ok(html.includes("vs-frosted-modal-backdrop"), "Should render frosted modal backdrop");
  assert.ok(html.includes("vs-frosted-modal-dialog"), "Should render frosted modal dialog");
  assert.ok(html.includes("Floor Plan Manager"), "Should render modal title");
  assert.ok(html.includes("Place scene navigation dots on your 2D architectural map"), "Should render modal subtitle");
  assert.ok(html.includes("Minimap Enabled"), "Should display minimap enable status");
  assert.ok(html.includes("Grand Foyer"), "Should list first scene");
  assert.ok(html.includes("Panoramic Living Room"), "Should list second scene");
  assert.ok(html.includes("Skyline Terrace"), "Should list third scene");
});
test("AppHeaderBar renders 360 tour branding, scene status badge, and theme switcher", () => {
  function TourHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React28.createElement(AppHeaderBar, {
      brandTitle: "TRIKOMI",
      productTitle: "360\xB0 Virtual Tour",
      backLabel: "\u2190 Back to Dashboard",
      onBack: () => {
      },
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React28.createElement("span", { className: "vs-scene-badge" }, "Grand Foyer")
    });
  }
  const html = renderToStaticMarkup(
    React28.createElement(
      VictorShellThemeProvider,
      { initialAccent: "indigo" },
      React28.createElement(TourHeaderStage)
    )
  );
  assert.ok(html.includes("TRIKOMI"), "Should render brand title");
  assert.ok(html.includes("360\xB0 Virtual Tour"), "Should render product title");
  assert.ok(html.includes("\u2190 Back to Dashboard"), "Should render back button");
  assert.ok(html.includes("Grand Foyer"), "Should render active scene status badge");
  assert.ok(html.includes('data-accent="indigo"'), 'Provider root should have initial data-accent="indigo"');
  assert.ok(html.includes("vs-theme-accent-btn--indigo is-active"), "AppHeaderBar should have active indigo theme button");
});
test("VictorShellThemeProvider persists custom theme selection across re-renders in 360 tour", () => {
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
      const [, setTick] = React28.useState(0);
      triggerUnrelatedUpdate = () => setTick((t) => t + 1);
      return React28.createElement(AppHeaderBar, {
        brandTitle: "TRIKOMI",
        productTitle: "360\xB0 Virtual Tour",
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
        React28.createElement(
          VictorShellThemeProvider,
          { initialAccent: "indigo" },
          React28.createElement(TestThemeProbe2)
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
