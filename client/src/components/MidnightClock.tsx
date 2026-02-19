/**
 * Section 1: The Clock (Hero) — Act I: Awe
 * 
 * Design: Abyssal Cartography
 * - Full-viewport void with deep breathing navy
 * - Luminous ring with tick marks, single trembling hand
 * - Concentric pressure rings radiating outward like sonar pings
 * - Hand position maps Edge Score (0-1): noon (bottom) to midnight (top)
 * - Color regime shifts with bioluminescent glow
 * - Phosphor trail on the hand, organic imperfection
 * - Danger zone arc near midnight glows red
 */
import { useRef, useEffect, useCallback } from 'react';
import { useNerve } from '@/contexts/NerveContext';
import { getRegimeColors } from '@/lib/syntheticData';

export default function MidnightClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, cycleRegime } = useNerve();
  const stateRef = useRef(state);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const trailRef = useRef<{ angle: number; alpha: number }[]>([]);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; size: number }[]>([]);

  stateRef.current = state;

  // Initialize particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        life: Math.random(),
        size: 0.5 + Math.random() * 1.5,
      });
    }
    particlesRef.current = particles;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.32;

    const { edgeScore, regime } = stateRef.current;
    const colors = getRegimeColors(regime);
    timeRef.current += 0.016;
    const t = timeRef.current;

    // Clear with void color
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    // Animated particle field (bioluminescent specks)
    const particles = particlesRef.current;
    particles.forEach((p) => {
      p.x += p.vx + Math.sin(t * 0.3 + p.life * 10) * 0.00005;
      p.y += p.vy + Math.cos(t * 0.2 + p.life * 7) * 0.00005;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;
      p.life += 0.003;

      const px = p.x * w;
      const py = p.y * h;
      const alpha = 0.03 + Math.sin(p.life * 2) * 0.025;
      const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
      const nearClock = Math.max(0, 1 - dist / (radius * 2));

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = colors.primary;
      ctx.globalAlpha = alpha + nearClock * 0.02;
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Concentric pressure rings (sonar pings)
    for (let ring = 0; ring < 3; ring++) {
      const ringPhase = (t * 0.4 + ring * 0.33) % 1;
      const ringR = radius * (1 + ringPhase * 0.8);
      const ringAlpha = 0.06 * (1 - ringPhase);
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = ringAlpha;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Outer ring glow
    const glowPulse = 1 + Math.sin(t * 0.8) * 0.03;
    const ringRadius = radius * glowPulse;

    // Radial glow behind ring
    const gradient = ctx.createRadialGradient(cx, cy, ringRadius * 0.85, cx, cy, ringRadius * 1.4);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.4, colors.glow);
    gradient.addColorStop(0.7, colors.glow.replace('0.3', '0.1'));
    gradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Inner subtle gradient
    const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, ringRadius * 0.85);
    innerGrad.addColorStop(0, 'rgba(0,0,0,0)');
    innerGrad.addColorStop(0.7, 'rgba(0,0,0,0)');
    innerGrad.addColorStop(1, colors.glow.replace('0.3', '0.05'));
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = innerGrad;
    ctx.fill();

    // Main ring
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5 + Math.sin(t * 1.2) * 0.1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Second thin ring
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius * 1.05, 0, Math.PI * 2);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 0.3;
    ctx.globalAlpha = 0.15;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Danger zone arc (near midnight — top of clock)
    const dangerAlpha = edgeScore * 0.4;
    if (dangerAlpha > 0.02) {
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius * 0.95, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.strokeStyle = '#ff2e00';
      ctx.lineWidth = 3;
      ctx.globalAlpha = dangerAlpha * (0.5 + Math.sin(t * 3) * 0.3);
      ctx.shadowColor = '#ff2e00';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // Tick marks (slightly irregular — wabi-sabi)
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isMajor = i % 5 === 0;
      const irregularity = Math.sin(i * 7.3 + t * 0.1) * 1.2;
      const innerR = ringRadius - (isMajor ? 14 : 6) + irregularity;
      const outerR = ringRadius - 2;
      const x1 = cx + Math.cos(angle) * innerR;
      const y1 = cy + Math.sin(angle) * innerR;
      const x2 = cx + Math.cos(angle) * outerR;
      const y2 = cy + Math.sin(angle) * outerR;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = isMajor ? 1.5 : 0.5;
      ctx.globalAlpha = isMajor ? 0.45 : 0.15;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // XII marker at top
    ctx.font = '600 11px "Space Grotesk", sans-serif';
    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('XII', cx, cy - ringRadius + 26);

    // VI marker at bottom
    ctx.fillText('VI', cx, cy + ringRadius - 26);
    ctx.globalAlpha = 1;

    // Hand angle: 0.0 = noon (bottom, 6 o'clock), 1.0 = midnight (top, 12 o'clock)
    const handAngle = Math.PI / 2 + edgeScore * Math.PI;
    // Multi-frequency tremor — organic, never still
    const tremor = (
      Math.sin(t * 8.3) * 0.008 +
      Math.sin(t * 13.7) * 0.005 +
      Math.sin(t * 23.1) * 0.003 +
      Math.sin(t * 37.3) * 0.001
    ) * (1 + edgeScore * 4);

    const finalAngle = handAngle + tremor;

    // Phosphor trail (CRT afterglow)
    trailRef.current.push({ angle: finalAngle, alpha: 0.5 });
    if (trailRef.current.length > 20) trailRef.current.shift();
    trailRef.current.forEach((tr, i) => {
      tr.alpha *= 0.85;
      const trailLen = radius * 0.78;
      const tx = cx + Math.cos(tr.angle - Math.PI / 2) * trailLen;
      const ty = cy + Math.sin(tr.angle - Math.PI / 2) * trailLen;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2 - i * 0.08;
      ctx.globalAlpha = tr.alpha * 0.2;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // Main hand
    const handLen = radius * 0.82;
    const hx = cx + Math.cos(finalAngle - Math.PI / 2) * handLen;
    const hy = cy + Math.sin(finalAngle - Math.PI / 2) * handLen;

    // Hand glow line
    const handGrad = ctx.createLinearGradient(cx, cy, hx, hy);
    handGrad.addColorStop(0, 'rgba(255,255,255,0)');
    handGrad.addColorStop(0.2, colors.primary);
    handGrad.addColorStop(1, colors.primary);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(hx, hy);
    ctx.strokeStyle = handGrad;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Bright core of hand
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(hx, hy);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Center pivot
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Hand tip glow
    ctx.beginPath();
    ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Tip outer glow
    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.08;
    ctx.fill();
    ctx.globalAlpha = 1;

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const { edgeScore, regime } = state;
  const colors = getRegimeColors(regime);
  const scoreStr = edgeScore.toFixed(3);

  return (
    <section
      id="clock-section"
      className="relative w-full h-screen overflow-hidden cursor-pointer select-none"
      style={{ background: '#0a0e1a' }}
      onClick={cycleRegime}
      title="Click to cycle crisis level"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Score display — drifting digits */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div
          className="font-data text-5xl md:text-7xl tracking-wider transition-colors duration-[2000ms]"
          style={{
            color: colors.primary,
            textShadow: `0 0 20px ${colors.glow}, 0 0 60px ${colors.glow}`,
          }}
        >
          {scoreStr}
        </div>
        <div
          className="mt-4 text-sm md:text-base tracking-[0.25em] uppercase"
          style={{
            color: colors.primary,
            opacity: 0.45,
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 300,
          }}
        >
          Distance to midnight.
        </div>
        <div
          className="mt-3 font-data text-[10px] tracking-wider"
          style={{ color: colors.primary, opacity: 0.2 }}
        >
          {state.timestamp.toISOString().slice(0, 19)}Z
        </div>
      </div>

      {/* Regime indicator */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <div
          className="font-data text-[10px] tracking-[0.3em] uppercase"
          style={{ color: colors.primary, opacity: 0.35 }}
        >
          {regime}
        </div>
        <div
          className="mt-1 h-px"
          style={{
            width: `${edgeScore * 60 + 20}px`,
            background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
            opacity: 0.3,
          }}
        />
      </div>

      {/* Click hint */}
      <div className="absolute top-8 right-8 z-10 pointer-events-none">
        <div className="font-data text-[9px] tracking-[0.2em] uppercase" style={{ color: colors.primary, opacity: 0.15 }}>
          click to cycle regime
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <div
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: colors.primary, opacity: 0.2, fontFamily: '"Space Grotesk", sans-serif' }}
          >
            descend
          </div>
          <div className="flex flex-col items-center gap-1 animate-pulse">
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ opacity: 0.25 }}>
              <path d="M3 6 L8 11 L13 6" stroke={colors.primary} strokeWidth="1" fill="none" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ opacity: 0.15 }}>
              <path d="M3 6 L8 11 L13 6" stroke={colors.primary} strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
