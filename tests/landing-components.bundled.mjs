// tests/landing-components.unit.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

// packages/ui-kit/src/components/configurator/FloatingControlDock.tsx
import { useEffect as useEffect7, useRef as useRef8 } from "react";
import { jsx as jsx23, jsxs as jsxs15 } from "react/jsx-runtime";

// packages/ui-kit/src/components/configurator/GlassInspectorDrawer.tsx
import { useEffect as useEffect8, useState as useState15 } from "react";
import { jsx as jsx24, jsxs as jsxs16 } from "react/jsx-runtime";

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
var LandingNav = ({
  links,
  orientation = "horizontal",
  onLinkClick,
  className = "",
  ariaLabel = "Product navigation"
}) => {
  return /* @__PURE__ */ jsx34(
    "nav",
    {
      className: `vs-landing-nav vs-landing-nav--${orientation} ${className}`.trim(),
      "aria-label": ariaLabel,
      role: "navigation",
      children: /* @__PURE__ */ jsx34("ul", { className: "vs-landing-nav__list", children: links.map((link, idx) => {
        const isLinkActive = Boolean(link.active);
        const itemKey = link.id || `${link.label}-${idx}`;
        const handleClick = (e) => {
          if (link.onClick) {
            e.preventDefault();
            link.onClick();
          }
          if (onLinkClick) {
            onLinkClick(link);
          }
        };
        return /* @__PURE__ */ jsx34("li", { className: "vs-landing-nav__item", children: /* @__PURE__ */ jsxs25(
          "a",
          {
            href: link.href || "#",
            onClick: handleClick,
            className: `vs-landing-nav__link ${isLinkActive ? "is-active" : ""}`,
            "aria-current": isLinkActive ? "page" : void 0,
            target: link.external ? "_blank" : void 0,
            rel: link.external ? "noopener noreferrer" : void 0,
            children: [
              /* @__PURE__ */ jsx34("span", { className: "vs-landing-nav__label", children: link.label }),
              link.badge && /* @__PURE__ */ jsx34("span", { className: "vs-landing-nav__badge", children: link.badge }),
              isLinkActive && /* @__PURE__ */ jsx34("span", { className: "vs-landing-nav__indicator", "aria-hidden": "true" })
            ]
          }
        ) }, itemKey);
      }) })
    }
  );
};

