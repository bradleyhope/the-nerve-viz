# The Nerve: Creative Brief & Product Concept

**A Single-Page Scroll Experience for Systemic Risk**

**Project:** The Nerve — Scroll Narrative
**Date:** February 19, 2026
**Author:** Manus AI
**Status:** Concept & Architecture

---

## 0. Executive Summary

The Nerve is a systemic risk monitor that computes an Edge Score (0–1) across five domains every 15 minutes. Four visual prototypes already exist — a midnight clock, a heartbeat pulse, an ocean depth visualization, and a fracture sphere — each pulling live data from the Nerve engine API [1]. This brief proposes combining three of those prototypes into a single, continuous scroll experience: a page that tells a story about the state of the world, right now, and that feels alive in a way no dashboard ever has.

The page is not a product tour. It is not an infographic. It is a **descent** — from a single, terrifying number into the chaos that produces it, and then deeper still, into the hidden connections that make the whole system fragile. The scroll is the narrative device. The data is the story. The aesthetic is the sublime: beauty laced with dread.

---

## 1. The Scroll Narrative: Awe, Anxiety, Agency

Every great story has an emotional arc. The Nerve's scroll experience is structured as a three-act descent, each section corresponding to a distinct emotional register and a different relationship between the user and the data.

**Act I** is the hook. The user arrives and is immediately confronted by a single, overwhelming visual — the Midnight Clock — that communicates the state of the world in one glance. The emotion here is **awe**, tinged with dread. There is almost no text. The clock speaks for itself. The user's only question is: *what does this mean?*

**Act II** answers that question, but not with a clean explanation. The Pulse section is deliberately overwhelming — a cascade of real-time news synthesis, domain-specific heartbeats, and narrative text that weaves between the data streams. The emotion shifts to **anxiety**, the productive kind, the kind that makes you lean in rather than look away. The user is no longer a passive observer; they are reading, scanning, trying to make sense of a system in motion.

**Act III** offers release and depth. After the informational intensity of the Pulse, the final section is immersive and contemplative. It visualizes a different dimension of the data — the hidden connections, the historical context, or the geographic distribution of stress — and invites the user to explore at their own pace. The emotion here is **agency**: the user has tools to investigate, to rotate and zoom and click, to form their own understanding.

| Act | Section | Emotion | Question Answered | Pacing |
| :--- | :--- | :--- | :--- | :--- |
| I | The Clock | Awe / Dread | "How close are we?" | Slow, still, breathless |
| II | The Pulse | Anxiety / Urgency | "What is happening, and why?" | Fast, layered, relentless |
| III | The Depth | Agency / Insight | "How does it all connect?" | Exploratory, open, contemplative |

The critical design constraint is that these three acts must feel like one continuous experience. The transitions between them are not page breaks — they are metamorphoses, where one visual metaphor dissolves and reforms into the next. The user should never feel that they have "left" one section and "arrived" at another. They should feel that the page itself is transforming around them as they scroll.

---

## 2. Section 1: The Clock (Hero)

### What the user sees

The page loads to a full-viewport void. Not black — a deep, breathing navy, the color of a sky five minutes before total darkness. At the center of this void, the Midnight Clock materializes. Not all at once: the outer ring fades in first, a thin luminous circle with subtle tick marks, followed by the faintest suggestion of the XII at the top. Then the hand appears — a single, trembling line of light, straining from the center toward its current position on the dial.

The hand's position maps directly to the `edge_score` from the Nerve API [1]. At 0.0, the hand points straight down (noon — maximum safety). At 1.0, it would reach the XII at the top (midnight — systemic collapse). The current score of approximately 0.100 places the hand just past the one o'clock position: early afternoon, a long way from midnight, but the hand still trembles. It never rests. Even in calm, the system vibrates.

### The color regime

The entire color palette of the hero section is governed by the `regime` field from the API. In the current "CALM" state, the clock glows with a serene, pulsing cyan — the same cold blue already established in the existing prototype [2]. As the score rises, the palette transitions through distinct regimes:

