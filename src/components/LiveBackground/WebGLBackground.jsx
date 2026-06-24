'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './LiveBackground.module.css';

// Create a highly organic, chaotic smoke texture using Canvas API
function createOrganicCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Base soft radial gradient
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Add random organic "wisps" to simulate real smoke turbulence
  for(let i = 0; i < 50; i++) {
    const x = 256 + (Math.random() - 0.5) * 250;
    const y = 256 + (Math.random() - 0.5) * 250;
    const r = Math.random() * 120 + 40;
    
    const wispGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    wispGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.random() * 0.15})`);
    wispGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = wispGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  
  return new THREE.CanvasTexture(canvas);
}

// Create a sharp tiny dot for dust motes
function createDustTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(16, 16, 8, 0, Math.PI * 2);
  ctx.fill();
  
  return new THREE.CanvasTexture(canvas);
}

function CloudLayer() {
  const groupRef = useRef();
  const texture = useMemo(() => createOrganicCloudTexture(), []);
  
  const clouds = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
          10 - Math.random() * 60 
        ],
        rotation: Math.random() * Math.PI * 2,
        scale: Math.random() * 15 + 10,
        speed: (Math.random() - 0.5) * 0.001,
        opacity: Math.random() * 0.4 + 0.1,
        // Pure Brutalist Monochromatic Fog (Whites, Greys, Blacks)
        color: new THREE.Color().setHSL(0, 0, Math.random() * 0.3 + 0.1) 
      });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((cloud, i) => {
      cloud.rotation.z += clouds[i].speed;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position} rotation-z={cloud.rotation} scale={cloud.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={texture} 
            transparent 
            opacity={cloud.opacity} 
            depthWrite={false}
            color={cloud.color}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function DustLayer() {
  const pointsRef = useRef();
  const texture = useMemo(() => createDustTexture(), []);
  const count = 500;
  
  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50; 
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; 
      positions[i * 3 + 2] = 15 - Math.random() * 70; 
      speeds[i] = Math.random() * 0.005 + 0.002;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    return { geometry: geo, speeds };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += speeds[i]; 
      positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005;

      if (positions[i * 3 + 1] > 25) {
        positions[i * 3 + 1] = -25;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        map={texture} 
        size={0.12} 
        transparent 
        opacity={0.7} 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// THE SECRET SAUCE: Scroll-Driven 3D Flythrough
function ScrollFlythroughRig() {
  const { camera, mouse } = useThree();
  const target = new THREE.Vector3();
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
      scrollRef.current = scrollPercent;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    const s = scrollRef.current;
    
    // Mouse Parallax (subtle)
    const mouseX = mouse.x * 2;
    const mouseY = mouse.y * 2;
    
    // Cinematic Curved Path
    const curveX = Math.sin(s * Math.PI) * 15; 
    const curveY = Math.sin(s * Math.PI * 2) * 3; 
    
    // Amplified Scroll Physics:
    // Increased the total flight distance so even small scrolls move you further into the fog
    // Starts at Z=25 (far out), flies all the way down to Z=-50 (deep inside)
    const targetZ = 25 - (s * 75); 
    
    target.set(mouseX + curveX, mouseY + curveY, targetZ);
    
    // Faster interpolation (0.07 instead of 0.03) makes slow scrolls feel instantly responsive
    camera.position.lerp(target, 0.07);
    
    // Camera looks slightly ahead into the dark
    const lookAtTarget = new THREE.Vector3(mouseX * 0.5, mouseY * 0.5, targetZ - 20);
    camera.quaternion.slerp(
      new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(camera.position, lookAtTarget, new THREE.Vector3(0, 1, 0))
      ), 
      0.07
    );
  });
  
  return null;
}

export default function WebGLBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.webglWrapper}>
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#000000', 5, 35]} />
        <ambientLight intensity={1.0} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        
        <CloudLayer />
        <DustLayer />
        <ScrollFlythroughRig />
      </Canvas>
    </div>
  );
}