// packages/ui-kit/src/components/landing/LandingHeader.tsx
import { useState as useState22, useEffect as useEffect10, useCallback as useCallback5 } from "react";
import { jsx as jsx35, jsxs as jsxs26 } from "react/jsx-runtime";
var THEME_OPTIONS = [
  { value: "violet", label: "Violet", color: "#6E2CF2" },
  { value: "indigo", label: "Indigo", color: "#4338CA" },
  { value: "orchid", label: "Orchid", color: "#A21CAF" }
];
var LandingHeader = ({
  productTitle,
  productBadge,
  brandLogo,
  brandName = "VictorShell",
  brandHref = "/",
  navLinks = [],
  onExploreDemo,
  exploreDemoLabel = "Explore Demo",
  exploreDemoHref,
  showThemeSwitcher = true,
  activeTheme: controlledTheme,
  onThemeChange,
  secondaryAction,
  sticky = true,
  className = ""
}) => {
  const contextTheme = useVictorShellTheme();
  const currentTheme = controlledTheme ?? contextTheme.accent;
  const handleThemeSelect = (themeValue) => {
    contextTheme.setAccent(themeValue);
    if (onThemeChange) {
      onThemeChange(themeValue);
    }
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState22(false);
  const handleKeyDown = useCallback5((e) => {
    if (e.key === "Escape" && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen]);
  useEffect10(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
  useEffect10(() => {
    if (typeof document === "undefined") return;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);
  const handleExploreClick = (e) => {
    if (onExploreDemo) {
      e.preventDefault();
      onExploreDemo();
      setMobileMenuOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs26(
    "header",
    {
      className: `vs-landing-header ${sticky ? "vs-landing-header--sticky" : ""} ${className}`.trim(),
      "data-testid": "landing-header",
      children: [
        /* @__PURE__ */ jsxs26("div", { className: "vs-landing-header__container", children: [
          /* @__PURE__ */ jsxs26("div", { className: "vs-landing-header__brand-group", children: [
            /* @__PURE__ */ jsxs26(
              "a",
              {
                href: brandHref,
                className: "vs-landing-header__brand-link",
                "aria-label": `${brandName} Home`,
                children: [
                  brandLogo ? /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__logo-custom", children: brandLogo }) : /* @__PURE__ */ jsx35("div", { className: "vs-landing-header__brand-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsxs26("svg", { viewBox: "0 0 24 24", width: "22", height: "22", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsx35("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
                    /* @__PURE__ */ jsx35("polyline", { points: "2 17 12 22 22 17" }),
                    /* @__PURE__ */ jsx35("polyline", { points: "2 12 12 17 22 12" })
                  ] }) }),
                  /* @__PURE__ */ jsxs26("div", { className: "vs-landing-header__brand-meta", children: [
                    /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__brand-title", children: brandName }),
                    /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__brand-divider", "aria-hidden": "true", children: "/" }),
                    /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__product-title", "data-testid": "product-title", children: productTitle })
                  ] })
                ]
              }
            ),
            productBadge && /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__badge", "data-testid": "product-badge", children: productBadge })
          ] }),
          navLinks.length > 0 && /* @__PURE__ */ jsx35("div", { className: "vs-landing-header__nav-wrapper", children: /* @__PURE__ */ jsx35(
            LandingNav,
            {
              links: navLinks,
              orientation: "horizontal",
              className: "vs-landing-header__desktop-nav"
            }
          ) }),
          /* @__PURE__ */ jsxs26("div", { className: "vs-landing-header__actions", children: [
            showThemeSwitcher && /* @__PURE__ */ jsx35(
              "div",
              {
                className: "vs-landing-header__theme-switcher",
                role: "radiogroup",
                "aria-label": "Theme Accent Switcher",
                "data-testid": "landing-theme-switcher",
                children: THEME_OPTIONS.map((theme) => {
                  const isSelected = currentTheme === theme.value;
                  return /* @__PURE__ */ jsx35(
                    "button",
                    {
                      type: "button",
                      role: "radio",
                      "aria-checked": isSelected,
                      "aria-label": `${theme.label} theme`,
                      title: `${theme.label} theme`,
                      className: `vs-landing-header__theme-btn ${isSelected ? "is-active" : ""}`,
                      onClick: () => handleThemeSelect(theme.value),
                      style: { "--theme-swatch-color": theme.color },
                      children: /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__theme-dot" })
                    },
                    theme.value
                  );
                })
              }
            ),
            secondaryAction && /* @__PURE__ */ jsx35("div", { className: "vs-landing-header__secondary-action", children: secondaryAction }),
            /* @__PURE__ */ jsxs26(
              "a",
              {
                href: exploreDemoHref || "#demo",
                onClick: handleExploreClick,
                className: "vs-landing-header__cta-btn vs-btn-primary",
                "data-testid": "explore-demo-btn",
                role: "button",
                children: [
                  /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__cta-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx35("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ jsx35("polygon", { points: "5 3 19 12 5 21 5 3" }) }) }),
                  /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__cta-text vs-landing-header__cta-text--full", children: exploreDemoLabel }),
                  /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__cta-text vs-landing-header__cta-text--short", "aria-hidden": "true", children: "Demo" })
                ]
              }
            ),
            /* @__PURE__ */ jsx35(
              "button",
              {
                type: "button",
                className: "vs-landing-header__mobile-toggle",
                "aria-label": mobileMenuOpen ? "Close navigation menu" : "Open navigation menu",
                "aria-expanded": mobileMenuOpen,
                onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                "data-testid": "mobile-nav-toggle",
                children: mobileMenuOpen ? /* @__PURE__ */ jsxs26("svg", { viewBox: "0 0 24 24", width: "22", height: "22", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx35("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ jsx35("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] }) : /* @__PURE__ */ jsxs26("svg", { viewBox: "0 0 24 24", width: "22", height: "22", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx35("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                  /* @__PURE__ */ jsx35("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                  /* @__PURE__ */ jsx35("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
                ] })
              }
            )
          ] })
        ] }),
        mobileMenuOpen && /* @__PURE__ */ jsxs26(
          "div",
          {
            className: "vs-landing-header__mobile-drawer",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Mobile Navigation",
            "data-testid": "mobile-drawer",
            children: [
              /* @__PURE__ */ jsx35(
                "div",
                {
                  className: "vs-landing-header__mobile-backdrop",
                  onClick: () => setMobileMenuOpen(false),
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxs26("div", { className: "vs-landing-header__mobile-panel", children: [
                /* @__PURE__ */ jsxs26("div", { className: "vs-landing-header__mobile-panel-header", children: [
                  /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__mobile-title", children: productTitle }),
                  /* @__PURE__ */ jsx35(
                    "button",
                    {
                      type: "button",
                      className: "vs-landing-header__mobile-close",
                      onClick: () => setMobileMenuOpen(false),
                      "aria-label": "Close menu",
                      children: /* @__PURE__ */ jsxs26("svg", { viewBox: "0 0 24 24", width: "20", height: "20", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [
                        /* @__PURE__ */ jsx35("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                        /* @__PURE__ */ jsx35("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                      ] })
                    }
                  )
                ] }),
                navLinks.length > 0 && /* @__PURE__ */ jsx35(
                  LandingNav,
                  {
                    links: navLinks,
                    orientation: "vertical",
                    onLinkClick: () => setMobileMenuOpen(false),
                    className: "vs-landing-header__mobile-nav"
                  }
                ),
                /* @__PURE__ */ jsxs26("div", { className: "vs-landing-header__mobile-footer", children: [
                  showThemeSwitcher && /* @__PURE__ */ jsxs26("div", { className: "vs-landing-header__mobile-theme-row", children: [
                    /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__mobile-theme-label", children: "Accent Theme" }),
                    /* @__PURE__ */ jsx35(
                      "div",
                      {
                        className: "vs-landing-header__theme-switcher",
                        role: "radiogroup",
                        "aria-label": "Theme Accent Switcher",
                        children: THEME_OPTIONS.map((theme) => {
                          const isSelected = currentTheme === theme.value;
                          return /* @__PURE__ */ jsx35(
                            "button",
                            {
                              type: "button",
                              role: "radio",
                              "aria-checked": isSelected,
                              "aria-label": `${theme.label} theme`,
                              className: `vs-landing-header__theme-btn ${isSelected ? "is-active" : ""}`,
                              onClick: () => handleThemeSelect(theme.value),
                              style: { "--theme-swatch-color": theme.color },
                              children: /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__theme-dot" })
                            },
                            theme.value
                          );
                        })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs26(
                    "a",
                    {
                      href: exploreDemoHref || "#demo",
                      onClick: handleExploreClick,
                      className: "vs-landing-header__cta-btn vs-btn-primary vs-landing-header__mobile-cta",
                      role: "button",
                      children: [
                        /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__cta-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx35("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ jsx35("polygon", { points: "5 3 19 12 5 21 5 3" }) }) }),
                        /* @__PURE__ */ jsx35("span", { className: "vs-landing-header__cta-text", children: exploreDemoLabel })
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/LandingFooter.tsx
import "react";
import { jsx as jsx36, jsxs as jsxs27 } from "react/jsx-runtime";
var DEFAULT_LINK_COLUMNS = [
  {
    title: "3D Platform",
    links: [
      { label: "3D Model Viewer", href: "/apps/viewer/index.html" },
      { label: "Jewelry Studio", href: "/apps/jewelry-configurator/index.html" },
      { label: "Sportswear Customizer", href: "/apps/sportswear-configurator/index.html" },
      { label: "Box Packaging Lab", href: "/apps/box-configurator/index.html" },
      { label: "Eyewear AR Try-On", href: "/apps/eyewear-tryon/index.html" },
      { label: "Face Motion Capture", href: "/apps/face-mocap/index.html" },
      { label: "360 Virtual Tour", href: "/apps/360tour/index.html" }
    ]
  },
  {
    title: "Developer SDK",
    links: [
      { label: "Documentation", href: "/docs/index.html" },
      { label: "WebGPU Pipeline", href: "/docs/index.html#build" },
      { label: "Plugin Architecture", href: "/docs/index.html#plugins" },
      { label: "Asset Management", href: "/docs/index.html#assets" }
    ]
  },
  {
    title: "Technology",
    links: [
      { label: "Three.js WebGPU", href: "https://threejs.org", external: true },
      { label: "MediaPipe Vision", href: "https://developers.google.com/mediapipe", external: true },
      { label: "React 19 & MobX", href: "https://react.dev", external: true }
    ]
  }
];
var LandingFooter = ({
  productTitle,
  productTagline = "High-performance interactive 3D WebGPU visualization and customization engine.",
  brandName = "VictorShell",
  onExploreDemo,
  exploreDemoLabel = "Explore Interactive Demo",
  linkColumns = DEFAULT_LINK_COLUMNS,
  sdkVersion = "@trikomi/core WebGPU 3D Engine",
  showBackToTop = true,
  copyrightYear = (/* @__PURE__ */ new Date()).getFullYear(),
  className = ""
}) => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxs27(
    "footer",
    {
      className: `vs-landing-footer ${className}`.trim(),
      role: "contentinfo",
      "data-testid": "landing-footer",
      children: [
        /* @__PURE__ */ jsx36("div", { className: "vs-landing-footer__glow", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs27("div", { className: "vs-landing-footer__container", children: [
          /* @__PURE__ */ jsxs27("div", { className: "vs-landing-footer__grid", children: [
            /* @__PURE__ */ jsxs27("div", { className: "vs-landing-footer__brand-col", children: [
              /* @__PURE__ */ jsxs27("div", { className: "vs-landing-footer__brand-header", children: [
                /* @__PURE__ */ jsx36("div", { className: "vs-landing-footer__brand-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsxs27("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx36("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
                  /* @__PURE__ */ jsx36("polyline", { points: "2 17 12 22 22 17" }),
                  /* @__PURE__ */ jsx36("polyline", { points: "2 12 12 17 22 12" })
                ] }) }),
                /* @__PURE__ */ jsxs27("div", { className: "vs-landing-footer__brand-titles", children: [
                  /* @__PURE__ */ jsx36("span", { className: "vs-landing-footer__brand-name", children: brandName }),
                  /* @__PURE__ */ jsx36("span", { className: "vs-landing-footer__product-name", children: productTitle })
                ] })
              ] }),
              /* @__PURE__ */ jsx36("p", { className: "vs-landing-footer__tagline", children: productTagline }),
              onExploreDemo && /* @__PURE__ */ jsxs27(
                "button",
                {
                  type: "button",
                  onClick: onExploreDemo,
                  className: "vs-landing-footer__cta-btn vs-btn-primary",
                  "data-testid": "footer-explore-demo-btn",
                  children: [
                    /* @__PURE__ */ jsx36("span", { className: "vs-landing-footer__cta-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx36("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "currentColor", children: /* @__PURE__ */ jsx36("polygon", { points: "5 3 19 12 5 21 5 3" }) }) }),
                    /* @__PURE__ */ jsx36("span", { children: exploreDemoLabel })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs27("div", { className: "vs-landing-footer__status-badge", children: [
                /* @__PURE__ */ jsx36("span", { className: "vs-landing-footer__status-dot", "aria-hidden": "true" }),
                /* @__PURE__ */ jsx36("span", { className: "vs-landing-footer__status-text", children: sdkVersion })
              ] })
            ] }),
            /* @__PURE__ */ jsx36("div", { className: "vs-landing-footer__links-group", children: linkColumns.map((col, idx) => /* @__PURE__ */ jsxs27("div", { className: "vs-landing-footer__col", children: [
              /* @__PURE__ */ jsx36("h4", { className: "vs-landing-footer__col-title", children: col.title }),
              /* @__PURE__ */ jsx36("ul", { className: "vs-landing-footer__link-list", children: col.links.map((link, lIdx) => /* @__PURE__ */ jsx36("li", { className: "vs-landing-footer__link-item", children: /* @__PURE__ */ jsxs27(
                "a",
                {
                  href: link.href,
                  onClick: (e) => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  },
                  target: link.external ? "_blank" : void 0,
                  rel: link.external ? "noopener noreferrer" : void 0,
                  className: "vs-landing-footer__link",
                  children: [
                    /* @__PURE__ */ jsx36("span", { children: link.label }),
                    link.badge && /* @__PURE__ */ jsx36("span", { className: "vs-landing-footer__link-badge", children: link.badge }),
                    link.external && /* @__PURE__ */ jsxs27("svg", { className: "vs-landing-footer__external-icon", viewBox: "0 0 24 24", width: "12", height: "12", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                      /* @__PURE__ */ jsx36("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
                      /* @__PURE__ */ jsx36("polyline", { points: "15 3 21 3 21 9" }),
                      /* @__PURE__ */ jsx36("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
                    ] })
                  ]
                }
              ) }, `${link.label}-${lIdx}`)) })
            ] }, col.title || idx)) })
          ] }),
          /* @__PURE__ */ jsxs27("div", { className: "vs-landing-footer__bottom-bar", children: [
            /* @__PURE__ */ jsxs27("p", { className: "vs-landing-footer__copyright", children: [
              "\xA9 ",
              copyrightYear,
              " ",
              brandName,
              " 3D Platform. All rights reserved. Powered by @trikomi/core WebGPU."
            ] }),
            showBackToTop && /* @__PURE__ */ jsxs27(
              "button",
              {
                type: "button",
                onClick: scrollToTop,
                className: "vs-landing-footer__back-to-top",
                "aria-label": "Back to top",
                "data-testid": "back-to-top-btn",
                children: [
                  /* @__PURE__ */ jsx36("span", { children: "Back to top" }),
                  /* @__PURE__ */ jsxs27("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx36("line", { x1: "12", y1: "19", x2: "12", y2: "5" }),
                    /* @__PURE__ */ jsx36("polyline", { points: "5 12 12 5 19 12" })
                  ] })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/ProductLandingLayout.tsx
import "react";
import { jsx as jsx37, jsxs as jsxs28 } from "react/jsx-runtime";
var ProductLandingLayout = ({
  productTitle,
  productBadge,
  productTagline,
  brandName = "VictorShell",
  brandLogo,
  navLinks = [],
  onExploreDemo,
  exploreDemoLabel = "Explore Demo",
  theme = "violet",
  onThemeChange,
  showThemeSwitcher = true,
  footerLinkColumns,
  secondaryHeaderAction,
  children,
  className = ""
}) => {
  return /* @__PURE__ */ jsx37(VictorShellThemeProvider, { initialAccent: theme, children: /* @__PURE__ */ jsxs28("div", { className: `vs-product-landing-page ${className}`.trim(), "data-testid": "product-landing-layout", children: [
    /* @__PURE__ */ jsxs28("div", { className: "vs-landing-ambient", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx37("div", { className: "vs-landing-ambient__orb vs-landing-ambient__orb--primary" }),
      /* @__PURE__ */ jsx37("div", { className: "vs-landing-ambient__orb vs-landing-ambient__orb--secondary" }),
      /* @__PURE__ */ jsx37("div", { className: "vs-landing-ambient__grid" })
    ] }),
    /* @__PURE__ */ jsx37(
      LandingHeader,
      {
        productTitle,
        productBadge,
        brandName,
        brandLogo,
        navLinks,
        onExploreDemo,
        exploreDemoLabel,
        showThemeSwitcher,
        onThemeChange,
        secondaryAction: secondaryHeaderAction
      }
    ),
    /* @__PURE__ */ jsx37("main", { className: "vs-landing-main", role: "main", children }),
    /* @__PURE__ */ jsx37(
      LandingFooter,
      {
        productTitle,
        productTagline,
        brandName,
        onExploreDemo,
        exploreDemoLabel,
        linkColumns: footerLinkColumns
      }
    )
  ] }) });
};

// packages/ui-kit/src/components/landing/LandingHero.tsx
import "react";
import { jsx as jsx38, jsxs as jsxs29 } from "react/jsx-runtime";
var LandingHero = ({
  title,
  subtitle,
  badge,
  description,
  onExploreDemo,
  exploreDemoLabel = "Explore Demo",
  secondaryCta,
  visual,
  visualPosition = "right",
  stats,
  align = "left",
  id,
  className = ""
}) => {
  const isCentered = align === "center" || visualPosition === "bottom";
  return /* @__PURE__ */ jsx38(
    "section",
    {
      id,
      className: `vs-landing-hero vs-landing-hero--visual-${visualPosition} vs-landing-hero--align-${align} ${className}`.trim(),
      "data-testid": "landing-hero",
      children: /* @__PURE__ */ jsxs29("div", { className: "vs-landing-hero__container", children: [
        /* @__PURE__ */ jsxs29("div", { className: "vs-landing-hero__content", children: [
          badge && /* @__PURE__ */ jsx38("div", { className: "vs-landing-hero__badge-wrap", children: /* @__PURE__ */ jsxs29("span", { className: "vs-landing-hero__badge", "data-testid": "hero-badge", children: [
            /* @__PURE__ */ jsx38("span", { className: "vs-landing-hero__badge-dot", "aria-hidden": "true" }),
            badge
          ] }) }),
          subtitle && /* @__PURE__ */ jsx38("p", { className: "vs-landing-hero__subtitle", "data-testid": "hero-subtitle", children: subtitle }),
          /* @__PURE__ */ jsx38("h1", { className: "vs-landing-hero__title", "data-testid": "hero-title", children: title }),
          /* @__PURE__ */ jsx38("div", { className: "vs-landing-hero__description", "data-testid": "hero-description", children: typeof description === "string" ? /* @__PURE__ */ jsx38("p", { children: description }) : description }),
          /* @__PURE__ */ jsxs29("div", { className: `vs-landing-hero__actions ${isCentered ? "vs-landing-hero__actions--center" : ""}`, children: [
            /* @__PURE__ */ jsxs29(
              "button",
              {
                type: "button",
                onClick: onExploreDemo,
                className: "vs-landing-hero__primary-cta vs-btn-primary",
                "data-testid": "hero-explore-demo-btn",
                children: [
                  /* @__PURE__ */ jsx38("span", { className: "vs-landing-hero__cta-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx38("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ jsx38("polygon", { points: "5 3 19 12 5 21 5 3" }) }) }),
                  /* @__PURE__ */ jsx38("span", { children: exploreDemoLabel })
                ]
              }
            ),
            secondaryCta && /* @__PURE__ */ jsxs29(
              "a",
              {
                href: secondaryCta.href || "#",
                onClick: (e) => {
                  if (secondaryCta.onClick) {
                    e.preventDefault();
                    secondaryCta.onClick();
                  }
                },
                target: secondaryCta.external ? "_blank" : void 0,
                rel: secondaryCta.external ? "noopener noreferrer" : void 0,
                className: "vs-landing-hero__secondary-cta",
                "data-testid": "hero-secondary-cta",
                children: [
                  /* @__PURE__ */ jsx38("span", { children: secondaryCta.label }),
                  secondaryCta.external ? /* @__PURE__ */ jsxs29("svg", { viewBox: "0 0 24 24", width: "14", height: "14", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx38("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
                    /* @__PURE__ */ jsx38("polyline", { points: "15 3 21 3 21 9" }),
                    /* @__PURE__ */ jsx38("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
                  ] }) : /* @__PURE__ */ jsxs29("svg", { viewBox: "0 0 24 24", width: "14", height: "14", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx38("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
                    /* @__PURE__ */ jsx38("polyline", { points: "12 5 19 12 12 19" })
                  ] })
                ]
              }
            )
          ] }),
          stats && stats.length > 0 && /* @__PURE__ */ jsx38("div", { className: "vs-landing-hero__stats", "data-testid": "hero-stats", children: stats.map((stat, idx) => /* @__PURE__ */ jsxs29("div", { className: "vs-landing-hero__stat-item", children: [
            /* @__PURE__ */ jsx38("span", { className: "vs-landing-hero__stat-val", children: stat.value }),
            /* @__PURE__ */ jsx38("span", { className: "vs-landing-hero__stat-label", children: stat.label }),
            stat.hint && /* @__PURE__ */ jsx38("span", { className: "vs-landing-hero__stat-hint", children: stat.hint })
          ] }, stat.label || idx)) })
        ] }),
        visual && /* @__PURE__ */ jsx38("div", { className: "vs-landing-hero__visual", "data-testid": "hero-visual", children: /* @__PURE__ */ jsxs29("div", { className: "vs-landing-hero__visual-frame", children: [
          /* @__PURE__ */ jsx38("div", { className: "vs-landing-hero__visual-glow", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx38("div", { className: "vs-landing-hero__visual-inner", children: visual })
        ] }) })
      ] })
    }
  );
};

// packages/ui-kit/src/components/landing/LandingFeatures.tsx
import "react";
import { jsx as jsx39, jsxs as jsxs30 } from "react/jsx-runtime";
var LandingFeatures = ({
  badge,
  sectionTitle = "Key Features & Capabilities",
  sectionSubtitle,
  sectionDescription,
  features = [],
  columns = 3,
  layout = "grid",
  id,
  className = ""
}) => {
  return /* @__PURE__ */ jsx39(
    "section",
    {
      id,
      className: `vs-landing-features vs-landing-features--${layout} vs-landing-features--cols-${columns} ${className}`.trim(),
      "data-testid": "landing-features",
      children: /* @__PURE__ */ jsxs30("div", { className: "vs-landing-features__container", children: [
        (badge || sectionTitle || sectionSubtitle || sectionDescription) && /* @__PURE__ */ jsxs30("div", { className: "vs-landing-features__header", children: [
          badge && /* @__PURE__ */ jsx39("span", { className: "vs-landing-features__badge", "data-testid": "features-badge", children: badge }),
          sectionSubtitle && /* @__PURE__ */ jsx39("p", { className: "vs-landing-features__subtitle", children: sectionSubtitle }),
          sectionTitle && /* @__PURE__ */ jsx39("h2", { className: "vs-landing-features__title", "data-testid": "features-title", children: sectionTitle }),
          sectionDescription && /* @__PURE__ */ jsx39("p", { className: "vs-landing-features__desc", children: sectionDescription })
        ] }),
        /* @__PURE__ */ jsx39("div", { className: "vs-landing-features__grid", "data-testid": "features-grid", children: features.map((item, idx) => {
          const itemKey = item.id || `${item.title}-${idx}`;
          const isHighlighted = Boolean(item.highlight);
          return /* @__PURE__ */ jsxs30(
            "div",
            {
              className: `vs-feature-card ${isHighlighted ? "vs-feature-card--highlight" : ""}`,
              "data-testid": `feature-card-${idx}`,
              children: [
                /* @__PURE__ */ jsx39("div", { className: "vs-feature-card__glow", "aria-hidden": "true" }),
                /* @__PURE__ */ jsxs30("div", { className: "vs-feature-card__inner", children: [
                  /* @__PURE__ */ jsxs30("div", { className: "vs-feature-card__top", children: [
                    item.icon ? /* @__PURE__ */ jsx39("div", { className: "vs-feature-card__icon", "aria-hidden": "true", children: item.icon }) : /* @__PURE__ */ jsx39("div", { className: "vs-feature-card__icon vs-feature-card__icon--default", "aria-hidden": "true", children: /* @__PURE__ */ jsx39("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx39("polyline", { points: "20 6 9 17 4 12" }) }) }),
                    item.badge && /* @__PURE__ */ jsx39("span", { className: "vs-feature-card__badge", children: item.badge })
                  ] }),
                  /* @__PURE__ */ jsx39("h3", { className: "vs-feature-card__title", children: item.title }),
                  /* @__PURE__ */ jsx39("div", { className: "vs-feature-card__desc", children: typeof item.description === "string" ? /* @__PURE__ */ jsx39("p", { children: item.description }) : item.description }),
                  item.action && /* @__PURE__ */ jsx39("div", { className: "vs-feature-card__action", children: /* @__PURE__ */ jsxs30(
                    "a",
                    {
                      href: item.action.href || "#",
                      onClick: (e) => {
                        if (item.action?.onClick) {
                          e.preventDefault();
                          item.action.onClick();
                        }
                      },
                      target: item.action.external ? "_blank" : void 0,
                      rel: item.action.external ? "noopener noreferrer" : void 0,
                      className: "vs-feature-card__action-link",
                      children: [
                        /* @__PURE__ */ jsx39("span", { children: item.action.label }),
                        /* @__PURE__ */ jsxs30("svg", { viewBox: "0 0 24 24", width: "14", height: "14", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                          /* @__PURE__ */ jsx39("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
                          /* @__PURE__ */ jsx39("polyline", { points: "12 5 19 12 12 19" })
                        ] })
                      ]
                    }
                  ) })
                ] })
              ]
            },
            itemKey
          );
        }) })
      ] })
    }
  );
};

// packages/ui-kit/src/components/landing/LandingOverview.tsx
import "react";
import { jsx as jsx40, jsxs as jsxs31 } from "react/jsx-runtime";
var LandingOverview = ({
  badge,
  title,
  subtitle,
  description,
  highlights,
  visual,
  reversed = false,
  cta,
  id,
  className = ""
}) => {
  return /* @__PURE__ */ jsx40(
    "section",
    {
      id,
      className: `vs-landing-overview ${reversed ? "vs-landing-overview--reversed" : ""} ${className}`.trim(),
      "data-testid": "landing-overview",
      children: /* @__PURE__ */ jsxs31("div", { className: "vs-landing-overview__container", children: [
        /* @__PURE__ */ jsxs31("div", { className: "vs-landing-overview__content", children: [
          badge && /* @__PURE__ */ jsx40("span", { className: "vs-landing-overview__badge", "data-testid": "overview-badge", children: badge }),
          subtitle && /* @__PURE__ */ jsx40("p", { className: "vs-landing-overview__subtitle", children: subtitle }),
          /* @__PURE__ */ jsx40("h2", { className: "vs-landing-overview__title", "data-testid": "overview-title", children: title }),
          /* @__PURE__ */ jsx40("div", { className: "vs-landing-overview__description", children: typeof description === "string" ? /* @__PURE__ */ jsx40("p", { children: description }) : description }),
          highlights && highlights.length > 0 && /* @__PURE__ */ jsx40("div", { className: "vs-landing-overview__highlights", "data-testid": "overview-highlights", children: highlights.map((item, idx) => /* @__PURE__ */ jsxs31("div", { className: "vs-overview-highlight", children: [
            /* @__PURE__ */ jsx40("div", { className: "vs-overview-highlight__icon", "aria-hidden": "true", children: item.icon || /* @__PURE__ */ jsx40("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx40("polyline", { points: "20 6 9 17 4 12" }) }) }),
            /* @__PURE__ */ jsxs31("div", { className: "vs-overview-highlight__text", children: [
              item.title && /* @__PURE__ */ jsxs31("strong", { children: [
                item.title,
                ": "
              ] }),
              /* @__PURE__ */ jsx40("span", { children: item.text })
            ] })
          ] }, idx)) }),
          cta && /* @__PURE__ */ jsx40("div", { className: "vs-landing-overview__cta-wrap", children: /* @__PURE__ */ jsxs31(
            "a",
            {
              href: cta.href || "#",
              onClick: (e) => {
                if (cta.onClick) {
                  e.preventDefault();
                  cta.onClick();
                }
              },
              className: "vs-landing-overview__cta vs-btn-primary",
              children: [
                /* @__PURE__ */ jsx40("span", { children: cta.label }),
                /* @__PURE__ */ jsxs31("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                  /* @__PURE__ */ jsx40("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
                  /* @__PURE__ */ jsx40("polyline", { points: "12 5 19 12 12 19" })
                ] })
              ]
            }
          ) })
        ] }),
        visual && /* @__PURE__ */ jsx40("div", { className: "vs-landing-overview__visual", "data-testid": "overview-visual", children: /* @__PURE__ */ jsx40("div", { className: "vs-landing-overview__visual-frame", children: visual }) })
      ] })
    }
  );
};

// packages/ui-kit/src/components/landing/LandingBenefits.tsx
import "react";
import { jsx as jsx41, jsxs as jsxs32 } from "react/jsx-runtime";
var LandingBenefits = ({
  badge,
  sectionTitle,
  sectionSubtitle,
  sectionDescription,
  items = [],
  variant = "cards",
  id,
  className = ""
}) => {
  return /* @__PURE__ */ jsx41(
    "section",
    {
      id,
      className: `vs-landing-benefits vs-landing-benefits--${variant} ${className}`.trim(),
      "data-testid": "landing-benefits",
      children: /* @__PURE__ */ jsxs32("div", { className: "vs-landing-benefits__container", children: [
        /* @__PURE__ */ jsxs32("div", { className: "vs-landing-benefits__header", children: [
          badge && /* @__PURE__ */ jsx41("span", { className: "vs-landing-benefits__badge", "data-testid": "benefits-badge", children: badge }),
          sectionSubtitle && /* @__PURE__ */ jsx41("p", { className: "vs-landing-benefits__subtitle", children: sectionSubtitle }),
          /* @__PURE__ */ jsx41("h2", { className: "vs-landing-benefits__title", "data-testid": "benefits-title", children: sectionTitle }),
          sectionDescription && /* @__PURE__ */ jsx41("p", { className: "vs-landing-benefits__desc", children: sectionDescription })
        ] }),
        /* @__PURE__ */ jsx41("div", { className: "vs-landing-benefits__grid", "data-testid": "benefits-grid", children: items.map((item, idx) => {
          const itemKey = item.id || `${item.title}-${idx}`;
          return /* @__PURE__ */ jsx41(
            "div",
            {
              className: "vs-benefit-card",
              "data-testid": `benefit-card-${idx}`,
              children: /* @__PURE__ */ jsxs32("div", { className: "vs-benefit-card__inner", children: [
                item.tag && /* @__PURE__ */ jsx41("span", { className: "vs-benefit-card__tag", children: item.tag }),
                item.metric && /* @__PURE__ */ jsxs32("div", { className: "vs-benefit-card__metric-wrap", children: [
                  /* @__PURE__ */ jsx41("span", { className: "vs-benefit-card__metric", children: item.metric }),
                  item.metricLabel && /* @__PURE__ */ jsx41("span", { className: "vs-benefit-card__metric-label", children: item.metricLabel })
                ] }),
                /* @__PURE__ */ jsxs32("div", { className: "vs-benefit-card__header", children: [
                  item.icon && /* @__PURE__ */ jsx41("div", { className: "vs-benefit-card__icon", "aria-hidden": "true", children: item.icon }),
                  /* @__PURE__ */ jsx41("h3", { className: "vs-benefit-card__title", children: item.title })
                ] }),
                /* @__PURE__ */ jsx41("div", { className: "vs-benefit-card__desc", children: typeof item.description === "string" ? /* @__PURE__ */ jsx41("p", { children: item.description }) : item.description })
              ] })
            },
            itemKey
          );
        }) })
      ] })
    }
  );
};

// packages/ui-kit/src/components/landing/LandingVisualShowcase.tsx
import { useState as useState23 } from "react";
import { jsx as jsx42, jsxs as jsxs33 } from "react/jsx-runtime";
var LandingVisualShowcase = ({
  badge,
  sectionTitle,
  sectionSubtitle,
  sectionDescription,
  items = [],
  defaultActiveId,
  id,
  className = ""
}) => {
  const [activeId, setActiveId] = useState23(defaultActiveId || items[0]?.id || "");
  const activeItem = items.find((item) => item.id === activeId) || items[0];
  return /* @__PURE__ */ jsx42(
    "section",
    {
      id,
      className: `vs-landing-showcase ${className}`.trim(),
      "data-testid": "landing-visual-showcase",
      children: /* @__PURE__ */ jsxs33("div", { className: "vs-landing-showcase__container", children: [
        /* @__PURE__ */ jsxs33("div", { className: "vs-landing-showcase__header", children: [
          badge && /* @__PURE__ */ jsx42("span", { className: "vs-landing-showcase__badge", "data-testid": "showcase-badge", children: badge }),
          sectionSubtitle && /* @__PURE__ */ jsx42("p", { className: "vs-landing-showcase__subtitle", children: sectionSubtitle }),
          /* @__PURE__ */ jsx42("h2", { className: "vs-landing-showcase__title", "data-testid": "showcase-title", children: sectionTitle }),
          sectionDescription && /* @__PURE__ */ jsx42("p", { className: "vs-landing-showcase__desc", children: sectionDescription }),
          items.length > 1 && /* @__PURE__ */ jsx42(
            "div",
            {
              className: "vs-landing-showcase__tabs",
              role: "tablist",
              "aria-label": "Showcase Views",
              "data-testid": "showcase-tabs",
              children: items.map((item) => {
                const isActive = item.id === activeItem?.id;
                return /* @__PURE__ */ jsxs33(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": isActive,
                    "aria-controls": `showcase-panel-${item.id}`,
                    className: `vs-showcase-tab ${isActive ? "is-active" : ""}`,
                    onClick: () => setActiveId(item.id),
                    "data-testid": `showcase-tab-${item.id}`,
                    children: [
                      /* @__PURE__ */ jsx42("span", { children: item.label }),
                      item.badge && /* @__PURE__ */ jsx42("span", { className: "vs-showcase-tab__badge", children: item.badge })
                    ]
                  },
                  item.id
                );
              })
            }
          )
        ] }),
        activeItem && /* @__PURE__ */ jsxs33(
          "div",
          {
            id: `showcase-panel-${activeItem.id}`,
            role: "tabpanel",
            className: "vs-landing-showcase__stage",
            "data-testid": "showcase-stage",
            children: [
              /* @__PURE__ */ jsx42("div", { className: "vs-landing-showcase__frame", children: /* @__PURE__ */ jsx42("div", { className: "vs-landing-showcase__visual-wrapper", children: activeItem.visual }) }),
              activeItem.description && /* @__PURE__ */ jsx42("p", { className: "vs-landing-showcase__caption", "data-testid": "showcase-caption", children: activeItem.description })
            ]
          }
        )
      ] })
    }
  );
};

// packages/ui-kit/src/components/landing/LandingCtaSection.tsx
import "react";
import { jsx as jsx43, jsxs as jsxs34 } from "react/jsx-runtime";
var LandingCtaSection = ({
  badge = "Interactive 3D Demo",
  title,
  description,
  onExploreDemo,
  exploreDemoLabel = "Explore Demo",
  exploreDemoHref,
  secondaryCta,
  note = "Zero downloads required \xB7 Runs instantly in modern web browsers",
  id,
  className = ""
}) => {
  return /* @__PURE__ */ jsx43(
    "section",
    {
      id,
      className: `vs-landing-cta-section ${className}`.trim(),
      "data-testid": "landing-cta-section",
      children: /* @__PURE__ */ jsx43("div", { className: "vs-landing-cta-section__container", children: /* @__PURE__ */ jsxs34("div", { className: "vs-landing-cta-card", children: [
        /* @__PURE__ */ jsx43("div", { className: "vs-landing-cta-card__glow", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs34("div", { className: "vs-landing-cta-card__content", children: [
          badge && /* @__PURE__ */ jsxs34("span", { className: "vs-landing-cta-card__badge", "data-testid": "cta-badge", children: [
            /* @__PURE__ */ jsx43("span", { className: "vs-landing-cta-card__badge-dot", "aria-hidden": "true" }),
            badge
          ] }),
          /* @__PURE__ */ jsx43("h2", { className: "vs-landing-cta-card__title", "data-testid": "cta-title", children: title }),
          /* @__PURE__ */ jsx43("div", { className: "vs-landing-cta-card__desc", children: typeof description === "string" ? /* @__PURE__ */ jsx43("p", { children: description }) : description }),
          /* @__PURE__ */ jsxs34("div", { className: "vs-landing-cta-card__actions", children: [
            exploreDemoHref ? /* @__PURE__ */ jsxs34(
              "a",
              {
                href: exploreDemoHref,
                onClick: () => {
                  if (onExploreDemo) {
                    onExploreDemo();
                  }
                },
                className: "vs-landing-cta-card__primary-btn vs-btn-primary",
                "data-testid": "cta-explore-demo-btn",
                children: [
                  /* @__PURE__ */ jsx43("span", { className: "vs-landing-cta-card__btn-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx43("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ jsx43("polygon", { points: "5 3 19 12 5 21 5 3" }) }) }),
                  /* @__PURE__ */ jsx43("span", { children: exploreDemoLabel })
                ]
              }
            ) : /* @__PURE__ */ jsxs34(
              "button",
              {
                type: "button",
                onClick: onExploreDemo,
                className: "vs-landing-cta-card__primary-btn vs-btn-primary",
                "data-testid": "cta-explore-demo-btn",
                children: [
                  /* @__PURE__ */ jsx43("span", { className: "vs-landing-cta-card__btn-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsx43("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ jsx43("polygon", { points: "5 3 19 12 5 21 5 3" }) }) }),
                  /* @__PURE__ */ jsx43("span", { children: exploreDemoLabel })
                ]
              }
            ),
            secondaryCta && /* @__PURE__ */ jsxs34(
              "a",
              {
                href: secondaryCta.href || "#",
                onClick: (e) => {
                  if (secondaryCta.onClick) {
                    e.preventDefault();
                    secondaryCta.onClick();
                  }
                },
                target: secondaryCta.external ? "_blank" : void 0,
                rel: secondaryCta.external ? "noopener noreferrer" : void 0,
                className: "vs-landing-cta-card__secondary-btn",
                children: [
                  /* @__PURE__ */ jsx43("span", { children: secondaryCta.label }),
                  secondaryCta.external && /* @__PURE__ */ jsxs34("svg", { viewBox: "0 0 24 24", width: "14", height: "14", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx43("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
                    /* @__PURE__ */ jsx43("polyline", { points: "15 3 21 3 21 9" }),
                    /* @__PURE__ */ jsx43("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
                  ] })
                ]
              }
            )
          ] }),
          note && /* @__PURE__ */ jsxs34("p", { className: "vs-landing-cta-card__note", children: [
            /* @__PURE__ */ jsx43("span", { className: "vs-landing-cta-card__note-icon", "aria-hidden": "true", children: "\u26A1" }),
            note
          ] })
        ] })
      ] }) })
    }
  );
};

// packages/ui-kit/src/components/landing/ProductLandingTemplate.tsx
import "react";
import { jsx as jsx44, jsxs as jsxs35 } from "react/jsx-runtime";
var ProductLandingTemplate = ({
  productTitle,
  productBadge,
  productTagline,
  brandLogo,
  brandName = "VictorShell",
  theme = "indigo",
  onExploreDemo,
  exploreDemoLabel = "Explore Demo",
  exploreDemoHref,
  navLinks = [],
  heroProps,
  overviewProps,
  featuresProps,
  showcaseProps,
  benefitsProps,
  ctaProps,
  children,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs35(
    ProductLandingLayout,
    {
      productTitle,
      productBadge,
      productTagline,
      brandLogo,
      brandName,
      theme,
      onExploreDemo,
      exploreDemoLabel,
      navLinks,
      className: `vs-product-landing-template ${className}`.trim(),
      children: [
        /* @__PURE__ */ jsx44(
          LandingHero,
          {
            ...heroProps,
            onExploreDemo,
            exploreDemoLabel: heroProps.exploreDemoLabel || exploreDemoLabel,
            id: heroProps.id || "hero"
          }
        ),
        overviewProps && /* @__PURE__ */ jsx44(
          LandingOverview,
          {
            ...overviewProps,
            id: overviewProps.id || "overview"
          }
        ),
        featuresProps && /* @__PURE__ */ jsx44(
          LandingFeatures,
          {
            ...featuresProps,
            id: featuresProps.id || "features"
          }
        ),
        showcaseProps && /* @__PURE__ */ jsx44(
          LandingVisualShowcase,
          {
            ...showcaseProps,
            id: showcaseProps.id || "showcase"
          }
        ),
        benefitsProps && /* @__PURE__ */ jsx44(
          LandingBenefits,
          {
            ...benefitsProps,
            id: benefitsProps.id || "benefits"
          }
        ),
        children,
        /* @__PURE__ */ jsx44(
          LandingCtaSection,
          {
            badge: ctaProps?.badge || "Interactive 3D Demo",
            title: ctaProps?.title || `Experience the ${productTitle} Live`,
            description: ctaProps?.description || `Launch the full interactive 3D studio in your browser. Powered by the @trikomi/core WebGPU engine with zero plugins or installation required.`,
            onExploreDemo,
            exploreDemoLabel: ctaProps?.exploreDemoLabel || exploreDemoLabel,
            exploreDemoHref: ctaProps?.exploreDemoHref || exploreDemoHref,
            secondaryCta: ctaProps?.secondaryCta,
            note: ctaProps?.note || "Instant client-side rendering \xB7 WebGPU / WebGL2 \xB7 Responsive on all devices",
            id: ctaProps?.id || "cta"
          }
        )
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/SportswearLandingPage.tsx
import { useState as useState24 } from "react";
import { jsx as jsx45, jsxs as jsxs36 } from "react/jsx-runtime";
var SportswearLandingPage = ({
  onExploreDemo,
  exploreDemoHref = "/apps/sportswear-configurator/index.html#demo",
  theme = "indigo",
  className = ""
}) => {
  const navLinks = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Features", href: "#features" },
    { label: "Garment Kits", href: "#showcase" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Performance", href: "#benefits" },
    { label: "Tech Specs", href: "#specs" }
  ];
  const features = [
    {
      id: "dynamic-decals",
      title: "Dynamic Vector Decals",
      description: "Upload custom SVG team logos, crests, and sponsor marks. Position, rotate, and scale decals with real-time UV projection conforming to fabric seams.",
      badge: "Core Engine",
      highlight: true
    },
    {
      id: "fabric-shaders",
      title: "Technical Fabric Shaders",
      description: "Switch between moisture-wicking technical mesh, heavy-duty interlock knit, and smooth performance polyester with physically accurate sheen and micro-roughness.",
      badge: "Photorealistic PBR"
    },
    {
      id: "player-typography",
      title: "Player Names & Numbers",
      description: "Built-in vector typography engine rendering custom player names and jersey numbers with instant font family selection, kerning calibration, and color control.",
      badge: "Vector Canvas"
    },
    {
      id: "studio-cameras",
      title: "4-Angle Studio Cameras",
      description: "Instant one-click camera pivots across Front, Back, Left Profile, and Right Profile angles with a synchronized 4-grid preview box for total inspection.",
      badge: "Multi-Angle"
    },
    {
      id: "garment-library",
      title: "Multi-Sport Garment Models",
      description: "Production-accurate 3D models for Pro Soccer Jerseys, Rugby Match Kits, and Basketball Singlets with optimized GLTF geometry.",
      badge: "GLTF / WebGPU"
    },
    {
      id: "production-dieline",
      title: "Factory Snapshot Export",
      description: "One-click multi-angle high-resolution snapshot generation and structured order manifest for factory cutting dielines and dye-sublimation printing.",
      badge: "Production Ready"
    }
  ];
  const showcaseItems = [
    {
      id: "soccer",
      label: "Pro Soccer Kit",
      badge: "SoccerJersey.gltf",
      description: "Tailored athletic fit with raglan sleeves, breathable mesh underarm ventilation panels, and chest crest decal zone.",
      visual: /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card", "data-testid": "showcase-soccer-preview", children: [
        /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-chip", children: "SoccerJersey.gltf" }),
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-chip vs-sportswear-chip--accent", children: "Technical Mesh" })
        ] }),
        /* @__PURE__ */ jsx45("div", { className: "vs-sportswear-preview-card__visual", children: /* @__PURE__ */ jsx45(
          "img",
          {
            src: "/logos/jersey.png",
            alt: "VictorShell Pro Soccer Jersey 3D Model",
            className: "vs-sportswear-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card__meta", children: [
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-preview-card__title", children: "Pro Soccer Jersey" }),
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-preview-card__spec", children: "Dual-Tone Sublimation \xB7 60 FPS WebGPU" })
        ] })
      ] })
    },
    {
      id: "rugby",
      label: "Rugby Match Kit",
      badge: "RugbyJersey.gltf",
      description: "Heavy-duty interlock knit shader with reinforced collar seams, chest sponsor block, and bold athletic back numbering.",
      visual: /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card", "data-testid": "showcase-rugby-preview", children: [
        /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-chip", children: "RugbyJersey.gltf" }),
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-chip vs-sportswear-chip--accent", children: "Interlock Knit" })
        ] }),
        /* @__PURE__ */ jsx45("div", { className: "vs-sportswear-preview-card__visual", children: /* @__PURE__ */ jsx45(
          "img",
          {
            src: "/logos/jersey.png",
            alt: "VictorShell Rugby Match Jersey 3D Model",
            className: "vs-sportswear-preview-card__img vs-sportswear-preview-card__img--alt",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card__meta", children: [
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-preview-card__title", children: "Rugby Match Kit" }),
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-preview-card__spec", children: "High-Tensile Fabric \xB7 Heavy Seam Normal Mapping" })
        ] })
      ] })
    },
    {
      id: "basketball",
      label: "Basketball Singlet",
      badge: "BasketballSinglet.gltf",
      description: "Lightweight sleeveless open-mesh garment with ribbed armhole trims, wide athletic lettering, and contrast side stripes.",
      visual: /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card", "data-testid": "showcase-basketball-preview", children: [
        /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-chip", children: "BasketballSinglet.gltf" }),
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-chip vs-sportswear-chip--accent", children: "Open Air Mesh" })
        ] }),
        /* @__PURE__ */ jsx45("div", { className: "vs-sportswear-preview-card__visual", children: /* @__PURE__ */ jsx45(
          "img",
          {
            src: "/logos/jersey.png",
            alt: "VictorShell Basketball Singlet 3D Model",
            className: "vs-sportswear-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-preview-card__meta", children: [
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-preview-card__title", children: "Basketball Singlet" }),
          /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-preview-card__spec", children: "Sleeveless Cut \xB7 Dynamic Player Numbering" })
        ] })
      ] })
    }
  ];
  const benefits = [
    {
      id: "fps",
      title: "Silky 60 FPS Viewport",
      description: "Three.js WebGPU engine delivers smooth rotation and instant zoom with zero micro-stuttering on mobile and desktop.",
      metric: "60 FPS",
      metricLabel: "WebGPU Viewport",
      tag: "Performance"
    },
    {
      id: "load-time",
      title: "Instant Interactive Loading",
      description: "Optimized GLTF streaming and progressive textures load the 3D model in seconds, keeping customer engagement high.",
      metric: "< 1.2s",
      metricLabel: "Time to Interactive",
      tag: "Speed"
    },
    {
      id: "cost",
      title: "Zero Cloud GPU Streaming Fees",
      description: "All 3D rendering and vector decal projections run 100% on the client browser. No expensive pixel-streaming server bills.",
      metric: "$0 / hr",
      metricLabel: "Server GPU Cost",
      tag: "Client-Side"
    },
    {
      id: "sampling-waste",
      title: "Eliminate Sampling Waste",
      description: "Accurate digital sign-off with 4-angle snapshot export eliminates physical sample production cycles and shipping delay.",
      metric: "100%",
      metricLabel: "Production Accuracy",
      tag: "Zero Waste"
    }
  ];
  const [activeHeroAngle, setActiveHeroAngle] = useState24("front");
  const [activeFabric, setActiveFabric] = useState24("mesh");
  const fabricNames = {
    mesh: "Technical Mesh (Moisture-Wicking)",
    knit: "Interlock Knit (Heavy Match Durability)",
    smooth: "Sublimated Polyester (Smooth Sheen)"
  };
  const heroVisual = /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-hero-stage", "data-testid": "sportswear-hero-stage", children: [
    /* @__PURE__ */ jsx45("div", { className: "vs-sportswear-hero-stage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-hero-stage__controls", children: [
      /* @__PURE__ */ jsxs36("span", { className: "vs-sportswear-hero-stage__indicator", children: [
        /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-hero-stage__dot" }),
        "WebGPU Canvas Active"
      ] }),
      /* @__PURE__ */ jsx45("div", { className: "vs-sportswear-hero-stage__angles", children: ["front", "back", "left", "right"].map((angle) => /* @__PURE__ */ jsx45(
        "button",
        {
          type: "button",
          className: `vs-sportswear-angle-btn ${activeHeroAngle === angle ? "is-active" : ""}`,
          onClick: () => setActiveHeroAngle(angle),
          "aria-label": `View ${angle} angle`,
          children: angle.toUpperCase()
        },
        angle
      )) })
    ] }),
    /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-hero-stage__viewport", children: [
      /* @__PURE__ */ jsx45(
        "img",
        {
          src: "/logos/jersey.png",
          alt: "Sportswear Configurator 3D Interactive Jersey",
          className: `vs-sportswear-hero-stage__jersey vs-sportswear-hero-stage__jersey--${activeHeroAngle}`
        }
      ),
      /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-hero-stage__decal-tag vs-sportswear-hero-stage__decal-tag--crest", children: [
        /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-hero-stage__decal-dot" }),
        /* @__PURE__ */ jsx45("span", { children: "Dynamic Crest UV" })
      ] }),
      /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-hero-stage__decal-tag vs-sportswear-hero-stage__decal-tag--sponsor", children: [
        /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-hero-stage__decal-dot" }),
        /* @__PURE__ */ jsx45("span", { children: "Vector Sponsor Mark" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-hero-stage__footer", children: [
      /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-hero-stage__meta", children: [
        /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-hero-stage__meta-label", children: "Selected Fabric" }),
        /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-hero-stage__meta-val", children: fabricNames[activeFabric] }),
        /* @__PURE__ */ jsx45("div", { style: { display: "flex", gap: "4px", marginTop: "4px" }, children: ["mesh", "knit", "smooth"].map((fab) => /* @__PURE__ */ jsx45(
          "button",
          {
            type: "button",
            onClick: () => setActiveFabric(fab),
            style: {
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "999px",
              border: activeFabric === fab ? "1px solid var(--vs-primary)" : "1px solid var(--vs-control-border)",
              background: activeFabric === fab ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.6)",
              color: activeFabric === fab ? "var(--vs-primary)" : "var(--vs-ink-muted)",
              cursor: "pointer"
            },
            children: fab.charAt(0).toUpperCase() + fab.slice(1)
          },
          fab
        )) })
      ] }),
      /* @__PURE__ */ jsx45(
        "button",
        {
          type: "button",
          onClick: onExploreDemo,
          className: "vs-sportswear-hero-stage__quick-btn vs-btn-secondary",
          "data-testid": "hero-quick-launch-btn",
          children: "Launch 3D Lab \u2192"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs36(
    ProductLandingTemplate,
    {
      productTitle: "Sportswear Configurator",
      productBadge: "WebGPU Vector Decal Engine",
      productTagline: "Real-time 3D jersey design, dynamic vector decals, and precision sublimation dieline export.",
      brandName: "VictorShell",
      theme,
      onExploreDemo,
      exploreDemoLabel: "Launch 3D Configurator",
      exploreDemoHref,
      navLinks,
      className: `vs-sportswear-landing-page ${className}`.trim(),
      heroProps: {
        title: "High-Performance Custom 3D Team Apparel",
        subtitle: "Real-Time Texture Composer & Vector Decal Studio",
        badge: "Interactive WebGPU Demo",
        description: "Configure professional team jerseys, rugby kits, and basketball singlets with live vector logo placement, custom player names and numbers, photorealistic fabric shaders, and instant factory-ready production specs.",
        exploreDemoLabel: "Launch 3D Configurator",
        secondaryCta: {
          label: "View Tech Specs",
          href: "#specs"
        },
        stats: [
          { value: "60 FPS", label: "WebGPU Engine", hint: "Fluid real-time viewport" },
          { value: "3 Kits", label: "Garment Types", hint: "Soccer, Rugby & Basketball" },
          { value: "< 1.2s", label: "Load Time", hint: "Streamed GLTF geometry" }
        ],
        visual: heroVisual,
        visualPosition: "right"
      },
      overviewProps: {
        id: "overview",
        badge: "Textile Architecture",
        title: "True-to-Scale Fabric Simulation & Sublimation Pipeline",
        subtitle: "Bridging digital concept design with physical textile manufacturing",
        description: "The Sportswear Configurator connects dynamic 2D artwork composition with physical 3D textile reality. Using Three.js WebGPU shaders and canvas compositing, designers can customize fabric sheen, layer decals across seams, and inspect collar, side-panel, and sleeve aesthetics with sub-millimeter precision before printing.",
        highlights: [
          {
            title: "Sub-Second Decal Projection",
            text: "Vector SVG logos conform accurately across complex fabric meshes and shoulder seams without texture distortion."
          },
          {
            title: "Production Snapshot Export",
            text: "Generate high-resolution multi-angle camera snapshots and structured manufacturing manifests with a single click."
          },
          {
            title: "Independent Color Layering",
            text: "Custom Pantone hex palette control over individual garment components: collars, sleeves, body panels, and trims."
          }
        ],
        visual: /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-dieline-card", "data-testid": "sportswear-dieline-card", children: [
          /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-dieline-card__header", children: [
            /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-dieline-card__title", children: "UV Layout & Color Channels" }),
            /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-chip", children: "uv_layout_with_labels.svg" })
          ] }),
          /* @__PURE__ */ jsx45("div", { className: "vs-sportswear-dieline-card__body", children: /* @__PURE__ */ jsx45(
            "img",
            {
              src: "/svgs/uv_layout_with_labels.svg",
              alt: "Sportswear UV Layout and Color Channels",
              className: "vs-sportswear-dieline-card__img",
              loading: "lazy"
            }
          ) }),
          /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-dieline-card__footer", children: [
            /* @__PURE__ */ jsxs36("div", { className: "vs-sportswear-color-swatches", children: [
              /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-swatch", style: { background: "#1A1A1A" }, title: "Base Body" }),
              /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-swatch", style: { background: "#D4AF37" }, title: "Gold Accent" }),
              /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-swatch", style: { background: "#F0F0F0" }, title: "Pure White" }),
              /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-swatch", style: { background: "#0A1128" }, title: "Navy Trim" }),
              /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-swatch", style: { background: "#780000" }, title: "Crimson Contrast" })
            ] }),
            /* @__PURE__ */ jsx45("span", { className: "vs-sportswear-dieline-card__note", children: "5 Independent Hex Layer Channels" })
          ] })
        ] })
      },
      featuresProps: {
        id: "features",
        badge: "Engine Capabilities",
        sectionTitle: "Built for High-Fidelity Custom Apparel",
        sectionSubtitle: "Precision tools for athletic apparel brands, team uniform distributors, and bespoke manufacturers.",
        layout: "bento",
        columns: 3,
        features
      },
      showcaseProps: {
        id: "showcase",
        badge: "Garment Catalog",
        sectionTitle: "Explore Supported Teamwear Kits",
        sectionSubtitle: "Switch between interactive 3D garment presets to inspect geometry and fabric textures.",
        items: showcaseItems
      },
      benefitsProps: {
        id: "benefits",
        badge: "Performance & ROI",
        sectionTitle: "Why Apparel Manufacturers Choose VictorShell",
        sectionSubtitle: "Engineered for speed, conversion, and zero sampling waste.",
        variant: "metrics",
        items: benefits
      },
      ctaProps: {
        id: "cta",
        badge: "Interactive 3D Studio",
        title: "Experience the Sportswear Configurator Live",
        description: "Step into the real-time 3D studio. Change colors, place vector logos, choose fabrics, and test player number rendering in your browser.",
        exploreDemoLabel: "Launch 3D Configurator",
        exploreDemoHref,
        note: "Runs smoothly on Chrome, Safari, Firefox, and Edge \xB7 Desktop, tablet, and mobile"
      },
      children: [
        /* @__PURE__ */ jsx45("section", { className: "vs-landing-use-cases", id: "use-cases", "data-testid": "sportswear-use-cases-section", children: /* @__PURE__ */ jsxs36("div", { className: "vs-landing-use-cases__container", children: [
          /* @__PURE__ */ jsxs36("div", { className: "vs-landing-use-cases__header", children: [
            /* @__PURE__ */ jsx45("span", { className: "vs-landing-use-cases__badge", children: "Proven Verticals" }),
            /* @__PURE__ */ jsx45("h2", { className: "vs-landing-use-cases__title", children: "Tailored for Every Athletic Discipline" }),
            /* @__PURE__ */ jsx45("p", { className: "vs-landing-use-cases__subtitle", children: "From elite professional teams to high-volume cut-and-sew garment factories." })
          ] }),
          /* @__PURE__ */ jsxs36("div", { className: "vs-landing-use-cases__grid", children: [
            /* @__PURE__ */ jsxs36("div", { className: "vs-use-case-card", "data-testid": "use-case-soccer", children: [
              /* @__PURE__ */ jsx45("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u26BD" }),
              /* @__PURE__ */ jsx45("span", { className: "vs-use-case-card__tag", children: "Soccer & Football" }),
              /* @__PURE__ */ jsx45("h3", { className: "vs-use-case-card__title", children: "Pro Club Match & Away Kits" }),
              /* @__PURE__ */ jsx45("p", { className: "vs-use-case-card__desc", children: "Enable fans and club managers to design authentic matchday kits with multi-tier sponsor logos, official league sleeve patches, and personalized squad lettering." })
            ] }),
            /* @__PURE__ */ jsxs36("div", { className: "vs-use-case-card", "data-testid": "use-case-rugby", children: [
              /* @__PURE__ */ jsx45("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3C9}" }),
              /* @__PURE__ */ jsx45("span", { className: "vs-use-case-card__tag", children: "Rugby & Contact Sports" }),
              /* @__PURE__ */ jsx45("h3", { className: "vs-use-case-card__title", children: "High-Tensile Interlock Uniforms" }),
              /* @__PURE__ */ jsx45("p", { className: "vs-use-case-card__desc", children: "Design heavy-duty tournament uniforms with reinforced collar stitch mapping, sublimated chest chevrons, and high-visibility player numbers built for collision durability." })
            ] }),
            /* @__PURE__ */ jsxs36("div", { className: "vs-use-case-card", "data-testid": "use-case-basketball", children: [
              /* @__PURE__ */ jsx45("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3C0}" }),
              /* @__PURE__ */ jsx45("span", { className: "vs-use-case-card__tag", children: "Basketball & Track" }),
              /* @__PURE__ */ jsx45("h3", { className: "vs-use-case-card__title", children: "AAU Leagues & Varsity Camps" }),
              /* @__PURE__ */ jsx45("p", { className: "vs-use-case-card__desc", children: "Configure lightweight sleeveless jerseys with wide armhole ribbing, arched chest typography, and ventilated open-mesh weave for maximum on-court breathability." })
            ] }),
            /* @__PURE__ */ jsxs36("div", { className: "vs-use-case-card", "data-testid": "use-case-factory", children: [
              /* @__PURE__ */ jsx45("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3ED}" }),
              /* @__PURE__ */ jsx45("span", { className: "vs-use-case-card__tag", children: "Manufacturing & Sublimation" }),
              /* @__PURE__ */ jsx45("h3", { className: "vs-use-case-card__title", children: "Direct-to-Cutter Production" }),
              /* @__PURE__ */ jsx45("p", { className: "vs-use-case-card__desc", children: "Export 2048x2048 high-resolution 4-angle snapshot manifests and calibrated Pantone hex specifications directly to dye-sublimation printers and laser cutters." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx45("section", { className: "vs-landing-specs", id: "specs", "data-testid": "sportswear-specs-section", children: /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__container", children: [
          /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__header", children: [
            /* @__PURE__ */ jsx45("span", { className: "vs-landing-specs__badge", children: "Technical Specifications" }),
            /* @__PURE__ */ jsx45("h2", { className: "vs-landing-specs__title", children: "Engine & Architecture Specifications" }),
            /* @__PURE__ */ jsx45("p", { className: "vs-landing-specs__subtitle", children: "Verified specifications powering the VictorShell Sportswear Configurator." })
          ] }),
          /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__grid", children: [
            /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx45("h3", { className: "vs-landing-specs__card-title", children: "3D Engine & Graphics" }),
              /* @__PURE__ */ jsxs36("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx45("dt", { children: "Rendering Engine" }),
                  /* @__PURE__ */ jsx45("dd", { children: "Three.js WebGPU / WebGL2 Fallback" })
                ] }),
                /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx45("dt", { children: "Core SDK" }),
                  /* @__PURE__ */ jsx45("dd", { children: "@trikomi/core & @trikomi/sportswear" })
                ] }),
                /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx45("dt", { children: "Geometry Format" }),
                  /* @__PURE__ */ jsx45("dd", { children: "Optimized GLTF 2.0 with Draco mesh compression" })
                ] }),
                /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx45("dt", { children: "Lighting & Studio" }),
                  /* @__PURE__ */ jsx45("dd", { children: "HDR Softbox studio environment with ground ambient glow" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx45("h3", { className: "vs-landing-specs__card-title", children: "Decals & Typography" }),
              /* @__PURE__ */ jsxs36("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx45("dt", { children: "Vector Formats" }),
                  /* @__PURE__ */ jsx45("dd", { children: "SVG, PNG, High-Resolution Canvas DataURL" })
                ] }),
                /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx45("dt", { children: "UV Projection" }),
                  /* @__PURE__ */ jsx45("dd", { children: "Real-time dynamic UV matrix mapping across seams" })
                ] }),
                /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx45("dt", { children: "Typography Engine" }),
                  /* @__PURE__ */ jsx45("dd", { children: "Sub-pixel canvas font rendering with custom fonts" })
                ] }),
                /* @__PURE__ */ jsxs36("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx45("dt", { children: "Export Output" }),
                  /* @__PURE__ */ jsx45("dd", { children: "Multi-angle 2048x2048 PNG snapshots & dieline manifest" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/FaceMocapLandingPage.tsx
import { useState as useState25 } from "react";
import { jsx as jsx46, jsxs as jsxs37 } from "react/jsx-runtime";
var FaceMocapLandingPage = ({
  onExploreDemo,
  exploreDemoHref = "/apps/face-mocap/index.html#demo",
  theme = "violet",
  className = ""
}) => {
  const navLinks = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Features", href: "#features" },
    { label: "Tracking Tech", href: "#showcase" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Performance", href: "#benefits" },
    { label: "Tech Specs", href: "#specs" }
  ];
  const features = [
    {
      id: "dense-landmarks",
      title: "468-Point Dense Face Mesh",
      description: "Continuous sub-millimeter 3D facial landmark tracking detecting micro-expressions, gaze direction, and eyelid geometry in real time.",
      badge: "MediaPipe Vision",
      highlight: true
    },
    {
      id: "arkit-blendshapes",
      title: "52 ARKit Blendshapes",
      description: "Accurate 1:1 extraction of 52 standard ARKit facial blendshape weights, fully rigged for instant MetaHuman and character animation.",
      badge: "Standard ARKit"
    },
    {
      id: "livelink-stream",
      title: "Unreal Engine LiveLink",
      description: "Built-in WebSocket streaming client broadcasting timecoded JSON blendshape packets directly to Unreal Engine LiveLink at 127.0.0.1:5000.",
      badge: "WebSocket LiveLink"
    },
    {
      id: "zero-cloud-fees",
      title: "100% On-Device Inference",
      description: "All computer vision neural networks execute locally via WebAssembly and WebGPU. No video frames leave your machine, ensuring full biometric privacy.",
      badge: "Zero Cloud Cost"
    },
    {
      id: "adaptive-smoothing",
      title: "Adaptive Jitter Filter",
      description: "Tunable smoothstep and Kalman filtering dampens webcam sensor noise while preserving rapid emotional transitions and lip sync articulation.",
      badge: "Sub-Pixel Filter"
    },
    {
      id: "multi-avatar-stage",
      title: "Real-Time 3D Viewport",
      description: "Interactive Three.js viewport rendering synchronized 3D cartoon avatars (raccoon_head_small.glb) and anatomical head occluders.",
      badge: "Three.js WebGPU"
    }
  ];
  const showcaseItems = [
    {
      id: "livelink-view",
      label: "MetaHuman LiveLink",
      badge: "LiveLink ws://5000",
      description: "Stream 52 ARKit blendshapes directly into Unreal Engine 5 to drive photorealistic MetaHuman facial rigs in real time.",
      visual: /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card", "data-testid": "showcase-livelink-preview", children: [
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-chip", children: "Unreal Engine 5" }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-chip vs-mocap-chip--accent", children: "LiveLink Protocol" })
        ] }),
        /* @__PURE__ */ jsx46("div", { className: "vs-mocap-preview-card__visual", children: /* @__PURE__ */ jsx46(
          "img",
          {
            src: "/logos/facemocap.png",
            alt: "VictorShell Face Mocap LiveLink",
            className: "vs-mocap-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card__meta", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-preview-card__title", children: "Unreal MetaHuman Streaming" }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-preview-card__spec", children: "52 Blendshapes \xB7 Timecoded JSON \xB7 Port 5000" })
        ] })
      ] })
    },
    {
      id: "avatar-view",
      label: "Cartoon 3D Avatar",
      badge: "raccoon_head_small.glb",
      description: "Drive expressive stylized 3D characters with real-time eye blinks, eyebrow arches, and lip synchronization.",
      visual: /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card", "data-testid": "showcase-avatar-preview", children: [
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-chip", children: "raccoon_head_small.glb" }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-chip vs-mocap-chip--accent", children: "Interactive 3D Avatar" })
        ] }),
        /* @__PURE__ */ jsx46("div", { className: "vs-mocap-preview-card__visual", children: /* @__PURE__ */ jsx46(
          "img",
          {
            src: "/logos/facemocap.png",
            alt: "VictorShell Stylized 3D Avatar",
            className: "vs-mocap-preview-card__img vs-mocap-preview-card__img--alt",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card__meta", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-preview-card__title", children: "Stylized Character Rig" }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-preview-card__spec", children: "60 FPS WebGL2/WebGPU \xB7 6-DOF Head Rotation" })
        ] })
      ] })
    },
    {
      id: "mesh-view",
      label: "468 Mesh Topology",
      badge: "mocap_landmarks.svg",
      description: "Inspect the raw 468-point 3D wireframe mesh with depth occluder geometry for technical motion verification.",
      visual: /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card", "data-testid": "showcase-mesh-preview", children: [
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-chip", children: "head-occluder.glb" }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-chip vs-mocap-chip--accent", children: "Depth Landmark Mesh" })
        ] }),
        /* @__PURE__ */ jsx46("div", { className: "vs-mocap-preview-card__visual", children: /* @__PURE__ */ jsx46(
          "img",
          {
            src: "/svgs/mocap_landmarks_measurement.svg",
            alt: "VictorShell 468 Landmark Measurement Mesh",
            className: "vs-mocap-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-preview-card__meta", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-preview-card__title", children: "468-Point Mesh Topology" }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-preview-card__spec", children: "Dense Landmark Wireframe \xB7 Sub-Millimeter Depth" })
        ] })
      ] })
    }
  ];
  const benefits = [
    {
      id: "latency",
      title: "Zero Cloud Latency",
      description: "All computer vision analysis executes locally on your device GPU. No video streaming roundtrips or server latency.",
      metric: "0 ms",
      metricLabel: "Server Latency",
      tag: "100% On-Device"
    },
    {
      id: "frame-rate",
      title: "Smooth 60 FPS Tracking",
      description: "Lightweight MediaPipe Tasks Vision pipeline runs smoothly on standard webcams without dropped frames.",
      metric: "60 FPS",
      metricLabel: "Webcam Tracking",
      tag: "Performance"
    },
    {
      id: "blendshapes-count",
      title: "52 ARKit Blendshapes",
      description: "Standardized facial channel weights compatible with Unreal Engine MetaHumans, Unity, and Blender.",
      metric: "52 pts",
      metricLabel: "Expression Shapes",
      tag: "Industry Standard"
    },
    {
      id: "privacy",
      title: "Complete Biometric Privacy",
      description: "Zero video feeds, face scans, or telemetry data are ever recorded or transmitted to external cloud servers.",
      metric: "100%",
      metricLabel: "Privacy Guaranteed",
      tag: "GDPR / CCPA"
    }
  ];
  const [activeAvatar, setActiveAvatar] = useState25("raccoon");
  const [isTrackingActive, setIsTrackingActive] = useState25(true);
  const heroVisual = /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-hero-stage", "data-testid": "mocap-hero-stage", children: [
    /* @__PURE__ */ jsx46("div", { className: "vs-mocap-hero-stage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-hero-stage__controls", children: [
      /* @__PURE__ */ jsxs37(
        "button",
        {
          type: "button",
          className: "vs-mocap-hero-stage__indicator",
          onClick: () => setIsTrackingActive((prev) => !prev),
          title: "Click to toggle simulation",
          style: { background: "transparent", border: "none", color: "inherit", font: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" },
          children: [
            /* @__PURE__ */ jsx46("span", { className: `vs-mocap-hero-stage__dot ${isTrackingActive ? "is-active" : ""}` }),
            isTrackingActive ? "Live Landmark Tracking: 60 FPS" : "Tracking Paused"
          ]
        }
      ),
      /* @__PURE__ */ jsx46("div", { className: "vs-mocap-hero-stage__avatars", children: ["raccoon", "metahuman", "mesh"].map((avatar) => /* @__PURE__ */ jsx46(
        "button",
        {
          type: "button",
          className: `vs-mocap-avatar-btn ${activeAvatar === avatar ? "is-active" : ""}`,
          onClick: () => setActiveAvatar(avatar),
          "aria-label": `Select ${avatar} avatar`,
          children: avatar === "raccoon" ? "AVATAR" : avatar === "metahuman" ? "METAHUMAN" : "MESH"
        },
        avatar
      )) })
    ] }),
    /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-hero-stage__viewport", children: [
      /* @__PURE__ */ jsx46(
        "img",
        {
          src: "/logos/facemocap.png",
          alt: "Face Motion Capture 3D Avatar",
          className: "vs-mocap-hero-stage__avatar"
        }
      ),
      /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-telemetry-panel", children: [
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-telemetry-row", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-telemetry-label", children: "EyeBlinkLeft" }),
          /* @__PURE__ */ jsx46("div", { className: "vs-mocap-telemetry-bar", children: /* @__PURE__ */ jsx46("div", { className: "vs-mocap-telemetry-fill", style: { width: "82%" } }) }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-telemetry-val", children: "0.82" })
        ] }),
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-telemetry-row", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-telemetry-label", children: "JawOpen" }),
          /* @__PURE__ */ jsx46("div", { className: "vs-mocap-telemetry-bar", children: /* @__PURE__ */ jsx46("div", { className: "vs-mocap-telemetry-fill", style: { width: "64%" } }) }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-telemetry-val", children: "0.64" })
        ] }),
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-telemetry-row", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-telemetry-label", children: "MouthSmile" }),
          /* @__PURE__ */ jsx46("div", { className: "vs-mocap-telemetry-bar", children: /* @__PURE__ */ jsx46("div", { className: "vs-mocap-telemetry-fill", style: { width: "91%" } }) }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-telemetry-val", children: "0.91" })
        ] }),
        /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-telemetry-row", children: [
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-telemetry-label", children: "BrowInnerUp" }),
          /* @__PURE__ */ jsx46("div", { className: "vs-mocap-telemetry-bar", children: /* @__PURE__ */ jsx46("div", { className: "vs-mocap-telemetry-fill", style: { width: "48%" } }) }),
          /* @__PURE__ */ jsx46("span", { className: "vs-mocap-telemetry-val", children: "0.48" })
        ] })
      ] }),
      /* @__PURE__ */ jsx46("div", { className: "vs-mocap-hero-stage__status-badge", children: /* @__PURE__ */ jsx46("span", { children: "LiveLink: ws://127.0.0.1:5000" }) })
    ] }),
    /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-hero-stage__footer", children: [
      /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-hero-stage__meta", children: [
        /* @__PURE__ */ jsx46("span", { className: "vs-mocap-hero-stage__meta-label", children: "Selected Avatar Rig" }),
        /* @__PURE__ */ jsx46("span", { className: "vs-mocap-hero-stage__meta-val", children: activeAvatar === "raccoon" ? "Stylized Raccoon (raccoon_head_small.glb)" : activeAvatar === "metahuman" ? "Unreal MetaHuman LiveLink Stream" : "Dense 468 Landmark Occluder Mesh" })
      ] }),
      /* @__PURE__ */ jsx46(
        "button",
        {
          type: "button",
          onClick: onExploreDemo,
          className: "vs-mocap-hero-stage__quick-btn vs-btn-secondary",
          "data-testid": "hero-quick-launch-btn",
          children: "Launch Mocap Studio \u2192"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs37(
    ProductLandingTemplate,
    {
      productTitle: "Face Motion Capture",
      productBadge: "MediaPipe 52 ARKit Blendshapes",
      productTagline: "Real-time browser face tracking with zero cloud latency and LiveLink streaming to Unreal Engine & Unity.",
      brandName: "VictorShell",
      theme,
      onExploreDemo,
      exploreDemoLabel: "Launch Mocap Studio",
      exploreDemoHref,
      navLinks,
      className: `vs-facemocap-landing-page ${className}`.trim(),
      heroProps: {
        title: "Browser-Based Facial Motion Capture & LiveLink Streaming",
        subtitle: "Sub-Millisecond 52 Blendshape Tracking for Unreal Engine & Unity",
        badge: "Interactive WebGPU Mocap",
        description: "Capture nuanced human facial expressions in real-time using standard webcams. Stream 52 ARKit-compatible expression blendshapes and 6-DOF head rotation directly to MetaHumans, VTuber avatars, and game characters via WebSockets and LiveLink.",
        exploreDemoLabel: "Launch Mocap Studio",
        secondaryCta: {
          label: "View Tech Specs",
          href: "#specs"
        },
        stats: [
          { value: "52 Shapes", label: "ARKit Blendshapes", hint: "Universal facial channels" },
          { value: "60 FPS", label: "Tracking Speed", hint: "Zero jitter webcam stream" },
          { value: "0 ms", label: "Cloud Latency", hint: "100% on-device inference" }
        ],
        visual: heroVisual,
        visualPosition: "right"
      },
      overviewProps: {
        id: "overview",
        badge: "Computer Vision Kinematics",
        title: "Precision Facial Landmark Kinematics Without Hardware Markers",
        subtitle: "From raw webcam frames to calibrated skeletal blendshapes in under 16ms",
        description: "Face Mocap integrates Google MediaPipe Tasks Vision with Three.js WebGPU, executing dense 468-point 3D facial mesh reconstruction directly on user GPU hardware. Without requiring specialized depth cameras or infrared rigs, actors, VTubers, and game animators achieve studio-grade motion capture anywhere.",
        highlights: [
          {
            title: "Zero Cloud Roundtrips & Privacy",
            text: "All computer vision neural networks run locally via WebAssembly and WebGPU. No video frames or facial biometric data ever leave the local machine."
          },
          {
            title: "Direct Unreal LiveLink Bridge",
            text: "Built-in WebSocket streaming client transmits timecoded JSON blendshape packets directly to Unreal Engine LiveLink at 127.0.0.1:5000."
          },
          {
            title: "Adaptive Landmark Smoothing",
            text: "Tunable Kalman and smoothstep filtering eliminates high-frequency sensor noise while preserving sharp eyebrow twitches and lip articulation."
          }
        ],
        visual: /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-measurement-card", "data-testid": "mocap-measurement-card", children: [
          /* @__PURE__ */ jsxs37("div", { className: "vs-mocap-measurement-card__header", children: [
            /* @__PURE__ */ jsx46("span", { className: "vs-mocap-measurement-card__title", children: "Dense 468 Landmark Mesh Topology" }),
            /* @__PURE__ */ jsx46("span", { className: "vs-mocap-chip", children: "mocap_landmarks_measurement.svg" })
          ] }),
          /* @__PURE__ */ jsx46("div", { className: "vs-mocap-measurement-card__body", children: /* @__PURE__ */ jsx46(
            "img",
            {
              src: "/svgs/mocap_landmarks_measurement.svg",
              alt: "Face Mocap Landmark Topology",
              className: "vs-mocap-measurement-card__img",
              loading: "lazy"
            }
          ) }),
          /* @__PURE__ */ jsx46("div", { className: "vs-mocap-measurement-card__footer", children: /* @__PURE__ */ jsx46("span", { className: "vs-mocap-measurement-card__note", children: "468 3D Vertices \xB7 52 Standard ARKit Action Units" }) })
        ] })
      },
      featuresProps: {
        id: "features",
        badge: "Core Technology",
        sectionTitle: "Studio-Grade Facial Tracking in Any Browser",
        sectionSubtitle: "A complete suite of performance capture, smoothing, and game engine streaming tools.",
        layout: "bento",
        columns: 3,
        features
      },
      showcaseProps: {
        id: "showcase",
        badge: "Streaming Modes",
        sectionTitle: "Explore Character Tracking Modes",
        sectionSubtitle: "Switch between game engine streaming, stylized 3D characters, and raw landmark mesh topologies.",
        items: showcaseItems
      },
      benefitsProps: {
        id: "benefits",
        badge: "Performance & Privacy",
        sectionTitle: "Why Creators and Studios Choose Face Mocap",
        sectionSubtitle: "Zero subscription fees, zero cloud compute latency, and 100% biometric privacy.",
        variant: "metrics",
        items: benefits
      },
      ctaProps: {
        id: "cta",
        badge: "Interactive Mocap Studio",
        title: "Experience Real-Time Face Mocap Live in Your Browser",
        description: "Connect your webcam and watch your facial expressions mirrored onto 3D avatars with instant LiveLink streaming ready to broadcast.",
        exploreDemoLabel: "Launch Mocap Studio",
        exploreDemoHref,
        note: "Zero plugins or downloads required \xB7 Runs on standard webcams \xB7 100% client-side"
      },
      children: [
        /* @__PURE__ */ jsx46("section", { className: "vs-landing-use-cases", id: "use-cases", "data-testid": "mocap-use-cases-section", children: /* @__PURE__ */ jsxs37("div", { className: "vs-landing-use-cases__container", children: [
          /* @__PURE__ */ jsxs37("div", { className: "vs-landing-use-cases__header", children: [
            /* @__PURE__ */ jsx46("span", { className: "vs-landing-use-cases__badge", children: "Industry Solutions" }),
            /* @__PURE__ */ jsx46("h2", { className: "vs-landing-use-cases__title", children: "Engineered for Studios, Animators & Streamers" }),
            /* @__PURE__ */ jsx46("p", { className: "vs-landing-use-cases__subtitle", children: "From AAA game cinematics to independent VTuber broadcasts." })
          ] }),
          /* @__PURE__ */ jsxs37("div", { className: "vs-landing-use-cases__grid", children: [
            /* @__PURE__ */ jsxs37("div", { className: "vs-use-case-card", "data-testid": "use-case-games", children: [
              /* @__PURE__ */ jsx46("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3AE}" }),
              /* @__PURE__ */ jsx46("span", { className: "vs-use-case-card__tag", children: "Game Development & VFX" }),
              /* @__PURE__ */ jsx46("h3", { className: "vs-use-case-card__title", children: "Unreal MetaHuman Previz" }),
              /* @__PURE__ */ jsx46("p", { className: "vs-use-case-card__desc", children: "Stream real-time facial performances directly into Unreal Engine Sequencer and Unity Animator without costly head-mounted camera rigs." })
            ] }),
            /* @__PURE__ */ jsxs37("div", { className: "vs-use-case-card", "data-testid": "use-case-vtuber", children: [
              /* @__PURE__ */ jsx46("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F98A}" }),
              /* @__PURE__ */ jsx46("span", { className: "vs-use-case-card__tag", children: "VTubing & Livestreaming" }),
              /* @__PURE__ */ jsx46("h3", { className: "vs-use-case-card__title", children: "Low-Latency Avatar Broadcast" }),
              /* @__PURE__ */ jsx46("p", { className: "vs-use-case-card__desc", children: "Drive stylized 3D VTuber avatars in OBS or streaming software with sub-millisecond lip sync and eye tracking powered by ordinary webcams." })
            ] }),
            /* @__PURE__ */ jsxs37("div", { className: "vs-use-case-card", "data-testid": "use-case-film", children: [
              /* @__PURE__ */ jsx46("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3AC}" }),
              /* @__PURE__ */ jsx46("span", { className: "vs-use-case-card__tag", children: "Film & Commercials" }),
              /* @__PURE__ */ jsx46("h3", { className: "vs-use-case-card__title", children: "Rapid Facial Pre-Visualization" }),
              /* @__PURE__ */ jsx46("p", { className: "vs-use-case-card__desc", children: "Allow directors and voice actors to audition facial dialogues and emotional acting beats in real-time virtual production sets." })
            ] }),
            /* @__PURE__ */ jsxs37("div", { className: "vs-use-case-card", "data-testid": "use-case-telepresence", children: [
              /* @__PURE__ */ jsx46("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F310}" }),
              /* @__PURE__ */ jsx46("span", { className: "vs-use-case-card__tag", children: "Spatial Computing" }),
              /* @__PURE__ */ jsx46("h3", { className: "vs-use-case-card__title", children: "Interactive WebXR Avatars" }),
              /* @__PURE__ */ jsx46("p", { className: "vs-use-case-card__desc", children: "Broadcast lightweight blendshape telemetry packets across WebRTC channels for collaborative VR meetings and social metaverse worlds." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx46("section", { className: "vs-landing-specs", id: "specs", "data-testid": "mocap-specs-section", children: /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__container", children: [
          /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__header", children: [
            /* @__PURE__ */ jsx46("span", { className: "vs-landing-specs__badge", children: "Technical Specifications" }),
            /* @__PURE__ */ jsx46("h2", { className: "vs-landing-specs__title", children: "Engine & Tracking Specifications" }),
            /* @__PURE__ */ jsx46("p", { className: "vs-landing-specs__subtitle", children: "Verified specifications powering the VictorShell Face Motion Capture SDK." })
          ] }),
          /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__grid", children: [
            /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx46("h3", { className: "vs-landing-specs__card-title", children: "Computer Vision & Tracking" }),
              /* @__PURE__ */ jsxs37("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx46("dt", { children: "Neural Network" }),
                  /* @__PURE__ */ jsx46("dd", { children: "MediaPipe Tasks Vision (Google Research)" })
                ] }),
                /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx46("dt", { children: "Landmarks" }),
                  /* @__PURE__ */ jsx46("dd", { children: "468 3D dense facial points + iris tracking" })
                ] }),
                /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx46("dt", { children: "Blendshapes" }),
                  /* @__PURE__ */ jsx46("dd", { children: "52 Apple ARKit standard blendshape channels" })
                ] }),
                /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx46("dt", { children: "Inference Runtime" }),
                  /* @__PURE__ */ jsx46("dd", { children: "WebAssembly (WASM) & WebGL / WebGPU acceleration" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx46("h3", { className: "vs-landing-specs__card-title", children: "LiveLink & Output Streaming" }),
              /* @__PURE__ */ jsxs37("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx46("dt", { children: "Streaming Protocol" }),
                  /* @__PURE__ */ jsx46("dd", { children: "WebSocket (JSON packet stream)" })
                ] }),
                /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx46("dt", { children: "Default Target" }),
                  /* @__PURE__ */ jsx46("dd", { children: "127.0.0.1:5000 (Unreal Engine LiveLink)" })
                ] }),
                /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx46("dt", { children: "Engine Target" }),
                  /* @__PURE__ */ jsx46("dd", { children: "Unreal Engine 4/5, Unity, Blender, WebXR" })
                ] }),
                /* @__PURE__ */ jsxs37("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx46("dt", { children: "Data Privacy" }),
                  /* @__PURE__ */ jsx46("dd", { children: "100% Client-Side \xB7 Zero Server Telemetry" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/JewelryLandingPage.tsx
import { useState as useState26 } from "react";
import { jsx as jsx47, jsxs as jsxs38 } from "react/jsx-runtime";
var JewelryLandingPage = ({
  onExploreDemo,
  exploreDemoHref = "/apps/jewelry-configurator/index.html#demo",
  theme = "orchid",
  className = ""
}) => {
  const navLinks = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Features", href: "#features" },
    { label: "Gemstone Atelier", href: "#showcase" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Performance", href: "#benefits" },
    { label: "Tech Specs", href: "#specs" }
  ];
  const features = [
    {
      id: "spectral-dispersion",
      title: "Ray-Traced Spectral Dispersion",
      description: "Calculates real-time wavelength light splitting using the Cauchy dispersion formula (Abbe 58.6), creating authentic diamond fire and rainbow caustics.",
      badge: "Spectral PBR",
      highlight: true
    },
    {
      id: "noble-metals",
      title: "Precious Metal Alloys",
      description: "Physically modeled microfacet reflectance for 18K Yellow Gold, 18K Rose Gold, Platinum 950, and 18K White Gold with anisotropic micro-grooves.",
      badge: "Noble Metals"
    },
    {
      id: "gemstone-cuts",
      title: "Interactive Diamond Cuts",
      description: "Seamlessly swap center diamond cuts between Round Brilliant, Princess, Emerald, and Cushion shapes with parametric facet realignment.",
      badge: "Gemological Library"
    },
    {
      id: "luxury-lighting",
      title: "Studio Lighting Presets",
      description: "Switch between Studio Softbox, Luxury Jewelry Boutique Spotlight, and Warm Sunset Gem lighting environments for optical brilliance.",
      badge: "HDR Environments"
    },
    {
      id: "carat-scaling",
      title: "Parametric Carat Sizing",
      description: "Interactive diamond carat scaling with proportional pavilion depth and table width calculations adhering to standard gemological grading.",
      badge: "Parametric Gem"
    },
    {
      id: "high-res-render",
      title: "4K Studio Snapshot Export",
      description: "Capture print-ready 4K high-resolution renderings with alpha transparency for e-commerce lookbooks, social media, and customer quotes.",
      badge: "Production 4K"
    }
  ];
  const showcaseItems = [
    {
      id: "solitaire-view",
      label: "Classic Solitaire",
      badge: "ring.glb",
      description: "1.5 Carat Round Brilliant center stone set in a polished Platinum 950 cathedral band with 4-prong claw mounting.",
      visual: /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card", "data-testid": "showcase-solitaire-preview", children: [
        /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-chip", children: "ring.glb" }),
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-chip vs-jewelry-chip--accent", children: "Platinum 950" })
        ] }),
        /* @__PURE__ */ jsx47("div", { className: "vs-jewelry-preview-card__visual", children: /* @__PURE__ */ jsx47(
          "img",
          {
            src: "/logos/jewel.png",
            alt: "VictorShell Classic Solitaire Ring",
            className: "vs-jewelry-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card__meta", children: [
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-preview-card__title", children: "Classic Solitaire Ring" }),
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-preview-card__spec", children: "Round Brilliant Cut \xB7 Cauchy Dispersion \xB7 60 FPS" })
        ] })
      ] })
    },
    {
      id: "halo-view",
      label: "Halo Setting",
      badge: "ring2.glb",
      description: "Cushion cut diamond surrounded by 24 micro-pav\xE9 melee diamonds set in warm 18K Rose Gold with millgrain edge detailing.",
      visual: /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card", "data-testid": "showcase-halo-preview", children: [
        /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-chip", children: "ring2.glb" }),
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-chip vs-jewelry-chip--accent", children: "18K Rose Gold" })
        ] }),
        /* @__PURE__ */ jsx47("div", { className: "vs-jewelry-preview-card__visual", children: /* @__PURE__ */ jsx47(
          "img",
          {
            src: "/logos/jewel.png",
            alt: "VictorShell Halo Setting Ring",
            className: "vs-jewelry-preview-card__img vs-jewelry-preview-card__img--alt",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card__meta", children: [
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-preview-card__title", children: "Halo Pav\xE9 Setting" }),
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-preview-card__spec", children: "Micro-Pav\xE9 Melee \xB7 18K Rose Gold \xB7 Anisotropic Sheen" })
        ] })
      ] })
    },
    {
      id: "diamonds-view",
      label: "Gemstone Cluster",
      badge: "diamonds.glb",
      description: "Multi-stone diamond cluster demonstrating spectral ray tracing and chromatic light splitting across faceted gemstone clusters.",
      visual: /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card", "data-testid": "showcase-cluster-preview", children: [
        /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-chip", children: "diamonds.glb" }),
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-chip vs-jewelry-chip--accent", children: "Multi-Gem Array" })
        ] }),
        /* @__PURE__ */ jsx47("div", { className: "vs-jewelry-preview-card__visual", children: /* @__PURE__ */ jsx47(
          "img",
          {
            src: "/logos/jewel.png",
            alt: "VictorShell Multi-Diamond Cluster",
            className: "vs-jewelry-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-preview-card__meta", children: [
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-preview-card__title", children: "Multi-Gemstone Cluster" }),
          /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-preview-card__spec", children: "Spectral Ray Tracing \xB7 Total Internal Reflection" })
        ] })
      ] })
    }
  ];
  const benefits = [
    {
      id: "dispersion",
      title: "Abbe 58.6 Dispersion Index",
      description: "Accurately calculates chromatic wavelength separation, generating natural diamond fire and scintillation sparkle.",
      metric: "Abbe 58.6",
      metricLabel: "Optical Dispersion",
      tag: "Physics Based"
    },
    {
      id: "fps",
      title: "60 FPS Real-Time Ray Tracing",
      description: "Three.js WebGPU compute shaders calculate internal reflections instantly with zero dropped frames on laptops and phones.",
      metric: "60 FPS",
      metricLabel: "WebGPU Viewport",
      tag: "Performance"
    },
    {
      id: "conversion",
      title: "3.4x E-Commerce Engagement",
      description: "Interactive 3D diamond inspection removes buyer hesitation and increases average order value for luxury bridal retailers.",
      metric: "3.4x",
      metricLabel: "Engagement Lift",
      tag: "E-Commerce ROI"
    },
    {
      id: "accuracy",
      title: "True Anisotropic Reflection",
      description: "Precision micro-groove reflection renders polished platinum and brushed gold bands with optical fidelity.",
      metric: "100%",
      metricLabel: "Material Fidelity",
      tag: "Luxury Grade"
    }
  ];
  const [activeMetal, setActiveMetal] = useState26("platinum");
  const [activeCut, setActiveCut] = useState26("round");
  const metalNames = {
    yellow: "18K Yellow Gold",
    rose: "18K Rose Gold",
    platinum: "Platinum 950",
    white: "18K White Gold"
  };
  const cutNames = {
    round: "Round Brilliant Cut (57 Facets)",
    princess: "Princess Cut (76 Facets)",
    emerald: "Emerald Step Cut (50 Facets)",
    cushion: "Cushion Modified Brilliant"
  };
  const heroVisual = /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-hero-stage", "data-testid": "jewelry-hero-stage", children: [
    /* @__PURE__ */ jsx47("div", { className: "vs-jewelry-hero-stage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-hero-stage__controls", children: [
      /* @__PURE__ */ jsxs38("span", { className: "vs-jewelry-hero-stage__indicator", children: [
        /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-hero-stage__dot" }),
        "WebGPU Spectral Raytracing: Active"
      ] }),
      /* @__PURE__ */ jsx47("div", { className: "vs-jewelry-hero-stage__cuts", children: ["round", "princess", "emerald", "cushion"].map((cut) => /* @__PURE__ */ jsx47(
        "button",
        {
          type: "button",
          className: `vs-jewelry-cut-btn ${activeCut === cut ? "is-active" : ""}`,
          onClick: () => setActiveCut(cut),
          "aria-label": `Select ${cut} cut`,
          children: cut.toUpperCase()
        },
        cut
      )) })
    ] }),
    /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-hero-stage__viewport", children: [
      /* @__PURE__ */ jsx47(
        "img",
        {
          src: "/logos/jewel.png",
          alt: "Jewelry Configurator 3D Diamond Ring",
          className: "vs-jewelry-hero-stage__gem"
        }
      ),
      /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-sparkle-pin vs-jewelry-sparkle-pin--crown", children: [
        /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-sparkle-dot" }),
        /* @__PURE__ */ jsx47("span", { children: "Crown Caustic Fire" })
      ] }),
      /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-sparkle-pin vs-jewelry-sparkle-pin--band", children: [
        /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-sparkle-dot" }),
        /* @__PURE__ */ jsx47("span", { children: "Anisotropic Metal" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-hero-stage__footer", children: [
      /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-hero-stage__meta", children: [
        /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-hero-stage__meta-label", children: "Selected Metal & Cut" }),
        /* @__PURE__ */ jsxs38("span", { className: "vs-jewelry-hero-stage__meta-val", children: [
          metalNames[activeMetal],
          " \xB7 ",
          cutNames[activeCut]
        ] }),
        /* @__PURE__ */ jsxs38("div", { style: { display: "flex", gap: "6px", marginTop: "6px" }, children: [
          /* @__PURE__ */ jsx47(
            "button",
            {
              type: "button",
              onClick: () => setActiveMetal("platinum"),
              style: {
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "999px",
                border: activeMetal === "platinum" ? "1px solid var(--vs-primary)" : "1px solid var(--vs-control-border)",
                background: activeMetal === "platinum" ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.6)",
                color: activeMetal === "platinum" ? "var(--vs-primary)" : "var(--vs-ink-muted)",
                cursor: "pointer"
              },
              children: "Platinum"
            }
          ),
          /* @__PURE__ */ jsx47(
            "button",
            {
              type: "button",
              onClick: () => setActiveMetal("rose"),
              style: {
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "999px",
                border: activeMetal === "rose" ? "1px solid var(--vs-primary)" : "1px solid var(--vs-control-border)",
                background: activeMetal === "rose" ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.6)",
                color: activeMetal === "rose" ? "var(--vs-primary)" : "var(--vs-ink-muted)",
                cursor: "pointer"
              },
              children: "Rose Gold"
            }
          ),
          /* @__PURE__ */ jsx47(
            "button",
            {
              type: "button",
              onClick: () => setActiveMetal("yellow"),
              style: {
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "999px",
                border: activeMetal === "yellow" ? "1px solid var(--vs-primary)" : "1px solid var(--vs-control-border)",
                background: activeMetal === "yellow" ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.6)",
                color: activeMetal === "yellow" ? "var(--vs-primary)" : "var(--vs-ink-muted)",
                cursor: "pointer"
              },
              children: "Yellow Gold"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx47(
        "button",
        {
          type: "button",
          onClick: onExploreDemo,
          className: "vs-jewelry-hero-stage__quick-btn vs-btn-secondary",
          "data-testid": "hero-quick-launch-btn",
          children: "Launch Atelier \u2192"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs38(
    ProductLandingTemplate,
    {
      productTitle: "Jewelry Configurator",
      productBadge: "Ray-Traced Spectral Dispersion",
      productTagline: "Physically-based real-time 3D diamond caustics, precious metals, and custom ring customization.",
      brandName: "VictorShell",
      theme,
      onExploreDemo,
      exploreDemoLabel: "Launch Jewelry Studio",
      exploreDemoHref,
      navLinks,
      className: `vs-jewelry-landing-page ${className}`.trim(),
      heroProps: {
        title: "Photorealistic 3D Jewelry & Ray-Traced Diamond Studio",
        subtitle: "Physical Dispersion, Diamond Fire Caustics, and Precious Metals in WebGPU",
        badge: "Spectral PBR Engine \xB7 Abbe 58.6",
        description: "Experience diamond fire and optical light dispersion rendered in real time. Customize bespoke engagement rings, explore 18K precious metals, swap gemstone cuts, and inspect spectral sparkle with optical clarity on any device.",
        exploreDemoLabel: "Launch Jewelry Studio",
        secondaryCta: {
          label: "View Tech Specs",
          href: "#specs"
        },
        stats: [
          { value: "Abbe 58.6", label: "Optical Dispersion", hint: "Natural rainbow diamond fire" },
          { value: "5 Cuts", label: "Gemstone Shapes", hint: "Brilliant, Princess, Emerald" },
          { value: "4 Metals", label: "Precious Alloys", hint: "Platinum, Gold, Rose Gold" }
        ],
        visual: heroVisual,
        visualPosition: "right"
      },
      overviewProps: {
        id: "overview",
        badge: "Optical Gemology",
        title: "Sub-Surface Refraction & Physical Diamond Caustics",
        subtitle: "Simulating light ray dispersion through crystalline micro-facets",
        description: "Unlike standard glossy 3D shaders, the VictorShell Jewelry Configurator calculates real-time internal total reflection, chromatic aberration, and spectral wavelength splitting based on physical gemological equations (Cauchy formula, Abbe dispersion index 58.6). Light enters the crown, reflects within the pavilion facets, and exits as fiery rainbows.",
        highlights: [
          {
            title: "Accurate Spectral Fire",
            text: "Real-time wavelength splitting separates incoming white light into red, green, and violet caustic reflections inside the stone."
          },
          {
            title: "Anisotropic Metal Shaders",
            text: "Physically modeled anisotropic micro-grooves accurately render polished platinum and brushed gold ring bands with realistic specular streaks."
          },
          {
            title: "Dynamic Gemstone Swapping",
            text: "Seamless real-time swapping between round brilliant, princess, cushion, and emerald diamond cuts without model reloading delay."
          }
        ],
        visual: /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-optical-card", "data-testid": "jewelry-optical-card", children: [
          /* @__PURE__ */ jsxs38("div", { className: "vs-jewelry-optical-card__header", children: [
            /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-optical-card__title", children: "Physical Diamond Refraction (Abbe 58.6)" }),
            /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-chip", children: "DiamondPlugin WebGPU" })
          ] }),
          /* @__PURE__ */ jsx47("div", { className: "vs-jewelry-optical-card__body", children: /* @__PURE__ */ jsx47(
            "img",
            {
              src: "/logos/jewel.png",
              alt: "Jewelry Diamond Optical Refraction",
              className: "vs-jewelry-optical-card__img",
              loading: "lazy"
            }
          ) }),
          /* @__PURE__ */ jsx47("div", { className: "vs-jewelry-optical-card__footer", children: /* @__PURE__ */ jsx47("span", { className: "vs-jewelry-optical-card__note", children: "Total Internal Reflection \xB7 Chromatic Abbe Splitting" }) })
        ] })
      },
      featuresProps: {
        id: "features",
        badge: "Atelier Capabilities",
        sectionTitle: "Luxury Craftsmanship Meets WebGPU Precision",
        sectionSubtitle: "Tools engineered for luxury maisons, bespoke jewelers, and high-conversion bridal e-commerce.",
        layout: "bento",
        columns: 3,
        features
      },
      showcaseProps: {
        id: "showcase",
        badge: "Ring Settings",
        sectionTitle: "Explore Signature Ring Settings",
        sectionSubtitle: "Switch between handcrafted solitaire rings, halo pav\xE9 designs, and multi-gemstone clusters.",
        items: showcaseItems
      },
      benefitsProps: {
        id: "benefits",
        badge: "Prestige & Performance",
        sectionTitle: "Why Luxury Maisons Choose VictorShell",
        sectionSubtitle: "Zero rendering compromise, instant load speeds, and photorealistic gemological fidelity.",
        variant: "metrics",
        items: benefits
      },
      ctaProps: {
        id: "cta",
        badge: "Interactive Gem Studio",
        title: "Experience the 3D Jewelry Configurator Live",
        description: "Step into the virtual jewelry atelier. Inspect diamond sparkle, switch precious metal bands, and customize diamond cuts in your browser.",
        exploreDemoLabel: "Launch Jewelry Studio",
        exploreDemoHref,
        note: "High-precision WebGPU shaders \xB7 Mobile, tablet & desktop ready \xB7 Zero downloads"
      },
      children: [
        /* @__PURE__ */ jsx47("section", { className: "vs-landing-use-cases", id: "use-cases", "data-testid": "jewelry-use-cases-section", children: /* @__PURE__ */ jsxs38("div", { className: "vs-landing-use-cases__container", children: [
          /* @__PURE__ */ jsxs38("div", { className: "vs-landing-use-cases__header", children: [
            /* @__PURE__ */ jsx47("span", { className: "vs-landing-use-cases__badge", children: "Luxury Verticals" }),
            /* @__PURE__ */ jsx47("h2", { className: "vs-landing-use-cases__title", children: "Tailored for Haute Joaillerie & E-Commerce" }),
            /* @__PURE__ */ jsx47("p", { className: "vs-landing-use-cases__subtitle", children: "From bespoke atelier consultations to high-volume luxury bridal storefronts." })
          ] }),
          /* @__PURE__ */ jsxs38("div", { className: "vs-landing-use-cases__grid", children: [
            /* @__PURE__ */ jsxs38("div", { className: "vs-use-case-card", "data-testid": "use-case-atelier", children: [
              /* @__PURE__ */ jsx47("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F48E}" }),
              /* @__PURE__ */ jsx47("span", { className: "vs-use-case-card__tag", children: "Haute Joaillerie" }),
              /* @__PURE__ */ jsx47("h3", { className: "vs-use-case-card__title", children: "Bespoke Atelier Consultations" }),
              /* @__PURE__ */ jsx47("p", { className: "vs-use-case-card__desc", children: "Enable master jewelers to collaborate with private clients in real-time consultations, swapping rare gemstone cuts and noble metal alloys live on iPad or desktop." })
            ] }),
            /* @__PURE__ */ jsxs38("div", { className: "vs-use-case-card", "data-testid": "use-case-bridal", children: [
              /* @__PURE__ */ jsx47("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F48D}" }),
              /* @__PURE__ */ jsx47("span", { className: "vs-use-case-card__tag", children: "Luxury Bridal E-Commerce" }),
              /* @__PURE__ */ jsx47("h3", { className: "vs-use-case-card__title", children: "Custom Engagement Ring Builders" }),
              /* @__PURE__ */ jsx47("p", { className: "vs-use-case-card__desc", children: "Provide couples with an interactive 3D ring designer where they can inspect diamond fire, adjust carat weight, and preview band engravings with confidence." })
            ] }),
            /* @__PURE__ */ jsxs38("div", { className: "vs-use-case-card", "data-testid": "use-case-traders", children: [
              /* @__PURE__ */ jsx47("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F52C}" }),
              /* @__PURE__ */ jsx47("span", { className: "vs-use-case-card__tag", children: "Diamond Trading & Labs" }),
              /* @__PURE__ */ jsx47("h3", { className: "vs-use-case-card__title", children: "Certified Diamond Visualizer" }),
              /* @__PURE__ */ jsx47("p", { className: "vs-use-case-card__desc", children: "Showcase certified diamond proportions, pavilion depth, and optical light return metrics for online diamond bourses and gemological grading laboratories." })
            ] }),
            /* @__PURE__ */ jsxs38("div", { className: "vs-use-case-card", "data-testid": "use-case-retail", children: [
              /* @__PURE__ */ jsx47("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3EC}" }),
              /* @__PURE__ */ jsx47("span", { className: "vs-use-case-card__tag", children: "Retail & Showrooms" }),
              /* @__PURE__ */ jsx47("h3", { className: "vs-use-case-card__title", children: "In-Store Interactive Kiosks" }),
              /* @__PURE__ */ jsx47("p", { className: "vs-use-case-card__desc", children: "Deploy silky 60 FPS touch kiosks in physical boutique showrooms, allowing walk-in customers to explore millions of diamond and metal combinations effortlessly." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx47("section", { className: "vs-landing-specs", id: "specs", "data-testid": "jewelry-specs-section", children: /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__container", children: [
          /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__header", children: [
            /* @__PURE__ */ jsx47("span", { className: "vs-landing-specs__badge", children: "Technical Specifications" }),
            /* @__PURE__ */ jsx47("h2", { className: "vs-landing-specs__title", children: "Optical & Shader Specifications" }),
            /* @__PURE__ */ jsx47("p", { className: "vs-landing-specs__subtitle", children: "Verified optical equations powering the VictorShell Jewelry Configurator." })
          ] }),
          /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__grid", children: [
            /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx47("h3", { className: "vs-landing-specs__card-title", children: "Diamond Raytracing & Dispersion" }),
              /* @__PURE__ */ jsxs38("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx47("dt", { children: "Shader Engine" }),
                  /* @__PURE__ */ jsx47("dd", { children: "Three.js WebGPU / DiamondPlugin" })
                ] }),
                /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx47("dt", { children: "Dispersion Formula" }),
                  /* @__PURE__ */ jsx47("dd", { children: "Cauchy equation with Abbe coefficient (V = 58.6)" })
                ] }),
                /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx47("dt", { children: "Internal Reflections" }),
                  /* @__PURE__ */ jsx47("dd", { children: "Multi-bounce total internal reflection (TIR)" })
                ] }),
                /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx47("dt", { children: "Gemstone Geometry" }),
                  /* @__PURE__ */ jsx47("dd", { children: "Optimized GLTF with Draco facet compression" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx47("h3", { className: "vs-landing-specs__card-title", children: "Precious Metals & Studio Lighting" }),
              /* @__PURE__ */ jsxs38("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx47("dt", { children: "Metal BRDF" }),
                  /* @__PURE__ */ jsx47("dd", { children: "Anisotropic microfacet reflection model" })
                ] }),
                /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx47("dt", { children: "Precious Metals" }),
                  /* @__PURE__ */ jsx47("dd", { children: "18K Yellow, 18K Rose, Platinum 950, White Gold" })
                ] }),
                /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx47("dt", { children: "Lighting Environments" }),
                  /* @__PURE__ */ jsx47("dd", { children: "HDR Softbox, Boutique Spotlight, Sunset Gem" })
                ] }),
                /* @__PURE__ */ jsxs38("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx47("dt", { children: "Export Capabilities" }),
                  /* @__PURE__ */ jsx47("dd", { children: "Print-ready 4K PNG renders with alpha transparency" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/BoxLandingPage.tsx
import { useState as useState27 } from "react";
import { jsx as jsx48, jsxs as jsxs39 } from "react/jsx-runtime";
var BoxLandingPage = ({
  onExploreDemo,
  exploreDemoHref = "/apps/box-configurator/index.html#demo",
  theme = "indigo",
  className = ""
}) => {
  const navLinks = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Features", href: "#features" },
    { label: "Box Templates", href: "#showcase" },
    { label: "Packaging Verticals", href: "#use-cases" },
    { label: "Manufacturing", href: "#benefits" },
    { label: "Tech Specs", href: "#specs" }
  ];
  const features = [
    {
      id: "parametric-kinematics",
      title: "Real-Time Carton Kinematics",
      description: "Smoothly animate the continuous folding sequence from a 2D flat dieline into a closed 3D carton with realistic hinge constraints.",
      badge: "Hierarchical 3D Fold",
      highlight: true
    },
    {
      id: "vector-decals",
      title: "Interactive 2D Decal Projection",
      description: "Place, scale, and rotate high-resolution brand logos, vector typography, and graphics across box panels using Konva with zero distortion.",
      badge: "Konva 2D Engine"
    },
    {
      id: "standard-templates",
      title: "Standard Packaging Library",
      description: "Pre-engineered industry templates including Reverse Tuck End cartons, Roll-End Mailers, and Counter Display Trays ready to customize.",
      badge: "FEFCO / ECMA Standard"
    },
    {
      id: "dieline-export",
      title: "Production Vector Dieline Export",
      description: "Generate precision CAD/CAM dielines with separated vector layers for cut lines, crease scores, bleeds, and dimension callouts.",
      badge: "PDF / SVG / DXF"
    },
    {
      id: "parametric-sizing",
      title: "Instant Dimension Scaling",
      description: "Adjust width, height, and depth dynamically while internal algorithm recalculates all tuck flaps, dust flaps, and glue tabs automatically.",
      badge: "Auto-Flap Grading"
    },
    {
      id: "material-finishes",
      title: "Substrate & Foil Shaders",
      description: "Simulate authentic packaging materials including natural kraft board, corrugated flute, premium coated cardstock, and metallic foil stamping.",
      badge: "WebGPU PBR"
    }
  ];
  const showcaseItems = [
    {
      id: "mailer-view",
      label: "E-Commerce Mailer",
      badge: "box-mailer",
      description: "Roll-End Tuck-Front (RETF) mailer box with self-locking dust flaps and reinforced side walls, engineered for unboxing experiences.",
      visual: /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card", "data-testid": "showcase-mailer-preview", children: [
        /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx48("span", { className: "vs-box-chip", children: "box-mailer" }),
          /* @__PURE__ */ jsx48("span", { className: "vs-box-chip vs-box-chip--accent", children: "Roll-End Tuck-Front" })
        ] }),
        /* @__PURE__ */ jsx48("div", { className: "vs-box-preview-card__visual", children: /* @__PURE__ */ jsx48(
          "img",
          {
            src: "/logos/box.png",
            alt: "VictorShell Mailer Box",
            className: "vs-box-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card__meta", children: [
          /* @__PURE__ */ jsx48("span", { className: "vs-box-preview-card__title", children: "E-Commerce Mailer Box" }),
          /* @__PURE__ */ jsx48("span", { className: "vs-box-preview-card__spec", children: "Self-Locking Flaps \xB7 E-Flute Corrugated \xB7 250\xD7180\xD780mm" })
        ] })
      ] })
    },
    {
      id: "tuck-end-view",
      label: "Reverse Tuck End",
      badge: "box-tuck-end",
      description: "Classic folding carton with friction-lock tuck flaps on opposite sides, ideal for cosmetics, pharmaceuticals, and retail retail goods.",
      visual: /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card", "data-testid": "showcase-tuck-preview", children: [
        /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx48("span", { className: "vs-box-chip", children: "box-tuck-end" }),
          /* @__PURE__ */ jsx48("span", { className: "vs-box-chip vs-box-chip--accent", children: "Reverse Tuck Style" })
        ] }),
        /* @__PURE__ */ jsx48("div", { className: "vs-box-preview-card__visual", children: /* @__PURE__ */ jsx48(
          "img",
          {
            src: "/logos/box.png",
            alt: "VictorShell Reverse Tuck End Box",
            className: "vs-box-preview-card__img vs-box-preview-card__img--alt",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card__meta", children: [
          /* @__PURE__ */ jsx48("span", { className: "vs-box-preview-card__title", children: "Reverse Tuck End Carton" }),
          /* @__PURE__ */ jsx48("span", { className: "vs-box-preview-card__spec", children: "Dual Tuck Closures \xB7 18pt SBS Paperboard \xB7 80\xD750\xD7140mm" })
        ] })
      ] })
    },
    {
      id: "tray-view",
      label: "Display Tray",
      badge: "box-open-tray",
      description: "Open-top retail display tray with reinforced double-wall sides designed for point-of-sale merchandising and counter showcases.",
      visual: /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card", "data-testid": "showcase-tray-preview", children: [
        /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx48("span", { className: "vs-box-chip", children: "box-open-tray" }),
          /* @__PURE__ */ jsx48("span", { className: "vs-box-chip vs-box-chip--accent", children: "Open Counter Tray" })
        ] }),
        /* @__PURE__ */ jsx48("div", { className: "vs-box-preview-card__visual", children: /* @__PURE__ */ jsx48(
          "img",
          {
            src: "/logos/box.png",
            alt: "VictorShell Display Tray",
            className: "vs-box-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs39("div", { className: "vs-box-preview-card__meta", children: [
          /* @__PURE__ */ jsx48("span", { className: "vs-box-preview-card__title", children: "Counter Merchandising Tray" }),
          /* @__PURE__ */ jsx48("span", { className: "vs-box-preview-card__spec", children: "Open Display \xB7 Double-Wall Stiffeners \xB7 200\xD7150\xD760mm" })
        ] })
      ] })
    }
  ];
  const benefits = [
    {
      id: "dieline-speed",
      title: "Instant Dieline Computation",
      description: "Structural kinematics recalculate folding creases, cut perimeters, and glue flaps in sub-milliseconds as dimensions change.",
      metric: "0 sec",
      metricLabel: "Calculation Delay",
      tag: "Real-Time CAD"
    },
    {
      id: "cut-accuracy",
      title: "100% Vector Precision",
      description: "Mathematical bezier contours ensure exported dielines match die-maker cutting rules with zero polygon tessellation error.",
      metric: "100%",
      metricLabel: "Vector Accuracy",
      tag: "Factory Grade"
    },
    {
      id: "render-speed",
      title: "60 FPS 3D Kinematics",
      description: "Hierarchical scene graph calculates multi-panel folding angles smoothly in real-time WebGPU on any mobile or desktop screen.",
      metric: "60 FPS",
      metricLabel: "Folding Simulation",
      tag: "WebGL / WebGPU"
    },
    {
      id: "export-formats",
      title: "Universal CAD/CAM Formats",
      description: "Export production dielines in PDF, SVG, DXF, and PNG with separated cut lines, score creases, and dimension annotations.",
      metric: "4+ Formats",
      metricLabel: "Production Outputs",
      tag: "CNC Ready"
    }
  ];
  const [activeTemplate, setActiveTemplate] = useState27("mailer");
  const [unfoldPercent, setUnfoldPercent] = useState27(35);
  const heroVisual = /* @__PURE__ */ jsxs39("div", { className: "vs-box-hero-stage", "data-testid": "box-hero-stage", children: [
    /* @__PURE__ */ jsx48("div", { className: "vs-box-hero-stage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs39("div", { className: "vs-box-hero-stage__controls", children: [
      /* @__PURE__ */ jsx48("div", { className: "vs-box-hero-stage__templates", children: ["mailer", "tuck", "tray"].map((tpl) => /* @__PURE__ */ jsx48(
        "button",
        {
          type: "button",
          className: `vs-box-tpl-btn ${activeTemplate === tpl ? "is-active" : ""}`,
          onClick: () => setActiveTemplate(tpl),
          "aria-label": `Select ${tpl} template`,
          children: tpl === "mailer" ? "MAILER BOX" : tpl === "tuck" ? "TUCK END" : "OPEN TRAY"
        },
        tpl
      )) }),
      /* @__PURE__ */ jsx48("span", { className: "vs-box-chip vs-box-chip--accent", children: unfoldPercent === 0 ? "Closed 3D Box" : unfoldPercent === 100 ? "Flat 2D Dieline" : `Folding: ${unfoldPercent}%` })
    ] }),
    /* @__PURE__ */ jsxs39("div", { className: "vs-box-hero-stage__viewport", children: [
      /* @__PURE__ */ jsx48(
        "img",
        {
          src: "/logos/box.png",
          alt: "Box Configurator 3D Packaging Model",
          className: "vs-box-hero-stage__model"
        }
      ),
      /* @__PURE__ */ jsx48("div", { className: "vs-box-dimension-chip vs-box-dimension-chip--width", children: /* @__PURE__ */ jsx48("span", { children: "Width: 220mm" }) }),
      /* @__PURE__ */ jsx48("div", { className: "vs-box-dimension-chip vs-box-dimension-chip--height", children: /* @__PURE__ */ jsx48("span", { children: "Height: 160mm" }) }),
      /* @__PURE__ */ jsx48("div", { className: "vs-box-dimension-chip vs-box-dimension-chip--depth", children: /* @__PURE__ */ jsx48("span", { children: "Depth: 75mm" }) })
    ] }),
    /* @__PURE__ */ jsxs39("div", { className: "vs-box-hero-stage__footer", children: [
      /* @__PURE__ */ jsxs39("div", { className: "vs-box-hero-stage__slider-wrap", children: [
        /* @__PURE__ */ jsx48("label", { htmlFor: "vs-box-unfold-slider", className: "vs-box-hero-stage__slider-label", children: "Interactive Fold Sequence" }),
        /* @__PURE__ */ jsx48(
          "input",
          {
            id: "vs-box-unfold-slider",
            type: "range",
            min: "0",
            max: "100",
            value: unfoldPercent,
            onChange: (e) => setUnfoldPercent(Number(e.target.value)),
            className: "vs-box-hero-stage__slider",
            "aria-label": "Box unfold animation progress slider"
          }
        )
      ] }),
      /* @__PURE__ */ jsx48(
        "button",
        {
          type: "button",
          onClick: onExploreDemo,
          className: "vs-box-hero-stage__quick-btn vs-btn-secondary",
          "data-testid": "hero-quick-launch-btn",
          children: "Open 3D Studio \u2192"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs39(
    ProductLandingTemplate,
    {
      productTitle: "Box Configurator",
      productBadge: "Parametric 3D Dieline Engine",
      productTagline: "Real-time parametric folding, 2D vector decal projection, and production-ready dieline export.",
      brandName: "VictorShell",
      theme,
      onExploreDemo,
      exploreDemoLabel: "Launch Box Studio",
      exploreDemoHref,
      navLinks,
      className: `vs-box-landing-page ${className}`.trim(),
      heroProps: {
        title: "Parametric 3D Packaging Design & Real-Time Dieline Studio",
        subtitle: "From Custom Dimensions to Production CAD Dielines in Seconds",
        badge: "Parametric Packaging Engine",
        description: "Design custom folding cartons, e-commerce mailer boxes, and retail trays directly in your browser. Adjust dimensions parametrically, place vector brand artwork with precision, preview interactive 3D folding sequences, and export certified dielines ready for die-cut manufacturing.",
        exploreDemoLabel: "Launch Box Studio",
        secondaryCta: {
          label: "View Tech Specs",
          href: "#specs"
        },
        stats: [
          { value: "3 Templates", label: "Box Architectures", hint: "Mailer, Tuck End, Open Tray" },
          { value: "100%", label: "Vector Accuracy", hint: "Millimeter-precise die lines" },
          { value: "4 Formats", label: "Export Options", hint: "PDF, SVG, DXF, PNG" }
        ],
        visual: heroVisual,
        visualPosition: "right"
      },
      overviewProps: {
        id: "overview",
        badge: "Structural Packaging Engineering",
        title: "Precision Carton Kinematics from 2D Vector Cut Paths to 3D Assembly",
        subtitle: "Real-time mathematical propagation of box depth, flap angles, and scoring rules",
        description: "Unlike generic 3D mockups, the VictorShell Box Configurator is built on a true parametric CAD kernel (@trikomi/core/box). Every panel, dust flap, tuck tab, and glue joint is mathematically linked to the primary length, width, and depth parameters. Changing any dimension instantly recalculates the entire unfolded dieline geometry.",
        highlights: [
          {
            title: "Automatic Flap & Tab Grading",
            text: "Tuck flap lengths, finger notches, and glue flap angles scale proportionally according to standard FEFCO/ECMA paperboard manufacturing rules."
          },
          {
            title: "Sub-Millimeter Crease Scoring",
            text: "Accurately distinguishes through-cut perimeters, perforations, and 180\xB0 bidirectional crease score rules with dedicated color codes."
          },
          {
            title: "Live 2D Artwork Mapping",
            text: "Seamless Konva 2D canvas overlay maps graphics, vector text, and barcodes directly onto individual box panels without UV seam tearing."
          }
        ],
        visual: /* @__PURE__ */ jsxs39("div", { className: "vs-box-dieline-card", "data-testid": "box-dieline-card", children: [
          /* @__PURE__ */ jsxs39("div", { className: "vs-box-dieline-card__header", children: [
            /* @__PURE__ */ jsx48("span", { className: "vs-box-dieline-card__title", children: "Computed Dieline Layout" }),
            /* @__PURE__ */ jsx48("span", { className: "vs-box-chip", children: "FEFCO Standard Vector" })
          ] }),
          /* @__PURE__ */ jsx48("div", { className: "vs-box-dieline-card__body", children: /* @__PURE__ */ jsx48("div", { className: "vs-box-dieline-mock", children: /* @__PURE__ */ jsxs39("svg", { viewBox: "0 0 320 200", className: "vs-box-dieline-svg", "aria-label": "Parametric Dieline Geometry Diagram", children: [
            /* @__PURE__ */ jsx48("rect", { x: "20", y: "20", width: "280", height: "160", rx: "4", fill: "none", stroke: "var(--vs-primary)", strokeWidth: "2", strokeDasharray: "none" }),
            /* @__PURE__ */ jsx48("line", { x1: "90", y1: "20", x2: "90", y2: "180", stroke: "var(--vs-primary-light)", strokeWidth: "1.5", strokeDasharray: "4 3" }),
            /* @__PURE__ */ jsx48("line", { x1: "160", y1: "20", x2: "160", y2: "180", stroke: "var(--vs-primary-light)", strokeWidth: "1.5", strokeDasharray: "4 3" }),
            /* @__PURE__ */ jsx48("line", { x1: "230", y1: "20", x2: "230", y2: "180", stroke: "var(--vs-primary-light)", strokeWidth: "1.5", strokeDasharray: "4 3" }),
            /* @__PURE__ */ jsx48("line", { x1: "20", y1: "70", x2: "300", y2: "70", stroke: "var(--vs-primary-light)", strokeWidth: "1.5", strokeDasharray: "4 3" }),
            /* @__PURE__ */ jsx48("line", { x1: "20", y1: "130", x2: "300", y2: "130", stroke: "var(--vs-primary-light)", strokeWidth: "1.5", strokeDasharray: "4 3" }),
            /* @__PURE__ */ jsx48("text", { x: "55", y: "105", fill: "var(--vs-ink-muted)", fontSize: "10", textAnchor: "middle", fontFamily: "var(--vs-font-mono)", children: "Side A" }),
            /* @__PURE__ */ jsx48("text", { x: "125", y: "105", fill: "var(--vs-primary)", fontSize: "11", fontWeight: "700", textAnchor: "middle", fontFamily: "var(--vs-font-mono)", children: "Front Panel" }),
            /* @__PURE__ */ jsx48("text", { x: "195", y: "105", fill: "var(--vs-ink-muted)", fontSize: "10", textAnchor: "middle", fontFamily: "var(--vs-font-mono)", children: "Side B" }),
            /* @__PURE__ */ jsx48("text", { x: "265", y: "105", fill: "var(--vs-ink-muted)", fontSize: "10", textAnchor: "middle", fontFamily: "var(--vs-font-mono)", children: "Back Panel" }),
            /* @__PURE__ */ jsx48("text", { x: "125", y: "50", fill: "var(--vs-ink-subtle)", fontSize: "9", textAnchor: "middle", fontFamily: "var(--vs-font-mono)", children: "Top Flap" }),
            /* @__PURE__ */ jsx48("text", { x: "125", y: "160", fill: "var(--vs-ink-subtle)", fontSize: "9", textAnchor: "middle", fontFamily: "var(--vs-font-mono)", children: "Bottom Tuck" })
          ] }) }) }),
          /* @__PURE__ */ jsx48("div", { className: "vs-box-dieline-card__footer", children: /* @__PURE__ */ jsx48("span", { className: "vs-box-dieline-card__note", children: "Green = Through Cut \xB7 Magenta = Crease Fold \xB7 Blue = Bleed Margin" }) })
        ] })
      },
      featuresProps: {
        id: "features",
        badge: "Packaging Engineering",
        sectionTitle: "Production-Grade Packaging Tools in Your Browser",
        sectionSubtitle: "From initial dimensional concept to manufacturing-ready dielines without external CAD plugins.",
        layout: "bento",
        columns: 3,
        features
      },
      showcaseProps: {
        id: "showcase",
        badge: "Box Architectures",
        sectionTitle: "Explore Industry Packaging Models",
        sectionSubtitle: "Switch between e-commerce mailers, cosmetic tuck-end cartons, and retail counter display trays.",
        items: showcaseItems
      },
      benefitsProps: {
        id: "benefits",
        badge: "Manufacturing & Speed",
        sectionTitle: "Why Packaging Manufacturers Choose Box Configurator",
        sectionSubtitle: "Zero design turnaround latency, 100% vector accuracy, and direct die-cutting export.",
        variant: "metrics",
        items: benefits
      },
      ctaProps: {
        id: "cta",
        badge: "Interactive Packaging Studio",
        title: "Start Designing Your Custom Box in Real-Time 3D",
        description: "Select a template, customize length, width, and depth, place your brand graphics, and export production-ready vector dielines instantly.",
        exploreDemoLabel: "Launch Box Studio",
        exploreDemoHref,
        note: "Zero CAD software installation \xB7 Runs on any browser \xB7 Instant vector export"
      },
      children: [
        /* @__PURE__ */ jsx48("section", { className: "vs-landing-use-cases", id: "use-cases", "data-testid": "box-use-cases-section", children: /* @__PURE__ */ jsxs39("div", { className: "vs-landing-use-cases__container", children: [
          /* @__PURE__ */ jsxs39("div", { className: "vs-landing-use-cases__header", children: [
            /* @__PURE__ */ jsx48("span", { className: "vs-landing-use-cases__badge", children: "Packaging Verticals" }),
            /* @__PURE__ */ jsx48("h2", { className: "vs-landing-use-cases__title", children: "Engineered for Brands, Printers & Die-Makers" }),
            /* @__PURE__ */ jsx48("p", { className: "vs-landing-use-cases__subtitle", children: "From direct-to-consumer unboxing boxes to mass-production retail packaging lines." })
          ] }),
          /* @__PURE__ */ jsxs39("div", { className: "vs-landing-use-cases__grid", children: [
            /* @__PURE__ */ jsxs39("div", { className: "vs-use-case-card", "data-testid": "use-case-ecommerce", children: [
              /* @__PURE__ */ jsx48("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F4E6}" }),
              /* @__PURE__ */ jsx48("span", { className: "vs-use-case-card__tag", children: "E-Commerce & D2C" }),
              /* @__PURE__ */ jsx48("h3", { className: "vs-use-case-card__title", children: "Custom Branded Mailers" }),
              /* @__PURE__ */ jsx48("p", { className: "vs-use-case-card__desc", children: "Enable online retailers and subscription box brands to design personalized unboxing packages with dynamic double-sided artwork and custom inserts." })
            ] }),
            /* @__PURE__ */ jsxs39("div", { className: "vs-use-case-card", "data-testid": "use-case-cosmetics", children: [
              /* @__PURE__ */ jsx48("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F484}" }),
              /* @__PURE__ */ jsx48("span", { className: "vs-use-case-card__tag", children: "Cosmetics & Pharma" }),
              /* @__PURE__ */ jsx48("h3", { className: "vs-use-case-card__title", children: "Reverse Tuck Folding Cartons" }),
              /* @__PURE__ */ jsx48("p", { className: "vs-use-case-card__desc", children: "Design lightweight paperboard cartons for perfumes, skincare bottles, and medicine packaging with tight friction-lock closures and safety tabs." })
            ] }),
            /* @__PURE__ */ jsxs39("div", { className: "vs-use-case-card", "data-testid": "use-case-retail", children: [
              /* @__PURE__ */ jsx48("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3EA}" }),
              /* @__PURE__ */ jsx48("span", { className: "vs-use-case-card__tag", children: "Retail & POS" }),
              /* @__PURE__ */ jsx48("h3", { className: "vs-use-case-card__title", children: "Point-of-Sale Counter Trays" }),
              /* @__PURE__ */ jsx48("p", { className: "vs-use-case-card__desc", children: "Create sturdy corrugated open display boxes for checkout counters and supermarket shelves with integrated header cards and tear-away lips." })
            ] }),
            /* @__PURE__ */ jsxs39("div", { className: "vs-use-case-card", "data-testid": "use-case-diemakers", children: [
              /* @__PURE__ */ jsx48("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F4D0}" }),
              /* @__PURE__ */ jsx48("span", { className: "vs-use-case-card__tag", children: "Print Production" }),
              /* @__PURE__ */ jsx48("h3", { className: "vs-use-case-card__title", children: "Direct CNC Die-Cutter Export" }),
              /* @__PURE__ */ jsx48("p", { className: "vs-use-case-card__desc", children: "Deliver clean 1:1 scale DXF and vector PDF files directly into Z\xFCnd, Kongsberg, and laser die-cutting software with zero manual redraw overhead." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx48("section", { className: "vs-landing-specs", id: "specs", "data-testid": "box-specs-section", children: /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__container", children: [
          /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__header", children: [
            /* @__PURE__ */ jsx48("span", { className: "vs-landing-specs__badge", children: "Technical Specifications" }),
            /* @__PURE__ */ jsx48("h2", { className: "vs-landing-specs__title", children: "Structural & CAD Specifications" }),
            /* @__PURE__ */ jsx48("p", { className: "vs-landing-specs__subtitle", children: "Verified structural packaging specifications powering the VictorShell Box Configurator." })
          ] }),
          /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__grid", children: [
            /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx48("h3", { className: "vs-landing-specs__card-title", children: "Parametric CAD Engine" }),
              /* @__PURE__ */ jsxs39("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx48("dt", { children: "Geometry Kernel" }),
                  /* @__PURE__ */ jsx48("dd", { children: "@trikomi/core/box parametric node graph" })
                ] }),
                /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx48("dt", { children: "Kinematic Solver" }),
                  /* @__PURE__ */ jsx48("dd", { children: "Hierarchical 3D panel folding with collision guards" })
                ] }),
                /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx48("dt", { children: "Flap Calculations" }),
                  /* @__PURE__ */ jsx48("dd", { children: "FEFCO & ECMA standard packaging rule propagation" })
                ] }),
                /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx48("dt", { children: "Graphic Projection" }),
                  /* @__PURE__ */ jsx48("dd", { children: "Konva 2D vector canvas to 3D WebGPU PBR texture mapping" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx48("h3", { className: "vs-landing-specs__card-title", children: "CAD/CAM & Export Formats" }),
              /* @__PURE__ */ jsxs39("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx48("dt", { children: "Vector Dieline" }),
                  /* @__PURE__ */ jsx48("dd", { children: "PDF (Vector), SVG, DXF (AutoCAD / CNC)" })
                ] }),
                /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx48("dt", { children: "Layer Separation" }),
                  /* @__PURE__ */ jsx48("dd", { children: "Through-Cut, Crease Score, Bleed, Dimensions" })
                ] }),
                /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx48("dt", { children: "3D Asset Export" }),
                  /* @__PURE__ */ jsx48("dd", { children: "GLTF 2.0 with embedded PBR textures" })
                ] }),
                /* @__PURE__ */ jsxs39("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx48("dt", { children: "Design Presets" }),
                  /* @__PURE__ */ jsx48("dd", { children: "Tuck End, Roll-End Mailer, Open Display Tray, Custom" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/TourLandingPage.tsx
import { useState as useState28 } from "react";
import { jsx as jsx49, jsxs as jsxs40 } from "react/jsx-runtime";
var TourLandingPage = ({
  onExploreDemo,
  exploreDemoHref = "/apps/360tour/index.html#demo",
  theme = "violet",
  className = ""
}) => {
  const navLinks = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Features", href: "#features" },
    { label: "Tour Modes", href: "#showcase" },
    { label: "Virtual Verticals", href: "#use-cases" },
    { label: "Performance", href: "#benefits" },
    { label: "Tech Specs", href: "#specs" }
  ];
  const features = [
    {
      id: "spherical-engine",
      title: "Equirectangular Spherical Engine",
      description: "High-resolution panoramic sphere rendering with Three.js inverse normal projection, sub-pixel mipmapping, and hardware-accelerated WebGPU rasterization.",
      badge: "Three.js Sphere",
      highlight: true
    },
    {
      id: "hotspot-graph",
      title: "Interactive Hotspot Node Graph",
      description: "Connect multiple panoramic scenes with animated teleportation hotspots, custom tooltip labels, and smooth camera zoom-through transitions.",
      badge: "Teleportation Mesh"
    },
    {
      id: "opfs-storage",
      title: "Offline OPFS Client Storage",
      description: "Leverages the browser Origin Private File System and IndexedDB to cache high-res equirectangular images locally without recurring cloud database fees.",
      badge: "Zero Cloud Storage"
    },
    {
      id: "zip-export",
      title: "Autonomous Standalone ZIP Export",
      description: "One-click client-side export bundles an autonomous, single-folder HTML5 viewer with all scene assets ready to host on any static CDN or USB drive.",
      badge: "Serverless Package"
    },
    {
      id: "spatial-audio",
      title: "Directional Spatial Audio",
      description: "Embed localized 3D audio beacons that naturally attenuate and pan in real-time as users look around the panoramic space.",
      badge: "WebAudio 3D"
    },
    {
      id: "nadir-patch",
      title: "Custom Nadir & Floor Concealment",
      description: "Seamlessly mask camera tripods at the bottom sphere pole with customized corporate brand logos, mirror reflections, and scale controls.",
      badge: "Tripod Masking"
    }
  ];
  const showcaseItems = [
    {
      id: "architecture-view",
      label: "Luxury Architecture",
      badge: "Residential Villa",
      description: "Multi-scene architectural walk-through connecting grand foyer, infinity pool terrace, and open-plan kitchen with seamless door teleportation.",
      visual: /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card", "data-testid": "showcase-architecture-preview", children: [
        /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-chip", children: "Residential Villa" }),
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-chip vs-tour-chip--accent", children: "Multi-Room Graph" })
        ] }),
        /* @__PURE__ */ jsx49("div", { className: "vs-tour-preview-card__visual", children: /* @__PURE__ */ jsx49(
          "img",
          {
            src: "/logos/360.png",
            alt: "VictorShell 360 Virtual Tour Villa",
            className: "vs-tour-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card__meta", children: [
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-preview-card__title", children: "Grand Villa Walkthrough" }),
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-preview-card__spec", children: "8 Scenes \xB7 14 Hotspots \xB7 Spatial Ocean Ambience" })
        ] })
      ] })
    },
    {
      id: "hospitality-view",
      label: "Hospitality Suites",
      badge: "Boutique Hotel",
      description: "Interactive luxury hotel suite preview featuring interactive amenity popups, dining room menus, and direct booking engine links.",
      visual: /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card", "data-testid": "showcase-hospitality-preview", children: [
        /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-chip", children: "Boutique Hotel" }),
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-chip vs-tour-chip--accent", children: "Interactive Amenities" })
        ] }),
        /* @__PURE__ */ jsx49("div", { className: "vs-tour-preview-card__visual", children: /* @__PURE__ */ jsx49(
          "img",
          {
            src: "/logos/360.png",
            alt: "VictorShell 360 Hotel Suite",
            className: "vs-tour-preview-card__img vs-tour-preview-card__img--alt",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card__meta", children: [
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-preview-card__title", children: "Presidential Penthouse Suite" }),
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-preview-card__spec", children: "360\xB0 Panorama \xB7 Floorplan Map \xB7 Reservation Links" })
        ] })
      ] })
    },
    {
      id: "museum-view",
      label: "Museum Exhibition",
      badge: "Art Gallery",
      description: "Cultural gallery experience guiding visitors through curated sculpture halls with synchronized audio narration and high-res artwork details.",
      visual: /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card", "data-testid": "showcase-museum-preview", children: [
        /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-chip", children: "Art Gallery" }),
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-chip vs-tour-chip--accent", children: "Curated Audio Guide" })
        ] }),
        /* @__PURE__ */ jsx49("div", { className: "vs-tour-preview-card__visual", children: /* @__PURE__ */ jsx49(
          "img",
          {
            src: "/logos/360.png",
            alt: "VictorShell 360 Museum Gallery",
            className: "vs-tour-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs40("div", { className: "vs-tour-preview-card__meta", children: [
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-preview-card__title", children: "Renaissance Sculpture Hall" }),
          /* @__PURE__ */ jsx49("span", { className: "vs-tour-preview-card__spec", children: "Artwork Audio Beacons \xB7 Multilingual Tooltips \xB7 16K Mipmaps" })
        ] })
      ] })
    }
  ];
  const benefits = [
    {
      id: "gyro-fps",
      title: "Silky 60 FPS Gyroscope Motion",
      description: "Spherical shader calculations update at native refresh rates on mobile devices and VR headsets with zero camera stutter.",
      metric: "60 FPS",
      metricLabel: "Panorama Refresh",
      tag: "Hardware Accelerated"
    },
    {
      id: "cloud-cost",
      title: "Zero Cloud Storage Fees",
      description: "High-resolution panoramic media is stored client-side in the browser Origin Private File System, completely eliminating recurring server hosting costs.",
      metric: "0 MB",
      metricLabel: "Server Overhead",
      tag: "OPFS In-Browser"
    },
    {
      id: "scene-latency",
      title: "Instant Scene Transitions",
      description: "Smart scene pre-fetching and texture cache warming load linked panoramic rooms in sub-seconds with smooth zoom-through teleportation.",
      metric: "< 1 sec",
      metricLabel: "Teleportation Latency",
      tag: "Instant Switch"
    },
    {
      id: "export-ease",
      title: "Self-Contained Standalone Export",
      description: "Client-side JSZip engine packages HTML5 runtime, icons, and panoramas into a single distribution archive that runs offline on any device.",
      metric: "1-Click",
      metricLabel: "Autonomous Package",
      tag: "Zero Dependencies"
    }
  ];
  const [activeScene, setActiveScene] = useState28("lobby");
  const [isAutoRotate, setIsAutoRotate] = useState28(true);
  const heroVisual = /* @__PURE__ */ jsxs40("div", { className: "vs-tour-hero-stage", "data-testid": "tour-hero-stage", children: [
    /* @__PURE__ */ jsx49("div", { className: "vs-tour-hero-stage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs40("div", { className: "vs-tour-hero-stage__controls", children: [
      /* @__PURE__ */ jsxs40(
        "button",
        {
          type: "button",
          className: "vs-tour-hero-stage__indicator",
          onClick: () => setIsAutoRotate((prev) => !prev),
          title: "Click to toggle auto-rotation",
          style: { background: "transparent", border: "none", color: "inherit", font: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" },
          children: [
            /* @__PURE__ */ jsx49("span", { className: `vs-tour-hero-stage__dot ${isAutoRotate ? "is-active" : ""}` }),
            isAutoRotate ? "Auto-Rotate: 60 FPS" : "Rotation Paused"
          ]
        }
      ),
      /* @__PURE__ */ jsx49("div", { className: "vs-tour-hero-stage__scenes", children: ["lobby", "suite", "rooftop"].map((scene) => /* @__PURE__ */ jsx49(
        "button",
        {
          type: "button",
          className: `vs-tour-scene-btn ${activeScene === scene ? "is-active" : ""}`,
          onClick: () => setActiveScene(scene),
          "aria-label": `Select ${scene} scene`,
          children: scene.toUpperCase()
        },
        scene
      )) })
    ] }),
    /* @__PURE__ */ jsxs40("div", { className: "vs-tour-hero-stage__viewport", children: [
      /* @__PURE__ */ jsx49(
        "img",
        {
          src: "/logos/360.png",
          alt: "360 Virtual Tour Spherical Panorama",
          className: "vs-tour-hero-stage__pano"
        }
      ),
      /* @__PURE__ */ jsxs40("div", { className: "vs-tour-hotspot-pin vs-tour-hotspot-pin--north", children: [
        /* @__PURE__ */ jsx49("span", { className: "vs-tour-hotspot-dot" }),
        /* @__PURE__ */ jsx49("span", { children: "Teleport to Terrace" })
      ] }),
      /* @__PURE__ */ jsxs40("div", { className: "vs-tour-hotspot-pin vs-tour-hotspot-pin--east", children: [
        /* @__PURE__ */ jsx49("span", { className: "vs-tour-hotspot-dot vs-tour-hotspot-dot--audio" }),
        /* @__PURE__ */ jsx49("span", { children: "Fountain Audio Node" })
      ] }),
      /* @__PURE__ */ jsxs40("div", { className: "vs-tour-hotspot-pin vs-tour-hotspot-pin--info", children: [
        /* @__PURE__ */ jsx49("span", { className: "vs-tour-hotspot-dot vs-tour-hotspot-dot--info" }),
        /* @__PURE__ */ jsx49("span", { children: "Suite Amenities Info" })
      ] }),
      /* @__PURE__ */ jsx49("div", { className: "vs-tour-compass", children: /* @__PURE__ */ jsx49("span", { children: "Heading: 240\xB0 SW" }) })
    ] }),
    /* @__PURE__ */ jsxs40("div", { className: "vs-tour-hero-stage__footer", children: [
      /* @__PURE__ */ jsxs40("div", { className: "vs-tour-hero-stage__meta", children: [
        /* @__PURE__ */ jsx49("span", { className: "vs-tour-hero-stage__meta-label", children: "Selected Scene Node" }),
        /* @__PURE__ */ jsx49("span", { className: "vs-tour-hero-stage__meta-val", children: activeScene === "lobby" ? "Grand Atrium Lobby \xB7 3 Hotspots" : activeScene === "suite" ? "Panoramic Penthouse \xB7 5 Hotspots" : "Sky Lounge Terrace \xB7 4 Hotspots" })
      ] }),
      /* @__PURE__ */ jsx49(
        "button",
        {
          type: "button",
          onClick: onExploreDemo,
          className: "vs-tour-hero-stage__quick-btn vs-btn-secondary",
          "data-testid": "hero-quick-launch-btn",
          children: "Explore Virtual Tour \u2192"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs40(
    ProductLandingTemplate,
    {
      productTitle: "360\xB0 Virtual Tour",
      productBadge: "Three.js Spherical Panorama Engine",
      productTagline: "Immersive WebGPU panoramic tours with interactive teleportation hotspots, offline OPFS storage, and self-contained ZIP export.",
      brandName: "VictorShell",
      theme,
      onExploreDemo,
      exploreDemoLabel: "Launch 360 Tour Studio",
      exploreDemoHref,
      navLinks,
      className: `vs-tour-landing-page ${className}`.trim(),
      heroProps: {
        title: "Immersive 360\xB0 Virtual Tour Studio & Autonomous Web Viewer",
        subtitle: "From High-Resolution Panoramas to Self-Contained Interactive Walkthroughs",
        badge: "Spherical WebGPU Engine",
        description: "Create cinematic 360\xB0 virtual tours directly in your browser. Connect equirectangular panoramas with interactive teleportation hotspots, embed spatial audio beacons, store media locally with zero cloud subscription fees, and export autonomous standalone tour packages ready to run offline.",
        exploreDemoLabel: "Launch 360 Tour Studio",
        secondaryCta: {
          label: "View Tech Specs",
          href: "#specs"
        },
        stats: [
          { value: "60 FPS", label: "Panorama Motion", hint: "Smooth spherical easing" },
          { value: "0 MB", label: "Cloud Server Fees", hint: "100% in-browser OPFS" },
          { value: "1-Click", label: "Autonomous Export", hint: "Serverless HTML5 package" }
        ],
        visual: heroVisual,
        visualPosition: "right"
      },
      overviewProps: {
        id: "overview",
        badge: "Photogrammetric Spherical Projection",
        title: "Precision Panoramic Spherical Mapping Without Cloud Server Dependencies",
        subtitle: "From raw equirectangular image frames to multi-room interactive graphs in seconds",
        description: "The VictorShell 360\xB0 Virtual Tour engine maps high-resolution 8K/16K equirectangular panoramas onto inverted sphere geometries using Three.js and WebGPU shaders. Visitors navigate freely with responsive mouse, touch, or device gyroscope motion, smoothly jumping between rooms through intuitive teleportation portals.",
        highlights: [
          {
            title: "Sub-Frame Spherical Interpolation",
            text: "Cubic easing algorithms eliminate camera motion sickness while providing realistic field-of-view zooming and horizon leveling."
          },
          {
            title: "Zero-Cloud Private Storage",
            text: "Save and organize all panoramic imagery directly inside your browser Origin Private File System (OPFS) with zero cloud upload bandwidth."
          },
          {
            title: "Complete Standalone Packaging",
            text: "Integrated ZIP exporter builds an autonomous, self-hosted distribution folder with index.html, Three.js runtime, and all compressed textures."
          }
        ],
        visual: /* @__PURE__ */ jsxs40("div", { className: "vs-tour-sphere-card", "data-testid": "tour-sphere-card", children: [
          /* @__PURE__ */ jsxs40("div", { className: "vs-tour-sphere-card__header", children: [
            /* @__PURE__ */ jsx49("span", { className: "vs-tour-sphere-card__title", children: "Spherical Coordinate Projection" }),
            /* @__PURE__ */ jsx49("span", { className: "vs-tour-chip", children: "Equirectangular 2:1" })
          ] }),
          /* @__PURE__ */ jsx49("div", { className: "vs-tour-sphere-card__body", children: /* @__PURE__ */ jsx49(
            "img",
            {
              src: "/logos/360.png",
              alt: "360 Tour Spherical Projection",
              className: "vs-tour-sphere-card__img",
              loading: "lazy"
            }
          ) }),
          /* @__PURE__ */ jsx49("div", { className: "vs-tour-sphere-card__footer", children: /* @__PURE__ */ jsx49("span", { className: "vs-tour-sphere-card__note", children: "Yaw: 0\xB0\u2013360\xB0 \xB7 Pitch: -90\xB0 to +90\xB0 \xB7 FOV: 30\xB0\u2013110\xB0 Dynamic Zoom" }) })
        ] })
      },
      featuresProps: {
        id: "features",
        badge: "Tour Builder Suite",
        sectionTitle: "Studio-Grade Virtual Tour Tools in Any Browser",
        sectionSubtitle: "A complete suite of scene linking, spatial audio, and serverless distribution tools.",
        layout: "bento",
        columns: 3,
        features
      },
      showcaseProps: {
        id: "showcase",
        badge: "Tour Modes",
        sectionTitle: "Explore Diverse Virtual Tour Applications",
        sectionSubtitle: "Switch between luxury residential villas, boutique hospitality suites, and cultural art exhibitions.",
        items: showcaseItems
      },
      benefitsProps: {
        id: "benefits",
        badge: "Performance & Portability",
        sectionTitle: "Why Photographers and Studios Choose 360\xB0 Tour",
        sectionSubtitle: "Zero hosting fees, complete offline independence, and silky smooth 60 FPS transitions.",
        variant: "metrics",
        items: benefits
      },
      ctaProps: {
        id: "cta",
        badge: "Interactive Tour Studio",
        title: "Step Inside the 360\xB0 Virtual Tour Builder Now",
        description: "Upload your panoramic images, place interactive teleportation hotspots, and preview seamless walkthroughs live in your browser.",
        exploreDemoLabel: "Launch 360 Tour Studio",
        exploreDemoHref,
        note: "Zero cloud subscriptions \xB7 100% in-browser OPFS storage \xB7 Standalone ZIP export"
      },
      children: [
        /* @__PURE__ */ jsx49("section", { className: "vs-landing-use-cases", id: "use-cases", "data-testid": "tour-use-cases-section", children: /* @__PURE__ */ jsxs40("div", { className: "vs-landing-use-cases__container", children: [
          /* @__PURE__ */ jsxs40("div", { className: "vs-landing-use-cases__header", children: [
            /* @__PURE__ */ jsx49("span", { className: "vs-landing-use-cases__badge", children: "Virtual Verticals" }),
            /* @__PURE__ */ jsx49("h2", { className: "vs-landing-use-cases__title", children: "Engineered for Photographers, Architects & Venues" }),
            /* @__PURE__ */ jsx49("p", { className: "vs-landing-use-cases__subtitle", children: "From commercial real estate open houses to cultural museum digital twins." })
          ] }),
          /* @__PURE__ */ jsxs40("div", { className: "vs-landing-use-cases__grid", children: [
            /* @__PURE__ */ jsxs40("div", { className: "vs-use-case-card", "data-testid": "use-case-realestate", children: [
              /* @__PURE__ */ jsx49("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3E1}" }),
              /* @__PURE__ */ jsx49("span", { className: "vs-use-case-card__tag", children: "Real Estate & Architecture" }),
              /* @__PURE__ */ jsx49("h3", { className: "vs-use-case-card__title", children: "Virtual Open Houses & Villas" }),
              /* @__PURE__ */ jsx49("p", { className: "vs-use-case-card__desc", children: "Enable prospective buyers and architectural clients to explore properties remotely with floor-by-floor navigation and room dimension tags." })
            ] }),
            /* @__PURE__ */ jsxs40("div", { className: "vs-use-case-card", "data-testid": "use-case-hospitality", children: [
              /* @__PURE__ */ jsx49("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3E8}" }),
              /* @__PURE__ */ jsx49("span", { className: "vs-use-case-card__tag", children: "Hospitality & Resorts" }),
              /* @__PURE__ */ jsx49("h3", { className: "vs-use-case-card__title", children: "Interactive Hotel Suite Walkthroughs" }),
              /* @__PURE__ */ jsx49("p", { className: "vs-use-case-card__desc", children: "Showcase luxury resort suites, event ballrooms, and spa amenities with embedded booking links and high-resolution panoramic vistas." })
            ] }),
            /* @__PURE__ */ jsxs40("div", { className: "vs-use-case-card", "data-testid": "use-case-culture", children: [
              /* @__PURE__ */ jsx49("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3DB}\uFE0F" }),
              /* @__PURE__ */ jsx49("span", { className: "vs-use-case-card__tag", children: "Museums & Culture" }),
              /* @__PURE__ */ jsx49("h3", { className: "vs-use-case-card__title", children: "Digitized Heritage & Art Tours" }),
              /* @__PURE__ */ jsx49("p", { className: "vs-use-case-card__desc", children: "Preserve historical monuments and art galleries as interactive digital twins complete with multi-lingual audio guides and curatorial notes." })
            ] }),
            /* @__PURE__ */ jsxs40("div", { className: "vs-use-case-card", "data-testid": "use-case-facility", children: [
              /* @__PURE__ */ jsx49("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3ED}" }),
              /* @__PURE__ */ jsx49("span", { className: "vs-use-case-card__tag", children: "Facilities & Industry" }),
              /* @__PURE__ */ jsx49("h3", { className: "vs-use-case-card__title", children: "BIM Facility Inspection Walks" }),
              /* @__PURE__ */ jsx49("p", { className: "vs-use-case-card__desc", children: "Document construction progress, mechanical equipment rooms, and data centers for remote safety compliance and engineering audits." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx49("section", { className: "vs-landing-specs", id: "specs", "data-testid": "tour-specs-section", children: /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__container", children: [
          /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__header", children: [
            /* @__PURE__ */ jsx49("span", { className: "vs-landing-specs__badge", children: "Technical Specifications" }),
            /* @__PURE__ */ jsx49("h2", { className: "vs-landing-specs__title", children: "Spherical Engine & Storage Specifications" }),
            /* @__PURE__ */ jsx49("p", { className: "vs-landing-specs__subtitle", children: "Verified specifications powering the VictorShell 360\xB0 Virtual Tour Studio." })
          ] }),
          /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__grid", children: [
            /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx49("h3", { className: "vs-landing-specs__card-title", children: "Three.js Spherical Core" }),
              /* @__PURE__ */ jsxs40("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx49("dt", { children: "Geometry" }),
                  /* @__PURE__ */ jsx49("dd", { children: "Inverted normal equirectangular sphere (60 segments)" })
                ] }),
                /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx49("dt", { children: "Input Formats" }),
                  /* @__PURE__ */ jsx49("dd", { children: "JPEG, PNG, WebP 2:1 equirectangular (up to 16K)" })
                ] }),
                /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx49("dt", { children: "Transitions" }),
                  /* @__PURE__ */ jsx49("dd", { children: "Smooth cubic easing zoom-through teleportation" })
                ] }),
                /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx49("dt", { children: "Controls" }),
                  /* @__PURE__ */ jsx49("dd", { children: "Mouse drag, touch pinch-to-zoom, device gyroscope" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx49("h3", { className: "vs-landing-specs__card-title", children: "Storage & Standalone Export" }),
              /* @__PURE__ */ jsxs40("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx49("dt", { children: "Client Storage" }),
                  /* @__PURE__ */ jsx49("dd", { children: "Origin Private File System (OPFS) + idb-keyval" })
                ] }),
                /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx49("dt", { children: "Audio Engine" }),
                  /* @__PURE__ */ jsx49("dd", { children: "WebAudio API with 3D directional positional nodes" })
                ] }),
                /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx49("dt", { children: "Standalone Export" }),
                  /* @__PURE__ */ jsx49("dd", { children: "Self-contained ZIP archive with zero server dependencies" })
                ] }),
                /* @__PURE__ */ jsxs40("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx49("dt", { children: "Nadir Masking" }),
                  /* @__PURE__ */ jsx49("dd", { children: "Parametric floor brand patch with dynamic scale" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/EyewearLandingPage.tsx
import { useState as useState29 } from "react";
import { jsx as jsx50, jsxs as jsxs41 } from "react/jsx-runtime";
var EyewearLandingPage = ({
  onExploreDemo,
  exploreDemoHref = "/apps/eyewear-tryon/index.html#demo",
  theme = "violet",
  className = ""
}) => {
  const navLinks = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Features", href: "#features" },
    { label: "Frame Styles", href: "#showcase" },
    { label: "Industry Verticals", href: "#use-cases" },
    { label: "Optical Precision", href: "#benefits" },
    { label: "Tech Specs", href: "#specs" }
  ];
  const [activeSilhouette, setActiveSilhouette] = useState29("Aviator Classic");
  const [activeLensTint, setActiveLensTint] = useState29("Clear AR");
  const [activeFrameMaterial, setActiveFrameMaterial] = useState29("Brushed Titanium");
  const [cranialOcclusion, setCranialOcclusion] = useState29(true);
  const silhouettes = [
    { id: "aviator", name: "Aviator Classic", code: "MOD-01", width: "138 mm", bridge: "14 mm" },
    { id: "wayfarer", name: "Wayfarer Style", code: "MOD-02", width: "142 mm", bridge: "18 mm" },
    { id: "clubmaster", name: "Clubmaster", code: "MOD-03", width: "140 mm", bridge: "20 mm" },
    { id: "round", name: "Round Metal", code: "MOD-04", width: "132 mm", bridge: "21 mm" },
    { id: "sport", name: "Sport Wrap", code: "MOD-05", width: "146 mm", bridge: "12 mm" },
    { id: "hexagonal", name: "Hexagonal", code: "MOD-06", width: "136 mm", bridge: "19 mm" }
  ];
  const lensTints = [
    { id: "clear", label: "Clear AR", transmission: "98%", tintHex: "rgba(235, 245, 255, 0.25)" },
    { id: "amber", label: "Amber Tint", transmission: "45%", tintHex: "rgba(245, 158, 11, 0.40)" },
    { id: "polarized", label: "Midnight Polarized", transmission: "15%", tintHex: "rgba(15, 23, 42, 0.75)" },
    { id: "mirror", label: "Rose Mirror", transmission: "22%", tintHex: "rgba(217, 70, 239, 0.55)" }
  ];
  const frameMaterials = [
    { id: "titanium", label: "Brushed Titanium", finish: "Metallic PBR", swatch: "#94A3B8" },
    { id: "acetate", label: "Acetate Tortoise", finish: "Translucent Dielectric", swatch: "#78350F" },
    { id: "gold", label: "Polished 18K Gold", finish: "High-Gloss Reflective", swatch: "#EAB308" },
    { id: "carbon", label: "Matte Carbon", finish: "Carbon Fiber Weave", swatch: "#1E293B" }
  ];
  const currentSilhouette = silhouettes.find((s) => s.name === activeSilhouette) || silhouettes[0];
  const currentTint = lensTints.find((t) => t.label === activeLensTint) || lensTints[0];
  const currentMat = frameMaterials.find((m) => m.label === activeFrameMaterial) || frameMaterials[0];
  const features = [
    {
      id: "sub-millimeter-tracking",
      title: "478-Point 3D Facial Landmarks",
      description: "Leverages MediaPipe vision task AI running client-side in WebGPU/WebGL to lock 3D frame geometry to the user\u2019s nose bridge, temples, and brow with zero perceptible latency.",
      badge: "Sub-Millimeter Tracking",
      highlight: true
    },
    {
      id: "automated-pd",
      title: "Automated Pupillary Distance (PD)",
      description: "Calculates real-time interpupillary distance (IPD) calibrated against camera intrinsic parameters, giving customers precision frame sizing guidance before ordering.",
      badge: "Optical Calibration"
    },
    {
      id: "cranial-occlusion",
      title: "Full Cranial 3D Head Occluder",
      description: "Solves the floating-glasses artifact with a calibrated 3D anatomical skull depth mask, allowing temple arms to naturally disappear behind the ears and cheekbones.",
      badge: "Realistic Depth"
    },
    {
      id: "pbr-optics",
      title: "PBR Optics & Anti-Reflective Shaders",
      description: "Simulates multi-layer optical coatings, Fresnel edge reflectance, polarized attenuation, and realistic studio environment reflections across both lenses and frames.",
      badge: "Optical Physics"
    },
    {
      id: "curated-silhouettes",
      title: "6 Curated Designer Silhouettes",
      description: "Includes Aviator Classic, Wayfarer, Clubmaster, Round Metal, Sport Wrap, and Hexagonal models, fully optimized with Draco geometry compression.",
      badge: "Designer Library"
    },
    {
      id: "zero-plugin-engine",
      title: "Universal Zero-Plugin Web Engine",
      description: "Runs directly in mobile Safari (iOS), mobile Chrome (Android), and desktop browsers without App Store downloads or browser extensions.",
      badge: "Zero Friction"
    }
  ];
  const showcaseItems = [
    {
      id: "optical-prescription",
      label: "Optical Prescription Fitting",
      badge: "Corrective Eyewear",
      description: "Combines automated pupillary distance measurement, bridge width assessment, and progressive lens optical alignment for prescription retail customers.",
      visual: /* @__PURE__ */ jsxs41("div", { className: "vs-showcase-visual-card", children: [
        /* @__PURE__ */ jsx50("div", { className: "vs-showcase-visual-badge", children: "Rx Optical Center Locked" }),
        /* @__PURE__ */ jsx50("div", { className: "vs-showcase-visual-metric", children: "PD: 63.5mm \xB7 Heights: 18mm" })
      ] })
    },
    {
      id: "sun-polarized",
      label: "Designer Sunglasses & Coatings",
      badge: "Sun & Luxury Optics",
      description: "Showcase gradient tints, polarized UV400 filters, flash mirror coatings, and metallic luster with dynamic lighting that reacts to head movement.",
      visual: /* @__PURE__ */ jsxs41("div", { className: "vs-showcase-visual-card", children: [
        /* @__PURE__ */ jsx50("div", { className: "vs-showcase-visual-badge", children: "Polarized UV400 Coating" }),
        /* @__PURE__ */ jsx50("div", { className: "vs-showcase-visual-metric", children: "Transmission: 15% \xB7 PBR Studio HDRI" })
      ] })
    },
    {
      id: "sport-aerodynamic",
      label: "Performance Sports Wraps",
      badge: "Active & Sports Eyewear",
      description: "Simulate high-curvature base-8 wrapped frames with non-slip temporal arms, cranial wrap verification, and high-impact aerodynamic styling.",
      visual: /* @__PURE__ */ jsxs41("div", { className: "vs-showcase-visual-card", children: [
        /* @__PURE__ */ jsx50("div", { className: "vs-showcase-visual-badge", children: "Base-8 Aerodynamic Wrap" }),
        /* @__PURE__ */ jsx50("div", { className: "vs-showcase-visual-metric", children: "Temporal Grip \xB7 Non-Slip Occlusion" })
      ] })
    }
  ];
  const benefits = [
    {
      id: "benefit-occlusion",
      title: "Flawless Cranial Occlusion",
      description: "Proprietary 3D head mesh depth rendering eliminates the unrealistic visual artifact of temple arms floating beside or clipping through human hair and ears.",
      metric: "Depth Pass",
      metricLabel: "Zero Temple Arm Clipping"
    },
    {
      id: "benefit-pd",
      title: "Accurate Pupillary Calibration",
      description: "Real-time IPD measurement accurately maps millimeter distance between eye centers using computer vision face mesh triangulation and sensor focal length.",
      metric: "\xB10.8 mm",
      metricLabel: "Calibrated Accuracy"
    },
    {
      id: "benefit-latency",
      title: "Fluid 60 FPS Tracking",
      description: "High-performance WebGPU compute shaders and MediaPipe landmarks guarantee stutter-free tracking during natural head turns, pitches, and smiles.",
      metric: "< 16 ms",
      metricLabel: "Motion-to-Photon Latency"
    },
    {
      id: "benefit-pbr",
      title: "Physically Accurate Optical Shaders",
      description: "Real-time PBR material models simulate refraction indices, Fresnel reflection equations, and surface microfacet roughness under realistic studio HDRI illumination.",
      metric: "100% PBR",
      metricLabel: "Dielectric & Metallic Materials"
    }
  ];
  const technicalSpecs = [
    { label: "Facial Landmark Engine", value: "MediaPipe Vision Tasks (478 3D landmarks, GPU accelerated)" },
    { label: "Cranial Occlusion", value: "3D head mesh depth buffer pass (head_occluder.obj)" },
    { label: "Pupillary Accuracy", value: "\xB10.8 mm under standard camera distances (40\u201360 cm)" },
    { label: "Rendering Pipeline", value: "Three.js WebGPU / WebGL with PBR dielectric & metallic shaders" },
    { label: "Frame Geometries", value: "GLTF / GLB Draco compressed (< 2.5 MB initial package)" },
    { label: "Lighting Environment", value: "Studio HDRI equirectangular reflection map (brown_photostudio_02)" },
    { label: "Frame Rate & Latency", value: "60 FPS lock / < 16 ms motion-to-photon latency" },
    { label: "Browser Support", value: "Mobile Safari (iOS 14+), Mobile Chrome (Android), Desktop Chrome/Edge" }
  ];
  const heroVisual = /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-hero-stage", children: [
    /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-hero-stage__backdrop" }),
    /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-hero-stage__hud", children: [
      /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-hud-chip vs-eyewear-hud-chip--active", children: [
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-hud-dot" }),
        /* @__PURE__ */ jsx50("span", { children: "Tracking: 478 Landmark Lock" })
      ] }),
      /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-hud-chip", children: /* @__PURE__ */ jsx50("span", { children: "PD: 63.5 mm" }) }),
      /* @__PURE__ */ jsx50(
        "div",
        {
          className: `vs-eyewear-hud-chip vs-eyewear-hud-chip--toggle ${cranialOcclusion ? "is-enabled" : ""}`,
          onClick: () => setCranialOcclusion(!cranialOcclusion),
          title: "Toggle Cranial 3D Depth Occluder",
          role: "button",
          tabIndex: 0,
          children: /* @__PURE__ */ jsxs41("span", { children: [
            "Occluder: ",
            cranialOcclusion ? "ACTIVE" : "OFF"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-preview-card", children: [
      /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-preview-card__surface", children: [
        /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-reticle", children: [
          /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-reticle__line--h" }),
          /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-reticle__line--v" }),
          /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-reticle__eye vs-eyewear-reticle__eye--left", children: [
            /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-reticle__crosshair" }),
            /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-reticle__pupil-label", children: "L Eye \xB7 31.8mm" })
          ] }),
          /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-reticle__eye vs-eyewear-reticle__eye--right", children: [
            /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-reticle__crosshair" }),
            /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-reticle__pupil-label", children: "R Eye \xB7 31.7mm" })
          ] }),
          /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-reticle__pd-bracket", children: /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-reticle__pd-text", children: "IPD: 63.5 mm" }) })
        ] }),
        /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-glasses-graphic", children: /* @__PURE__ */ jsxs41(
          "svg",
          {
            className: "vs-eyewear-glasses-svg",
            viewBox: "0 0 400 160",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
              /* @__PURE__ */ jsx50(
                "path",
                {
                  d: "M 30 75 Q 70 65 110 70",
                  stroke: currentMat.swatch,
                  strokeWidth: "5",
                  strokeLinecap: "round",
                  strokeDasharray: cranialOcclusion ? "none" : "4 3",
                  opacity: cranialOcclusion ? 0.45 : 0.85
                }
              ),
              /* @__PURE__ */ jsx50(
                "path",
                {
                  d: "M 370 75 Q 330 65 290 70",
                  stroke: currentMat.swatch,
                  strokeWidth: "5",
                  strokeLinecap: "round",
                  strokeDasharray: cranialOcclusion ? "none" : "4 3",
                  opacity: cranialOcclusion ? 0.45 : 0.85
                }
              ),
              /* @__PURE__ */ jsx50(
                "rect",
                {
                  x: "85",
                  y: "45",
                  width: "95",
                  height: "70",
                  rx: "24",
                  fill: currentTint.tintHex,
                  stroke: currentMat.swatch,
                  strokeWidth: "6"
                }
              ),
              /* @__PURE__ */ jsx50(
                "path",
                {
                  d: "M 100 55 L 145 55 L 125 105 L 90 105 Z",
                  fill: "rgba(255, 255, 255, 0.28)"
                }
              ),
              /* @__PURE__ */ jsx50(
                "path",
                {
                  d: "M 180 72 Q 200 62 220 72",
                  stroke: currentMat.swatch,
                  strokeWidth: "5",
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ jsx50(
                "rect",
                {
                  x: "220",
                  y: "45",
                  width: "95",
                  height: "70",
                  rx: "24",
                  fill: currentTint.tintHex,
                  stroke: currentMat.swatch,
                  strokeWidth: "6"
                }
              ),
              /* @__PURE__ */ jsx50(
                "path",
                {
                  d: "M 235 55 L 280 55 L 260 105 L 225 105 Z",
                  fill: "rgba(255, 255, 255, 0.28)"
                }
              ),
              /* @__PURE__ */ jsx50("circle", { cx: "182", cy: "85", r: "4", fill: "rgba(255, 255, 255, 0.8)" }),
              /* @__PURE__ */ jsx50("circle", { cx: "218", cy: "85", r: "4", fill: "rgba(255, 255, 255, 0.8)" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-preview-meta", children: [
          /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-preview-meta__title", children: currentSilhouette.name }),
          /* @__PURE__ */ jsxs41("span", { className: "vs-eyewear-preview-meta__detail", children: [
            "Frame: ",
            currentSilhouette.width,
            " \xB7 Bridge: ",
            currentSilhouette.bridge,
            " \xB7 Lens: ",
            currentTint.label
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-controls-row", children: [
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-controls-label", children: "SILHOUETTE" }),
        /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-pill-group", children: silhouettes.map((s) => /* @__PURE__ */ jsx50(
          "button",
          {
            type: "button",
            className: `vs-eyewear-pill-btn ${activeSilhouette === s.name ? "is-active" : ""}`,
            onClick: () => setActiveSilhouette(s.name),
            children: s.name
          },
          s.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-materials-grid", children: [
        /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-mat-column", children: [
          /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-controls-label", children: "OPTICAL COATING" }),
          /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-pill-group vs-eyewear-pill-group--compact", children: lensTints.map((t) => /* @__PURE__ */ jsx50(
            "button",
            {
              type: "button",
              className: `vs-eyewear-pill-btn vs-eyewear-pill-btn--sm ${activeLensTint === t.label ? "is-active" : ""}`,
              onClick: () => setActiveLensTint(t.label),
              children: t.label
            },
            t.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-mat-column", children: [
          /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-controls-label", children: "FRAME MATERIAL" }),
          /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-pill-group vs-eyewear-pill-group--compact", children: frameMaterials.map((m) => /* @__PURE__ */ jsx50(
            "button",
            {
              type: "button",
              className: `vs-eyewear-pill-btn vs-eyewear-pill-btn--sm ${activeFrameMaterial === m.label ? "is-active" : ""}`,
              onClick: () => setActiveFrameMaterial(m.label),
              children: m.label
            },
            m.id
          )) })
        ] })
      ] })
    ] })
  ] });
  const overviewVisual = /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-anatomical-card", children: [
    /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-anatomical-card__header", children: [
      /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-card__title", children: "Cranial Depth & IPD Geometry" }),
      /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-card__badge", children: "Live Depth Pass" })
    ] }),
    /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-anatomical-card__body", children: [
      /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-anatomical-metric", children: [
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__val", children: "478" }),
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__lbl", children: "Landmark Vertices" }),
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__sub", children: "Full 3D Facial Mesh" })
      ] }),
      /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-anatomical-metric", children: [
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__val", children: "< 1.0mm" }),
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__lbl", children: "Pupillary Tolerance" }),
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__sub", children: "Camera Intrinsic Calibration" })
      ] }),
      /* @__PURE__ */ jsxs41("div", { className: "vs-eyewear-anatomical-metric", children: [
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__val", children: "100%" }),
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__lbl", children: "Ear Occlusion" }),
        /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-metric__sub", children: "head_occluder.obj Volume" })
      ] })
    ] }),
    /* @__PURE__ */ jsx50("div", { className: "vs-eyewear-anatomical-card__footer", children: /* @__PURE__ */ jsx50("span", { className: "vs-eyewear-anatomical-card__note", children: "Zero video stream leaves the client browser \xB7 100% private WebAssembly processing" }) })
  ] });
  return /* @__PURE__ */ jsxs41(
    ProductLandingTemplate,
    {
      productTitle: "Eyewear Try-On",
      productBadge: "WebGPU AR Facial Fitting",
      productTagline: "Sub-millimeter 3D facial landmark fitting, automated PD measurement, and realistic cranial occlusion.",
      brandName: "VictorShell",
      brandLogo: /* @__PURE__ */ jsx50("img", { src: "/logos/eyewear.png", alt: "Eyewear Logo", style: { width: 26, height: 26, objectFit: "contain" } }),
      theme,
      onExploreDemo,
      exploreDemoHref,
      exploreDemoLabel: "Explore Eyewear Demo",
      navLinks,
      className: `vs-eyewear-landing-page ${className}`.trim(),
      heroProps: {
        title: "Next-Generation AR Eyewear Fitting & Automated PD Measurement",
        subtitle: "Sub-Millimeter 3D Facial Landmark Tracking Powered by WebGPU",
        badge: "WebGPU AR Facial Fitting",
        description: "Transform eyewear e-commerce with real-time 3D facial fitting, automated pupillary distance (PD) calibration, full cranial occlusion, and true-to-life PBR frame and optical lens rendering.",
        stats: [
          { value: "478 Pts", label: "3D Facial Mesh", hint: "Real-time landmarks" },
          { value: "< 1.0 mm", label: "PD Accuracy", hint: "Pupillary calibration" },
          { value: "60 FPS", label: "WebGPU Engine", hint: "Zero jitter frame lock" },
          { value: "-38%", label: "Return Rates", hint: "Accurate fit confidence" }
        ],
        visual: heroVisual
      },
      overviewProps: {
        id: "overview",
        badge: "The Science of Virtual Eyewear",
        title: "Clinical Precision Meets High-Fashion 3D Realism",
        subtitle: "Engineered for Optical Precision & True-To-Life Material Realism",
        description: "VictorShell Eyewear Try-On eliminates the guesswork of online eyewear purchasing by combining real-time MediaPipe facial landmark mesh estimation with WebGPU physically-based rendering. Our proprietary cranial 3D head occluder solves the industry-wide flaw of virtual eyewear: floating frames. By rendering a calibrated invisible head volume into the depth buffer, temple arms naturally tuck behind the user\u2019s ears and hair.",
        highlights: [
          {
            title: "Automated IPD Calibration",
            text: "Sub-millimeter measurement across frontal camera planes calibrated to sensor geometry."
          },
          {
            title: "Cranial Depth Pass",
            text: "Invisible skull occluder ensures temple arms slip naturally behind ears and hair."
          },
          {
            title: "PBR Optical Coatings",
            text: "Dielectric transmission and multi-layer anti-reflective filters react to studio HDRI lighting."
          },
          {
            title: "Universal Zero-Plugin Web",
            text: "Runs directly in mobile Safari, Android Chrome, and desktop browsers without downloads."
          }
        ],
        visual: overviewVisual
      },
      featuresProps: {
        id: "features",
        badge: "Core Architectural Capabilities",
        sectionTitle: "Engineered for Precision Optical Fitting",
        sectionSubtitle: "From sub-millimeter biometric facial landmark alignment to depth-occluded temple arms and real-time pupillary distance measurement, VictorShell Eyewear delivers an uncompromised virtual fitting experience.",
        layout: "bento",
        columns: 3,
        features
      },
      showcaseProps: {
        id: "showcase",
        badge: "Multi-Category Fitting",
        sectionTitle: "Curated Eyewear Collections & Optical Modes",
        sectionSubtitle: "Experience corrective prescription frames, polarized sunglasses, and aerodynamic performance wraps.",
        items: showcaseItems
      },
      benefitsProps: {
        id: "benefits",
        badge: "Measurable Business & Optical Impact",
        sectionTitle: "Why Leading Eyewear Brands Choose VictorShell",
        sectionSubtitle: "Zero design turnaround latency, 100% vector accuracy, and direct die-cutting export.",
        variant: "metrics",
        items: benefits
      },
      ctaProps: {
        id: "cta",
        badge: "Interactive Eyewear Studio",
        title: "Experience Virtual Eyewear Fitting in Real Time",
        description: "Launch the interactive live camera demo to experience automated PD calculation, cranial occlusion, and real-time designer frame switching.",
        exploreDemoLabel: "Explore Eyewear Demo",
        exploreDemoHref,
        note: "Instant camera activation \xB7 100% private client-side processing \xB7 No video stream leaves your browser"
      },
      children: [
        /* @__PURE__ */ jsx50("section", { className: "vs-landing-use-cases", id: "use-cases", "data-testid": "eyewear-use-cases-section", children: /* @__PURE__ */ jsxs41("div", { className: "vs-landing-use-cases__container", children: [
          /* @__PURE__ */ jsxs41("div", { className: "vs-landing-use-cases__header", children: [
            /* @__PURE__ */ jsx50("span", { className: "vs-landing-use-cases__badge", children: "Industry Verticals" }),
            /* @__PURE__ */ jsx50("h2", { className: "vs-landing-use-cases__title", children: "Purpose-Built for Optical Retailing & Vision Care" }),
            /* @__PURE__ */ jsx50("p", { className: "vs-landing-use-cases__subtitle", children: "From direct-to-consumer online eyewear boutiques to clinical telehealth consultations." })
          ] }),
          /* @__PURE__ */ jsxs41("div", { className: "vs-landing-use-cases__grid", children: [
            /* @__PURE__ */ jsxs41("div", { className: "vs-use-case-card", "data-testid": "use-case-d2c", children: [
              /* @__PURE__ */ jsx50("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F453}" }),
              /* @__PURE__ */ jsx50("span", { className: "vs-use-case-card__tag", children: "E-Commerce Brands" }),
              /* @__PURE__ */ jsx50("h3", { className: "vs-use-case-card__title", children: "Direct-to-Consumer (D2C) Optical" }),
              /* @__PURE__ */ jsx50("p", { className: "vs-use-case-card__desc", children: "Cut online eyewear return rates by up to 38% by empowering shoppers to verify bridge fit, temple width, and face shape compatibility in real-time camera AR." })
            ] }),
            /* @__PURE__ */ jsxs41("div", { className: "vs-use-case-card", "data-testid": "use-case-luxury", children: [
              /* @__PURE__ */ jsx50("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u2728" }),
              /* @__PURE__ */ jsx50("span", { className: "vs-use-case-card__tag", children: "Haute Horlogerie & Fashion" }),
              /* @__PURE__ */ jsx50("h3", { className: "vs-use-case-card__title", children: "Luxury Fashion & Designer Houses" }),
              /* @__PURE__ */ jsx50("p", { className: "vs-use-case-card__desc", children: "Deliver an elevated virtual boutique experience highlighting hand-polished Italian acetate, 18K gold electroplating, and custom engraved temple branding." })
            ] }),
            /* @__PURE__ */ jsxs41("div", { className: "vs-use-case-card", "data-testid": "use-case-telehealth", children: [
              /* @__PURE__ */ jsx50("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1FA7A}" }),
              /* @__PURE__ */ jsx50("span", { className: "vs-use-case-card__tag", children: "Healthcare & Vision Centers" }),
              /* @__PURE__ */ jsx50("h3", { className: "vs-use-case-card__title", children: "Telehealth & Digital Optometry" }),
              /* @__PURE__ */ jsx50("p", { className: "vs-use-case-card__desc", children: "Enable eye care practitioners to conduct remote face measurements, verify pupillary distance, and recommend certified frames ahead of in-clinic visits." })
            ] }),
            /* @__PURE__ */ jsxs41("div", { className: "vs-use-case-card", "data-testid": "use-case-custom", children: [
              /* @__PURE__ */ jsx50("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F52C}" }),
              /* @__PURE__ */ jsx50("span", { className: "vs-use-case-card__tag", children: "Additive Manufacturing" }),
              /* @__PURE__ */ jsx50("h3", { className: "vs-use-case-card__title", children: "Custom Bespoke & 3D Printed Eyewear" }),
              /* @__PURE__ */ jsx50("p", { className: "vs-use-case-card__desc", children: "Capture patient cranial proportions to parametrically generate tailored 3D-printed titanium or polyamide frames adapted to unique facial geometries." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx50("section", { className: "vs-landing-specs", id: "specs", "data-testid": "eyewear-specs-section", children: /* @__PURE__ */ jsxs41("div", { className: "vs-landing-specs__container", children: [
          /* @__PURE__ */ jsxs41("div", { className: "vs-landing-specs__header", children: [
            /* @__PURE__ */ jsx50("span", { className: "vs-landing-specs__badge", children: "Engineering Specifications" }),
            /* @__PURE__ */ jsx50("h2", { className: "vs-landing-specs__title", children: "Technical Architecture & Performance" }),
            /* @__PURE__ */ jsx50("p", { className: "vs-landing-specs__subtitle", children: "Certified optical metrics, shader pipelines, and real-time tracking performance." })
          ] }),
          /* @__PURE__ */ jsx50("div", { className: "vs-specs-table-card", children: /* @__PURE__ */ jsxs41("table", { className: "vs-specs-table", children: [
            /* @__PURE__ */ jsx50("thead", { children: /* @__PURE__ */ jsxs41("tr", { children: [
              /* @__PURE__ */ jsx50("th", { scope: "col", children: "Subsystem" }),
              /* @__PURE__ */ jsx50("th", { scope: "col", children: "Architecture Specification" }),
              /* @__PURE__ */ jsx50("th", { scope: "col", children: "Standard / Target" })
            ] }) }),
            /* @__PURE__ */ jsx50("tbody", { children: technicalSpecs.map((spec, idx) => /* @__PURE__ */ jsxs41("tr", { children: [
              /* @__PURE__ */ jsx50("td", { className: "vs-specs-label", children: spec.label }),
              /* @__PURE__ */ jsx50("td", { className: "vs-specs-value", children: spec.value }),
              /* @__PURE__ */ jsx50("td", { className: "vs-specs-status", children: "Verified Production" })
            ] }, idx)) })
          ] }) })
        ] }) })
      ]
    }
  );
};

// packages/ui-kit/src/components/landing/ViewerLandingPage.tsx
import { useState as useState30 } from "react";
import { jsx as jsx51, jsxs as jsxs42 } from "react/jsx-runtime";
var ViewerLandingPage = ({
  onExploreDemo,
  exploreDemoHref = "/apps/viewer/index.html#demo",
  theme = "indigo",
  className = ""
}) => {
  const navLinks = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Features", href: "#features" },
    { label: "Modes", href: "#showcase" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Performance", href: "#benefits" },
    { label: "Tech Specs", href: "#specs" }
  ];
  const features = [
    {
      id: "webgpu-pipeline",
      title: "WebGPU & WebGL2 Hybrid Pipeline",
      description: "Harnesses modern GPU compute shaders and high-throughput rasterization with automatic WebGL2 fallback for universal 60 FPS performance across all devices.",
      badge: "Core Engine",
      highlight: true
    },
    {
      id: "pbr-materials",
      title: "PBR Material & Texture Editor",
      description: "Live calibration of physically based shading channels: microfacet roughness, metallic sheen, normal maps, clearcoat, refractive transmission, and Cauchy dispersion.",
      badge: "Photorealistic PBR"
    },
    {
      id: "post-processing",
      title: "Cinematic Post-Processing Stack",
      description: "Integrated screen-space ambient occlusion (SSAO), screen-space reflections (SSR), HDR Bloom glow, and physical camera depth of field (DOF).",
      badge: "Visual Effects"
    },
    {
      id: "3d-measurement",
      title: "Precision 3D Measurement Overlay",
      description: "Interactive point-to-point surface snapping tool calculating real-world Euclidean distances in millimeters and centimeters directly on model vertices.",
      badge: "Engineering CAD"
    },
    {
      id: "kinematics-timeline",
      title: "Multi-Track Animation Timeline",
      description: "Scrub, reverse, loop, and inspect multi-clip skeletal animations with variable playback speed (0.25x \u2013 2x) for complex mechanical and character rigs.",
      badge: "GLTF Kinematics"
    },
    {
      id: "webar-slam",
      title: "Instant 8thWall SLAM WebAR",
      description: "Stream 3D assets directly into augmented reality with 6-DOF surface tracking, real-world scaling, and directional light estimation with zero app installation.",
      badge: "Niantic WebAR"
    }
  ];
  const showcaseItems = [
    {
      id: "pbr-studio",
      label: "PBR Realistic Studio",
      badge: "Photorealistic PBR",
      description: "Cinema-quality studio lighting with HDR softbox reflections, progressive contact shadows, and calibrated physically based materials.",
      visual: /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card", "data-testid": "showcase-pbr-preview", children: [
        /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", children: "MeshPhysicalMaterial" }),
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip vs-viewer-chip--accent", children: "HDR Studio Lighting" })
        ] }),
        /* @__PURE__ */ jsx51("div", { className: "vs-viewer-preview-card__visual", children: /* @__PURE__ */ jsx51(
          "img",
          {
            src: "/logos/trikomi.png",
            alt: "VictorShell 3D Viewer PBR Rendering",
            className: "vs-viewer-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card__meta", children: [
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-preview-card__title", children: "Photorealistic PBR Shading" }),
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-preview-card__spec", children: "Microfacet Roughness 0.1 \xB7 Metalness 0.9 \xB7 60 FPS WebGPU" })
        ] })
      ] })
    },
    {
      id: "wireframe-inspection",
      label: "Mesh & Wireframe",
      badge: "Topology Inspection",
      description: "Inspect polygonal edge flow, surface normals, bounding box bounds, and precision dimensional tolerances with live overlay toggles.",
      visual: /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card", "data-testid": "showcase-wireframe-preview", children: [
        /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", children: "Polygonal Wireframe" }),
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip vs-viewer-chip--accent", children: "Vertex Normals" })
        ] }),
        /* @__PURE__ */ jsx51("div", { className: "vs-viewer-preview-card__visual", children: /* @__PURE__ */ jsx51(
          "img",
          {
            src: "/logos/trikomi.png",
            alt: "VictorShell 3D Viewer Wireframe Inspection",
            className: "vs-viewer-preview-card__img vs-viewer-preview-card__img--alt",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card__meta", children: [
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-preview-card__title", children: "CAD & Mesh Inspection" }),
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-preview-card__spec", children: "Scene Graph Traversal \xB7 Transform Gizmos \xB7 Point Snapping" })
        ] })
      ] })
    },
    {
      id: "animation-kinematics",
      label: "Kinematics Timeline",
      badge: "Skeletal Rigging",
      description: "Multi-clip animation playback with interactive timeline scrubbing, frame step controls, and variable playback speeds.",
      visual: /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card", "data-testid": "showcase-animation-preview", children: [
        /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", children: "AnimationMixer" }),
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip vs-viewer-chip--accent", children: "0.25x \u2013 2.0x Scrub" })
        ] }),
        /* @__PURE__ */ jsx51("div", { className: "vs-viewer-preview-card__visual", children: /* @__PURE__ */ jsx51(
          "img",
          {
            src: "/logos/trikomi.png",
            alt: "VictorShell 3D Viewer Animation Timeline",
            className: "vs-viewer-preview-card__img",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card__meta", children: [
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-preview-card__title", children: "Interactive Animation Timeline" }),
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-preview-card__spec", children: "Multi-Track Playback \xB7 Sub-Frame Scrubbing \xB7 Loop Modes" })
        ] })
      ] })
    },
    {
      id: "webar-slam",
      label: "Augmented Reality",
      badge: "Niantic 8thWall SLAM",
      description: "Place 3D assets in physical spaces using mobile browser camera tracking with instant surface anchoring and light estimation.",
      visual: /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card", "data-testid": "showcase-webar-preview", children: [
        /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card__badge-row", children: [
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", children: "8thWall SLAM WebAR" }),
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip vs-viewer-chip--accent", children: "Zero App Install" })
        ] }),
        /* @__PURE__ */ jsx51("div", { className: "vs-viewer-preview-card__visual", children: /* @__PURE__ */ jsx51(
          "img",
          {
            src: "/logos/trikomi.png",
            alt: "VictorShell 3D Viewer WebAR",
            className: "vs-viewer-preview-card__img vs-viewer-preview-card__img--ar",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-preview-card__meta", children: [
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-preview-card__title", children: "Real-World WebAR Placement" }),
          /* @__PURE__ */ jsx51("span", { className: "vs-viewer-preview-card__spec", children: "Instant Floor Detection \xB7 1:1 Scale \xB7 iOS & Android Browser" })
        ] })
      ] })
    }
  ];
  const benefits = [
    {
      id: "fps",
      title: "Silky 60 FPS Viewport",
      description: "Three.js WebGPU engine delivers ultra-smooth rotation, pan, and zoom with zero micro-stuttering on desktop and mobile browsers.",
      metric: "60 FPS",
      metricLabel: "WebGPU Viewport",
      tag: "Performance"
    },
    {
      id: "load-time",
      title: "Instant Model Streaming",
      description: "Optimized GLTF Draco decompression and progressive texture streaming load complex 3D models in milliseconds.",
      metric: "< 50ms",
      metricLabel: "Interaction Response",
      tag: "Speed"
    },
    {
      id: "cost",
      title: "Zero Server GPU Streaming Cost",
      description: "All 3D rendering and post-processing run 100% client-side in the user\u2019s browser. No expensive pixel-streaming server instances.",
      metric: "$0 / hr",
      metricLabel: "Cloud GPU Cost",
      tag: "Client-Side"
    },
    {
      id: "export-res",
      title: "4K Studio Snapshot & GLTF Export",
      description: "Capture ultra-high-resolution 4K studio snapshots with transparency and export self-contained GLTF/GLB models with embedded PBR textures.",
      metric: "4K UHD",
      metricLabel: "Snapshot Resolution",
      tag: "Production"
    }
  ];
  const [activeShading, setActiveShading] = useState30("pbr");
  const [activeBloom, setActiveBloom] = useState30(true);
  const [activeSSR, setActiveSSR] = useState30(true);
  const shadingModes = {
    pbr: "PBR Physically Based",
    wireframe: "Technical Wireframe & Normals",
    studio: "Studio Softbox Environment",
    diamond: "Cauchy Spectral Dispersion"
  };
  const heroVisual = /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage", "data-testid": "viewer-hero-stage", children: [
    /* @__PURE__ */ jsx51("div", { className: "vs-viewer-hero-stage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage__controls", children: [
      /* @__PURE__ */ jsxs42("span", { className: "vs-viewer-hero-stage__indicator", children: [
        /* @__PURE__ */ jsx51("span", { className: "vs-viewer-hero-stage__dot" }),
        "Three.js WebGPU Active"
      ] }),
      /* @__PURE__ */ jsx51("div", { className: "vs-viewer-hero-stage__modes", children: ["pbr", "wireframe", "studio", "diamond"].map((mode) => /* @__PURE__ */ jsx51(
        "button",
        {
          type: "button",
          className: `vs-viewer-mode-btn ${activeShading === mode ? "is-active" : ""}`,
          onClick: () => setActiveShading(mode),
          "aria-label": `Switch to ${mode} mode`,
          children: mode.toUpperCase()
        },
        mode
      )) })
    ] }),
    /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage__viewport", children: [
      /* @__PURE__ */ jsx51(
        "img",
        {
          src: "/logos/trikomi.png",
          alt: "VictorShell 3D Viewer Interactive Viewport",
          className: `vs-viewer-hero-stage__model vs-viewer-hero-stage__model--${activeShading}`
        }
      ),
      /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage__pin vs-viewer-hero-stage__pin--post", children: [
        /* @__PURE__ */ jsx51("span", { className: "vs-viewer-hero-stage__pin-dot" }),
        /* @__PURE__ */ jsx51("span", { children: activeBloom ? "Bloom Glow Active" : "Bloom Muted" })
      ] }),
      /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage__pin vs-viewer-hero-stage__pin--measure", children: [
        /* @__PURE__ */ jsx51("span", { className: "vs-viewer-hero-stage__pin-dot" }),
        /* @__PURE__ */ jsx51("span", { children: "Point-to-Point 3D Measurement" })
      ] }),
      /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage__pin vs-viewer-hero-stage__pin--ar", children: [
        /* @__PURE__ */ jsx51("span", { className: "vs-viewer-hero-stage__pin-dot" }),
        /* @__PURE__ */ jsx51("span", { children: "8thWall SLAM Ready" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage__footer", children: [
      /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage__meta", children: [
        /* @__PURE__ */ jsx51("span", { className: "vs-viewer-hero-stage__meta-label", children: "Active Shading Mode" }),
        /* @__PURE__ */ jsx51("span", { className: "vs-viewer-hero-stage__meta-val", children: shadingModes[activeShading] }),
        /* @__PURE__ */ jsxs42("div", { style: { display: "flex", gap: "6px", marginTop: "6px" }, children: [
          /* @__PURE__ */ jsxs42(
            "button",
            {
              type: "button",
              onClick: () => setActiveBloom(!activeBloom),
              style: {
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "999px",
                border: activeBloom ? "1px solid var(--vs-primary)" : "1px solid var(--vs-control-border)",
                background: activeBloom ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.6)",
                color: activeBloom ? "var(--vs-primary)" : "var(--vs-ink-muted)",
                cursor: "pointer"
              },
              children: [
                "Bloom: ",
                activeBloom ? "ON" : "OFF"
              ]
            }
          ),
          /* @__PURE__ */ jsxs42(
            "button",
            {
              type: "button",
              onClick: () => setActiveSSR(!activeSSR),
              style: {
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "999px",
                border: activeSSR ? "1px solid var(--vs-primary)" : "1px solid var(--vs-control-border)",
                background: activeSSR ? "var(--vs-tonal-lavender)" : "rgba(255, 255, 255, 0.6)",
                color: activeSSR ? "var(--vs-primary)" : "var(--vs-ink-muted)",
                cursor: "pointer"
              },
              children: [
                "SSR: ",
                activeSSR ? "ON" : "OFF"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-hero-stage__specs", children: [
        /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip vs-viewer-chip--accent", children: "60 FPS WebGPU" }),
        /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", children: "4K Snapshot" })
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxs42(
    ProductLandingTemplate,
    {
      productTitle: "3D Viewer",
      productBadge: "WebGPU Engine & Post-Processing",
      productTagline: "Enterprise WebGPU 3D model visualization, PBR material editing, kinematics animation, and real-time 8thWall WebAR.",
      brandName: "VictorShell",
      theme,
      onExploreDemo,
      exploreDemoLabel: "Launch 3D Viewer",
      exploreDemoHref,
      navLinks,
      className: `vs-viewer-landing-page ${className}`.trim(),
      heroProps: {
        id: "hero",
        badge: "Next-Gen WebGPU 3D Graphics",
        title: "Next-Generation WebGPU 3D Model Viewer & Real-Time Engine",
        description: "Inspect high-fidelity 3D models with cinema-grade PBR materials, post-processing effects, real-time 3D measurements, multi-track animation timelines, and one-click WebAR surface tracking.",
        stats: [
          { stat: "60 FPS", label: "WebGPU & WebGL2 Rendering" },
          { stat: "< 50ms", label: "Instant Model Streaming" },
          { stat: "0 Plugins", label: "Runs in Any Modern Browser" }
        ],
        visual: heroVisual
      },
      overviewProps: {
        id: "overview",
        badge: "Studio-Grade Rendering",
        title: "Cinema-Grade Shading, Kinematics & Post-Processing",
        description: "Engineered on Three.js WebGPU and @trikomi/core, the 3D Viewer delivers instant hardware-accelerated rendering, progressive soft contact shadows, screen-space reflections, and physical camera depth of field.",
        highlights: [
          {
            title: "Physically Based Shading (PBR)",
            text: "Real-time microfacet roughness, metallic sheen, clearcoat, refractive transmission, and anisotropic dispersion."
          },
          {
            title: "Point-to-Point 3D Measurement Tool",
            text: "Millimeter-accurate surface vertex snapping calculates Euclidean dimensions directly in the 3D viewport."
          },
          {
            title: "Multi-Track Kinematics Timeline",
            text: "Scrub, reverse, loop, and inspect multi-clip skeletal animations with variable speed (0.25x \u2013 2x)."
          }
        ],
        visual: /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-overview-card", "data-testid": "viewer-overview-card", children: [
          /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-overview-card__header", children: [
            /* @__PURE__ */ jsx51("span", { className: "vs-viewer-overview-card__title", children: "Real-Time PBR Channel Pipeline" }),
            /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", children: "ThreeViewer.ts" })
          ] }),
          /* @__PURE__ */ jsx51("div", { className: "vs-viewer-overview-card__body", children: /* @__PURE__ */ jsx51(
            "img",
            {
              src: "/logos/trikomi.png",
              alt: "3D Viewer PBR Pipeline",
              className: "vs-viewer-overview-card__img",
              loading: "lazy"
            }
          ) }),
          /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-overview-card__footer", children: [
            /* @__PURE__ */ jsxs42("div", { className: "vs-viewer-pbr-swatches", children: [
              /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", style: { fontSize: "10px" }, children: "Roughness: 0.1" }),
              /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", style: { fontSize: "10px" }, children: "Metalness: 0.9" }),
              /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", style: { fontSize: "10px" }, children: "Normal Map: 100%" }),
              /* @__PURE__ */ jsx51("span", { className: "vs-viewer-chip", style: { fontSize: "10px" }, children: "Bloom: 0.45" })
            ] }),
            /* @__PURE__ */ jsx51("span", { className: "vs-viewer-overview-card__note", children: "Hardware-Accelerated WebGPU Shaders" })
          ] })
        ] })
      },
      featuresProps: {
        id: "features",
        badge: "Engine Capabilities",
        sectionTitle: "Built for High-Precision 3D Inspection & Visualization",
        sectionSubtitle: "Advanced graphics and tooling built for designers, engineers, e-commerce platforms, and digital artists.",
        layout: "bento",
        columns: 3,
        features
      },
      showcaseProps: {
        id: "showcase",
        badge: "Viewport Modes",
        sectionTitle: "Explore Multi-Mode Inspection & Rendering",
        sectionSubtitle: "Switch between interactive viewport modes designed for different stages of the 3D asset lifecycle.",
        items: showcaseItems
      },
      benefitsProps: {
        id: "benefits",
        badge: "Performance & ROI",
        sectionTitle: "Why Creators & Engineers Choose VictorShell 3D Viewer",
        sectionSubtitle: "Engineered for speed, fidelity, client-side efficiency, and zero plugin friction.",
        variant: "metrics",
        items: benefits
      },
      ctaProps: {
        id: "cta",
        badge: "Interactive 3D Studio",
        title: "Launch the Full 3D Viewer Interactive Studio",
        description: "Inspect models, adjust PBR materials, measure geometry, and experience augmented reality live in your browser.",
        exploreDemoLabel: "Launch 3D Viewer",
        exploreDemoHref
      },
      children: [
        /* @__PURE__ */ jsx51("section", { className: "vs-landing-use-cases", id: "use-cases", "data-testid": "viewer-use-cases-section", children: /* @__PURE__ */ jsxs42("div", { className: "vs-landing-use-cases__container", children: [
          /* @__PURE__ */ jsxs42("div", { className: "vs-landing-use-cases__header", children: [
            /* @__PURE__ */ jsx51("span", { className: "vs-landing-use-cases__badge", children: "Proven Verticals" }),
            /* @__PURE__ */ jsx51("h2", { className: "vs-landing-use-cases__title", children: "Empowering Every 3D Workflow" }),
            /* @__PURE__ */ jsx51("p", { className: "vs-landing-use-cases__subtitle", children: "From enterprise e-commerce showrooms to high-precision aerospace and jewelry engineering." })
          ] }),
          /* @__PURE__ */ jsxs42("div", { className: "vs-landing-use-cases__grid", children: [
            /* @__PURE__ */ jsxs42("div", { className: "vs-use-case-card", "data-testid": "use-case-ecommerce", children: [
              /* @__PURE__ */ jsx51("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F6CD}\uFE0F" }),
              /* @__PURE__ */ jsx51("span", { className: "vs-use-case-card__tag", children: "E-Commerce & Retail" }),
              /* @__PURE__ */ jsx51("h3", { className: "vs-use-case-card__title", children: "Interactive 3D Product Showrooms" }),
              /* @__PURE__ */ jsx51("p", { className: "vs-use-case-card__desc", children: "Engage buyers with 360-degree rotating models, customizable surface materials, and instant WebAR viewing that boosts conversion rates and reduces return rates." })
            ] }),
            /* @__PURE__ */ jsxs42("div", { className: "vs-use-case-card", "data-testid": "use-case-cad", children: [
              /* @__PURE__ */ jsx51("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F4D0}" }),
              /* @__PURE__ */ jsx51("span", { className: "vs-use-case-card__tag", children: "CAD & Engineering" }),
              /* @__PURE__ */ jsx51("h3", { className: "vs-use-case-card__title", children: "Mechanical Assembly & Tolerances" }),
              /* @__PURE__ */ jsx51("p", { className: "vs-use-case-card__desc", children: "Inspect complex CAD geometries with millimeter-accurate point-to-point measurement, exploded part animations, and scene graph hierarchy traversal." })
            ] }),
            /* @__PURE__ */ jsxs42("div", { className: "vs-use-case-card", "data-testid": "use-case-game-art", children: [
              /* @__PURE__ */ jsx51("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F3AE}" }),
              /* @__PURE__ */ jsx51("span", { className: "vs-use-case-card__tag", children: "Gaming & VFX" }),
              /* @__PURE__ */ jsx51("h3", { className: "vs-use-case-card__title", children: "Digital Asset & Rig Validation" }),
              /* @__PURE__ */ jsx51("p", { className: "vs-use-case-card__desc", children: "Review 3D character rigs, skinning weights, and skeletal animations with sub-frame scrubbing, lighting checks, and wireframe normal inspections." })
            ] }),
            /* @__PURE__ */ jsxs42("div", { className: "vs-use-case-card", "data-testid": "use-case-luxury", children: [
              /* @__PURE__ */ jsx51("div", { className: "vs-use-case-card__icon", "aria-hidden": "true", children: "\u{1F48E}" }),
              /* @__PURE__ */ jsx51("span", { className: "vs-use-case-card__tag", children: "Luxury & Jewelry" }),
              /* @__PURE__ */ jsx51("h3", { className: "vs-use-case-card__title", children: "Ray-Traced Spectral Dispersion" }),
              /* @__PURE__ */ jsx51("p", { className: "vs-use-case-card__desc", children: "Simulate Cauchy optical dispersion in diamond facets, anisotropic metallic reflections, and physical gemstone refraction with zero render latency." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx51("section", { className: "vs-landing-specs", id: "specs", "data-testid": "viewer-specs-section", children: /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__container", children: [
          /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__header", children: [
            /* @__PURE__ */ jsx51("span", { className: "vs-landing-specs__badge", children: "Technical Specifications" }),
            /* @__PURE__ */ jsx51("h2", { className: "vs-landing-specs__title", children: "Engine & Architecture Specifications" }),
            /* @__PURE__ */ jsx51("p", { className: "vs-landing-specs__subtitle", children: "Verified specifications powering the VictorShell 3D Viewer Studio." })
          ] }),
          /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__grid", children: [
            /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx51("h3", { className: "vs-landing-specs__card-title", children: "Rendering & Graphics" }),
              /* @__PURE__ */ jsxs42("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Rendering Engine" }),
                  /* @__PURE__ */ jsx51("dd", { children: "Three.js WebGPU with WebGL2 Fallback" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Core SDK" }),
                  /* @__PURE__ */ jsx51("dd", { children: "@trikomi/core & ThreeViewer" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Shading Pipeline" }),
                  /* @__PURE__ */ jsx51("dd", { children: "PBR MeshPhysicalMaterial & Cauchy Dispersion" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Lighting & Studio" }),
                  /* @__PURE__ */ jsx51("dd", { children: "HDR Softbox environment with progressive ground shadows" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx51("h3", { className: "vs-landing-specs__card-title", children: "Post-Processing & FX" }),
              /* @__PURE__ */ jsxs42("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Glow & Radiance" }),
                  /* @__PURE__ */ jsx51("dd", { children: "BloomPlugin with luminance thresholding" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Reflections & AO" }),
                  /* @__PURE__ */ jsx51("dd", { children: "Screen Space Reflections (SSR) & SSAO / SSGI" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Camera Optics" }),
                  /* @__PURE__ */ jsx51("dd", { children: "Physical Depth of Field (DOF) with focal distance" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Outlines & Highlights" }),
                  /* @__PURE__ */ jsx51("dd", { children: "OutlinePlugin for selected node highlighting" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx51("h3", { className: "vs-landing-specs__card-title", children: "Tooling & Measurement" }),
              /* @__PURE__ */ jsxs42("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Dimensional Snapping" }),
                  /* @__PURE__ */ jsx51("dd", { children: "MeasurementPlugin point-to-point vertex raycaster" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Scene Manipulation" }),
                  /* @__PURE__ */ jsx51("dd", { children: "TransformGizmoPlugin (Translate, Rotate, Scale)" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Camera Controls" }),
                  /* @__PURE__ */ jsx51("dd", { children: "OrbitControlsPlugin with damping & auto-rotate" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Camera Angles" }),
                  /* @__PURE__ */ jsx51("dd", { children: "Orthographic & Perspective presets (Top, Front, Side)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__card", children: [
              /* @__PURE__ */ jsx51("h3", { className: "vs-landing-specs__card-title", children: "Augmented Reality & Export" }),
              /* @__PURE__ */ jsxs42("dl", { className: "vs-landing-specs__list", children: [
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "WebAR Engine" }),
                  /* @__PURE__ */ jsx51("dd", { children: "Niantic 8thWall SLAM SDK (Surface Tracking)" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Installation" }),
                  /* @__PURE__ */ jsx51("dd", { children: "0 App Installs \u2022 Runs in Safari & Chrome mobile" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Scene Export" }),
                  /* @__PURE__ */ jsx51("dd", { children: "GLTF 2.0 / GLB Binary packager" })
                ] }),
                /* @__PURE__ */ jsxs42("div", { className: "vs-landing-specs__row", children: [
                  /* @__PURE__ */ jsx51("dt", { children: "Image Capture" }),
                  /* @__PURE__ */ jsx51("dd", { children: "4K Ultra HD PNG Studio Snapshot" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};

// tests/landing-components.unit.test.mjs
test("LandingNav renders horizontal and vertical navigation links with active state", () => {
  const links = [
    { id: "overview", label: "Overview", href: "#overview", active: true },
    { id: "specs", label: "Tech Specs", href: "#specs", badge: "v1.0" },
    { id: "docs", label: "SDK Docs", href: "/docs", external: true }
  ];
  const horizontalHtml = renderToStaticMarkup(
    React24.createElement(LandingNav, { links, orientation: "horizontal" })
  );
  assert.ok(horizontalHtml.includes("vs-landing-nav--horizontal"), "Should apply horizontal orientation class.");
  assert.ok(horizontalHtml.includes("Overview"), "Should render Overview link.");
  assert.ok(horizontalHtml.includes("Tech Specs"), "Should render Tech Specs link.");
  assert.ok(horizontalHtml.includes("is-active"), "Active link should have is-active class.");
  assert.ok(horizontalHtml.includes('aria-current="page"'), 'Active link should have aria-current="page".');
  assert.ok(horizontalHtml.includes("vs-landing-nav__indicator"), "Active link should have visual indicator.");
  assert.ok(horizontalHtml.includes("v1.0"), "Badge should be rendered.");
  assert.ok(horizontalHtml.includes('target="_blank"'), 'External link should have target="_blank".');
  const verticalHtml = renderToStaticMarkup(
    React24.createElement(LandingNav, { links, orientation: "vertical" })
  );
  assert.ok(verticalHtml.includes("vs-landing-nav--vertical"), "Should apply vertical orientation class.");
});
test("LandingHeader renders single product branding, theme switcher, and Explore Demo CTA", () => {
  const headerHtml = renderToStaticMarkup(
    React24.createElement(
      VictorShellThemeProvider,
      { initialAccent: "violet" },
      React24.createElement(LandingHeader, {
        productTitle: "Jewelry Configurator",
        productBadge: "Ray Traced Diamond",
        brandName: "VictorShell",
        showThemeSwitcher: true,
        exploreDemoLabel: "Explore Demo",
        navLinks: [
          { label: "Overview", href: "#overview", active: true },
          { label: "Gems", href: "#gems" }
        ]
      })
    )
  );
  assert.ok(headerHtml.includes("Jewelry Configurator"), "Must display the specific product title.");
  assert.ok(headerHtml.includes('data-testid="product-title"'), "Product title must have testid.");
  assert.ok(headerHtml.includes("Ray Traced Diamond"), "Must display product badge.");
  assert.ok(headerHtml.includes('data-testid="product-badge"'), "Product badge must have testid.");
  assert.ok(headerHtml.includes("VictorShell"), "Must display brand name.");
  assert.ok(headerHtml.includes('data-testid="landing-theme-switcher"'), "Theme switcher must be present.");
  assert.ok(headerHtml.includes('aria-label="Violet theme"'), "Must have Violet theme option.");
  assert.ok(headerHtml.includes('aria-label="Indigo theme"'), "Must have Indigo theme option.");
  assert.ok(headerHtml.includes('aria-label="Orchid theme"'), "Must have Orchid theme option.");
  assert.ok(headerHtml.includes('data-testid="explore-demo-btn"'), "Explore Demo CTA button must exist.");
  assert.ok(headerHtml.includes("vs-btn-primary"), "Explore Demo button must use primary button style.");
  assert.ok(headerHtml.includes("Explore Demo"), "CTA text must be rendered.");
  assert.ok(headerHtml.includes('data-testid="mobile-nav-toggle"'), "Mobile hamburger toggle button must exist.");
});
test("LandingFooter renders single product metadata, status indicator, links, and back-to-top", () => {
  const footerHtml = renderToStaticMarkup(
    React24.createElement(LandingFooter, {
      productTitle: "Box Configurator",
      productTagline: "Parametric 3D box engineering and real-time dieline generation.",
      brandName: "VictorShell",
      sdkVersion: "@trikomi/core WebGPU 3D Engine",
      showBackToTop: true
    })
  );
  assert.ok(footerHtml.includes("Box Configurator"), "Footer must display product title.");
  assert.ok(footerHtml.includes("Parametric 3D box engineering"), "Footer must display product tagline.");
  assert.ok(footerHtml.includes("@trikomi/core WebGPU 3D Engine"), "Footer must display engine status indicator.");
  assert.ok(footerHtml.includes("vs-landing-footer__status-dot"), "Footer must display animated status dot.");
  assert.ok(footerHtml.includes("3D Platform"), "Footer must list platform columns.");
  assert.ok(footerHtml.includes("Developer SDK"), "Footer must list SDK documentation column.");
  assert.ok(footerHtml.includes('data-testid="back-to-top-btn"'), "Footer must provide back-to-top action.");
  assert.ok(footerHtml.includes("All rights reserved"), "Footer must display copyright line.");
});
test("ProductLandingLayout coordinates Header, ambient background, main content, and Footer", () => {
  const layoutHtml = renderToStaticMarkup(
    React24.createElement(
      ProductLandingLayout,
      {
        productTitle: "Sportswear Configurator",
        productBadge: "Dynamic SVG Decals",
        productTagline: "Interactive custom jersey colors, fabrics, logos and numbers.",
        theme: "indigo",
        onExploreDemo: () => {
        },
        navLinks: [{ label: "Design Lab", href: "#lab", active: true }]
      },
      React24.createElement("div", { "data-testid": "custom-product-content" }, "Hero Section for Sportswear")
    )
  );
  assert.ok(layoutHtml.includes('data-testid="product-landing-layout"'), "Layout container must be rendered.");
  assert.ok(layoutHtml.includes('data-accent="indigo"'), 'Theme provider must set data-accent="indigo".');
  assert.ok(layoutHtml.includes("vs-landing-ambient"), "Ambient background glow must be rendered.");
  assert.ok(layoutHtml.includes("Sportswear Configurator"), "Product title must be present in layout.");
  assert.ok(layoutHtml.includes("Dynamic SVG Decals"), "Product badge must be present in layout.");
  assert.ok(layoutHtml.includes("Hero Section for Sportswear"), "Children content must be rendered inside main.");
  assert.ok(layoutHtml.includes("vs-landing-footer"), "LandingFooter must be rendered by layout.");
});
test("LandingHero renders product title, badge, CTAs, stats, and visual stage", () => {
  const heroHtml = renderToStaticMarkup(
    React24.createElement(LandingHero, {
      title: "Sportswear Configurator",
      subtitle: "Real-time 3D Apparel Customization Engine",
      badge: "Interactive WebGPU Demo",
      description: "Configure high-performance team jerseys with dynamic vector decals, sublimation materials, and instant 3D preview.",
      exploreDemoLabel: "Launch Configurator Demo",
      onExploreDemo: () => {
      },
      secondaryCta: {
        label: "View Tech Specs",
        href: "#specs"
      },
      stats: [
        { value: "60 FPS", label: "WebGPU Engine", hint: "Ultra smooth rendering" },
        { value: "< 1.5s", label: "Load Time", hint: "Optimized GLTF streaming" }
      ],
      visual: React24.createElement("div", { "data-testid": "mock-hero-visual" }, "3D Jersey Canvas"),
      visualPosition: "right"
    })
  );
  assert.ok(heroHtml.includes('data-testid="landing-hero"'), "Hero section container must exist.");
  assert.ok(heroHtml.includes("Sportswear Configurator"), "Hero must display product title.");
  assert.ok(heroHtml.includes("Real-time 3D Apparel Customization Engine"), "Hero must display subtitle.");
  assert.ok(heroHtml.includes("Interactive WebGPU Demo"), "Hero must display product badge.");
  assert.ok(heroHtml.includes("Configure high-performance team jerseys"), "Hero must render intro description.");
  assert.ok(heroHtml.includes("Launch Configurator Demo"), "Hero must render primary CTA text.");
  assert.ok(heroHtml.includes('data-testid="hero-explore-demo-btn"'), "Hero must have explore demo button testid.");
  assert.ok(heroHtml.includes("View Tech Specs"), "Hero must render secondary CTA.");
  assert.ok(heroHtml.includes('href="#specs"'), "Secondary CTA must have correct href.");
  assert.ok(heroHtml.includes("60 FPS"), "Hero must render stat value.");
  assert.ok(heroHtml.includes("WebGPU Engine"), "Hero must render stat label.");
  assert.ok(heroHtml.includes("mock-hero-visual"), "Hero must render custom visual slot.");
  assert.ok(heroHtml.includes("vs-landing-hero--visual-right"), "Hero must apply right visual placement modifier.");
});
test("LandingFeatures renders grid and bento layouts with feature items", () => {
  const features = [
    {
      id: "decal-engine",
      title: "Dynamic Vector Decals",
      description: "Upload custom SVG artwork and position logos with real-time UV projection.",
      badge: "Core Tech"
    },
    {
      id: "sublimation",
      title: "Sublimation Materials",
      description: "Photorealistic fabric shaders replicating technical knit and moisture-wicking weave.",
      badge: "PBR"
    },
    {
      id: "color-palette",
      title: "Pantone Palette Matching",
      description: "Accurate color calibration ensuring what you design matches physical production.",
      action: { label: "Learn more", href: "#palette" }
    }
  ];
  const gridHtml = renderToStaticMarkup(
    React24.createElement(LandingFeatures, {
      badge: "Engine Capabilities",
      sectionTitle: "Built for High-Performance Apparel",
      sectionSubtitle: "Precision 3D customization with zero latency.",
      features,
      layout: "grid",
      columns: 3
    })
  );
  assert.ok(gridHtml.includes('data-testid="landing-features"'), "Features container must exist.");
  assert.ok(gridHtml.includes("Engine Capabilities"), "Features badge must be rendered.");
  assert.ok(gridHtml.includes("Built for High-Performance Apparel"), "Features title must be rendered.");
  assert.ok(gridHtml.includes("Dynamic Vector Decals"), "Feature title 1 rendered.");
  assert.ok(gridHtml.includes("Sublimation Materials"), "Feature title 2 rendered.");
  assert.ok(gridHtml.includes("Pantone Palette Matching"), "Feature title 3 rendered.");
  assert.ok(gridHtml.includes("vs-landing-features--cols-3"), "Columns class must be applied.");
  assert.ok(gridHtml.includes("Core Tech"), "Feature badge rendered.");
  assert.ok(gridHtml.includes('href="#palette"'), "Feature link rendered.");
  const bentoHtml = renderToStaticMarkup(
    React24.createElement(LandingFeatures, {
      sectionTitle: "Next-Gen Configurator",
      features,
      layout: "bento"
    })
  );
  assert.ok(bentoHtml.includes("vs-landing-features--bento"), "Bento layout modifier must be applied.");
});
test("LandingOverview renders product narrative, highlights, and visual side-by-side", () => {
  const overviewHtml = renderToStaticMarkup(
    React24.createElement(LandingOverview, {
      badge: "Architecture Overview",
      title: "True-to-Scale Parametric Box Engineering",
      subtitle: "From 2D dieline to folded 3D carton in milliseconds.",
      description: "The Box Configurator connects directly with packaging CAD formats. Users can adjust dimensions, flute thicknesses, and tuck closures.",
      highlights: [
        {
          title: "Live Folding Simulation",
          text: "Step-by-step carton folding animation powered by joint kinematics."
        },
        {
          title: "Export Production Vector PDF",
          text: "One-click export of ready-to-print vector cut/crease lines."
        }
      ],
      visual: React24.createElement("div", { "data-testid": "box-folding-preview" }, "Interactive Carton Preview"),
      reversed: true
    })
  );
  assert.ok(overviewHtml.includes('data-testid="landing-overview"'), "Overview section must exist.");
  assert.ok(overviewHtml.includes("Architecture Overview"), "Overview badge must be rendered.");
  assert.ok(overviewHtml.includes("True-to-Scale Parametric Box Engineering"), "Overview title must be rendered.");
  assert.ok(overviewHtml.includes("From 2D dieline to folded 3D carton"), "Overview subtitle must be rendered.");
  assert.ok(overviewHtml.includes("The Box Configurator connects directly"), "Description text rendered.");
  assert.ok(overviewHtml.includes("Live Folding Simulation"), "Highlight 1 title rendered.");
  assert.ok(overviewHtml.includes("Step-by-step carton folding animation"), "Highlight 1 text rendered.");
  assert.ok(overviewHtml.includes("box-folding-preview"), "Visual node rendered.");
  assert.ok(overviewHtml.includes("vs-landing-overview--reversed"), "Reversed class modifier must be present.");
});
test("LandingBenefits renders metric callouts, frosted cards, and tags", () => {
  const benefits = [
    {
      id: "performance",
      title: "Sub-Millisecond Tracking",
      description: "68 facial landmark tracking runs smoothly in real time.",
      metric: "68 pts",
      metricLabel: "Landmark Mesh",
      tag: "MediaPipe"
    },
    {
      id: "latency",
      title: "Zero Cloud Roundtrips",
      description: "All face analysis and expression blendshapes execute purely on-device.",
      metric: "0 ms",
      metricLabel: "Server Latency",
      tag: "Privacy First"
    }
  ];
  const benefitsHtml = renderToStaticMarkup(
    React24.createElement(LandingBenefits, {
      badge: "Performance & Privacy",
      sectionTitle: "Why Developers Choose Face Mocap",
      sectionSubtitle: "Engineered for seamless in-browser motion capture.",
      items: benefits,
      variant: "metrics"
    })
  );
  assert.ok(benefitsHtml.includes('data-testid="landing-benefits"'), "Benefits container must exist.");
  assert.ok(benefitsHtml.includes('data-testid="benefits-badge"'), "Benefits badge container rendered.");
  assert.ok(benefitsHtml.includes("Performance &amp; Privacy"), "Benefits badge rendered.");
  assert.ok(benefitsHtml.includes("Why Developers Choose Face Mocap"), "Benefits title rendered.");
  assert.ok(benefitsHtml.includes("68 pts"), "Metric 1 value rendered.");
  assert.ok(benefitsHtml.includes("Landmark Mesh"), "Metric 1 label rendered.");
  assert.ok(benefitsHtml.includes("0 ms"), "Metric 2 value rendered.");
  assert.ok(benefitsHtml.includes("Server Latency"), "Metric 2 label rendered.");
  assert.ok(benefitsHtml.includes("MediaPipe"), "Tag rendered in benefits.");
  assert.ok(benefitsHtml.includes("vs-landing-benefits--metrics"), "Metrics modifier applied.");
});
test("LandingVisualShowcase renders tabbed product modes and preview stage", () => {
  const showcaseItems = [
    {
      id: "diamonds",
      label: "Diamond Refraction",
      badge: "Ray Traced PBR",
      description: "Physical caustic simulation calculates realistic sparkle in real-time.",
      visual: React24.createElement("div", { "data-testid": "diamond-stage" }, "Diamond Visualizer")
    },
    {
      id: "metals",
      label: "Precious Metals",
      badge: "Microfacet PBR",
      description: "Accurate metal anisotropic roughness reflections.",
      visual: React24.createElement("div", { "data-testid": "metal-stage" }, "Metal Visualizer")
    }
  ];
  const showcaseHtml = renderToStaticMarkup(
    React24.createElement(LandingVisualShowcase, {
      badge: "Visual Fidelity",
      sectionTitle: "Explore High-Precision Jewelry Rendering",
      sectionSubtitle: "Switch between shader modes to inspect real-time optical quality.",
      items: showcaseItems,
      defaultActiveId: "diamonds"
    })
  );
  assert.ok(showcaseHtml.includes('data-testid="landing-visual-showcase"'), "Visual showcase container rendered.");
  assert.ok(showcaseHtml.includes("Explore High-Precision Jewelry Rendering"), "Showcase title rendered.");
  assert.ok(showcaseHtml.includes("Diamond Refraction"), "Tab 1 label rendered.");
  assert.ok(showcaseHtml.includes("Precious Metals"), "Tab 2 label rendered.");
  assert.ok(showcaseHtml.includes("Physical caustic simulation"), "Active item description rendered.");
  assert.ok(showcaseHtml.includes("diamond-stage"), "Active visual stage rendered.");
  assert.ok(showcaseHtml.includes("Ray Traced PBR"), "Active item badge rendered.");
});
test("LandingCtaSection renders conversion banner, primary Explore Demo button, and reassurance note", () => {
  const ctaHtml = renderToStaticMarkup(
    React24.createElement(LandingCtaSection, {
      badge: "Ready to Experience",
      title: "Test the 360\xB0 Virtual Tour Live in Your Browser",
      description: "Seamless hotspot navigation, spherical panorama streaming, and spatial audio with zero plugins.",
      exploreDemoLabel: "Explore Interactive Tour Demo",
      onExploreDemo: () => {
      },
      secondaryCta: {
        label: "Read SDK Documentation",
        href: "/docs/tour"
      },
      note: "No installation required \u2022 Runs natively on mobile and desktop browsers"
    })
  );
  assert.ok(ctaHtml.includes('data-testid="landing-cta-section"'), "CTA section container rendered.");
  assert.ok(ctaHtml.includes("vs-landing-cta-card"), "Frosted banner card rendered.");
  assert.ok(ctaHtml.includes("Test the 360\xB0 Virtual Tour Live in Your Browser"), "CTA title rendered.");
  assert.ok(ctaHtml.includes("Explore Interactive Tour Demo"), "Primary CTA text rendered.");
  assert.ok(ctaHtml.includes('data-testid="cta-explore-demo-btn"'), "Primary CTA button testid rendered.");
  assert.ok(ctaHtml.includes("Read SDK Documentation"), "Secondary CTA rendered.");
  assert.ok(ctaHtml.includes('href="/docs/tour"'), "Secondary CTA href rendered.");
  assert.ok(ctaHtml.includes("No installation required"), "Reassurance note rendered.");
});
test("ProductLandingTemplate coordinates master layout, sections, and theme", () => {
  const templateHtml = renderToStaticMarkup(
    React24.createElement(ProductLandingTemplate, {
      productTitle: "Box Configurator",
      productBadge: "Parametric Dielines",
      productTagline: "Custom carton folding simulation.",
      theme: "violet",
      onExploreDemo: () => {
      },
      exploreDemoLabel: "Launch Studio",
      navLinks: [{ label: "Overview", href: "#overview", active: true }],
      heroProps: {
        title: "Parametric Packaging in 3D",
        description: "Design and fold custom corrugated cartons live in your browser."
      },
      overviewProps: {
        title: "Precision Kinematics",
        description: "Folding animation matches real box board thickness."
      },
      featuresProps: {
        sectionTitle: "Core Capabilities",
        features: [
          { title: "Dieline Import", description: "Supports standard CAD formats." }
        ]
      },
      showcaseProps: {
        sectionTitle: "Box Styles",
        items: [
          { id: "mailer", label: "Mailer Box", visual: React24.createElement("div", null, "Mailer") }
        ]
      },
      benefitsProps: {
        sectionTitle: "Production Efficiency",
        items: [
          { title: "Zero Waste", description: "Accurate die lines eliminate scrap.", metric: "0%", metricLabel: "Scrap Rate" }
        ]
      }
    })
  );
  assert.ok(templateHtml.includes("vs-product-landing-template"), "Template class must be applied.");
  assert.ok(templateHtml.includes('data-accent="violet"'), "Theme accent must be set to violet.");
  assert.ok(templateHtml.includes("Parametric Packaging in 3D"), "Hero title must be rendered.");
  assert.ok(templateHtml.includes("Precision Kinematics"), "Overview section must be rendered.");
  assert.ok(templateHtml.includes("Core Capabilities"), "Features section must be rendered.");
  assert.ok(templateHtml.includes("Box Styles"), "Showcase section must be rendered.");
  assert.ok(templateHtml.includes("Production Efficiency"), "Benefits section must be rendered.");
  assert.ok(templateHtml.includes("Launch Studio"), "CTA buttons must use exploreDemoLabel.");
});
test("SportswearLandingPage renders complete sample page with verified features, assets, and demo CTA", () => {
  const samplePageHtml = renderToStaticMarkup(
    React24.createElement(SportswearLandingPage, {
      onExploreDemo: () => {
      },
      exploreDemoHref: "/apps/sportswear-configurator/index.html#demo",
      theme: "indigo"
    })
  );
  assert.ok(samplePageHtml.includes("Sportswear Configurator"), "Product title must be displayed.");
  assert.ok(samplePageHtml.includes("WebGPU Vector Decal Engine"), "Product badge must be displayed.");
  assert.ok(samplePageHtml.includes('data-accent="indigo"'), "Indigo theme must be applied.");
  assert.ok(samplePageHtml.includes("Launch 3D Configurator"), "Primary Explore Demo CTA must be displayed.");
  assert.ok(samplePageHtml.includes('href="#overview"'), "Nav must link to Overview.");
  assert.ok(samplePageHtml.includes('href="#features"'), "Nav must link to Features.");
  assert.ok(samplePageHtml.includes('href="#showcase"'), "Nav must link to Showcase.");
  assert.ok(samplePageHtml.includes('href="#use-cases"'), "Nav must link to Use Cases.");
  assert.ok(samplePageHtml.includes('href="#benefits"'), "Nav must link to Performance.");
  assert.ok(samplePageHtml.includes('href="#specs"'), "Nav must link to Tech Specs.");
  assert.ok(samplePageHtml.includes("High-Performance Custom 3D Team Apparel"), "Hero title rendered.");
  assert.ok(samplePageHtml.includes("sportswear-hero-stage"), "Hero interactive stage rendered.");
  assert.ok(samplePageHtml.includes("WebGPU Canvas Active"), "Hero status indicator rendered.");
  assert.ok(samplePageHtml.includes("Dynamic Crest UV"), "Hero decal tag rendered.");
  assert.ok(samplePageHtml.includes("Vector Sponsor Mark"), "Hero sponsor tag rendered.");
  assert.ok(samplePageHtml.includes("hero-quick-launch-btn"), "Quick launch demo button rendered.");
  assert.ok(samplePageHtml.includes("/logos/jersey.png"), "Real jersey asset referenced.");
  assert.ok(samplePageHtml.includes("True-to-Scale Fabric Simulation &amp; Sublimation Pipeline"), "Overview title rendered.");
  assert.ok(samplePageHtml.includes("sportswear-dieline-card"), "Technical dieline card rendered.");
  assert.ok(samplePageHtml.includes("/svgs/uv_layout_with_labels.svg"), "Real UV layout asset referenced.");
  assert.ok(samplePageHtml.includes("5 Independent Hex Layer Channels"), "Color channels note rendered.");
  assert.ok(samplePageHtml.includes("Dynamic Vector Decals"), "Feature 1 rendered.");
  assert.ok(samplePageHtml.includes("Technical Fabric Shaders"), "Feature 2 rendered.");
  assert.ok(samplePageHtml.includes("Player Names &amp; Numbers"), "Feature 3 rendered.");
  assert.ok(samplePageHtml.includes("4-Angle Studio Cameras"), "Feature 4 rendered.");
  assert.ok(samplePageHtml.includes("Multi-Sport Garment Models"), "Feature 5 rendered.");
  assert.ok(samplePageHtml.includes("Factory Snapshot Export"), "Feature 6 rendered.");
  assert.ok(samplePageHtml.includes("Explore Supported Teamwear Kits"), "Showcase title rendered.");
  assert.ok(samplePageHtml.includes("Pro Soccer Kit"), "Garment tab 1 rendered.");
  assert.ok(samplePageHtml.includes("Rugby Match Kit"), "Garment tab 2 rendered.");
  assert.ok(samplePageHtml.includes("Basketball Singlet"), "Garment tab 3 rendered.");
  assert.ok(samplePageHtml.includes("SoccerJersey.gltf"), "GLTF model chip rendered.");
  assert.ok(samplePageHtml.includes("Why Apparel Manufacturers Choose VictorShell"), "Benefits title rendered.");
  assert.ok(samplePageHtml.includes("60 FPS"), "Metric 1 value rendered.");
  assert.ok(samplePageHtml.includes("&lt; 1.2s"), "Metric 2 value rendered.");
  assert.ok(samplePageHtml.includes("$0 / hr"), "Metric 3 value rendered.");
  assert.ok(samplePageHtml.includes("100%"), "Metric 4 value rendered.");
  assert.ok(samplePageHtml.includes("sportswear-use-cases-section"), "Use cases section rendered.");
  assert.ok(samplePageHtml.includes("Tailored for Every Athletic Discipline"), "Use cases title rendered.");
  assert.ok(samplePageHtml.includes("use-case-soccer"), "Soccer use case card rendered.");
  assert.ok(samplePageHtml.includes("use-case-rugby"), "Rugby use case card rendered.");
  assert.ok(samplePageHtml.includes("use-case-basketball"), "Basketball use case card rendered.");
  assert.ok(samplePageHtml.includes("use-case-factory"), "Factory sublimation use case card rendered.");
  assert.ok(samplePageHtml.includes("Direct-to-Cutter Production"), "Production title rendered.");
  assert.ok(samplePageHtml.includes("sportswear-specs-section"), "Specs section rendered.");
  assert.ok(samplePageHtml.includes("Three.js WebGPU / WebGL2 Fallback"), "Specs detail rendered.");
  assert.ok(samplePageHtml.includes("Optimized GLTF 2.0 with Draco mesh compression"), "Specs geometry rendered.");
  assert.ok(samplePageHtml.includes("landing-cta-section"), "Pre-footer CTA section rendered.");
  assert.ok(samplePageHtml.includes('href="/apps/sportswear-configurator/index.html#demo"'), "CTA links to existing demo route.");
  assert.ok(samplePageHtml.includes("vs-landing-footer"), "Footer rendered.");
  assert.ok(samplePageHtml.includes("@trikomi/core WebGPU 3D Engine"), "Engine status rendered in footer.");
});
test("Sportswear Landing Page Final QA Verification (Layout, Responsiveness, CTAs, Navigation, Assets, Themes)", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const assets = [
    "public/logos/jersey.png",
    "public/svgs/uv_layout_with_labels.svg",
    "public/models/BasketballSinglet.gltf",
    "public/models/RugbyJersey.gltf",
    "public/models/SoccerJersey.gltf",
    "public/logos/trikomi.png"
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 1e3, `Asset ${asset} must have valid non-zero content`);
  });
  const html = renderToStaticMarkup(
    React24.createElement(SportswearLandingPage, {
      onExploreDemo: () => {
      },
      exploreDemoHref: "/apps/sportswear-configurator/index.html#demo",
      theme: "indigo"
    })
  );
  ["overview", "features", "showcase", "use-cases", "benefits", "specs"].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `DOM Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), "Header Explore Demo CTA present");
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), "Hero Primary CTA present");
  assert.ok(html.includes('data-testid="hero-quick-launch-btn"'), "Hero Quick Launch CTA present");
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), "Pre-Footer CTA present");
  assert.ok(html.includes('href="/apps/sportswear-configurator/index.html#demo"'), "Pre-Footer CTA links to demo");
  ["violet", "indigo", "orchid"].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React24.createElement(SportswearLandingPage, {
        onExploreDemo: () => {
        },
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
  assert.ok(html.includes("vs-sportswear-hero-stage"), "Hero stage container present");
  assert.ok(html.includes("vs-sportswear-dieline-card"), "Dieline card container present");
  assert.ok(html.includes("vs-landing-use-cases__grid"), "Use cases responsive grid present");
  assert.ok(html.includes("vs-landing-specs__grid"), "Specs responsive grid present");
});
test("Face Mocap Landing Page Architecture & QA Verification", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const assets = [
    "public/logos/facemocap.png",
    "public/svgs/mocap_landmarks_measurement.svg",
    "public/models/raccoon_head_small.glb",
    "public/models/head-occluder.glb",
    "public/logos/trikomi.png"
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 100, `Asset ${asset} must have valid content`);
  });
  const html = renderToStaticMarkup(
    React24.createElement(FaceMocapLandingPage, {
      onExploreDemo: () => {
      },
      exploreDemoHref: "/apps/face-mocap/index.html#demo",
      theme: "violet"
    })
  );
  assert.ok(html.includes("Face Motion Capture"), "Title must be Face Motion Capture");
  assert.ok(html.includes("MediaPipe 52 ARKit Blendshapes"), "Badge must specify ARKit blendshapes");
  assert.ok(html.includes("Browser-Based Facial Motion Capture"), "Hero title must be present");
  assert.ok(html.includes("vs-mocap-hero-stage"), "Hero mocap stage must be rendered");
  assert.ok(html.includes("Live Landmark Tracking: 60 FPS"), "Telemetry tracking indicator present");
  assert.ok(html.includes("EyeBlinkLeft"), "Blendshape telemetry EyeBlinkLeft present");
  assert.ok(html.includes("JawOpen"), "Blendshape telemetry JawOpen present");
  assert.ok(html.includes("MouthSmile"), "Blendshape telemetry MouthSmile present");
  assert.ok(html.includes("BrowInnerUp"), "Blendshape telemetry BrowInnerUp present");
  assert.ok(html.includes('id="overview"'), "Overview section anchor must exist");
  assert.ok(html.includes("mocap_landmarks_measurement.svg"), "Overview must render landmark telemetry SVG");
  assert.ok(html.includes("Precision Facial Landmark Kinematics"), "Overview heading present");
  assert.ok(html.includes('id="features"'), "Features section anchor must exist");
  assert.ok(html.includes("468-Point Dense Face Mesh"), "Feature 1 present");
  assert.ok(html.includes("52 ARKit Blendshapes"), "Feature 2 present");
  assert.ok(html.includes("Unreal Engine LiveLink"), "Feature 3 present");
  assert.ok(html.includes("100% On-Device Inference"), "Feature 4 present");
  assert.ok(html.includes("Adaptive Jitter Filter"), "Feature 5 present");
  assert.ok(html.includes("Real-Time 3D Viewport"), "Feature 6 present");
  assert.ok(html.includes('id="showcase"'), "Showcase section anchor must exist");
  assert.ok(html.includes("MetaHuman LiveLink"), "Showcase item 1 present");
  assert.ok(html.includes("Cartoon 3D Avatar"), "Showcase item 2 present");
  assert.ok(html.includes("468 Mesh Topology"), "Showcase item 3 present");
  assert.ok(html.includes('id="benefits"'), "Benefits section anchor must exist");
  assert.ok(html.includes("60 FPS"), "Metric 60 FPS present");
  assert.ok(html.includes("0 ms"), "Zero latency metric present");
  assert.ok(html.includes("100%"), "On-device metric present");
  assert.ok(html.includes('id="use-cases"'), "Use cases section anchor must exist");
  assert.ok(html.includes("Unreal MetaHuman Previz"), "Use case 1 present");
  assert.ok(html.includes("Low-Latency Avatar Broadcast"), "Use case 2 present");
  assert.ok(html.includes("Rapid Facial Pre-Visualization"), "Use case 3 present");
  assert.ok(html.includes("Interactive WebXR Avatars"), "Use case 4 present");
  assert.ok(html.includes('id="specs"'), "Specs section anchor must exist");
  assert.ok(html.includes("MediaPipe Tasks Vision (Google Research)"), "Specs pipeline present");
  assert.ok(html.includes("127.0.0.1:5000 (Unreal Engine LiveLink)"), "Specs streaming present");
  ["overview", "features", "showcase", "use-cases", "benefits", "specs"].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), "Header Explore Demo CTA present");
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), "Hero Primary CTA present");
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), "Pre-Footer CTA present");
  assert.ok(html.includes('href="/apps/face-mocap/index.html#demo"'), "CTA must link to face mocap demo route");
  ["violet", "indigo", "orchid"].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React24.createElement(FaceMocapLandingPage, {
        onExploreDemo: () => {
        },
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});
test("Jewelry Configurator Landing Page Architecture & QA Verification", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const assets = [
    "public/logos/jewel.png",
    "public/models/ring.glb",
    "public/models/ring2.glb",
    "public/models/diamonds.glb",
    "public/logos/trikomi.png"
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 100, `Asset ${asset} must have valid content`);
  });
  const html = renderToStaticMarkup(
    React24.createElement(JewelryLandingPage, {
      onExploreDemo: () => {
      },
      exploreDemoHref: "/apps/jewelry-configurator/index.html#demo",
      theme: "orchid"
    })
  );
  assert.ok(html.includes("Jewelry Configurator"), "Title must be Jewelry Configurator");
  assert.ok(html.includes("Ray-Traced Spectral Dispersion"), "Badge must specify spectral dispersion");
  assert.ok(html.includes("Photorealistic 3D Jewelry &amp; Ray-Traced Diamond Studio"), "Hero title present");
  assert.ok(html.includes("vs-jewelry-hero-stage"), "Hero jewelry stage must be rendered");
  assert.ok(html.includes("Crown Caustic Fire"), "Hero dispersion pin present");
  assert.ok(html.includes("Anisotropic Metal"), "Hero metal pin present");
  assert.ok(html.includes("Abbe 58.6"), "Hero Abbe number badge present");
  assert.ok(html.includes("18K Yellow Gold"), "Metal selector option 1 present");
  assert.ok(html.includes("Rose Gold"), "Metal selector option 2 present");
  assert.ok(html.includes("Platinum 950"), "Metal selector option 3 present");
  assert.ok(html.includes("White Gold"), "Metal selector option 4 present");
  assert.ok(html.includes('id="overview"'), "Overview section anchor must exist");
  assert.ok(html.includes("Sub-Surface Refraction"), "Overview heading present");
  assert.ok(html.includes("Accurate Spectral Fire"), "Optical analysis point 1 present");
  assert.ok(html.includes("Physical Diamond Refraction (Abbe 58.6)"), "Diamond optical card present");
  assert.ok(html.includes('id="features"'), "Features section anchor must exist");
  assert.ok(html.includes("Ray-Traced Spectral Dispersion"), "Feature 1 present");
  assert.ok(html.includes("Precious Metal Alloys"), "Feature 2 present");
  assert.ok(html.includes("Interactive Diamond Cuts"), "Feature 3 present");
  assert.ok(html.includes("Studio Lighting Presets"), "Feature 4 present");
  assert.ok(html.includes("Parametric Carat Sizing"), "Feature 5 present");
  assert.ok(html.includes("4K Studio Snapshot Export"), "Feature 6 present");
  assert.ok(html.includes('id="showcase"'), "Showcase section anchor must exist");
  assert.ok(html.includes("Classic Solitaire"), "Showcase item 1 present");
  assert.ok(html.includes("Halo Setting"), "Showcase item 2 present");
  assert.ok(html.includes("Gemstone Cluster"), "Showcase item 3 present");
  assert.ok(html.includes('id="benefits"'), "Benefits section anchor must exist");
  assert.ok(html.includes("60 FPS"), "Metric 60 FPS present");
  assert.ok(html.includes("Abbe 58.6"), "Abbe number metric present");
  assert.ok(html.includes("3.4x"), "Conversion uplift metric present");
  assert.ok(html.includes("100%"), "Material fidelity metric present");
  assert.ok(html.includes('id="use-cases"'), "Use cases section anchor must exist");
  assert.ok(html.includes("Bespoke Atelier Consultations"), "Use case 1 present");
  assert.ok(html.includes("Custom Engagement Ring Builders"), "Use case 2 present");
  assert.ok(html.includes("Certified Diamond Visualizer"), "Use case 3 present");
  assert.ok(html.includes("In-Store Interactive Kiosks"), "Use case 4 present");
  assert.ok(html.includes('id="specs"'), "Specs section anchor must exist");
  assert.ok(html.includes("Three.js WebGPU / DiamondPlugin"), "Specs renderer present");
  assert.ok(html.includes("Cauchy equation with Abbe coefficient (V = 58.6)"), "Specs shader present");
  ["overview", "features", "showcase", "use-cases", "benefits", "specs"].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), "Header Explore Demo CTA present");
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), "Hero Primary CTA present");
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), "Pre-Footer CTA present");
  assert.ok(html.includes('href="/apps/jewelry-configurator/index.html#demo"'), "CTA must link to jewelry demo route");
  ["violet", "indigo", "orchid"].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React24.createElement(JewelryLandingPage, {
        onExploreDemo: () => {
        },
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});
test("Box Configurator Landing Page Architecture & QA Verification", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const assets = [
    "public/logos/box.png",
    "public/logos/trikomi.png"
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 100, `Asset ${asset} must have valid content`);
  });
  const html = renderToStaticMarkup(
    React24.createElement(BoxLandingPage, {
      onExploreDemo: () => {
      },
      exploreDemoHref: "/apps/box-configurator/index.html#demo",
      theme: "indigo"
    })
  );
  assert.ok(html.includes("Box Configurator"), "Title must be Box Configurator");
  assert.ok(html.includes("Parametric 3D Dieline Engine"), "Badge must specify dieline engine");
  assert.ok(html.includes("Parametric 3D Packaging Design &amp; Real-Time Dieline Studio"), "Hero title present");
  assert.ok(html.includes("vs-box-hero-stage"), "Hero box stage must be rendered");
  assert.ok(html.includes("Width: 220mm"), "Dimension chip Width present");
  assert.ok(html.includes("Height: 160mm"), "Dimension chip Height present");
  assert.ok(html.includes("Depth: 75mm"), "Dimension chip Depth present");
  assert.ok(html.includes("Interactive Fold Sequence"), "Slider label present");
  assert.ok(html.includes("MAILER BOX"), "Template button 1 present");
  assert.ok(html.includes("TUCK END"), "Template button 2 present");
  assert.ok(html.includes("OPEN TRAY"), "Template button 3 present");
  assert.ok(html.includes('id="overview"'), "Overview section anchor must exist");
  assert.ok(html.includes("Precision Carton Kinematics"), "Overview heading present");
  assert.ok(html.includes("FEFCO Standard Vector"), "Dieline chip present");
  assert.ok(html.includes("Side A"), "Panel label Side A present");
  assert.ok(html.includes("Front Panel"), "Panel label Front Panel present");
  assert.ok(html.includes("Automatic Flap &amp; Tab Grading"), "Highlight 1 present");
  assert.ok(html.includes('id="features"'), "Features section anchor must exist");
  assert.ok(html.includes("Real-Time Carton Kinematics"), "Feature 1 present");
  assert.ok(html.includes("Interactive 2D Decal Projection"), "Feature 2 present");
  assert.ok(html.includes("Standard Packaging Library"), "Feature 3 present");
  assert.ok(html.includes("Production Vector Dieline Export"), "Feature 4 present");
  assert.ok(html.includes("Instant Dimension Scaling"), "Feature 5 present");
  assert.ok(html.includes("Substrate &amp; Foil Shaders"), "Feature 6 present");
  assert.ok(html.includes('id="showcase"'), "Showcase section anchor must exist");
  assert.ok(html.includes("E-Commerce Mailer"), "Showcase item 1 present");
  assert.ok(html.includes("Reverse Tuck End"), "Showcase item 2 present");
  assert.ok(html.includes("Display Tray"), "Showcase item 3 present");
  assert.ok(html.includes('id="benefits"'), "Benefits section anchor must exist");
  assert.ok(html.includes("0 sec"), "Calculation delay metric present");
  assert.ok(html.includes("100%"), "Vector accuracy metric present");
  assert.ok(html.includes("60 FPS"), "Folding simulation metric present");
  assert.ok(html.includes("4+ Formats"), "Production outputs metric present");
  assert.ok(html.includes('id="use-cases"'), "Use cases section anchor must exist");
  assert.ok(html.includes("Custom Branded Mailers"), "Use case 1 present");
  assert.ok(html.includes("Reverse Tuck Folding Cartons"), "Use case 2 present");
  assert.ok(html.includes("Point-of-Sale Counter Trays"), "Use case 3 present");
  assert.ok(html.includes("Direct CNC Die-Cutter Export"), "Use case 4 present");
  assert.ok(html.includes('id="specs"'), "Specs section anchor must exist");
  assert.ok(html.includes("@trikomi/core/box parametric node graph"), "Specs kernel present");
  assert.ok(html.includes("PDF (Vector), SVG, DXF (AutoCAD / CNC)"), "Specs formats present");
  ["overview", "features", "showcase", "use-cases", "benefits", "specs"].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), "Header Explore Demo CTA present");
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), "Hero Primary CTA present");
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), "Pre-Footer CTA present");
  assert.ok(html.includes('href="/apps/box-configurator/index.html#demo"'), "CTA must link to box demo route");
  ["violet", "indigo", "orchid"].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React24.createElement(BoxLandingPage, {
        onExploreDemo: () => {
        },
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});
test("360 Virtual Tour Landing Page Architecture & QA Verification", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const assets = [
    "public/logos/360.png",
    "public/logos/trikomi.png"
  ];
  assets.forEach((asset) => {
    const full = path.resolve(process.cwd(), asset);
    assert.ok(fs.existsSync(full), `Asset ${asset} must exist on disk`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 100, `Asset ${asset} must have valid content`);
  });
  const html = renderToStaticMarkup(
    React24.createElement(TourLandingPage, {
      onExploreDemo: () => {
      },
      exploreDemoHref: "/apps/360tour/index.html#/dashboard",
      theme: "violet"
    })
  );
  assert.ok(html.includes("360\xB0 Virtual Tour"), "Title must be 360\xB0 Virtual Tour");
  assert.ok(html.includes("Three.js Spherical Panorama Engine"), "Badge must specify spherical engine");
  assert.ok(html.includes("Immersive 360\xB0 Virtual Tour Studio &amp; Autonomous Web Viewer"), "Hero title present");
  assert.ok(html.includes("vs-tour-hero-stage"), "Hero tour stage must be rendered");
  assert.ok(html.includes("Auto-Rotate: 60 FPS"), "Auto-rotate indicator present");
  assert.ok(html.includes("Teleport to Terrace"), "Hotspot pin 1 present");
  assert.ok(html.includes("Fountain Audio Node"), "Hotspot pin 2 present");
  assert.ok(html.includes("Suite Amenities Info"), "Hotspot pin 3 present");
  assert.ok(html.includes("Heading: 240\xB0 SW"), "Compass heading present");
  assert.ok(html.includes("LOBBY"), "Scene button 1 present");
  assert.ok(html.includes("SUITE"), "Scene button 2 present");
  assert.ok(html.includes("ROOFTOP"), "Scene button 3 present");
  assert.ok(html.includes('id="overview"'), "Overview section anchor must exist");
  assert.ok(html.includes("Precision Panoramic Spherical Mapping"), "Overview heading present");
  assert.ok(html.includes("Equirectangular 2:1"), "Sphere chip present");
  assert.ok(html.includes("Sub-Frame Spherical Interpolation"), "Highlight 1 present");
  assert.ok(html.includes("Zero-Cloud Private Storage"), "Highlight 2 present");
  assert.ok(html.includes('id="features"'), "Features section anchor must exist");
  assert.ok(html.includes("Equirectangular Spherical Engine"), "Feature 1 present");
  assert.ok(html.includes("Interactive Hotspot Node Graph"), "Feature 2 present");
  assert.ok(html.includes("Offline OPFS Client Storage"), "Feature 3 present");
  assert.ok(html.includes("Autonomous Standalone ZIP Export"), "Feature 4 present");
  assert.ok(html.includes("Directional Spatial Audio"), "Feature 5 present");
  assert.ok(html.includes("Custom Nadir &amp; Floor Concealment"), "Feature 6 present");
  assert.ok(html.includes('id="showcase"'), "Showcase section anchor must exist");
  assert.ok(html.includes("Luxury Architecture"), "Showcase item 1 present");
  assert.ok(html.includes("Hospitality Suites"), "Showcase item 2 present");
  assert.ok(html.includes("Museum Exhibition"), "Showcase item 3 present");
  assert.ok(html.includes('id="benefits"'), "Benefits section anchor must exist");
  assert.ok(html.includes("60 FPS"), "Panorama motion metric present");
  assert.ok(html.includes("0 MB"), "Zero cloud storage fees metric present");
  assert.ok(html.includes("&lt; 1 sec"), "Scene switch latency metric present");
  assert.ok(html.includes("1-Click"), "Autonomous export metric present");
  assert.ok(html.includes('id="use-cases"'), "Use cases section anchor must exist");
  assert.ok(html.includes("Virtual Open Houses &amp; Villas"), "Use case 1 present");
  assert.ok(html.includes("Interactive Hotel Suite Walkthroughs"), "Use case 2 present");
  assert.ok(html.includes("Digitized Heritage &amp; Art Tours"), "Use case 3 present");
  assert.ok(html.includes("BIM Facility Inspection Walks"), "Use case 4 present");
  assert.ok(html.includes('id="specs"'), "Specs section anchor must exist");
  assert.ok(html.includes("Inverted normal equirectangular sphere (60 segments)"), "Specs geometry present");
  assert.ok(html.includes("Origin Private File System (OPFS) + idb-keyval"), "Specs storage present");
  ["overview", "features", "showcase", "use-cases", "benefits", "specs"].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), "Header Explore Demo CTA present");
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), "Hero Primary CTA present");
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), "Pre-Footer CTA present");
  assert.ok(html.includes('href="/apps/360tour/index.html#/dashboard"'), "CTA must link to tour dashboard route");
  ["violet", "indigo", "orchid"].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React24.createElement(TourLandingPage, {
        onExploreDemo: () => {
        },
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});
test("Eyewear Try-On Landing Page Architecture & QA Verification", () => {
  let demoLaunched = false;
  const html = renderToStaticMarkup(
    React24.createElement(EyewearLandingPage, {
      onExploreDemo: () => {
        demoLaunched = true;
      },
      exploreDemoHref: "/apps/eyewear-tryon/index.html#demo",
      theme: "violet"
    })
  );
  assert.ok(html.includes("Eyewear Try-On"), "Product title must be Eyewear Try-On");
  assert.ok(html.includes("WebGPU AR Facial Fitting"), "Product badge must be WebGPU AR Facial Fitting");
  assert.ok(html.includes('src="/logos/eyewear.png"'), "Brand logo must be eyewear.png");
  assert.ok(html.includes("vs-product-landing-page"), "Must use landing page container class");
  assert.ok(html.includes("vs-ui-root"), "Must include vs-ui-root class for design tokens");
  assert.ok(html.includes('data-accent="violet"'), "Default theme must be violet");
  assert.ok(html.includes("vs-eyewear-hero-stage"), "Hero eyewear stage must be rendered");
  assert.ok(html.includes("Tracking: 478 Landmark Lock"), "Landmark tracking chip present");
  assert.ok(html.includes("PD: 63.5 mm"), "PD gauge chip present");
  assert.ok(html.includes("Occluder: ACTIVE"), "Cranial occluder chip present");
  assert.ok(html.includes("Aviator Classic"), "Aviator silhouette button present");
  assert.ok(html.includes("Wayfarer Style"), "Wayfarer silhouette button present");
  assert.ok(html.includes("Clear AR"), "Lens coating button present");
  assert.ok(html.includes("Brushed Titanium"), "Frame material button present");
  assert.ok(html.includes('id="overview"'), "Overview section anchor must exist");
  assert.ok(html.includes("Clinical Precision Meets High-Fashion 3D Realism"), "Overview heading present");
  assert.ok(html.includes("Cranial Depth &amp; IPD Geometry"), "Anatomical card present");
  assert.ok(html.includes("478"), "Landmark count metric present");
  assert.ok(html.includes('id="features"'), "Features section anchor must exist");
  assert.ok(html.includes("478-Point 3D Facial Landmarks"), "Feature 1 present");
  assert.ok(html.includes("Automated Pupillary Distance (PD)"), "Feature 2 present");
  assert.ok(html.includes("Full Cranial 3D Head Occluder"), "Feature 3 present");
  assert.ok(html.includes("PBR Optics &amp; Anti-Reflective Shaders"), "Feature 4 present");
  assert.ok(html.includes("6 Curated Designer Silhouettes"), "Feature 5 present");
  assert.ok(html.includes("Universal Zero-Plugin Web Engine"), "Feature 6 present");
  assert.ok(html.includes('id="showcase"'), "Showcase section anchor must exist");
  assert.ok(html.includes("Optical Prescription Fitting"), "Showcase item 1 present");
  assert.ok(html.includes("Designer Sunglasses &amp; Coatings"), "Showcase item 2 present");
  assert.ok(html.includes("Performance Sports Wraps"), "Showcase item 3 present");
  assert.ok(html.includes('id="benefits"'), "Benefits section anchor must exist");
  assert.ok(html.includes("Depth Pass"), "Occlusion metric present");
  assert.ok(html.includes("\xB10.8 mm"), "PD accuracy metric present");
  assert.ok(html.includes("&lt; 16 ms"), "Latency metric present");
  assert.ok(html.includes('id="use-cases"'), "Use cases section anchor must exist");
  assert.ok(html.includes("Direct-to-Consumer (D2C) Optical"), "Use case 1 present");
  assert.ok(html.includes("Luxury Fashion &amp; Designer Houses"), "Use case 2 present");
  assert.ok(html.includes("Telehealth &amp; Digital Optometry"), "Use case 3 present");
  assert.ok(html.includes("Custom Bespoke &amp; 3D Printed Eyewear"), "Use case 4 present");
  assert.ok(html.includes('id="specs"'), "Specs section anchor must exist");
  assert.ok(html.includes("MediaPipe Vision Tasks (478 3D landmarks, GPU accelerated)"), "Specs tracking present");
  assert.ok(html.includes("head_occluder.obj"), "Specs occluder present");
  ["overview", "features", "showcase", "use-cases", "benefits", "specs"].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), "Header Explore Demo CTA present");
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), "Hero Primary CTA present");
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), "Pre-Footer CTA present");
  assert.ok(html.includes('href="/apps/eyewear-tryon/index.html#demo"'), "CTA must link to eyewear demo route");
  ["violet", "indigo", "orchid"].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React24.createElement(EyewearLandingPage, {
        onExploreDemo: () => {
        },
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});
test("3D Viewer Landing Page Architecture & QA Verification", () => {
  let demoLaunched = false;
  const html = renderToStaticMarkup(
    React24.createElement(ViewerLandingPage, {
      onExploreDemo: () => {
        demoLaunched = true;
      },
      exploreDemoHref: "/apps/viewer/index.html#demo",
      theme: "indigo"
    })
  );
  assert.ok(html.includes("3D Viewer"), "Product title must be 3D Viewer");
  assert.ok(html.includes("WebGPU Engine &amp; Post-Processing"), "Product badge must be WebGPU Engine & Post-Processing");
  assert.ok(html.includes("VictorShell"), "Brand name must be VictorShell");
  assert.ok(html.includes("vs-product-landing-template"), "Must use landing page container class");
  assert.ok(html.includes("vs-ui-root"), "Must include vs-ui-root class for design tokens");
  assert.ok(html.includes('data-accent="indigo"'), "Default theme must be indigo");
  assert.ok(html.includes("vs-viewer-hero-stage"), "Hero viewer stage must be rendered");
  assert.ok(html.includes("Three.js WebGPU Active"), "WebGPU active indicator present");
  assert.ok(html.includes("60 FPS"), "FPS metric present");
  assert.ok(html.includes("PBR"), "PBR mode button present");
  assert.ok(html.includes("WIREFRAME"), "Wireframe mode button present");
  assert.ok(html.includes("STUDIO"), "Studio mode button present");
  assert.ok(html.includes("DIAMOND"), "Diamond mode button present");
  assert.ok(html.includes("Point-to-Point 3D Measurement"), "Measurement pin present");
  assert.ok(html.includes("8thWall SLAM Ready"), "WebAR pin present");
  assert.ok(html.includes('id="overview"'), "Overview section anchor must exist");
  assert.ok(html.includes("Cinema-Grade Shading, Kinematics &amp; Post-Processing"), "Overview heading present");
  assert.ok(html.includes("Real-Time PBR Channel Pipeline"), "PBR pipeline card title present");
  assert.ok(html.includes("ThreeViewer.ts"), "ThreeViewer chip present");
  assert.ok(html.includes("Physically Based Shading (PBR)"), "Highlight 1 present");
  assert.ok(html.includes("Point-to-Point 3D Measurement Tool"), "Highlight 2 present");
  assert.ok(html.includes("Multi-Track Kinematics Timeline"), "Highlight 3 present");
  assert.ok(html.includes('id="features"'), "Features section anchor must exist");
  assert.ok(html.includes("WebGPU &amp; WebGL2 Hybrid Pipeline"), "Feature 1 present");
  assert.ok(html.includes("PBR Material &amp; Texture Editor"), "Feature 2 present");
  assert.ok(html.includes("Cinematic Post-Processing Stack"), "Feature 3 present");
  assert.ok(html.includes("Precision 3D Measurement Overlay"), "Feature 4 present");
  assert.ok(html.includes("Multi-Track Animation Timeline"), "Feature 5 present");
  assert.ok(html.includes("Instant 8thWall SLAM WebAR"), "Feature 6 present");
  assert.ok(html.includes('id="showcase"'), "Showcase section anchor must exist");
  assert.ok(html.includes("PBR Realistic Studio"), "Showcase item 1 present");
  assert.ok(html.includes("Mesh &amp; Wireframe"), "Showcase item 2 present");
  assert.ok(html.includes("Kinematics Timeline"), "Showcase item 3 present");
  assert.ok(html.includes("Augmented Reality"), "Showcase item 4 present");
  assert.ok(html.includes('id="benefits"'), "Benefits section anchor must exist");
  assert.ok(html.includes("60 FPS"), "60 FPS metric present");
  assert.ok(html.includes("&lt; 50ms"), "Latency metric present");
  assert.ok(html.includes("$0 / hr"), "GPU cost metric present");
  assert.ok(html.includes("4K UHD"), "Resolution metric present");
  assert.ok(html.includes('id="use-cases"'), "Use cases section anchor must exist");
  assert.ok(html.includes("Interactive 3D Product Showrooms"), "Use case 1 present");
  assert.ok(html.includes("Mechanical Assembly &amp; Tolerances"), "Use case 2 present");
  assert.ok(html.includes("Digital Asset &amp; Rig Validation"), "Use case 3 present");
  assert.ok(html.includes("Ray-Traced Spectral Dispersion"), "Use case 4 present");
  assert.ok(html.includes('id="specs"'), "Specs section anchor must exist");
  assert.ok(html.includes("Three.js WebGPU with WebGL2 Fallback"), "Specs renderer present");
  assert.ok(html.includes("@trikomi/core &amp; ThreeViewer"), "Specs SDK present");
  assert.ok(html.includes("BloomPlugin with luminance thresholding"), "Specs bloom present");
  assert.ok(html.includes("Screen Space Reflections (SSR) &amp; SSAO / SSGI"), "Specs SSR present");
  assert.ok(html.includes("Physical Depth of Field (DOF) with focal distance"), "Specs DOF present");
  assert.ok(html.includes("MeasurementPlugin point-to-point vertex raycaster"), "Specs measurement present");
  assert.ok(html.includes("Niantic 8thWall SLAM SDK (Surface Tracking)"), "Specs WebAR present");
  ["overview", "features", "showcase", "use-cases", "benefits", "specs"].forEach((target) => {
    assert.ok(html.includes(`href="#${target}"`), `Navigation link to #${target} must exist`);
    assert.ok(html.includes(`id="${target}"`), `Section with id="${target}" must exist`);
  });
  assert.ok(html.includes('data-testid="explore-demo-btn"'), "Header Explore Demo CTA present");
  assert.ok(html.includes('data-testid="hero-explore-demo-btn"'), "Hero Primary CTA present");
  assert.ok(html.includes('data-testid="cta-explore-demo-btn"'), "Pre-Footer CTA present");
  assert.ok(html.includes('href="/apps/viewer/index.html#demo"'), "CTA must link to viewer demo route");
  ["violet", "indigo", "orchid"].forEach((theme) => {
    const themeMarkup = renderToStaticMarkup(
      React24.createElement(ViewerLandingPage, {
        onExploreDemo: () => {
        },
        theme
      })
    );
    assert.ok(themeMarkup.includes(`data-accent="${theme}"`), `Theme ${theme} must apply data-accent="${theme}"`);
  });
});
test("Responsive Header and Navbar QA Verification across all 7 Landing Pages", () => {
  const pages = [
    { name: "Sportswear", component: SportswearLandingPage },
    { name: "Face Mocap", component: FaceMocapLandingPage },
    { name: "Jewelry", component: JewelryLandingPage },
    { name: "Box", component: BoxLandingPage },
    { name: "360 Tour", component: TourLandingPage },
    { name: "Eyewear Try-On", component: EyewearLandingPage },
    { name: "3D Viewer", component: ViewerLandingPage }
  ];
  for (const { name, component } of pages) {
    const html = renderToStaticMarkup(
      React24.createElement(component, {
        onExploreDemo: () => {
        },
        exploreDemoHref: "#demo"
      })
    );
    assert.ok(html.includes("vs-landing-header"), `${name} landing page must render vs-landing-header`);
    assert.ok(html.includes("vs-landing-header__container"), `${name} must render vs-landing-header__container`);
    assert.ok(html.includes("vs-landing-header__brand-group"), `${name} must render vs-landing-header__brand-group`);
    assert.ok(html.includes("vs-landing-header__brand-meta"), `${name} must render brand-meta for responsive truncation`);
    assert.ok(html.includes("vs-landing-header__brand-title"), `${name} must render brand-title`);
    assert.ok(html.includes("vs-landing-header__product-title"), `${name} must render product-title`);
    assert.ok(html.includes("vs-landing-header__nav-wrapper"), `${name} must render desktop nav wrapper`);
    assert.ok(html.includes("vs-landing-nav--horizontal"), `${name} must render horizontal nav list`);
    assert.ok(html.includes("vs-landing-header__cta-btn"), `${name} must render CTA button`);
    assert.ok(html.includes("vs-landing-header__cta-text--full"), `${name} must render full label span for desktop/laptop`);
    assert.ok(html.includes("vs-landing-header__cta-text--short"), `${name} must render compact short label span for mobile`);
    assert.ok(html.includes("vs-landing-header__mobile-toggle"), `${name} must render mobile toggle button`);
    assert.ok(html.includes('data-testid="mobile-nav-toggle"'), `${name} must have testid for mobile toggle`);
  }
  const css = readFileSync(new URL("../packages/ui-kit/src/styles/landing.css", import.meta.url), "utf-8");
  assert.ok(css.includes("@media (max-width: 1140px)"), "CSS must include 1140px breakpoint collapsing nav to mobile toggle");
  assert.ok(css.includes("@media (max-width: 860px)"), "CSS must include 860px tablet breakpoint");
  assert.ok(css.includes("@media (max-width: 520px)"), "CSS must include 520px mobile breakpoint");
  assert.ok(css.includes("@media (max-width: 360px)"), "CSS must include 360px ultra-compact mobile breakpoint");
  assert.ok(css.includes(".vs-landing-header__cta-text--short"), "CSS must define styles for compact CTA text");
  assert.ok(css.includes(".vs-landing-header__cta-text--full"), "CSS must toggle full CTA text off on narrow mobile");
  assert.ok(css.includes("max-width: 100vw"), "Header must constrain max-width to 100vw");
});
