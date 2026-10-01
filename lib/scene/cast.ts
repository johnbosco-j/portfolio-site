import * as THREE from "three";

/**
 * The Iga Night troupe — five original characters, built procedurally from primitives.
 *
 * They are a set, not five unrelated models: one builder, one palette discipline, one
 * cel-shading recipe (MeshToonMaterial over a 3-step gradient map plus an inverted-hull
 * outline), so a head seen in the footer plainly belongs with the one in the hero. What
 * separates them is silhouette and proportion — the things you read at thumbnail size.
 *
 *   kuro   the lead        indigo hood, red sash, one sword              — hero
 *   beni   the rival       taller and leaner, violet, gold trim, topknot, scarf, two swords
 *   kiku   the youngest    short, big-headed, green, oversized hood
 *   gen    the elder       stout, ochre robe, straw kasa, beard, staff
 *   shiro  the dog         quadruped, cream, red collar, tail that wags
 *
 * The skeleton is measured from the floor up rather than assembled out of ad-hoc offsets:
 * `hipY` is the sum of the leg segments, so every character's feet land exactly on y = 0,
 * and the torso's capsule *starts* at the hip instead of hanging past it — which is what
 * used to swallow the legs whole and leave everyone a featureless lump.
 *
 * Rigged without bones: hips, torso, neck, two two-segment arms and two two-segment legs,
 * grouped so a pose written once reads on all of them.
 */

export type CharacterName = "kuro" | "beni" | "kiku" | "gen" | "shiro";
export type Pose = "idle" | "look" | "leap" | "throw" | "wave" | "bow" | "run" | "sit";

