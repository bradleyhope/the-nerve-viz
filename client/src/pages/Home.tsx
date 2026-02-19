/**
 * The Nerve — Home Page
 * 
 * A three-act descent: Awe (Clock), Anxiety (Pulse), Agency (Depth)
 * Design: Abyssal Cartography — bioluminescent deep-sea instrumentation
 * 
 * Scroll drives the narrative and transitions.
 * Click/tap to cycle through simulated crisis levels.
 */
import MidnightClock from '@/components/MidnightClock';
import PulseSection from '@/components/PulseSection';
import DepthSection from '@/components/DepthSection';
import { Transition1, Transition2, useScrollTransitions } from '@/components/ScrollTransitions';

export default function Home() {
  useScrollTransitions();

  return (
    <div className="relative w-full" style={{ background: '#0a0e1a' }}>
      {/* Act I: The Clock — Awe */}
      <MidnightClock />

      {/* Transition 1: Clock → Pulse */}
      <Transition1 />

      {/* Act II: The Pulse — Anxiety */}
      <PulseSection />

      {/* Transition 2: Pulse → Depth */}
      <Transition2 />

      {/* Act III: The Depth — Agency */}
      <DepthSection />

      {/* Footer */}
      <footer
        className="relative z-10 py-8 text-center"
        style={{ background: '#000000' }}
      >
        <div className="font-data text-[9px] tracking-[0.3em] uppercase text-white/10">
          The Nerve — Systemic Risk Visualization
        </div>
        <div className="font-data text-[8px] tracking-wider text-white/5 mt-2">
          Synthetic data · Not for decision-making
        </div>
      </footer>
    </div>
  );
}
