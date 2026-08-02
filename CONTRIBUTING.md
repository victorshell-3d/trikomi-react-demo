# Contributing to Trikomi React Demos

First off, thank you for considering contributing to the Trikomi React Demos! It's people like you that make the Trikomi ecosystem such a great tool for developers.

## 1. How to Contribute

We follow the standard GitHub **Fork & Pull Request** workflow for external contributions.

1. **Fork the repository** to your own GitHub account.
2. **Clone your fork** locally: `git clone https://github.com/your-username/3dviewer-demo.git`
3. **Create a new branch** for your feature or bugfix: `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-bugfix-name`
4. **Commit your changes** following our commit guidelines.
5. **Push your branch** to your fork: `git push origin feature/your-feature-name`
6. **Submit a Pull Request** to our `main` branch.

## 2. Development Setup

This repository uses [pnpm](https://pnpm.io/) as its package manager and Vite for tooling.

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server for a specific app (e.g., jewelry-configurator)
pnpm --filter jewelry-configurator dev
```

## 3. Code Style & Guidelines

*   **TypeScript:** All new code should be strictly typed using TypeScript.
*   **MobX:** Respect the two-way state binding architecture. Do not mutate the Three.js scene graph directly if a MobX `viewerStore` action exists to handle it.
*   **Linting:** Ensure your code passes all ESLint rules before submitting a PR.
*   **Formatting:** We use Prettier. Please ensure your IDE is configured to format on save, or run the formatter manually.

## 4. Pull Request Process

1. Provide a clear, descriptive title for your Pull Request.
2. Ensure any new React components or UI changes are fully responsive.
3. If your PR introduces a new demonstration feature, please ensure it utilizes the `enableOnDemandRendering` architecture to respect GPU battery limits.
4. Maintainers will review your code and may request changes before merging.

Thank you for contributing!
