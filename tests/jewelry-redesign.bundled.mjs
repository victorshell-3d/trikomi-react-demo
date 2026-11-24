// tests/jewelry-redesign.unit.test.mjs
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

// apps/jewelry-configurator/src/components/JewelryInspector.tsx
import { useMemo as useMemo2 } from "react";
import { observer } from "mobx-react-lite";
import { jsx as jsx52, jsxs as jsxs43 } from "react/jsx-runtime";
var PRECIOUS_METALS = [
  { name: "Yellow Gold", alloy: "18K Yellow Gold", hex: "#d4af37", priceModifier: 650 },
  { name: "White Gold", alloy: "18K White Gold", hex: "#e2e8f0", priceModifier: 700 },
  { name: "Rose Gold", alloy: "18K Rose Gold", hex: "#b76e79", priceModifier: 680 },
  { name: "Platinum", alloy: "Platinum 950", hex: "#cbd5e1", priceModifier: 1100 }
];
var JewelryInspector = observer(({
  isOpen = true,
  onClose,
  activeTab = "rings",
  onTabChange,
  rings,
  activeRingIndex,
  onSelectRing,
  diamondThumbs,
  activeShape,
  onSelectShape,
  zRotation,
  onRotationChange,
  scale,
  onScaleChange,
  yOffset,
  onYOffsetChange,
  selectedMetal,
  onSelectMetal,
  isBloomActive = true,
  onToggleBloom,
  onResetView,
  onExportGLTF,
  className = ""
}) => {
  const currentRing = rings[activeRingIndex] || rings[0];
  const diamondCutCount = Object.keys(diamondThumbs).length;
  const tabs = [
    { id: "rings", label: `Setting (${rings.length})` },
    { id: "gemstones", label: `Diamond (${diamondCutCount || 10})` },
    { id: "metals", label: "Metals" },
    { id: "optics", label: "Optics" },
    { id: "summary", label: "Price" }
  ];
  const estimatedPrice = useMemo2(() => {
    const baseSettingPrice = activeRingIndex === 0 ? 1950 : 2550;
    const metalPrice = selectedMetal?.priceModifier || 650;
    const caratMultiplier = (scale / 100) ** 1.8;
    const centerStonePrice = Math.round(1800 * caratMultiplier);
    return baseSettingPrice + metalPrice + centerStonePrice;
  }, [activeRingIndex, selectedMetal, scale]);
  const estimatedCarat = (scale / 100 * 1.25).toFixed(2);
  return /* @__PURE__ */ jsx52(
    GlassInspectorDrawer,
    {
      title: "Jewelry Studio",
      subtitle: currentRing?.name || "Bespoke Diamond Customizer",
      isOpen,
      onClose,
      tabs,
      activeTab,
      onTabChange,
      side: "right",
      width: 360,
      className: `vs-jewelry-inspector ${className}`.trim(),
      footer: /* @__PURE__ */ jsxs43("div", { style: { display: "flex", gap: "8px", width: "100%" }, children: [
        /* @__PURE__ */ jsx52(
          "button",
          {
            type: "button",
            className: "vs-btn vs-btn-secondary",
            style: { flex: 1, padding: "8px 12px", fontSize: "0.8rem" },
            onClick: onResetView,
            children: "\u21BA Reset View"
          }
        ),
        /* @__PURE__ */ jsx52(
          "button",
          {
            type: "button",
            className: "vs-btn vs-btn-secondary",
            style: { flex: 1, padding: "8px 12px", fontSize: "0.8rem" },
            onClick: onExportGLTF,
            children: "\u{1F4E6} Export 3D"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxs43("div", { className: "vs-jewelry-inspector-body", style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
        activeTab === "rings" && /* @__PURE__ */ jsxs43("div", { className: "vs-jewelry-rings-panel", style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
          /* @__PURE__ */ jsxs43("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }, children: [
            "Select Ring Setting (",
            rings.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx52("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }, children: rings.map((ring, idx) => {
            const isActive = activeRingIndex === idx;
            return /* @__PURE__ */ jsxs43(
              "div",
              {
                role: "button",
                tabIndex: 0,
                onClick: () => onSelectRing(idx),
                className: `vs-jewelry-card ${isActive ? "is-active" : ""}`,
                style: {
                  padding: "14px 10px",
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
                },
                children: [
                  /* @__PURE__ */ jsx52(
                    "div",
                    {
                      style: {
                        width: "56px",
                        height: "56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0, 0, 0, 0.04)",
                        borderRadius: "10px",
                        padding: "4px"
                      },
                      children: ring.thumb ? /* @__PURE__ */ jsx52(
                        "img",
                        {
                          src: ring.thumb,
                          alt: ring.name,
                          style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }
                        }
                      ) : /* @__PURE__ */ jsx52("span", { style: { fontSize: "1.5rem" }, children: "\u{1F48D}" })
                    }
                  ),
                  /* @__PURE__ */ jsxs43("div", { children: [
                    /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" }, children: ring.name }),
                    isActive && /* @__PURE__ */ jsx52("span", { style: { fontSize: "0.7rem", color: "var(--vs-primary)", fontWeight: 700 }, children: "Active Setting" })
                  ] })
                ]
              },
              ring.name
            );
          }) })
        ] }),
        activeTab === "gemstones" && /* @__PURE__ */ jsxs43("div", { className: "vs-jewelry-gemstones-panel", style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
          /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }, children: "Center Stone Cut & Geometry" }),
          /* @__PURE__ */ jsx52("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }, children: Object.entries(diamondThumbs).map(([shapeName, path]) => {
            const isActive = activeShape === shapeName;
            const imgSrc = path.startsWith("/") ? path.slice(1) : path;
            return /* @__PURE__ */ jsx52(
              "button",
              {
                type: "button",
                onClick: () => onSelectShape(shapeName),
                title: shapeName,
                style: {
                  aspectRatio: "1/1",
                  borderRadius: "8px",
                  background: isActive ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.45)",
                  border: isActive ? "1px solid var(--vs-primary)" : "1px solid rgba(255, 255, 255, 0.65)",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                },
                children: /* @__PURE__ */ jsx52(
                  "img",
                  {
                    src: `${import.meta?.env?.BASE_URL || "/"}${imgSrc}`,
                    alt: shapeName,
                    style: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }
                  }
                )
              },
              shapeName
            );
          }) }),
          /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }, children: [
            /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
              /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }, children: [
                /* @__PURE__ */ jsx52("span", { style: { fontWeight: 600, color: "var(--vs-ink-muted)" }, children: "Diamond Scale (Carat Equiv.)" }),
                /* @__PURE__ */ jsxs43("span", { style: { fontWeight: 700, color: "var(--vs-ink)" }, children: [
                  "~",
                  estimatedCarat,
                  " ct (",
                  scale,
                  "%)"
                ] })
              ] }),
              /* @__PURE__ */ jsx52(
                "input",
                {
                  type: "range",
                  min: "50",
                  max: "200",
                  step: "1",
                  value: scale,
                  onChange: (e) => onScaleChange(parseInt(e.target.value), false),
                  onMouseUp: (e) => onScaleChange(parseInt(e.target.value), true),
                  onTouchEnd: (e) => onScaleChange(parseInt(e.target.value), true),
                  className: "vs-range-slider",
                  style: { width: "100%", accentColor: "var(--vs-primary)" }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
              /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }, children: [
                /* @__PURE__ */ jsx52("span", { style: { fontWeight: 600, color: "var(--vs-ink-muted)" }, children: "Orientation Angle" }),
                /* @__PURE__ */ jsxs43("span", { style: { fontWeight: 700, color: "var(--vs-ink)" }, children: [
                  zRotation,
                  "\xB0"
                ] })
              ] }),
              /* @__PURE__ */ jsx52(
                "input",
                {
                  type: "range",
                  min: "0",
                  max: "360",
                  step: "1",
                  value: zRotation,
                  onChange: (e) => onRotationChange(parseInt(e.target.value), false),
                  onMouseUp: (e) => onRotationChange(parseInt(e.target.value), true),
                  onTouchEnd: (e) => onRotationChange(parseInt(e.target.value), true),
                  className: "vs-range-slider",
                  style: { width: "100%", accentColor: "var(--vs-primary)" }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
              /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }, children: [
                /* @__PURE__ */ jsx52("span", { style: { fontWeight: 600, color: "var(--vs-ink-muted)" }, children: "Setting Height Offset" }),
                /* @__PURE__ */ jsx52("span", { style: { fontWeight: 700, color: "var(--vs-ink)" }, children: yOffset })
              ] }),
              /* @__PURE__ */ jsx52(
                "input",
                {
                  type: "range",
                  min: "-50",
                  max: "50",
                  step: "1",
                  value: yOffset,
                  onChange: (e) => onYOffsetChange(parseInt(e.target.value), false),
                  onMouseUp: (e) => onYOffsetChange(parseInt(e.target.value), true),
                  onTouchEnd: (e) => onYOffsetChange(parseInt(e.target.value), true),
                  className: "vs-range-slider",
                  style: { width: "100%", accentColor: "var(--vs-primary)" }
                }
              )
            ] })
          ] })
        ] }),
        activeTab === "metals" && /* @__PURE__ */ jsxs43("div", { className: "vs-jewelry-metals-panel", style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
          /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }, children: "Precious Metal Alloy & Band" }),
          /* @__PURE__ */ jsx52("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: PRECIOUS_METALS.map((metal) => {
            const isSelected = selectedMetal.name === metal.name;
            return /* @__PURE__ */ jsxs43(
              "button",
              {
                type: "button",
                onClick: () => onSelectMetal(metal),
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: isSelected ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.45)",
                  border: isSelected ? "1px solid var(--vs-primary)" : "1px solid rgba(255, 255, 255, 0.65)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                },
                children: [
                  /* @__PURE__ */ jsxs43("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                    /* @__PURE__ */ jsx52(
                      "span",
                      {
                        style: {
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: metal.hex,
                          border: "1px solid rgba(0,0,0,0.15)",
                          display: "inline-block",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs43("div", { style: { textAlign: "left" }, children: [
                      /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" }, children: metal.name }),
                      /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.7rem", color: "var(--vs-ink-muted)" }, children: metal.alloy })
                    ] })
                  ] }),
                  isSelected && /* @__PURE__ */ jsx52("span", { style: { fontSize: "0.85rem", color: "var(--vs-primary)", fontWeight: 700 }, children: "\u2713" })
                ]
              },
              metal.name
            );
          }) })
        ] }),
        activeTab === "optics" && /* @__PURE__ */ jsxs43("div", { className: "vs-jewelry-optics-panel", style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
          /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }, children: "Optical Dispersion & Post-Processing" }),
          /* @__PURE__ */ jsxs43(
            "label",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.65)",
                cursor: "pointer"
              },
              children: [
                /* @__PURE__ */ jsxs43("div", { children: [
                  /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink)" }, children: "Diamond Bloom Shimmer" }),
                  /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.7rem", color: "var(--vs-ink-muted)" }, children: "Specular glint & refractive dispersion" })
                ] }),
                /* @__PURE__ */ jsx52(
                  "input",
                  {
                    type: "checkbox",
                    checked: isBloomActive,
                    onChange: onToggleBloom
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx52(
            "div",
            {
              style: {
                padding: "12px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.55)",
                fontSize: "0.75rem",
                color: "var(--vs-ink-muted)",
                lineHeight: "1.5"
              },
              children: "Diamond material uses real-time WebGPU spectral dispersion shaders simulating internal light bounce, refraction index (IOR 2.42), and chromatic aberration."
            }
          )
        ] }),
        activeTab === "summary" && /* @__PURE__ */ jsxs43("div", { className: "vs-jewelry-summary-panel", style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
          /* @__PURE__ */ jsx52("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--vs-ink-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }, children: "Bespoke Ring Specification" }),
          /* @__PURE__ */ jsxs43(
            "div",
            {
              style: {
                padding: "16px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.65)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              },
              children: [
                /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }, children: [
                  /* @__PURE__ */ jsx52("span", { style: { color: "var(--vs-ink-muted)" }, children: "Setting Style:" }),
                  /* @__PURE__ */ jsx52("span", { style: { fontWeight: 600, color: "var(--vs-ink)" }, children: currentRing.name })
                ] }),
                /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }, children: [
                  /* @__PURE__ */ jsx52("span", { style: { color: "var(--vs-ink-muted)" }, children: "Center Diamond:" }),
                  /* @__PURE__ */ jsxs43("span", { style: { fontWeight: 600, color: "var(--vs-ink)" }, children: [
                    activeShape || "Round Brilliant",
                    " (~",
                    estimatedCarat,
                    " ct)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }, children: [
                  /* @__PURE__ */ jsx52("span", { style: { color: "var(--vs-ink-muted)" }, children: "Precious Metal:" }),
                  /* @__PURE__ */ jsx52("span", { style: { fontWeight: 600, color: "var(--vs-ink)" }, children: selectedMetal.alloy })
                ] }),
                /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }, children: [
                  /* @__PURE__ */ jsx52("span", { style: { color: "var(--vs-ink-muted)" }, children: "Clarity & Cut:" }),
                  /* @__PURE__ */ jsx52("span", { style: { fontWeight: 600, color: "var(--vs-ink)" }, children: "VVS1 \u2022 Ideal Cut" })
                ] }),
                /* @__PURE__ */ jsx52("div", { style: { height: "1px", background: "rgba(0, 0, 0, 0.08)", margin: "4px 0" } }),
                /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" }, children: [
                  /* @__PURE__ */ jsx52("span", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--vs-ink-muted)" }, children: "Estimated Price:" }),
                  /* @__PURE__ */ jsxs43("span", { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--vs-primary)" }, children: [
                    "$",
                    estimatedPrice.toLocaleString(),
                    " USD"
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx52(
            "button",
            {
              type: "button",
              className: "vs-btn vs-btn-primary",
              style: { width: "100%", padding: "12px", fontSize: "0.9rem" },
              onClick: () => {
                alert(`Order inquiry created for ${currentRing.name} with ${selectedMetal.alloy} and ${estimatedCarat}ct diamond at $${estimatedPrice.toLocaleString()} USD.`);
              },
              children: "Reserve Ring / Request Consultation"
            }
          )
        ] })
      ] })
    }
  );
});