| Regime | Score Range | Color Palette | Clock Behavior |
| :--- | :--- | :--- | :--- |
| CALM | 0.0 – 0.2 | Deep cyan, cool blue | Slow pulse, gentle tremor |
| ELEVATED | 0.2 – 0.4 | Teal shifting to amber | Faster pulse, visible vibration |
| STRESSED | 0.4 – 0.6 | Amber to burnt orange | Erratic tremor, flickering glow |
| CRITICAL | 0.6 – 0.8 | Deep red, molten edges | Violent shaking, cracking light |
| EDGE | 0.8 – 1.0 | White-hot core, red corona | The hand fractures, the ring distorts |

### What surrounds the clock

Almost nothing. That is the point. The sublime requires negative space — the vastness of the void is what makes the clock feel significant. The only text elements are:

The Edge Score itself, rendered in the center of the clock face in a monospace typeface (consistent with the existing prototypes), displayed to three decimal places. The numbers should not snap to new values; they should *drift*, the digits rolling like an odometer, reinforcing the sense of continuous recalculation.

Below the clock, a single line of text fades in after a two-second delay: **"Distance to midnight."** Nothing more. No logo, no navigation, no explanation. The mystery is the hook. A smaller, secondary line shows the timestamp of the last update in UTC, grounding the abstraction in the concrete present.

### The Wabi-Sabi principle

The clock should not look machine-perfect. The existing prototype already captures this beautifully — the hand has a slight waver, the glow is organic rather than geometric [2]. This should be amplified in the scroll version. The tick marks on the ring should be slightly irregular, as if hand-drawn. The glow should have subtle noise in its texture, like light passing through atmosphere. The score text should occasionally flicker, as if the signal is degrading. These imperfections communicate something essential about the data: it is not certain. It is an estimate, a best guess, computed from noisy, incomplete signals. The visualization should honor that uncertainty rather than mask it.

### The scroll trigger

A subtle visual cue — a faint downward-pointing chevron or a gentle pulsing glow at the bottom of the viewport — invites the user to scroll. But the real invitation is curiosity. The clock raises a question it does not answer: *why is the hand where it is?* The only way to find out is to scroll down.

---

## 3. Section 2: The Pulse (Explanatory / Narrative)

### The transition in

As the user begins to scroll, the Clock does not slide upward and off-screen. Instead, the perspective shifts: the camera pushes *forward*, toward the center of the clock. The luminous ring expands past the edges of the viewport. The score text dissolves into a shower of particles. And the single trembling hand — the unified representation of global risk — fractures into five distinct threads of colored light, one for each domain:

| Domain | Thread Color | Key Signals |
| :--- | :--- | :--- |
| Markets | Electric blue | VIX, high-yield spread, crypto volatility, gold price |
| Climate | Emerald green | Earthquake energy, wildfire hotspots, temperature anomaly, SST anomaly |
| Information | Violet / Purple | GDELT crisis tone/volume, economic policy uncertainty, TED spread |
| Social / Conflict | Crimson red | GDELT conflict tone/volume, geopolitical risk, protest volume |
| Supply Chain | Amber / Gold | STLFSI, yield curve, ISM manufacturing, durable goods, oil price |

These five threads drift apart, re-orient from radial to horizontal, and become the living pulse lines of the second section. The transition should take approximately 1.5 seconds of scroll distance — long enough to feel deliberate, short enough to maintain momentum.

### The domain pulses

Each domain pulse is a horizontally scrolling sparkline that visualizes the domain's score over time, drawn from the `/history` endpoint [1]. But these are not ordinary charts. They are alive. The line for each domain breathes — its stroke width gently expanding and contracting in a rhythm tied to the domain's current `momentum` value. A domain with high momentum has a rapid, shallow breath; a calm domain breathes slowly and deeply.

The pulses are stacked vertically, with generous spacing between them. Each is labeled with the domain name and its current score, rendered in the domain's color. The rightmost edge of each pulse is the present moment, and it updates in real time — the line extends as new data arrives, creating the sensation of watching a seismograph in action.

