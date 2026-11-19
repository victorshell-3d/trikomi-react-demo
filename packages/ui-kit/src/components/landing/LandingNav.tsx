import React from 'react';

export interface LandingNavLink {
  id?: string;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  external?: boolean;
  badge?: string;
}

export interface LandingNavProps {
  links: LandingNavLink[];
  orientation?: 'horizontal' | 'vertical';
  onLinkClick?: (link: LandingNavLink) => void;
  className?: string;
  ariaLabel?: string;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  links,
  orientation = 'horizontal',
  onLinkClick,
  className = '',
  ariaLabel = 'Product navigation'
}) => {
  return (
    <nav
      className={`vs-landing-nav vs-landing-nav--${orientation} ${className}`.trim()}
      aria-label={ariaLabel}
      role="navigation"
    >
      <ul className="vs-landing-nav__list">
        {links.map((link, idx) => {
          const isLinkActive = Boolean(link.active);
          const itemKey = link.id || `${link.label}-${idx}`;

          const handleClick = (e: React.MouseEvent) => {
            if (link.onClick) {
              e.preventDefault();
              link.onClick();
            }
            if (onLinkClick) {
              onLinkClick(link);
            }
          };

          return (
            <li key={itemKey} className="vs-landing-nav__item">
              <a
                href={link.href || '#'}
                onClick={handleClick}
                className={`vs-landing-nav__link ${isLinkActive ? 'is-active' : ''}`}
                aria-current={isLinkActive ? 'page' : undefined}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                <span className="vs-landing-nav__label">{link.label}</span>
                {link.badge && (
                  <span className="vs-landing-nav__badge">{link.badge}</span>
                )}
                {isLinkActive && (
                  <span className="vs-landing-nav__indicator" aria-hidden="true" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
