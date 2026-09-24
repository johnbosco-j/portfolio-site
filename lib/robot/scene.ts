import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * The Riven robot — "RobotExpressive" by Tomás Laulhé (Quaternius), CC0, with facial
 * morph targets by Don McCurdy (three.js examples). Recoloured to the Riven palette.
 *
 * Loaded lazily (dynamic import) only when the About section nears the viewport, so
 * three.js never touches the landing page's initial JavaScript.
 */

export type Emote = "Wave" | "Yes" | "No" | "ThumbsUp" | "Jump" | "Dance" | "Punch";
export type Mood = "Surprised" | "Sad" | "Angry";

/** What the robot is doing right now — surfaced in the stage HUD. */
export type RobotState = "idle" | "looking" | Emote;

export type RobotHandle = {
  /** Where to look, −0.5…0.5 in each axis (screen space relative to the robot). */
  lookAt(x: number, y: number): void;
  emote(name: Emote): void;
  mood(name: Mood, amount: number): void;
  setActive(active: boolean): void;
  dispose(): void;
};

const MODEL_URL = "/models/robot-expressive.glb";

// Palette (design.md tokens): Riven-orange shell, graphite joints, glossy black visor.
const COLORS: Record<string, string> = { Main: "#E5383B", Grey: "#2C2C31", Black: "#0A0A0B" };

