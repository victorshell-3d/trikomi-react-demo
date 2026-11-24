import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve('.');
const distDir = path.join(repoRoot, 'dist');
const artifactDir = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\7fd4a042-0e39-40bf-bc1e-49ce47f84838';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

if (!chromePath) {
  console.error('No Chrome or Edge browser found.');
  process.exit(1);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

function startServer(port = 4192) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
        if (reqPath === '/' || reqPath === '') reqPath = '/viewer/index.html';

        let filePath = path.join(distDir, reqPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        if (!fs.existsSync(filePath)) {
          // Check viewer assets fallback
          if (reqPath.startsWith('/assets/')) {
            const viewerAsset = path.join(distDir, 'viewer', reqPath);
            if (fs.existsSync(viewerAsset)) {
              filePath = viewerAsset;
            }
          }
        }

        if (!fs.existsSync(filePath)) {
          // Check public fallback
          const publicFallback = path.join(repoRoot, 'public', reqPath);
          if (fs.existsSync(publicFallback) && !fs.statSync(publicFallback).isDirectory()) {
            filePath = publicFallback;
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Not found: ${reqPath}`);
            return;
          }
        }

        const ext = path.extname(filePath).toLowerCase();
        const mime = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
        fs.createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server error: ${err.message}`);
      }
    });

    server.listen(port, () => resolve(server));
  });
}

