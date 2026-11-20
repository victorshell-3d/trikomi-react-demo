import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import puppeteer from 'puppeteer-core';
import { build, createServer } from 'vite';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chromePath = process.env.CHROME_PATH
  ?? [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ].find(existsSync);

assert.ok(chromePath, 'Set CHROME_PATH or install Chrome/Edge for the browser integration tests.');

for (const appName of ['box-configurator', 'jewelry-configurator']) {
  test(`${appName} consumes the shared UI Kit`, async () => {
    const appRoot = path.join(repoRoot, 'apps', appName);
    const configFile = path.join(appRoot, 'vite.config.ts');
    const buildOutput = await mkdtemp(path.join(os.tmpdir(), 'trikomi-ui-kit-'));
    const server = await createServer({
      configFile,
      root: appRoot,
      logLevel: 'error',
      server: {
        host: '127.0.0.1',
        port: 0,
        strictPort: false
      }
    });
    let browser;

    try {
      const buildResults = await build({
        configFile,
        root: appRoot,
        logLevel: 'error',
        build: {
          outDir: buildOutput,
          emptyOutDir: true,
          copyPublicDir: false,
          rollupOptions: {
            input: path.join(appRoot, 'tests', 'ui-kit-consumer.html')
          }
        }
      });
      const buildOutputs = Array.isArray(buildResults) ? buildResults : [buildResults];
      const htmlOutput = buildOutputs
        .flatMap((result) => result.output)
        .find((file) => file.type === 'asset' && file.fileName.endsWith('ui-kit-consumer.html'));
      assert.ok(htmlOutput, 'Vite did not emit the UI Kit consumer page.');
      assert.ok(existsSync(path.join(buildOutput, htmlOutput.fileName)));

      await server.listen();
      const address = server.httpServer.address();
      assert.ok(address && typeof address !== 'string', 'Vite did not bind a TCP port.');
      browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      });
      const page = await browser.newPage();
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`http://127.0.0.1:${address.port}/tests/ui-kit-consumer.html`, {
        waitUntil: 'domcontentloaded'
      });
      await page.waitForSelector(`[data-test-ready="${appName}"]`);

      const sizes = await page.evaluate(() => ['small', 'medium', 'large'].map((size) => {
        const button = document.querySelector(`[data-testid="button-${size}"]`);
        const { width, height } = button.getBoundingClientRect();
        return { width, height };
      }));
      assert.ok(sizes[0].width < sizes[1].width, `Small buttons must be narrower than medium buttons: ${JSON.stringify(sizes)}`);
      assert.ok(sizes[1].width < sizes[2].width, `Large buttons must be wider than medium buttons: ${JSON.stringify(sizes)}`);
      assert.ok(sizes[0].height < sizes[1].height, `Small buttons must be shorter than medium buttons: ${JSON.stringify(sizes)}`);
      assert.ok(sizes[1].height < sizes[2].height, `Large buttons must be taller than medium buttons: ${JSON.stringify(sizes)}`);

      const alertVariants = [
        ['info', 'status', 'Info', 'Studio color profile locked to sRGB.'],
        ['success', 'status', 'Success', 'GLB & Tech Pack exported cleanly.'],
        ['warning', 'status', 'Warning', 'High polygon count on mobile AR.'],
        ['error', 'alert', 'Error', 'Normal map exceeds 4096px limit.']
      ];
      for (const [variant, role, title, description] of alertVariants) {
        const alert = `[data-testid="alert-${variant}"]`;
        assert.equal(await page.$eval(alert, (node) => node.getAttribute('role')), role);
        assert.match(await page.$eval(alert, (node) => node.textContent), new RegExp(title));
        assert.match(await page.$eval(alert, (node) => node.textContent), new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        assert.equal(await page.$eval(alert, (node) => node.getAttribute('aria-live')), role === 'alert' ? 'assertive' : 'polite');
        assert.equal(await page.$eval(`${alert} .vs-alert__icon`, (node) => node.getAttribute('aria-hidden')), 'true');
        assert.equal(await page.$eval(`${alert} .vs-alert__dismiss`, (node) => node.getAttribute('aria-label')), `Dismiss ${title} alert`);
      }
      const infoDismiss = '[data-testid="alert-info"] .vs-alert__dismiss';
      await page.focus(infoDismiss);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Dismiss Success alert');
      assert.equal(
        await page.$eval('[data-testid="alert-success"] .vs-alert__dismiss', (node) => getComputedStyle(node).outlineStyle),
        'solid',
        'Alert dismiss controls should have a visible keyboard focus state.'
      );

      const toast = '.vs-toast';
      await page.focus('[data-testid="toast-trigger"]');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.querySelector('.vs-toast')?.classList.contains('is-visible'));
      assert.equal(await page.$eval(toast, (node) => node.getAttribute('role')), 'status');
      assert.equal(await page.$eval(toast, (node) => node.getAttribute('aria-live')), 'polite');
      assert.equal(await page.$eval(toast, (node) => node.getAttribute('aria-hidden')), 'false');
      assert.equal(await page.$eval(toast, (node) => node.textContent.trim()), 'Live studio toast triggered!');
      assert.equal(await page.$eval(toast, (node) => getComputedStyle(node).position), 'fixed');
      assert.equal(await page.$eval(toast, (node) => getComputedStyle(node).backgroundColor), 'rgb(35, 31, 52)');
      if (appName === 'box-configurator') {
        await new Promise((resolve) => setTimeout(resolve, 1400));
      }
      await page.click('[data-testid="toast-replace"]');
      assert.equal(await page.$eval(toast, (node) => node.textContent.trim()), 'Toast replacement confirmed.');
      if (appName === 'box-configurator') {
        await new Promise((resolve) => setTimeout(resolve, 1400));
        assert.equal(await page.$eval(toast, (node) => node.classList.contains('is-visible')), true);
        await page.waitForFunction(
          () => document.querySelector('.vs-toast')?.getAttribute('aria-hidden') === 'true',
          { timeout: 3500 }
        );
        assert.equal(await page.$eval(toast, (node) => node.classList.contains('is-visible')), false);
      }

      const accordion = '[data-testid="demo-accordion"]';
      const firstAccordionTrigger = `${accordion} .vs-accordion__item:nth-child(1) .vs-accordion__trigger`;
      const secondAccordionTrigger = `${accordion} .vs-accordion__item:nth-child(2) .vs-accordion__trigger`;
      assert.equal(await page.$eval(accordion, (node) => node.getAttribute('role')), 'group');
      assert.equal(await page.$eval(accordion, (node) => node.getAttribute('aria-label')), 'Studio setup notes');
      assert.equal(await page.$eval(firstAccordionTrigger, (node) => node.getAttribute('aria-expanded')), 'true');
      assert.equal(await page.$eval('[data-testid="accordion-open-items"]', (node) => node.textContent), 'glass');
      assert.equal(await page.$$eval(`${accordion} [role="region"]`, (nodes) => nodes.length), 2);
      await page.focus(secondAccordionTrigger);
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval('[data-testid="accordion-open-items"]', (node) => node.textContent), 'glass,spatial');
      assert.equal(await page.$eval(firstAccordionTrigger, (node) => node.getAttribute('aria-expanded')), 'true');
      assert.equal(await page.$eval(secondAccordionTrigger, (node) => node.getAttribute('aria-expanded')), 'true');
      await page.focus(firstAccordionTrigger);
      await page.keyboard.press('Space');
      assert.equal(await page.$eval('[data-testid="accordion-open-items"]', (node) => node.textContent), 'spatial');

      const modal = '[data-testid="demo-modal"]';
      const modalDialog = `${modal} [role="dialog"]`;
      await page.click('[data-testid="modal-open"]');
      await page.waitForFunction(() => document.querySelector('[data-testid="demo-modal"]')?.classList.contains('is-open'));
      assert.equal(await page.$eval(modalDialog, (node) => node.getAttribute('aria-modal')), 'true');
      assert.equal(await page.$eval(modalDialog, (node) => node.getAttribute('aria-labelledby')), await page.$eval(`${modal} .vs-modal__title`, (node) => node.id));
      assert.equal(await page.$eval(modalDialog, (node) => node.getAttribute('aria-describedby')), await page.$eval(`${modal} .vs-modal__description`, (node) => node.id));
      assert.equal(await page.$eval(modalDialog, (node) => node.textContent.includes('Glossy Royal Violet')), true);
      assert.equal(await page.$eval(modal, (node) => node.getAttribute('aria-hidden')), 'false');
      assert.equal(await page.$eval(modal, (node) => node.getAttribute('inert')), null);
      assert.equal(await page.$eval(modal, (node) => getComputedStyle(node.querySelector('.vs-modal-panel')).maxWidth), '540px');
      assert.equal(await page.$eval('body', (node) => node.style.overflow), 'hidden');
      assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('vs-modal-panel')), true);
      await page.click(`${modal} .vs-modal__summary`);
      assert.equal(await page.$eval(modal, (node) => node.classList.contains('is-open')), true);
      await page.click('[data-testid="background-probe"]');
      await page.waitForFunction(() => document.querySelector('[data-testid="demo-modal"]')?.getAttribute('aria-hidden') === 'true');
      assert.equal(await page.$eval('[data-testid="overlay-event"]', (node) => node.textContent), 'modal-close');
      assert.equal(await page.$eval('[data-testid="background-clicks"]', (node) => node.textContent), '0');
      assert.equal(await page.$eval('body', (node) => node.style.overflow), '');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-testid')), 'modal-open');

      await page.click('[data-testid="modal-open"]');
      await page.waitForFunction(() => document.querySelector('[data-testid="demo-modal"]')?.classList.contains('is-open'));
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Close modal');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-testid')), 'modal-cancel');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-testid')), 'modal-confirm');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Close modal');
      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      await page.keyboard.up('Shift');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-testid')), 'modal-confirm');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.querySelector('[data-testid="demo-modal"]')?.getAttribute('aria-hidden') === 'true');
      assert.equal(await page.$eval('body', (node) => node.style.overflow), '');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-testid')), 'modal-open');

      const drawer = '[data-testid="demo-drawer"]';
      const drawerDialog = `${drawer} [role="dialog"]`;
      const waitForDrawerOpen = () => page.waitForFunction(() => {
        const panel = document.querySelector('[data-testid="demo-drawer"] .vs-drawer-panel');
        if (!panel) return false;
        const rect = panel.getBoundingClientRect();
        return document.querySelector('[data-testid="demo-drawer"]')?.classList.contains('is-open')
          && rect.left >= 0
          && rect.right <= window.innerWidth;
      });
      await page.click('[data-testid="drawer-open"]');
      await waitForDrawerOpen();
      assert.equal(await page.$eval(drawerDialog, (node) => node.getAttribute('aria-modal')), 'true');
      assert.equal(await page.$eval(drawerDialog, (node) => node.getAttribute('aria-labelledby')), await page.$eval(`${drawer} .vs-drawer__title`, (node) => node.id));
      assert.equal(await page.$eval(`${drawer} .vs-drawer-panel`, (node) => getComputedStyle(node).position), 'fixed');
      assert.equal(await page.$eval(`${drawer} .vs-drawer-panel`, (node) => node.getBoundingClientRect().width <= 380), true);
      assert.equal(await page.$eval('[data-testid="drawer-environment"]', (node) => node.value), 'neon');
      assert.equal(await page.$eval('[data-testid="drawer-reflections"]', (node) => node.checked), true);
      assert.equal(await page.$eval('[data-testid="drawer-rotation"]', (node) => node.checked), false);
      assert.equal(await page.$eval('body', (node) => node.style.overflow), 'hidden');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.querySelector('[data-testid="demo-drawer"]')?.getAttribute('aria-hidden') === 'true');
      assert.equal(await page.$eval('body', (node) => node.style.overflow), '');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-testid')), 'drawer-open');

      await page.click('[data-testid="drawer-open"]');
      await waitForDrawerOpen();
      await page.click('[data-testid="drawer-apply"]');
      await page.waitForFunction(() => document.querySelector('[data-testid="demo-drawer"]')?.getAttribute('aria-hidden') === 'true');
      assert.equal(await page.$eval(toast, (node) => node.textContent.trim()), 'Studio settings applied!');
      await page.click('[data-testid="drawer-open"]');
      await waitForDrawerOpen();
      await page.click(drawer, { offset: { x: 4, y: 4 } });
      await page.waitForFunction(() => document.querySelector('[data-testid="demo-drawer"]')?.getAttribute('aria-hidden') === 'true');
      assert.equal(await page.$eval('[data-testid="overlay-event"]', (node) => node.textContent), 'drawer-close');
      assert.equal(await page.$eval('body', (node) => node.style.overflow), '');

      const tablist = '[role="tablist"][aria-label="Studio views"]';
      await page.click(`${tablist} [role="tab"]:nth-child(2)`);
      await page.waitForFunction(
        () => document.querySelector('[role="tabpanel"]:not([hidden])')?.textContent?.trim() === 'AR panel'
      );
      await page.focus(`${tablist} [aria-selected="true"]`);
      await page.keyboard.press('ArrowLeft');
      assert.equal(
        await page.$eval(`${tablist} [aria-selected="true"]`, (node) => node.textContent?.trim()),
        '3D Studio'
      );
      assert.equal(
        await page.$eval('[role="tabpanel"]:not([hidden])', (node) => node.textContent?.trim()),
        'Studio panel'
      );

      const segmentedControl = '[role="radiogroup"][aria-label="Capture modes"]';
      assert.equal(await page.$$eval(`${segmentedControl} [role="radio"]`, (nodes) => nodes.length), 5);
      await page.click(`${segmentedControl} [role="radio"]:nth-child(2)`);
      assert.equal(await page.$eval('[data-testid="selected-mode"]', (node) => node.textContent), 'recording');
      await page.focus(`${segmentedControl} [aria-checked="true"]`);
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.$eval('[data-testid="selected-mode"]', (node) => node.textContent), 'tracking');
      assert.equal(
        await page.$eval(`${segmentedControl} [aria-checked="true"]`, (node) => node.textContent?.trim()),
        'Tracking'
      );

      const rail = '[role="toolbar"][aria-label="Configurator tools"]';
      await page.focus(`${rail} [aria-pressed="true"]`);
      await page.keyboard.press('ArrowDown');
      assert.equal(
        await page.$eval(`${rail} [aria-pressed="true"]`, (node) => node.textContent?.trim()),
        'Lenses'
      );
      await page.click(`${rail} button:nth-child(3)`);
      assert.equal(
        await page.$eval(`${rail} [aria-pressed="true"]`, (node) => node.textContent?.trim()),
        'Color'
      );

      const assetTable = '[aria-label="3D Asset Library"]';
      assert.equal(await page.$$eval(`${assetTable} thead th`, (nodes) => nodes.length), 5);
      assert.equal(await page.$$eval(`${assetTable} tbody tr`, (nodes) => nodes.length), 3);
      assert.equal(
        await page.$eval(`${assetTable} tbody tr:first-child td:first-child`, (node) => node.textContent),
        'Aero Pro Jersey #10'
      );
      assert.equal(
        await page.$eval(`${assetTable} tbody tr:first-child td:nth-child(4)`, (node) => node.textContent.trim()),
        'Published'
      );
      assert.equal(
        await page.$eval(`${assetTable} thead th:first-child`, (node) => node.getAttribute('scope')),
        'col'
      );
      const assetSortButton = `${assetTable} button[aria-label="Sort by Asset Name"]`;
      await page.focus('[aria-label="Filter 3d asset library"]');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Sort by Asset Name');
      assert.equal(
        await page.$eval(assetSortButton, (node) => getComputedStyle(node).outlineStyle),
        'solid',
        'Sortable table headers should show keyboard focus.'
      );
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval(`${assetTable} thead th:first-child`, (node) => node.getAttribute('aria-sort')), 'ascending');
      assert.equal(
        await page.$eval(`${assetTable} tbody tr:first-child td:first-child`, (node) => node.textContent),
        'Aero Pro Jersey #10'
      );
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval(`${assetTable} thead th:first-child`, (node) => node.getAttribute('aria-sort')), 'descending');
      assert.equal(
        await page.$eval(`${assetTable} tbody tr:first-child td:first-child`, (node) => node.textContent),
        'Wayfarer UV400 Carbon'
      );
      await page.type('[aria-label="Filter 3d asset library"]', 'ring');
      assert.equal(await page.$$eval(`${assetTable} tbody tr`, (nodes) => nodes.length), 1);
      assert.equal(
        await page.$eval(`${assetTable} tbody tr:first-child td:first-child`, (node) => node.textContent),
        'Solitaire Rose Halo Ring'
      );
      await page.focus('[aria-label="Filter 3d asset library"]');
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      assert.equal(await page.$$eval(`${assetTable} tbody tr`, (nodes) => nodes.length), 3);
      await page.click('[data-testid="asset-action-glasses"]');
      assert.equal(await page.$eval('[data-testid="asset-action"]', (node) => node.textContent), 'glasses');

      assert.equal(await page.$$eval('.vs-data-checklist__item', (nodes) => nodes.length), 4);
      assert.equal(
        await page.$eval('.vs-data-checklist__state', (node) => node.getAttribute('aria-label')),
        'Face Detection: Complete'
      );
      assert.equal(await page.$$eval('.vs-avatar-stack__items [role="listitem"]', (nodes) => nodes.length), 4);
      assert.equal(
        await page.$eval('.vs-avatar-stack__overflow', (node) => node.getAttribute('aria-label')),
        '4 more collaborators'
      );
      assert.equal(await page.$eval('[data-testid="render-spinner"]', (node) => node.getAttribute('aria-label')), 'Rendering HDRI');
      assert.equal(await page.$eval('[data-testid="asset-skeleton"]', (node) => node.getAttribute('aria-hidden')), 'true');

      const pagination = '[data-testid="asset-pagination"]';
      assert.equal(await page.$eval(`${pagination} [aria-current="page"]`, (node) => node.textContent), '1');
      await page.click(`${pagination} [aria-label="Page 2"]`);
      assert.equal(await page.$eval('[data-testid="asset-page"]', (node) => node.textContent), '2');
      assert.equal(await page.$eval(`${pagination} [aria-current="page"]`, (node) => node.textContent), '2');
      await page.focus(`${pagination} [aria-label="Page 3"]`);
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval('[data-testid="asset-page"]', (node) => node.textContent), '3');
      assert.equal(await page.$eval(`${pagination} [aria-current="page"]`, (node) => node.textContent), '3');
      assert.equal(await page.$eval(pagination, (node) => node.getAttribute('aria-label')), 'Pagination');

      const paginationGradients = [];
      for (const [accent, expectedColor, expectedBorder] of [
        ['indigo', '#4338CA', 'rgb(67, 56, 202)'],
        ['orchid', '#A21CAF', 'rgb(162, 28, 175)']
      ]) {
        await page.$eval(
          '.vs-ui-root',
          (root, value) => root.setAttribute('data-accent', value),
          accent
        );
        assert.equal(
          await page.$eval('.vs-ui-root', (root) => getComputedStyle(root).getPropertyValue('--vs-primary').trim()),
          expectedColor
        );
        await page.waitForFunction(
          (color) => getComputedStyle(document.querySelector('[data-testid="materials-primary"] .vs-swatch-card.is-selected')).borderTopColor === color,
          {},
          expectedBorder
        );
        assert.equal(
          await page.$eval(
            '[data-testid="materials-primary"] .vs-swatch-card.is-selected',
            (node) => getComputedStyle(node).borderTopColor
          ),
          expectedBorder
        );
        paginationGradients.push(
          await page.$eval(
            `${pagination} [aria-current="page"]`,
            (node) => getComputedStyle(node).backgroundImage
          )
        );
      }
      await page.$eval('.vs-ui-root', (root) => root.removeAttribute('data-accent'));
      await page.waitForFunction(
        () => getComputedStyle(document.querySelector('[data-testid="materials-primary"] .vs-swatch-card.is-selected')).borderTopColor === 'rgb(110, 44, 242)'
      );
      assert.equal(
        await page.$eval('.vs-ui-root', (root) => getComputedStyle(root).getPropertyValue('--vs-primary').trim()),
        '#6E2CF2'
      );
      assert.equal(
        await page.$eval(
          '[data-testid="materials-primary"] .vs-swatch-card.is-selected',
          (node) => getComputedStyle(node).borderTopColor
        ),
        'rgb(110, 44, 242)'
      );
      paginationGradients.push(
        await page.$eval(
          `${pagination} [aria-current="page"]`,
          (node) => getComputedStyle(node).backgroundImage
        )
      );
      assert.equal(new Set(paginationGradients).size, 3, 'The active pagination indicator should follow all three theme gradients.');

      const actionTrigger = 'button[aria-label="Action menu"]';
      await page.focus(actionTrigger);
      await page.keyboard.press('ArrowDown');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'true',
        {},
        actionTrigger
      );
      await page.waitForFunction(
        () => document.activeElement?.textContent?.trim() === 'First action'
      );

      await page.keyboard.press('ArrowDown');
      assert.equal(
        await page.evaluate(() => document.activeElement?.textContent?.trim()),
        'Second action'
      );
      await page.keyboard.press('ArrowDown');
      assert.equal(
        await page.evaluate(() => document.activeElement?.textContent?.trim()),
        'Last action',
        'Arrow navigation must skip disabled options.'
      );
      await page.keyboard.press('ArrowUp');
      assert.equal(
        await page.evaluate(() => document.activeElement?.textContent?.trim()),
        'Second action'
      );
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('End');
      assert.equal(
        await page.evaluate(() => document.activeElement?.textContent?.trim()),
        'Last action'
      );
      await page.keyboard.press('Home');
      await page.keyboard.press('Enter');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'false',
        {},
        actionTrigger
      );
      assert.equal(await page.$eval('[data-testid="selected-action"]', (node) => node.textContent), 'first');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Action menu');

      await page.focus(actionTrigger);
      await page.keyboard.press('Enter');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'true',
        {},
        actionTrigger
      );
      await page.keyboard.press('Escape');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'false',
        {},
        actionTrigger
      );

      await page.focus(actionTrigger);
      await page.keyboard.press('Space');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'true',
        {},
        actionTrigger
      );
      await page.keyboard.press('Escape');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'false',
        {},
        actionTrigger
      );

      await page.focus(actionTrigger);
      await page.keyboard.press('ArrowDown');
      await page.waitForFunction(
        () => document.activeElement?.textContent?.trim() === 'First action'
      );
      await page.keyboard.press('Tab');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'false',
        {},
        actionTrigger
      );
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Multiple menu');

      const multipleTrigger = 'button[aria-label="Multiple menu"]';
      await page.focus(multipleTrigger);
      await page.keyboard.press('ArrowDown');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'true',
        {},
        multipleTrigger
      );
      await page.waitForFunction(
        () => document.activeElement?.getAttribute('role') === 'menuitemcheckbox'
      );
      const firstChoice = await page.$('[role="menuitemcheckbox"]');
      assert.equal(await firstChoice?.evaluate((node) => node.getAttribute('aria-checked')), 'true');
      await page.keyboard.press('Space');
      await page.waitForFunction(
        () => document.querySelector('[role="menuitemcheckbox"]')?.getAttribute('aria-checked') === 'false'
      );
      assert.equal(await page.$eval('[data-testid="selected-layers"]', (node) => node.textContent), '');
      assert.equal(await page.$eval(multipleTrigger, (node) => node.getAttribute('aria-expanded')), 'true');
      assert.equal(await page.$$eval('[role="menuitemcheckbox"]:disabled', (nodes) => nodes.length), 1);

      await page.click(actionTrigger);
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'true',
        {},
        actionTrigger
      );
      const actionItems = await page.$$('[role="menuitem"]');
      await actionItems[1].click();
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'false',
        {},
        actionTrigger
      );
      assert.equal(await page.$eval('[data-testid="selected-action"]', (node) => node.textContent), 'second');
      await page.click(actionTrigger);
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'true',
        {},
        actionTrigger
      );
      await page.click('[data-testid="outside"]');
      await page.waitForFunction(
        (selector) => document.querySelector(selector)?.getAttribute('aria-expanded') === 'false',
        {},
        actionTrigger
      );

      await page.focus('[data-testid="dock-metal"]');
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval('[data-testid="dock-action"]', (node) => node.textContent), 'metal');
      await page.click('[data-testid="dock-gemstone"]');
      assert.equal(await page.$eval('[data-testid="dock-action"]', (node) => node.textContent), 'gemstone');
      await page.click('[data-testid="customize-dock"]');
      assert.equal(await page.$eval('[data-testid="dock-action"]', (node) => node.textContent), 'customize');

      const primarySwatches = '[data-testid="materials-primary"] [role="radiogroup"]';
      const secondarySwatches = '[data-testid="materials-secondary"] [role="radiogroup"]';
      assert.equal(await page.$$eval(`${primarySwatches} [role="radio"]`, (nodes) => nodes.length), 6);
      assert.equal(
        await page.$eval(`${primarySwatches} [aria-checked="true"]`, (node) => node.textContent?.trim()),
        'Glossy'
      );
      await page.click(`${primarySwatches} [role="radio"]:nth-child(3)`);
      assert.equal(await page.$eval('[data-testid="selected-material"]', (node) => node.textContent), 'matte');
      assert.equal(
        await page.$eval('[data-testid="materials-primary"] .vs-material-picker__active', (node) => node.textContent?.trim()),
        'Active: Matte'
      );
      assert.equal(
        await page.$eval(`${secondarySwatches} [aria-checked="true"]`, (node) => node.textContent?.trim()),
        'Carbon',
        'Selecting a swatch must not change another picker instance.'
      );
      await page.focus(`${primarySwatches} [aria-checked="true"]`);
      await page.keyboard.press('ArrowRight');
      assert.equal(
        await page.$eval(`${primarySwatches} [aria-checked="true"]`, (node) => node.textContent?.trim()),
        'Chrome'
      );

      const sceneSwitcher = '[data-testid="tour-scenes"]';
      await page.click(`${sceneSwitcher} button[aria-label="Next scene"]`);
      assert.equal(await page.$eval('[data-testid="active-scene"]', (node) => node.textContent), 'gallery');
      await page.click(`${sceneSwitcher} button[aria-label="Previous scene"]`);
      assert.equal(await page.$eval('[data-testid="active-scene"]', (node) => node.textContent), 'entrance');
      await page.click(`${sceneSwitcher} [role="radio"]:nth-child(3)`);
      assert.equal(await page.$eval('[data-testid="active-scene"]', (node) => node.textContent), 'lounge');
      await page.click(`${sceneSwitcher} button[aria-label="Next scene"]`);
      assert.equal(await page.$eval('[data-testid="active-scene"]', (node) => node.textContent), 'entrance');

      const hotspot = 'button[aria-label="Spatial Node"]';
      await page.focus(hotspot);
      await page.waitForFunction(
        () => document.querySelector('[role="tooltip"]')?.getAttribute('aria-hidden') === 'false'
      );
      assert.equal(
        await page.$eval('[role="tooltip"]', (node) => node.textContent?.trim()),
        'Spatial Node'
      );
      await page.keyboard.press('Escape');
      await page.waitForFunction(
        () => document.querySelector('[role="tooltip"]')?.getAttribute('aria-hidden') === 'true'
      );
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval('[data-testid="hotspot-count"]', (node) => node.textContent), '1');
      await page.click(hotspot);
      assert.equal(await page.$eval('[data-testid="hotspot-count"]', (node) => node.textContent), '2');

      const requiredField = '[data-testid="required-field"]';
      const emailField = '[data-testid="form-email"]';
      const numberField = '[data-testid="form-number"]';
      const selectAll = async () => {
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
      };
      const setFileInput = async (selector, file) => {
        await page.$eval(selector, (input, fileData) => {
          const transfer = new DataTransfer();
          transfer.items.add(new File([fileData.content], fileData.name, { type: fileData.type }));
          input.files = transfer.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }, file);
      };
      const dropFile = async (selector, file) => {
        await page.$eval(selector, (zone, fileData) => {
          const transfer = new DataTransfer();
          transfer.items.add(new File([fileData.content], fileData.name, { type: fileData.type }));
          zone.dispatchEvent(new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: transfer
          }));
        }, file);
      };
      assert.equal(await page.$eval(requiredField, (node) => node.type), 'text');
      assert.equal(await page.$eval(emailField, (node) => node.type), 'email');
      assert.equal(await page.$eval('[data-testid="form-password"]', (node) => node.type), 'password');
      assert.equal(await page.$eval(numberField, (node) => node.type), 'number');
      assert.equal(await page.$eval('[data-testid="form-search"]', (node) => node.type), 'search');
      assert.equal(await page.$eval('[data-testid="form-textarea"]', (node) => node.tagName), 'TEXTAREA');
      assert.equal(await page.$eval(requiredField, (node) => node.required), true);
      assert.equal(await page.$eval('[data-testid="form-disabled"]', (node) => node.disabled), true);
      assert.equal(
        await page.$eval('[data-testid="form-disabled"]', (node) => getComputedStyle(node).backgroundColor),
        'rgb(241, 245, 249)'
      );
      assert.equal(
        await page.$eval(requiredField, (node) => node.labels?.[0]?.textContent?.trim()),
        'Display name *',
        'FormField labels must be associated with their control.'
      );
      assert.match(
        await page.$eval(requiredField, (node) => node.getAttribute('aria-describedby')),
        /vs-field-.*-helper/
      );
      assert.equal(await page.$eval('[data-testid="form-group-input"]', (node) => node.labels?.length), 1);
      assert.equal(await page.$eval('[data-testid="form-floating"]', (node) => node.labels?.length), 1);
      assert.equal(await page.$eval('[data-testid="form-number"]', (node) => node.value), '20');
      assert.match(
        await page.$eval('[data-testid="form-textarea"]', (node) => node.parentElement.querySelector('output').textContent.trim()),
        /^12 \/ 160$/
      );

      await page.focus(requiredField);
      await page.$eval(requiredField, (node) => node.blur());
      await page.waitForFunction(
        () => document.querySelector('.vs-form-field__error')?.textContent?.trim() === 'This field is required.'
      );
      const requiredErrorId = await page.$eval(
        '[data-testid="required-field"]',
        (node) => node.closest('.vs-form-field').querySelector('.vs-form-field__error').id
      );
      assert.equal(await page.$eval(requiredField, (node) => node.getAttribute('aria-invalid')), 'true');
      assert.equal(await page.$eval(requiredField, (node) => node.getAttribute('aria-errormessage')), requiredErrorId);
      assert.ok(
        (await page.$eval(requiredField, (node) => node.getAttribute('aria-describedby'))).split(/\s+/).includes(requiredErrorId)
      );
      assert.equal(
        await page.$eval('[data-testid="required-field"]', (node) => node.closest('.vs-form-field').querySelector('.vs-form-field__error').getAttribute('role')),
        'alert'
      );
      await page.click(requiredField);
      await page.type(requiredField, 'ab');
      await page.$eval(requiredField, (node) => node.blur());
      await page.waitForFunction(
        () => document.querySelector('.vs-form-field__error')?.textContent?.trim() === 'Use at least 3 characters.'
      );
      await page.focus(requiredField);
      await page.$eval(requiredField, (node) => {
        node.value = 'LongDisplayName';
        node.blur();
      });
      await page.waitForFunction(
        () => document.querySelector('[data-testid="required-field"]').closest('.vs-form-field').querySelector('.vs-form-field__error')?.textContent?.trim() === 'Use no more than 8 characters.'
      );
      await page.click(requiredField);
      await selectAll();
      await page.type(requiredField, 'Aurora');
      await page.$eval(requiredField, (node) => node.blur());
      await page.waitForFunction(
        () => !document.querySelector('[data-testid="required-field"]').closest('.vs-form-field').querySelector('.vs-form-field__error')
      );

      await page.click(emailField);
      await page.type(emailField, 'bad-email');
      assert.equal(await page.$eval('[data-testid="controlled-email"]', (node) => node.textContent), 'bad-email');
      await page.$eval(emailField, (node) => node.blur());
      await page.waitForFunction(
        () => document.querySelector('[data-testid="form-email"]').closest('.vs-form-field').querySelector('.vs-form-field__error')?.textContent?.trim() === 'Enter a valid email address.'
      );
      await page.click(emailField);
      await selectAll();
      await page.type(emailField, 'user@example.com');
      await page.$eval(emailField, (node) => node.blur());
      await page.waitForFunction(
        () => document.querySelector('[data-testid="form-email"]').closest('.vs-form-field').querySelector('.vs-form-field__success')?.textContent?.trim() === 'Email format looks good.'
      );

      await page.click(numberField);
      await selectAll();
      await page.type(numberField, '3');
      await page.$eval(numberField, (node) => node.blur());
      await page.waitForFunction(
        () => document.querySelector('[data-testid="form-number"]').closest('.vs-form-field').querySelector('.vs-form-field__error')?.textContent?.trim() === 'Quantity must be at least 10.'
      );
      await page.click(numberField);
      await selectAll();
      await page.type(numberField, '60');
      await page.$eval(numberField, (node) => node.blur());
      await page.waitForFunction(
        () => document.querySelector('[data-testid="form-number"]').closest('.vs-form-field').querySelector('.vs-form-field__error')?.textContent?.trim() === 'Quantity cannot exceed 50.'
      );
      await page.click(numberField);
      await selectAll();
      await page.type(numberField, '24');
      await page.$eval(numberField, (node) => node.blur());
      assert.equal(await page.$eval(numberField, (node) => node.value), '24');

      const textarea = '[data-testid="form-textarea"]';
      await page.click(textarea);
      await selectAll();
      await page.type(textarea, 'Updated description');
      assert.equal(
        await page.$eval(textarea, (node) => node.parentElement.querySelector('output').textContent.trim()),
        '19 / 160'
      );

      const range = '[data-testid="form-range"]';
      const steppedRange = '[data-testid="stepped-range"]';
      assert.equal(await page.$eval(steppedRange, (node) => node.min), '10');
      assert.equal(await page.$eval(steppedRange, (node) => node.max), '20');
      assert.equal(await page.$eval(steppedRange, (node) => node.step), '5');
      assert.equal(await page.$eval(steppedRange, (node) => node.value), '15');
      assert.equal(
        await page.$eval(steppedRange, (node) => node.parentElement.querySelector('.vs-range-control__value').textContent.trim()),
        '15 units'
      );
      await page.focus(steppedRange);
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.$eval(steppedRange, (node) => node.value), '10');
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.$eval(steppedRange, (node) => node.value), '10');
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.$eval(steppedRange, (node) => node.value), '15');

      await page.focus(range);
      await page.keyboard.press('ArrowLeft');
      assert.equal(
        await page.$eval(range, (node) => node.parentElement.querySelector('.vs-range-control__value').textContent.trim()),
        '81%'
      );

      const uploadRoot = '[data-testid="mesh-upload"]';
      const uploadInput = `${uploadRoot} input[type="file"]`;
      assert.equal(await page.$eval(uploadInput, (node) => node.type), 'file');
      assert.equal(await page.$eval(uploadInput, (node) => node.accept), '.glb,.usdz,.obj,.png');
      assert.equal(await page.$eval(uploadInput, (node) => node.tabIndex), 0);
      assert.equal(
        await page.$eval(uploadInput, (node) => Array.from(node.labels).some((label) => label.classList.contains('vs-upload-dropzone__trigger'))),
        true,
        'The visible dropzone label must activate and name the native file input.'
      );
      await setFileInput(uploadInput, {
        name: 'mesh.GLB',
        type: 'model/gltf-binary',
        content: 'mesh data'
      });
      await page.waitForFunction(
        () => document.querySelector('[data-testid="selected-upload"]')?.textContent === 'mesh.GLB'
      );
      assert.match(await page.$eval(uploadRoot, (node) => node.textContent), /Selected: mesh\.GLB/);
      assert.match(
        await page.$eval(uploadRoot, (node) => node.querySelector('.vs-upload-file-info__details').textContent),
        /9 B/
      );
      assert.doesNotMatch(await page.$eval(uploadRoot, (node) => node.textContent), /Uploaded/);

      await setFileInput(uploadInput, {
        name: 'notes.txt',
        type: 'text/plain',
        content: 'not a mesh'
      });
      await page.waitForFunction(
        () => document.querySelector('[data-testid="upload-error"]')?.textContent?.startsWith('Choose a file matching')
      );
      assert.equal(await page.$eval('[data-testid="selected-upload"]', (node) => node.textContent), 'mesh.GLB');

      await setFileInput(uploadInput, {
        name: 'large.obj',
        type: 'text/plain',
        content: 'x'.repeat(64)
      });
      await page.waitForFunction(
        () => document.querySelector('[data-testid="upload-error"]')?.textContent === 'File must be no larger than 32 B.'
      );
      assert.equal(await page.$eval('[data-testid="selected-upload"]', (node) => node.textContent), 'mesh.GLB');

      await page.$eval(uploadRoot, (node) => {
        const transfer = new DataTransfer();
        transfer.items.add(new File(['texture'], 'replacement.png', { type: 'image/png' }));
        node.dispatchEvent(new DragEvent('dragenter', {
          bubbles: true,
          cancelable: true,
          dataTransfer: transfer
        }));
        node.dispatchEvent(new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
          dataTransfer: transfer
        }));
      });
      assert.equal(await page.$eval(uploadRoot, (node) => node.classList.contains('is-dragging')), true);
      await dropFile(uploadRoot, {
        name: 'replacement.png',
        type: 'image/png',
        content: 'texture'
      });
      await page.waitForFunction(
        () => document.querySelector('[data-testid="selected-upload"]')?.textContent === 'replacement.png'
      );
      assert.equal(await page.$eval(uploadRoot, (node) => node.classList.contains('is-dragging')), false);
      assert.equal(await page.$eval('[data-testid="upload-error"]', (node) => node.textContent), 'none');

      await page.click(`${uploadRoot} .vs-upload-file-info__remove`);
      await page.waitForFunction(
        () => document.querySelector('[data-testid="selected-upload"]')?.textContent === 'none'
      );
      assert.equal(await page.$(`${uploadRoot} .vs-upload-file-info`), null);

      await setFileInput('[data-testid="unrestricted-upload"] input[type="file"]', {
        name: 'unrestricted.txt',
        type: 'text/plain',
        content: 'x'.repeat(64)
      });
      await page.waitForFunction(
        () => document.querySelector('[data-testid="unrestricted-file"]')?.textContent === 'unrestricted.txt'
      );

      await page.focus('[data-testid="form-search"]');
      for (const [accent, expectedColor] of [
        ['indigo', 'rgb(67, 56, 202)'],
        ['orchid', 'rgb(162, 28, 175)'],
        ['violet', 'rgb(110, 44, 242)']
      ]) {
        await page.$eval(
          '.vs-ui-root',
          (root, value) => {
            if (value === 'violet') root.removeAttribute('data-accent');
            else root.setAttribute('data-accent', value);
          },
          accent
        );
        await page.focus('[data-testid="form-search"]');
        await page.waitForFunction(
          () => document.activeElement?.getAttribute('data-testid') === 'form-search'
        );
        assert.equal(
          await page.$eval('.vs-ui-root', (root) => getComputedStyle(root).getPropertyValue('--vs-primary').trim()),
          accent === 'indigo' ? '#4338CA' : accent === 'orchid' ? '#A21CAF' : '#6E2CF2'
        );
        await page.waitForFunction(
          (color) => getComputedStyle(document.querySelector('[data-testid="form-search"]')).borderTopColor === color,
          {},
          expectedColor
        );
        assert.equal(
          await page.$eval('[data-testid="form-search"]', (node) => getComputedStyle(node).borderTopColor),
          expectedColor,
          `Focused input should use the ${accent} theme primary color.`
        );
        assert.equal(
          await page.$eval(`[data-testid="alert-success"] .vs-alert__icon`, (node) => getComputedStyle(node).backgroundColor),
          'rgba(16, 185, 129, 0.15)'
        );
        assert.equal(
          await page.$eval(`[data-testid="alert-info"] .vs-alert__icon`, (node) => getComputedStyle(node).color),
          expectedColor,
          `Informational alert should use the ${accent} theme primary color.`
        );
        await page.focus(uploadInput);
        await page.waitForFunction(
          (color) => getComputedStyle(document.querySelector('[data-testid="mesh-upload"]')).borderTopColor === color,
          {},
          expectedColor
        );
      }
      await page.$eval('.vs-ui-root', (root) => root.removeAttribute('data-accent'));

      await page.focus('[data-testid="form-submit"]');
      await page.keyboard.press('Enter');
      await page.waitForFunction(
        () => document.querySelector('[data-testid="form-submitted"]')?.textContent === 'submitted'
      );

      for (const width of [320, 390, 768, 1280, 1440]) {
        await page.setViewport({ width, height: 900 });
        const responsiveState = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          tableScrolls: document.querySelector('.vs-data-table__scroll').scrollWidth > document.querySelector('.vs-data-table__scroll').clientWidth,
          alertColumns: getComputedStyle(document.querySelector('[data-testid="alert-grid"]')).gridTemplateColumns.split(' ').length,
          alertOverflow: document.querySelector('[data-testid="alert-info"]').scrollWidth > document.querySelector('[data-testid="alert-info"]').clientWidth,
          toastRight: document.querySelector('.vs-toast').getBoundingClientRect().right,
          toastWidth: document.querySelector('.vs-toast').getBoundingClientRect().width,
          modalWidth: document.querySelector('.vs-modal-panel').getBoundingClientRect().width,
          drawerWidth: document.querySelector('.vs-drawer-panel').getBoundingClientRect().width,
          formColumns: getComputedStyle(document.querySelector('.vs-form-layout')).gridTemplateColumns,
          sizes: ['small', 'medium', 'large'].map((size) => {
            const button = document.querySelector(`[data-testid="button-${size}"]`);
            const { width: buttonWidth, height } = button.getBoundingClientRect();
            return { width: buttonWidth, height };
          })
        }));
        assert.equal(responsiveState.overflow, false, `Horizontal overflow at ${width}px.`);
        if (width <= 390) {
          assert.equal(responsiveState.tableScrolls, true, `The asset table should scroll horizontally at ${width}px.`);
        }
        assert.equal(responsiveState.alertColumns, width >= 768 ? 2 : 1, `Alert layout should adapt at ${width}px.`);
        assert.equal(responsiveState.alertOverflow, false, `Alert content overflow at ${width}px.`);
        assert.ok(responsiveState.toastRight <= width, `Toast must remain within the ${width}px viewport.`);
        assert.ok(responsiveState.toastWidth <= width, `Toast width must fit the ${width}px viewport.`);
        assert.ok(responsiveState.modalWidth <= width, `Modal width must fit the ${width}px viewport.`);
        assert.ok(responsiveState.drawerWidth <= width, `Drawer width must fit the ${width}px viewport.`);
        assert.equal(
          responsiveState.formColumns.split(' ').length,
          width >= 640 ? 2 : 1,
          `Form layout should use the responsive column count at ${width}px.`
        );
        assert.ok(
          responsiveState.sizes[0].width < responsiveState.sizes[1].width
          && responsiveState.sizes[1].width < responsiveState.sizes[2].width
          && responsiveState.sizes[0].height < responsiveState.sizes[1].height
          && responsiveState.sizes[1].height < responsiveState.sizes[2].height,
          `Button size order changed at ${width}px: ${JSON.stringify(responsiveState.sizes)}`
        );
      }

      await page.focus(infoDismiss);
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.querySelector('[data-testid="alert-info"]') === null);
      assert.equal(await page.$eval('[data-testid="dismissed-alert"]', (node) => node.textContent), 'info');
      assert.ok(await page.$('[data-testid="alert-success"]'), 'Dismissing one alert must not dismiss its siblings.');

      assert.deepEqual(pageErrors, []);
    } finally {
      await browser?.close();
      await server.close();
      await rm(buildOutput, { recursive: true, force: true });
    }
  });
}

