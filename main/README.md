# 2D Pixel Art application

This directory contains the Vite/React application for the [2D Pixel Art project](../README.md). Run all npm commands from this directory.

## Runtime and primary packages

- Node.js 24.19.0 and npm 11.17.0
- React and React DOM 19.2.8
- Vite 8.2.1 with `@vitejs/plugin-react` 6.0.5
- TypeScript 6.0.3
- Tailwind CSS and `@tailwindcss/vite` 4.3.3
- ESLint 10.8.1, `@eslint/js` 10.0.1, and `typescript-eslint` 8.66.0
- `react-color` 2.19.3

TypeScript 7 is deferred until the `typescript-eslint` toolchain supports it. `react-color` is a legacy dependency scheduled for replacement.

## Setup

Install Node 24.19.0 with nvm, nvm-windows, or another version manager, then install the expected npm release and locked dependencies:

```bash
npm install --global npm@11.17.0
node --version
npm --version
npm ci
npm run dev
```

On macOS, `brew install node@24` is also available; use nvm when the exact Node patch version matters. See the [root setup guide](../README.md#development-setup) for cloning and platform notes.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

No test framework or `test` script exists yet. Until tests are added, run both `npm run lint` and `npm run build` before committing.

## Application map

- `src/main.tsx` mounts the application in React `StrictMode`.
- `src/App.tsx` owns the editor controls and passes settings/action triggers downward.
- `src/components/Canvas.tsx` owns the drawing bitmap, grid overlay, import/export, fill, and history.
- `src/components/ColorPicker.tsx` wraps the current `react-color` picker.
- `src/styles/index.css` imports Tailwind and defines the bundled Pixelify Sans faces.
- `vite.config.ts` configures React, Tailwind, and the GitHub Pages project base path.

The app is browser-only and has no backend or automatic artwork persistence. See the root README for current features, architecture details, Pages activation instructions, and the prioritized finishing roadmap.
