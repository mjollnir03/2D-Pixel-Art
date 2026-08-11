import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, PointerEvent } from "react";
import {
  GRID_SIZE,
  clientPointToGrid,
  commitHistory,
  createHistory,
  createPixelDocument,
  floodFill,
  parsePngDimensions,
  paintCell,
  paintLine,
  redoHistory,
  rgbToHex,
  undoHistory,
  validatePngFile,
} from "../lib/pixelDocument";
import type {
  DocumentHistory,
  GridPoint,
  PixelColor,
  PixelDocument,
} from "../lib/pixelDocument";

type Tool = "pen" | "eraser" | "bucket";

export type CanvasStatusTone = "info" | "error";

export type CanvasHandle = {
  undo: () => void;
  redo: () => void;
  save: () => void;
  openFilePicker: () => void;
  reset: () => void;
};

type CanvasProps = {
  showGrid?: boolean;
  penColor?: string;
  canvasColor?: string;
  selectedTool?: Tool;
  canvasSize?: number;
  onHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
  onCanvasColorRestore?: (color: string) => void;
  onStatus?: (message: string, tone?: CanvasStatusTone) => void;
  onRequestImportReplace: () => Promise<boolean>;
};

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 8192;
const MAX_IMAGE_PIXELS = 32_000_000;
const SUPPORTED_IMPORT_SIZES = new Set([40, 400, 600, 800, 1000]);
const EDITOR_RENDER_SIZE = 800;