When the user hovers over (or taps, on mobile) a specific point on a domain pulse, a tooltip appears showing the exact score at that moment and the individual signal values that contributed to it. For example, hovering over a spike in the Markets pulse might reveal: "VIX: 32.4 (+8.2), HY Spread: 4.8 (+0.6, crypto vol 30d: 0.72."

### The breaking news pulse

This is the centerpiece of Section 2 and the feature that will make The Nerve feel fundamentally different from any existing risk monitor. Between the domain pulses — or perhaps running as a sixth, central, brighter line — is the **Breaking News Pulse**: a real-time stream of synthesized news events, each one mapped to the domain(s) it affects.

The Breaking News Pulse is not a ticker tape of headlines. It is a curated, synthesized narrative stream. Each "beat" on the pulse corresponds to a distinct news event, rendered as a node or inflection point on the line. The amplitude of the beat corresponds to the event's estimated impact on the Edge Score. Small, routine events produce gentle ripples; major breaking stories produce sharp spikes.

When the user engages with a beat (hover on desktop, tap on mobile), a card expands from the pulse line, containing a synthesized summary generated by the Perplexity API. This summary is not a raw headline — it is a one-to-three-sentence narrative that contextualizes the event within the framework of systemic risk. For example:

> **Supply Chain / Markets** — 14:32 UTC
> A magnitude 7.1 earthquake off the coast of Taiwan has disrupted semiconductor shipping routes. TSMC has halted production at two fabrication plants. Futures markets are pricing in a 3-week supply disruption, with ripple effects expected in consumer electronics and automotive sectors.

The card also shows which domain(s) the event maps to, its estimated impact magnitude, and a link to the source articles. This creates a direct, visible connection between real-world events and the abstract mathematics of the Edge Score.

### Narrative text weaving

Between the pulse visualizations, short blocks of narrative text scroll into view. These are not static explainers — they are dynamically composed based on the current state of the system. The text serves as the "voice" of The Nerve: analytical, measured, but with an undercurrent of urgency when warranted.

The narrative text follows a pattern of **observation, context, implication**:

> **Observation:** "Supply Chain stress is elevated at 0.50, the highest of the five domains."
>
> **Context:** "This is driven primarily by a widening yield curve inversion and declining ISM manufacturing index, both of which have historically preceded economic contractions."
>
> **Implication:** "If this trend continues without a corresponding easing in financial conditions, the correlation amplification factor is likely to increase, raising the overall Edge Score even if other domains remain calm."

This text is generated server-side, using the Perplexity API to synthesize the current Nerve data with broader economic and geopolitical context. It updates every 15 minutes, aligned with the Nerve engine's own refresh cycle.

### What makes it feel alive

The difference between a live experience and a static dashboard is not just the data refresh rate — it is the *texture* of motion. Several design choices ensure that the Pulse section never feels frozen:

The pulse lines have a constant, subtle animation even when the data is not changing — a gentle oscillation, like the surface of still water disturbed by a distant vibration. When new data arrives (every 15 minutes from the Nerve API, more frequently from the news pipeline), the update is not a hard snap but a smooth interpolation, the line flowing to its new position over 500 milliseconds. The breaking news beats appear with a small, satisfying animation — a pulse of light that radiates outward from the new node, like a stone dropped in water. The narrative text blocks fade in with a typewriter-like reveal, one word at a time, at a pace that feels deliberate but not slow.

The cumulative effect of these micro-animations is a section that breathes, that feels like a living organism rather than a static report.

---

## 4. Section 3: The Depth (Immersive / Illustrative)

### The transition in

As the user scrolls past the final domain pulse, the five colored threads begin to deviate from their horizontal paths. They curve, weave, and braid around each other, their motion becoming increasingly three-dimensional. The narrative text fades. The background, which has been the same deep navy throughout, begins to shift — either deepening to true black (for the network and glass concepts) or warming slightly (for the atlas). The threads converge on a central point and transform into the primary visual of the third section.

### Concept A: The Mycelial Network (Recommended)

