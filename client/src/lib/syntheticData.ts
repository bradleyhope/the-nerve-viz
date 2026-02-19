/**
 * Synthetic Data Module for The Nerve
 * Generates realistic Edge Scores, domain scores, fragility ratios,
 * breaking news events, and signal data with correlations.
 * 
 * Design: Abyssal Cartography — data radiates from within like bioluminescence
 */

export type Regime = 'CALM' | 'ELEVATED' | 'STRESSED' | 'CRITICAL';

export interface DomainScore {
  name: string;
  key: string;
  score: number;
  momentum: number;
  color: string;
  signals: Signal[];
}

export interface Signal {
  id: string;
  name: string;
  domain: string;
  domainColor: string;
  value: number;
  normalizedValue: number;
  status: 'normal' | 'elevated' | 'critical';
  description: string;
  connections: { targetId: string; strength: number }[];
}

export interface NewsEvent {
  id: string;
  timestamp: Date;
  domains: string[];
  domainColors: string[];
  impact: number;
  title: string;
  summary: string;
  source: string;
}

export interface NerveState {
  edgeScore: number;
  regime: Regime;
  fragilityRatio: number;
  domains: DomainScore[];
  signals: Signal[];
  news: NewsEvent[];
  timestamp: Date;
  history: number[];
}

const DOMAIN_COLORS: Record<string, string> = {
  markets: '#3b82f6',
  climate: '#10b981',
  information: '#8b5cf6',
  social: '#ef4444',
  supply: '#f59e0b',
};

const REGIME_RANGES: Record<Regime, [number, number]> = {
  CALM: [0.05, 0.19],
  ELEVATED: [0.22, 0.39],
  STRESSED: [0.42, 0.58],
  CRITICAL: [0.62, 0.78],
};

const SIGNAL_DEFINITIONS: { id: string; name: string; domain: string; description: string }[] = [
  { id: 'vix', name: 'VIX', domain: 'markets', description: 'CBOE Volatility Index — market fear gauge' },
  { id: 'hy_spread', name: 'HY Spread', domain: 'markets', description: 'High-yield credit spread over treasuries' },
  { id: 'crypto_vol', name: 'Crypto Vol 30d', domain: 'markets', description: '30-day rolling crypto volatility' },
  { id: 'gold', name: 'Gold Price', domain: 'markets', description: 'Gold spot price — safe haven demand' },
  { id: 'eq_energy', name: 'Earthquake Energy', domain: 'climate', description: 'Cumulative seismic energy release (7d)' },
  { id: 'wildfire', name: 'Wildfire Hotspots', domain: 'climate', description: 'Active wildfire detection count (FIRMS)' },
  { id: 'temp_anom', name: 'Temp Anomaly', domain: 'climate', description: 'Global surface temperature anomaly' },
  { id: 'sst_anom', name: 'SST Anomaly', domain: 'climate', description: 'Sea surface temperature anomaly (Niño 3.4)' },
  { id: 'gdelt_crisis', name: 'GDELT Crisis Tone', domain: 'information', description: 'Global crisis narrative intensity' },
  { id: 'gdelt_volume', name: 'GDELT Volume', domain: 'information', description: 'Global event mention volume' },
  { id: 'epu', name: 'Economic Policy Uncertainty', domain: 'information', description: 'Baker-Bloom-Davis EPU Index' },
  { id: 'ted_spread', name: 'TED Spread', domain: 'information', description: 'Interbank lending stress indicator' },
  { id: 'conflict_tone', name: 'Conflict Tone', domain: 'social', description: 'GDELT conflict event average tone' },
  { id: 'conflict_vol', name: 'Conflict Volume', domain: 'social', description: 'GDELT conflict event count' },
  { id: 'geo_risk', name: 'Geopolitical Risk', domain: 'social', description: 'Caldara-Iacoviello GPR Index' },
  { id: 'protest_vol', name: 'Protest Volume', domain: 'social', description: 'Global protest event frequency' },
  { id: 'stlfsi', name: 'STLFSI', domain: 'supply', description: 'St. Louis Financial Stress Index' },
  { id: 'yield_curve', name: 'Yield Curve', domain: 'supply', description: '10Y-2Y Treasury spread (inversion signal)' },
  { id: 'ism_mfg', name: 'ISM Manufacturing', domain: 'supply', description: 'ISM Manufacturing PMI' },
  { id: 'durable_goods', name: 'Durable Goods', domain: 'supply', description: 'Durable goods orders MoM change' },
  { id: 'oil', name: 'Oil Price', domain: 'supply', description: 'WTI crude oil spot price' },
  { id: 'freight', name: 'Freight Index', domain: 'supply', description: 'Baltic Dry Index — shipping demand' },
];

