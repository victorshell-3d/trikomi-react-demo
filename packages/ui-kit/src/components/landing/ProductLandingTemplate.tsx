import React from 'react';
import { ProductLandingLayout } from './ProductLandingLayout';
import { LandingHero, type LandingHeroProps } from './LandingHero';
import { LandingOverview, type LandingOverviewProps } from './LandingOverview';
import { LandingFeatures, type LandingFeaturesProps } from './LandingFeatures';
import { LandingHowItWorks, type LandingHowItWorksProps } from './LandingHowItWorks';
import { LandingVisualShowcase, type LandingVisualShowcaseProps } from './LandingVisualShowcase';
import { LandingBenefits, type LandingBenefitsProps } from './LandingBenefits';
import { LandingCtaSection, type LandingCtaSectionProps } from './LandingCtaSection';
import type { LandingNavLink } from './LandingNav';

export interface ProductLandingTemplateProps {
  /** Product branding title (e.g. 'Sportswear Configurator'). */
  productTitle: string;
  /** Pill badge text displayed in header and hero. */
  productBadge?: string;
  /** Short tagline for footer and metadata. */
  productTagline?: string;
  /** Optional custom brand logo element. */
  brandLogo?: React.ReactNode;
  /** Brand identity name. Defaults to 'VictorShell'. */
  brandName?: string;
  /** Active theme accent. Defaults to 'indigo'. */
  theme?: 'violet' | 'indigo' | 'orchid';
  /** Primary callback triggered when user clicks 'Explore Demo' anywhere on the page. */
  onExploreDemo: () => void;
  /** Primary CTA button label. Defaults to 'Explore Demo'. */
  exploreDemoLabel?: string;
  /** Destination URL or anchor hash for the primary demo CTA. */
  exploreDemoHref?: string;
  /** Top navigation links. */
  navLinks?: LandingNavLink[];
  /** Props for the Hero section. */
  heroProps: Omit<LandingHeroProps, 'onExploreDemo' | 'exploreDemoLabel'> & {
    exploreDemoLabel?: string;
  };
  /** Optional props for the Product Overview deep dive section. */
  overviewProps?: LandingOverviewProps;
  /** Optional props for the Key Features section. */
  featuresProps?: LandingFeaturesProps;
  /** Optional props for the How It Works 3-step workflow section. */
  howItWorksProps?: LandingHowItWorksProps;
  /** Optional props for the Visual Showcase section. */
  showcaseProps?: LandingVisualShowcaseProps;
  /** Optional props for the Benefits & Metrics section. */
  benefitsProps?: LandingBenefitsProps;
  /** Optional props for the pre-footer CTA section. */
  ctaProps?: Partial<LandingCtaSectionProps>;
  /** Optional custom sections or content to insert before the pre-footer CTA. */
  children?: React.ReactNode;
  /** Additional CSS class names for the template wrapper. */
  className?: string;
}

/**
 * ProductLandingTemplate
 *
 * Master layout template for single-product VictorShell landing pages.
 * Ties together the Frosted Glass theme provider, ambient glow backgrounds,
 * sticky header, hero, overview, features, showcase, benefits, pre-footer CTA,
 * and single-product footer.
 */
export const ProductLandingTemplate: React.FC<ProductLandingTemplateProps> = ({
  productTitle,
  productBadge,
  productTagline,
  brandLogo,
  brandName = 'VictorShell',
  theme = 'indigo',
  onExploreDemo,
  exploreDemoLabel = 'Explore Demo',
  exploreDemoHref,
  navLinks = [],
  heroProps,
  overviewProps,
  featuresProps,
  howItWorksProps,
  showcaseProps,
  benefitsProps,
  ctaProps,
  children,
  className = ''
}) => {
  return (
    <ProductLandingLayout
      productTitle={productTitle}
      productBadge={productBadge}
      productTagline={productTagline}
      brandLogo={brandLogo}
      brandName={brandName}
      theme={theme}
      onExploreDemo={onExploreDemo}
      exploreDemoLabel={exploreDemoLabel}
      navLinks={navLinks}
      className={`vs-product-landing-template ${className}`.trim()}
    >
      {/* 1. Hero Section */}
      <LandingHero
        {...heroProps}
        onExploreDemo={onExploreDemo}
        exploreDemoLabel={heroProps.exploreDemoLabel || exploreDemoLabel}
        id={heroProps.id || 'hero'}
      />

      {/* 2. Overview Section */}
      {overviewProps && (
        <LandingOverview
          {...overviewProps}
          id={overviewProps.id || 'overview'}
        />
      )}

      {/* 3. Key Features Section */}
      {featuresProps && (
        <LandingFeatures
          {...featuresProps}
          id={featuresProps.id || 'features'}
        />
      )}

      {/* 4. How It Works 3-Step Workflow Section */}
      {howItWorksProps && (
        <LandingHowItWorks
          {...howItWorksProps}
          id={howItWorksProps.id || 'how-it-works'}
        />
      )}

      {/* 5. Visual Showcase Section */}
      {showcaseProps && (
        <LandingVisualShowcase
          {...showcaseProps}
          id={showcaseProps.id || 'showcase'}
        />
      )}

      {/* 6. Benefits & Use Cases Section */}
      {benefitsProps && (
        <LandingBenefits
          {...benefitsProps}
          id={benefitsProps.id || 'benefits'}
        />
      )}

      {/* Optional custom slot between sections and final CTA */}
      {children}

      {/* 6. High-Impact Pre-Footer Call to Action Section */}
      <LandingCtaSection
        badge={ctaProps?.badge || 'Interactive 3D Demo'}
        title={ctaProps?.title || `Experience the ${productTitle} Live`}
        description={
          ctaProps?.description ||
          `Launch the full interactive 3D studio in your browser. Powered by the @trikomi/core WebGPU engine with zero plugins or installation required.`
        }
        onExploreDemo={onExploreDemo}
        exploreDemoLabel={ctaProps?.exploreDemoLabel || exploreDemoLabel}
        exploreDemoHref={ctaProps?.exploreDemoHref || exploreDemoHref}
        secondaryCta={ctaProps?.secondaryCta}
        note={ctaProps?.note || 'Instant client-side rendering · WebGPU / WebGL2 · Responsive on all devices'}
        id={ctaProps?.id || 'cta'}
      />
    </ProductLandingLayout>
  );
};