Of the four concepts explored below, this is the strongest candidate for the initial build. It directly visualizes the `fragility_ratio` — the metric that measures how coupled the five domains are — which is arguably the most important and least intuitive number in the entire Nerve system. It also naturally extends the existing Fracture Sphere prototype [2], which already renders an interconnected system of orbiting particles.

The visualization is a force-directed 3D graph rendered in WebGL. Each of the 22 signals from the `/signals` endpoint [1] is a node, positioned in 3D space and colored by its domain. The nodes are connected by edges whose thickness and luminosity represent the strength of the correlation between those signals. The entire network is governed by a physics simulation: the nodes repel each other gently (preventing overlap) while the edges pull correlated nodes together (creating clusters).

The `fragility_ratio` acts as a global parameter that controls the overall tension of the network. At low fragility (the current state), the network is loose, the connections are dim, and the nodes drift lazily in their orbits. As fragility increases, the connections brighten and tighten, the nodes are pulled closer together, and the entire structure begins to vibrate with a nervous energy — a visual representation of a system where a shock in one domain will inevitably cascade to the others.

The user can rotate the network by dragging, zoom with the scroll wheel (or pinch on mobile), and click on any node to isolate it and its immediate connections. A panel slides in from the side showing the signal's name, description, source, current status, and the strength of its connections to other signals.

### Concept B: The Ice Core (Historical Context)

A vertical column of compressed time, rendered as a translucent, glowing cylinder. The present is at the top; the past stretches downward. Each horizontal slice of the core represents one day of Edge Score history, with the color and width encoding the score value. Calm periods are thin, dark bands; crisis periods are wide, incandescent strata.

The user scrolls down to travel back in time. Key historical events are annotated as markers alongside the core — the 2008 financial crisis, the Fukushima disaster, the COVID-19 pandemic, the 2022 energy crisis — each with a brief synthesized description. The current moment is highlighted at the top with a pulsing indicator, contextualizing today's score within the full historical record.

This concept is powerful for perspective but requires historical data that may not yet exist in the Nerve system (the `/history` endpoint currently returns only recent data). It could be seeded with synthetic or reconstructed historical scores based on the same underlying signals.

### Concept C: The Glass Pane (Fragility)

A single, screen-filling pane of dark glass. The surface appears smooth and pristine at first glance, but as the user moves their cursor (or tilts their phone), a raking light source reveals a network of hairline cracks beneath the surface. The density and connectivity of these cracks map to the `edge_score` and `fragility_ratio` respectively.

This concept is the most minimalist and arguably the most emotionally powerful. It communicates fragility not through complexity but through *restraint* — the tension of a surface that looks whole but is not. Sound design is essential: faint, high-frequency creaking sounds that intensify as the user explores areas of high crack density. A real-time score increase would trigger the appearance of a new crack with a sharp, crystalline snap.

### Concept D: The Stress Atlas (Geography)

A dark, stylized 3D globe rendered as a low-polygon mesh. Geographic hotspots of risk are rendered as blooms of colored light on the globe's surface, using location data from GDELT and other geographically tagged signals. The globe slowly auto-rotates, but the user can grab and spin it. Clicking on a hotspot zooms in and reveals a synthesized summary of the events driving risk in that region.

This concept is the most immediately legible — everyone understands a globe — but it requires geographic data that may need to be extracted or inferred from the existing signal sources.

### Recommendation

**Build Concept A (Mycelial Network) first.** It is the most technically feasible with the existing API, it directly visualizes the most unique metric in the Nerve system (fragility ratio), and it creates the strongest visual continuity with the existing Fracture Sphere prototype. Concept C (Glass Pane) is the strongest alternative — it is simpler to build and more emotionally striking, but it communicates less information.

---

## 5. The Real-Time Pipeline: Making It Breathe

The single most important technical challenge in this project is not the visualization — it is the data pipeline that powers the Breaking News Pulse in Section 2. The user's explicit requirement is that this section must feel "alive, not static," and that demands a real-time pipeline that continuously ingests, synthesizes, and delivers news events mapped to the Nerve's domain structure.

