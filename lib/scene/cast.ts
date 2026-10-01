import * as THREE from "three";

/**
 * The Iga Night troupe — five original characters, built procedurally from primitives.
 *
 * They are a set, not five unrelated models: one builder, one palette discipline, one
 * cel-shading recipe (MeshToonMaterial over a 3-step gradient map plus an inverted-hull
 * outline), so a head seen in the footer plainly belongs with the one in the hero. What
 * separates them is silhouette, proportion and accessory — the things you read at
 * thumbnail size — rather than surface detail that disappears on a phone.
 *
 *   kuro   the lead        tall-ish, indigo hood, red sash, one sword   — hero
 *   beni   the rival       taller, violet, gold trim, topknot, two swords, long scarf
 *   kiku   the youngest    short and round, green, oversized hood, huge eyes
 *   gen    the elder       stout, ochre robe, straw kasa, beard, staff
 *   shiro  the dog         quadruped, cream, red collar, tail that wags
 *
 * Every character is rigged the same way — hips, torso, neck, two two-segment arms, two
 * two-segment legs — so a pose written once reads on all of them. No bones, no model file,
 * no third-party asset: the whole troupe is arithmetic.
 */

export type CharacterName = "kuro" | "beni" | "kiku" | "gen" | "shiro";
export type Pose = "idle" | "look" | "leap" | "throw" | "wave" | "bow" | "run" | "sit";

export type CharacterHandle = {
  group: THREE.Group;
  /** Roughly how tall the character stands, so a scene can frame its camera. */
  height: number;
  /** Where to look, in about -1..1 of the viewport. */
  lookAt(x: number, y: number): void;
  setPose(p: Pose): void;
  getPose(): Pose;
  /** The object a thrown prop should start from. */
  handAnchor(): THREE.Object3D;
  update(t: number, dt: number): void;
  /** True on the single frame a throw releases. */
  consumeThrowRelease(): boolean;
  dispose(): void;
};

const NIGHT = 0x070a1f;
const SUMI = 0x1a1530;

type EyeStyle = "round" | "sharp" | "slit";

type Spec = {
  scale: number;
  headR: number;
  bodyR: number;
  bodyLen: number;
  suit: number;
  suitDeep: number;
  skin: number;
  accent: number;
  eyes: EyeStyle;
  /** A cowl over the skull with a face opening cut into it. */
  hood: boolean;
  kasa: boolean;
  topknot: boolean;
  beard: boolean;
  scarf: boolean;
  staff: boolean;
  swords: number;
  bob: number;
};

const SPECS: Record<Exclude<CharacterName, "shiro">, Spec> = {
  kuro: {
    scale: 1, headR: 0.46, bodyR: 0.34, bodyLen: 0.34,
    suit: 0x2f6bff, suitDeep: 0x1e3fa8, skin: 0xf6d9b8, accent: 0xd62839,
    eyes: "round", hood: true, kasa: false, topknot: false, beard: false,
    scarf: false, staff: false, swords: 1, bob: 0.035,
  },
  beni: {
    scale: 1.1, headR: 0.42, bodyR: 0.32, bodyLen: 0.46,
    suit: 0x6b3fa0, suitDeep: 0x42226b, skin: 0xf2cda6, accent: 0xffc857,
    eyes: "sharp", hood: true, kasa: false, topknot: true, beard: false,
    scarf: true, staff: false, swords: 2, bob: 0.026,
  },
  kiku: {
    scale: 0.76, headR: 0.52, bodyR: 0.33, bodyLen: 0.18,
    suit: 0x2fa36b, suitDeep: 0x1a6b46, skin: 0xf9e2c6, accent: 0xff9eb5,
    eyes: "round", hood: true, kasa: false, topknot: false, beard: false,
    scarf: false, staff: false, swords: 0, bob: 0.052,
  },
  gen: {
    scale: 0.98, headR: 0.43, bodyR: 0.4, bodyLen: 0.3,
    suit: 0xa8762f, suitDeep: 0x6b4a1c, skin: 0xf0cfa6, accent: 0xd62839,
    eyes: "slit", hood: false, kasa: true, topknot: false, beard: true,
    scarf: false, staff: true, swords: 0, bob: 0.018,
  },
};

