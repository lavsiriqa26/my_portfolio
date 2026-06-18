"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ParticleField — an immersive WebGL "digital universe".
 * A drifting starfield of ~3,500 glowing neon particles rendered as additive
 * points, plus a slow-rotating wireframe icosahedron core. The whole field
 * reacts to the pointer (parallax) and the scroll position (camera dolly),
 * giving the cinematic, camera-like motion the design calls for.
 */
export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0807, 0.055);

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ---------- Particle starfield ---------- */
    const COUNT = window.innerWidth < 768 ? 1800 : 3500;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);

    const palette = [
      new THREE.Color(0xe8c479), // cyan
      new THREE.Color(0xc0843a), // violet
      new THREE.Color(0xdb9259), // magenta
      new THREE.Color(0xf3e2b3), // aqua
      new THREE.Color(0xf3e2b3), // pale blue
    ];

    for (let i = 0; i < COUNT; i++) {
      // Distribute inside a flattened spherical cloud
      const r = 6 + Math.pow(Math.random(), 0.6) * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[(Math.random() * palette.length) | 0];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      scales[i] = Math.random() * 0.9 + 0.25;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    // Soft circular glow sprite drawn on a canvas
    const makeGlow = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.25, "rgba(255,255,255,0.85)");
      g.addColorStop(0.5, "rgba(255,255,255,0.25)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      return tex;
    };

    const material = new THREE.PointsMaterial({
      size: 0.42,
      map: makeGlow(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    /* ---------- Glowing wireframe core ---------- */
    const coreGeo = new THREE.IcosahedronGeometry(3.4, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xc0843a,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const coreGeo2 = new THREE.IcosahedronGeometry(2.0, 0);
    const coreMat2 = new THREE.MeshBasicMaterial({
      color: 0xe8c479,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const core2 = new THREE.Mesh(coreGeo2, coreMat2);
    scene.add(core2);

    /* ---------- Interaction state ---------- */
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let scrollY = 0;

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollY = window.scrollY || 0;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    /* ---------- Render loop ---------- */
    let raf = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const t = clock.getElapsedTime();

      // Ease the camera toward the pointer for parallax
      target.x += (pointer.x - target.x) * 0.04;
      target.y += (pointer.y - target.y) * 0.04;

      const scrollNorm =
        scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);

      camera.position.x = target.x * 3.2;
      camera.position.y = -target.y * 2.2;
      camera.position.z = 16 - scrollNorm * 6; // dolly in as you scroll
      camera.lookAt(0, 0, 0);

      points.rotation.y = t * 0.025 + scrollNorm * 0.6;
      points.rotation.x = t * 0.012;

      core.rotation.y = t * 0.12;
      core.rotation.x = t * 0.08;
      core2.rotation.y = -t * 0.18;
      core2.rotation.z = t * 0.1;

      const pulse = 0.22 + Math.sin(t * 0.8) * 0.06;
      coreMat.opacity = pulse;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    if (prefersReduced) {
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(tick);
    }

    /* ---------- Cleanup ---------- */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      coreGeo2.dispose();
      coreMat2.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-40"
    />
  );
}
