import * as THREE from "three";

/**
 * The Iga Night mascot — an original character, built procedurally from primitives so there
 * is no model file to download and nothing third-party in the scene.
 *
 * Design (design_port.md "Iga Night"): chibi, roughly 2.2 heads tall, indigo hood and suit
 * with a deeper indigo shade, a cream face opening, plain oval eyes with a catch-light, a
 * torii-red sash with a knotted bow and two tails, a short sword hilt over the right
 * shoulder, and two ribbon tails off the hood knot.
 *
 * Cel look without extra dependencies: MeshToonMaterial over a 3-step gradient map, plus an
 * inverted-hull outline on the two big masses. Rigged without bones — the parts are grouped
 * and animated directly, which is plenty for look-at, blink, float and a throw.
 */

export type Pose = "idle" | "look" | "leap" | "throw";

export type MascotHandle = {
  group: THREE.Group;
  /** Where to look, in roughly −1…1 of the viewport. */
  lookAt(x: number, y: number): void;
  setPose(pose: Pose): void;
  /** Advance the animation. `t` is seconds, `dt` seconds since the last frame. */
  update(t: number, dt: number): void;
  /** True while a throw is mid-swing, so the scene knows when to release the shuriken. */
  consumeThrowRelease(): boolean;
  dispose(): void;
};

const INDIGO = 0x2f6bff;
const INDIGO_DEEP = 0x1e3fa8;
const CREAM = 0xf6d9b8;
const SUMI = 0x1a1530;
const TORII = 0xd62839;
const STEEL = 0x9ca2c2;
const NIGHT = 0x070a1f;