/** Three flat bands — the entire cel look comes out of this one texture. */
function toonGradient(): THREE.DataTexture {
  const tex = new THREE.DataTexture(new Uint8Array([88, 168, 255]), 3, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

/** Bookkeeping shared by both builders, so nothing leaks when a scene unmounts. */
function makeKit() {
  const gradientMap = toonGradient();
  const bin: { dispose(): void }[] = [gradientMap];
  return {
    bin,
    toon(color: number) {
      const m = new THREE.MeshToonMaterial({ color, gradientMap });
      bin.push(m);
      return m;
    },
    flat(color: number) {
      const m = new THREE.MeshBasicMaterial({ color });
      bin.push(m);
      return m;
    },
    geo<T extends THREE.BufferGeometry>(g: T) {
      bin.push(g);
      return g;
    },
  };
}

type Kit = ReturnType<typeof makeKit>;

/** An inverted hull: the same geometry, grown slightly, drawn back-faces-only in night blue. */
function outline(mesh: THREE.Mesh, mat: THREE.Material, scale: number) {
  const o = new THREE.Mesh(mesh.geometry, mat);
  o.scale.setScalar(scale);
  mesh.add(o);
}

/* ────────────────────────────────────────────────────────────────────────────
   The humanoids
   ──────────────────────────────────────────────────────────────────────── */

type Humanoid = {
  root: THREE.Group;
  torso: THREE.Group;
  neck: THREE.Group;
  eyes: THREE.Group;
  brows: THREE.Group | null;
  shoulders: [THREE.Group, THREE.Group];
  elbows: [THREE.Group, THREE.Group];
  hips: [THREE.Group, THREE.Group];
  knees: [THREE.Group, THREE.Group];
  hand: THREE.Object3D;
  cloth: THREE.Object3D[];
  hipY: number;
  height: number;
};

function buildHumanoid(kit: Kit, s: Spec): Humanoid {
  const root = new THREE.Group();

  const suit = kit.toon(s.suit);
  const suitDeep = kit.toon(s.suitDeep);
  const skin = kit.toon(s.skin);
  const accent = kit.toon(s.accent);
  const steel = kit.toon(0x9ca2c2);
  const ink = kit.flat(SUMI);
  const outlineMat = kit.flat(NIGHT);
  (outlineMat as THREE.MeshBasicMaterial).side = THREE.BackSide;

  const hipY = 0.3 + s.bodyLen * 0.2;
  const cloth: THREE.Object3D[] = [];

  // ── legs ──────────────────────────────────────────────────────────────
  const thighGeo = kit.geo(new THREE.CapsuleGeometry(0.115, 0.16, 4, 10));
  const shinGeo = kit.geo(new THREE.CapsuleGeometry(0.1, 0.14, 4, 10));
  const footGeo = kit.geo(new THREE.BoxGeometry(0.2, 0.09, 0.27));
  const hips: THREE.Group[] = [];
  const knees: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(0.16 * side, hipY, 0);
    const thigh = new THREE.Mesh(thighGeo, suitDeep);
    thigh.position.y = -0.12;
    hip.add(thigh);

    const knee = new THREE.Group();
    knee.position.y = -0.24;
    const shin = new THREE.Mesh(shinGeo, suitDeep);
    shin.position.y = -0.09;
    knee.add(shin);
    const foot = new THREE.Mesh(footGeo, ink);
    foot.position.set(0, -0.19, 0.05);
    knee.add(foot);
    hip.add(knee);

    root.add(hip);
    hips.push(hip);
    knees.push(knee);
  }

  // ── torso ─────────────────────────────────────────────────────────────
  const torso = new THREE.Group();
  torso.position.y = hipY;
  root.add(torso);

  const body = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(s.bodyR, s.bodyLen, 4, 16)), suit);
  body.position.y = s.bodyLen * 0.5 + 0.04;
  torso.add(body);
  outline(body, outlineMat, 1.06);

  // obi sash, knot and two tails
  const sash = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(s.bodyR * 0.97, 0.055, 8, 20)), accent);
  sash.position.y = 0.02;
  sash.rotation.x = Math.PI / 2;
  torso.add(sash);
  const knot = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.085, 10, 8)), accent);
  knot.position.set(0, 0.02, s.bodyR * 0.9);
  knot.scale.set(1.5, 0.85, 0.7);
  torso.add(knot);
  const sashTailGeo = kit.geo(new THREE.BoxGeometry(0.075, 0.28, 0.02));
  for (const side of [-1, 1]) {
    const tail = new THREE.Mesh(sashTailGeo, accent);
    tail.position.set(0.055 * side, -0.12, s.bodyR * 0.9);
    tail.rotation.z = 0.28 * side;
    torso.add(tail);
    cloth.push(tail);
  }

  // ── arms: shoulder → elbow → hand ─────────────────────────────────────
  const upperGeo = kit.geo(new THREE.CapsuleGeometry(0.095, 0.16, 4, 10));
  const foreGeo = kit.geo(new THREE.CapsuleGeometry(0.085, 0.14, 4, 10));
  const handGeo = kit.geo(new THREE.SphereGeometry(0.1, 10, 8));
  const shoulderY = s.bodyLen + 0.02;
  const shoulders: THREE.Group[] = [];
  const elbows: THREE.Group[] = [];
  let rightHand: THREE.Object3D = torso;
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set((s.bodyR + 0.09) * side, shoulderY, 0.02);
    const upper = new THREE.Mesh(upperGeo, suit);
    upper.position.y = -0.12;
    shoulder.add(upper);

    const elbow = new THREE.Group();
    elbow.position.y = -0.24;
    const fore = new THREE.Mesh(foreGeo, suit);
    fore.position.y = -0.1;
    elbow.add(fore);
    const hand = new THREE.Mesh(handGeo, skin);
    hand.position.y = -0.23;
    elbow.add(hand);
    shoulder.add(elbow);

    torso.add(shoulder);
    shoulders.push(shoulder);
    elbows.push(elbow);
    if (side === 1) rightHand = hand;
  }

  // ── head ──────────────────────────────────────────────────────────────
  const neck = new THREE.Group();
  neck.position.y = s.bodyLen + 0.26;
  torso.add(neck);

  const head = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(s.headR, 24, 18)), s.hood ? suit : skin);
  neck.add(head);
  outline(head, outlineMat, 1.05);

  if (s.hood) {
    // The opening is a flattened sphere pushed through the front of the cowl. It has to come
    // out the far side: sink it level with the hood and the whole head renders as a blank
    // dome, which is exactly what it did before these numbers were worked out properly.
    // Front of the face reaches headR * 1.19; the hood ends at headR, so it stands proud by
    // about a fifth of a head, and is narrower and shorter so the cowl still rims it.
    const face = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(s.headR * 0.96, 20, 16)), skin);
    face.position.set(0, -0.04, s.headR * 0.44);
    face.scale.set(0.84, 0.74, 0.78);
    neck.add(face);

    const hoodKnot = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.095, 12, 10)), suitDeep);
    hoodKnot.position.set(0, 0.12, -s.headR * 0.95);
    neck.add(hoodKnot);
    const ribbonGeo = kit.geo(new THREE.BoxGeometry(0.07, 0.4, 0.02));
    for (const side of [-1, 1]) {
      const ribbon = new THREE.Mesh(ribbonGeo, suitDeep);
      ribbon.position.set(0.07 * side, -0.1, -s.headR * 1.07);
      ribbon.rotation.z = 0.24 * side;
      neck.add(ribbon);
      cloth.push(ribbon);
    }
  }

  // eyes — the main thing that separates one face from another
  const eyes = new THREE.Group();
  // just shy of the face surface at headR * 1.19, so they read as set into it
  eyes.position.set(0, 0, s.headR * (s.hood ? 1.0 : 0.82));
  neck.add(eyes);
  const gap = s.headR * 0.3;
  if (s.eyes === "slit") {
    const slitGeo = kit.geo(new THREE.BoxGeometry(0.13, 0.022, 0.02));
    for (const side of [-1, 1]) {
      const slit = new THREE.Mesh(slitGeo, kit.flat(SUMI));
      slit.position.set(gap * side, 0.01, 0.06);
      slit.rotation.z = -0.12 * side;
      eyes.add(slit);
    }
  } else {
    const sharp = s.eyes === "sharp";
    const eyeGeo = kit.geo(new THREE.SphereGeometry(sharp ? 0.052 : 0.06, 14, 10));
    const glintGeo = kit.geo(new THREE.SphereGeometry(0.019, 8, 6));
    const white = kit.flat(0xffffff);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, kit.flat(SUMI));
      eye.position.set(gap * side, 0, 0.06);
      eye.scale.set(sharp ? 1.15 : 0.84, sharp ? 0.82 : 1.3, 0.6);
      if (sharp) eye.rotation.z = -0.3 * side;
      eyes.add(eye);
      const glint = new THREE.Mesh(glintGeo, white);
      glint.position.set(gap * side + 0.022 * side, 0.032, 0.1);
      eyes.add(glint);
    }
  }

  // brows: only the rival gets them, angled down to read as a scowl
  let brows: THREE.Group | null = null;
  if (s.eyes === "sharp") {
    brows = new THREE.Group();
    brows.position.set(0, 0.12, s.headR * (s.hood ? 0.98 : 0.8));
    const browGeo = kit.geo(new THREE.BoxGeometry(0.13, 0.025, 0.02));
    for (const side of [-1, 1]) {
      const brow = new THREE.Mesh(browGeo, kit.flat(SUMI));
      brow.position.set(gap * side, 0, 0.04);
      brow.rotation.z = 0.42 * side;
      brows.add(brow);
    }
    neck.add(brows);
  }

  if (s.topknot) {
    const base = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.1, 10, 8)), kit.toon(0x241a36));
    base.position.y = s.headR * 0.92;
    base.scale.set(1, 0.7, 1);
    neck.add(base);
    const tuft = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.045, 0.16, 4, 8)), kit.toon(0x241a36));
    tuft.position.set(0, s.headR * 1.1, -0.06);
    tuft.rotation.x = -0.6;
    neck.add(tuft);
    cloth.push(tuft);
  }

  if (s.beard) {
    const beardMat = kit.toon(0xe6e2d4);
    const beard = new THREE.Mesh(kit.geo(new THREE.ConeGeometry(0.16, 0.34, 10)), beardMat);
    beard.position.set(0, -s.headR * 0.8, s.headR * 0.5);
    beard.rotation.x = 0.18;
    neck.add(beard);
    const brow = kit.geo(new THREE.BoxGeometry(0.15, 0.04, 0.03));
    for (const side of [-1, 1]) {
      const b = new THREE.Mesh(brow, beardMat);
      b.position.set(gap * side, 0.11, s.headR * 0.84);
      b.rotation.z = -0.18 * side;
      neck.add(b);
    }
  }

  if (s.kasa) {
    // a conical straw hat, with a brim ring so the silhouette reads at any size
    const straw = kit.toon(0xd8b36a);
    const cone = new THREE.Mesh(kit.geo(new THREE.ConeGeometry(0.62, 0.34, 18, 1, true)), straw);
    (cone.material as THREE.MeshToonMaterial).side = THREE.DoubleSide;
    cone.position.y = s.headR * 0.72;
    neck.add(cone);
    const rim = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.6, 0.022, 6, 24)), kit.toon(0x8a6a34));
    rim.position.y = s.headR * 0.72 - 0.16;
    rim.rotation.x = Math.PI / 2;
    neck.add(rim);
  }

  if (s.scarf) {
    const neckBand = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.2, 0.05, 8, 16)), accent);
    neckBand.position.y = s.bodyLen + 0.08;
    neckBand.rotation.x = Math.PI / 2;
    torso.add(neckBand);
    const tailGeo = kit.geo(new THREE.BoxGeometry(0.13, 0.62, 0.03));
    for (const side of [-1, 1]) {
      const t = new THREE.Mesh(tailGeo, accent);
      t.position.set(0.1 * side, s.bodyLen - 0.2, -0.2);
      t.rotation.set(0.25, 0, 0.18 * side);
      torso.add(t);
      cloth.push(t);
    }
  }

  for (let i = 0; i < s.swords; i++) {
    const hilt = new THREE.Group();
    hilt.position.set(0.26 - i * 0.12, s.bodyLen + 0.05, -0.2 - i * 0.07);
    hilt.rotation.z = -0.5 - i * 0.18;
    const grip = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.034, 0.034, 0.34, 8)), ink);
    hilt.add(grip);
    const guard = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.095, 0.095, 0.03, 10)), steel);
    guard.position.y = -0.19;
    hilt.add(guard);
    torso.add(hilt);
  }

  if (s.staff) {
    const staff = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.03, 0.035, 1.9, 8)), kit.toon(0x6b4a26));
    staff.position.set(0.46, 0.42, 0.12);
    staff.rotation.z = -0.06;
    torso.add(staff);
    const ring = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.075, 0.014, 6, 14)), kit.toon(0xffc857));
    ring.position.set(0.5, 1.3, 0.12);
    torso.add(ring);
  }

  const height = hipY + s.bodyLen + s.headR * 2 + (s.kasa ? 0.2 : 0.1);
  return {
    root, torso, neck, eyes, brows,
    shoulders: shoulders as [THREE.Group, THREE.Group],
    elbows: elbows as [THREE.Group, THREE.Group],
    hips: hips as [THREE.Group, THREE.Group],
    knees: knees as [THREE.Group, THREE.Group],
    hand: rightHand, cloth, hipY, height,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   The dog
   ──────────────────────────────────────────────────────────────────────── */

type Dog = {
  root: THREE.Group;
  neck: THREE.Group;
  eyes: THREE.Group;
  ears: [THREE.Group, THREE.Group];
  tail: THREE.Group;
  legs: THREE.Group[];
  height: number;
};

function buildDog(kit: Kit): Dog {
  const root = new THREE.Group();
  const coat = kit.toon(0xf4ecd8);
  const coatDeep = kit.toon(0xd9cdb2);
  const red = kit.toon(0xd62839);
  const ink = kit.flat(SUMI);
  const outlineMat = kit.flat(NIGHT);
  (outlineMat as THREE.MeshBasicMaterial).side = THREE.BackSide;

  const bodyY = 0.42;
  const body = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.26, 0.34, 4, 14)), coat);
  body.rotation.z = Math.PI / 2;
  body.position.y = bodyY;
  root.add(body);
  outline(body, outlineMat, 1.07);

  // four legs, front pair slightly forward of the back pair
  const legGeo = kit.geo(new THREE.CapsuleGeometry(0.072, 0.18, 4, 8));
  const pawGeo = kit.geo(new THREE.SphereGeometry(0.085, 10, 8));
  const legs: THREE.Group[] = [];
  for (const [fx, side] of [[0.22, -1], [0.22, 1], [-0.22, -1], [-0.22, 1]] as const) {
    const hip = new THREE.Group();
    hip.position.set(fx, bodyY - 0.08, 0.14 * side);
    const leg = new THREE.Mesh(legGeo, coatDeep);
    leg.position.y = -0.14;
    hip.add(leg);
    const paw = new THREE.Mesh(pawGeo, coat);
    paw.position.y = -0.27;
    hip.add(paw);
    root.add(hip);
    legs.push(hip);
  }

  // head
  const neck = new THREE.Group();
  neck.position.set(0.4, bodyY + 0.22, 0);
  root.add(neck);
  const head = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.26, 20, 16)), coat);
  neck.add(head);
  outline(head, outlineMat, 1.06);
  const snout = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.14, 14, 12)), coat);
  snout.position.set(0.19, -0.07, 0);
  snout.scale.set(1.2, 0.78, 0.9);
  neck.add(snout);
  const nose = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.052, 10, 8)), ink);
  nose.position.set(0.33, -0.04, 0);
  neck.add(nose);

  const eyes = new THREE.Group();
  neck.add(eyes);
  const eyeGeo = kit.geo(new THREE.SphereGeometry(0.047, 12, 10));
  const glintGeo = kit.geo(new THREE.SphereGeometry(0.016, 8, 6));
  const white = kit.flat(0xffffff);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(eyeGeo, ink);
    eye.position.set(0.16, 0.06, 0.14 * side);
    eye.scale.set(0.8, 1.15, 1);
    eyes.add(eye);
    const glint = new THREE.Mesh(glintGeo, white);
    glint.position.set(0.2, 0.09, 0.15 * side);
    eyes.add(glint);
  }

  // floppy ears, hinged at the top of the skull
  const earGeo = kit.geo(new THREE.CapsuleGeometry(0.055, 0.17, 4, 8));
  const ears: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(-0.04, 0.18, 0.17 * side);
    const ear = new THREE.Mesh(earGeo, coatDeep);
    ear.position.y = -0.12;
    ear.scale.set(1, 1, 0.55);
    pivot.add(ear);
    pivot.rotation.x = 0.45 * side;
    neck.add(pivot);
    ears.push(pivot);
  }

  const collar = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.2, 0.038, 8, 16)), red);
  collar.position.set(0.27, bodyY + 0.08, 0);
  collar.rotation.y = Math.PI / 2;
  collar.rotation.x = 0.3;
  root.add(collar);

  const tail = new THREE.Group();
  tail.position.set(-0.36, bodyY + 0.14, 0);
  const tailMesh = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.055, 0.26, 4, 8)), coatDeep);
  tailMesh.position.y = 0.15;
  tail.add(tailMesh);
  tail.rotation.z = 0.7;
  root.add(tail);

  return { root, neck, eyes, ears: ears as [THREE.Group, THREE.Group], tail, legs, height: 0.95 };
}

