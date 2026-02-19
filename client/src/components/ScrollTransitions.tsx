/**
 * Scroll Transitions — The metamorphoses between acts
 * 
 * Transition 1: Clock → Pulse
 *   Clock ring expands and dissolves, five domain threads emerge
 *   Canvas-based for smooth animation
 * 
 * Transition 2: Pulse → Depth
 *   Threads converge to a single point, background deepens to black
 *   Particle convergence effect
 * 
 * Uses GSAP ScrollTrigger for scroll-linked animations
 */
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollTransitions() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const timer = setTimeout(() => {
      const clockSection = document.getElementById('clock-section');
      const transition1 = document.getElementById('transition-1');
      const pulseSection = document.getElementById('pulse-section');
      const transition2 = document.getElementById('transition-2');
      const depthSection = document.getElementById('depth-section');

      if (!clockSection || !transition1 || !pulseSection || !transition2 || !depthSection) return;

      // Clock section: fade and scale on exit
      gsap.to(clockSection, {
        opacity: 0.2,
        scale: 1.05,
        scrollTrigger: {
          trigger: clockSection,
          start: 'center center',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Transition 1: Clock ghost expands, threads emerge
      const t1Timeline = gsap.timeline({
        scrollTrigger: {
          trigger: transition1,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });

      t1Timeline
        .fromTo(
          transition1.querySelector('.t1-clock-ghost'),
          { scale: 0.8, opacity: 0.5 },
          { scale: 4, opacity: 0, duration: 0.6, ease: 'power2.in' }
        )
        .fromTo(
          transition1.querySelectorAll('.t1-thread'),
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 0.8, stagger: 0.06, duration: 0.4, ease: 'power2.out' },
          0.15
        );

      // Pulse section: fade in
      gsap.fromTo(pulseSection, { opacity: 0 }, {
        opacity: 1,
        scrollTrigger: {
          trigger: pulseSection,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1,
        },
      });

      // Transition 2: Threads converge, convergence point grows
      const t2Timeline = gsap.timeline({
        scrollTrigger: {
          trigger: transition2,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });

      t2Timeline
        .fromTo(
          transition2.querySelectorAll('.t2-thread'),
          { scaleX: 1, opacity: 0.6 },
          { scaleX: 0, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'power3.in' }
        )
        .fromTo(
          transition2.querySelector('.t2-convergence'),
          { scale: 0, opacity: 0 },
          { scale: 1.5, opacity: 1, duration: 0.5, ease: 'power2.out' },
          0.2
        );

      // Depth section: fade in
      gsap.fromTo(depthSection, { opacity: 0 }, {
        opacity: 1,
        scrollTrigger: {
          trigger: depthSection,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      });

      // Narrative blocks: staggered fade in
      document.querySelectorAll('.narrative-block').forEach((block) => {
        gsap.fromTo(block,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: block,
              start: 'top 90%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        );
      });
    }, 600);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
}

const DOMAIN_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'];
const DOMAIN_NAMES = ['Markets', 'Climate', 'Information', 'Social', 'Supply'];

function TransitionCanvas({ type }: { type: 'clock-to-pulse' | 'pulse-to-depth' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== Math.floor(rect.width * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    timeRef.current += 0.016;
    const t = timeRef.current;

    // Clear
    if (type === 'clock-to-pulse') {
      ctx.fillStyle = '#0a0e1a';
    } else {
      // Gradient from navy to black
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0a0e1a');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, w, h);

    // Floating particles
    for (let i = 0; i < 20; i++) {
      const px = (Math.sin(t * 0.05 + i * 3.7) * 0.5 + 0.5) * w;
      const py = (Math.cos(t * 0.04 + i * 2.3) * 0.5 + 0.5) * h;
      const alpha = 0.02 + Math.sin(t * 0.3 + i) * 0.015;
      ctx.beginPath();
      ctx.arc(px, py, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = type === 'clock-to-pulse' ? '#00e5ff' : '#ffffff';
      ctx.globalAlpha = alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (type === 'pulse-to-depth') {
      // Convergence particles spiraling inward
      for (let i = 0; i < 30; i++) {
        const angle = t * 0.5 + (i / 30) * Math.PI * 2;
        const spiralR = 50 + Math.sin(t * 0.3 + i * 0.5) * 30;
        const px = cx + Math.cos(angle) * spiralR;
        const py = cy + Math.sin(angle) * spiralR;
        const alpha = 0.05 + Math.sin(t + i) * 0.03;

        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = DOMAIN_COLORS[i % 5];
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    animRef.current = requestAnimationFrame(draw);
  }, [type]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export function Transition1() {
  return (
    <div
      id="transition-1"
      className="relative w-full h-[50vh] overflow-hidden"
      style={{ background: '#0a0e1a' }}
    >
      <TransitionCanvas type="clock-to-pulse" />

      {/* Ghost of the clock expanding */}
      <div className="t1-clock-ghost absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-48 h-48 md:w-72 md:h-72 rounded-full"
          style={{
            border: '1px solid rgba(0, 229, 255, 0.15)',
            boxShadow: '0 0 80px rgba(0, 229, 255, 0.08), inset 0 0 40px rgba(0, 229, 255, 0.03)',
          }}
        />
      </div>

      {/* Five domain threads emerging */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none">
        {DOMAIN_COLORS.map((color, i) => (
          <div key={i} className="flex items-center gap-3 w-[70%]">
            <div
              className="t1-thread h-[1.5px] flex-1 origin-center"
              style={{
                background: `linear-gradient(90deg, transparent 5%, ${color} 30%, ${color} 70%, transparent 95%)`,
                boxShadow: `0 0 8px ${color}30`,
                opacity: 0,
                transform: 'scaleX(0)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Transition2() {
  return (
    <div
      id="transition-2"
      className="relative w-full h-[50vh] overflow-hidden"
    >
      <TransitionCanvas type="pulse-to-depth" />

      {/* Threads converging to center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
        {DOMAIN_COLORS.map((color, i) => (
          <div
            key={i}
            className="t2-thread h-[1.5px] origin-center"
            style={{
              width: '45%',
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              boxShadow: `0 0 6px ${color}25`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Convergence point */}
      <div className="t2-convergence absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,229,255,0.9), rgba(0,229,255,0.2), transparent)',
            boxShadow: '0 0 30px rgba(0,229,255,0.3), 0 0 60px rgba(0,229,255,0.1)',
            opacity: 0,
            transform: 'scale(0)',
          }}
        />
      </div>
    </div>
  );
}
