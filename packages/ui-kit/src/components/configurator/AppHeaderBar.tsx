import React, { useEffect, useState, type ReactNode, type CSSProperties } from 'react';

export interface AppHeaderBarProps {
  brandTitle?: ReactNode;
  productTitle?: ReactNode;
  brandLogo?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  theme?: 'violet' | 'indigo' | 'orchid';
  onThemeChange?: (theme: 'violet' | 'indigo' | 'orchid') => void;
  showThemeSwitcher?: boolean;
  statusBadge?: ReactNode;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const AppHeaderBar: React.FC<AppHeaderBarProps> = ({
  brandTitle = 'TRIKOMI',
  productTitle,
  brandLogo,
  onBack,
  backLabel = '← Back to Overview',
  theme = 'violet',
  onThemeChange,
  showThemeSwitcher = true,
  statusBadge,
  actions,
  className = '',
  style
}) => {
  const [activeTheme, setActiveTheme] = useState<'violet' | 'indigo' | 'orchid'>(theme);

  useEffect(() => {
    setActiveTheme(theme);
  }, [theme]);

  const handleThemeSelect = (newTheme: 'violet' | 'indigo' | 'orchid') => {
    setActiveTheme(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'violet') {
        document.documentElement.removeAttribute('data-accent');
      } else {
        document.documentElement.setAttribute('data-accent', newTheme);
      }
    }
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <header
      className={`vs-app-header-bar ${className}`.trim()}
      role="banner"
      style={style}
    >
      <div className="vs-app-header-bar__inner">
        {/* Left: Back Button & Branding */}
        <div className="vs-app-header-bar__left">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="vs-app-header-back-btn"
              aria-label={typeof backLabel === 'string' ? backLabel : 'Back to Overview'}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="vs-app-header-back-btn__label">{backLabel}</span>
            </button>
          )}

          <div className="vs-app-header-brand">
            {brandLogo && <span className="vs-app-header-brand__logo">{brandLogo}</span>}
            <span className="vs-app-header-brand__title">{brandTitle}</span>
            {productTitle && (
              <>
                <span className="vs-app-header-brand__divider" aria-hidden="true">/</span>
                <span className="vs-app-header-brand__subtitle">{productTitle}</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Live Status Badge / Telemetry */}
        {statusBadge && (
          <div className="vs-app-header-bar__center" role="status" aria-live="polite">
            {statusBadge}
          </div>
        )}

        {/* Right: Theme Switcher & Actions */}
        <div className="vs-app-header-bar__right">
          {showThemeSwitcher && (
            <div
              className="vs-app-header-theme-switcher"
              role="radiogroup"
              aria-label="Theme Accent Switcher"
            >
              <button
                type="button"
                role="radio"
                aria-checked={activeTheme === 'violet'}
                aria-label="Royal Violet Theme"
                title="Royal Violet Theme"
                className={`vs-theme-accent-btn vs-theme-accent-btn--violet ${activeTheme === 'violet' ? 'is-active' : ''}`}
                onClick={() => handleThemeSelect('violet')}
              />
              <button
                type="button"
                role="radio"
                aria-checked={activeTheme === 'indigo'}
                aria-label="Electric Indigo Theme"
                title="Electric Indigo Theme"
                className={`vs-theme-accent-btn vs-theme-accent-btn--indigo ${activeTheme === 'indigo' ? 'is-active' : ''}`}
                onClick={() => handleThemeSelect('indigo')}
              />
              <button
                type="button"
                role="radio"
                aria-checked={activeTheme === 'orchid'}
                aria-label="Orchid Glow Theme"
                title="Orchid Glow Theme"
                className={`vs-theme-accent-btn vs-theme-accent-btn--orchid ${activeTheme === 'orchid' ? 'is-active' : ''}`}
                onClick={() => handleThemeSelect('orchid')}
              />
            </div>
          )}

          {actions && <div className="vs-app-header-bar__actions">{actions}</div>}
        </div>
      </div>
    </header>
  );
};
