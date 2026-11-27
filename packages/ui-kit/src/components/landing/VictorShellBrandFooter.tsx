import React from 'react';
import victorshellLogoUrl from '../../assets/victorshell-logo.png';

export interface VictorShellSocialLink {
  id: 'linkedin' | 'github' | 'youtube' | 'twitter' | 'facebook';
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const VICTORSHELL_SOCIAL_LINKS: readonly VictorShellSocialLink[] = [
  {
    id: 'linkedin',
    label: 'VictorShell on LinkedIn',
    href: 'https://www.linkedin.com/company/victorshelltech',
    icon: (
      <svg className="vs-brand-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    )
  },
  {
    id: 'github',
    label: 'VictorShell on GitHub',
    href: 'https://github.com/victorshell-3d',
    icon: (
      <svg className="vs-brand-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
      </svg>
    )
  },
  {
    id: 'youtube',
    label: 'VictorShell on YouTube',
    href: 'https://www.youtube.com/channel/UCGsg66t7Biam88O0HvbqWFA',
    icon: (
      <svg className="vs-brand-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
      </svg>
    )
  },
  {
    id: 'twitter',
    label: 'VictorShell on X (Twitter)',
    href: 'https://twitter.com/victorshelltech',
    icon: (
      <svg className="vs-brand-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    id: 'facebook',
    label: 'VictorShell on Facebook',
    href: 'https://www.facebook.com/victorshelltech',
    icon: (
      <svg className="vs-brand-footer__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
      </svg>
    )
  }
];

export interface VictorShellBrandFooterProps {
  /** Optional HTML id for footer landmark. */
  id?: string;
  /** Accessible landmark label. */
  ariaLabel?: string;
  /** Additional outer footer class name (e.g. 'tk-sw-footer'). */
  className?: string;
  /** Inner container class name (e.g. 'tk-sw-container'). */
  containerClassName?: string;
  /** Heading displayed above the social icon strip. */
  socialHeading?: string;
  /** Exact copyright statement displayed below the logo. */
  copyrightText?: string;
  /** data-testid prefix overrides for test isolation. */
  footerTestId?: string;
  logoLinkTestId?: string;
  logoTestId?: string;
  copyrightTestId?: string;
  socialTestIdPrefix?: string;
}

export const VictorShellBrandFooter: React.FC<VictorShellBrandFooterProps> = ({
  id = 'footer',
  ariaLabel = 'Site Footer',
  className = '',
  containerClassName = '',
  socialHeading = 'Connect with VictorShell',
  copyrightText = '© 2026 VictorShell. All rights reserved.',
  footerTestId = 'victorshell-footer',
  logoLinkTestId = 'victorshell-footer-logo-link',
  logoTestId = 'victorshell-footer-logo',
  copyrightTestId = 'victorshell-footer-copyright',
  socialTestIdPrefix = 'victorshell-footer-social'
}) => {
  return (
    <footer
      id={id}
      className={`vs-brand-footer ${className}`.trim()}
      role="contentinfo"
      aria-label={ariaLabel}
      data-testid={footerTestId}
    >
      <div className={containerClassName || 'vs-brand-footer__container'}>
        <div className="vs-brand-footer__inner">
          <div className="vs-brand-footer__brand">
            <a
              href="https://victorshell.com"
              target="_blank"
              rel="noopener noreferrer"
              className="vs-brand-footer__logo-link"
              aria-label="VictorShell Official Website"
              data-testid={logoLinkTestId}
            >
              <img
                src={victorshellLogoUrl}
                alt="VictorShell"
                width={369}
                height={84}
                className="vs-brand-footer__logo"
                data-testid={logoTestId}
              />
            </a>
            <p className="vs-brand-footer__copyright" data-testid={copyrightTestId}>
              {copyrightText}
            </p>
          </div>

          <div className="vs-brand-footer__social-wrap">
            <span className="vs-brand-footer__social-label">{socialHeading}</span>
            <nav className="vs-brand-footer__social-list" aria-label="VictorShell official social links">
              {VICTORSHELL_SOCIAL_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vs-brand-footer__social-link"
                  aria-label={item.label}
                  title={item.label}
                  data-testid={`${socialTestIdPrefix}-${item.id}`}
                >
                  {item.icon}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VictorShellBrandFooter;
