import * as React from "react";

type Props = {
  className?: string;

  // Rete
  linkDist?: number;
  maxSpeed?: number;
  count?: number;

  // Dimensioni / distribuzione
  minR?: number;
  maxR?: number;
  bigRatio?: number;
  bigScale?: number;

  // Attrazione verso i “big”
  attract?: boolean;
  attractRadius?: number;
  attractStrength?: number;

  // Repulsione “di base” (graduale)
  retreatRadius?: number;
  retreatForce?: number;
  retreatExponent?: number;

  // NUOVO: modalità “sbalzo” (impulso)
  retreatMode?: "force" | "burst";   // default "burst"
  burstIntensity?: number;           // quanto “spinge” (default 18)
  burstMaxSpeed?: number;            // velocità max temporanea (default 3.2 px/f)

  // Performance / resa
  dprCap?: number;
  fps?: number;
  useGlow?: boolean;
  useScreenBlend?: boolean;
};

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  big: boolean;
};

export default function ParticlesNet({
  className = "",
  linkDist = 160,
  maxSpeed = 0.5,
  count,
  minR = 1.2,
  maxR = 2.4,
  bigRatio = 0.14,
  bigScale = 3.6,
  attract = true,
  attractRadius = 240,
  attractStrength = 0.0012,
  retreatRadius = 260,
  retreatForce = 0.028,
  retreatExponent = 1.35,
  retreatMode = "burst",
  burstIntensity = 18,
  burstMaxSpeed = 3.2,
  dprCap = 2,
  fps,
  useGlow = true,
  useScreenBlend = true,
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef(0);

  const particlesRef = React.useRef<P[]>([]);
  const bigIdxRef = React.useRef<number[]>([]);
  const pausedRef = React.useRef(false);

  const mouseRef = React.useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  React.useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, dprCap));

    function resize() {
      const { clientWidth: w, clientHeight: h } = wrap;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(w, h, dpr);
    }

    function initParticles(w: number, h: number, dprLocal: number) {
      const area = w * h;
      const autoCount = Math.max(40, Math.min(140, Math.round(area / 16000)));
      const n = count ?? (isMobile() ? Math.min(70, autoCount) : autoCount);
      const arr: P[] = [];
      const bigIdx: number[] = [];

      for (let i = 0; i < n; i++) {
        const base = rand(minR, maxR);
        const isBig = Math.random() < bigRatio;
        const rRaw = isBig ? base * bigScale : base;
        const r = Math.min(rRaw, 9);

        const p: P = {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() * 2 - 1) * maxSpeed * dprLocal,
          vy: (Math.random() * 2 - 1) * maxSpeed * dprLocal,
          r,
          big: isBig,
        };
        if (isBig) bigIdx.push(i);
        arr.push(p);
      }

      particlesRef.current = arr;
      bigIdxRef.current = bigIdx;
    }

    function isMobile() {
      return window.matchMedia("(max-width: 768px)").matches;
    }

    function step(ts = 0) {
      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      if (fps) {
        const minDt = 1000 / fps;
        if (ts - lastTsRef.current < minDt) {
          rafRef.current = requestAnimationFrame(step);
          return;
        }
        lastTsRef.current = ts;
      }

      const { clientWidth: w, clientHeight: h } = wrap;
      const pts = particlesRef.current;
      const bigIdx = bigIdxRef.current;

      ctx.clearRect(0, 0, w, h);

      // Parametri pre-calcolati
      const rr = retreatRadius;
      const rr2 = rr * rr;
      const ar = attractRadius;
      const ar2 = ar * ar;

      // max velocità “normale” + “burst”
      const maxSpBase = maxSpeed * dpr * 1.6;
      const maxSpBurst = burstMaxSpeed * dpr;

      // Mouse
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      // Update velocità
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // RETREAT
        if (mouseActive) {
          const dxm = p.x - mx;
          const dym = p.y - my;
          const d2m = dxm * dxm + dym * dym;
          if (d2m < rr2) {
            const dm = Math.max(1, Math.sqrt(d2m));
            const nx = dxm / dm;
            const ny = dym / dm;

            if (retreatMode === "burst") {
              // impulso forte (tipo particles.js "repulse")
              // curva: più vicino => spinta molto maggiore
              const t = 1 - dm / rr;                       // 0..1
              const impulse = (burstIntensity * t * t);    // quad falloff
              p.vx += nx * impulse;
              p.vy += ny * impulse;
            } else {
              // modalità “force” (continua)
              const fall = Math.pow(1 - dm / rr, retreatExponent);
              const mass = p.big ? 0.65 : 1.0;
              p.vx += nx * retreatForce * fall * mass * dpr;
              p.vy += ny * retreatForce * fall * mass * dpr;
            }
          }
        }

        // ATTRAZIONE verso big (solo se non-big)
        if (attract && !p.big && bigIdx.length) {
          for (let k = 0; k < bigIdx.length; k++) {
            const b = pts[bigIdx[k]];
            const dx = p.x - b.x;
            const dy = p.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > 4 && d2 < ar2) {
              const falloff = 1 - d2 / ar2;
              const mass = 0.6 + Math.min(b.r / (maxR * bigScale), 1) * 1.2;
              const f = attractStrength * dpr * falloff * mass;
              p.vx -= dx * f;
              p.vy -= dy * f;
            }
          }
        }

        // Clamp velocità
        const sp = Math.hypot(p.vx, p.vy);
        const cap = mouseActive && retreatMode === "burst" ? maxSpBurst : maxSpBase;
        if (sp > cap) {
          const s = cap / sp;
          p.vx *= s;
          p.vy *= s;
        }
      }

      // Integrazione + draw dots
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }

        ctx.save();
        if (useGlow) {
          ctx.shadowColor = "rgba(255,255,255,0.10)";
          ctx.shadowBlur = p.r * (p.big ? 1.2 : 0.9);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Linee
      const link2 = linkDist * linkDist;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link2) {
            const d = Math.sqrt(d2);
            const t = 1 - d / linkDist;
            const sizeFactor = Math.min(((a.r + b.r) * 0.5) / (maxR * bigScale), 1);
            const alpha = 0.35 * t + 0.06;

            ctx.save();
            if (useScreenBlend) ctx.globalCompositeOperation = "screen";
            ctx.strokeStyle = `rgba(226,232,240,${alpha})`; // slate-200
            ctx.lineWidth = Math.max(0.8, 1.2 * t * (0.6 + sizeFactor * 0.8));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    // Mouse su window → funziona anche con canvas pointer-events:none
    function onMove(e: MouseEvent) {
      const rect = wrap.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    }
    function onOut(e: MouseEvent) {
      if (!e.relatedTarget) mouseRef.current.active = false;
    }
    function onVis() {
      pausedRef.current = document.visibilityState === "hidden";
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onOut);

    resize();
    onVis();
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
    };
  }, [
    count,
    linkDist,
    maxSpeed,
    minR,
    maxR,
    bigRatio,
    bigScale,
    attract,
    attractRadius,
    attractStrength,
    retreatRadius,
    retreatForce,
    retreatExponent,
    retreatMode,
    burstIntensity,
    burstMaxSpeed,
    dprCap,
    fps,
    useGlow,
    useScreenBlend,
  ]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
