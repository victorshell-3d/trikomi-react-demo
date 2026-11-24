// tests/sportswear-redesign.unit.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import React26, { act } from "react";
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

// apps/sportswear-configurator/src/components/SportswearInspector.tsx
import { useState as useState31, useRef as useRef13 } from "react";
import { observer } from "mobx-react-lite";

// apps/sportswear-configurator/src/store/ConfiguratorStore.ts
import { makeAutoObservable } from "mobx";
import { createContext as createContext4, useContext as useContext4 } from "react";
function renderTextToDataUrl(text, fontFamily = "Impact", color = "#ffffff") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const fontSize = 160;
  const fontStr = `bold ${fontSize}px ${fontFamily || "Impact, sans-serif"}`;
  ctx.font = fontStr;
  const str = text || " ";
  const metrics = ctx.measureText(str);
  const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.75;
  const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.2;
  const left = metrics.actualBoundingBoxLeft ?? 0;
  const right = metrics.actualBoundingBoxRight ?? metrics.width;
  const glyphWidth = Math.max(20, Math.ceil(left + right));
  const glyphHeight = Math.max(20, Math.ceil(ascent + descent));
  const padX = Math.ceil(fontSize * 0.08);
  const padY = Math.ceil(fontSize * 0.08);
  canvas.width = glyphWidth + padX * 2;
  canvas.height = glyphHeight + padY * 2;
  ctx.font = fontStr;
  ctx.fillStyle = color || "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(str, padX + left, padY + ascent);
  return {
    src: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
    aspectRatio: canvas.width / canvas.height
  };
}
var ConfiguratorStore = class {
  // Mapping based on typical legacy SVG structures (ColoursDefault mappings)
  parts = [];
  setPartsFromColors(colors) {
    const premiumPalette = ["#1A1A1A", "#D4AF37", "#F0F0F0", "#0A1128", "#780000"];
    this.parts = colors.map((colorHex, index) => ({
      id: `part-${index}`,
      name: `Color Layer ${index + 1}`,
      originalColor: colorHex.toUpperCase(),
      color: premiumPalette[index % premiumPalette.length]
    }));
    if (this.parts.length > 0) {
      this.activePartId = this.parts[0].id;
    }
  }
  logos = [];
  selectedLogoId = null;
  get texts() {
    return this.logos.filter((l) => l.isText);
  }
  get selectedTextId() {
    const selected = this.logos.find((l) => l.id === this.selectedLogoId);
    return selected?.isText ? selected.id : null;
  }
  activePartId = "body";
  isLoading = true;
  centerUV = null;
  viewTrigger = null;
  fabricType = "mesh";
  showOrderForm = false;
  orderScreenshots = [];
  generateScreenshotsTrigger = 0;
  constructor() {
    makeAutoObservable(this);
  }
  triggerGenerateScreenshots() {
    this.generateScreenshotsTrigger = Date.now();
  }
  setShowOrderForm(show) {
    this.showOrderForm = show;
  }
  setOrderScreenshots(shots) {
    this.orderScreenshots = shots;
  }
  setFabricType(type) {
    this.fabricType = type;
  }
  setCenterUV(uv) {
    this.centerUV = uv;
  }
  triggerViewChange(view) {
    this.viewTrigger = { view, timestamp: Date.now() };
  }
  onLogoTransform;
  onSelectLogo;
  onLogosChanged;
  setSelectedLogo(id) {
    this.selectedLogoId = id;
    if (this.onSelectLogo) {
      this.onSelectLogo(id);
    }
  }
  setSelectedText(id) {
    this.setSelectedLogo(id);
  }
  setPartColor(id, color) {
    const part = this.parts.find((p) => p.id === id);
    if (part) {
      part.color = color;
    }
  }
  addLogo(logo) {
    this.logos.push(logo);
    if (this.onLogosChanged) {
      this.onLogosChanged();
    }
  }
  updateLogo(id, updates) {
    const index = this.logos.findIndex((l) => l.id === id);
    if (index !== -1) {
      const srcChanged = updates.src !== void 0 && updates.src !== this.logos[index].src;
      this.logos[index] = { ...this.logos[index], ...updates };
      const item = this.logos[index];
      if (this.onLogoTransform) {
        this.onLogoTransform(id, {
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          rotation: item.rotation || 0
        });
      }
      if (srcChanged && this.onLogosChanged) {
        this.onLogosChanged();
      }
    }
  }
  removeLogo(id) {
    this.logos = this.logos.filter((l) => l.id !== id);
    if (this.selectedLogoId === id) {
      this.selectedLogoId = null;
    }
    if (this.onLogosChanged) {
      this.onLogosChanged();
    }
  }
  addText(params) {
    const rendered = renderTextToDataUrl(params.text, params.fontFamily, params.color);
    const height = params.height || 120;
    const width = Math.round(height * rendered.aspectRatio);
    const overlay = {
      id: params.id,
      src: rendered.src,
      x: params.x,
      y: params.y,
      width,
      height,
      rotation: params.rotation || 0,
      isText: true,
      text: params.text,
      fontFamily: params.fontFamily,
      textColor: params.color
    };
    this.logos.push(overlay);
    this.setSelectedLogo(params.id);
  }
  updateText(id, updates) {
    const item = this.logos.find((l) => l.id === id);
    if (!item) return;
    const newText = updates.text !== void 0 ? updates.text : item.text || "";
    const newFont = updates.fontFamily !== void 0 ? updates.fontFamily : item.fontFamily || "Impact";
    const newColor = updates.color !== void 0 ? updates.color : item.textColor || "#ffffff";
    let newSrc = item.src;
    let newWidth = updates.width !== void 0 ? updates.width : item.width;
    let newHeight = updates.height !== void 0 ? updates.height : item.height;
    if (updates.text !== void 0 || updates.fontFamily !== void 0 || updates.color !== void 0) {
      const rendered = renderTextToDataUrl(newText, newFont, newColor);
      newSrc = rendered.src;
      newWidth = Math.round(newHeight * rendered.aspectRatio);
    }
    this.updateLogo(id, {
      ...updates,
      text: newText,
      fontFamily: newFont,
      textColor: newColor,
      src: newSrc,
      width: newWidth,
      height: newHeight
    });
  }
  removeText(id) {
    this.removeLogo(id);
  }
  setActivePart(id) {
    this.activePartId = id;
  }
  setIsLoading(loading) {
    this.isLoading = loading;
  }
  get activePart() {
    return this.parts.find((p) => p.id === this.activePartId);
  }
};
var configStore = new ConfiguratorStore();
var ConfigStoreContext = createContext4(configStore);
var useConfigStore = () => {
  const store = useContext4(ConfigStoreContext);
  if (!store) {
    throw new Error("useConfigStore must be used within a ConfigStoreContext.Provider");
  }
  return store;
};

