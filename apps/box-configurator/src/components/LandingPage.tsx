import React from 'react';
import { observer } from 'mobx-react-lite';
import { configStore } from '../store/ConfigStore';

export const LandingPage = observer(() => {
  if (!configStore.landingPageOpen) return null;

  return (
    <div className="landing-page">
      <div className="landing-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <img src="/logos/box.png" style={{ height: '48px', width: 'auto', objectFit: 'contain', marginBottom: '12px' }} alt="Box Logo" />
        <h1>Select Your Box Template</h1>
        <p>Choose one of our premium pre-engineered box designs to start customizing, or start from a blank slate with a custom setup.</p>
      </div>
      <div className="landing-grid">
        {configStore.boxTemplates.map((tpl) => {
          let category = "TUCK END";
          let svgIcon = (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          );

          if (tpl.id === 'box-open-tray') {
            category = "OPEN TRAY";
            svgIcon = (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12L2 12M22 12L18 20H6L2 12M22 12V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6" />
              </svg>
            );
          } else if (tpl.id === 'box-mailer') {
            category = "MAILER BOX";
            svgIcon = (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                <path d="M21 8l-9 6-9-6" />
                <path d="M2 8V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
              </svg>
            );
          } else if (tpl.id === 'box-custom') {
            category = "CUSTOM SETUP";
            svgIcon = (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            );
          }

          return (
            <div
              key={tpl.id}
              className="landing-card"
              onClick={() => {
                configStore.loadBoxTemplate(tpl.id);
                configStore.setLandingPageOpen(false);
              }}
            >
              <div className="landing-card-preview">
                {svgIcon}
              </div>
              <div className="landing-card-content">
                <div className="landing-card-category">{category}</div>
                <div className="landing-card-title">{tpl.name}</div>
                <div className="landing-card-desc">{tpl.description}</div>
              </div>
              <button className="primary-btn landing-card-btn">
                Select Design
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});
