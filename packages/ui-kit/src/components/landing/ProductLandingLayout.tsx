import React from 'react';
import { VictorShellThemeProvider, useOptionalVictorShellTheme, type VictorShellAccent } from '../../theme/ThemeProvider';
import { LandingHeader } from './LandingHeader';
import { LandingFooter, type LandingFooterColumn } from './LandingFooter';
import type { LandingNavLink } from './LandingNav';

export interface ProductLandingLayoutProps {
  /** The specific product title. */
  productTitle: string;
  /** Optional badge text. */
  productBadge?: string;
  /** Product tagline. */
  productTagline?: string;
  /** Main brand name. Defaults to 'VictorShell'. */
  brandName?: string;
  /** Brand logo element or custom icon. */
  brandLogo?: React.ReactNode;
  /** Navigation links for this product page. */
  navLinks?: LandingNavLink[];
  /** Mandatory callback triggered when clicking 'Explore Demo'. */
  onExploreDemo: () => void;
  /** Explore demo button text. Defaults to 'Explore Demo'. */
  exploreDemoLabel?: string;
  /** Active theme accent: 'violet' | 'indigo' | 'orchid'. */
  theme?: VictorShellAccent;
  /** Callback on theme switch. */
  onThemeChange?: (theme: VictorShellAccent) => void;
  /** Whether to show the theme switcher in the header. Defaults to true. */
  showThemeSwitcher?: boolean;
  /** Whether to show the Light/Dark theme mode toggle. Defaults to true. */
  showThemeModeToggle?: boolean;
  /** Footer custom link columns. */
  footerLinkColumns?: LandingFooterColumn[];
  /** Secondary action element in header (e.g. documentation link). */
  secondaryHeaderAction?: React.ReactNode;
  /** Page content children. */
  children: React.ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

export const ProductLandingLayout: React.FC<ProductLandingLayoutProps> = ({
  productTitle,
  productBadge,
  productTagline,
  brandName = 'VictorShell',
  brandLogo,
  navLinks = [],
  onExploreDemo,
  exploreDemoLabel = 'Explore Demo',
  theme = 'violet',
  onThemeChange,
  showThemeSwitcher = true,
  showThemeModeToggle = true,
  footerLinkColumns,
  secondaryHeaderAction,
  children,
  className = ''
}) => {
  const existingTheme = useOptionalVictorShellTheme();

  const content = (
    <div className={`vs-product-landing-page ${className}`.trim()} data-testid="product-landing-layout">
      {/* Ambient Futuristic Background Gradients (Ice Blue & Soft Lavender) */}
      <div className="vs-landing-ambient" aria-hidden="true">
        <div className="vs-landing-ambient__orb vs-landing-ambient__orb--ice-blue" />
        <div className="vs-landing-ambient__orb vs-landing-ambient__orb--lavender" />
        <div className="vs-landing-ambient__orb vs-landing-ambient__orb--hero-glow" />
        <div className="vs-landing-ambient__bubble vs-landing-ambient__bubble--hero-right" />
        <div className="vs-landing-ambient__bubble vs-landing-ambient__bubble--hero-left" />
        <div className="vs-landing-ambient__bubble vs-landing-ambient__bubble--bottom-right" />
        <div className="vs-landing-ambient__grid" />
      </div>

      {/* Shared Sticky Frosted Glass Header */}
      <LandingHeader
        productTitle={productTitle}
        productBadge={productBadge}
        brandName={brandName}
        brandLogo={brandLogo}
        navLinks={navLinks}
        onExploreDemo={onExploreDemo}
        exploreDemoLabel={exploreDemoLabel}
        showThemeSwitcher={showThemeSwitcher}
        showThemeModeToggle={showThemeModeToggle}
        onThemeChange={onThemeChange}
        secondaryAction={secondaryHeaderAction}
      />

      {/* Landing Page Body */}
      <main className="vs-landing-main" role="main">
        {children}
      </main>

      {/* Shared Futuristic Frosted Glass Footer */}
      <LandingFooter
        productTitle={productTitle}
        productTagline={productTagline}
        brandName={brandName}
        onExploreDemo={onExploreDemo}
        exploreDemoLabel={exploreDemoLabel}
        linkColumns={footerLinkColumns}
      />
    </div>
  );

  if (existingTheme) {
    return content;
  }

  return (
    <VictorShellThemeProvider initialAccent={theme}>
      {content}
    </VictorShellThemeProvider>
  );
};
