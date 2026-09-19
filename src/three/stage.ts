// Renderer, camera, lighting and environment shared by the home scene and the
// product viewer.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface Stage {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  dispose: () => void;
}

export const CAMERA_DISTANCE = 7;
export const CAMERA_FOV = 28;

export function createStage(canvas: HTMLCanvasElement): Stage {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.85;

  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 50);
  camera.position.set(0, 0.35, CAMERA_DISTANCE);
  camera.lookAt(0, 0, 0);

  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 5, 4);
  const fill = new THREE.DirectionalLight(0xfff4e0, 0.7);
  fill.position.set(-4, 2, 2);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2);
  rim.position.set(-2, 3, -5);
  const hemi = new THREE.HemisphereLight(0xffffff, 0xd9d3c6, 0.5);
  scene.add(key, fill, rim, hemi);

  return {
    renderer,
    scene,
    camera,
    dispose: () => {
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

/** World-space size of the viewport plane at z = 0. */
export function viewSize(camera: THREE.PerspectiveCamera) {
  const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * CAMERA_DISTANCE;
  return { w: h * camera.aspect, h };
}

export const damp = (current: number, target: number, lambda: number, dt: number) => current + (target - current) * (1 - Math.exp(-lambda * dt));
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
