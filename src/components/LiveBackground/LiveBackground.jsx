'use client';
import dynamic from 'next/dynamic';
import styles from './LiveBackground.module.css';

// Dynamically import the WebGL background to completely prevent Next.js SSR crashes
const WebGLBackground = dynamic(() => import('./WebGLBackground'), {
  ssr: false,
});

export default function LiveBackground() {
  return (
    <>
      {/* Pure black base */}
      <div className={styles.baseLayer} />

      {/* The True aboutluca Cinematic Fog Engine */}
      <WebGLBackground />

      {/* Cinematic static film grain */}
      <div className={styles.filmGrain} />
    </>
  );
}