'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Core Layout & Logic Components
import Loader from '@/components/Loader/Loader';
import dynamic from 'next/dynamic';
import LiveBackground from '@/components/LiveBackground/LiveBackground';

const RobotProjector = dynamic(() => import('@/components/RobotProjector/RobotProjector'), { ssr: false });

// Extracted UI Components
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Skills from '@/components/Skills/Skills';
import Experience from '@/components/Experience/Experience';
import Projects from '@/components/Projects/Projects';
import Contact from '@/components/Contact/Contact';
import CustomCursor from '@/components/CustomCursor/CustomCursor';

import styles from './Portfolio.module.css';

export default function Portfolio() {
  const [phase, setPhase] = useState('loading');
  const [projectorContent, setProjectorContent] = useState(null);
  const [projectorOptions, setProjectorOptions] = useState({});
  const calledRef = useRef(false);

  useEffect(() => {
  }, [phase]);

  function handleComplete() {
    if (calledRef.current) return;
    calledRef.current = true;
    setPhase('done');
  }

  const handleOpenProjector = (content, options = {}) => {
    setProjectorContent(content);
    setProjectorOptions(options);
  };

  const handleCloseProjector = () => {
    setProjectorContent(null);
    setProjectorOptions({});
  };

  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {phase === 'loading' && <Loader key="loader" onComplete={handleComplete} />}
      </AnimatePresence>

      <div className={styles.container}>
        <LiveBackground />

        {phase === 'done' && (
          <RobotProjector
            isProjecting={projectorContent !== null}
            options={projectorOptions}
            onClose={handleCloseProjector}
          >
            {projectorContent}
          </RobotProjector>
        )}

        <motion.div
          className={styles.contentWrapper}
          animate={{ opacity: projectorContent !== null ? 0.05 : 1, filter: projectorContent !== null ? 'blur(10px)' : 'blur(0px)' }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
          
          <div className={styles.sectionsWrapper}>
            <div id="about"><About handleOpenProjector={handleOpenProjector} /></div>
            <div id="skills"><Skills /></div>
            <Experience handleOpenProjector={handleOpenProjector} />
            <div id="projects"><Projects handleOpenProjector={handleOpenProjector} /></div>
            <div id="contact"><Contact /></div>
          </div>
        </motion.div>
      </div>
    </>
  );
}