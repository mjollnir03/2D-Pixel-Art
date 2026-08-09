# 2D Pixel Art

A browser-based pixel-art editor built with React, TypeScript, Vite, and Tailwind CSS. The application runs entirely in the browser: there is no backend, account system, or remote storage.

Planned GitHub Pages URL: [https://mjollnir03.github.io/2D-Pixel-Art/](https://mjollnir03.github.io/2D-Pixel-Art/). Pages is currently disabled, so the URL will return 404 until the deployment setup below is enabled and pushed.

The Vite application lives in [`main/`](main/). Run all npm commands from that directory.

## Current stack

| Tool | Version | Purpose |
| --- | ---: | --- |
| Node.js | 24.19.0 | Local and CI runtime |
| npm | 11.17.0 | Package manager and lockfile |
| React / React DOM | 19.2.8 | User interface |
| Vite | 8.2.1 | Development server and production build |
| `@vitejs/plugin-react` | 6.0.5 | React integration for Vite |
| TypeScript | 6.0.3 | Strictly typed application code |
| Tailwind CSS / `@tailwindcss/vite` | 4.3.3 | Styling and Vite integration |
| ESLint | 10.8.1 | Static analysis |
| `@eslint/js` | 10.0.1 | Core JavaScript lint rules |
| `typescript-eslint` | 8.66.0 | TypeScript ESLint support |
| `react-color` | 2.19.3 | Current color-picker UI |

TypeScript 7 is intentionally deferred until it is supported by the project's `typescript-eslint` toolchain. `react-color` is a legacy dependency retained for compatibility; replacing it is part of the finishing roadmap.

Pixelify Sans is bundled locally in [`main/public/fonts/`](main/public/fonts/). The repository is MIT licensed.

## How the application works

The data flow is deliberately small:

1. [`main/index.html`](main/index.html) loads [`main/src/main.tsx`](main/src/main.tsx), which mounts React in `StrictMode`.
2. [`main/src/App.tsx`](main/src/App.tsx) owns the toolbar state: tool selection, pen and canvas colors, grid visibility, canvas size, and action triggers.
3. [`main/src/components/Canvas.tsx`](main/src/components/Canvas.tsx) owns the bitmap, drawing events, grid overlay, PNG import/export, bucket fill, and undo/redo history.
4. The editor stacks a drawing canvas under a pointer-transparent grid canvas. Drawing coordinates are snapped to logical cells.
5. Save and load use browser APIs. No artwork is sent to a server or automatically persisted.

Every configured canvas size contains a 40 x 40 logical grid. The 400, 600, 800, and 1000 options change the exported image dimensions and cell scale, not the number of logical cells.

## Current features

- Pen, eraser, and contiguous bucket-fill tools
- Pen and canvas color pickers
- Toggleable grid overlay
- 400, 600, 800, and 1000-pixel canvas output
- PNG download and PNG import, including a dimension-mismatch warning
- Undo and redo with up to 50 bitmap snapshots
- Confirmed canvas reset and canvas-size changes
- Initial canvas sizing based on viewport width

## Development setup

Clone the repository first:

```bash
git clone https://github.com/mjollnir03/2D-Pixel-Art.git
cd 2D-Pixel-Art
```

### nvm (recommended for an exact Node version)

On macOS or Linux, install [nvm](https://github.com/nvm-sh/nvm), then run:

```bash
nvm install 24.19.0
nvm use 24.19.0
npm install --global npm@11.17.0
```

On Windows, use [nvm-windows](https://github.com/coreybutler/nvm-windows) and run the same `nvm install` and `nvm use` commands in PowerShell. A direct Node.js installation also works, provided `node --version` and `npm --version` match the versions above.

### Homebrew

On macOS, Homebrew can install the Node 24 release line:

```bash
brew install node@24
brew link --overwrite --force node@24
npm install --global npm@11.17.0
```

Use nvm when an exact Node patch version is required.

### Install and run

```bash
cd main
node --version
npm --version
npm ci
npm run dev
```

Vite prints the local development URL. Stop the server with `Ctrl+C`.

## Available scripts

Run these from `main/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create the production build in `main/dist/` |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Serve the production build locally |

There is no automated test suite yet, so `npm run lint` and `npm run build` are the current required validation checks.

## GitHub Pages deployment

The repository's Pages workflow installs the locked dependencies from `main/`, runs lint and build checks, and publishes `main/dist/` when `main` is updated. The Vite base path is configured for the `/2D-Pixel-Art/` project URL.

One repository setting must be enabled before the workflow can publish:

1. Open the GitHub repository.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` or manually run the Pages workflow from the **Actions** tab.

After the first successful workflow deployment, the application will be available at [https://mjollnir03.github.io/2D-Pixel-Art/](https://mjollnir03.github.io/2D-Pixel-Art/). It currently returns 404 because Pages is disabled for the repository.

## Finishing roadmap

1. **Correct canvas history and background behavior.** Store canvas settings with history, so undoing a background change cannot desynchronize the bitmap and eraser color. Track background cells explicitly instead of recoloring every painted pixel that happens to match the old background.
2. **Reduce history memory and color-change work.** Fifty full 1000 x 1000 `ImageData` snapshots use roughly 200 MB before overhead. Use bounded diffs, compressed snapshots, or fewer checkpoints, and avoid recording every intermediate color-picker update.
3. **Complete pointer and responsive support.** Replace mouse-only handlers with pointer events, add touch behavior, interpolate fast strokes to prevent skipped cells, and scale the canvas to narrow viewports without changing its backing resolution.
4. **Add automated coverage and CI validation.** Test bucket fill, history branching, coordinate conversion, PNG import, and background changes; then add browser-level drawing and deployment smoke tests.
5. **Modernize the remaining UI.** Replace legacy `react-color`, add accessible canvas/tool labels and keyboard operation, and disable undo/redo when unavailable.
6. **Confirm the final product scope.** Decide whether to restore features preserved on the `old-version` branch: eyedropper, rainbow drawing, fill-all, and variable logical grid resolution. Consider local autosave after the core behavior is stable.