// tests/jewelry-redesign.unit.test.mjs
var mockRings = [
  { name: "Classic Solitaire", url: "models/ring.glb", thumb: "thumbs/ring1.png" },
  { name: "Halo Setting", url: "models/ring2.glb", thumb: "thumbs/ring2.png" }
];
var mockDiamondThumbs = {
  "Round": "thumbs/round.png",
  "Princess": "thumbs/princess.png",
  "Emerald": "thumbs/emerald.png",
  "Oval": "thumbs/oval.png",
  "Cushion": "thumbs/cushion.png",
  "Pear": "thumbs/pear.png",
  "Heart": "thumbs/heart.png",
  "Radiant": "thumbs/radiant.png",
  "Marquise": "thumbs/marquise.png",
  "Asscher": "thumbs/asscher.png"
};
test("JewelryInspector renders GlassInspectorDrawer with all 5 tabs and title", () => {
  const html = renderToStaticMarkup(
    React25.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "rings",
      onTabChange: () => {
      },
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {
      },
      diamondThumbs: mockDiamondThumbs,
      activeShape: "Round",
      onSelectShape: () => {
      },
      zRotation: 0,
      onRotationChange: () => {
      },
      scale: 100,
      onScaleChange: () => {
      },
      yOffset: 0,
      onYOffsetChange: () => {
      },
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {
      },
      isBloomActive: true,
      onToggleBloom: () => {
      },
      onResetView: () => {
      },
      onExportGLTF: () => {
      }
    })
  );
  assert.ok(html.includes("vs-glass-inspector-drawer"), "Should render drawer container");
  assert.ok(html.includes("Jewelry Studio"), "Should render drawer title");
  assert.ok(html.includes("Classic Solitaire"), "Should render current ring subtitle");
  assert.ok(html.includes("Setting (2)"), "Should render Setting tab with ring count");
  assert.ok(html.includes("Diamond (10)"), "Should render Diamond tab with shape count");
  assert.ok(html.includes("Metals"), "Should render Metals tab");
  assert.ok(html.includes("Optics"), "Should render Optics tab");
  assert.ok(html.includes("Price"), "Should render Price tab");
  assert.ok(html.includes("Reset View"), "Should render reset view footer button");
  assert.ok(html.includes("Export 3D"), "Should render export 3D footer button");
});
test("JewelryInspector renders Setting panel with active Solitaire selection", () => {
  let selectedIndex = null;
  const html = renderToStaticMarkup(
    React25.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "rings",
      onTabChange: () => {
      },
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: (idx) => {
        selectedIndex = idx;
      },
      diamondThumbs: mockDiamondThumbs,
      activeShape: "Round",
      onSelectShape: () => {
      },
      zRotation: 0,
      onRotationChange: () => {
      },
      scale: 100,
      onScaleChange: () => {
      },
      yOffset: 0,
      onYOffsetChange: () => {
      },
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {
      }
    })
  );
  assert.ok(html.includes("Select Ring Setting (2)"), "Should render setting header");
  assert.ok(html.includes("Classic Solitaire"), "Should render Solitaire option");
  assert.ok(html.includes("Halo Setting"), "Should render Halo option");
  assert.ok(html.includes("Active Setting"), "Should highlight active setting badge");
});
test("JewelryInspector renders Diamond cut catalog with thumbnail grid and cut count", () => {
  const html = renderToStaticMarkup(
    React25.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "gemstones",
      onTabChange: () => {
      },
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {
      },
      diamondThumbs: mockDiamondThumbs,
      activeShape: "Round",
      onSelectShape: () => {
      },
      zRotation: 45,
      onRotationChange: () => {
      },
      scale: 120,
      onScaleChange: () => {
      },
      yOffset: 0,
      onYOffsetChange: () => {
      },
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {
      }
    })
  );
  assert.ok(html.includes("Center Stone Cut &amp; Geometry"), "Should render gemstone cut header");
  assert.ok(html.includes("Round"), "Should render Round diamond cut");
  assert.ok(html.includes("Princess"), "Should render Princess diamond cut");
  assert.ok(html.includes("Emerald"), "Should render Emerald diamond cut");
  assert.ok(html.includes("Asscher"), "Should render Asscher diamond cut");
});
test("JewelryInspector renders Diamond transform controls (carat scale, rotation, table height)", () => {
  const html = renderToStaticMarkup(
    React25.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "gemstones",
      onTabChange: () => {
      },
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {
      },
      diamondThumbs: mockDiamondThumbs,
      activeShape: "Round",
      onSelectShape: () => {
      },
      zRotation: 45,
      onRotationChange: () => {
      },
      scale: 120,
      onScaleChange: () => {
      },
      yOffset: 5,
      onYOffsetChange: () => {
      },
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {
      }
    })
  );
  assert.ok(html.includes("Diamond Scale (Carat Equiv.)"), "Should render scale label");
  assert.ok(html.includes("(120%)"), "Should render scale percentage value");
  assert.ok(html.includes("Orientation Angle"), "Should render rotation label");
  assert.ok(html.includes("45\xB0"), "Should render rotation degrees value");
  assert.ok(html.includes("Setting Height Offset"), "Should render table height offset label");
  assert.ok(html.includes(">5</span>"), "Should render table height offset value");
});
test("JewelryInspector renders Precious Metals catalog with 4 swatches and active alloy badge", () => {
  const html = renderToStaticMarkup(
    React25.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "metals",
      onTabChange: () => {
      },
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {
      },
      diamondThumbs: mockDiamondThumbs,
      activeShape: "Round",
      onSelectShape: () => {
      },
      zRotation: 0,
      onRotationChange: () => {
      },
      scale: 100,
      onScaleChange: () => {
      },
      yOffset: 0,
      onYOffsetChange: () => {
      },
      selectedMetal: PRECIOUS_METALS[1],
      // White Gold
      onSelectMetal: () => {
      }
    })
  );
  assert.ok(html.includes("Precious Metal Alloy &amp; Band"), "Should render metals header");
  assert.ok(html.includes("18K Yellow Gold"), "Should render Yellow Gold option");
  assert.ok(html.includes("18K White Gold"), "Should render White Gold option");
  assert.ok(html.includes("18K Rose Gold"), "Should render Rose Gold option");
  assert.ok(html.includes("Platinum 950"), "Should render Platinum option");
  assert.ok(html.includes("\u2713"), "Should render checkmark badge on selected metal");
});
test("JewelryInspector renders Optics panel with dispersion, IOR, and Bloom shimmer toggle", () => {
  const html = renderToStaticMarkup(
    React25.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "optics",
      onTabChange: () => {
      },
      rings: mockRings,
      activeRingIndex: 0,
      onSelectRing: () => {
      },
      diamondThumbs: mockDiamondThumbs,
      activeShape: "Round",
      onSelectShape: () => {
      },
      zRotation: 0,
      onRotationChange: () => {
      },
      scale: 100,
      onScaleChange: () => {
      },
      yOffset: 0,
      onYOffsetChange: () => {
      },
      selectedMetal: PRECIOUS_METALS[0],
      onSelectMetal: () => {
      },
      isBloomActive: true,
      onToggleBloom: () => {
      }
    })
  );
  assert.ok(html.includes("Optical Dispersion &amp; Post-Processing"), "Should render optics header");
  assert.ok(html.includes("Diamond Bloom Shimmer"), "Should render bloom toggle label");
  assert.ok(html.includes("Specular glint &amp; refractive dispersion"), "Should render bloom subtitle");
  assert.ok(html.includes("spectral dispersion shaders"), "Should render optics explanation");
});
test("JewelryInspector renders Price breakdown and total estimate calculated dynamically", () => {
  const html = renderToStaticMarkup(
    React25.createElement(JewelryInspector, {
      isOpen: true,
      onClose: () => {
      },
      activeTab: "summary",
      onTabChange: () => {
      },
      rings: mockRings,
      activeRingIndex: 0,
      // Solitaire ($1,950)
      onSelectRing: () => {
      },
      diamondThumbs: mockDiamondThumbs,
      activeShape: "Round",
      onSelectShape: () => {
      },
      zRotation: 0,
      onRotationChange: () => {
      },
      scale: 100,
      // 100% carat ($1,800)
      onScaleChange: () => {
      },
      yOffset: 0,
      onYOffsetChange: () => {
      },
      selectedMetal: PRECIOUS_METALS[0],
      // Yellow Gold ($650)
      onSelectMetal: () => {
      }
    })
  );
  assert.ok(html.includes("Bespoke Ring Specification"), "Should render pricing specification header");
  assert.ok(html.includes("Classic Solitaire"), "Should render ring style");
  assert.ok(html.includes("18K Yellow Gold"), "Should render metal alloy");
  assert.ok(html.includes("Estimated Price:"), "Should render estimated price label");
  assert.ok(html.includes("$4,400 USD"), "Should render total dynamic valuation");
  assert.ok(html.includes("Reserve Ring / Request Consultation"), "Should render reserve action button");
});
test("FloatingControlDock renders 5 jewelry control items in configurator", () => {
  const dockItems = [
    { id: "rings", label: "Setting", icon: "\u{1F48D}" },
    { id: "gemstones", label: "Diamond", icon: "\u{1F48E}" },
    { id: "metals", label: "Metals", icon: "\u2728" },
    { id: "optics", label: "Optics", icon: "\u{1F52C}" },
    { id: "summary", label: "Price", icon: "\u{1F3F7}\uFE0F" }
  ];
  const html = renderToStaticMarkup(
    React25.createElement(FloatingControlDock, {
      items: dockItems,
      activeId: "rings",
      onSelect: () => {
      },
      position: "bottom"
    })
  );
  assert.ok(html.includes("vs-floating-control-dock"), "Should render floating control dock");
  assert.ok(html.includes("Setting"), "Should render Setting dock item");
  assert.ok(html.includes("Diamond"), "Should render Diamond dock item");
  assert.ok(html.includes("Metals"), "Should render Metals dock item");
  assert.ok(html.includes("Optics"), "Should render Optics dock item");
  assert.ok(html.includes("Price"), "Should render Price dock item");
});
test("CanvasControlToolbar renders top-right controls with Recenter, Bloom, Export, and Fullscreen", () => {
  const html = renderToStaticMarkup(
    React25.createElement(CanvasControlToolbar, {
      position: "top-right",
      onRecenter: () => {
      },
      extraActions: React25.createElement(
        "div",
        { className: "extra-jewelry-actions" },
        React25.createElement("button", { className: "bloom-btn" }, "\u2728"),
        React25.createElement("button", { className: "export-btn" }, "\u{1F4E5}"),
        React25.createElement("button", { className: "fs-btn" }, "\u26F6")
      )
    })
  );
  assert.ok(html.includes("vs-canvas-control-toolbar"), "Should render canvas toolbar");
  assert.ok(html.includes("vs-canvas-control-toolbar--top-right"), "Should use top-right placement");
  assert.ok(html.includes("bloom-btn"), "Should render bloom toggle action");
  assert.ok(html.includes("export-btn"), "Should render export action");
  assert.ok(html.includes("fs-btn"), "Should render fullscreen action");
});
test("AppHeaderBar renders jewelry branding, active status badge, and theme switcher", () => {
  function JewelryHeaderStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React25.createElement(AppHeaderBar, {
      brandTitle: "TRIKOMI",
      productTitle: "Jewelry Configurator",
      backLabel: "\u2190 Back to Overview",
      onBack: () => {
      },
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true,
      statusBadge: React25.createElement("span", { className: "vs-jewelry-badge" }, "Classic Solitaire \u2022 18K Yellow Gold \u2022 $4,400 USD")
    });
  }
  const html = renderToStaticMarkup(
    React25.createElement(
      VictorShellThemeProvider,
      { initialAccent: "orchid" },
      React25.createElement(JewelryHeaderStage)
    )
  );
  assert.ok(html.includes("TRIKOMI"), "Should render brand title");
  assert.ok(html.includes("Jewelry Configurator"), "Should render product title");
  assert.ok(html.includes("\u2190 Back to Overview"), "Should render back button");
  assert.ok(html.includes("Classic Solitaire \u2022 18K Yellow Gold \u2022 $4,400 USD"), "Should render status badge");
  assert.ok(html.includes('data-accent="orchid"'), 'Provider root should have initial data-accent="orchid"');
  assert.ok(html.includes("vs-theme-accent-btn--orchid is-active"), "AppHeaderBar should have active orchid theme button");
});
test("VictorShellThemeProvider persists custom theme selection across re-renders in jewelry configurator", () => {
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
        productTitle: "Jewelry Configurator",
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
          { initialAccent: "orchid" },
          React25.createElement(TestThemeProbe2)
        )
      );
    });
    assert.equal(contextValue.accent, "orchid", "Initial theme should be Orchid Glow");
    const rootWrapper = container.childNodes[0];
    assert.equal(rootWrapper.attributes["data-accent"], "orchid", 'VictorShellThemeProvider root must have data-accent="orchid"');
    const orchidBtn = container.find((el) => el.attributes["aria-label"] === "Orchid Glow Theme");
    assert.ok(orchidBtn, "Orchid theme button must be rendered in AppHeaderBar");
    assert.ok(orchidBtn.className.includes("is-active"), "Orchid button should be active initially");
    const indigoBtn = container.find((el) => el.attributes["aria-label"] === "Electric Indigo Theme");
    assert.ok(indigoBtn, "Indigo theme button must exist in AppHeaderBar");
    act(() => {
      indigoBtn.click();
    });
    assert.equal(contextValue.accent, "indigo", "Context theme should update to Indigo after real click event");
    assert.equal(mockDoc.documentElement.getAttribute("data-accent"), "indigo", "Document data-accent should update to indigo");
    assert.equal(rootWrapper.attributes["data-accent"], "indigo", "Provider root data-accent must update to indigo");
    assert.ok(indigoBtn.className.includes("is-active"), "Indigo button must be active");
    assert.ok(!orchidBtn.className.includes("is-active"), "Orchid button must not be active");
    act(() => {
      triggerUnrelatedUpdate();
    });
    assert.equal(contextValue.accent, "indigo", "Theme should remain Indigo after unrelated component re-render");
    assert.equal(mockDoc.documentElement.getAttribute("data-accent"), "indigo", "Document data-accent should remain indigo");
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
