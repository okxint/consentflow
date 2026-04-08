"use client";
import { useRef, useState } from "react";

interface Props {
  label: string;
  onSave: (dataUrl: string) => void;
  height?: number;
}

export function SignaturePad({ label, onSave, height = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
    setHasSignature(true);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    setDrawing(false);
    if (canvasRef.current && hasSignature) {
      onSave(canvasRef.current.toDataURL());
    }
  }

  function clear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSave("");
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={height}
          className="w-full cursor-crosshair touch-none"
          style={{ height }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasSignature && (
          <p className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            Draw your signature here
          </p>
        )}
      </div>
      <button type="button" onClick={clear} className="text-sm text-[var(--color-primary)] mt-2 hover:underline">
        Clear
      </button>
    </div>
  );
}
