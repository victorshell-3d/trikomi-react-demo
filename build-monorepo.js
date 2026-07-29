import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Load .env file manually so we don't need the dotenv package
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  });
}
import crypto from 'crypto';

const appsDir = path.resolve('apps');
const apps = fs.readdirSync(appsDir).filter(name => fs.statSync(path.join(appsDir, name)).isDirectory());
const rootDist = path.resolve('dist');

// Clean root dist
if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}
fs.mkdirSync(rootDist, { recursive: true });
fs.mkdirSync(path.join(rootDist, 'assets'), { recursive: true });

console.log('Building all packages first...\n');
const packagesDir = path.resolve('packages');
if (fs.existsSync(packagesDir)) {
  const packages = fs.readdirSync(packagesDir).filter(name => fs.statSync(path.join(packagesDir, name)).isDirectory());
  // Ensure core is built first if it hasn't been
  if (packages.includes('core')) {
    try {
      execSync(`pnpm --dir packages/core build`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`Failed to build core. Skipping...`);
    }
  }
  for (const pkg of packages) {
    if (pkg === 'core') continue;
    console.log(`================================`);
    console.log(`Building package ${pkg}...`);
    console.log(`================================`);
    try {
      execSync(`pnpm --dir packages/${pkg} build`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`Failed to build package ${pkg}. Skipping...`);
      continue;
    }
  }
}

console.log('Building all apps to a single shared dist folder...\n');
for (const app of apps) {
  console.log(`================================`);
  console.log(`Building ${app}...`);
  console.log(`================================`);

  // Build the app
  try {
    execSync(`pnpm --dir apps/${app} build`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to build ${app}. Skipping...`);
    continue;
  }

  const appDist = path.join(rootDist, app);
  if (!fs.existsSync(appDist)) {
    console.warn(`No dist folder found for ${app}.`);
    continue;
  }

  // No manual HTML rewriting needed! 
  // Vite natively handles all asset paths (including import.meta.env.BASE_URL) when a base path is configured.
  // We simply copy the built HTML as-is.
  const appIndexHtml = path.join(appDist, 'index.html');
  if (fs.existsSync(appIndexHtml)) {
    console.log(`✔ Verified ${app}/index.html exists.`);
  }

  // Move all other files from app root (except assets and index.html) to root dist
  const files = fs.readdirSync(appDist);
  for (const file of files) {
    if (file === 'assets' || file === 'index.html') continue;
    fs.cpSync(path.join(appDist, file), path.join(rootDist, file), { recursive: true });
    fs.rmSync(path.join(appDist, file), { recursive: true, force: true });
  }

  // Merge assets into root dist/assets
  const appAssets = path.join(appDist, 'assets');
  if (fs.existsSync(appAssets)) {
    const assets = fs.readdirSync(appAssets);
    for (const asset of assets) {
      fs.cpSync(path.join(appAssets, asset), path.join(rootDist, 'assets', asset), { recursive: true });
    }
    // Clean up the local assets folder to save space (since they are now in root/assets)
    fs.rmSync(appAssets, { recursive: true, force: true });
  }

  console.log(`✔ Merged ${app} into shared dist and cleaned up local build.\n`);
}

// Copy public assets (models, environments, ml, svgs, lut) to root dist
const publicDir = path.resolve('public');
if (fs.existsSync(publicDir)) {
  const items = fs.readdirSync(publicDir);
  for (const item of items) {
    if (item === 'packages') continue; // Do not copy the local SDK symlink into production build
    fs.cpSync(path.join(publicDir, item), path.join(rootDist, item), { recursive: true, force: true });
  }
  console.log('✔ Copied public assets to dist/\n');
}


// Create apps/ alias subfolder in dist so both /apps/<app> and /<app> links work cleanly
const appsDistAlias = path.join(rootDist, 'apps');
fs.mkdirSync(appsDistAlias, { recursive: true });
for (const app of apps) {
  const appFolder = path.join(rootDist, app);
  if (fs.existsSync(appFolder)) {
    fs.cpSync(appFolder, path.join(appsDistAlias, app), { recursive: true });
  }
}
console.log('✔ Created /apps/ routing aliases in dist/\n');

// Copy and adjust root index.html to dist/index.html
const rootIndexHtml = path.resolve('index.html');
if (fs.existsSync(rootIndexHtml)) {
  let htmlContent = fs.readFileSync(rootIndexHtml, 'utf8');
  // Replace links like /apps/viewer/index.html with relative viewer/index.html
  htmlContent = htmlContent.replace(/(?:\/|\.\/)?apps\/([^\/]+)\/index\.html/g, '$1/index.html');
  fs.writeFileSync(path.join(rootDist, 'index.html'), htmlContent);
  console.log('✔ Copied and updated root index.html to dist/index.html\n');
}

// Copy docs/ into dist/docs/
const docsDir = path.resolve('docs');
if (fs.existsSync(docsDir)) {
  fs.cpSync(docsDir, path.join(rootDist, 'docs'), { recursive: true });
  console.log('✔ Copied docs/ to dist/docs/\n');
}

// Monorepo Integrity Signature removed as requested

console.log('✅ Monorepo build complete! All apps are in the ./dist directory sharing a single ./dist/assets folder.');
console.log('Note: To serve this locally, run `npx serve dist` from the project root.');