export type CharacterHandle = {
  group: THREE.Group;
  /** How tall the character stands, so a scene can frame its camera. */
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

/* ── measurements ─────────────────────────────────────────────────────────
   One set of segment lengths for the whole troupe, scaled per character. The
   leg segments decide where the hip sits, and therefore where the floor is. */
const SEG = {
  foot: 0.09,
  shin: 0.22,
  thigh: 0.24,
  upperArm: 0.29,
  foreArm: 0.26,
};

type EyeStyle = "round" | "sharp" | "slit";

type Spec = {
  scale: number;
  headR: number;
  /** Torso half-width. Must stay under the leg stance or the legs vanish behind it. */
  torsoR: number;
  /** Hip to shoulder. */
  torsoH: number;
  /** Half the distance between the feet. */
  stance: number;
  legScale: number;
  armScale: number;
  suit: number;
  suitDeep: number;
  skin: number;
  accent: number;
  eyes: EyeStyle;
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
    scale: 1, headR: 0.42, torsoR: 0.235, torsoH: 0.6, stance: 0.165, legScale: 1, armScale: 1,
    suit: 0x2f6bff, suitDeep: 0x1e3fa8, skin: 0xf6d9b8, accent: 0xd62839,
    eyes: "round", hood: true, kasa: false, topknot: false, beard: false,
    scarf: false, staff: false, swords: 1, bob: 0.03,
  },
  beni: {
    scale: 1.06, headR: 0.39, torsoR: 0.22, torsoH: 0.68, stance: 0.155, legScale: 1.14, armScale: 1.1,
    suit: 0x6b3fa0, suitDeep: 0x42226b, skin: 0xf2cda6, accent: 0xffc857,
    eyes: "sharp", hood: true, kasa: false, topknot: true, beard: false,
    scarf: true, staff: false, swords: 2, bob: 0.024,
  },
  kiku: {
    scale: 0.82, headR: 0.47, torsoR: 0.215, torsoH: 0.4, stance: 0.145, legScale: 0.66, armScale: 0.74,
    suit: 0x2fa36b, suitDeep: 0x1a6b46, skin: 0xf9e2c6, accent: 0xff9eb5,
    eyes: "round", hood: true, kasa: false, topknot: false, beard: false,
    scarf: false, staff: false, swords: 0, bob: 0.046,
  },
  gen: {
    scale: 0.94, headR: 0.4, torsoR: 0.285, torsoH: 0.48, stance: 0.175, legScale: 0.76, armScale: 0.84,
    suit: 0xa8762f, suitDeep: 0x6b4a1c, skin: 0xf0cfa6, accent: 0xd62839,
    eyes: "slit", hood: false, kasa: true, topknot: false, beard: true,
    scarf: false, staff: true, swords: 0, bob: 0.016,
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
  shoulders: [THREE.Group, THREE.Group];
  elbows: [THREE.Group, THREE.Group];
  hips: [THREE.Group, THREE.Group];
  knees: [THREE.Group, THREE.Group];
  hand: THREE.Object3D;
  cloth: THREE.Object3D[];
  /** Hip height when standing — also the straight-leg length. */
  hipY: number;
  height: number;
};

/** Rest angles, so poses have something to ease back to. */
const REST = { shoulderZ: 0.1, elbowX: -0.12 };

function buildHumanoid(kit: Kit, s: Spec): Humanoid {
  const root = new THREE.Group();

  const suit = kit.toon(s.suit);
  const suitDeep = kit.toon(s.suitDeep);
  const skin = kit.toon(s.skin);
  const accent = kit.toon(s.accent);
  const steel = kit.toon(0x9ca2c2);
  const ink = kit.flat(SUMI);
  const outlineMat = new THREE.MeshBasicMaterial({ color: NIGHT, side: THREE.BackSide });
  kit.bin.push(outlineMat);

  const leg = { thigh: SEG.thigh * s.legScale, shin: SEG.shin * s.legScale, foot: SEG.foot };
  const arm = { upper: SEG.upperArm * s.armScale, fore: SEG.foreArm * s.armScale };
  // The floor is wherever the legs end, so this is what guarantees the feet touch it.
  const hipY = leg.foot + leg.shin + leg.thigh;
  const cloth: THREE.Object3D[] = [];

  // ── legs ──────────────────────────────────────────────────────────────
  const legR = 0.1;
  const thighGeo = kit.geo(new THREE.CapsuleGeometry(legR, Math.max(0.04, leg.thigh - legR * 2), 4, 10));
  const shinGeo = kit.geo(new THREE.CapsuleGeometry(legR * 0.9, Math.max(0.04, leg.shin - legR * 1.8), 4, 10));
  const footGeo = kit.geo(new THREE.BoxGeometry(legR * 2.1, leg.foot, 0.3));
  const hips: THREE.Group[] = [];
  const knees: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(s.stance * side, hipY, 0);
    const thigh = new THREE.Mesh(thighGeo, suitDeep);
    thigh.position.y = -leg.thigh / 2;
    hip.add(thigh);

    const knee = new THREE.Group();
    knee.position.y = -leg.thigh;
    const shin = new THREE.Mesh(shinGeo, suitDeep);
    shin.position.y = -leg.shin / 2;
    knee.add(shin);
    // the foot points forward, so the stance reads as standing rather than hovering
    const foot = new THREE.Mesh(footGeo, ink);
    foot.position.set(0, -leg.shin - leg.foot / 2, 0.07);
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

  // The capsule's bottom sits exactly on the hip; nothing hangs past it.
  const torsoLen = Math.max(0.05, s.torsoH + 0.18 - s.torsoR * 2);
  const body = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(s.torsoR, torsoLen, 4, 18)), suit);
  body.position.y = s.torsoR + torsoLen / 2 - 0.06;
  body.scale.z = 0.86; // a little flatter front-to-back than it is wide
  torso.add(body);
  outline(body, outlineMat, 1.07);

  // obi sash, knot and two tails, worn at the waist
  const waistY = s.torsoH * 0.34;
  const sash = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(s.torsoR * 0.99, 0.052, 8, 22)), accent);
  sash.position.y = waistY;
  sash.rotation.x = Math.PI / 2;
  sash.scale.y = 0.86;
  torso.add(sash);
  const knot = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.075, 10, 8)), accent);
  knot.position.set(0, waistY, s.torsoR * 0.84);
  knot.scale.set(1.5, 0.9, 0.8);
  torso.add(knot);
  const sashTailGeo = kit.geo(new THREE.BoxGeometry(0.07, 0.24, 0.02));
  for (const side of [-1, 1]) {
    const tail = new THREE.Mesh(sashTailGeo, accent);
    tail.position.set(0.05 * side, waistY - 0.14, s.torsoR * 0.86);
    tail.rotation.z = 0.26 * side;
    torso.add(tail);
    cloth.push(tail);
  }

  // ── arms: shoulder → elbow → hand ─────────────────────────────────────
  const armR = 0.082;
  const upperGeo = kit.geo(new THREE.CapsuleGeometry(armR, Math.max(0.04, arm.upper - armR * 2), 4, 10));
  const foreGeo = kit.geo(new THREE.CapsuleGeometry(armR * 0.92, Math.max(0.04, arm.fore - armR * 1.8), 4, 10));
  const handGeo = kit.geo(new THREE.SphereGeometry(armR * 1.3, 10, 8));
  const shoulderY = s.torsoH + 0.03;
  const shoulders: THREE.Group[] = [];
  const elbows: THREE.Group[] = [];
  let rightHand: THREE.Object3D = torso;
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Group();
    // tucked just inside the torso's edge, so the arm reads as joined to it
    shoulder.position.set((s.torsoR - armR * 0.3) * side, shoulderY, 0);
    const upper = new THREE.Mesh(upperGeo, suit);
    upper.position.y = -arm.upper / 2;
    shoulder.add(upper);

    const elbow = new THREE.Group();
    elbow.position.y = -arm.upper;
    const fore = new THREE.Mesh(foreGeo, suit);
    fore.position.y = -arm.fore / 2;
    elbow.add(fore);
    const hand = new THREE.Mesh(handGeo, skin);
    hand.position.y = -arm.fore - armR * 0.5;
    hand.scale.set(1, 0.92, 0.92);
    elbow.add(hand);
    shoulder.add(elbow);

    // a shoulder cap, which is what stops the join looking like a stuck-on peg
    const cap = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(armR * 1.18, 10, 8)), suit);
    shoulder.add(cap);

    shoulder.rotation.z = REST.shoulderZ * side;
    elbow.rotation.x = REST.elbowX;
    torso.add(shoulder);
    shoulders.push(shoulder);
    elbows.push(elbow);
    if (side === 1) rightHand = hand;
  }

  // ── neck and head ─────────────────────────────────────────────────────
  const neck = new THREE.Group();
  neck.position.y = s.torsoH + 0.1;
  torso.add(neck);

  if (!s.hood) {
    const column = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.085, 0.1, 0.14, 10)), skin);
    column.position.y = -0.08;
    neck.add(column);
  }

  const head = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(s.headR, 24, 18)), s.hood ? suit : skin);
  head.position.y = s.headR * 0.9;
  neck.add(head);
  outline(head, outlineMat, 1.05);

  // the face is a group, so everything on it moves with the head as one piece
  const faceY = s.headR * 0.9;

  if (s.hood) {
    // The opening is a rounded cut-out pushed just through the front of the cowl: proud
    // enough to break the silhouette, shallow enough not to look like a pasted-on mask.
    const face = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(s.headR * 0.72, 20, 16)), skin);
    face.position.set(0, faceY - s.headR * 0.04, s.headR * 0.52);
    face.scale.set(0.9, 0.86, 0.74);
    neck.add(face);

    const hoodKnot = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.085, 12, 10)), suitDeep);
    hoodKnot.position.set(0, faceY + s.headR * 0.22, -s.headR * 0.95);
    neck.add(hoodKnot);
    const ribbonGeo = kit.geo(new THREE.BoxGeometry(0.065, 0.36, 0.02));
    for (const side of [-1, 1]) {
      const ribbon = new THREE.Mesh(ribbonGeo, suitDeep);
      ribbon.position.set(0.065 * side, faceY - 0.04, -s.headR * 1.04);
      ribbon.rotation.z = 0.22 * side;
      neck.add(ribbon);
      cloth.push(ribbon);
    }
  }

  // eyes — the main thing that separates one face from another
  const eyes = new THREE.Group();
  eyes.position.set(0, faceY - s.headR * 0.04, s.headR * (s.hood ? 1.02 : 0.95));
  neck.add(eyes);
  const gap = s.headR * 0.23;
  if (s.eyes === "slit") {
    const slitGeo = kit.geo(new THREE.BoxGeometry(0.12, 0.022, 0.02));
    for (const side of [-1, 1]) {
      const slit = new THREE.Mesh(slitGeo, ink);
      slit.position.set(gap * side, 0.01, 0.0);
      slit.rotation.z = -0.12 * side;
      eyes.add(slit);
    }
  } else {
    const sharp = s.eyes === "sharp";
    const eyeGeo = kit.geo(new THREE.SphereGeometry(sharp ? 0.046 : 0.052, 14, 10));
    const glintGeo = kit.geo(new THREE.SphereGeometry(0.018, 8, 6));
    const white = kit.flat(0xffffff);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, ink);
      eye.position.set(gap * side, 0, 0.03);
      eye.scale.set(sharp ? 1.2 : 0.86, sharp ? 0.8 : 1.3, 0.55);
      if (sharp) eye.rotation.z = -0.3 * side;
      eyes.add(eye);
      const glint = new THREE.Mesh(glintGeo, white);
      glint.position.set(gap * side + 0.02 * side, 0.03, 0.06);
      eyes.add(glint);
    }
    // a small mouth, which is most of what stops a face reading as a mask
    const mouth = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.03, 10, 8)), ink);
    mouth.position.set(0, -s.headR * 0.26, -0.03);
    mouth.scale.set(1.5, 0.75, 0.4);
    eyes.add(mouth);
  }

  // brows: only the rival gets them, angled down into a scowl
  if (s.eyes === "sharp") {
    const browGeo = kit.geo(new THREE.BoxGeometry(0.12, 0.024, 0.02));
    for (const side of [-1, 1]) {
      const brow = new THREE.Mesh(browGeo, ink);
      brow.position.set(gap * side, 0.1, -0.02);
      brow.rotation.z = 0.42 * side;
      eyes.add(brow);
    }
  }

  if (s.topknot) {
    const hair = kit.toon(0x241a36);
    const base = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.09, 10, 8)), hair);
    base.position.set(0, faceY + s.headR * 0.95, -0.02);
    base.scale.set(1, 0.65, 1);
    neck.add(base);
    const tuft = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.042, 0.16, 4, 8)), hair);
    tuft.position.set(0, faceY + s.headR * 1.12, -0.1);
    tuft.rotation.x = -0.7;
    neck.add(tuft);
    cloth.push(tuft);
  }

  if (s.beard) {
    const hair = kit.toon(0xfaf7ef);
    // a tapered beard hanging off the chin, not a cone stuck to the chest
    const beard = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.12, 0.2, 4, 10)), hair);
    beard.position.set(0, faceY - s.headR * 0.92, s.headR * 0.42);
    beard.scale.set(1.35, 0.85, 0.72);
    neck.add(beard);
    const brow = kit.geo(new THREE.BoxGeometry(0.13, 0.035, 0.03));
    for (const side of [-1, 1]) {
      const b = new THREE.Mesh(brow, hair);
      b.position.set(gap * side, faceY + 0.1, s.headR * 0.78);
      b.rotation.z = -0.2 * side;
      neck.add(b);
    }
    const tash = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.17, 0.04, 0.03)), hair);
    tash.position.set(0, faceY - s.headR * 0.42, s.headR * 0.8);
    neck.add(tash);
  }

  if (s.kasa) {
    // a conical straw hat with a brim ring, so the silhouette reads at any size
    const straw = kit.toon(0xd8b36a);
    const cone = new THREE.Mesh(kit.geo(new THREE.ConeGeometry(0.56, 0.3, 18, 1, true)), straw);
    (cone.material as THREE.MeshToonMaterial).side = THREE.DoubleSide;
    cone.position.y = faceY + s.headR * 0.78;
    neck.add(cone);
    const rim = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.545, 0.022, 6, 26)), kit.toon(0x8a6a34));
    rim.position.y = faceY + s.headR * 0.78 - 0.14;
    rim.rotation.x = Math.PI / 2;
    neck.add(rim);
  }

  if (s.scarf) {
    const band = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.15, 0.045, 8, 16)), accent);
    band.position.y = s.torsoH + 0.05;
    band.rotation.x = Math.PI / 2;
    torso.add(band);
    const tailGeo = kit.geo(new THREE.BoxGeometry(0.12, 0.58, 0.03));
    for (const side of [-1, 1]) {
      const t = new THREE.Mesh(tailGeo, accent);
      t.position.set(0.09 * side, s.torsoH - 0.24, -0.18);
      t.rotation.set(0.22, 0, 0.16 * side);
      torso.add(t);
      cloth.push(t);
    }
  }

  for (let i = 0; i < s.swords; i++) {
    const hilt = new THREE.Group();
    hilt.position.set(s.torsoR * 0.75 - i * 0.1, s.torsoH - 0.1 - i * 0.04, -s.torsoR * 0.7 - i * 0.07);
    hilt.rotation.z = -0.55 - i * 0.2;
    const grip = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8)), ink);
    hilt.add(grip);
    const guard = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.082, 0.082, 0.028, 10)), steel);
    guard.position.y = -0.17;
    hilt.add(guard);
    torso.add(hilt);
  }

  if (s.staff) {
    // carried in the left hand, so it moves when the arm does
    const staff = new THREE.Mesh(kit.geo(new THREE.CylinderGeometry(0.03, 0.034, 1.55, 8)), kit.toon(0x6b4a26));
    staff.position.set(-0.04, 0.52, 0.14);
    elbows[0].add(staff);
    const ring = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.075, 0.015, 6, 16)), kit.toon(0xffc857));
    ring.position.set(-0.04, 1.3, 0.14);
    elbows[0].add(ring);
  }

  const height = hipY + s.torsoH + 0.1 + faceY + s.headR + (s.kasa ? 0.12 : 0);
  return {
    root, torso, neck, eyes,
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
  /** Front pair first, then back pair. */
  legs: THREE.Group[];
  /** Shoulder height when standing — the straight-leg length. */
  legLength: number;
  height: number;
};