### Architecture overview

The pipeline has six stages, each with a distinct role and technology:

| Stage | Component | Technology | Cadence | Output |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Headline Ingestion | NewsAPI | Every 2 min | Raw headlines with metadata (source, category, timestamp) |
| 2 | Deduplication & Clustering | Sentence Transformers + HDBSCAN | Every 2 min | Clusters of related headlines, each representing a distinct event |
| 3 | Narrative Synthesis | Perplexity API (sonar-pro) | Every 5 min | 1–3 sentence synthesized summary per event cluster |
| 4 | Domain Classification | Zero-shot classifier or keyword mapping | Every 5 min | Each event tagged with 1–2 Nerve domains + estimated impact score |
| 5 | Caching & Time-Series Storage | Redis Streams | Continuous | Ordered, queryable stream of synthesized events |
| 6 | Client Delivery | Server-Sent Events (SSE) | Real-time push | New events pushed to connected clients as they arrive |

### Stage 1: Headline ingestion

NewsAPI provides access to headlines from thousands of sources across multiple categories. We map NewsAPI categories to Nerve domains as follows:

| NewsAPI Category | Nerve Domain(s) |
| :--- | :--- |
| business, finance | Markets, Supply Chain |
| technology | Information, Supply Chain |
| health, science | Climate, Social/Conflict |
| politics, world | Social/Conflict, Information |
| general | All (classified in Stage 4) |

The ingestion service polls NewsAPI every 2 minutes, fetching the latest headlines for each category. Each headline is stored with its full metadata (title, description, source, URL, published timestamp, category).

### Stage 2: Deduplication and clustering

Raw headlines are noisy. A single event (e.g., a major earthquake) will generate dozens of nearly identical headlines from different sources. The clustering stage uses sentence embeddings (via a lightweight model like `all-MiniLM-L6-v2`) to compute semantic similarity between headlines, then applies HDBSCAN clustering to group related articles into distinct events. Each cluster is represented by its most central headline (the one closest to the cluster centroid in embedding space).

### Stage 3: Narrative synthesis

For each new event cluster, we construct a prompt for the Perplexity API that includes the cluster's headlines and asks for a concise synthesis. The prompt template:

> You are a systemic risk analyst. Given these headlines about the same event, write a 1–3 sentence summary that explains what happened and why it matters for global systemic stability. Focus on cascading effects and cross-domain implications. Be specific and analytical, not sensational.
>
> Headlines:
> {headline_list}

The Perplexity API's `sonar-pro` model is ideal here because it can ground its synthesis in real-time web data, providing context beyond what the headlines alone contain.

### Stage 4: Domain classification

Each synthesized event is classified into one or more Nerve domains. This can be done with a simple keyword-based classifier initially (e.g., mentions of "VIX," "markets," or "stocks" map to Markets; mentions of "earthquake," "wildfire," or "temperature" map to Climate) and upgraded to a zero-shot NLI classifier (e.g., using `facebook/bart-large-mnli`) for greater accuracy.

### Stage 5: Caching

Synthesized, classified events are stored in a Redis Stream, which provides an ordered, time-indexed log that supports both real-time subscription and historical queries. Each event entry includes the synthesis text, domain tags, impact estimate, source URLs, and timestamp. The stream is capped at 1,000 events (approximately 3–5 days of history at typical news volumes).

### Stage 6: Client delivery

The front-end maintains a persistent Server-Sent Events (SSE) connection to the back-end. SSE is preferred over WebSockets for this use case because the data flow is unidirectional (server to client) and SSE handles reconnection automatically. When a new event is added to the Redis Stream, it is immediately pushed to all connected clients, which render it as a new beat on the Breaking News Pulse.

### Avoiding staleness

The pipeline includes several mechanisms to prevent the experience from feeling stale:

