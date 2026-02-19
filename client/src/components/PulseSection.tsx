/**
 * Section 2: The Pulse (Explanatory) — Act II: Anxiety
 * 
 * Design: Abyssal Cartography
 * - 5 domain pulse lines drawn on Canvas with phosphor trails
 * - Breaking News Pulse as central brighter line with event beats
 * - Breathing stroke width tied to momentum
 * - News cards on hover/tap with sonar ping ripples
 * - Narrative text blocks woven between pulses
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { useNerve } from '@/contexts/NerveContext';
import { getRegimeColors, NARRATIVE_BLOCKS } from '@/lib/syntheticData';
import type { NewsEvent } from '@/lib/syntheticData';

function PulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useNerve();
  const stateRef = useRef(state);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  // Store previous frame for phosphor trail effect
  const prevFrameRef = useRef<ImageData | null>(null);

  stateRef.current = state;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const newW = Math.floor(rect.width * dpr);
    const newH = Math.floor(rect.height * dpr);

    if (canvas.width !== newW || canvas.height !== newH) {
      canvas.width = newW;
      canvas.height = newH;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;
    timeRef.current += 0.016;
    const t = timeRef.current;

    // Phosphor persistence: dim previous frame instead of clearing
    ctx.fillStyle = 'rgba(10, 14, 26, 0.15)';
    ctx.fillRect(0, 0, w, h);

    const { domains, regime } = stateRef.current;
    const regimeColors = getRegimeColors(regime);
    const lineCount = domains.length;
    const topPad = h * 0.08;
    const bottomPad = h * 0.08;
    const usableH = h - topPad - bottomPad;
    const lineSpacing = usableH / (lineCount + 1);

    // Draw each domain pulse
    domains.forEach((domain, idx) => {
      const baseY = topPad + lineSpacing * (idx + 1);
      const color = domain.color;
      const momentum = domain.momentum;
      const score = domain.score;

      // Breathing stroke width
      const breathRate = 0.5 + momentum * 2;
      const breathAmp = 0.3 + score * 1.5;
      const strokeWidth = 1.2 + Math.sin(t * breathRate + idx) * breathAmp;

      // Generate pulse line points with organic noise
      const points: { x: number; y: number }[] = [];
      const resolution = 2;
      for (let x = 0; x <= w; x += resolution) {
        const nx = x / w;
        const y = baseY +
          Math.sin(nx * 8 + t * 1.5 + idx * 2.1) * (12 + score * 20) +
          Math.sin(nx * 15 + t * 2.3 + idx * 3.7) * (4 + score * 10) +
          Math.sin(nx * 30 + t * 4.1 + idx * 1.3) * (1.5 + score * 4) +
          // Occasional spikes for drama
          (Math.sin(nx * 3 + t * 0.7 + idx) > 0.88 ? Math.sin(nx * 50 + t * 3) * (15 + score * 25) : 0);
        points.push({ x, y });
      }

      // Main line with glow
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = 0.8;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Bright core
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = strokeWidth * 0.25;
      ctx.globalAlpha = 0.12;
      ctx.stroke();

      ctx.globalAlpha = 1;

      // Domain label — left side
      ctx.font = '500 11px "Space Grotesk", sans-serif';
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.55;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(domain.name, 14, baseY - 22);

      // Score value
      ctx.font = '400 10px "JetBrains Mono", monospace';
      ctx.globalAlpha = 0.35;
      ctx.fillText(domain.score.toFixed(3), 14, baseY - 9);
      ctx.globalAlpha = 1;
    });

    // Breaking news pulse — central bright line (subtle)
    const newsCenterY = h / 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const nx = x / w;
      const y = newsCenterY +
        Math.sin(nx * 6 + t * 2) * 6 +
        Math.sin(nx * 20 + t * 5) * 2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.4;
    ctx.globalAlpha = 0.06;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // News beat markers
    const { news } = stateRef.current;
    news.forEach((evt, i) => {
      const beatX = w * 0.12 + (w * 0.76) * (i / Math.max(news.length - 1, 1));
      const beatY = newsCenterY + Math.sin(beatX * 0.02 + t * 2) * 6;
      const pulseR = 2.5 + Math.sin(t * 3 + i * 1.5) * 1;
      const evtColor = evt.domainColors[0] || '#ffffff';

      // Sonar ping ripple
      for (let ring = 0; ring < 2; ring++) {
        const ripplePhase = ((t * 1.5 + i * 0.7 + ring * 0.5) % 1);
        const rippleR = pulseR + ripplePhase * 25;
        const rippleAlpha = 0.12 * (1 - ripplePhase);
        ctx.beginPath();
        ctx.arc(beatX, beatY, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = evtColor;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = rippleAlpha;
        ctx.stroke();
      }

      // Beat dot
      ctx.beginPath();
      ctx.arc(beatX, beatY, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = evtColor;
      ctx.globalAlpha = 0.7 + Math.sin(t * 2 + i) * 0.15;
      ctx.shadowColor = evtColor;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner bright core
      ctx.beginPath();
      ctx.arc(beatX, beatY, pulseR * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.5;
      ctx.fill();

      ctx.globalAlpha = 1;
    });

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    // Initial clear
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

function NewsCard({ event, onClose }: { event: NewsEvent; onClose: () => void }) {
  return (
    <div
      className="fixed inset-x-4 bottom-4 md:inset-auto md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] z-50 rounded-lg border p-6 backdrop-blur-xl"
      style={{
        background: 'rgba(10, 14, 26, 0.95)',
        borderColor: event.domainColors[0] + '33',
        boxShadow: `0 0 60px ${event.domainColors[0]}10, inset 0 0 30px rgba(0,0,0,0.3)`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {event.domains.map((d, di) => (
            <span
              key={d}
              className="font-data text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded"
              style={{
                color: event.domainColors[di],
                background: event.domainColors[di] + '12',
                border: `1px solid ${event.domainColors[di]}20`,
              }}
            >
              {d}
            </span>
          ))}
        </div>
        <button
          onClick={onClose}
          className="text-white/20 hover:text-white/50 transition-colors text-xl leading-none ml-4"
        >
          &times;
        </button>
      </div>
      <h3
        className="text-base font-semibold mb-2 leading-snug"
        style={{ color: event.domainColors[0], fontFamily: '"Space Grotesk", sans-serif' }}
      >
        {event.title}
      </h3>
      <p className="text-sm leading-relaxed text-white/50 mb-4">
        {event.summary}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="font-data text-[9px] text-white/25 tracking-wider">
          {event.timestamp.toISOString().slice(11, 16)} UTC
        </span>
        <span className="font-data text-[9px] text-white/25 tracking-wider">
          Impact: {(event.impact * 100).toFixed(0)}% · {event.source}
        </span>
      </div>
    </div>
  );
}

function NarrativeBlock({ block }: { block: typeof NARRATIVE_BLOCKS[0] }) {
  const typeColors: Record<string, string> = {
    observation: '#00e5ff',
    context: '#8b5cf6',
    implication: '#ffb703',
  };
  const color = typeColors[block.type] || '#00e5ff';

  return (
    <div className="narrative-block max-w-lg mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-6 h-px"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
        <div
          className="font-data text-[9px] uppercase tracking-[0.35em]"
          style={{ color }}
        >
          {block.type}
        </div>
      </div>
      <p
        className="text-sm md:text-base leading-[1.8] text-white/45"
        style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 300 }}
      >
        {block.text}
      </p>
    </div>
  );
}

export default function PulseSection() {
  const { state } = useNerve();
  const [selectedNews, setSelectedNews] = useState<NewsEvent | null>(null);
  const colors = getRegimeColors(state.regime);

  return (
    <section
      id="pulse-section"
      className="relative w-full"
      style={{ background: '#0a0e1a' }}
    >
      {/* Pulse visualization area */}
      <div className="relative w-full h-[80vh] md:h-screen">
        <PulseCanvas />

        {/* Clickable news beat overlay */}
        <div className="absolute inset-0 z-10">
          {state.news.map((evt, i) => {
            const left = `${12 + 76 * (i / Math.max(state.news.length - 1, 1))}%`;
            return (
              <button
                key={evt.id}
                className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full hover:scale-125 transition-transform"
                style={{
                  left,
                  top: '50%',
                  background: 'transparent',
                }}
                onClick={() => setSelectedNews(evt)}
                title={evt.title}
              />
            );
          })}
        </div>

        {/* Section label */}
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <div className="font-data text-[9px] tracking-[0.35em] uppercase" style={{ color: colors.primary, opacity: 0.25 }}>
            Act II — The Pulse
          </div>
          <div
            className="mt-1 h-px"
            style={{
              width: '40px',
              background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
              opacity: 0.2,
            }}
          />
        </div>

        {/* Tap hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="font-data text-[9px] tracking-[0.2em] text-white/15">
            tap a pulse point to read the signal
          </div>
        </div>
      </div>

      {/* Narrative blocks */}
      <div className="relative z-10 py-8">
        {NARRATIVE_BLOCKS.map((block, i) => (
          <NarrativeBlock key={i} block={block} />
        ))}
      </div>

      {/* News card overlay */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNews(null)}>
          <NewsCard event={selectedNews} onClose={() => setSelectedNews(null)} />
        </div>
      )}
    </section>
  );
}
