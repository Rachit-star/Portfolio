'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className={styles.cursor}
      animate={{
        x: mousePosition.x - 15,
        y: mousePosition.y - 15,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 2
      }}
    />
  );
}
