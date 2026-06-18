"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Site-wide living atmosphere (WebGL).
 *
 * Layer 1 — a full-screen fragment shader rendering a slowly morphing aurora /
 * plasma built from domain-warped fractal noise. This is the dominant visual:
 * deep indigo voids bleeding into violet, magenta and teal, reacting to the
 * pointer.
 *
 * Layer 2 — ~1,600 additive glowing particles advected through a curl-ish noise
 * flow field, giving the "fluid motion / glowing particle" surreal feel.
 *
 * Both layers share one renderer (two passes, one orthographic camera) so there
 * is a single WebGL context.
 */
export default function Atmosphere() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    mount.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    /* ---------------- Layer 1: fluid shader ---------------- */
    const bgScene = new THREE.Scene();
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    };

    const fragment = /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uRes;
      uniform vec2 uMouse;
      uniform float uScroll;

      vec2 hash22(vec2 p){
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
      }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = dot(hash22(i + vec2(0.0,0.0)), f - vec2(0.0,0.0));
        float b = dot(hash22(i + vec2(1.0,0.0)), f - vec2(1.0,0.0));
        float c = dot(hash22(i + vec2(0.0,1.0)), f - vec2(0.0,1.0));
        float d = dot(hash22(i + vec2(1.0,1.0)), f - vec2(1.0,1.0));
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for(int i = 0; i < 6; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
        return v;
      }
      void main(){
        vec2 uv = vUv;
        vec2 p = uv - 0.5;
        p.x *= uRes.x / uRes.y;
        float t = uTime * 0.04 + uScroll * 0.6;

        vec2 mo = (uMouse - 0.5) * 0.6;
        // domain warping
        vec2 q = vec2(fbm(p * 1.4 + mo + t), fbm(p * 1.4 - t + 5.2));
        vec2 r = vec2(
          fbm(p * 1.4 + q * 1.8 + vec2(1.7, 9.2) + t * 1.4),
          fbm(p * 1.4 + q * 1.8 + vec2(8.3, 2.8) - t * 1.1)
        );
        float f = fbm(p * 1.4 + r * 1.8);
        f = clamp(f * 0.5 + 0.5, 0.0, 1.0);

        // Warm metallic aurora — deep umber → bronze → gold → copper.
        vec3 cVoid   = vec3(0.039, 0.031, 0.024);
        vec3 cIndigo = vec3(0.16, 0.10, 0.045);
        vec3 cViolet = vec3(0.62, 0.40, 0.13);
        vec3 cMag    = vec3(0.93, 0.72, 0.34);
        vec3 cTeal   = vec3(0.85, 0.55, 0.27);

        vec3 col = cVoid;
        col = mix(col, cIndigo, smoothstep(0.15, 0.55, f));
        col = mix(col, cViolet, smoothstep(0.42, 0.88, f + 0.20 * r.x));
        col = mix(col, cMag,    pow(smoothstep(0.60, 1.0, f + 0.25 * q.y), 1.4));
        col = mix(col, cTeal,   smoothstep(0.45, 1.05, length(r) * 1.1));

        // luminous filaments
        col += cViolet * smoothstep(0.74, 1.0, f) * 0.55;
        col += cTeal   * smoothstep(0.80, 1.0, length(q)) * 0.30;

        // gentle gamma lift for richness
        col = pow(col, vec3(0.85));

        // dim the center so foreground text stays readable; edges stay vivid
        float d = length(uv - 0.5);
        float readable = mix(0.42, 1.0, smoothstep(0.08, 0.62, d));
        col *= readable;

        // soft outer vignette (edge0 < edge1)
        float vig = 1.0 - smoothstep(0.55, 1.25, d);
        col *= mix(0.7, 1.0, vig);

        col += hash22(uv * uRes).x * 0.012; // grain
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const bgMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: fragment,
      depthTest: false,
      depthWrite: false,
    });
    const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    bgScene.add(bgQuad);

    /* ---------------- Layer 2: flow-field particles ---------------- */
    const fgScene = new THREE.Scene();
    let aspect = window.innerWidth / window.innerHeight;

    const COUNT = window.innerWidth < 768 ? 700 : 1600;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 2);

    const palette = [
      new THREE.Color(0xf4d98f), // champagne
      new THREE.Color(0xe8c479), // gold
      new THREE.Color(0xdb9259), // copper
      new THREE.Color(0xf3e2b3), // pale gold
    ];
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = rand(-aspect, aspect);
      pos[i * 3 + 1] = rand(-1, 1);
      pos[i * 3 + 2] = 0;
      const c = palette[(Math.random() * palette.length) | 0];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      vel[i * 2] = 0;
      vel[i * 2 + 1] = 0;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));

    // soft round glow sprite
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 64;
    const gctx = glowCanvas.getContext("2d")!;
    const grd = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.3, "rgba(255,255,255,0.65)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    gctx.fillStyle = grd;
    gctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(glowCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.018,
      map: sprite,
      vertexColors: true,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    fgScene.add(points);

    // lightweight value-noise flow field (CPU)
    const fnoise = (x: number, y: number) => {
      const s = Math.sin(x * 1.3 + y * 0.7) + Math.sin(y * 1.7 - x * 0.9);
      return s * 0.5;
    };

    /* ---------------- interaction ---------------- */
    const onMove = (e: PointerEvent) => {
      uniforms.uMouse.value.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
    };
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      uniforms.uScroll.value = h > 0 ? window.scrollY / h : 0;
    };
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uRes.value.set(w, h);
      aspect = w / h;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
    };
    onResize();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    /* ---------------- loop ---------------- */
    const clock = new THREE.Clock();
    let raf = 0;
    const TWO_PI = Math.PI * 2;

    const tick = () => {
      const time = clock.getElapsedTime();
      uniforms.uTime.value = time;

      // advect particles
      const arr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        const x = arr[ix];
        const y = arr[ix + 1];
        const angle = fnoise(x * 1.1 + time * 0.15, y * 1.1 - time * 0.12) * TWO_PI;
        const sp = 0.0009;
        arr[ix] += Math.cos(angle) * sp + 0.0004; // slight rightward drift
        arr[ix + 1] += Math.sin(angle) * sp;
        // wrap
        if (arr[ix] > aspect + 0.05) arr[ix] = -aspect - 0.05;
        if (arr[ix] < -aspect - 0.05) arr[ix] = aspect + 0.05;
        if (arr[ix + 1] > 1.05) arr[ix + 1] = -1.05;
        if (arr[ix + 1] < -1.05) arr[ix + 1] = 1.05;
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.clear();
      renderer.render(bgScene, camera);
      renderer.render(fgScene, camera);
      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      renderer.clear();
      renderer.render(bgScene, camera);
      renderer.render(fgScene, camera);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      bgMat.dispose();
      bgQuad.geometry.dispose();
      pGeo.dispose();
      pMat.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