test('standalone UI Kit demo integrates themes and component interactions', async () => {
  const configFile = path.join(repoRoot, 'packages', 'ui-kit', 'vite.config.ts');
  const server = await createServer({
    configFile,
    logLevel: 'error',
    server: {
      host: '127.0.0.1',
      port: 0,
      strictPort: false
    }
  });
  let browser;

  try {
    await server.listen();
    const address = server.httpServer.address();
    assert.ok(address && typeof address !== 'string', 'Vite did not bind a TCP port.');
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#foundations');
    assert.equal(await page.$eval('.vs-ui-root', (root) => root.getAttribute('data-accent')), 'violet');
    assert.deepEqual(
      await page.$$eval('.demo-main main .demo-section', (sections) => sections.map((section) => section.id)),
      [
        'foundations', 'typography', 'layout', 'buttons', 'popovers', 'selection', 'tabs',
        'configurator', 'forms', 'uploads', 'data', 'alerts', 'overlays'
      ]
    );
    assert.equal(await page.$eval('.demo-sidebar .demo-nav a', (link) => link.getAttribute('href')), '#foundations');
    await page.setViewport({ width: 390, height: 844 });
    await page.click('.demo-mobile-nav summary');
    assert.equal(await page.$eval('.demo-mobile-nav', (navigation) => navigation.open), true);
    assert.equal(await page.$$eval('.demo-mobile-nav .demo-nav a', (links) => links.length), 13);
    await page.click('.demo-mobile-nav a[href="#uploads"]');
    assert.equal(await page.evaluate(() => window.location.hash), '#uploads');
    await page.setViewport({ width: 1440, height: 1000 });

    for (const [accent, expectedColor] of [
      ['violet', '#6E2CF2'],
      ['indigo', '#4338CA'],
      ['orchid', '#A21CAF']
    ]) {
      const themeOptionIndex = { violet: 1, indigo: 2, orchid: 3 }[accent];
      await page.click(`[data-testid="theme-switcher"] [role="radio"]:nth-child(${themeOptionIndex})`);
      assert.equal(await page.$eval('.vs-ui-root', (root) => root.getAttribute('data-accent')), accent);
      assert.equal(
        await page.$eval('.vs-ui-root', (root) => getComputedStyle(root).getPropertyValue('--vs-primary').trim()),
        expectedColor
      );
      const expectedRgb = expectedColor.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16));
      assert.ok(
        (await page.$eval('.vs-btn-primary', (button) => getComputedStyle(button).backgroundImage))
          .includes(`rgb(${expectedRgb.join(', ')})`),
        `Primary button gradient should use the ${accent} theme.`
      );
    }

    await page.click('[role="tablist"] [role="tab"]:nth-child(2)');
    assert.equal(
      await page.$eval('[role="tabpanel"]:not([hidden])', (panel) => panel.textContent.includes('@trikomi/ui-kit/styles.css')),
      true
    );

    const checkbox = 'input.vs-checkbox[value="reflections"]';
    const radio = 'input.vs-radio[name="demo-quality"][value="high"]';
    const autoRotate = 'input[role="switch"]';
    assert.equal(await page.$eval(checkbox, (input) => input.checked), false);
    await page.click(checkbox);
    assert.equal(await page.$eval(checkbox, (input) => input.checked), true);
    assert.equal(await page.$eval(radio, (input) => input.checked), false);
    await page.click(radio);
    assert.equal(await page.$eval(radio, (input) => input.checked), true);
    assert.equal(await page.$eval(autoRotate, (input) => input.checked), true);
    await page.click(autoRotate);
    assert.equal(await page.$eval(autoRotate, (input) => input.checked), false);
    await page.click(autoRotate);
    for (const [accent, expectedColor] of [
      ['violet', '#6E2CF2'],
      ['indigo', '#4338CA'],
      ['orchid', '#A21CAF']
    ]) {
      const expectedRgb = expectedColor.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16));
      const expectedCssColor = `rgb(${expectedRgb.join(', ')})`;
      const themeOptionIndex = { violet: 1, indigo: 2, orchid: 3 }[accent];
      await page.click(`[data-testid="theme-switcher"] [role="radio"]:nth-child(${themeOptionIndex})`);
      assert.equal(await page.$eval('.vs-ui-root', (root) => root.getAttribute('data-accent')), accent);
      await page.keyboard.press('Tab');
      await page.focus(radio);
      await page.waitForFunction(
        (selector, color) => getComputedStyle(document.querySelector(selector)).borderTopColor === color,
        {},
        radio,
        expectedCssColor
      );
      await page.waitForFunction(
        (selector, color) => getComputedStyle(document.querySelector(selector)).outlineColor === color,
        {},
        radio,
        expectedCssColor
      );
      const controlStyles = await page.evaluate((selectors) => ({
        checkboxGradient: getComputedStyle(document.querySelector(selectors.checkbox)).backgroundImage,
        radioBorder: getComputedStyle(document.querySelector(selectors.radio)).borderTopColor,
        radioFocus: getComputedStyle(document.querySelector(selectors.radio)).outlineColor,
        switchGradient: getComputedStyle(document.querySelector(selectors.autoRotate).nextElementSibling).backgroundImage
      }), { checkbox, radio, autoRotate });
      assert.ok(controlStyles.checkboxGradient.includes(expectedCssColor), `${accent} checkbox gradient should use the theme color.`);
      assert.equal(controlStyles.radioBorder, expectedCssColor, `${accent} radio border should use the theme color.`);
      assert.equal(await page.$eval(radio, (input) => getComputedStyle(input).outlineStyle), 'solid');
      assert.equal(controlStyles.radioFocus, expectedCssColor, `${accent} radio focus ring should use the theme color.`);
      assert.ok(controlStyles.switchGradient.includes(expectedCssColor), `${accent} switch gradient should use the theme color.`);
    }

    const dropdownTrigger = 'button[aria-label="Project actions"]';
    await page.focus(dropdownTrigger);
    await page.keyboard.press('ArrowDown');
    await page.waitForFunction(
      () => document.querySelector('.vs-dropdown-menu')?.getAttribute('aria-hidden') === 'false'
    );
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('role')?.startsWith('menuitem')
    );
    assert.match(
      await page.evaluate(() => document.activeElement?.getAttribute('role')),
      /^menuitem/
    );
    await page.keyboard.press('Escape');
    await page.waitForFunction(
      () => document.querySelector('.vs-dropdown-menu')?.getAttribute('aria-hidden') === 'true'
    );
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Project actions');

    const popoverTrigger = 'button[aria-label="Open project details"]';
    await page.click(popoverTrigger);
    await page.waitForFunction(
      () => document.querySelector('.vs-popover-panel')?.getAttribute('aria-hidden') === 'false'
    );
    assert.equal(await page.$eval('.vs-popover-panel', (panel) => panel.getAttribute('role')), 'dialog');
    await page.keyboard.press('Escape');
    await page.waitForFunction(
      () => document.querySelector('.vs-popover-panel')?.getAttribute('aria-hidden') === 'true'
    );
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Open project details');

    const tooltipTrigger = '.vs-tooltip > button';
    await page.focus(tooltipTrigger);
    await page.waitForFunction(
      () => document.querySelector('.vs-tooltip-bubble')?.classList.contains('is-visible')
    );
    assert.equal(
      await page.$eval(tooltipTrigger, (trigger) => trigger.getAttribute('aria-describedby')),
      await page.$eval('.vs-tooltip-bubble', (tooltip) => tooltip.id)
    );
    assert.equal(await page.$eval('.vs-tooltip-bubble', (tooltip) => tooltip.getAttribute('role')), 'tooltip');
    await page.keyboard.press('Escape');
    await page.waitForFunction(
      () => document.querySelector('.vs-tooltip-bubble')?.getAttribute('aria-hidden') === 'true'
    );

    await page.click('[data-testid="demo-toast-trigger"]');
    await page.waitForFunction(() => document.querySelector('.vs-toast')?.classList.contains('is-visible'));

    await page.$eval('#uploads input[type="file"]', (input) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File(['model data'], 'sample.glb', { type: 'model/gltf-binary' }));
      Object.defineProperty(input, 'files', { configurable: true, value: transfer.files });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForFunction(
      () => document.querySelector('#uploads .vs-status-indicator')?.textContent.includes('sample.glb')
    );

    await page.click('button[aria-label="Next scene"]');
    assert.equal(
      await page.$eval('#configurator .vs-tour-scene-switcher [role="radio"]:nth-child(2)', (option) => option.getAttribute('aria-checked')),
      'true'
    );
    const accordionTrigger = '#overlays .vs-accordion__trigger';
    await page.click(accordionTrigger);
    assert.equal(await page.$eval(accordionTrigger, (trigger) => trigger.getAttribute('aria-expanded')), 'false');
    await page.click(accordionTrigger);
    assert.equal(await page.$eval(accordionTrigger, (trigger) => trigger.getAttribute('aria-expanded')), 'true');

    await page.click('[data-testid="demo-modal-open"]');
    await page.waitForFunction(() => document.querySelector('.vs-modal-backdrop')?.classList.contains('is-open'));
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('.vs-modal-backdrop')?.getAttribute('aria-hidden') === 'true');

    await page.click('[data-testid="demo-drawer-open"]');
    await page.waitForFunction(() => {
      const panel = document.querySelector('.vs-drawer-panel');
      if (!panel) return false;
      const rect = panel.getBoundingClientRect();
      return document.querySelector('.vs-drawer-backdrop')?.classList.contains('is-open')
        && rect.left >= 0
        && rect.right <= window.innerWidth;
    });
    await page.click('[data-testid="demo-drawer-apply"]');
    await page.waitForFunction(() => document.querySelector('.vs-drawer-backdrop')?.getAttribute('aria-hidden') === 'true');

    for (const width of [320, 390, 768, 1280, 1440]) {
      await page.setViewport({ width, height: 900 });
      const responsiveState = await page.evaluate(() => ({
        page: document.querySelector('.demo-page').getBoundingClientRect().toJSON(),
        documentWidth: document.documentElement.scrollWidth,
        sidebarDisplay: getComputedStyle(document.querySelector('.demo-sidebar')).display,
        mobileNavigationDisplay: getComputedStyle(document.querySelector('.demo-mobile-nav')).display,
        tableScroller: document.querySelector('.vs-data-table__scroll').getBoundingClientRect().toJSON(),
        tableScrollWidth: document.querySelector('.vs-data-table__scroll').scrollWidth,
        tableClientWidth: document.querySelector('.vs-data-table__scroll').clientWidth
      }));
      assert.ok(
        responsiveState.page.left >= 0 && responsiveState.page.right <= width,
        `UI Kit demo content should fit at ${width}px.`
      );
      assert.ok(responsiveState.documentWidth <= width, `The document should not overflow at ${width}px.`);
      assert.equal(responsiveState.sidebarDisplay !== 'none', width > 960, `Desktop sidebar visibility at ${width}px.`);
      assert.equal(responsiveState.mobileNavigationDisplay !== 'none', width <= 960, `Mobile navigation visibility at ${width}px.`);
      assert.ok(
        responsiveState.tableScroller.left >= 0
          && responsiveState.tableScroller.right <= width,
        `The table viewport should fit at ${width}px.`
      );
      await page.click('[data-testid="demo-modal-open"]');
      await page.waitForFunction(() => {
        const panel = document.querySelector('.vs-modal-panel');
        if (!panel) return false;
        const rect = panel.getBoundingClientRect();
        return document.querySelector('.vs-modal-backdrop')?.classList.contains('is-open')
          && rect.left >= 0
          && rect.right <= window.innerWidth
          && rect.top >= 0
          && rect.bottom <= window.innerHeight;
      });
      await page.keyboard.press('Escape');
      await page.waitForFunction(
        () => document.querySelector('.vs-modal-backdrop')?.getAttribute('aria-hidden') === 'true'
      );
      await page.click('[data-testid="demo-drawer-open"]');
      await page.waitForFunction(() => {
        const panel = document.querySelector('.vs-drawer-panel');
        if (!panel) return false;
        const rect = panel.getBoundingClientRect();
        return document.querySelector('.vs-drawer-backdrop')?.classList.contains('is-open')
          && rect.left >= 0
          && rect.right <= window.innerWidth
          && rect.top >= 0
          && rect.bottom <= window.innerHeight;
      });
      await page.click('[data-testid="demo-drawer-apply"]');
      await page.waitForFunction(
        () => document.querySelector('.vs-drawer-backdrop')?.getAttribute('aria-hidden') === 'true'
      );
      await page.click(dropdownTrigger);
      await page.waitForFunction(
        () => document.querySelector('.vs-dropdown-menu')?.getAttribute('aria-hidden') === 'false'
      );
      const dropdownBounds = await page.$eval('.vs-dropdown-menu', (menu) => {
        const { left, right } = menu.getBoundingClientRect();
        return { left, right };
      });
      assert.ok(
        dropdownBounds.left >= 0 && dropdownBounds.right <= width,
        `Dropdown should fit within the ${width}px viewport: ${JSON.stringify(dropdownBounds)}`
      );
      await page.keyboard.press('Escape');
      await page.click(popoverTrigger);
      await page.waitForFunction(
        () => document.querySelector('.vs-popover-panel')?.getAttribute('aria-hidden') === 'false'
      );
      const popoverBounds = await page.$eval('.vs-popover-panel', (panel) => {
        const { left, right } = panel.getBoundingClientRect();
        return { left, right };
      });
      assert.ok(
        popoverBounds.left >= 0 && popoverBounds.right <= width,
        `Popover should fit within the ${width}px viewport: ${JSON.stringify(popoverBounds)}`
      );
      await page.keyboard.press('Escape');
      await page.focus(tooltipTrigger);
      await page.waitForFunction(
        () => document.querySelector('.vs-tooltip-bubble')?.classList.contains('is-visible')
      );
      const tooltipBounds = await page.$eval('.vs-tooltip-bubble', (tooltip) => {
        const { left, right } = tooltip.getBoundingClientRect();
        return { left, right };
      });
      assert.ok(
        tooltipBounds.left >= 0 && tooltipBounds.right <= width,
        `Tooltip should fit within the ${width}px viewport: ${JSON.stringify(tooltipBounds)}`
      );
      await page.keyboard.press('Escape');
      if (width <= 390) {
        assert.ok(
          responsiveState.tableScrollWidth > responsiveState.tableClientWidth,
          `The table should remain horizontally scrollable at ${width}px.`
        );
      }
      await page.evaluate(() => window.scrollTo(10000, 0));
      assert.equal(
        await page.evaluate(() => window.scrollX),
        0,
        `The UI Kit demo should not horizontally scroll at ${width}px.`
      );
    }
    assert.deepEqual(pageErrors, []);
  } finally {
    await browser?.close();
    await server.close();
  }
});