/* ────────────────────────────────────────────────────────────────────────────
   Rigs
   ──────────────────────────────────────────────────────────────────────── */

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

export function createCharacter(name: CharacterName): CharacterHandle {
  const kit = makeKit();
  const group = new THREE.Group();

  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  let pose: Pose = "idle";
  let poseT = 0;
  let blinkIn = 2.4;
  let blink = 0;
  let released = false;
  let pendingRelease = false;

  const dispose = () => {
    group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.geometry?.dispose?.();
    });
    kit.bin.forEach((d) => d.dispose());
  };

  /* ── the dog has its own, simpler rig ───────────────────────────────── */
  if (name === "shiro") {
    const d = buildDog(kit);
    group.add(d.root);
    return {
      group,
      height: d.height,
      lookAt(x, y) {
        look.tx = clamp1(x);
        look.ty = clamp1(y);
      },
      setPose(p) {
        if (p === pose) return;
        pose = p;
        poseT = 0;
      },
      getPose: () => pose,
      handAnchor: () => d.neck,
      consumeThrowRelease: () => false,
      update(t, dt) {
        poseT += dt;
        look.x += (look.tx - look.x) * Math.min(1, dt * 6);
        look.y += (look.ty - look.y) * Math.min(1, dt * 6);
        d.neck.rotation.y = look.x * 0.55;
        d.neck.rotation.z = look.y * 0.22;

        blinkIn -= dt;
        if (blinkIn <= 0) {
          blink = 0.13;
          blinkIn = 2.2 + Math.random() * 3;
        }
        if (blink > 0) {
          blink -= dt;
          d.eyes.scale.y = 1 - 0.88 * Math.max(0, Math.sin((blink / 0.13) * Math.PI));
        } else d.eyes.scale.y = 1;

        // the tail is always going; it just goes faster when something happens
        const excited = pose === "run" || pose === "leap" ? 2.4 : 1;
        d.tail.rotation.y = Math.sin(t * 7 * excited) * 0.5 * excited;
        d.ears[0].rotation.x = -0.45 + Math.sin(t * 2.1) * 0.12;
        d.ears[1].rotation.x = 0.45 - Math.sin(t * 2.1 + 0.6) * 0.12;

        if (pose === "run") {
          d.root.position.y = Math.abs(Math.sin(t * 9)) * 0.08;
          d.legs.forEach((l, i) => {
            l.rotation.z = Math.sin(t * 9 + (i % 2 ? Math.PI : 0) + (i > 1 ? 0.5 : 0)) * 0.7;
          });
        } else if (pose === "sit") {
          const k = Math.min(1, poseT / 0.5);
          d.root.position.y = 0;
          d.root.rotation.z = -k * 0.3;
          d.legs[2].rotation.z = k * 1.2;
          d.legs[3].rotation.z = k * 1.2;
          d.legs[0].rotation.z = 0;
          d.legs[1].rotation.z = 0;
        } else if (pose === "leap") {
          const k = Math.min(1, poseT / 0.65);
          const arc = Math.sin(k * Math.PI);
          d.root.position.y = arc * 0.55;
          d.root.rotation.z = arc * 0.35;
          d.legs.forEach((l, i) => {
            l.rotation.z = (i < 2 ? -1 : 1) * arc * 0.8;
          });
          if (k >= 1) {
            pose = "idle";
            poseT = 0;
          }
        } else {
          const ease = Math.min(1, dt * 5);
          d.root.position.y += (Math.sin(t * 1.9) * 0.018 - d.root.position.y) * ease;
          d.root.rotation.z += (0 - d.root.rotation.z) * ease;
          d.legs.forEach((l) => {
            l.rotation.z += (0 - l.rotation.z) * ease;
          });
        }
      },
      dispose,
    };
  }

  /* ── humanoids ──────────────────────────────────────────────────────── */
  const spec = SPECS[name];
  const h = buildHumanoid(kit, spec);
  h.root.scale.setScalar(spec.scale);
  group.add(h.root);

  const restShoulderZ = 0.22;
  const restElbowX = -0.16;

  return {
    group,
    height: h.height * spec.scale,
    lookAt(x, y) {
      look.tx = clamp1(x);
      look.ty = clamp1(y);
    },
    setPose(p) {
      if (p === pose) return;
      pose = p;
      poseT = 0;
      if (p === "throw") pendingRelease = true;
    },
    getPose: () => pose,
    handAnchor: () => h.hand,
    consumeThrowRelease() {
      const v = released;
      released = false;
      return v;
    },
    update(t, dt) {
      poseT += dt;

      // the head leads, the torso follows about a third as far
      look.x += (look.tx - look.x) * Math.min(1, dt * 6);
      look.y += (look.ty - look.y) * Math.min(1, dt * 6);
      h.neck.rotation.y = look.x * 0.5;
      h.neck.rotation.x = -look.y * 0.3;
      h.torso.rotation.y = look.x * 0.16;
      h.eyes.position.x = look.x * 0.04;
      h.eyes.position.y = -look.y * 0.03;
      if (h.brows) h.brows.position.y = 0.12 - look.y * 0.02;

      blinkIn -= dt;
      if (blinkIn <= 0) {
        blink = 0.14;
        blinkIn = 2.6 + Math.random() * 3.4;
      }
      if (blink > 0) {
        blink -= dt;
        h.eyes.scale.y = 1 - 0.9 * Math.max(0, Math.sin((blink / 0.14) * Math.PI));
      } else h.eyes.scale.y = 1;

      // a breathing float, and cloth that lags behind it
      const bob = Math.sin(t * 1.6) * spec.bob;
      h.root.position.y = bob;
      h.root.rotation.y = Math.sin(t * 0.5) * 0.05 + look.x * 0.1;
      h.cloth.forEach((c, i) => {
        c.rotation.x = Math.sin(t * 2.2 + i * 0.8) * 0.17;
      });

      const ease = Math.min(1, dt * 6);
      const settle = (o: THREE.Object3D, x: number, z = o.rotation.z) => {
        o.rotation.x += (x - o.rotation.x) * ease;
        o.rotation.z += (z - o.rotation.z) * ease;
      };

      if (pose === "leap") {
        const k = Math.min(1, poseT / 0.7);
        const arc = Math.sin(k * Math.PI);
        h.root.position.y = bob + arc * 0.55;
        h.root.rotation.z = arc * 0.22;
        h.hips[0].rotation.x = -arc * 1.0;
        h.hips[1].rotation.x = arc * 0.65;
        h.knees[0].rotation.x = arc * 1.3;
        h.knees[1].rotation.x = arc * 0.4;
        h.shoulders[0].rotation.x = -arc * 1.2;
        h.shoulders[1].rotation.x = -arc * 0.9;
        if (k >= 1) {
          pose = "idle";
          poseT = 0;
        }
      } else if (pose === "throw") {
        const k = Math.min(1, poseT / 0.55);
        // wind the right arm back, then snap it through
        const swing = k < 0.45 ? -(k / 0.45) * 1.6 : -1.6 + ((k - 0.45) / 0.55) * 3.5;
        h.shoulders[1].rotation.x = swing;
        h.elbows[1].rotation.x = k < 0.45 ? -1.1 : -1.1 + ((k - 0.45) / 0.55) * 1.0;
        h.torso.rotation.y = look.x * 0.16 - k * 0.35;
        if (pendingRelease && k > 0.52) {
          pendingRelease = false;
          released = true;
        }
        if (k >= 1) {
          pose = "idle";
          poseT = 0;
        }
      } else if (pose === "wave") {
        const k = Math.min(1, poseT / 1.6);
        h.shoulders[1].rotation.x = -2.1;
        h.shoulders[1].rotation.z = -0.5;
        h.elbows[1].rotation.z = Math.sin(poseT * 9) * 0.5;
        if (k >= 1) {
          pose = "idle";
          poseT = 0;
        }
      } else if (pose === "bow") {
        const k = Math.min(1, poseT / 1.8);
        const depth = Math.sin(Math.min(1, k * 1.6) * Math.PI) * 0.6;
        h.torso.rotation.x = depth;
        h.neck.rotation.x = depth * 0.3;
        settle(h.shoulders[0], depth * 0.4, restShoulderZ * -1 + depth * 0.2);
        settle(h.shoulders[1], depth * 0.4, restShoulderZ - depth * 0.2);
        if (k >= 1) {
          pose = "idle";
          poseT = 0;
        }
      } else if (pose === "run") {
        const c = t * 9;
        h.root.position.y = bob + Math.abs(Math.sin(c)) * 0.07;
        h.hips[0].rotation.x = Math.sin(c) * 0.9;
        h.hips[1].rotation.x = Math.sin(c + Math.PI) * 0.9;
        h.knees[0].rotation.x = Math.max(0, -Math.sin(c)) * 1.1;
        h.knees[1].rotation.x = Math.max(0, -Math.sin(c + Math.PI)) * 1.1;
        h.shoulders[0].rotation.x = Math.sin(c + Math.PI) * 0.8;
        h.shoulders[1].rotation.x = Math.sin(c) * 0.8;
        h.elbows[0].rotation.x = -0.9;
        h.elbows[1].rotation.x = -0.9;
        h.torso.rotation.x = 0.16;
      } else {
        // idle / look: everything eases back to rest
        h.root.rotation.z += (0 - h.root.rotation.z) * ease;
        h.torso.rotation.x += (0 - h.torso.rotation.x) * ease;
        settle(h.shoulders[0], 0, -restShoulderZ);
        settle(h.shoulders[1], 0, restShoulderZ);
        h.elbows[0].rotation.x += (restElbowX - h.elbows[0].rotation.x) * ease;
        h.elbows[1].rotation.x += (restElbowX - h.elbows[1].rotation.x) * ease;
        h.elbows[0].rotation.z += (0 - h.elbows[0].rotation.z) * ease;
        h.elbows[1].rotation.z += (0 - h.elbows[1].rotation.z) * ease;
        h.hips.forEach((p) => (p.rotation.x += (0 - p.rotation.x) * ease));
        h.knees.forEach((p) => (p.rotation.x += (0 - p.rotation.x) * ease));
      }
    },
    dispose,
  };
}
