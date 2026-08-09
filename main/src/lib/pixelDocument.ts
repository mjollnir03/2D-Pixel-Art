export const GRID_SIZE = 40;
export const MAX_HISTORY_STATES = 50;

export type PixelColor = string | null;

export type GridPoint = {
  x: number;
  y: number;
};

export type PixelDocument = {
  background: string;
  cells: PixelColor[];
};

export type DocumentHistory = {
  past: PixelDocument[];
  present: PixelDocument;
  future: PixelDocument[];
};

export type CanvasRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ImageDimensions = {
  width: number;
  height: number;
};

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10] as const;

export function createPixelDocument(background: string): PixelDocument {
  return {
    background,
    cells: Array<PixelColor>(GRID_SIZE * GRID_SIZE).fill(null),
  };
}

export function createHistory(document: PixelDocument): DocumentHistory {
  return { past: [], present: document, future: [] };
}

export function isPointInGrid(point: GridPoint): boolean {
  return (
    point.x >= 0 &&
    point.x < GRID_SIZE &&
    point.y >= 0 &&
    point.y < GRID_SIZE
  );
}

export function pointToIndex(point: GridPoint): number {
  return point.y * GRID_SIZE + point.x;
}

export function clientPointToGrid(
  clientX: number,
  clientY: number,
  rect: CanvasRect,
): GridPoint | null {
  if (
    rect.width <= 0 ||
    rect.height <= 0 ||
    clientX < rect.left ||
    clientY < rect.top ||
    clientX >= rect.left + rect.width ||
    clientY >= rect.top + rect.height
  ) {
    return null;
  }

  return {
    x: Math.min(
      GRID_SIZE - 1,
      Math.floor(((clientX - rect.left) / rect.width) * GRID_SIZE),
    ),
    y: Math.min(
      GRID_SIZE - 1,
      Math.floor(((clientY - rect.top) / rect.height) * GRID_SIZE),
    ),
  };
}

export function getCell(
  cells: readonly PixelColor[],
  point: GridPoint,
): PixelColor {
  return cells[pointToIndex(point)] ?? null;
}

export function paintCell(
  cells: readonly PixelColor[],
  point: GridPoint,
  color: PixelColor,
): PixelColor[] {
  if (!isPointInGrid(point)) return cells as PixelColor[];

  const index = pointToIndex(point);
  if (cells[index] === color) return cells as PixelColor[];

  const next = [...cells];
  next[index] = color;
  return next;
}

export function linePoints(from: GridPoint, to: GridPoint): GridPoint[] {
  const points: GridPoint[] = [];
  let x = from.x;
  let y = from.y;
  const dx = Math.abs(to.x - from.x);
  const sx = from.x < to.x ? 1 : -1;
  const dy = -Math.abs(to.y - from.y);
  const sy = from.y < to.y ? 1 : -1;
  let error = dx + dy;

  while (true) {
    points.push({ x, y });
    if (x === to.x && y === to.y) break;
    const doubledError = error * 2;
    if (doubledError >= dy) {
      error += dy;
      x += sx;
    }
    if (doubledError <= dx) {
      error += dx;
      y += sy;
    }
  }

  return points;
}

export function paintLine(
  cells: readonly PixelColor[],
  from: GridPoint,
  to: GridPoint,
  color: PixelColor,
): PixelColor[] {
  let next: PixelColor[] | null = null;

  for (const point of linePoints(from, to)) {
    if (!isPointInGrid(point)) continue;
    const index = pointToIndex(point);
    const current = next ?? cells;
    if (current[index] === color) continue;
    if (!next) next = [...cells];
    next[index] = color;
  }

  return next ?? (cells as PixelColor[]);
}

export function floodFill(
  cells: readonly PixelColor[],
  start: GridPoint,
  replacement: PixelColor,
): PixelColor[] {
  if (!isPointInGrid(start)) return cells as PixelColor[];

  const target = getCell(cells, start);
  if (target === replacement) return cells as PixelColor[];

  const next = [...cells];
  const visited = new Uint8Array(GRID_SIZE * GRID_SIZE);
  const queue: number[] = [pointToIndex(start)];
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const index = queue[queueIndex++];
    if (visited[index]) continue;
    visited[index] = 1;
    if (next[index] !== target) continue;

    next[index] = replacement;
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);

    if (x > 0) queue.push(index - 1);
    if (x < GRID_SIZE - 1) queue.push(index + 1);
    if (y > 0) queue.push(index - GRID_SIZE);
    if (y < GRID_SIZE - 1) queue.push(index + GRID_SIZE);
  }

  return next;
}

export function commitHistory(
  history: DocumentHistory,
  document: PixelDocument,
): DocumentHistory {
  if (
    document === history.present ||
    (document.background === history.present.background &&
      document.cells === history.present.cells)
  ) {
    return history;
  }

  const past = [...history.past, history.present].slice(
    -(MAX_HISTORY_STATES - 1),
  );
  return { past, present: document, future: [] };
}

export function undoHistory(history: DocumentHistory): DocumentHistory {
  const previous = history.past.at(-1);
  if (!previous) return history;

  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  };
}

export function redoHistory(history: DocumentHistory): DocumentHistory {
  const [next, ...remaining] = history.future;
  if (!next) return history;

  return {
    past: [...history.past, history.present].slice(
      -(MAX_HISTORY_STATES - 1),
    ),
    present: next,
    future: remaining,
  };
}

export function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function parsePngDimensions(
  bytes: ArrayLike<number>,
): ImageDimensions | null {
  if (bytes.length < 24) return null;
  if (PNG_SIGNATURE.some((byte, index) => bytes[index] !== byte)) return null;
  if (
    bytes[8] !== 0 ||
    bytes[9] !== 0 ||
    bytes[10] !== 0 ||
    bytes[11] !== 13 ||
    bytes[12] !== 73 ||
    bytes[13] !== 72 ||
    bytes[14] !== 68 ||
    bytes[15] !== 82
  ) {
    return null;
  }

  const readUint32 = (offset: number) =>
    bytes[offset] * 0x1000000 +
    bytes[offset + 1] * 0x10000 +
    bytes[offset + 2] * 0x100 +
    bytes[offset + 3];
  const width = readUint32(16);
  const height = readUint32(20);
  if (width === 0 || height === 0) return null;
  return { width, height };
}

export function validatePngFile(
  file: Pick<File, "size" | "type">,
  maxBytes = 20 * 1024 * 1024,
): string | null {
  if (file.type !== "image/png") return "Choose a PNG image file.";
  if (file.size > maxBytes) return "Choose a PNG no larger than 20 MiB.";
  return null;
}
