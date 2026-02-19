import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { simulator, type NerveState, type Regime } from '@/lib/syntheticData';

interface NerveContextValue {
  state: NerveState;
  cycleRegime: () => Regime;
  currentRegime: Regime;
}

const NerveContext = createContext<NerveContextValue | null>(null);

export function NerveProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NerveState>(() => simulator.tick(0));
  const [currentRegime, setCurrentRegime] = useState<Regime>('CALM');
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const loop = (now: number) => {
      const dt = Math.min(now - lastTimeRef.current, 50);
      lastTimeRef.current = now;
      const newState = simulator.tick(dt);
      setState(newState);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const cycleRegime = useCallback(() => {
    const next = simulator.cycleRegime();
    setCurrentRegime(next);
    return next;
  }, []);

  return (
    <NerveContext.Provider value={{ state, cycleRegime, currentRegime }}>
      {children}
    </NerveContext.Provider>
  );
}

export function useNerve() {
  const ctx = useContext(NerveContext);
  if (!ctx) throw new Error('useNerve must be used within NerveProvider');
  return ctx;
}