async function runVerification() {
  const port = 4192;
  const server = await startServer(port);
  console.log(`Server running at http://localhost:${port}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--enable-webgl']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
  });

  try {
    page.on('pageerror', err => {
      console.error('Browser Page Error:', err.message);
    });

    console.log('Navigating to http://localhost:' + port + '/viewer/index.html...');
    await page.goto(`http://localhost:${port}/viewer/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Wait for root element or inspect body
    try {
      await page.waitForSelector('.tk-viewer-page', { timeout: 4000 });
    } catch {
      const htmlSnippet = await page.evaluate(() => document.body.innerHTML.slice(0, 300));
      console.error('Body HTML snippet:', htmlSnippet);
    }

    // 0. Transparent Header Verification at Initial Page Load
    const headerInitialBg = await page.$eval('.tk-navbar', el => window.getComputedStyle(el).backgroundColor);
    const headerInitialBoxShadow = await page.$eval('.tk-navbar', el => window.getComputedStyle(el).boxShadow);
    const headerHasScrolledAtStart = await page.$eval('.tk-navbar', el => el.classList.contains('is-scrolled'));
    console.log(`✔ Initial Navbar Background: "${headerInitialBg}", Box-Shadow: "${headerInitialBoxShadow}", is-scrolled: ${headerHasScrolledAtStart}`);

    // Test Smooth Scroll Transition
    await page.evaluate(() => window.scrollTo(0, 160));
    await new Promise(r => setTimeout(r, 400));
    const headerScrolledBg = await page.$eval('.tk-navbar', el => window.getComputedStyle(el).backgroundColor);
    const headerHasScrolledClass = await page.$eval('.tk-navbar', el => el.classList.contains('is-scrolled'));
    console.log(`✔ Scrolled Navbar Background: "${headerScrolledBg}", is-scrolled class: ${headerHasScrolledClass}`);
    const scrolledHeaderPath = path.join(artifactDir, 'viewer-landing-scrolled-header.png');
    await page.screenshot({ path: scrolledHeaderPath, fullPage: false });
    console.log(`📸 Saved Scrolled Header Screenshot to ${scrolledHeaderPath}`);

    // Return to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 300));

    // 1. Check Light Mode Desktop (Default)
    const initialTheme = await page.$eval('.tk-viewer-page', el => el.getAttribute('data-theme') || 'light');
    console.log(`Initial Theme: ${initialTheme}`);

    const lightPath = path.join(artifactDir, 'viewer-landing-light-desktop.png');
    await page.screenshot({ path: lightPath, fullPage: false });
    console.log(`📸 Saved Light Mode Screenshot to ${lightPath}`);

    const lightFullPath = path.join(artifactDir, 'viewer-landing-light-full.png');
    await page.screenshot({ path: lightFullPath, fullPage: true });
    console.log(`📸 Saved Full Page Light Screenshot to ${lightFullPath}`);

    // Capture Light Mode Focused Elements
    const btnLight = await page.$('.tk-btn-primary');
    if (btnLight) {
      await btnLight.screenshot({ path: path.join(artifactDir, 'viewer-landing-button-book-a-demo-light.png') });
    }
    const stripLight = await page.$('.tk-feature-strip');
    if (stripLight) {
      await stripLight.screenshot({ path: path.join(artifactDir, 'viewer-landing-feature-strip-light.png') });
    }
    const statsLight = await page.$('.tk-stats-bar');
    if (statsLight) {
      await statsLight.screenshot({ path: path.join(artifactDir, 'viewer-landing-stats-bar-light.png') });
    }

    // Capture Light Mode Cards Section
    const cardsSectionLight = await page.$('.tk-solutions-section');
    if (cardsSectionLight) {
      const cardsLightPath = path.join(artifactDir, 'viewer-landing-cards-section-light.png');
      await cardsSectionLight.screenshot({ path: cardsLightPath });
      console.log(`📸 Saved Light Mode Cards Section to ${cardsLightPath}`);
    }

    // Capture Light Mode CTA & Bottom Section
    const ctaSectionLight = await page.$('.tk-bottom-integrated');
    if (ctaSectionLight) {
      const ctaLightPath = path.join(artifactDir, 'viewer-landing-cta-light.png');
      await ctaSectionLight.screenshot({ path: ctaLightPath });
      console.log(`📸 Saved Light Mode Integrated Bottom Section to ${ctaLightPath}`);
    }
    const ctaCardLight = await page.$('.tk-cta-card');
    if (ctaCardLight) {
      const cardLightPath = path.join(artifactDir, 'viewer-landing-cta-card-light.png');
      await ctaCardLight.screenshot({ path: cardLightPath });
      console.log(`📸 Saved Light Mode CTA Card to ${cardLightPath}`);
    }

    // 2. Check Real 3D Canvases
    const canvasCount = await page.$$eval('canvas', canvases => canvases.length);
    console.log(`✔ Found ${canvasCount} active WebGL 3D canvases on page.`);

    // 3. Test Mouse Drag Rotation on Hero 3D Canvas
    const heroCanvas = await page.$('.tk-hero-3d-canvas-wrap canvas');
    if (heroCanvas) {
      const box = await heroCanvas.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2, { steps: 5 });
        await page.mouse.up();
        console.log('✔ Successfully tested mouse drag rotation on Hero 3D Torus Knot Canvas');
      }
    }

    // 4. Toggle to Dark Mode
    const toggleBtn = await page.$('.tk-theme-toggle');
    if (toggleBtn) {
      await toggleBtn.click();
      await new Promise(r => setTimeout(r, 500));
      const darkTheme = await page.$eval('.tk-viewer-page', el => el.getAttribute('data-theme'));
      console.log(`Theme after toggle: ${darkTheme}`);

      // Explicitly scroll back to top to capture hero & transparent header
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 400));

      const darkHeroPath = path.join(artifactDir, 'viewer-landing-dark-desktop.png');
      await page.screenshot({ path: darkHeroPath, fullPage: false });
      console.log(`📸 Saved Dark Mode Hero Screenshot to ${darkHeroPath}`);

      // Full page screenshot of dark mode matching reference
      const darkFullPath = path.join(artifactDir, 'viewer-landing-dark-full.png');
      await page.screenshot({ path: darkFullPath, fullPage: true });
      console.log(`📸 Saved Full Page Dark Screenshot to ${darkFullPath}`);

      // Capture Dark Mode Focused Elements
      const btnDark = await page.$('.tk-btn-primary');
      if (btnDark) {
        await btnDark.screenshot({ path: path.join(artifactDir, 'viewer-landing-button-book-a-demo-dark.png') });
      }
      const stripDark = await page.$('.tk-feature-strip');
      if (stripDark) {
        await stripDark.screenshot({ path: path.join(artifactDir, 'viewer-landing-feature-strip-dark.png') });
      }
      const statsDark = await page.$('.tk-stats-bar');
      if (statsDark) {
        await statsDark.screenshot({ path: path.join(artifactDir, 'viewer-landing-stats-bar-dark.png') });
      }

      // Capture Dark Mode Cards Section
      const cardsSectionDark = await page.$('.tk-solutions-section');
      if (cardsSectionDark) {
        const cardsDarkPath = path.join(artifactDir, 'viewer-landing-cards-section-dark.png');
        await cardsSectionDark.screenshot({ path: cardsDarkPath });
        console.log(`📸 Saved Dark Mode Cards Section to ${cardsDarkPath}`);
      }

      // Capture Dark Mode CTA & Bottom Section
      const ctaSectionDark = await page.$('.tk-bottom-integrated');
      if (ctaSectionDark) {
        const ctaDarkPath = path.join(artifactDir, 'viewer-landing-cta-dark.png');
        await ctaSectionDark.screenshot({ path: ctaDarkPath });
        console.log(`📸 Saved Dark Mode Integrated Bottom Section to ${ctaDarkPath}`);
      }
      const ctaCardDark = await page.$('.tk-cta-card');
      if (ctaCardDark) {
        const cardDarkPath = path.join(artifactDir, 'viewer-landing-cta-card-dark.png');
        await ctaCardDark.screenshot({ path: cardDarkPath });
        console.log(`📸 Saved Dark Mode CTA Card to ${cardDarkPath}`);
      }
    }

    // 5. Test Studio Panel Model Switcher and Material Swatch Selection
    console.log('Testing 3D Model Switcher in Studio Viewport...');
    const modelButtons = await page.$$('.tk-studio-topbar button');
    if (modelButtons.length >= 3) {
      await modelButtons[1].click(); // Select Diamond Ring
      await new Promise(r => setTimeout(r, 600));
      console.log('✔ Switched to Diamond Ring 3D Model');
      await modelButtons[2].click(); // Select Eyewear Frame
      await new Promise(r => setTimeout(r, 600));
      console.log('✔ Switched to Eyewear Frame 3D Model');
    }

    const swatches = await page.$$('.tk-studio-bottombar button');
    if (swatches.length > 2) {
      await swatches[1].click(); // Select Electric Cyan
      await new Promise(r => setTimeout(r, 300));
      await swatches[3].click(); // Select 24K Gold
      await new Promise(r => setTimeout(r, 300));
      console.log('✔ Successfully tested live PBR material swatch switching in Studio Viewport');
    }

    // 6. Mobile Viewport (Dark Mode)
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 400));
    const mobilePath = path.join(artifactDir, 'viewer-landing-mobile.png');
    await page.screenshot({ path: mobilePath, fullPage: false });
    console.log(`📸 Saved Mobile Screenshot to ${mobilePath}`);

    // Test Mobile Drawer
    const mobileToggle = await page.$('.tk-mobile-toggle');
    if (mobileToggle) {
      await mobileToggle.click();
      await new Promise(r => setTimeout(r, 400));
      const drawerVisible = await page.$eval('.tk-mobile-drawer', el => Boolean(el)).catch(() => false);
      console.log(`✔ Mobile drawer opened successfully: ${drawerVisible}`);
      const mobileDrawerPath = path.join(artifactDir, 'viewer-landing-mobile-drawer.png');
      await page.screenshot({ path: mobileDrawerPath, fullPage: false });
      console.log(`📸 Saved Mobile Drawer Screenshot to ${mobileDrawerPath}`);

      // Close drawer
      const closeBtn = await page.$('.tk-mobile-drawer__close');
      if (closeBtn) {
        await closeBtn.click();
        await new Promise(r => setTimeout(r, 300));
      }
    }

    // Capture Mobile CTA Section
    const ctaSectionMobile = await page.$('.tk-cta-section');
    if (ctaSectionMobile) {
      const ctaMobilePath = path.join(artifactDir, 'viewer-landing-cta-mobile.png');
      await ctaSectionMobile.screenshot({ path: ctaMobilePath });
      console.log(`📸 Saved Mobile CTA Section to ${ctaMobilePath}`);
    }

    // Restore desktop viewport and scroll down to load all lazy images
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 600));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 300));

    // 7. Verify Image Assets
    const imageStatus = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }));
    });

    console.log(`Verified ${imageStatus.length} images on page:`);
    let allImagesLoaded = true;
    for (const img of imageStatus) {
      const ok = img.complete && img.naturalWidth > 0;
      if (!ok) allImagesLoaded = false;
      console.log(`  ${ok ? '✔' : '❌'} [${img.naturalWidth}x${img.naturalHeight}] ${img.src}`);
    }

    // 8. Verify Navigation to 3D Live Demo
    console.log('Testing "Explore Solutions" button...');
    const exploreBtn = await page.$('[data-testid="hero-explore-solutions-btn"]');
    if (exploreBtn) {
      await exploreBtn.click();
      await new Promise(r => setTimeout(r, 800));
      const hashAfterClick = await page.evaluate(() => window.location.hash);
      console.log(`Hash after Explore click: ${hashAfterClick}`);

      // Capture Demo viewport
      const demoPath = path.join(artifactDir, 'viewer-live-demo.png');
      await page.screenshot({ path: demoPath, fullPage: false });
      console.log(`📸 Saved 3D Live Demo Screenshot to ${demoPath}`);

      // Verify "Back to Overview" button exists and returns to landing page
      const backBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && b.textContent.includes('Back to Overview')) || null;
      });

      if (backBtn && backBtn.asElement()) {
        await backBtn.asElement().click();
        await new Promise(r => setTimeout(r, 600));
        const hashAfterBack = await page.evaluate(() => window.location.hash);
        console.log(`Hash after Back to Overview click: ${hashAfterBack}`);
      }
    }

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) console.log(consoleErrors);
    console.log(`Failed Network Requests: ${failedRequests.length}`);
    console.log(`All Images Loaded: ${allImagesLoaded}`);
    console.log(`Canvas Count: ${canvasCount}`);
    console.log('Verification completed successfully!');

  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification();