function buildDog(kit: Kit): Dog {
  const root = new THREE.Group();
  const coat = kit.toon(0xf4ecd8);
  const coatDeep = kit.toon(0xd9cdb2);
  const red = kit.toon(0xd62839);
  const ink = kit.flat(SUMI);
  const outlineMat = new THREE.MeshBasicMaterial({ color: NIGHT, side: THREE.BackSide });
  kit.bin.push(outlineMat);

  // measured from the floor, same as the humanoids
  const legUpper = 0.17;
  const legLower = 0.15;
  const paw = 0.07;
  const shoulderY = paw + legLower + legUpper; // 0.39
  const backY = shoulderY + 0.17;

  // ── body: chest and haunch, so it is not one featureless tube ──
  const body = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.2, 0.3, 4, 16)), coat);
  body.rotation.z = Math.PI / 2;
  body.position.set(-0.02, backY, 0);
  body.scale.set(1, 1, 0.92);
  root.add(body);
  outline(body, outlineMat, 1.07);
  const chest = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.21, 16, 14)), coat);
  chest.position.set(0.17, backY - 0.02, 0);
  chest.scale.set(0.9, 1, 0.95);
  root.add(chest);
  const haunch = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.2, 16, 14)), coat);
  haunch.position.set(-0.22, backY + 0.01, 0);
  haunch.scale.set(0.95, 1.05, 1);
  root.add(haunch);

  // ── four legs ─────────────────────────────────────────────────────────
  const upperGeo = kit.geo(new THREE.CapsuleGeometry(0.075, legUpper - 0.07, 4, 10));
  const lowerGeo = kit.geo(new THREE.CapsuleGeometry(0.062, legLower - 0.06, 4, 10));
  const pawGeo = kit.geo(new THREE.SphereGeometry(0.08, 10, 8));
  const legs: THREE.Group[] = [];
  for (const [fx, side] of [
    [0.19, -1], [0.19, 1],
    [-0.21, -1], [-0.21, 1],
  ] as const) {
    const hip = new THREE.Group();
    hip.position.set(fx, shoulderY, 0.115 * side);
    const upper = new THREE.Mesh(upperGeo, coatDeep);
    upper.position.y = -legUpper / 2;
    hip.add(upper);
    const lower = new THREE.Mesh(lowerGeo, coatDeep);
    lower.position.y = -legUpper - legLower / 2;
    hip.add(lower);
    const foot = new THREE.Mesh(pawGeo, coat);
    foot.position.set(0, -legUpper - legLower - paw * 0.4, 0.015);
    foot.scale.set(1, 0.8, 1.15);
    hip.add(foot);
    root.add(hip);
    legs.push(hip);
  }

  // ── head, carried above the back on a short neck ──────────────────────
  // Puppy proportions: the skull is nearly as wide as the chest, which is most of what
  // separates a dog from a sausage with legs.
  const headR = 0.23;
  const neck = new THREE.Group();
  neck.position.set(0.28, backY + 0.2, 0);
  root.add(neck);
  const head = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(headR, 20, 16)), coat);
  head.position.set(0.04, 0.09, 0);
  neck.add(head);
  outline(head, outlineMat, 1.06);
  const brow = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(headR * 0.78, 16, 12)), coatDeep);
  brow.position.set(-0.02, 0.17, 0);
  brow.scale.set(1, 0.6, 1.02);
  neck.add(brow);

  // muzzle, in the deeper coat tone so it reads as its own shape
  const snout = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.115, 14, 12)), coat);
  snout.position.set(0.21, 0.015, 0);
  snout.scale.set(1.3, 0.85, 0.9);
  neck.add(snout);
  const nose = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.05, 10, 8)), ink);
  nose.position.set(0.345, 0.055, 0);
  nose.scale.set(0.8, 0.78, 1);
  neck.add(nose);
  const smile = new THREE.Mesh(kit.geo(new THREE.BoxGeometry(0.018, 0.014, 0.09)), ink);
  smile.position.set(0.3, -0.055, 0);
  neck.add(smile);

  // Eyes placed on the skull's surface. Anywhere nearer the centre than its radius and
  // they are simply inside a solid sphere, which is how this head ended up blank.
  const eyes = new THREE.Group();
  neck.add(eyes);
  const eyeGeo = kit.geo(new THREE.SphereGeometry(0.044, 12, 10));
  const glintGeo = kit.geo(new THREE.SphereGeometry(0.016, 8, 6));
  const white = kit.flat(0xffffff);
  const dir = new THREE.Vector3(0.62, 0.3, 0.72).normalize().multiplyScalar(headR * 0.94);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(eyeGeo, ink);
    eye.position.set(0.04 + dir.x, 0.09 + dir.y, dir.z * side);
    eye.scale.set(0.85, 1.1, 1);
    eyes.add(eye);
    const glint = new THREE.Mesh(glintGeo, white);
    glint.position.set(0.04 + dir.x + 0.025, 0.09 + dir.y + 0.025, dir.z * side * 1.04);
    eyes.add(glint);
  }

  // ── floppy ears, hanging down the sides of the head ───────────────────
  // Hinged at the crown and splayed outward about X, so they hang beside the face
  // instead of swinging fore-and-aft where they read as bumps on the skull.
  const earGeo = kit.geo(new THREE.CapsuleGeometry(0.07, 0.2, 4, 10));
  const ears: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(-0.01, 0.2, 0.14 * side);
    const ear = new THREE.Mesh(earGeo, coatDeep);
    ear.position.y = -0.15;
    ear.scale.set(1, 1.1, 0.46);
    pivot.add(ear);
    pivot.rotation.x = -0.5 * side; // outward, then down
    neck.add(pivot);
    ears.push(pivot);
  }

  const collar = new THREE.Mesh(kit.geo(new THREE.TorusGeometry(0.165, 0.038, 8, 18)), red);
  collar.position.set(0.24, backY + 0.11, 0);
  collar.rotation.y = Math.PI / 2;
  collar.rotation.x = 0.34;
  root.add(collar);
  const tag = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.04, 10, 8)), kit.toon(0xffc857));
  tag.position.set(0.3, backY - 0.02, 0);
  tag.scale.set(0.85, 1, 0.5);
  root.add(tag);

  // tail: up and back over the haunch
  const tail = new THREE.Group();
  tail.position.set(-0.4, backY + 0.1, 0);
  const tailMesh = new THREE.Mesh(kit.geo(new THREE.CapsuleGeometry(0.062, 0.2, 4, 10)), coatDeep);
  tailMesh.position.y = 0.14;
  tail.add(tailMesh);
  const tip = new THREE.Mesh(kit.geo(new THREE.SphereGeometry(0.078, 10, 8)), coat);
  tip.position.y = 0.28;
  tail.add(tip);
  tail.rotation.z = 0.75;
  root.add(tail);

  return { root, neck, eyes, ears: ears as [THREE.Group, THREE.Group], tail, legs, legLength: shoulderY, height: backY + 0.52 };
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
    const legLength = d.legLength;
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
        d.neck.rotation.y = look.x * 0.5;
        d.neck.rotation.z = look.y * 0.2;

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
        const excited = pose === "run" || pose === "leap" ? 2.2 : 1;
        d.tail.rotation.y = Math.sin(t * 7 * excited) * 0.45 * excited;
        d.ears[0].rotation.x = 0.55 + Math.sin(t * 2.1) * 0.1;
        d.ears[1].rotation.x = -0.55 - Math.sin(t * 2.1 + 0.6) * 0.1;

        const ease = Math.min(1, dt * 6);
        if (pose === "run") {
          const swing = 0.6;
          d.root.position.y = Math.abs(Math.sin(t * 9)) * 0.03 - legLength * (1 - Math.cos(swing * 0.5));
          d.root.rotation.z += (0 - d.root.rotation.z) * ease;
          d.legs.forEach((l, i) => {
            // diagonal pairs, like a real trot
            const phase = i === 0 || i === 3 ? 0 : Math.PI;
            l.rotation.z = Math.sin(t * 9 + phase) * swing;
          });
        } else if (pose === "sit") {
          const k = Math.min(1, poseT / 0.5);
          // Haunches down means the nose goes UP — the sign here was inverted, which
          // tipped him face-first into the floor. The front legs counter-rotate so they
          // stay planted and vertical while the body pitches back over them.
          const pitch = k * 0.46;
          d.root.rotation.z = pitch;
          d.root.position.y = -k * 0.07;
          d.legs[0].rotation.z = -pitch;
          d.legs[1].rotation.z = -pitch;
          d.legs[2].rotation.z = k * 1.6;
          d.legs[3].rotation.z = k * 1.6;
        } else if (pose === "leap") {
          const k = Math.min(1, poseT / 0.65);
          const arc = Math.sin(k * Math.PI);
          d.root.position.y = arc * 0.5;
          d.root.rotation.z = -arc * 0.3;
          d.legs.forEach((l, i) => {
            l.rotation.z = (i < 2 ? -1 : 1) * arc * 0.8;
          });
          if (k >= 1) {
            pose = "idle";
            poseT = 0;
          }
        } else {
          d.root.position.y += (Math.sin(t * 1.9) * 0.015 - d.root.position.y) * ease;
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
      const ease = Math.min(1, dt * 6);

      // the head leads, the torso follows about a third as far
      look.x += (look.tx - look.x) * Math.min(1, dt * 6);
      look.y += (look.ty - look.y) * Math.min(1, dt * 6);
      h.neck.rotation.y = look.x * 0.5;
      h.neck.rotation.x = -look.y * 0.26;
      h.torso.rotation.y = look.x * 0.15;
      h.eyes.position.x = look.x * 0.035;

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
        c.rotation.x = Math.sin(t * 2.2 + i * 0.8) * 0.16;
      });

      const settle = (o: THREE.Object3D, x: number, z: number) => {
        o.rotation.x += (x - o.rotation.x) * ease;
        o.rotation.z += (z - o.rotation.z) * ease;
      };

      if (pose === "leap") {
        const k = Math.min(1, poseT / 0.7);
        const arc = Math.sin(k * Math.PI);
        h.root.position.y = bob + arc * 0.55;
        h.root.rotation.z = arc * 0.2;
        h.hips[0].rotation.x = -arc * 1.0;
        h.hips[1].rotation.x = arc * 0.6;
        h.knees[0].rotation.x = -arc * 1.4;
        h.knees[1].rotation.x = -arc * 0.5;
        h.shoulders[0].rotation.x = -arc * 1.3;
        h.shoulders[1].rotation.x = -arc * 1.0;
        h.elbows[0].rotation.x = REST.elbowX - arc * 0.5;
        h.elbows[1].rotation.x = REST.elbowX - arc * 0.5;
        if (k >= 1) {
          pose = "idle";
          poseT = 0;
        }
      } else if (pose === "throw") {
        const k = Math.min(1, poseT / 0.55);
        // wind the right arm back, then snap it through
        const swing = k < 0.45 ? -(k / 0.45) * 1.7 : -1.7 + ((k - 0.45) / 0.55) * 3.6;
        h.shoulders[1].rotation.x = swing;
        h.shoulders[1].rotation.z = REST.shoulderZ * 0.4;
        h.elbows[1].rotation.x = k < 0.45 ? -1.3 : -1.3 + ((k - 0.45) / 0.55) * 1.2;
        h.torso.rotation.y = look.x * 0.15 - k * 0.32;
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
        h.shoulders[1].rotation.x = -0.3;
        h.shoulders[1].rotation.z = -2.2;
        h.elbows[1].rotation.z = Math.sin(poseT * 9) * 0.45;
        h.elbows[1].rotation.x = -0.2;
        if (k >= 1) {
          pose = "idle";
          poseT = 0;
        }
      } else if (pose === "bow") {
        const k = Math.min(1, poseT / 1.9);
        const depth = Math.sin(Math.min(1, k * 1.5) * Math.PI) * 0.62;
        h.torso.rotation.x = depth;
        h.neck.rotation.x = -look.y * 0.26 + depth * 0.25;
        h.hips[0].rotation.x = -depth * 0.2;
        h.hips[1].rotation.x = -depth * 0.2;
        settle(h.shoulders[0], depth * 0.5, -REST.shoulderZ);
        settle(h.shoulders[1], depth * 0.5, REST.shoulderZ);
        if (k >= 1) {
          pose = "idle";
          poseT = 0;
        }
      } else if (pose === "run") {
        const c = t * 9;
        const a0 = Math.sin(c) * 0.85;
        const a1 = Math.sin(c + Math.PI) * 0.85;
        // A leg swung off vertical is shorter to the floor, so without this the whole
        // stride hovers: drop the root by however far the more upright leg falls short.
        const drop = h.hipY * (1 - Math.cos(Math.min(Math.abs(a0), Math.abs(a1))));
        h.root.position.y = bob + Math.abs(Math.sin(c)) * 0.045 - drop;
        h.hips[0].rotation.x = a0;
        h.hips[1].rotation.x = a1;
        h.knees[0].rotation.x = -Math.max(0, -Math.sin(c)) * 1.0;
        h.knees[1].rotation.x = -Math.max(0, -Math.sin(c + Math.PI)) * 1.0;
        h.shoulders[0].rotation.x = Math.sin(c + Math.PI) * 0.8;
        h.shoulders[1].rotation.x = Math.sin(c) * 0.8;
        h.elbows[0].rotation.x = -1.0;
        h.elbows[1].rotation.x = -1.0;
        h.torso.rotation.x = 0.15;
      } else {
        // idle / look: everything eases back to rest
        h.root.rotation.z += (0 - h.root.rotation.z) * ease;
        h.torso.rotation.x += (0 - h.torso.rotation.x) * ease;
        settle(h.shoulders[0], 0, -REST.shoulderZ);
        settle(h.shoulders[1], 0, REST.shoulderZ);
        h.elbows.forEach((e) => {
          e.rotation.x += (REST.elbowX - e.rotation.x) * ease;
          e.rotation.z += (0 - e.rotation.z) * ease;
        });
        h.hips.forEach((p) => (p.rotation.x += (0 - p.rotation.x) * ease));
        h.knees.forEach((p) => (p.rotation.x += (0 - p.rotation.x) * ease));
      }
    },
    dispose,
  };
}