export async function createRobot(
  container: HTMLElement,
  { still, onState }: { still: boolean; onState?: (state: RobotState) => void },
): Promise<RobotHandle> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xf4f2ee, 0x141415, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(4, 8, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff9a9a, 4); // warm rim light from behind
  rim.position.set(-5, 5, -6);
  scene.add(rim);
  const fill = new THREE.PointLight(0xf4f2ee, 8, 30);
  fill.position.set(0, 1, 5);
  scene.add(fill);

  const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
  const model = gltf.scene;
  const faces: THREE.Mesh[] = [];
  model.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      const mat = m as THREE.MeshStandardMaterial;
      if (COLORS[mat.name]) mat.color.set(COLORS[mat.name]);
      mat.roughness = mat.name === "Black" ? 0.18 : mat.name === "Main" ? 0.42 : 0.55;
      mat.metalness = mat.name === "Grey" ? 0.4 : 0.05;
    });
    if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) faces.push(mesh);
  });
  scene.add(model);

  // Frame the model: fit its height, look slightly from the right.
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const h = size.y;
  const target = new THREE.Vector3(center.x, center.y - h * 0.02, center.z);
  // Fit height AND width (a waving arm reaches ~0.6h sideways) for the current aspect.
  const frameCamera = (aspect: number) => {
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dist = Math.max((h * 0.62) / tan, (h * 0.64) / (tan * aspect));
    camera.position.set(center.x + dist * 0.05, center.y + h * 0.06, center.z + dist);
    camera.lookAt(target);
  };
  frameCamera(1);

  // Orbit ring under the feet + soft contact shadow (echoes the hero rings).
  const floorY = box.min.y + 0.01;
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(h * 0.3, h * 0.305, 128),
    new THREE.MeshBasicMaterial({ color: 0xe5383b, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = floorY;
  scene.add(ring);
  const ring2 = new THREE.Mesh(
    new THREE.RingGeometry(h * 0.42, h * 0.423, 128, 1, 0, Math.PI * 0.5),
    new THREE.MeshBasicMaterial({ color: 0xe5383b, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
  );
  ring2.rotation.x = -Math.PI / 2;
  ring2.position.y = floorY;
  scene.add(ring2);
  const shadowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0,0,0,0.55)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(h * 0.6, h * 0.6),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = floorY + 0.005;
  scene.add(shadow);

  // Bones for the look-at.
  const bone = (name: string) => {
    let found: THREE.Bone | undefined;
    model.traverse((o) => {
      if (!found && (o as THREE.Bone).isBone && o.name === name) found = o as THREE.Bone;
    });
    return found;
  };
  const head = bone("Head");
  const torso = bone("Torso") ?? bone("Abdomen");
  // Clips don't key every bone every frame, so offsets must be applied to a known
  // base pose — otherwise they accumulate and the head drifts or spins.
  const headRest = head?.quaternion.clone();
  const torsoRest = torso?.quaternion.clone();

  // Animation.
  const mixer = new THREE.AnimationMixer(model);
  const actions = new Map<string, THREE.AnimationAction>();
  gltf.animations.forEach((clip) => actions.set(clip.name, mixer.clipAction(clip)));
  const idle = actions.get("Idle")!;
  idle.play();
  let current: THREE.AnimationAction = idle;
  let emoting = false;

  const fadeTo = (next: THREE.AnimationAction, duration: number) => {
    if (next === current) {
      next.reset().play(); // same gesture again: restart it
      return;
    }
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
    current.fadeOut(duration);
    current = next;
  };
  mixer.addEventListener("finished", (e) => {
    if ((e as unknown as { action: THREE.AnimationAction }).action !== current) return;
    emoting = false;
    fadeTo(idle, 0.4);
    onState?.("idle");
  });

  // Smoothed state.
  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  let lastInput = -Infinity;
  let nextNod = 14;
  const moods: Record<string, { v: number; t: number }> = {};
  faces.forEach((f) => Object.keys(f.morphTargetDictionary!).forEach((k) => (moods[k] = { v: 0, t: 0 })));

  const Y = new THREE.Vector3(0, 1, 0);
  const X = new THREE.Vector3(1, 0, 0);
  const pq = new THREE.Quaternion();
  const dq = new THREE.Quaternion();
  const rotateWorld = (b: THREE.Object3D, axis: THREE.Vector3, angle: number) => {
    if (!b.parent) return;
    b.parent.getWorldQuaternion(pq);
    dq.setFromAxisAngle(axis, angle);
    // local' = parentWorld⁻¹ · delta · parentWorld · local
    const inv = pq.clone().invert();
    b.quaternion.premultiply(inv.multiply(dq).multiply(pq));
  };

  let lastTime = performance.now();
  const delta = () => {
    const now = performance.now();
    const d = (now - lastTime) / 1000;
    lastTime = now;
    return d;
  };
  const play = (name: Emote, fromUser: boolean) => {
    const a = actions.get(name);
    if (!a || still) return;
    if (fromUser) lastInput = t;
    emoting = true;
    a.setLoop(THREE.LoopOnce, 1);
    a.clampWhenFinished = true;
    fadeTo(a, 0.18);
    onState?.(name);
  };

  let raf = 0;
  let active = false;
  let disposed = false;
  let t = 0;

  const frame = () => {
    const dt = Math.min(delta(), 0.05);
    t += dt;
    if (head && headRest) head.quaternion.copy(headRest);
    if (torso && torsoRest) torso.quaternion.copy(torsoRest);
    mixer.update(still ? 0 : dt);

    // Nobody around for a while → glance about slowly, and nod now and then.
    const idleFor = t - lastInput;
    let tx = look.tx;
    let ty = look.ty;
    if (!still && idleFor > 2.5) {
      tx = Math.sin(t * 0.35) * 0.35 + Math.sin(t * 0.9) * 0.08;
      ty = Math.sin(t * 0.5) * 0.12 - 0.05;
      if (!emoting && t > nextNod) {
        nextNod = t + 14 + Math.random() * 8;
        play("Yes", false);
      }
    }
    const ease = 1 - Math.pow(0.002, dt); // frame-rate independent smoothing
    look.x += (tx - look.x) * ease;
    look.y += (ty - look.y) * ease;

    // Keep the face toward the viewer: ~30° max turn, split body → torso → head,
    // and let gestures read clearly by damping the gaze while one plays.
    const k = emoting ? 0.45 : 1;
    model.rotation.y = look.x * 0.22 * k;
    model.updateMatrixWorld(true);
    if (torso) {
      rotateWorld(torso, Y, look.x * 0.12 * k);
      model.updateMatrixWorld(true);
    }
    if (head) {
      rotateWorld(head, Y, look.x * 0.55 * k);
      model.updateMatrixWorld(true);
      rotateWorld(head, X, look.y * 0.4 * k);
    }

    for (const f of faces) {
      for (const [name, i] of Object.entries(f.morphTargetDictionary!)) {
        const m = moods[name];
        m.v += (m.t - m.v) * Math.min(1, dt * 8);
        f.morphTargetInfluences![i] = m.v;
      }
    }

    ring2.rotation.z = still ? 0 : t * 0.25;
    renderer.render(scene, camera);
  };

  const loop = () => {
    frame();
    raf = requestAnimationFrame(loop);
  };

  const resize = () => {
    const w = container.clientWidth;
    const hh = container.clientHeight;
    if (!w || !hh) return;
    renderer.setSize(w, hh, false);
    camera.aspect = w / hh;
    camera.updateProjectionMatrix();
    frameCamera(camera.aspect);
    if (!active || still) frame();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();
  frame();

  return {
    lookAt(x, y) {
      look.tx = Math.max(-0.6, Math.min(0.6, x));
      look.ty = Math.max(-0.45, Math.min(0.45, y));
      lastInput = t;
      if (still) frame();
    },
    emote(name) {
      play(name, true);
    },
    mood(name, amount) {
      if (moods[name]) moods[name].t = amount;
      if (still) frame();
    },
    setActive(next) {
      if (disposed || still || next === active) return;
      active = next;
      cancelAnimationFrame(raf);
      if (active) {
        delta();
        raf = requestAnimationFrame(loop);
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mixer.stopAllAction();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => m.dispose());
      });
      shadowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
