"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createCharacter, type CharacterHandle, type CharacterName, type Pose } from "@/lib/scene/cast";
import { theme } from "@/content/theme";
import { shakeEnergy, startTilt, tiltX, tiltY } from "@/lib/tilt";

/**
 * A stage for the Iga Night troupe. One canvas, any number of characters.
 *
 * Everything here is additive — the page reads perfectly without it — so the component is
 * free to give up: no WebGL, a slow GPU, a hidden tab or an off-screen stage and it simply
 * stops. The rules it keeps (design_port.md §9): never server-rendered, pixel ratio capped,
 * no shadow maps, paused when not visible, dropped to 30fps once you stop interacting, and
 * everything disposed on unmount.
 *
 * Reduced motion does not mean "nothing". It renders a single still frame and never starts
 * a loop, so the character is there to look at without anything moving.
 */

const SLOW_FRAME_MS = 24; // mean over the first 30 frames that means "give up"
const IDLE_MS = 3000; // after this long without input, draw at 30fps
const IDLE_FRAME_MS = 1000 / 30;

export type CastMember = {
  name: CharacterName;
  /** Position on the stage floor, in world units. */
  x?: number;
  z?: number;
  scale?: number;
  /** Yaw, in radians. 0 faces the camera. */
  turn?: number;
  /** A looping pose to hold, e.g. "sit" for the dog or "run" along a rooftop. */
  hold?: Pose;
  /** What this one does when the stage is clicked. */
  onTap?: Pose;
};

export type CastSceneProps = {
  cast: CastMember[];
  /** Sakura petals. Pass false for a close-up where they would only add noise. */
  petals?: boolean;
  /** Whether a tap (or the keyboard button) throws a shuriken from the first thrower. */
  shuriken?: boolean;
  camera?: { y?: number; z?: number; fov?: number; look?: number };
  className?: string;
  /** Label for the keyboard-only action button. */
  action?: string;
};

