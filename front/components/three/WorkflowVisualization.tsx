"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface RingRotationSpeed {
  x: number;
  y: number;
  z: number;
}

interface RingMesh extends THREE.Mesh {
  rotationSpeed: RingRotationSpeed;
}

export default function WorkflowVisualization() {
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

    const rings: RingMesh[] = [];
    const createRing = (radius: number, color: string): RingMesh => {
      const geometry = new THREE.TorusGeometry(radius, 0.02, 16, 100);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const ring = mesh as unknown as RingMesh;
      ring.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002,
        z: (Math.random() - 0.5) * 0.002,
      };
      return ring;
    };

    const ringColors = ["#4f46e5", "#ec4899", "#3b82f6", "#8b5cf6"];
    for (let i = 0; i < 8; i++) {
      const ring = createRing(0.5 + i * 0.3, ringColors[i % ringColors.length]);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      scene.add(ring);
      rings.push(ring);
    }

    const flowPoints = [];
    const flowCount = 100;
    for (let i = 0; i < flowCount; i++) {
      const t = i / flowCount;
      const angle = t * Math.PI * 2;
      const radius = 1 + Math.sin(t * Math.PI * 4) * 0.5;
      flowPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          Math.sin(t * Math.PI * 6) * 0.2,
        ),
      );
    }

    const flowCurve = new THREE.CatmullRomCurve3(flowPoints, true);
    const flowGeometry = new THREE.TubeGeometry(flowCurve, 200, 0.01, 8, true);
    const flowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#60a5fa") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          float alpha = smoothstep(0.0, 0.2, sin(vUv.x * 20.0 - time * 2.0));
          gl_FragColor = vec4(color, alpha * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const flow = new THREE.Mesh(flowGeometry, flowMaterial);
    scene.add(flow);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);
    const particleColors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 2;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = Math.sin(angle) * radius;
      positions[i + 2] = (Math.random() - 0.5) * 2;

      const color = new THREE.Color(
        ringColors[Math.floor(Math.random() * ringColors.length)],
      );
      particleColors[i] = color.r;
      particleColors[i + 1] = color.g;
      particleColors[i + 2] = color.b;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 5;

    const onMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      rings.forEach((ring) => {
        ring.rotation.x += ring.rotationSpeed.x;
        ring.rotation.y += ring.rotationSpeed.y;
        ring.rotation.z += ring.rotationSpeed.z;
      });

      (flow.material as THREE.ShaderMaterial).uniforms.time.value = time;

      const particlePositions = particles.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < particlePositions.length; i += 3) {
        const angle = time * 0.2 + i * 0.01;
        const radius = 1 + Math.sin(time * 0.5 + i * 0.1) * 0.5;
        particlePositions[i] =
          Math.cos(angle) * radius + Math.sin(time + i) * 0.1;
        particlePositions[i + 1] =
          Math.sin(angle) * radius + Math.cos(time + i) * 0.1;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      camera.position.x +=
        (mousePosition.current.x * 2 - camera.position.x) * 0.05;
      camera.position.y +=
        (mousePosition.current.y * 2 - camera.position.y) * 0.05;
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

  return <div ref={containerRef} className="absolute inset-0 -z-10" />;
}
