"use client";

import { motionValue } from "framer-motion";

/**
 * One shared "where is the viewer looking" input for depth effects, in the range −0.5…0.5.
 *  - Laptop/desktop: the mouse position.
 *  - Phone/tablet: device tilt (gyroscope), falling back to the last touch position.
 * Everything that reacts (star field, hero rings, the robot) reads these values, so
 * mobile gets the same depth as desktop. Disabled entirely with reduced motion.
 */
export const tiltX = motionValue(0);
export const tiltY = motionValue(0);
/** Shake impulses (−0.5…0.5) and energy (0…1); they spike on a shake, then return to 0. */
export const shakeX = motionValue(0);
export const shakeY = motionValue(0);
export const shakeEnergy = motionValue(0);

let started = false;
let granted = false;

/** True once motion access has been granted on iOS (or wasn't needed). */
export const motionGranted = () => granted || !gyroNeedsPermission();
let gyroOn = false;
let baseBeta: number | null = null;

const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v));

function onOrientation(e: DeviceOrientationEvent) {
  if (e.gamma == null || e.beta == null) return;
  gyroOn = true;
  // Calibrate "neutral" to however the phone is held when we first hear from it.
  if (baseBeta == null) baseBeta = e.beta;
  baseBeta += (e.beta - baseBeta) * 0.004; // slowly re-centre as posture changes
  tiltX.set(clamp(e.gamma / 34));
  tiltY.set(clamp((e.beta - baseBeta) / 34));
}

let shakeReset: ReturnType<typeof setTimeout> | undefined;
function onMotion(e: DeviceMotionEvent) {
  const a = e.acceleration ?? e.accelerationIncludingGravity;
  if (!a || a.x == null || a.y == null) return;
  const gravityFree = !!e.acceleration && e.acceleration.x != null;
  const mag = Math.hypot(a.x, a.y, a.z ?? 0) - (gravityFree ? 0 : 9.81);
  if (mag < 7) return; // ignore walking, typing, normal handling
  shakeX.set(clamp(a.x / 24));
  shakeY.set(clamp(-a.y / 24));
  shakeEnergy.set(Math.min(1, mag / 24));
  clearTimeout(shakeReset);
  shakeReset = setTimeout(() => {
    shakeX.set(0);
    shakeY.set(0);
    shakeEnergy.set(0);
  }, 140);
}

type MotionWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type OrientationWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/** iOS needs an explicit, user-initiated permission prompt for motion data. */
export function gyroNeedsPermission() {
  if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") return false;
  return typeof (DeviceOrientationEvent as OrientationWithPermission).requestPermission === "function";
}

/** Call from a tap/click handler. Resolves true when motion data is available. */
export async function requestGyro() {
  if (!gyroNeedsPermission()) return true;
  try {
    const res = await (DeviceOrientationEvent as OrientationWithPermission).requestPermission!();
    const motion = (DeviceMotionEvent as MotionWithPermission).requestPermission;
    const motionRes = motion ? await motion() : "granted";
    if (motionRes === "granted") window.addEventListener("devicemotion", onMotion);
    if (res === "granted") {
      window.addEventListener("deviceorientation", onOrientation);
      granted = true;
      return true;
    }
  } catch {
    /* denied or unavailable — touch still works */
  }
  return false;
}

export function startTilt() {
  if (started || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  started = true;

  const fine = window.matchMedia("(pointer: fine)").matches;
  if (fine) {
    window.addEventListener(
      "pointermove",
      (e) => {
        tiltX.set(clamp(e.clientX / window.innerWidth - 0.5));
        tiltY.set(clamp(e.clientY / window.innerHeight - 0.5));
      },
      { passive: true },
    );
    return;
  }

  const onTouch = (e: TouchEvent) => {
    if (gyroOn) return;
    const t = e.touches[0];
    if (!t) return;
    tiltX.set(clamp(t.clientX / window.innerWidth - 0.5));
    tiltY.set(clamp(t.clientY / window.innerHeight - 0.5));
  };
  window.addEventListener("touchstart", onTouch, { passive: true });
  window.addEventListener("touchmove", onTouch, { passive: true });
  // Android and older iOS deliver orientation and motion without a prompt.
  if (!gyroNeedsPermission()) {
    window.addEventListener("deviceorientation", onOrientation);
    window.addEventListener("devicemotion", onMotion);
  }
}