const NEWS_TEMPLATES: { domains: string[]; title: string; summary: string; source: string }[] = [
  {
    domains: ['supply', 'markets'],
    title: 'Taiwan Strait shipping disruption',
    summary: 'A magnitude 7.1 earthquake off the coast of Taiwan has disrupted semiconductor shipping routes. TSMC has halted production at two fabrication plants. Futures markets are pricing in a 3-week supply disruption, with ripple effects expected in consumer electronics and automotive sectors.',
    source: 'Reuters',
  },
  {
    domains: ['markets'],
    title: 'VIX spikes above 30',
    summary: 'The CBOE Volatility Index surged past 30 for the first time in six months, driven by unexpected Federal Reserve commentary suggesting rate hikes may resume. Credit default swap spreads widened across investment-grade corporate bonds.',
    source: 'Bloomberg',
  },
  {
    domains: ['climate'],
    title: 'Antarctic ice shelf collapse accelerates',
    summary: 'Satellite imagery confirms the Thwaites Glacier "Doomsday" ice shelf has lost 40% more mass than projected models predicted. Sea level rise forecasts for 2030 are being revised upward by 15-20cm, with implications for coastal infrastructure globally.',
    source: 'Nature',
  },
  {
    domains: ['social', 'information'],
    title: 'Coordinated disinformation campaign detected',
    summary: 'GDELT analysis reveals a coordinated cross-platform disinformation campaign targeting three NATO member states simultaneously. The campaign volume exceeds previous state-sponsored operations by 340%, with AI-generated content comprising an estimated 60% of posts.',
    source: 'Bellingcat',
  },
  {
    domains: ['social'],
    title: 'Mass protests erupt across South America',
    summary: 'Simultaneous protests in Brazil, Argentina, and Chile have escalated beyond initial economic grievances into broader anti-government movements. Combined participation exceeds 2 million, with security forces deploying crowd control measures in all three capitals.',
    source: 'AP News',
  },
  {
    domains: ['supply', 'climate'],
    title: 'Red Sea shipping rerouting intensifies',
    summary: 'Major shipping lines have extended Red Sea avoidance routes indefinitely following escalated Houthi attacks. Container shipping costs have tripled on Asia-Europe routes. The disruption is compounding existing supply chain fragility from Panama Canal drought restrictions.',
    source: 'Financial Times',
  },
  {
    domains: ['markets', 'information'],
    title: 'Central bank policy divergence widens',
    summary: 'The ECB cut rates by 50bps while the Fed held steady, creating the widest transatlantic policy divergence since 2015. EUR/USD volatility has spiked to 18-month highs. Economic policy uncertainty indices in both regions have entered elevated territory.',
    source: 'The Economist',
  },
  {
    domains: ['climate', 'supply'],
    title: 'Extreme heat wave disrupts European agriculture',
    summary: 'A record-breaking heat dome over Southern Europe has pushed temperatures above 48°C for the fifth consecutive day. Crop yield forecasts for wheat and olive oil have been slashed by 30%. Water rationing is now in effect across six EU member states.',
    source: 'BBC News',
  },
  {
    domains: ['information', 'markets'],
    title: 'AI trading algorithm flash crash',
    summary: 'An AI-driven trading algorithm triggered a 4.2% flash crash in the S&P 500 before circuit breakers activated. The incident lasted 47 seconds but erased $1.8 trillion in market capitalization. Regulators are convening emergency sessions on algorithmic trading oversight.',
    source: 'Wall Street Journal',
  },
  {
    domains: ['social', 'supply'],
    title: 'Critical mineral export ban expands',
    summary: 'China has expanded rare earth export restrictions to include gallium and germanium compounds essential for semiconductor manufacturing. The move affects 80% of global supply for these materials, with stockpiles at major manufacturers estimated at 6-8 weeks.',
    source: 'Nikkei Asia',
  },
];