Even when no new events are arriving, the domain pulses continue to animate based on their existing data — the breathing effect, the gentle oscillation, the micro-tremors. The narrative text blocks include a "freshness indicator" — a subtle timestamp that shows when the text was last generated, reinforcing that the system is actively monitoring. If the Nerve API itself has not updated for more than 30 minutes (indicating a potential issue with the upstream data sources), a subtle visual indicator appears — perhaps a slight desaturation of the color palette, or a "signal degraded" label — acknowledging the gap rather than pretending the data is fresh.

---

## 6. Transitions: The Scroll as Metamorphosis

The transitions between sections are not decorative — they are narrative. Each transition transforms one visual metaphor into the next, creating a sense of continuous descent. The scroll position drives the transformation, giving the user direct control over the pace of the metamorphosis.

### Transition 1: Clock to Pulse

This transition spans approximately 300 pixels of scroll distance (roughly 40% of a viewport height). It is implemented as a scroll-linked animation using the Intersection Observer API or GSAP ScrollTrigger.

**Phase 1 (0–100px):** The clock face begins to scale up. The outer ring expands beyond the viewport edges. The background subtly darkens. The tick marks and XII label fade to zero opacity. The score text in the center begins to blur.

**Phase 2 (100–200px):** The single clock hand splits. Five colored threads emerge from the fracture point, each pulling away from the center at a slightly different angle. The score text dissolves into particles that drift downward. The luminous ring is now entirely off-screen; the user is "inside" the clock.

**Phase 3 (200–300px):** The five threads rotate from their radial orientation to horizontal. They spread vertically to their final positions as the domain pulses. The first domain labels fade in. The background color stabilizes at the Pulse section's palette. The transition is complete.

### Transition 2: Pulse to Depth

This transition spans approximately 400 pixels. It is slower and more contemplative, matching the shift in emotional register from urgency to exploration.

**Phase 1 (0–150px):** The domain pulses begin to curve. Their straight horizontal paths bend gently, as if pulled by gravity toward the center of the screen. The narrative text fades out. The pulse labels dissolve.

**Phase 2 (150–300px):** The curved threads begin to weave around each other, forming a braid of colored light. The braid tightens as the threads converge on a central point. The background shifts — deepening to true black for the Mycelial Network, or developing a subtle texture for other concepts.

**Phase 3 (300–400px):** The braided threads reach the convergence point and explode outward into the new structure. For the Mycelial Network, the threads become the primary edges of the force-directed graph, and the 22 signal nodes materialize at their endpoints. The physics simulation activates, and the network settles into its initial configuration over 800 milliseconds.

### Color continuity

Throughout both transitions, the five domain colors are maintained as a thread of visual continuity. The same blue that colored the Markets segment of the clock hand becomes the Markets pulse line, which becomes the Markets nodes in the network. This color consistency is the connective tissue that makes the three sections feel like one experience rather than three separate pages.

---

## 7. Mobile Experience: Intimacy at Scale

The mobile experience is not a compromise — it is an opportunity to create a more intimate version of the same narrative. The phone screen, held close to the face, creates a natural sense of immersion that a desktop monitor cannot match. The key adaptations:

### Section 1: The Clock

The Clock fills the mobile viewport completely. The reduced screen size actually amplifies the sublime effect — the clock feels closer, more immediate, more personal. The score text is slightly larger relative to the clock face to ensure legibility. The scroll-down cue is a gentle upward swipe indicator at the bottom of the screen.

The transition to the Pulse section is adapted for the vertical format: instead of the camera pushing through the clock, the clock dissolves from the center outward, the hand fracturing into five threads that fall downward like luminous rain, reforming as vertical pulse lines.

### Section 2: The Pulse

The domain pulses are rendered vertically rather than horizontally, stacked in a column. Each pulse scrolls from bottom to top (present at the bottom, past at the top), which aligns with the natural scroll direction. The Breaking News Pulse is given the most screen width and is positioned centrally.

Interaction is touch-native: tapping on a pulse beat opens the synthesized news card as a bottom sheet (sliding up from the bottom of the screen), which is the standard mobile pattern for contextual information. The card can be dismissed with a downward swipe.

The narrative text blocks are rendered as full-width cards that appear between the pulse groups, creating a natural reading rhythm: scroll, read, scroll, explore, scroll, read.