/** Three flat bands — the whole cel look comes from this one texture. */
function toonGradient(): THREE.DataTexture {
  const data = new Uint8Array([90, 170, 255]);
  const tex = new THREE.DataTexture(data, data.length, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export function createMascot(): MascotHandle {
  const group = new THREE.Group();
  const gradientMap = toonGradient();
  const disposables: { dispose(): void }[] = [gradientMap];

  const toon = (color: number) => {
    const m = new THREE.MeshToonMaterial({ color, gradientMap });
    disposables.push(m);
    return m;
  };
  const basic = (color: number) => {
    const m = new THREE.MeshBasicMaterial({ color });
    disposables.push(m);
    return m;
  };
  const track = <T extends THREE.BufferGeometry>(g: T) => {
    disposables.push(g);
    return g;
  };

  const hood = toon(INDIGO);
  const hoodDeep = toon(INDIGO_DEEP);
  const skin = toon(CREAM);
  const ink = basic(SUMI);
  const red = toon(TORII);
  const steel = toon(STEEL);

  // ── body ────────────────────────────────────────────────────────────────
  const body = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.34, 0.34, 4, 16)), hood);
  body.position.y = 0.52;
  group.add(body);

  // ── head: hood sphere, cream face opening, eyes ─────────────────────────
  const headPivot = new THREE.Group();
  headPivot.position.y = 1.08;
  group.add(headPivot);

  const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.46, 24, 18)), hood);
  headPivot.add(head);

  // the opening is a flattened sphere sunk into the hood, so the hood keeps its edge
  const face = new THREE.Mesh(track(new THREE.SphereGeometry(0.4, 20, 16)), skin);
  face.position.set(0, -0.03, 0.12);
  face.scale.set(0.82, 0.7, 0.72);
  headPivot.add(face);

  const eyes = new THREE.Group();
  eyes.position.set(0, 0.0, 0.3);
  headPivot.add(eyes);
  const eyeGeo = track(new THREE.SphereGeometry(0.058, 14, 10));
  const glintGeo = track(new THREE.SphereGeometry(0.019, 8, 6));
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(eyeGeo, ink);
    eye.position.set(0.14 * side, 0, 0.06);
    eye.scale.set(0.82, 1.25, 0.6); // oval, not round
    eyes.add(eye);
    const glint = new THREE.Mesh(glintGeo, basic(0xffffff));
    glint.position.set(0.14 * side + 0.022 * side, 0.03, 0.1);
    eyes.add(glint);
  }

  // hood knot and its two ribbon tails
  const knot = new THREE.Mesh(track(new THREE.SphereGeometry(0.1, 12, 10)), hoodDeep);
  knot.position.set(0, 0.12, -0.44);
  headPivot.add(knot);
  const ribbons: THREE.Mesh[] = [];
  const ribbonGeo = track(new THREE.BoxGeometry(0.07, 0.42, 0.02));
  for (const side of [-1, 1]) {
    const ribbon = new THREE.Mesh(ribbonGeo, hoodDeep);
    ribbon.position.set(0.07 * side, -0.08, -0.5);
    ribbon.rotation.z = 0.25 * side;
    headPivot.add(ribbon);
    ribbons.push(ribbon);
  }

  // ── sash, bow and tails ─────────────────────────────────────────────────
  const sash = new THREE.Mesh(track(new THREE.TorusGeometry(0.33, 0.055, 8, 20)), red);
  sash.position.y = 0.44;
  sash.rotation.x = Math.PI / 2;
  group.add(sash);
  const bow = new THREE.Mesh(track(new THREE.SphereGeometry(0.09, 10, 8)), red);
  bow.position.set(0, 0.44, 0.3);
  bow.scale.set(1.4, 0.8, 0.7);
  group.add(bow);
  const sashTailGeo = track(new THREE.BoxGeometry(0.08, 0.3, 0.02));
  for (const side of [-1, 1]) {
    const tail = new THREE.Mesh(sashTailGeo, red);
    tail.position.set(0.06 * side, 0.3, 0.3);
    tail.rotation.z = 0.3 * side;
    group.add(tail);
    ribbons.push(tail);
  }

  // ── arms ────────────────────────────────────────────────────────────────
  const armGeo = track(new THREE.CapsuleGeometry(0.1, 0.26, 4, 10));
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  armL.position.set(-0.36, 0.78, 0);
  armR.position.set(0.36, 0.78, 0);
  for (const [pivot, side] of [
    [armL, -1],
    [armR, 1],
  ] as const) {
    const arm = new THREE.Mesh(armGeo, hood);
    arm.position.y = -0.2;
    pivot.add(arm);
    const hand = new THREE.Mesh(track(new THREE.SphereGeometry(0.105, 10, 8)), skin);
    hand.position.y = -0.38;
    pivot.add(hand);
    pivot.rotation.z = 0.22 * side;
    group.add(pivot);
  }

  // ── legs ────────────────────────────────────────────────────────────────
  const legGeo = track(new THREE.CapsuleGeometry(0.115, 0.2, 4, 10));
  const footGeo = track(new THREE.BoxGeometry(0.2, 0.09, 0.26));
  const legs: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(0.17 * side, 0.26, 0);
    const leg = new THREE.Mesh(legGeo, hoodDeep);
    leg.position.y = -0.14;
    pivot.add(leg);
    const foot = new THREE.Mesh(footGeo, ink);
    foot.position.set(0, -0.28, 0.05);
    pivot.add(foot);
    group.add(pivot);
    legs.push(pivot);
  }

  // ── sword hilt over the right shoulder ──────────────────────────────────
  const hilt = new THREE.Group();
  hilt.position.set(0.3, 0.86, -0.22);
  hilt.rotation.z = -0.5;
  const grip = new THREE.Mesh(track(new THREE.CylinderGeometry(0.035, 0.035, 0.36, 8)), ink);
  hilt.add(grip);
  const guard = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 10)), steel);
  guard.position.y = -0.2;
  hilt.add(guard);
  group.add(hilt);

  // ── inverted-hull outline on the two big masses ─────────────────────────
  const outlineMat = new THREE.MeshBasicMaterial({ color: NIGHT, side: THREE.BackSide });
  disposables.push(outlineMat);
  for (const [mesh, scale] of [
    [head, 1.05],
    [body, 1.06],
  ] as const) {
    const outline = new THREE.Mesh(mesh.geometry, outlineMat);
    outline.scale.setScalar(scale);
    mesh.add(outline);
  }

  // ── animation state ─────────────────────────────────────────────────────
  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  let pose: Pose = "idle";
  let poseT = 0;
  let blinkAt = 2.4;
  let blink = 0;
  let throwReleased = false;
  let releasePending = false;

  return {
    group,
    lookAt(x, y) {
      look.tx = Math.max(-1, Math.min(1, x));
      look.ty = Math.max(-1, Math.min(1, y));
    },
    setPose(next) {
      if (next === pose) return;
      pose = next;
      poseT = 0;
      if (next === "throw") releasePending = true;
    },
    consumeThrowRelease() {
      const v = throwReleased;
      throwReleased = false;
      return v;
    },
    update(t, dt) {
      poseT += dt;

      // eased look-at: head turns, eyes lead it slightly
      look.x += (look.tx - look.x) * Math.min(1, dt * 6);
      look.y += (look.ty - look.y) * Math.min(1, dt * 6);
      headPivot.rotation.y = look.x * 0.5;
      headPivot.rotation.x = -look.y * 0.3;
      eyes.position.x = look.x * 0.04;
      eyes.position.y = -look.y * 0.03;

      // blink: a quick squash of the eye group, every few seconds
      blinkAt -= dt;
      if (blinkAt <= 0) {
        blink = 0.14;
        blinkAt = 2.6 + Math.random() * 3.4;
      }
      if (blink > 0) {
        blink -= dt;
        const k = Math.max(0, Math.sin((blink / 0.14) * Math.PI));
        eyes.scale.y = 1 - 0.9 * k;
      } else {
        eyes.scale.y = 1;
      }

      // float, and a gentle ribbon sway that lags the body
      const bob = Math.sin(t * 1.6) * 0.035;
      group.position.y = bob;
      group.rotation.y = Math.sin(t * 0.5) * 0.06 + look.x * 0.12;
      ribbons.forEach((r, i) => {
        r.rotation.x = Math.sin(t * 2.2 + i) * 0.18;
      });

      // poses
      if (pose === "leap") {
        const k = Math.min(1, poseT / 0.7);
        const arc = Math.sin(k * Math.PI);
        group.position.y = bob + arc * 0.5;
        group.rotation.z = arc * 0.25;
        legs[0].rotation.x = -arc * 0.9;
        legs[1].rotation.x = arc * 0.6;
        armL.rotation.x = -arc * 1.1;
        armR.rotation.x = -arc * 0.8;
        if (k >= 1) this.setPose("idle");
      } else if (pose === "throw") {
        const k = Math.min(1, poseT / 0.55);
        // wind up, then snap the right arm forward
        const swing = k < 0.45 ? -(k / 0.45) * 1.5 : -1.5 + ((k - 0.45) / 0.55) * 3.4;
        armR.rotation.x = swing;
        group.rotation.y = Math.sin(t * 0.5) * 0.06 + look.x * 0.12 - k * 0.2;
        if (releasePending && k > 0.5) {
          releasePending = false;
          throwReleased = true;
        }
        if (k >= 1) this.setPose("idle");
      } else {
        // settle back to rest
        const ease = Math.min(1, dt * 5);
        group.rotation.z += (0 - group.rotation.z) * ease;
        armL.rotation.x += (0 - armL.rotation.x) * ease;
        armR.rotation.x += (0 - armR.rotation.x) * ease;
        legs[0].rotation.x += (0 - legs[0].rotation.x) * ease;
        legs[1].rotation.x += (0 - legs[1].rotation.x) * ease;
      }
    },
    dispose() {
      group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry?.dispose?.();
      });
      disposables.forEach((d) => d.dispose());
    },
  };
}