// apps/sportswear-configurator/src/components/SportswearInspector.tsx
import { jsx as jsx52, jsxs as jsxs43 } from "react/jsx-runtime";
var COLOR_PALETTE = [
  "#ffffff",
  "#0f172a",
  "#dc2626",
  "#ea580c",
  "#eab308",
  "#16a34a",
  "#0284c7",
  "#4f46e5",
  "#9333ea",
  "#db2777"
];
var DRAWER_TABS = [
  { id: "color", label: "Color" },
  { id: "texture", label: "Fabric" },
  { id: "logo", label: "Logo" },
  { id: "text", label: "Text" },
  { id: "finishing", label: "Finish" }
];
var SportswearInspector = observer(({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  width = 360
}) => {
  const configStore2 = useConfigStore();
  const fileInputRef = useRef13(null);
  const [newTextStr, setNewTextStr] = useState31("");
  const [selectedFont, setSelectedFont] = useState31("Impact");
  const [selectedTextColor, setSelectedTextColor] = useState31("#ffffff");
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        const width2 = 240;
        const height = Math.round(width2 / aspect);
        const targetX = configStore2.centerUV ? configStore2.centerUV.x * 2048 - width2 / 2 : 900;
        const targetY = configStore2.centerUV ? configStore2.centerUV.y * 2048 - height / 2 : 900;
        const newId = `logo-${Date.now()}`;
        configStore2.addLogo({
          id: newId,
          src,
          x: targetX,
          y: targetY,
          width: width2,
          height,
          rotation: 0
        });
        configStore2.setSelectedLogo(newId);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleAddText = () => {
    if (!newTextStr.trim()) return;
    const targetX = configStore2.centerUV ? configStore2.centerUV.x * 2048 - 140 : 880;
    const targetY = configStore2.centerUV ? configStore2.centerUV.y * 2048 - 60 : 850;
    const newId = `text-${Date.now()}`;
    configStore2.addText({
      id: newId,
      text: newTextStr.trim(),
      fontFamily: selectedFont,
      color: selectedTextColor,
      x: targetX,
      y: targetY,
      width: 280,
      height: 120,
      rotation: 0
    });
    configStore2.setSelectedText(newId);
    setNewTextStr("");
  };
  const handleTextColorSelect = (hex) => {
    setSelectedTextColor(hex);
    if (configStore2.selectedTextId) {
      configStore2.updateText(configStore2.selectedTextId, { color: hex });
    }
  };
  const currentPart = configStore2.parts.find((p) => p.id === configStore2.activePartId) || configStore2.parts[0];
  const logoList = configStore2.logos.filter((l) => !l.isText);
  const textList = configStore2.texts;
  const triggerOrder = () => {
    configStore2.triggerGenerateScreenshots();
    configStore2.setShowOrderForm(true);
  };
  return /* @__PURE__ */ jsxs43(
    GlassInspectorDrawer,
    {
      title: "Customize Garment",
      subtitle: "Sportswear 3D Studio",
      side: "right",
      isOpen,
      onClose,
      collapsible: true,
      tabs: DRAWER_TABS,
      activeTab,
      onTabChange: (tabId) => onTabChange(tabId),
      width,
      footer: /* @__PURE__ */ jsxs43(
        "button",
        {
          type: "button",
          onClick: triggerOrder,
          style: {
            width: "100%",
            background: "linear-gradient(135deg, #4338CA 0%, #3730A3 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "9999px",
            padding: "10px 16px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(67, 56, 202, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          },
          children: [
            /* @__PURE__ */ jsx52("span", { children: "Generate Tech Pack & Order" }),
            /* @__PURE__ */ jsx52("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx52("path", { d: "M5 12h14M12 5l7 7-7 7" }) })
          ]
        }
      ),
      children: [
        activeTab === "color" && /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsx52("span", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "8px" }, children: "Select Layer" }),
            /* @__PURE__ */ jsx52("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "8px" }, children: configStore2.parts.map((part, idx) => {
              const isActive = configStore2.activePartId === part.id;
              return /* @__PURE__ */ jsxs43(
                "button",
                {
                  type: "button",
                  onClick: () => configStore2.setActivePart(part.id),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background: isActive ? "rgba(67, 56, 202, 0.12)" : "rgba(255, 255, 255, 0.5)",
                    border: isActive ? "1.5px solid #4338CA" : "1px solid rgba(67, 56, 202, 0.15)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsx52(
                      "span",
                      {
                        style: {
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: part.color,
                          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)",
                          flexShrink: 0
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs43("span", { style: { fontSize: "12px", fontWeight: 600, color: isActive ? "#4338CA" : "#1e1b4b" }, children: [
                      "#",
                      idx + 1
                    ] })
                  ]
                },
                part.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsx52("span", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "8px" }, children: "Palette Swatches" }),
            /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }, children: [
              COLOR_PALETTE.map((hex) => {
                const isSelected = currentPart?.color.toLowerCase() === hex.toLowerCase();
                return /* @__PURE__ */ jsx52(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (configStore2.activePartId) {
                        configStore2.setPartColor(configStore2.activePartId, hex);
                      }
                    },
                    style: {
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: hex,
                      border: isSelected ? "2px solid #4338CA" : "1px solid rgba(0, 0, 0, 0.15)",
                      boxShadow: isSelected ? "0 0 0 2px rgba(67, 56, 202, 0.3)" : "none",
                      cursor: "pointer",
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                      transition: "transform 0.15s ease"
                    },
                    title: hex
                  },
                  hex
                );
              }),
              configStore2.activePartId && /* @__PURE__ */ jsxs43(
                "label",
                {
                  title: "Custom Color Picker",
                  style: {
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1px dashed #4338CA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "rgba(67, 56, 202, 0.08)"
                  },
                  children: [
                    /* @__PURE__ */ jsx52("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#4338CA", strokeWidth: "2.5", children: /* @__PURE__ */ jsx52("path", { d: "M12 5v14M5 12h14" }) }),
                    /* @__PURE__ */ jsx52(
                      "input",
                      {
                        type: "color",
                        value: currentPart?.color || "#ffffff",
                        onChange: (e) => configStore2.setPartColor(configStore2.activePartId, e.target.value),
                        style: { opacity: 0, position: "absolute", width: 0, height: 0, pointerEvents: "none" }
                      }
                    )
                  ]
                }
              )
            ] }),
            currentPart && /* @__PURE__ */ jsxs43("span", { style: { fontSize: "11px", color: "#64748b", fontFamily: "monospace", display: "block", marginTop: "6px" }, children: [
              "CURRENT: ",
              currentPart.color.toUpperCase(),
              " (",
              currentPart.name,
              ")"
            ] })
          ] })
        ] }),
        activeTab === "texture" && /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
          /* @__PURE__ */ jsx52("span", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6366f1", display: "block" }, children: "Garment Fabric Weave" }),
          /* @__PURE__ */ jsx52("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: ["mesh", "knit", "smooth"].map((type) => {
            const isSelected = configStore2.fabricType === type;
            return /* @__PURE__ */ jsxs43(
              "button",
              {
                type: "button",
                onClick: () => configStore2.setFabricType(type),
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  background: isSelected ? "rgba(67, 56, 202, 0.12)" : "rgba(255, 255, 255, 0.6)",
                  border: isSelected ? "1.5px solid #4338CA" : "1px solid rgba(67, 56, 202, 0.15)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left"
                },
                children: [
                  /* @__PURE__ */ jsxs43("div", { children: [
                    /* @__PURE__ */ jsxs43("span", { style: { fontSize: "13px", fontWeight: 700, color: isSelected ? "#4338CA" : "#1e1b4b", display: "block", textTransform: "capitalize" }, children: [
                      type,
                      " Weave"
                    ] }),
                    /* @__PURE__ */ jsx52("span", { style: { fontSize: "11px", color: "#64748b" }, children: type === "mesh" ? "High-breathability athletic mesh" : type === "knit" ? "Durable interlock stretch knit" : "Polished aerodynamic smooth jersey" })
                  ] }),
                  isSelected && /* @__PURE__ */ jsx52("span", { style: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#4338CA" } })
                ]
              },
              type
            );
          }) })
        ] }),
        activeTab === "logo" && /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsx52(
            "input",
            {
              type: "file",
              ref: fileInputRef,
              onChange: handleFileUpload,
              accept: "image/*",
              style: { display: "none" }
            }
          ),
          /* @__PURE__ */ jsxs43(
            "button",
            {
              type: "button",
              onClick: () => fileInputRef.current?.click(),
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                borderRadius: "14px",
                background: "rgba(67, 56, 202, 0.08)",
                border: "1.5px dashed #4338CA",
                color: "#4338CA",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              },
              children: [
                /* @__PURE__ */ jsx52("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx52("path", { d: "M12 5v14M5 12h14" }) }),
                /* @__PURE__ */ jsx52("span", { children: "Upload Vector / Image Decal" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsxs43("span", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "8px" }, children: [
              "Applied Decals (",
              logoList.length,
              ")"
            ] }),
            logoList.length === 0 ? /* @__PURE__ */ jsx52("p", { style: { fontSize: "12px", color: "#64748b", fontStyle: "italic", margin: 0 }, children: "No custom decals placed yet. Drag on 3D jersey to reposition." }) : /* @__PURE__ */ jsx52("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: logoList.map((logo) => {
              const isSelected = configStore2.selectedLogoId === logo.id;
              return /* @__PURE__ */ jsxs43(
                "div",
                {
                  onClick: () => configStore2.setSelectedLogo(logo.id),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background: isSelected ? "rgba(67, 56, 202, 0.12)" : "rgba(255, 255, 255, 0.6)",
                    border: isSelected ? "1.5px solid #4338CA" : "1px solid rgba(67, 56, 202, 0.15)",
                    cursor: "pointer"
                  },
                  children: [
                    /* @__PURE__ */ jsxs43("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                      /* @__PURE__ */ jsx52(
                        "img",
                        {
                          src: logo.src,
                          alt: "Decal",
                          style: { width: "28px", height: "28px", objectFit: "contain", borderRadius: "4px" }
                        }
                      ),
                      /* @__PURE__ */ jsxs43("div", { children: [
                        /* @__PURE__ */ jsxs43("span", { style: { fontSize: "12px", fontWeight: 600, color: "#1e1b4b", display: "block" }, children: [
                          "Decal #",
                          logo.id.slice(-4)
                        ] }),
                        /* @__PURE__ */ jsxs43("span", { style: { fontSize: "10px", color: "#64748b", fontFamily: "monospace" }, children: [
                          Math.round(logo.width),
                          "\xD7",
                          Math.round(logo.height),
                          "px \xB7 ",
                          Math.round(logo.rotation || 0),
                          "\xB0"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx52(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          configStore2.removeLogo(logo.id);
                        },
                        style: {
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "8px",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px"
                        },
                        title: "Delete Decal",
                        children: "\u2715"
                      }
                    )
                  ]
                },
                logo.id
              );
            }) })
          ] })
        ] }),
        activeTab === "text" && /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsx52("span", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "8px" }, children: "Add Player Name / Number" }),
            /* @__PURE__ */ jsxs43("div", { style: { display: "flex", gap: "8px", marginBottom: "8px" }, children: [
              /* @__PURE__ */ jsx52(
                "input",
                {
                  type: "text",
                  value: newTextStr,
                  onChange: (e) => setNewTextStr(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && handleAddText(),
                  placeholder: "e.g. 10 / NEYMAR",
                  style: {
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(67, 56, 202, 0.25)",
                    background: "rgba(255, 255, 255, 0.8)",
                    fontSize: "13px",
                    color: "#1e1b4b",
                    outline: "none"
                  }
                }
              ),
              /* @__PURE__ */ jsx52(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedFont((f) => f === "Impact" ? "Arial" : "Impact"),
                  style: {
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(67, 56, 202, 0.25)",
                    background: "rgba(67, 56, 202, 0.08)",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#4338CA",
                    cursor: "pointer"
                  },
                  title: "Toggle Font",
                  children: selectedFont === "Impact" ? "Impact" : "Sans"
                }
              ),
              /* @__PURE__ */ jsx52(
                "button",
                {
                  type: "button",
                  onClick: handleAddText,
                  style: {
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#4338CA",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer"
                  },
                  title: "Add Text",
                  children: "+"
                }
              )
            ] }),
            /* @__PURE__ */ jsx52("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }, children: COLOR_PALETTE.map((hex) => {
              const isSelected = selectedTextColor.toLowerCase() === hex.toLowerCase();
              return /* @__PURE__ */ jsx52(
                "button",
                {
                  type: "button",
                  onClick: () => handleTextColorSelect(hex),
                  style: {
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: hex,
                    border: isSelected ? "2px solid #4338CA" : "1px solid rgba(0, 0, 0, 0.15)",
                    cursor: "pointer"
                  },
                  title: hex
                },
                hex
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsxs43("span", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "8px" }, children: [
              "Active Embroidery Overlays (",
              textList.length,
              ")"
            ] }),
            textList.length === 0 ? /* @__PURE__ */ jsx52("p", { style: { fontSize: "12px", color: "#64748b", fontStyle: "italic", margin: 0 }, children: "No custom typography added yet." }) : /* @__PURE__ */ jsx52("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: textList.map((t) => {
              const isSelected = configStore2.selectedLogoId === t.id;
              return /* @__PURE__ */ jsxs43(
                "div",
                {
                  onClick: () => configStore2.setSelectedText(t.id),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background: isSelected ? "rgba(67, 56, 202, 0.12)" : "rgba(255, 255, 255, 0.6)",
                    border: isSelected ? "1.5px solid #4338CA" : "1px solid rgba(67, 56, 202, 0.15)",
                    cursor: "pointer"
                  },
                  children: [
                    /* @__PURE__ */ jsxs43("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                      /* @__PURE__ */ jsxs43("span", { style: { fontSize: "14px", fontWeight: 800, fontFamily: t.fontFamily, color: t.textColor || "#1e1b4b" }, children: [
                        '"',
                        t.text,
                        '"'
                      ] }),
                      /* @__PURE__ */ jsx52("span", { style: { fontSize: "10px", color: "#64748b", fontFamily: "monospace" }, children: t.fontFamily })
                    ] }),
                    /* @__PURE__ */ jsx52(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          configStore2.removeText(t.id);
                        },
                        style: {
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "8px",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px"
                        },
                        title: "Delete Text",
                        children: "\u2715"
                      }
                    )
                  ]
                },
                t.id
              );
            }) })
          ] })
        ] }),
        activeTab === "finishing" && /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsx52("span", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "8px" }, children: "Customization Summary" }),
            /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "8px", background: "rgba(255, 255, 255, 0.5)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(67, 56, 202, 0.12)" }, children: [
              /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "12px" }, children: [
                /* @__PURE__ */ jsx52("span", { style: { color: "#64748b" }, children: "Fabric Weave:" }),
                /* @__PURE__ */ jsx52("strong", { style: { color: "#1e1b4b", textTransform: "uppercase" }, children: configStore2.fabricType })
              ] }),
              /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "12px" }, children: [
                /* @__PURE__ */ jsx52("span", { style: { color: "#64748b" }, children: "Customized Color Layers:" }),
                /* @__PURE__ */ jsxs43("strong", { style: { color: "#1e1b4b" }, children: [
                  configStore2.parts.length,
                  " Layers"
                ] })
              ] }),
              /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "12px" }, children: [
                /* @__PURE__ */ jsx52("span", { style: { color: "#64748b" }, children: "Decals Placed:" }),
                /* @__PURE__ */ jsxs43("strong", { style: { color: "#1e1b4b" }, children: [
                  logoList.length,
                  " Items"
                ] })
              ] }),
              /* @__PURE__ */ jsxs43("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "12px" }, children: [
                /* @__PURE__ */ jsx52("span", { style: { color: "#64748b" }, children: "Embroidery Typography:" }),
                /* @__PURE__ */ jsxs43("strong", { style: { color: "#1e1b4b" }, children: [
                  textList.length,
                  " Items"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs43("div", { children: [
            /* @__PURE__ */ jsx52("span", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "8px" }, children: "Quality Verification" }),
            /* @__PURE__ */ jsxs43("div", { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#16a34a" }, children: [
              /* @__PURE__ */ jsx52("span", { children: "\u2713 WebGPU 3D Model Verified" }),
              /* @__PURE__ */ jsx52("span", { children: "\u2713 Color Layer Shaders Synchronized" }),
              /* @__PURE__ */ jsx52("span", { children: "\u2713 Texture Compositor Baked" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs43(
            "button",
            {
              type: "button",
              onClick: triggerOrder,
              style: {
                padding: "14px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #4338CA 0%, #3730A3 100%)",
                color: "#ffffff",
                border: "none",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(67, 56, 202, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              },
              children: [
                /* @__PURE__ */ jsx52("span", { children: "Finish & Request Tech Pack" }),
                /* @__PURE__ */ jsx52("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx52("path", { d: "M5 12h14M12 5l7 7-7 7" }) })
              ]
            }
          )
        ] })
      ]
    }
  );
});

// apps/sportswear-configurator/src/components/MobileConfigDock.tsx
import { useState as useState32, useRef as useRef14 } from "react";
import { observer as observer2 } from "mobx-react-lite";
import { jsx as jsx53, jsxs as jsxs44 } from "react/jsx-runtime";
var COLOR_PALETTE2 = [
  "#ffffff",
  "#0f172a",
  "#dc2626",
  "#ea580c",
  "#eab308",
  "#16a34a",
  "#0284c7",
  "#4f46e5",
  "#9333ea",
  "#db2777"
];
var MobileConfigDock = observer2(({
  activePanel,
  onSelectPanel,
  isMobile
}) => {
  const configStore2 = useConfigStore();
  const fileInputRef = useRef14(null);
  const [newTextStr, setNewTextStr] = useState32("");
  const [selectedFont, setSelectedFont] = useState32("Impact");
  const [selectedTextColor, setSelectedTextColor] = useState32("#ffffff");
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        const width = 240;
        const height = Math.round(width / aspect);
        const targetX = configStore2.centerUV ? configStore2.centerUV.x * 2048 - width / 2 : 900;
        const targetY = configStore2.centerUV ? configStore2.centerUV.y * 2048 - height / 2 : 900;
        const newId = `logo-${Date.now()}`;
        configStore2.addLogo({
          id: newId,
          src,
          x: targetX,
          y: targetY,
          width,
          height,
          rotation: 0
        });
        configStore2.setSelectedLogo(newId);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleAddText = () => {
    if (!newTextStr.trim()) return;
    const targetX = configStore2.centerUV ? configStore2.centerUV.x * 2048 - 140 : 880;
    const targetY = configStore2.centerUV ? configStore2.centerUV.y * 2048 - 60 : 850;
    const newId = `text-${Date.now()}`;
    configStore2.addText({
      id: newId,
      text: newTextStr.trim(),
      fontFamily: selectedFont,
      color: selectedTextColor,
      x: targetX,
      y: targetY,
      width: 280,
      height: 120,
      rotation: 0
    });
    configStore2.setSelectedText(newId);
    setNewTextStr("");
  };
  const handleTextColorSelect = (hex) => {
    setSelectedTextColor(hex);
    if (configStore2.selectedTextId) {
      configStore2.updateText(configStore2.selectedTextId, { color: hex });
    }
  };
  const activePart = configStore2.parts.find((p) => p.id === configStore2.activePartId) || configStore2.parts[0];
  const logoCount = configStore2.logos.filter((l) => !l.isText).length;
  const textCount = configStore2.texts.length;
  const dockItems = [
    {
      id: "color",
      label: "Color",
      icon: /* @__PURE__ */ jsx53(
        "span",
        {
          className: "live-color-badge",
          style: {
            backgroundColor: activePart?.color || "#ffffff",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            display: "inline-block",
            boxShadow: "0 0 0 1.5px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0,0,0,0.15)"
          }
        }
      )
    },
    {
      id: "texture",
      label: "Fabric",
      badge: configStore2.fabricType,
      icon: /* @__PURE__ */ jsxs44("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx53("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
        /* @__PURE__ */ jsx53("polyline", { points: "2 17 12 22 22 17" })
      ] })
    },
    {
      id: "logo",
      label: "Logo",
      badge: logoCount > 0 ? logoCount : void 0,
      icon: /* @__PURE__ */ jsxs44("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx53("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
        /* @__PURE__ */ jsx53("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
        /* @__PURE__ */ jsx53("polyline", { points: "21 15 16 10 5 21" })
      ] })
    },
    {
      id: "text",
      label: "Text",
      badge: textCount > 0 ? textCount : void 0,
      icon: /* @__PURE__ */ jsxs44("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx53("polyline", { points: "4 7 4 4 20 4 20 7" }),
        /* @__PURE__ */ jsx53("line", { x1: "9", y1: "20", x2: "15", y2: "20" }),
        /* @__PURE__ */ jsx53("line", { x1: "12", y1: "4", x2: "12", y2: "20" })
      ] })
    },
    {
      id: "finishing",
      label: "Finish",
      icon: /* @__PURE__ */ jsx53("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx53("polyline", { points: "20 6 9 17 4 12" }) })
    }
  ];
  const mobilePopoverContent = isMobile && activePanel ? /* @__PURE__ */ jsxs44("div", { style: { padding: "4px 0" }, children: [
    activePanel === "color" && /* @__PURE__ */ jsxs44("div", { className: "tooltip-color-wrap", children: [
      /* @__PURE__ */ jsx53("div", { className: "layer-numbers-bar", children: configStore2.parts.map((part, idx) => {
        const isActive = configStore2.activePartId === part.id;
        return /* @__PURE__ */ jsxs44(
          "button",
          {
            className: `layer-num-btn ${isActive ? "active" : ""}`,
            onClick: () => configStore2.setActivePart(part.id),
            children: [
              /* @__PURE__ */ jsx53("span", { className: "layer-dot", style: { backgroundColor: part.color } }),
              /* @__PURE__ */ jsxs44("span", { className: "layer-num", children: [
                "#",
                idx + 1
              ] })
            ]
          },
          part.id
        );
      }) }),
      /* @__PURE__ */ jsxs44("div", { className: "swatch-ribbon", children: [
        COLOR_PALETTE2.map((hex) => {
          const isSelected = activePart?.color.toLowerCase() === hex.toLowerCase();
          return /* @__PURE__ */ jsx53(
            "button",
            {
              className: `micro-swatch ${isSelected ? "selected" : ""}`,
              style: { backgroundColor: hex },
              onClick: () => {
                if (configStore2.activePartId) {
                  configStore2.setPartColor(configStore2.activePartId, hex);
                }
              }
            },
            hex
          );
        }),
        configStore2.activePartId && /* @__PURE__ */ jsxs44("label", { className: "native-picker-trigger", title: "Custom Color", children: [
          /* @__PURE__ */ jsx53("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx53("path", { d: "M12 5v14M5 12h14" }) }),
          /* @__PURE__ */ jsx53(
            "input",
            {
              type: "color",
              value: activePart?.color || "#ffffff",
              onChange: (e) => configStore2.setPartColor(configStore2.activePartId, e.target.value),
              className: "hidden-color-input"
            }
          )
        ] })
      ] })
    ] }),
    activePanel === "texture" && /* @__PURE__ */ jsx53("div", { className: "tooltip-texture-wrap", children: ["mesh", "knit", "smooth"].map((type) => {
      const isSelected = configStore2.fabricType === type;
      return /* @__PURE__ */ jsx53(
        "button",
        {
          className: `micro-texture-btn ${isSelected ? "selected" : ""}`,
          onClick: () => configStore2.setFabricType(type),
          children: /* @__PURE__ */ jsx53("span", { className: "texture-label capitalize", children: type })
        },
        type
      );
    }) }),
    activePanel === "logo" && /* @__PURE__ */ jsxs44("div", { className: "tooltip-logo-wrap", children: [
      /* @__PURE__ */ jsx53(
        "input",
        {
          type: "file",
          ref: fileInputRef,
          onChange: handleFileUpload,
          accept: "image/*",
          style: { display: "none" }
        }
      ),
      /* @__PURE__ */ jsxs44(
        "button",
        {
          className: "micro-upload-btn",
          onClick: () => fileInputRef.current?.click(),
          children: [
            /* @__PURE__ */ jsx53("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx53("path", { d: "M12 5v14M5 12h14" }) }),
            /* @__PURE__ */ jsx53("span", { children: "Upload Logo" })
          ]
        }
      ),
      logoCount > 0 && /* @__PURE__ */ jsx53("div", { className: "chips-scroller", children: configStore2.logos.filter((l) => !l.isText).map((logo) => {
        const isSelected = configStore2.selectedLogoId === logo.id;
        return /* @__PURE__ */ jsxs44(
          "div",
          {
            className: `micro-chip ${isSelected ? "active" : ""}`,
            onClick: () => configStore2.setSelectedLogo(logo.id),
            children: [
              /* @__PURE__ */ jsx53("img", { src: logo.src, alt: "", className: "chip-img" }),
              /* @__PURE__ */ jsx53(
                "button",
                {
                  className: "chip-del",
                  onClick: (e) => {
                    e.stopPropagation();
                    configStore2.removeLogo(logo.id);
                  },
                  children: "\u2715"
                }
              )
            ]
          },
          logo.id
        );
      }) })
    ] }),
    activePanel === "text" && /* @__PURE__ */ jsxs44("div", { className: "tooltip-text-wrap", children: [
      /* @__PURE__ */ jsxs44("div", { className: "text-inline-form", children: [
        /* @__PURE__ */ jsx53(
          "input",
          {
            type: "text",
            value: newTextStr,
            onChange: (e) => setNewTextStr(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleAddText(),
            placeholder: "Player # / Name",
            className: "micro-text-input",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsx53(
          "button",
          {
            className: "micro-font-toggle",
            onClick: () => setSelectedFont((f) => f === "Impact" ? "Arial" : "Impact"),
            title: "Toggle Font",
            children: selectedFont === "Impact" ? "Impact" : "Sans"
          }
        ),
        /* @__PURE__ */ jsx53("button", { className: "micro-add-btn", onClick: handleAddText, title: "Add Text", children: "+" })
      ] }),
      /* @__PURE__ */ jsxs44("div", { className: "swatch-ribbon", style: { marginTop: "8px" }, children: [
        COLOR_PALETTE2.map((hex) => {
          const activeText = configStore2.texts.find((t) => t.id === configStore2.selectedLogoId);
          const currentHex = activeText?.textColor || selectedTextColor;
          const isSelected = currentHex.toLowerCase() === hex.toLowerCase();
          return /* @__PURE__ */ jsx53(
            "button",
            {
              className: `micro-swatch ${isSelected ? "selected" : ""}`,
              style: { backgroundColor: hex },
              onClick: () => handleTextColorSelect(hex),
              title: hex
            },
            hex
          );
        }),
        /* @__PURE__ */ jsxs44("label", { className: "native-picker-trigger", title: "Custom Text Color", children: [
          /* @__PURE__ */ jsx53("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx53("path", { d: "M12 5v14M5 12h14" }) }),
          /* @__PURE__ */ jsx53(
            "input",
            {
              type: "color",
              value: selectedTextColor,
              onChange: (e) => handleTextColorSelect(e.target.value),
              className: "hidden-color-input"
            }
          )
        ] })
      ] }),
      textCount > 0 && /* @__PURE__ */ jsx53("div", { className: "chips-scroller", style: { marginTop: "8px" }, children: configStore2.texts.map((textItem) => {
        const isSelected = configStore2.selectedLogoId === textItem.id;
        return /* @__PURE__ */ jsxs44(
          "div",
          {
            className: `micro-chip text-chip ${isSelected ? "active" : ""}`,
            onClick: () => configStore2.setSelectedText(textItem.id),
            children: [
              /* @__PURE__ */ jsx53(
                "span",
                {
                  className: "chip-dot",
                  style: {
                    backgroundColor: textItem.textColor || textItem.color || "#ffffff",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "4px"
                  }
                }
              ),
              /* @__PURE__ */ jsx53("span", { className: "chip-label", children: textItem.text }),
              /* @__PURE__ */ jsx53(
                "button",
                {
                  className: "chip-del",
                  onClick: (e) => {
                    e.stopPropagation();
                    configStore2.removeText(textItem.id);
                  },
                  children: "\u2715"
                }
              )
            ]
          },
          textItem.id
        );
      }) })
    ] }),
    activePanel === "finishing" && /* @__PURE__ */ jsx53("div", { className: "tooltip-finishing-wrap", children: /* @__PURE__ */ jsxs44(
      "button",
      {
        className: "micro-order-btn",
        onClick: () => {
          onSelectPanel(null);
          configStore2.triggerGenerateScreenshots();
          configStore2.setShowOrderForm(true);
        },
        children: [
          /* @__PURE__ */ jsx53("span", { children: "Finish & Request Order" }),
          /* @__PURE__ */ jsx53("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx53("path", { d: "M5 12h14M12 5l7 7-7 7" }) })
        ]
      }
    ) })
  ] }) : void 0;
  return /* @__PURE__ */ jsx53(
    FloatingControlDock,
    {
      items: dockItems,
      activeId: activePanel,
      onSelect: (id) => onSelectPanel(id === activePanel ? null : id),
      activePopoverContent: mobilePopoverContent,
      onClosePopover: () => onSelectPanel(null),
      position: "bottom",
      elevation: "float"
    }
  );
});

// apps/sportswear-configurator/src/components/OrderFormModal.tsx
import { observer as observer3 } from "mobx-react-lite";
import { jsx as jsx54, jsxs as jsxs45 } from "react/jsx-runtime";
var OrderFormModal = observer3(() => {
  const configStore2 = useConfigStore();
  const generateAndDownloadPDF = () => {
    if (typeof window !== "undefined" && window.kendo && window.kendo.drawing) {
      window.kendo.drawing.drawDOM("#TechPackExport", {
        scale: 1,
        height: "297mm",
        width: "210mm"
      }).then(function(group) {
        window.kendo.drawing.pdf.toBlob(group, (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Sinalli_Tech_Pack.pdf";
          a.click();
        });
      });
    } else {
      console.error("Kendo not loaded. Make sure kendo.all.min.js is in index.html");
    }
  };
  const modalFooter = /* @__PURE__ */ jsxs45("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", width: "100%" }, children: [
    /* @__PURE__ */ jsx54(
      "button",
      {
        type: "button",
        className: "btn-print",
        onClick: generateAndDownloadPDF,
        style: {
          background: "linear-gradient(135deg, #4338CA 0%, #3730A3 100%)",
          color: "#ffffff",
          border: "none",
          borderRadius: "9999px",
          padding: "8px 20px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(67, 56, 202, 0.25)",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px"
        },
        children: "Download PDF"
      }
    ),
    /* @__PURE__ */ jsx54(
      "button",
      {
        type: "button",
        onClick: () => configStore2.setShowOrderForm(false),
        style: {
          background: "rgba(15, 10, 30, 0.06)",
          color: "#160A30",
          border: "1px solid rgba(15, 10, 30, 0.12)",
          borderRadius: "9999px",
          padding: "8px 18px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer"
        },
        children: "Close"
      }
    )
  ] });
  return /* @__PURE__ */ jsx54(
    FrostedModalDialog,
    {
      title: "Tech Pack / Order Form",
      subtitle: "Sportswear Configurator Details",
      isOpen: configStore2.showOrderForm,
      onClose: () => configStore2.setShowOrderForm(false),
      size: "xl",
      footer: modalFooter,
      children: /* @__PURE__ */ jsx54("div", { className: "order-form-content", style: { padding: 0 }, children: /* @__PURE__ */ jsxs45("div", { id: "TechPackExport", className: "tech-pack-a4", children: [
        /* @__PURE__ */ jsxs45("div", { className: "tp-header", children: [
          /* @__PURE__ */ jsxs45("div", { className: "tp-brand", children: [
            /* @__PURE__ */ jsx54("div", { className: "tp-logo-placeholder", children: "Trikomi" }),
            /* @__PURE__ */ jsx54("h1", { children: "TECH PACK / ORDER FORM" })
          ] }),
          /* @__PURE__ */ jsxs45("div", { className: "tp-meta", children: [
            /* @__PURE__ */ jsxs45("div", { className: "tp-meta-item", children: [
              /* @__PURE__ */ jsx54("span", { className: "tp-meta-label", children: "Date Generated" }),
              /* @__PURE__ */ jsx54("span", { className: "tp-meta-value", children: (/* @__PURE__ */ new Date()).toLocaleDateString() })
            ] }),
            /* @__PURE__ */ jsxs45("div", { className: "tp-meta-item", children: [
              /* @__PURE__ */ jsx54("span", { className: "tp-meta-label", children: "Garment Type" }),
              /* @__PURE__ */ jsx54("span", { className: "tp-meta-value", children: "Sportswear (Custom)" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs45("div", { className: "tp-section", children: [
          /* @__PURE__ */ jsx54("h3", { className: "tp-section-title", children: "3D Visualizations" }),
          /* @__PURE__ */ jsx54("div", { className: "tp-renders-grid", children: configStore2.orderScreenshots.map((src, i) => /* @__PURE__ */ jsxs45("div", { className: "tp-render-item", children: [
            /* @__PURE__ */ jsx54("img", { src, alt: `View ${i}` }),
            /* @__PURE__ */ jsx54("span", { className: "tp-render-label", children: ["FRONT", "BACK", "LEFT", "RIGHT"][i] })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxs45("div", { className: "tp-row", children: [
          /* @__PURE__ */ jsxs45("div", { className: "tp-section", style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx54("h3", { className: "tp-section-title", children: "Material Spec" }),
            /* @__PURE__ */ jsxs45("div", { className: "tp-box", children: [
              /* @__PURE__ */ jsx54("span", { className: "tp-label", children: "Fabric Type:" }),
              /* @__PURE__ */ jsx54("span", { className: "tp-value", children: configStore2.fabricType.toUpperCase() })
            ] })
          ] }),
          /* @__PURE__ */ jsxs45("div", { className: "tp-section", style: { flex: 2 }, children: [
            /* @__PURE__ */ jsx54("h3", { className: "tp-section-title", children: "Color Breakdown" }),
            /* @__PURE__ */ jsx54("div", { className: "tp-colors-grid", children: configStore2.parts.map((part) => /* @__PURE__ */ jsxs45("div", { className: "tp-color-item", children: [
              /* @__PURE__ */ jsx54("div", { className: "tp-color-swatch", style: { background: part.color } }),
              /* @__PURE__ */ jsxs45("div", { className: "tp-color-info", children: [
                /* @__PURE__ */ jsx54("span", { className: "tp-color-name", children: part.name.toUpperCase() }),
                /* @__PURE__ */ jsx54("span", { className: "tp-color-hex", children: part.color })
              ] })
            ] }, part.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs45("div", { className: "tp-section", children: [
          /* @__PURE__ */ jsx54("h3", { className: "tp-section-title", children: "Graphics & Typography" }),
          /* @__PURE__ */ jsxs45("div", { className: "tp-assets-list", children: [
            configStore2.logos.length === 0 && configStore2.texts.length === 0 && /* @__PURE__ */ jsx54("p", { className: "tp-empty", children: "No graphics or text applied to this garment." }),
            configStore2.logos.map((logo) => /* @__PURE__ */ jsxs45("div", { className: "tp-asset-item", children: [
              /* @__PURE__ */ jsx54("div", { className: "tp-asset-thumb", children: /* @__PURE__ */ jsx54("img", { src: logo.src, alt: "logo" }) }),
              /* @__PURE__ */ jsxs45("div", { className: "tp-asset-details", children: [
                /* @__PURE__ */ jsx54("strong", { children: "CUSTOM LOGO" }),
                /* @__PURE__ */ jsxs45("span", { children: [
                  "W: ",
                  Math.round(logo.width),
                  "px \xA0|\xA0 H: ",
                  Math.round(logo.height),
                  "px \xA0|\xA0 Rot: ",
                  Math.round(logo.rotation || 0),
                  "\xB0"
                ] })
              ] })
            ] }, logo.id)),
            configStore2.texts.map((text) => /* @__PURE__ */ jsxs45("div", { className: "tp-asset-item", children: [
              /* @__PURE__ */ jsx54("div", { className: "tp-asset-thumb tp-text-thumb", children: /* @__PURE__ */ jsx54("span", { style: { fontFamily: text.fontFamily, color: text.textColor || text.color || "#ffffff" }, children: "T" }) }),
              /* @__PURE__ */ jsxs45("div", { className: "tp-asset-details", children: [
                /* @__PURE__ */ jsxs45("strong", { children: [
                  '"',
                  text.text,
                  '"'
                ] }),
                /* @__PURE__ */ jsxs45("span", { children: [
                  "Font: ",
                  text.fontFamily,
                  " \xA0|\xA0 Color: ",
                  text.textColor || text.color || "#ffffff",
                  " \xA0|\xA0 Size: ",
                  Math.round(text.height),
                  "px"
                ] })
              ] })
            ] }, text.id))
          ] })
        ] })
      ] }) })
    }
  );
});

// tests/sportswear-redesign.unit.test.mjs
function withStore(element) {
  return React26.createElement(ConfigStoreContext.Provider, { value: configStore }, element);
}
test("SportswearInspector renders GlassInspectorDrawer with all 5 tabs", () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {
        },
        activeTab: "color",
        onTabChange: () => {
        }
      })
    )
  );
  assert.ok(html.includes("vs-glass-inspector-drawer"), "Should render drawer container");
  assert.ok(html.includes("Customize Garment"), "Should render drawer title");
  assert.ok(html.includes("Sportswear 3D Studio"), "Should render drawer subtitle");
  assert.ok(html.includes("Color"), "Should render Color tab");
  assert.ok(html.includes("Fabric"), "Should render Fabric tab");
  assert.ok(html.includes("Logo"), "Should render Logo tab");
  assert.ok(html.includes("Text"), "Should render Text tab");
  assert.ok(html.includes("Finish"), "Should render Finish tab");
  assert.ok(html.includes("Generate Tech Pack &amp; Order") || html.includes("Generate Tech Pack & Order"), "Should render footer action");
});
test('SportswearInspector renders Color panel controls when activeTab="color"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {
        },
        activeTab: "color",
        onTabChange: () => {
        }
      })
    )
  );
  assert.ok(html.includes("Select Layer"), "Should render layer selection");
  assert.ok(html.includes("Palette Swatches"), "Should render palette swatches ribbon");
});
test('SportswearInspector renders Fabric panel controls when activeTab="texture"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {
        },
        activeTab: "texture",
        onTabChange: () => {
        }
      })
    )
  );
  assert.ok(html.includes("Garment Fabric Weave"), "Should render fabric weave title");
  assert.ok(html.includes("mesh Weave"), "Should render mesh option");
  assert.ok(html.includes("knit Weave"), "Should render knit option");
  assert.ok(html.includes("smooth Weave"), "Should render smooth option");
});
test('SportswearInspector renders Logo panel controls when activeTab="logo"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {
        },
        activeTab: "logo",
        onTabChange: () => {
        }
      })
    )
  );
  assert.ok(html.includes("Upload Vector / Image Decal"), "Should render upload decal button");
  assert.ok(html.includes("Applied Decals"), "Should render applied decals header");
});
test('SportswearInspector renders Text panel controls when activeTab="text"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {
        },
        activeTab: "text",
        onTabChange: () => {
        }
      })
    )
  );
  assert.ok(html.includes("Add Player Name / Number"), "Should render player name/number header");
  assert.ok(html.includes('placeholder="e.g. 10 / NEYMAR"'), "Should render text input");
  assert.ok(html.includes("Active Embroidery Overlays"), "Should render active overlays header");
});
test('SportswearInspector renders Finishing panel controls when activeTab="finishing"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(SportswearInspector, {
        isOpen: true,
        onClose: () => {
        },
        activeTab: "finishing",
        onTabChange: () => {
        }
      })
    )
  );
  assert.ok(html.includes("Customization Summary"), "Should render customization summary");
  assert.ok(html.includes("Quality Verification"), "Should render quality verification");
  assert.ok(html.includes("Finish &amp; Request Tech Pack") || html.includes("Finish & Request Tech Pack"), "Should render finish button");
});
test("MobileConfigDock renders FloatingControlDock with 5 tool tabs and live badges", () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(MobileConfigDock, {
        activePanel: null,
        onSelectPanel: () => {
        },
        isMobile: false
      })
    )
  );
  assert.ok(html.includes("vs-floating-control-dock"), "Should render floating dock container");
  assert.ok(html.includes("Color"), "Should render Color tool");
  assert.ok(html.includes("Fabric"), "Should render Fabric tool");
  assert.ok(html.includes("Logo"), "Should render Logo tool");
  assert.ok(html.includes("Text"), "Should render Text tool");
  assert.ok(html.includes("Finish"), "Should render Finish tool");
});
test('MobileConfigDock renders spring-up popover bubble when isMobile=true and activePanel="color"', () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(MobileConfigDock, {
        activePanel: "color",
        onSelectPanel: () => {
        },
        isMobile: true
      })
    )
  );
  assert.ok(html.includes("vs-floating-dock-popover-bubble"), "Should render popover bubble on mobile");
  assert.ok(html.includes("tooltip-color-wrap"), "Should render mobile color panel");
  assert.ok(html.includes("layer-numbers-bar"), "Should render layer number selector");
});
test("MobileConfigDock suppresses popover bubble when isMobile=false (Desktop / Tablet)", () => {
  const html = renderToStaticMarkup(
    withStore(
      React26.createElement(MobileConfigDock, {
        activePanel: "color",
        onSelectPanel: () => {
        },
        isMobile: false
      })
    )
  );
  assert.ok(!html.includes("vs-floating-dock-popover-bubble"), "Should suppress popover bubble when not mobile");
});
test("OrderFormModal renders FrostedModalDialog when showOrderForm=true", () => {
  configStore.setShowOrderForm(true);
  const html = renderToStaticMarkup(
    withStore(React26.createElement(OrderFormModal))
  );
  assert.ok(html.includes("vs-frosted-modal-backdrop"), "Should render frosted modal backdrop");
  assert.ok(html.includes("vs-frosted-modal-dialog"), "Should render frosted modal dialog");
  assert.ok(html.includes("Tech Pack / Order Form"), "Should render modal title");
  assert.ok(html.includes("Sportswear Configurator Details"), "Should render modal subtitle");
  assert.ok(html.includes("TechPackExport"), "Should render tech pack export DOM element");
  assert.ok(html.includes("Download PDF"), "Should render PDF download button");
  configStore.setShowOrderForm(false);
});
test("OrderFormModal returns null when showOrderForm=false", () => {
  configStore.setShowOrderForm(false);
  const html = renderToStaticMarkup(
    withStore(React26.createElement(OrderFormModal))
  );
  assert.equal(html, "", "Should render nothing when modal is closed");
});
test("AppHeaderBar connects dynamically to VictorShellThemeProvider accent", () => {
  function ThemeStage() {
    const { accent, setAccent } = useVictorShellTheme();
    return React26.createElement(AppHeaderBar, {
      brandTitle: "TRIKOMI",
      productTitle: "SPORTSWEAR LAB",
      theme: accent,
      onThemeChange: setAccent,
      showThemeSwitcher: true
    });
  }
  const html = renderToStaticMarkup(
    React26.createElement(
      VictorShellThemeProvider,
      { initialAccent: "indigo" },
      React26.createElement(ThemeStage)
    )
  );
  assert.ok(html.includes('data-accent="indigo"'), 'Root should carry initial data-accent="indigo"');
  assert.ok(html.includes("vs-theme-accent-btn--indigo is-active"), "AppHeaderBar should have active indigo theme pill");
});
test("VictorShellThemeProvider persists custom theme selection across re-renders without resetting to indigo", () => {
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
      this.dispatchEvent(new MockEvent("click", { bubbles: true, cancelable: true }));
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
  globalThis.window = win;
  globalThis.document = mockDoc;
  globalThis.Event = MockEvent;
  let currentContext = null;
  let triggerUnrelatedReRender = null;
  let renderCount = 0;
  function InteractiveHarness() {
    const themeContext = useVictorShellTheme();
    currentContext = themeContext;
    const [counter, setCounter] = React26.useState(0);
    triggerUnrelatedReRender = () => setCounter((c) => c + 1);
    renderCount++;
    return React26.createElement(
      "div",
      { id: "test-harness" },
      React26.createElement(AppHeaderBar, {
        brandTitle: "TRIKOMI",
        productTitle: "SPORTSWEAR LAB",
        theme: themeContext.accent,
        onThemeChange: themeContext.setAccent,
        showThemeSwitcher: true
      }),
      React26.createElement("span", { id: "counter-val" }, counter)
    );
  }
  const container = mockDoc.createElement("div");
  const root = createRoot(container);
  act(() => {
    root.render(
      React26.createElement(
        VictorShellThemeProvider,
        { initialAccent: "indigo" },
        React26.createElement(InteractiveHarness)
      )
    );
  });
  assert.equal(currentContext.accent, "indigo", "Initial theme context must be indigo");
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
  assert.equal(currentContext.accent, "orchid", "Provider context accent must update to orchid after click");
  assert.equal(document.documentElement.getAttribute("data-accent"), "orchid", "document.documentElement data-accent must update to orchid");
  assert.equal(rootWrapper.attributes["data-accent"], "orchid", "Provider root data-accent must update to orchid");
  assert.ok(orchidBtn.className.includes("is-active"), "Orchid button must be active");
  assert.ok(!indigoBtn.className.includes("is-active"), "Indigo button must not be active");
  const rendersBefore = renderCount;
  act(() => {
    triggerUnrelatedReRender();
  });
  assert.ok(renderCount > rendersBefore, "Component should have re-rendered");
  assert.equal(currentContext.accent, "orchid", "Theme must remain orchid across unrelated re-render without resetting to indigo");
  assert.equal(document.documentElement.getAttribute("data-accent"), "orchid", "document data-accent must remain orchid across unrelated re-render");
  assert.equal(rootWrapper.attributes["data-accent"], "orchid", "Provider root data-accent must remain orchid across unrelated re-render");
  const violetBtn = container.find((el) => el.attributes["aria-label"] === "Royal Violet Theme");
  assert.ok(violetBtn, "Violet theme button must exist in AppHeaderBar");
  act(() => {
    violetBtn.click();
  });
  assert.equal(currentContext.accent, "violet", "Provider context accent must update to violet");
  assert.equal(document.documentElement.getAttribute("data-accent"), void 0, "document data-accent must be removed for violet");
  assert.equal(rootWrapper.attributes["data-accent"], "violet", "Provider root data-accent must update to violet");
  assert.ok(violetBtn.className.includes("is-active"), "Violet button must be active");
  act(() => {
    triggerUnrelatedReRender();
  });
  assert.equal(currentContext.accent, "violet", "Theme must remain violet across re-render without resetting to indigo");
  assert.equal(document.documentElement.getAttribute("data-accent"), void 0, "document data-accent must remain undefined for violet across re-render");
  assert.equal(rootWrapper.attributes["data-accent"], "violet", "Provider root data-accent must remain violet across re-render");
  act(() => {
    root.unmount();
  });
});
