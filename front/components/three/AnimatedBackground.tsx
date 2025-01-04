"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface AnimatedMesh extends THREE.Mesh {
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
}

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const shapes: AnimatedMesh[] = [];
    const geometries = [
      new THREE.OctahedronGeometry(0.5),
      new THREE.TetrahedronGeometry(0.4),
      new THREE.IcosahedronGeometry(0.35),
      new THREE.DodecahedronGeometry(0.4),
    ];

    const colors = [
      "#4f46e5", // Indigo
      "#ec4899", // Pink
      "#3b82f6", // Blue
      "#8b5cf6", // Purple
    ];

    for (let i = 0; i < 20; i++) {
      const geometry = geometries[i % geometries.length];
      const color = new THREE.Color(colors[i % colors.length]);

      const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });

      const mesh = new THREE.Mesh(
        geometry,
        material,
      ) as unknown as AnimatedMesh;

      const radius = 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi);

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      mesh.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
      );

      mesh.rotationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
      );

      scene.add(mesh);
      shapes.push(mesh);
    }

    const trailsGeometry = new THREE.BufferGeometry();
    const trailsPositions = new Float32Array(500 * 3);
    const trailsColors = new Float32Array(500 * 3);

    for (let i = 0; i < trailsPositions.length; i += 3) {
      trailsPositions[i] = (Math.random() - 0.5) * 10;
      trailsPositions[i + 1] = (Math.random() - 0.5) * 10;
      trailsPositions[i + 2] = (Math.random() - 0.5) * 10;

      const color = new THREE.Color(
        colors[Math.floor(Math.random() * colors.length)],
      );
      trailsColors[i] = color.r;
      trailsColors[i + 1] = color.g;
      trailsColors[i + 2] = color.b;
    }

    trailsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailsPositions, 3),
    );
    trailsGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(trailsColors, 3),
    );

    const trailsMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.4,
    });

    const trails = new THREE.Points(trailsGeometry, trailsMaterial);
    scene.add(trails);

    camera.position.z = 8;

    const onMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      shapes.forEach((shape) => {
        shape.position.add(shape.velocity);

        shape.rotation.x += shape.rotationSpeed.x;
        shape.rotation.y += shape.rotationSpeed.y;
        shape.rotation.z += shape.rotationSpeed.z;

        const distance = shape.position.length();
        if (distance > 5) {
          shape.position.multiplyScalar(4.95 / distance);
          shape.velocity.multiplyScalar(-0.8);
        }
      });

      const positions = trails.geometry.attributes.position
        .array as Float32Array;
      const colors = trails.geometry.attributes.color.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.02;
        positions[i + 1] += (Math.random() - 0.5) * 0.02;
        positions[i + 2] += (Math.random() - 0.5) * 0.02;

        const distance = Math.sqrt(
          positions[i] * positions[i] +
            positions[i + 1] * positions[i + 1] +
            positions[i + 2] * positions[i + 2],
        );

        if (distance > 5) {
          positions[i] *= 0.2;
          positions[i + 1] *= 0.2;
          positions[i + 2] *= 0.2;

          const color = new THREE.Color(
            colors[Math.floor(Math.random() * colors.length)],
          );
          colors[i] = color.r;
          colors[i + 1] = color.g;
          colors[i + 2] = color.b;
        }
      }

      trails.geometry.attributes.position.needsUpdate = true;
      trails.geometry.attributes.color.needsUpdate = true;

      camera.position.x +=
        (mousePosition.current.x * 1.5 - camera.position.x) * 0.02;
      camera.position.y +=
        (mousePosition.current.y * 1.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;

      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(circle at center, #0f172a 0%, #020617 100%)",
      }}
    />
  );
}
