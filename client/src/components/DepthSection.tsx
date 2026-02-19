/**
 * Section 3: The Depth (Immersive) — Act III: Agency
 * 
 * Design: Abyssal Cartography
 * - Mycelial Network: force-directed 3D graph in Three.js
 * - 22 signal nodes colored by domain, sized by value
 * - Connections = correlations, brightness = strength
 * - Fragility ratio controls network tension
 * - Auto-rotation when not interacting
 * - Drag to rotate, scroll/pinch to zoom, click node for details
 * - 2D canvas overlay for node labels
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useNerve } from '@/contexts/NerveContext';
import { getRegimeColors } from '@/lib/syntheticData';
import type { Signal } from '@/lib/syntheticData';

interface NodeData {
  signal: Signal;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mesh: THREE.Mesh;
  glowMesh: THREE.Mesh;
}

function SignalDetail({ signal, onClose }: { signal: Signal; onClose: () => void }) {
  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 w-72 md:w-80 z-50 rounded-lg border p-5 backdrop-blur-xl"
      style={{
        background: 'rgba(0, 0, 0, 0.92)',
        borderColor: signal.domainColor + '30',
        boxShadow: `0 0 60px ${signal.domainColor}10, inset 0 0 20px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="font-data text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded"
          style={{
            color: signal.domainColor,
            background: signal.domainColor + '12',
            border: `1px solid ${signal.domainColor}20`,
          }}
        >
          {signal.domain}
        </span>
        <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors text-xl leading-none">&times;</button>
      </div>
      <h3 className="font-data text-lg mb-1" style={{ color: signal.domainColor }}>
        {signal.name}
      </h3>
      <p className="text-xs text-white/35 mb-4 leading-relaxed" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        {signal.description}
      </p>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-data text-[9px] text-white/25">Value</span>
          <span className="font-data text-xs" style={{ color: signal.domainColor }}>
            {signal.value.toFixed(3)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-data text-[9px] text-white/25">Status</span>
          <span className={`font-data text-[9px] uppercase tracking-wider ${
            signal.status === 'critical' ? 'text-red-400' :
            signal.status === 'elevated' ? 'text-amber-400' : 'text-cyan-400'
          }`}>
            {signal.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-data text-[9px] text-white/25">Connections</span>
          <span className="font-data text-xs text-white/40">{signal.connections.length}</span>
        </div>
      </div>
      {signal.connections.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="font-data text-[9px] text-white/15 uppercase tracking-[0.15em] mb-2">
            Strongest Correlations
          </div>
          {signal.connections
            .sort((a, b) => b.strength - a.strength)
            .slice(0, 5)
            .map((conn) => (
              <div key={conn.targetId} className="flex justify-between py-0.5">
                <span className="font-data text-[10px] text-white/35">{conn.targetId}</span>
                <span className="font-data text-[10px] text-white/25">
                  {(conn.strength * 100).toFixed(0)}%
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default function DepthSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelCanvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesRef = useRef<NodeData[]>([]);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ isDown: false, prevX: 0, prevY: 0, lastInteraction: 0 });
  const rotationRef = useRef({ x: 0.3, y: 0 });
  const zoomRef = useRef(4.5);
  const { state } = useNerve();
  const stateRef = useRef(state);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  stateRef.current = state;

  const initScene = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up existing
    if (rendererRef.current) {
      rendererRef.current.dispose();
      const existing = container.querySelector('canvas:not(.label-canvas)');
      if (existing) container.removeChild(existing);
    }

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.06);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = zoomRef.current;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    container.insertBefore(renderer.domElement, container.firstChild);
    rendererRef.current = renderer;

    // Create nodes for each signal
    const signals = stateRef.current.signals;
    const domainCenters: Record<string, THREE.Vector3> = {
      markets: new THREE.Vector3(-1, 0.5, 0),
      climate: new THREE.Vector3(1, 0.8, -0.5),
      information: new THREE.Vector3(0, -0.8, 0.5),
      social: new THREE.Vector3(-0.8, -0.3, -0.8),
      supply: new THREE.Vector3(0.8, -0.2, 0.8),
    };

    const nodes: NodeData[] = signals.map((sig) => {
      const color = new THREE.Color(sig.domainColor);
      const nodeSize = 0.06 + sig.value * 0.06;

      // Sphere geometry for node
      const geometry = new THREE.SphereGeometry(nodeSize, 20, 20);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geometry, material);

      // Glow sphere
      const glowGeo = new THREE.SphereGeometry(nodeSize * 2.5, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.12,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);

      // Position near domain center with randomness
      const center = domainCenters[sig.domain] || new THREE.Vector3();
      const position = new THREE.Vector3(
        center.x + (Math.random() - 0.5) * 0.8,
        center.y + (Math.random() - 0.5) * 0.8,
        center.z + (Math.random() - 0.5) * 0.8
      );

      mesh.position.copy(position);
      glowMesh.position.copy(position);
      mesh.userData = { signalId: sig.id };

      scene.add(mesh);
      scene.add(glowMesh);

      return {
        signal: sig,
        position,
        velocity: new THREE.Vector3(),
        mesh,
        glowMesh,
      };
    });
    nodesRef.current = nodes;

    // Connection lines
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);
    linesRef.current = lines;

    return () => {
      renderer.dispose();
      const el = container.querySelector('canvas:not(.label-canvas)');
      if (el) container.removeChild(el);
    };
  }, []);

  const animate = useCallback(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const nodes = nodesRef.current;
    if (!scene || !camera || !renderer || nodes.length === 0) return;

    const { fragilityRatio, signals } = stateRef.current;
    const time = performance.now() * 0.001;

    // Update signal data
    nodes.forEach((node, i) => {
      if (signals[i]) {
        node.signal = signals[i];
      }
    });

    // Force-directed simulation
    const repulsionStrength = 0.015;
    const attractionStrength = 0.008 * (1 + fragilityRatio * 2);
    const damping = 0.9;
    const centerPull = 0.003;

    nodes.forEach((nodeA, i) => {
      const force = new THREE.Vector3();

      // Center pull
      force.add(nodeA.position.clone().negate().multiplyScalar(centerPull));

      // Repulsion from other nodes
      nodes.forEach((nodeB, j) => {
        if (i === j) return;
        const diff = nodeA.position.clone().sub(nodeB.position);
        const dist = Math.max(diff.length(), 0.15);
        diff.normalize().multiplyScalar(repulsionStrength / (dist * dist));
        force.add(diff);
      });

      // Attraction along connections
      nodeA.signal.connections.forEach((conn) => {
        const targetNode = nodes.find((n) => n.signal.id === conn.targetId);
        if (!targetNode) return;
        const diff = targetNode.position.clone().sub(nodeA.position);
        const dist = diff.length();
        const idealDist = 0.5 + (1 - conn.strength) * 1.5;
        diff.normalize().multiplyScalar((dist - idealDist) * attractionStrength * conn.strength);
        force.add(diff);
      });

      // Organic tremor
      const tremor = new THREE.Vector3(
        Math.sin(time * 2.3 + i * 1.7) * 0.0008,
        Math.sin(time * 3.1 + i * 2.3) * 0.0008,
        Math.sin(time * 1.7 + i * 3.1) * 0.0008
      ).multiplyScalar(1 + fragilityRatio * 4);
      force.add(tremor);

      nodeA.velocity.add(force);
      nodeA.velocity.multiplyScalar(damping);
      nodeA.position.add(nodeA.velocity);

      // Update mesh positions
      nodeA.mesh.position.copy(nodeA.position);
      nodeA.glowMesh.position.copy(nodeA.position);

      // Pulse glow based on signal value
      const pulse = 0.08 + Math.sin(time * 1.5 + i) * 0.04 + nodeA.signal.value * 0.12;
      (nodeA.glowMesh.material as THREE.MeshBasicMaterial).opacity = pulse;
      const scale = 1 + Math.sin(time * 2 + i * 0.5) * 0.15;
      nodeA.glowMesh.scale.setScalar(scale);

      // Update node size based on value
      const newSize = 0.06 + nodeA.signal.value * 0.06;
      nodeA.mesh.scale.setScalar(newSize / 0.06);
    });

    // Update connection lines
    const positions: number[] = [];
    const colors: number[] = [];
    const drawn = new Set<string>();

    nodes.forEach((nodeA) => {
      nodeA.signal.connections.forEach((conn) => {
        const key = [nodeA.signal.id, conn.targetId].sort().join('-');
        if (drawn.has(key)) return;
        drawn.add(key);

        const targetNode = nodes.find((n) => n.signal.id === conn.targetId);
        if (!targetNode) return;

        positions.push(
          nodeA.position.x, nodeA.position.y, nodeA.position.z,
          targetNode.position.x, targetNode.position.y, targetNode.position.z
        );

        const colorA = new THREE.Color(nodeA.signal.domainColor);
        const colorB = new THREE.Color(targetNode.signal.domainColor);
        const alpha = Math.min(1, conn.strength * (0.3 + fragilityRatio * 0.7));
        colors.push(
          colorA.r * alpha, colorA.g * alpha, colorA.b * alpha,
          colorB.r * alpha, colorB.g * alpha, colorB.b * alpha
        );
      });
    });

    const lineGeo = linesRef.current?.geometry;
    if (lineGeo) {
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }

    // Auto-rotation when not interacting
    const timeSinceInteraction = time - mouseRef.current.lastInteraction;
    if (timeSinceInteraction > 2) {
      rotationRef.current.y += 0.002;
    }

    // Camera position from rotation
    const targetRotX = rotationRef.current.x;
    const targetRotY = rotationRef.current.y;
    camera.position.x = Math.sin(targetRotY) * Math.cos(targetRotX) * zoomRef.current;
    camera.position.y = Math.sin(targetRotX) * zoomRef.current;
    camera.position.z = Math.cos(targetRotY) * Math.cos(targetRotX) * zoomRef.current;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    // Draw 2D labels on overlay canvas
    const labelCanvas = labelCanvasRef.current;
    if (labelCanvas && camera) {
      const lCtx = labelCanvas.getContext('2d');
      if (lCtx) {
        const dpr = window.devicePixelRatio || 1;
        const container = containerRef.current;
        if (container) {
          const cw = container.clientWidth;
          const ch = container.clientHeight;
          labelCanvas.width = cw * dpr;
          labelCanvas.height = ch * dpr;
          lCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
          lCtx.clearRect(0, 0, cw, ch);

          nodes.forEach((node) => {
            const projected = node.position.clone().project(camera);
            const screenX = (projected.x * 0.5 + 0.5) * cw;
            const screenY = (-projected.y * 0.5 + 0.5) * ch;

            // Only draw if in front of camera
            if (projected.z < 1 && projected.z > -1) {
              const dist = node.position.distanceTo(camera.position);
              const labelAlpha = Math.max(0.1, Math.min(0.5, 1 - dist / 8));

              lCtx.font = '9px "JetBrains Mono", monospace';
              lCtx.fillStyle = node.signal.domainColor;
              lCtx.globalAlpha = labelAlpha;
              lCtx.textAlign = 'center';
              lCtx.fillText(node.signal.name, screenX, screenY - 12);
              lCtx.globalAlpha = 1;
            }
          });
        }
      }
    }

    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const cleanup = initScene();
    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      cleanup?.();
    };
  }, [initScene, animate]);

  // Mouse/touch interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
      mouseRef.current.lastInteraction = performance.now() * 0.001;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseRef.current.isDown) return;
      const dx = e.clientX - mouseRef.current.prevX;
      const dy = e.clientY - mouseRef.current.prevY;
      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x += dy * 0.005;
      rotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationRef.current.x));
      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
      mouseRef.current.lastInteraction = performance.now() * 0.001;
    };
    const onMouseUp = () => { mouseRef.current.isDown = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current = Math.max(2.5, Math.min(8, zoomRef.current + e.deltaY * 0.004));
      mouseRef.current.lastInteraction = performance.now() * 0.001;
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        mouseRef.current.isDown = true;
        mouseRef.current.prevX = e.touches[0].clientX;
        mouseRef.current.prevY = e.touches[0].clientY;
        mouseRef.current.lastInteraction = performance.now() * 0.001;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!mouseRef.current.isDown || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - mouseRef.current.prevX;
      const dy = e.touches[0].clientY - mouseRef.current.prevY;
      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x += dy * 0.005;
      rotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationRef.current.x));
      mouseRef.current.prevX = e.touches[0].clientX;
      mouseRef.current.prevY = e.touches[0].clientY;
      mouseRef.current.lastInteraction = performance.now() * 0.001;
    };
    const onTouchEnd = () => { mouseRef.current.isDown = false; };

    // Click to select node
    const onClick = (e: MouseEvent) => {
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!camera || !renderer) return;

      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.params.Points = { threshold: 0.2 };
      raycaster.setFromCamera(mouse, camera);

      // Check against both mesh and glow for easier clicking
      const allMeshes = nodesRef.current.flatMap((n) => [n.mesh, n.glowMesh]);
      const intersects = raycaster.intersectObjects(allMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const signalId = hit.userData.signalId || nodesRef.current.find(n => n.glowMesh === hit)?.signal.id;
        if (signalId) {
          const signal = stateRef.current.signals.find((s) => s.id === signalId);
          if (signal) setSelectedSignal(signal);
        }
      }
    };

    // Resize
    const onResize = () => {
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!camera || !renderer || !container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const colors = getRegimeColors(state.regime);

  return (
    <section
      id="depth-section"
      className="relative w-full h-screen"
      style={{ background: '#000000' }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        {/* Label overlay canvas */}
        <canvas
          ref={labelCanvasRef}
          className="label-canvas absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        />
      </div>

      {/* Section label */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <div className="font-data text-[9px] tracking-[0.35em] uppercase" style={{ color: colors.primary, opacity: 0.25 }}>
          Act III — The Depth
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

      {/* Fragility indicator */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <div className="font-data text-[9px] tracking-[0.15em] text-white/20 uppercase mb-1">
          Fragility Ratio
        </div>
        <div className="font-data text-2xl" style={{ color: colors.primary, textShadow: `0 0 15px ${colors.glow}` }}>
          {state.fragilityRatio.toFixed(3)}
        </div>
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-8 right-8 z-10 pointer-events-none">
        <div className="font-data text-[9px] tracking-[0.1em] text-white/12 text-right leading-relaxed">
          drag to rotate<br />scroll to zoom<br />click node for details
        </div>
      </div>

      {/* Edge Score overlay */}
      <div className="absolute top-8 right-8 z-10 pointer-events-none">
        <div className="font-data text-[9px] tracking-[0.15em] text-white/20 uppercase mb-1 text-right">
          Edge Score
        </div>
        <div className="font-data text-lg text-right" style={{ color: colors.primary }}>
          {state.edgeScore.toFixed(3)}
        </div>
      </div>

      {/* Domain legend */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex gap-4">
          {state.domains.map((d) => (
            <div key={d.key} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.color, boxShadow: `0 0 4px ${d.color}` }} />
              <span className="font-data text-[8px] tracking-wider text-white/20 uppercase">{d.key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Signal detail panel */}
      {selectedSignal && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setSelectedSignal(null)} />
          <SignalDetail signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
        </>
      )}
    </section>
  );
}
