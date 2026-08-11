# 2D Pixel Art application notes

This directory contains the React application for the 2D Pixel Art editor. These notes describe what the project does, how it is organized, and how to run and maintain it.

The published editor is available at [https://mjollnir03.github.io/2D-Pixel-Art/](https://mjollnir03.github.io/2D-Pixel-Art/).

## Project scope

The editor always uses a 40 × 40 logical grid, for a total of 1,600 cells. The canvas scales to fit the browser window, while the selected canvas size controls the resolution of the downloaded PNG. There is no backend, account system, analytics, cloud storage, or automatic artwork recovery after the page is closed.

The editor includes:

- Pen, eraser, and contiguous bucket-fill tools
- Separate pen and canvas color controls
- Mouse, touch, and stylus drawing with continuous strokes
- A responsive layout for phone, tablet, and desktop screens
- A visual grid that does not appear in exported artwork
- Undo and redo for drawing, imports, resets, and canvas-color changes
- PNG import into the fixed grid
- PNG export at 400, 600, 800, or 1000 pixels square

## Using the editor

1. Choose **Pen**, **Eraser**, or **Bucket**.
2. Choose the pen and canvas colors.
3. Draw or erase by dragging across the canvas. Bucket fills the connected region that is selected.
4. Use **Undo** and **Redo** to move through the edit history.
5. Use **Line-Toggle** to show or hide the editor grid.
6. Select **Canvas-Size** to cycle through the available PNG resolutions. This does not change the 40 × 40 logical grid or clear the artwork.
7. Select **Save** to download the artwork or **Load** to import a PNG.
8. Select **Reset-Canvas** to open the confirmation notice at the top of the page. Confirm **Reset** to clear the drawing. A reset can be undone.

Artwork is kept only in the current browser session, so save a PNG before closing or reloading the page.

### Small-screen layout

- On narrow or short screens, the canvas appears first and Undo and Redo sit together underneath it.
- The canvas is limited by both the available width and the dynamic screen height so phone landscape mode remains usable.
- Controls use compact, touch-friendly sizing on smaller screens, and the page edges and reset notice account for device safe areas.
- Viewports at least 768 pixels wide and 600 pixels tall retain the original side-button canvas layout.

### PNG import behavior

- Accepted files must be PNG images no larger than 20 MiB.
- Images may be at most 8192 pixels on either side and 32 megapixels in total.
- A 40, 400, 600, 800, or 1000-pixel square PNG imports directly. Other dimensions require confirmation before being sampled into the 40 × 40 grid.
- Transparent pixels and pixels matching the current canvas color become background cells.
- Loading over existing work opens a confirmation notice at the top of the page, and a completed import can be undone.

## Technology in use

The expected local environment is Node.js 24.19.0 with npm 11.17.0. The versions below are the direct packages currently used by the application; the lockfile records the full resolved dependency tree.

| Package | Version | Purpose |
| --- | ---: | --- |
| React / React DOM | 19.2.8 | User interface and browser rendering |
| Vite | 8.2.1 | Development server and production build |
| TypeScript | 6.0.3 | Static typing and production type-checking |
| Tailwind CSS / Vite plugin | 4.3.3 | Styling |
| Vite React plugin | 6.0.5 | React compilation and refresh support |
| ESLint | 10.8.1 | Source-code checks |
| typescript-eslint | 8.66.0 | TypeScript rules for ESLint |

Supporting packages include `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, and the React type definitions. Pixelify Sans is bundled in `public/fonts/`.

## Environment setup

From the repository root, use the checked-in Node version and install the expected npm version:

```bash
nvm install
nvm use
npm install --global npm@11.17.0
```

Then install and start the application:

```bash
cd main
node --version
npm --version
npm ci
npm run dev
```

Vite prints the local development address in the terminal.

## Development commands

Run these commands from this `main/` directory.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run lint` | Check the source with ESLint |
| `npm run build` | Type-check and create the production files in `dist/` |
| `npm run check` | Run lint and the production build |
| `npm run preview` | Serve the built application locally |
| `npm audit` | Check installed packages for reported vulnerabilities |

For a clean local validation:

```bash
npm ci
npm run check
npm audit
```

## Application map

- `index.html` is the browser entry document.
- `src/main.tsx` mounts the React application.
- `src/App.tsx` owns the controls, colors, grid visibility, history-button state, and PNG resolution.
- `src/components/Canvas.tsx` handles pointer drawing, rendering, history, and PNG import/export.
- `src/lib/pixelDocument.ts` contains the 40 × 40 document model, line drawing, fill logic, coordinate conversion, import validation, and bounded history operations.
- `src/components/Button.tsx`, `ColorPicker.tsx`, and `Header.tsx` contain the reusable interface pieces.
- `src/styles/index.css` loads Tailwind and the bundled Pixelify Sans font.
- `vite.config.ts` enables React and Tailwind and sets the `/2D-Pixel-Art/` production base path.
- `package.json` defines the direct packages and scripts; `package-lock.json` pins the complete install.

## Updating the website icon

The browser-tab icon is `public/pixel-art.svg`, referenced by the favicon link in `index.html`. To use another SVG, replace that file while keeping the same filename. To use a PNG or ICO file instead, place it in `public/` and update both the `href` and `type` values on the `<link rel="icon">` element in `index.html`. Use a square icon; browsers may require a hard refresh or reopened tab before a cached favicon changes.

## GitHub Pages deployment

The workflow at `../.github/workflows/deploy-pages.yml` runs for pull requests, pushes to `main`, and manual requests. It installs locked packages, audits them, lints the source, and builds the application. A successful `main` build uploads only `main/dist/` and deploys that artifact to GitHub Pages.

GitHub repository settings must use **Settings → Pages → Build and deployment → Source: GitHub Actions**. The README files and source directory are not the published website.

## Troubleshooting

- If npm reports an unsupported engine, run `nvm use` from the repository root and confirm Node 24 and npm 11 are active.
- If local assets do not load, use `npm run dev` or `npm run preview` instead of opening `dist/index.html` directly.
- If GitHub Pages shows repository content or a 404, confirm that Pages uses GitHub Actions and inspect the latest deployment workflow run.
- If a PNG is rejected, confirm its file type, file size, dimensions, and total pixel count against the import limits above.
- If artwork disappears after a refresh, it was not saved; automatic persistence is intentionally outside the current project scope.