### Section 3: The Depth

For the Mycelial Network, the 3D visualization is rendered at a slightly higher zoom level (closer to the network) to compensate for the smaller screen. Single-finger drag rotates the network; pinch-to-zoom controls the zoom level. Tapping a node opens its detail panel as a bottom sheet.

For the Glass Pane concept, the phone's gyroscope could be used as the "light source" — tilting the phone changes the angle of the raking light, revealing different parts of the crack network. This creates a uniquely mobile-native interaction that has no desktop equivalent.

### Performance considerations

Mobile devices have less GPU power and smaller batteries. The WebGL visualizations in Section 3 should include a performance budget: if the frame rate drops below 30fps, the rendering quality should degrade gracefully (reducing particle counts, simplifying the network graph, lowering the resolution of glow effects) rather than stuttering. The news pipeline should use SSE rather than WebSockets on mobile, as SSE is more battery-efficient for unidirectional data streams.

---

## 8. Technical Stack Recommendation

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| Front-end framework | Next.js (React) | SSR for initial load performance; React ecosystem for component architecture |
| Scroll animation | GSAP ScrollTrigger | Industry-standard scroll-linked animation; performant, well-documented |
| 2D visualization | Canvas API (custom) | The pulse lines require per-pixel control that SVG cannot provide at 60fps |
| 3D visualization | Three.js + WebGL | Required for the Mycelial Network / Fracture concepts; mature, well-supported |
| Real-time delivery | Server-Sent Events | Simpler than WebSockets for unidirectional push; auto-reconnect built in |
| News pipeline backend | Python (FastAPI) | Consistent with the existing Nerve engine; async-native for concurrent API calls |
| News synthesis | Perplexity API (sonar-pro) | Real-time web grounding; concise synthesis capability |
| Headline ingestion | NewsAPI | Broad source coverage; category-based filtering |
| Caching | Redis Streams | Time-series storage with pub/sub; low latency |
| Hosting | Render (or Vercel + Render) | Consistent with existing Nerve infrastructure |

---

## 9. Open Questions & Next Steps

Several decisions remain open and should be resolved before development begins:

**Section 3 concept selection.** This brief recommends the Mycelial Network but the Glass Pane is a compelling alternative. A quick prototype of both (even as static mockups) would help make the final call. The Glass Pane is simpler to build and more emotionally striking; the Mycelial Network is richer in information and more technically impressive.

**Historical data availability.** The Ice Core concept (and to some extent, the narrative text in Section 2) benefits from deep historical data. The current `/history` endpoint returns limited data. If historical reconstruction is feasible, it would significantly enrich the experience.

**Sound design.** This brief has mentioned sound in passing (the creaking glass, the pulse of new events), but sound is a powerful and underused dimension in data visualization. A dedicated sound design pass — even a simple one, using Web Audio API to generate tones mapped to the data — could dramatically amplify the emotional impact of the experience.

**The Fracture Sphere.** The fourth prototype (the Fracture Sphere) is not directly included in the three-section scroll narrative. However, it could serve as an alternative or complement to the Mycelial Network in Section 3, or it could be repurposed as a loading/splash animation while the page initializes and fetches its first data from the API.

**Authentication and rate limiting.** The news pipeline makes frequent calls to NewsAPI and Perplexity. Both have rate limits that must be respected. The caching layer (Redis) mitigates this, but the pipeline should include circuit breakers and fallback behavior (e.g., serving cached events if the APIs are temporarily unavailable).

---

## References

[1] The Nerve v2 — Systemic Risk Monitoring Engine API. https://nerve-engine.onrender.com/current

[2] The Nerve — Edge Score Visual Prototypes. https://nerve-visuals.onrender.com

[3] Pentagram, "Bulletin of the Atomic Scientists" (data visualization case study). https://www.pentagram.com/work/bulletin-of-the-atomic-scientists-2

[4] Shorthand, "Scrollytelling examples: 12 scroll-driven stories to inspire you." https://shorthand.com/the-craft/scrollytelling-examples/index.html
