"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface SpatialGlobe3DProps {
  mode: "login" | "signup";
  isSubmitting?: boolean;
}

export function SpatialGlobe3D({ mode, isSubmitting = false }: SpatialGlobe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    mode,
    isSubmitting,
    targetSpeed: 0.003,
    currentSpeed: 0.003,
    mouse: { x: 0, y: 0 },
    targetRotation: { x: 0, y: 0 },
  });

  // Keep stateRef updated without recreating scene
  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.isSubmitting = isSubmitting;
    stateRef.current.targetSpeed = isSubmitting ? 0.025 : 0.004;
  }, [mode, isSubmitting]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Root Group for All 3D Objects ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Inner Luminous Core Sphere (Light Theme Aqua/Mint Gem)
    const coreGeo = new THREE.SphereGeometry(1.7, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // 2. Wireframe Geodesic Icosahedron / Land Grid
    const geoIco = new THREE.IcosahedronGeometry(2.3, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireframeMesh = new THREE.Mesh(geoIco, wireframeMat);
    rootGroup.add(wireframeMesh);

    // 3. Cadastral Survey Land Nodes (Particle Cloud on Sphere)
    const particleCount = 1400;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const colorSaffron = new THREE.Color(0xf59e0b);
    const colorCyan = new THREE.Color(0x06b6d4);
    const colorEmerald = new THREE.Color(0x10b981);
    const colorViolet = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 2.32 + (Math.random() - 0.5) * 0.12;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;

      // Color palette mix
      let c = colorCyan;
      const rand = Math.random();
      if (rand < 0.3) c = colorSaffron;
      else if (rand < 0.6) c = colorEmerald;
      else if (rand < 0.8) c = colorViolet;

      colorArray[i * 3] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const pointsMesh = new THREE.Points(particlesGeo, particlesMat);
    rootGroup.add(pointsMesh);

    // 4. Equatorial & Latitudinal Orbital Rings (Telemetry Rings)
    const createRing = (radius: number, tiltX: number, tiltY: number, colorHex: number) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.03, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = tiltX;
      ringMesh.rotation.y = tiltY;
      return ringMesh;
    };

    const ring1 = createRing(2.75, Math.PI / 2.3, 0.2, 0xf59e0b); // Gold
    const ring2 = createRing(3.05, Math.PI / 1.7, -0.4, 0x06b6d4); // Cyan
    const ring3 = createRing(3.35, Math.PI / 3.1, 0.6, 0x8b5cf6); // Violet
    rootGroup.add(ring1);
    rootGroup.add(ring2);
    rootGroup.add(ring3);

    // 5. Orbiting NavIC / Cartosat Satellite Beacons
    const satellites: { mesh: THREE.Mesh; angle: number; speed: number; radius: number; tilt: number }[] = [];
    const satColors = [0xf59e0b, 0x10b981, 0x38bdf8];

    for (let i = 0; i < 3; i++) {
      const satGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({
        color: satColors[i],
        transparent: true,
        opacity: 0.95,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      rootGroup.add(satMesh);
      satellites.push({
        mesh: satMesh,
        angle: (i * Math.PI * 2) / 3,
        speed: 0.015 + i * 0.005,
        radius: 3.1 + i * 0.35,
        tilt: (i - 1) * 0.5,
      });
    }

    // --- Mouse Move Parallax ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      stateRef.current.mouse.x = (clientX / rect.width) * 2 - 1;
      stateRef.current.mouse.y = -(clientY / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- Resize Observer ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth acceleration / deceleration
      const s = stateRef.current;
      s.currentSpeed += (s.targetSpeed - s.currentSpeed) * 0.08;

      // Rotate Globe & Components
      rootGroup.rotation.y += s.currentSpeed;
      wireframeMesh.rotation.y -= s.currentSpeed * 0.5;
      wireframeMesh.rotation.x = Math.sin(elapsed * 0.4) * 0.15;

      ring1.rotation.z += s.currentSpeed * 1.5;
      ring2.rotation.z -= s.currentSpeed * 1.8;
      ring3.rotation.z += s.currentSpeed * 1.2;

      // Mouse interactive tilt with smooth damping
      s.targetRotation.x = s.mouse.y * 0.35;
      s.targetRotation.y = s.mouse.x * 0.35;
      rootGroup.rotation.x += (s.targetRotation.x - rootGroup.rotation.x) * 0.05;
      rootGroup.position.x += (s.mouse.x * 0.2 - rootGroup.position.x) * 0.05;

      // Orbit Satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed * (s.isSubmitting ? 3 : 1);
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle * 2 + sat.tilt) * 0.8;
      });

      // Pulse Core on submit
      if (s.isSubmitting) {
        const pulse = 1.7 + Math.sin(elapsed * 12) * 0.3;
        coreMesh.scale.set(pulse / 1.7, pulse / 1.7, pulse / 1.7);
        coreMat.color.setHex(0xf59e0b);
      } else {
        coreMesh.scale.set(1, 1, 1);
        coreMat.color.setHex(s.mode === "login" ? 0x071e3d : 0x1f1147);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      // Dispose Geometries & Materials
      coreGeo.dispose();
      coreMat.dispose();
      geoIco.dispose();
      wireframeMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      satellites.forEach((s) => {
        s.mesh.geometry.dispose();
        (s.mesh.material as THREE.Material).dispose();
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <div ref={containerRef} className="w-full h-full min-h-[220px] max-h-[320px]" />

      {/* Floating Spatial HUD Badges */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#E5E0D6] shadow-sm text-[10px] font-mono text-[#0284C7]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7] animate-ping" />
        <span className="font-bold">NavIC • Bhuvan 3D Cadastre</span>
      </div>

      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#E5E0D6] shadow-sm text-[10px] font-mono text-[#15803D]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
        <span className="font-bold">RFCTLARR Statutory Node</span>
      </div>
    </div>
  );
}