function renderDocument(
  canvas: HTMLCanvasElement,
  pixelDocument: PixelDocument,
  dimension: number,
): boolean {
  if (canvas.width !== dimension) canvas.width = dimension;
  if (canvas.height !== dimension) canvas.height = dimension;

  const context = canvas.getContext("2d");
  if (!context) return false;

  const cellSize = dimension / GRID_SIZE;
  context.imageSmoothingEnabled = false;
  context.fillStyle = pixelDocument.background;
  context.fillRect(0, 0, dimension, dimension);

  pixelDocument.cells.forEach((color, index) => {
    if (!color) return;
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);
    context.fillStyle = color;
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  });

  return true;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas(
  {
    showGrid = false,
    penColor = "#000000",
    canvasColor = "#ffffff",
    selectedTool = "pen",
    canvasSize = 800,
    onHistoryChange,
    onCanvasColorRestore,
    onStatus,
    onRequestImportReplace,
  },
  ref,
) {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundTimerRef = useRef<number | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<GridPoint | null>(null);
  const draftRef = useRef<PixelDocument | null>(null);
  const contextErrorReportedRef = useRef(false);
  const documentVersionRef = useRef(0);
  const importOperationRef = useRef(0);
  const lastCanvasColorRef = useRef(canvasColor);

  const [history, setHistory] = useState<DocumentHistory>(() =>
    createHistory(createPixelDocument(canvasColor)),
  );
  const historyRef = useRef(history);
  const [draftDocument, setDraftDocument] = useState<PixelDocument | null>(null);

  const applyHistory = useCallback((next: DocumentHistory) => {
    if (next === historyRef.current) return;
    documentVersionRef.current += 1;
    historyRef.current = next;
    setHistory(next);
  }, []);

  const commitDocument = useCallback(
    (pixelDocument: PixelDocument) => {
      const next = commitHistory(historyRef.current, pixelDocument);
      applyHistory(next);
      return next.present;
    },
    [applyHistory],
  );

  const clearBackgroundTimer = useCallback(() => {
    if (backgroundTimerRef.current !== null) {
      window.clearTimeout(backgroundTimerRef.current);
      backgroundTimerRef.current = null;
    }
  }, []);

  const ensureCurrentBackground = useCallback(() => {
    clearBackgroundTimer();
    const current = historyRef.current.present;
    if (current.background === canvasColor) return current;
    return commitDocument({ ...current, background: canvasColor });
  }, [canvasColor, clearBackgroundTimer, commitDocument]);

  useEffect(() => {
    historyRef.current = history;
    onHistoryChange?.({
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
    });
  }, [history, onHistoryChange]);

  useLayoutEffect(() => {
    if (lastCanvasColorRef.current === canvasColor) return;
    lastCanvasColorRef.current = canvasColor;
    documentVersionRef.current += 1;
  }, [canvasColor]);

  useEffect(() => {
    clearBackgroundTimer();
    if (canvasColor === historyRef.current.present.background) return;

    backgroundTimerRef.current = window.setTimeout(() => {
      const current = historyRef.current.present;
      if (current.background !== canvasColor) {
        commitDocument({ ...current, background: canvasColor });
        onStatus?.("Background changed.");
      }
      backgroundTimerRef.current = null;
    }, 180);

    return clearBackgroundTimer;
  }, [canvasColor, clearBackgroundTimer, commitDocument, onStatus]);

  const displayedDocument = useMemo(() => {
    if (draftDocument) return draftDocument;
    if (history.present.background === canvasColor) return history.present;
    return { ...history.present, background: canvasColor };
  }, [canvasColor, draftDocument, history.present]);

  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rendered = renderDocument(
      canvas,
      displayedDocument,
      EDITOR_RENDER_SIZE,
    );
    if (!rendered && !contextErrorReportedRef.current) {
      contextErrorReportedRef.current = true;
      onStatus?.(
        "The browser could not create the drawing canvas. Reload the page and try again.",
        "error",
      );
    }
  }, [displayedDocument, onStatus]);

  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    if (canvas.width !== EDITOR_RENDER_SIZE) canvas.width = EDITOR_RENDER_SIZE;
    if (canvas.height !== EDITOR_RENDER_SIZE) canvas.height = EDITOR_RENDER_SIZE;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, EDITOR_RENDER_SIZE, EDITOR_RENDER_SIZE);
    const cellSize = EDITOR_RENDER_SIZE / GRID_SIZE;

    if (showGrid) {
      context.beginPath();
      context.strokeStyle = "rgba(23, 23, 23, 0.32)";
      context.lineWidth = 1;
      for (let step = 1; step < GRID_SIZE; step += 1) {
        const position = step * cellSize;
        context.moveTo(position, 0);
        context.lineTo(position, EDITOR_RENDER_SIZE);
        context.moveTo(0, position);
        context.lineTo(EDITOR_RENDER_SIZE, position);
      }
      context.stroke();
    }
  }, [showGrid]);

  const pointFromPointer = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      return clientPointToGrid(event.clientX, event.clientY, rect);
    },
    [],
  );

  const paintValue: PixelColor = selectedTool === "eraser" ? null : penColor;

  const finishStroke = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const draft = draftRef.current;
    draftRef.current = null;
    setDraftDocument(null);
    if (draft && commitDocument(draft) === draft) {
      onStatus?.(selectedTool === "eraser" ? "Stroke erased." : "Stroke added.");
    }
  }, [commitDocument, onStatus, selectedTool]);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) {
      return;
    }

    const point = pointFromPointer(event);
    if (!point) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const current = ensureCurrentBackground();
    if (selectedTool === "bucket") {
      const cells = floodFill(current.cells, point, penColor);
      commitDocument({ ...current, cells });
      onStatus?.("Filled a connected area.");
      return;
    }

    documentVersionRef.current += 1;
    const cells = paintCell(current.cells, point, paintValue);
    const draft = { ...current, cells };
    isDrawingRef.current = true;
    lastPointRef.current = point;
    draftRef.current = draft;
    setDraftDocument(draft);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !event.isPrimary) return;
    const point = pointFromPointer(event);
    const previous = lastPointRef.current;
    const draft = draftRef.current;
    if (!point || !previous || !draft) return;
    event.preventDefault();
    const cells = paintLine(draft.cells, previous, point, paintValue);
    if (cells !== draft.cells) {
      const nextDraft = { ...draft, cells };
      draftRef.current = nextDraft;
      setDraftDocument(nextDraft);
    }
    lastPointRef.current = point;
  };

  const handlePointerEnd = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    finishStroke();
  };

  const undo = useCallback(() => {
    finishStroke();
    clearBackgroundTimer();
    const current = historyRef.current.present;
    if (current.background !== canvasColor) {
      const committed = commitHistory(historyRef.current, {
        ...current,
        background: canvasColor,
      });
      const next = undoHistory(committed);
      applyHistory(next);
      onCanvasColorRestore?.(next.present.background);
      onStatus?.("Undid the background change.");
      return;
    }

    const next = undoHistory(historyRef.current);
    if (next === historyRef.current) return;
    applyHistory(next);
    onCanvasColorRestore?.(next.present.background);
    onStatus?.("Undid the last change.");
  }, [
    applyHistory,
    canvasColor,
    clearBackgroundTimer,
    finishStroke,
    onCanvasColorRestore,
    onStatus,
  ]);

  const redo = useCallback(() => {
    finishStroke();
    clearBackgroundTimer();
    const current = historyRef.current.present;
    if (current.background !== canvasColor) {
      applyHistory(
        commitHistory(historyRef.current, {
          ...current,
          background: canvasColor,
        }),
      );
      onStatus?.("Background changed. Redo history was cleared.");
      return;
    }

    const next = redoHistory(historyRef.current);
    if (next === historyRef.current) return;
    applyHistory(next);
    onCanvasColorRestore?.(next.present.background);
    onStatus?.("Redid the last change.");
  }, [
    applyHistory,
    canvasColor,
    clearBackgroundTimer,
    finishStroke,
    onCanvasColorRestore,
    onStatus,
  ]);

  const reset = useCallback(() => {
    finishStroke();
    const next = createPixelDocument(canvasColor);
    commitDocument(next);
    onStatus?.("Canvas reset. Use Undo to restore it.");
  }, [canvasColor, commitDocument, finishStroke, onStatus]);

  const save = useCallback(() => {
    finishStroke();
    const current = ensureCurrentBackground();
    const exportCanvas = window.document.createElement("canvas");

    try {
      if (!renderDocument(exportCanvas, current, canvasSize)) {
        onStatus?.("Could not prepare the PNG. Reload the page and try again.", "error");
        return;
      }

      exportCanvas.toBlob((blob) => {
        try {
          if (!blob) {
            onStatus?.("The browser could not create the PNG file.", "error");
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = window.document.createElement("a");
          link.href = url;
          link.download = `pixel-art-${canvasSize}x${canvasSize}.png`;
          window.document.body.appendChild(link);
          link.click();
          link.remove();
          window.setTimeout(() => URL.revokeObjectURL(url), 1000);
          onStatus?.(`Downloaded pixel-art-${canvasSize}x${canvasSize}.png.`);
        } catch {
          onStatus?.("The browser could not download the PNG file.", "error");
        }
      }, "image/png");
    } catch {
      onStatus?.("The browser could not export this artwork as a PNG.", "error");
    }
  }, [canvasSize, ensureCurrentBackground, finishStroke, onStatus]);

  const openFilePicker = useCallback(() => {
    finishStroke();
    fileInputRef.current?.click();
  }, [finishStroke]);

  useImperativeHandle(
    ref,
    () => ({ undo, redo, save, openFilePicker, reset }),
    [openFilePicker, redo, reset, save, undo],
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    input.value = "";

    const operation = importOperationRef.current + 1;
    importOperationRef.current = operation;

    const validationError = validatePngFile(file, MAX_IMAGE_BYTES);
    if (validationError) {
      onStatus?.(validationError, "error");
      return;
    }

    ensureCurrentBackground();
    const startingVersion = documentVersionRef.current;
    const importBackground = canvasColor;
    const isCurrentImport = () =>
      importOperationRef.current === operation &&
      documentVersionRef.current === startingVersion &&
      lastCanvasColorRef.current === importBackground;

    let bitmap: ImageBitmap | null = null;
    try {
      const header = new Uint8Array(await file.slice(0, 24).arrayBuffer());
      if (!isCurrentImport()) return;

      const dimensions = parsePngDimensions(header);
      if (!dimensions) {
        onStatus?.("That file does not have a valid PNG header.", "error");
        return;
      }

      if (
        dimensions.width > MAX_IMAGE_DIMENSION ||
        dimensions.height > MAX_IMAGE_DIMENSION ||
        dimensions.width * dimensions.height > MAX_IMAGE_PIXELS
      ) {
        onStatus?.(
          "Choose an image no larger than 8192 pixels per side or 32 megapixels total.",
          "error",
        );
        return;
      }

      const current = historyRef.current.present;
      const hasEditorChanges =
        historyRef.current.past.length > 0 ||
        historyRef.current.future.length > 0 ||
        current.cells.some((color) => color !== null);
      const shouldReplace =
        !hasEditorChanges || (await onRequestImportReplace());
      if (!isCurrentImport()) return;
      if (!shouldReplace) {
        onStatus?.("PNG import cancelled.");
        return;
      }

      bitmap = await createImageBitmap(file);
      if (!isCurrentImport()) return;
      if (
        bitmap.width !== dimensions.width ||
        bitmap.height !== dimensions.height
      ) {
        onStatus?.(
          "That PNG decoded to dimensions that do not match its header.",
          "error",
        );
        return;
      }

      const isExpectedPixelExport =
        dimensions.width === dimensions.height &&
        SUPPORTED_IMPORT_SIZES.has(dimensions.width);
      if (
        !isExpectedPixelExport &&
        !window.confirm(
          `This ${dimensions.width} × ${dimensions.height} image will be sampled to the editor's fixed 40 × 40 grid. Continue?`,
        )
      ) {
        onStatus?.("PNG import cancelled.");
        return;
      }

      const samplingCanvas = window.document.createElement("canvas");
      samplingCanvas.width = GRID_SIZE;
      samplingCanvas.height = GRID_SIZE;
      const context = samplingCanvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        onStatus?.("The browser could not read that PNG. Reload and try again.", "error");
        return;
      }

      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, GRID_SIZE, GRID_SIZE);
      context.drawImage(bitmap, 0, 0, GRID_SIZE, GRID_SIZE);
      const data = context.getImageData(0, 0, GRID_SIZE, GRID_SIZE).data;
      const background = canvasColor.toLowerCase();
      const cells = Array.from<PixelColor>({ length: GRID_SIZE * GRID_SIZE });

      for (let index = 0; index < cells.length; index += 1) {
        const offset = index * 4;
        if (data[offset + 3] < 128) {
          cells[index] = null;
          continue;
        }
        const color = rgbToHex(data[offset], data[offset + 1], data[offset + 2]);
        cells[index] = color === background ? null : color;
      }

      if (!isCurrentImport()) return;
      clearBackgroundTimer();
      commitDocument({ background: importBackground, cells });
      onStatus?.(`Imported ${file.name} into the 40 × 40 grid.`);
    } catch {
      if (isCurrentImport()) {
        onStatus?.("That PNG could not be decoded. Choose another file.", "error");
      }
    } finally {
      bitmap?.close();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[800px] justify-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,.png"
        hidden
        onChange={handleFileChange}
      />
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <canvas
          ref={drawCanvasRef}
          width={EDITOR_RENDER_SIZE}
          height={EDITOR_RENDER_SIZE}
          aria-label="Pixel drawing canvas, 40 by 40 cells"
          className="block h-full w-full cursor-crosshair touch-none [image-rendering:pixelated]"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onLostPointerCapture={finishStroke}
        >
          A 40 by 40 interactive pixel-art drawing canvas.
        </canvas>
        <canvas
          ref={overlayCanvasRef}
          width={EDITOR_RENDER_SIZE}
          height={EDITOR_RENDER_SIZE}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated]"
        />
      </div>
    </div>
  );
});

export default Canvas;