// Perlin-like noise using simple sine composition
function noise(t: number, seed: number = 0): number {
  return (
    Math.sin(t * 1.0 + seed) * 0.5 +
    Math.sin(t * 2.3 + seed * 1.7) * 0.3 +
    Math.sin(t * 5.7 + seed * 3.1) * 0.15 +
    Math.sin(t * 11.3 + seed * 7.3) * 0.05
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function getRegime(score: number): Regime {
  if (score < 0.2) return 'CALM';
  if (score < 0.4) return 'ELEVATED';
  if (score < 0.6) return 'STRESSED';
  return 'CRITICAL';
}

export function getRegimeColors(regime: Regime): { primary: string; glow: string; bg: string } {
  switch (regime) {
    case 'CALM':
      return { primary: '#00e5ff', glow: 'rgba(0,229,255,0.3)', bg: '#0a0e1a' };
    case 'ELEVATED':
      return { primary: '#ffb703', glow: 'rgba(255,183,3,0.3)', bg: '#0d0e18' };
    case 'STRESSED':
      return { primary: '#ff6b35', glow: 'rgba(255,107,53,0.3)', bg: '#120e16' };
    case 'CRITICAL':
      return { primary: '#ff2e00', glow: 'rgba(255,46,0,0.4)', bg: '#150a0a' };
  }
}

class NerveSimulator {
  private time: number = 0;
  private targetRegime: Regime = 'CALM';
  private currentScore: number = 0.1;
  private domainSeeds: number[];
  private transitionSpeed: number = 0.002;

  constructor() {
    this.domainSeeds = Array.from({ length: 5 }, () => Math.random() * 1000);
    this.setRegime('CALM');
  }

  setRegime(regime: Regime) {
    this.targetRegime = regime;
  }

  cycleRegime(): Regime {
    const regimes: Regime[] = ['CALM', 'ELEVATED', 'STRESSED', 'CRITICAL'];
    const idx = regimes.indexOf(this.targetRegime);
    const next = regimes[(idx + 1) % regimes.length];
    this.setRegime(next);
    return next;
  }

  tick(dt: number = 16): NerveState {
    this.time += dt * 0.001;

    const [targetMin, targetMax] = REGIME_RANGES[this.targetRegime];
    const targetScore = (targetMin + targetMax) / 2 + noise(this.time * 0.3, 42) * (targetMax - targetMin) * 0.4;
    this.currentScore = lerp(this.currentScore, targetScore, this.transitionSpeed * dt);
    this.currentScore = clamp(this.currentScore, 0, 1);

    const regime = getRegime(this.currentScore);

    // Generate domain scores
    const domainKeys = ['markets', 'climate', 'information', 'social', 'supply'];
    const domainNames = ['Markets', 'Climate', 'Information', 'Social / Conflict', 'Supply Chain'];
    const domains: DomainScore[] = domainKeys.map((key, i) => {
      const baseScore = this.currentScore + noise(this.time * 0.5, this.domainSeeds[i]) * 0.15;
      const score = clamp(baseScore, 0, 1);
      const momentum = 0.3 + Math.abs(noise(this.time * 0.8, this.domainSeeds[i] + 100)) * 0.7;
      return {
        name: domainNames[i],
        key,
        score,
        momentum,
        color: DOMAIN_COLORS[key],
        signals: [],
      };
    });

    // Generate signals
    const signals: Signal[] = SIGNAL_DEFINITIONS.map((def) => {
      const domainIdx = domainKeys.indexOf(def.domain);
      const domainScore = domains[domainIdx].score;
      const signalNoise = noise(this.time * 0.4, def.id.length * 7.3);
      const value = clamp(domainScore + signalNoise * 0.2, 0, 1);
      return {
        id: def.id,
        name: def.name,
        domain: def.domain,
        domainColor: DOMAIN_COLORS[def.domain],
        value,
        normalizedValue: value,
        status: value > 0.6 ? 'critical' : value > 0.35 ? 'elevated' : 'normal',
        description: def.description,
        connections: [],
      };
    });

    // Generate correlations between signals
    const fragilityRatio = clamp(this.currentScore * 1.5 + noise(this.time * 0.2, 99) * 0.2, 0, 1);
    signals.forEach((sig, i) => {
      const conns: { targetId: string; strength: number }[] = [];
      signals.forEach((other, j) => {
        if (i === j) return;
        // Same domain = stronger base correlation
        const sameDomain = sig.domain === other.domain;
        const baseStrength = sameDomain ? 0.5 : 0.15;
        const strength = clamp(
          baseStrength * fragilityRatio + noise(this.time * 0.1, i * 100 + j) * 0.2,
          0, 1
        );
        if (strength > 0.15) {
          conns.push({ targetId: other.id, strength });
        }
      });
      sig.connections = conns;
    });

    // Assign signals to domains
    domains.forEach((d) => {
      d.signals = signals.filter((s) => s.domain === d.key);
    });

    // Generate history (last 100 data points)
    const history: number[] = [];
    for (let i = 0; i < 100; i++) {
      const t = this.time - (100 - i) * 0.5;
      const [tMin, tMax] = REGIME_RANGES[this.targetRegime];
      const h = (tMin + tMax) / 2 + noise(t * 0.3, 42) * (tMax - tMin) * 0.5;
      history.push(clamp(h, 0, 1));
    }

    // Select news events based on regime
    const newsCount = regime === 'CALM' ? 3 : regime === 'ELEVATED' ? 5 : regime === 'STRESSED' ? 7 : 10;
    const news: NewsEvent[] = NEWS_TEMPLATES.slice(0, Math.min(newsCount, NEWS_TEMPLATES.length)).map((t, i) => ({
      id: `news-${i}`,
      timestamp: new Date(Date.now() - i * 900000),
      domains: t.domains,
      domainColors: t.domains.map((d) => DOMAIN_COLORS[d]),
      impact: 0.3 + Math.random() * 0.6,
      title: t.title,
      summary: t.summary,
      source: t.source,
    }));

    return {
      edgeScore: this.currentScore,
      regime,
      fragilityRatio,
      domains,
      signals,
      news,
      timestamp: new Date(),
      history,
    };
  }
}

// Singleton
export const simulator = new NerveSimulator();

// Narrative text blocks for the Pulse section
export const NARRATIVE_BLOCKS = [
  {
    type: 'observation' as const,
    text: 'Supply Chain stress is elevated at 0.50, the highest of the five domains.',
  },
  {
    type: 'context' as const,
    text: 'This is driven primarily by a widening yield curve inversion and declining ISM manufacturing index, both of which have historically preceded economic contractions.',
  },
  {
    type: 'implication' as const,
    text: 'If this trend continues without a corresponding easing in financial conditions, the correlation amplification factor is likely to increase, raising the overall Edge Score even if other domains remain calm.',
  },
  {
    type: 'observation' as const,
    text: 'Cross-domain correlation has increased 23% over the past 48 hours.',
  },
  {
    type: 'context' as const,
    text: 'The Markets and Supply Chain domains are now exhibiting synchronized stress patterns not seen since the 2022 energy crisis. Information domain volatility is amplifying the signal.',
  },
  {
    type: 'implication' as const,
    text: 'Elevated fragility ratio suggests the system is entering a regime where localized shocks are more likely to cascade across domain boundaries.',
  },
];
