import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 84;

const FRAME_PATH = (n: number) =>
  `/frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

export default function ScrollFrames({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrame = useRef(0);
  const targetFrame = useRef(0);
  const rafId = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);
  const images = useRef<HTMLImageElement[]>([]);

  // Preload all frames on mount
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    console.log("ScrollFrames: Starting preload of", TOTAL_FRAMES, "frames");

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          console.log("ScrollFrames: All frames loaded successfully");
          setLoaded(true);
        }
      };
      img.onerror = () => {
        console.error(`ScrollFrames: Failed to load frame ${i} at ${img.src}`);
      };
      imgs.push(img);
    }
    images.current = imgs;

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (index: number) => {
      const img = images.current[index];
      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const scale = Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (rect.width - w) / 2;
      const y = (rect.height - h) / 2;

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, x, y, w, h);
    };

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const { top, height } = section.getBoundingClientRect();
      const scrollableDist = height - window.innerHeight;
      const progress = Math.min(Math.max(-top / scrollableDist, 0), 1);
      targetFrame.current = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
    };

    const animate = () => {
      const diff = targetFrame.current - currentFrame.current;
      // Use shorter diff for smoother animation
      if (Math.abs(diff) > 0.01) {
        currentFrame.current += diff * 0.15;
        drawFrame(Math.round(currentFrame.current));
      }
      rafId.current = requestAnimationFrame(animate);
    };

    // Initial draw
    drawFrame(0);

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [loaded, sectionRef]);

  return (
    <div className="scroll-frames-wrapper">
      {!loaded && (
        <div className="scroll-frames-loader">
          <div className="scroll-frames-loader-bar" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="scroll-frames-canvas"
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}

