"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createMascot, type MascotHandle } from "@/lib/scene/mascot";
import { theme } from "@/content/theme";
import { shakeEnergy, startTilt, tiltX, tiltY } from "@/lib/tilt";

/**
 * The hero's night scene: the mascot on a rooftop, sakura petals on the wind, and a
 * shuriken he throws across the moon.
 *
 * Everything here is additive — the SVG poster underneath is the real first paint, so if
 * WebGL is missing, the GPU is slow, or the tab is hidden, nothing is lost. Follows the
 * rules in design_port.md: capped pixel ratio, no shadows, paused off-screen, dropped to
 * 30fps once you stop interacting, and fully disposed on unmount.
 */

const SLOW_FRAME_MS = 24; // average over the first 30 frames that means "give up"
const IDLE_MS = 3000; // after this with no input, drop to 30fps

export function NightScene({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);
  const throwRef = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      const phone = window.innerWidth < 768;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !phone, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2));
    } catch {
      // No WebGL: stay with the SVG poster. Deferred so the effect doesn't cascade a render.
      const id = requestAnimationFrame(() => setFailed(true));
      return () => cancelAnimationFrame(id);
    }

    const phone = window.innerWidth < 768;
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 1.1, 5.2);
    camera.lookAt(0, 0.9, 0);

    // Moonlight: a cool key from the upper right, a warm bounce from the lanterns below.
    scene.add(new THREE.HemisphereLight(0xbfd0ff, 0x1a1530, 1.1));
    const key = new THREE.DirectionalLight(0xffe7a8, 2.2);
    key.position.set(3, 4, 2);
    scene.add(key);
    const bounce = new THREE.PointLight(0xffc857, 6, 12);
    bounce.position.set(-1.4, -0.6, 1.6);
    scene.add(bounce);

    // ── mascot ──────────────────────────────────────────────────────────
    const mascot: MascotHandle = createMascot();
    scene.add(mascot.group);

    // a fake contact shadow, since real shadows are off
    const shadowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(7,10,31,0.55)");
      grad.addColorStop(1, "rgba(7,10,31,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadowGeo = new THREE.PlaneGeometry(1.7, 1.7);
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -0.02;
    scene.add(contactShadow);

    // ── petals: one InstancedMesh, so the whole drift is a single draw call ──
    const petalCount = phone ? theme.petals.phone : theme.petals.desktop;
    const petalGeo = new THREE.PlaneGeometry(0.075, 0.05);
    const petalMat = new THREE.MeshBasicMaterial({ color: 0xff9eb5, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const petals = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
    petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(petals);
    const seeds = Array.from({ length: petalCount }, () => ({
      x: (Math.random() - 0.5) * 9,
      y: Math.random() * 6 - 1,
      z: (Math.random() - 0.5) * 4,
      spin: Math.random() * Math.PI,
      speed: 0.25 + Math.random() * 0.45,
      sway: 0.4 + Math.random() * 0.9,
    }));
    const dummy = new THREE.Object3D();

    // ── shuriken ────────────────────────────────────────────────────────
    const star = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = i % 2 === 0 ? 0.17 : 0.06;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) star.moveTo(x, y);
      else star.lineTo(x, y);
    }
    star.closePath();
    const shurikenGeo = new THREE.ExtrudeGeometry(star, { depth: 0.012, bevelEnabled: false });
    const shurikenMat = new THREE.MeshToonMaterial({ color: 0x9ca2c2 });
    const shuriken = new THREE.Mesh(shurikenGeo, shurikenMat);
    shuriken.visible = false;
    scene.add(shuriken);
    let flight = -1; // seconds into the current flight, or -1 when idle
    let lastThrow = -Infinity;

    // ── loop state ──────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let visible = false;
    let raf = 0;
    let lastInput = performance.now();
    let frames = 0;
    let frameTotal = 0;
    let dead = false;
    let lastDraw = 0;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const throwShuriken = () => {
      const now = performance.now();
      if (now - lastThrow < theme.shurikenCooldown) return;
      lastThrow = now;
      lastInput = now;
      mascot.setPose("throw");
    };
    throwRef.current = throwShuriken;

    const frame = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.getElapsedTime();
      const now = performance.now();

      // once idle, draw at 30fps instead of every frame
      const idle = now - lastInput > IDLE_MS;
      if (idle && now - lastDraw < 33) return;
      lastDraw = now;

      const started = performance.now();

      mascot.update(t, dt);
      if (mascot.consumeThrowRelease()) {
        flight = 0;
        shuriken.visible = true;
        shuriken.position.set(0.5, 1.15, 0.2);
      }

      if (flight >= 0) {
        flight += dt;
        shuriken.position.x += dt * 5.2;
        shuriken.position.y += dt * 0.55;
        shuriken.rotation.z -= dt * 26;
        const fade = Math.max(0, 1 - flight / 1.25);
        shurikenMat.opacity = fade;
        shurikenMat.transparent = true;
        if (flight > 1.25) {
          flight = -1;
          shuriken.visible = false;
        }
      }

      // petals fall, drift, and lean with the pointer like wind
      const wind = tiltX.get() * 1.6;
      for (let i = 0; i < petalCount; i++) {
        const s = seeds[i];
        s.y -= s.speed * dt;
        if (s.y < -1.8) {
          s.y = 5.2;
          s.x = (Math.random() - 0.5) * 9;
        }
        dummy.position.set(s.x + Math.sin(t * s.sway + s.spin) * 0.35 + wind, s.y, s.z);
        dummy.rotation.set(t * s.sway, t * s.speed * 2 + s.spin, s.spin);
        dummy.updateMatrix();
        petals.setMatrixAt(i, dummy.matrix);
      }
      petals.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      // give up early on a GPU that can't keep up
      if (frames < 30) {
        frameTotal += performance.now() - started;
        if (++frames === 30 && frameTotal / 30 > SLOW_FRAME_MS) {
          dead = true;
          setFailed(true);
        }
      }
    };

    const loop = () => {
      if (dead) return;
      frame();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (dead || raf) return;
      clock.getDelta();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const sync = () => (visible && !document.hidden ? start() : stop());

    // pause when off-screen or the tab is hidden
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // input: pointer and tilt steer the gaze, a click or shake throws
    startTilt();
    const onPointer = (e: PointerEvent) => {
      lastInput = performance.now();
      const r = el.getBoundingClientRect();
      mascot.lookAt(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    const onClick = () => {
      lastInput = performance.now();
      mascot.setPose("leap");
    };
    el.addEventListener("click", onClick);

    const offTiltX = tiltX.on("change", (v) => mascot.lookAt(v * 2, tiltY.get() * 2));
    const offShake = shakeEnergy.on("change", (v) => {
      if (v > 0.45) throwShuriken();
    });

    const reduceMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => reduceMql.matches && setFailed(true);
    reduceMql.addEventListener("change", onReduce);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
      el.removeEventListener("click", onClick);
      reduceMql.removeEventListener("change", onReduce);
      offTiltX();
      offShake();
      mascot.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      shurikenGeo.dispose();
      shurikenMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) return null;

  return (
    <div className={`relative ${className}`}>
      <div ref={mount} aria-hidden="true" className="size-full" />
      {/* Keyboard equivalent for the click action, visible only when focused. */}
      <button
        type="button"
        onClick={() => throwRef.current()}
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-4 focus:left-1/2 focus:z-10 focus:-translate-x-1/2 focus:rounded-sm focus:border-2 focus:border-ember focus:bg-panel focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.12em] focus:text-ink"
      >
        Throw a shuriken
      </button>
    </div>
  );
}

export default NightScene;
