# 2D Pixel Art

A browser-based 2D pixel-art editor built with React, TypeScript, Vite, and Tailwind CSS.

## Workspace

This project is stored in WSL while being developed from Windows 11 and VSCode.

Windows File Explorer path to the WSL projects folder:

```text
\\wsl.localhost\Ubuntu-24.04\home\ellmaer-ranjber\Projects
```

Repository path:

```text
\\wsl.localhost\Ubuntu-24.04\home\ellmaer-ranjber\Projects\2D-Pixel-Art
```

WSL path:

```bash
/home/ellmaer-ranjber/Projects/2D-Pixel-Art
```

The Vite app lives in the `main/` folder.

## Target Runtime And Versions

Use the VSCode WSL terminal and run project commands from `main/`.

Target local runtime:

- Node.js `24.15.0`
- npm `11.13.0`

Target package upgrade baseline:

- React latest stable: `19.2.6`
- Vite latest stable: `8.0.14`

These React and Vite versions were checked against npm on May 23, 2026. npm may advertise a newer CLI than the project baseline; this project intentionally documents npm `11.13.0` as the planned local version.

## Current Checked-In Package State

The project has not yet been upgraded to the target package baseline. Current checked-in ranges include:

- React `^19.1.1`
- React DOM `^19.1.1`
- Vite `^7.1.7`
- TypeScript `~5.8.3`
- Tailwind CSS `^4.1.13`
- `@tailwindcss/vite` `^4.1.13`

The committed lockfile currently resolves Vite to `7.1.12` and React to `19.1.1`.

## Tech Stack

- React for the UI
- TypeScript for typed app code
- Vite for development server and production build
- Tailwind CSS v4 for utility styling
- `react-color` for the color picker UI
- ESLint flat config for linting
- npm with `package-lock.json` for dependency locking
- Pixelify Sans font files stored in `main/public/fonts/`

## Project Structure

```text
2D-Pixel-Art/
  README.md
  LICENSE
  main/
    package.json
    package-lock.json
    vite.config.ts
    eslint.config.js
    tsconfig.json
    tsconfig.app.json
    tsconfig.node.json
    index.html
    public/
      vite.svg
      fonts/
    src/
      main.tsx
      App.tsx
      components/
        Button.tsx
        Canvas.tsx
        ColorPicker.tsx
        Header.tsx
      styles/
        App.css
        index.css
```

## App Features

- Pen, eraser, and bucket-fill tools
- Pen color and canvas color pickers
- Toggleable grid overlay
- Canvas sizes of `400`, `600`, `800`, and `1000`
- PNG save/download
- PNG load/import
- Undo and redo history
- Canvas reset

## Setup

From a WSL terminal:

```bash
cd /home/ellmaer-ranjber/Projects/2D-Pixel-Art/main
node --version
npm --version
npm install
```

Expected local versions:

```text
node v24.15.0
npm 11.13.0
```

## Planned Package Upgrade

When ready to update all npm packages, run the upgrade from `main/`:

```bash
npm install react@latest react-dom@latest vite@latest
npm install @vitejs/plugin-react@latest @tailwindcss/vite@latest tailwindcss@latest react-color@latest
npm install -D typescript@latest eslint@latest @eslint/js@latest typescript-eslint@latest
npm install -D eslint-plugin-react-hooks@latest eslint-plugin-react-refresh@latest globals@latest
npm install -D @types/react@latest @types/react-dom@latest @types/react-color@latest
```

After upgrading:

```bash
npm run lint
npm run build
npm run dev
```

## Scripts

Run these from `main/`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