export function CastScene({
  cast,
  petals = true,
  shuriken = false,
  camera: cam,
  className = "",
  action = "Play the scene",
}: CastSceneProps) {
  const mount = useRef<HTMLDivElement>(null);
  const fire = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);

  // `cast` is a literal at every call site; serialising it keeps the effect from re-running
  // on every parent render without asking callers to memoise.
  const castKey = JSON.stringify(cast);
  const camKey = JSON.stringify(cam ?? null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const members: CastMember[] = JSON.parse(castKey);
    const camOpt: NonNullable<CastSceneProps["camera"]> = JSON.parse(camKey) ?? {};
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !phone, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2));
    } catch {
      // No WebGL at all. Deferred so the effect does not cascade a render.
      const id = requestAnimationFrame(() => setFailed(true));
      return () => cancelAnimationFrame(id);
    }

    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(camOpt.fov ?? 32, 1, 0.1, 100);
    camera.position.set(0, camOpt.y ?? 1.1, camOpt.z ?? 5.2);
    camera.lookAt(0, camOpt.look ?? 0.9, 0);

    // Moonlight: a cool key from the upper right, a warm lantern bounce from below left.
    scene.add(new THREE.HemisphereLight(0xbfd0ff, 0x1a1530, 1.1));
    const key = new THREE.DirectionalLight(0xffe7a8, 2.2);
    key.position.set(3, 4, 2);
    scene.add(key);
    const bounce = new THREE.PointLight(0xffc857, 6, 12);
    bounce.position.set(-1.4, -0.6, 1.6);
    scene.add(bounce);

    // ── the troupe ────────────────────────────────────────────────────────
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
    const shadowGeo = new THREE.PlaneGeometry(1, 1);

    const actors: { handle: CharacterHandle; onTap?: Pose; canThrow: boolean }[] = [];
    for (const m of members) {
      const handle = createCharacter(m.name);
      handle.group.position.set(m.x ?? 0, 0, m.z ?? 0);
      handle.group.rotation.y = m.turn ?? 0;
      if (m.scale) handle.group.scale.setScalar(m.scale);
      scene.add(handle.group);

      const sh = new THREE.Mesh(shadowGeo, shadowMat);
      sh.rotation.x = -Math.PI / 2;
      sh.position.set(m.x ?? 0, -0.02, m.z ?? 0);
      sh.scale.setScalar(handle.height * 1.5 * (m.scale ?? 1));
      scene.add(sh);

      if (m.hold) handle.setPose(m.hold);
      actors.push({ handle, onTap: m.onTap, canThrow: m.name !== "shiro" });
    }

    // ── petals: one InstancedMesh, so the whole drift is a single draw call ──
    const petalCount = petals ? (phone ? theme.petals.phone : theme.petals.desktop) : 0;
    const petalGeo = new THREE.PlaneGeometry(0.075, 0.05);
    const petalMat = new THREE.MeshBasicMaterial({ color: 0xff9eb5, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const petalMesh = petalCount ? new THREE.InstancedMesh(petalGeo, petalMat, petalCount) : null;
    if (petalMesh) {
      petalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(petalMesh);
    }
    const seeds = Array.from({ length: petalCount }, () => ({
      x: (Math.random() - 0.5) * 9,
      y: Math.random() * 6 - 1,
      z: (Math.random() - 0.5) * 4,
      spin: Math.random() * Math.PI,
      speed: 0.25 + Math.random() * 0.45,
      sway: 0.4 + Math.random() * 0.9,
    }));
    const dummy = new THREE.Object3D();

    // ── the shuriken ──────────────────────────────────────────────────────
    // The dog has no hands, so a throw belongs to the first character who does.
    const thrower = shuriken ? actors.find((a) => a.canThrow) : undefined;
    const star = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = i % 2 === 0 ? 0.17 : 0.06;
      if (i === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else star.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    star.closePath();
    const starGeo = new THREE.ExtrudeGeometry(star, { depth: 0.012, bevelEnabled: false });
    const starMat = new THREE.MeshToonMaterial({ color: 0x9ca2c2, transparent: true });
    const star3d = new THREE.Mesh(starGeo, starMat);
    star3d.visible = false;
    if (shuriken) scene.add(star3d);
    let flight = -1;
    let lastThrow = -Infinity;
    const handPos = new THREE.Vector3();

    // ── loop state ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let visible = false;
    let raf = 0;
    let lastInput = performance.now();
    let frames = 0;
    let frameTotal = 0;
    let dead = false;
    let sinceDraw = 0;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (still) draw(0, 0);
    };

    function draw(t: number, dt: number) {
      for (const a of actors) a.handle.update(t, dt);

      if (thrower && thrower.handle.consumeThrowRelease()) {
        thrower.handle.handAnchor().getWorldPosition(handPos);
        star3d.position.copy(handPos);
        star3d.visible = true;
        starMat.opacity = 1;
        flight = 0;
      }
      if (flight >= 0) {
        flight += dt;
        star3d.position.x += dt * 5.2;
        star3d.position.y += dt * 0.55;
        star3d.rotation.z -= dt * 26;
        starMat.opacity = Math.max(0, 1 - flight / 1.25);
        if (flight > 1.25) {
          flight = -1;
          star3d.visible = false;
          starMat.opacity = 1; // ready for the next throw
        }
      }

      if (petalMesh) {
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
          petalMesh.setMatrixAt(i, dummy.matrix);
        }
        petalMesh.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    resize();

    // A still frame under reduced motion: set up, draw once, listen to nothing.
    if (still) {
      draw(0, 0);
      const roStill = new ResizeObserver(resize);
      roStill.observe(el);
      return () => {
        roStill.disconnect();
        for (const a of actors) a.handle.dispose();
        petalGeo.dispose();
        petalMat.dispose();
        starGeo.dispose();
        starMat.dispose();
        shadowGeo.dispose();
        shadowMat.dispose();
        shadowTex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    const throwStar = () => {
      const now = performance.now();
      if (!thrower || now - lastThrow < theme.shurikenCooldown) return;
      lastThrow = now;
      lastInput = now;
      thrower.handle.setPose("throw");
    };
    fire.current = shuriken ? throwStar : () => actors.forEach((a) => a.onTap && a.handle.setPose(a.onTap));

    const frame = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.getElapsedTime();

      // Once idle, draw at 30fps — but carry the skipped time into the next frame's dt, or
      // every animation would quietly run at half speed.
      sinceDraw += dt;
      if (performance.now() - lastInput > IDLE_MS && sinceDraw * 1000 < IDLE_FRAME_MS) return;
      const step = Math.min(0.05, sinceDraw);
      sinceDraw = 0;

      const started = performance.now();
      draw(t, step);

      // Give up early on a GPU that cannot keep up.
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
      clock.getDelta(); // drop the time spent paused
      sinceDraw = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const sync = () => (visible && !document.hidden ? start() : stop());

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

    // ── input ─────────────────────────────────────────────────────────────
    startTilt();
    const onPointer = (e: PointerEvent) => {
      lastInput = performance.now();
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = ((e.clientY - r.top) / r.height) * 2 - 1;
      for (const a of actors) a.handle.lookAt(x, y);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onClick = () => {
      lastInput = performance.now();
      for (const a of actors) if (a.onTap) a.handle.setPose(a.onTap);
    };
    el.addEventListener("click", onClick);

    const offTilt = tiltX.on("change", (v) => {
      for (const a of actors) a.handle.lookAt(v * 2, tiltY.get() * 2);
    });
    const offShake = shakeEnergy.on("change", (v) => {
      if (v > 0.45) fire.current();
    });

    const reduceMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => {
      if (reduceMql.matches) stop();
    };
    reduceMql.addEventListener("change", onReduce);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
      el.removeEventListener("click", onClick);
      reduceMql.removeEventListener("change", onReduce);
      offTilt();
      offShake();
      for (const a of actors) a.handle.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [castKey, camKey, petals, shuriken]);

  if (failed) return null;

  return (
    <div className={`relative ${className}`}>
      <div ref={mount} aria-hidden="true" className="size-full" />
      {/* Keyboard equivalent of tapping the stage, visible only when focused. */}
      <button
        type="button"
        onClick={() => fire.current()}
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-4 focus:left-1/2 focus:z-10 focus:-translate-x-1/2 focus:rounded-sm focus:border-2 focus:border-ember focus:bg-panel focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.12em] focus:text-ink"
      >
        {action}
      </button>
    </div>
  );
}

export default CastScene;
