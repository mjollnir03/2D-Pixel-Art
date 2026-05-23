# 2D Pixel Art App

This folder contains the Vite React app for the 2D Pixel Art editor.

For the full project overview, WSL/Windows path notes, target runtime versions, and package upgrade plan, see the root `README.md`.

## Target Runtime

Run commands from this folder in the VSCode WSL terminal.

```text
Node.js 24.15.0
npm 11.13.0
React latest stable 19.2.6
Vite latest stable 8.0.14
```

React and Vite latest stable versions were checked against npm on May 23, 2026.

## Setup

```bash
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## App Entry Points

- `src/main.tsx` mounts the React app.
- `src/App.tsx` owns the main editor state and toolbar layout.
- `src/components/Canvas.tsx` contains the drawing canvas, PNG import/export, bucket fill, grid, and undo/redo behavior.
- `src/styles/index.css` imports Tailwind and defines the Pixelify Sans font faces.
