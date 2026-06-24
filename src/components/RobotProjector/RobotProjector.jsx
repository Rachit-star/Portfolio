'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import styles from './RobotProjector.module.css';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;

function drawEye(ctx, x, y, baseW, baseH, {
  openness = 1,
  happy = 0,
  curioTall = 1,
  amazed = 0, // NEW
  scale = 1,
  opacity = 1,
  mergeProg = 0,
} = {}) {
  if (opacity < 0.005 || scale < 0.001) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const ew = baseW;
  const eh = Math.max(baseH * openness * lerp(1, 0.07, happy) * curioTall, 2);
  const hw = ew / 2;
  const hh = eh / 2;

  // Smooth crossfade for amazed ^^ expression
  if (amazed > 0.01) {
    ctx.save();
    ctx.globalAlpha = opacity * amazed;
    ctx.shadowColor = `rgba(0,240,255,0.8)`;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Sharp angles for ^^
    ctx.moveTo(-ew * 0.6, 5);
    ctx.lineTo(0, 5 - ew * 0.6);
    ctx.lineTo(ew * 0.6, 5);
    ctx.stroke();
    ctx.restore();
  }

  // Smooth crossfade for normal eye fill
  if (amazed < 0.99) {
    ctx.save();
    ctx.globalAlpha = opacity * (1 - amazed);
    const radius = lerp(Math.min(6, hh), hh, mergeProg);

    /* glow */
    const wipeFade = clamp(1 - (scale - 1) / 5, 0, 1);
    const glowA = lerp(0.3, 0.1, happy) * wipeFade;
    const blur = 15;
    ctx.shadowColor = `rgba(200,220,255,${glowA.toFixed(3)})`;
    ctx.shadowBlur = blur;

    /* fill */
    const g = ctx.createLinearGradient(0, -hh, 0, hh);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.4, '#f0f5ff');
    g.addColorStop(1, '#ccdaff');
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(-hw + radius, -hh);
    ctx.lineTo(hw - radius, -hh);
    ctx.arcTo(hw, -hh, hw, -hh + radius, radius);
    ctx.lineTo(hw, hh - radius);
    ctx.arcTo(hw, hh, hw - radius, hh, radius);
    ctx.lineTo(-hw + radius, hh);
    ctx.arcTo(-hw, hh, -hw, hh - radius, radius);
    ctx.lineTo(-hw, -hh + radius);
    ctx.arcTo(-hw, -hh, -hw + radius, -hh, radius);
    ctx.closePath();
    ctx.fill();

    /* specular */
    if (eh > 5 && happy < 0.5 && mergeProg < 0.5) {
      ctx.shadowBlur = 0;
      const specA = 0.5 * (1 - happy) * wipeFade;
      ctx.fillStyle = `rgba(255,255,255,${specA.toFixed(2)})`;
      ctx.beginPath();
      ctx.rect(-hw * 0.55, -hh + 1.5, ew * 0.55, Math.min(eh * 0.12, 3));
      ctx.fill();
    }

    /* border */
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = `rgba(175,208,255,${(0.28 * wipeFade).toFixed(2)})`;
    ctx.lineWidth = 0.75;
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function CanvasEyes({ isProjecting, onEmotionChange, isNavExpanded, overrideEmotion }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const width = isProjecting ? 200 : 120;
    const height = isProjecting ? 100 : 300;

    cvs.width = width * dpr;
    cvs.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let running = true;
    let animId = null;

    let targetLookX = 0;
    let targetLookY = 0;
    let lookX = 0;
    let lookY = 0;

    let roamLookX = 0;
    let roamLookY = 0;

    let t = 0;
    let nextBlink = Math.random() * 3 + 1;
    let nextExpr = Math.random() * 5 + 3;
    let nextRoam = Math.random() * 3 + 1;
    let openness = 1;
    let blinkTimer = 0;

    let targetHappy = 0;
    let currentHappy = 0;
    let targetCurious = 0;
    let currentCurious = 0;
    let targetAmazed = 0;
    let currentAmazed = 0;
    
    let currentRightStretch = 0;

    let lastTime = performance.now();

    const handleMouseMove = (e) => {
      if (isProjecting || isNavExpanded) return;
      const rect = cvs.getBoundingClientRect();
      const rx = rect.left + rect.width / 2;
      // Since robot is at bottom of 300px canvas, adjust ry center
      const ry = rect.top + rect.height - 40;
      const dx = e.clientX - rx;
      const dy = e.clientY - ry;

      const maxDistX = window.innerWidth;
      const maxDistY = window.innerHeight;

      targetLookX = Math.max(-1, Math.min(1, dx / (maxDistX * 0.3)));
      targetLookY = Math.max(-1, Math.min(1, dy / (maxDistY * 0.3)));
    };

    window.addEventListener('mousemove', handleMouseMove);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && running && !animId) {
          lastTime = performance.now();
          animId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(cvs);

    function draw(ts) {
      if (!running || !isVisible) {
        animId = null;
        return;
      }
      const dt = (ts - lastTime) / 1000;
      lastTime = ts;
      t += dt;

      if (isNavExpanded) {
        targetHappy = 0; targetCurious = 0; targetAmazed = 0;
        openness = lerp(openness, 0.05, 0.1);
        lookX = lerp(lookX, 0, 0.1);
        lookY = lerp(lookY, 0, 0.1);
      } else {
        if (t > nextRoam) {
          roamLookX = (Math.random() - 0.5) * 1.5;
          roamLookY = (Math.random() - 0.5) * 1.5;
          if (Math.random() < 0.3) { roamLookX = 0; roamLookY = 0; }
          nextRoam = t + Math.random() * 3 + 1;
        }

        const finalTargetX = lerp(targetLookX, roamLookX, 0.3);
        const finalTargetY = lerp(targetLookY, roamLookY, 0.3);

        if (overrideEmotion) {
          targetHappy = 0; targetCurious = 0; targetAmazed = 0;
          if (overrideEmotion === 'AMAZED' || overrideEmotion === 'EXCITED') targetAmazed = 1;
          if (overrideEmotion === 'CHEERFUL') targetHappy = 1;
          if (overrideEmotion === 'THOUGHTFUL') targetCurious = 1;
          nextExpr = t + 2; // Delay random expressions while overridden
        } else if (t > nextExpr) {
          const r = Math.random();
          targetHappy = 0; targetCurious = 0; targetAmazed = 0;
          if (r < 0.2) { targetHappy = 1; onEmotionChange('CHEERFUL'); }
          else if (r < 0.4) { targetCurious = 1; onEmotionChange('THOUGHTFUL'); }
          else if (r < 0.5) { targetAmazed = 1; onEmotionChange('AMAZED'); }
          else if (r < 0.6) { targetAmazed = 1; onEmotionChange('EXCITED'); }
          else if (r < 0.7) { targetCurious = 0.5; openness = 0.3; onEmotionChange('SUSPICIOUS'); }
          else { onEmotionChange('NEUTRAL'); }
          nextExpr = t + Math.random() * 4 + 2; 
        }

        if (t > nextBlink) {
          blinkTimer += dt;
          if (blinkTimer < 0.1) openness = lerp(1, 0.05, blinkTimer / 0.1);
          else if (blinkTimer < 0.25) openness = lerp(0.05, 1, (blinkTimer - 0.1) / 0.15);
          else { openness = 1; blinkTimer = 0; nextBlink = t + Math.random() * 4 + 1; }
        }

        lookX = lerp(lookX, finalTargetX, 0.08);
        lookY = lerp(lookY, finalTargetY, 0.08);
      }

      currentHappy = lerp(currentHappy, targetHappy, 0.08);
      currentCurious = lerp(currentCurious, targetCurious, 0.08);
      currentAmazed = lerp(currentAmazed, targetAmazed, 0.1);

      const targetRightStretch = isNavExpanded ? 220 : 0;
      currentRightStretch = lerp(currentRightStretch, targetRightStretch, 0.1);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const breath = Math.sin(t * 2) * 2;
      const cy = isProjecting ? height / 2 + breath : height - 40 + breath;
      const unit = isProjecting ? Math.min(width, height) : 80;

      const targetGap = unit * 0.4;
      const eyeWider = currentHappy > 0.8 && currentCurious < 0.2 ? 1.4 : 1;
      const ew = unit * 0.35 * eyeWider;
      const eh = isProjecting ? unit * 0.15 : unit * 0.5 * eyeWider;

      let lx = cx - targetGap / 2;
      let rx = cx + targetGap / 2;
      let ly = cy;
      let ry = cy;

      const shiftPxX = isProjecting ? width * 0.15 : 10;
      const shiftPxY = isProjecting ? height * 0.15 : 10;

      lx += lookX * shiftPxX;
      rx += lookX * shiftPxX;
      ly += lookY * shiftPxY;
      ry += lookY * shiftPxY;

      const lCurioTall = lerp(1, 1.4, currentCurious);
      const rCurioTall = lerp(1, 0.7, currentCurious);
      ly -= lerp(0, unit * 0.015, currentCurious);
      ry += lerp(0, unit * 0.01, currentCurious);

      let rEh = eh;
      if (currentRightStretch > 1) {
        rEh = Math.max(eh * openness, 2) + currentRightStretch;
        ry = ry - currentRightStretch / 2;
      }

      drawEye(ctx, lx, ly, ew, eh, { openness: isNavExpanded ? 0.05 : openness, happy: currentHappy, curioTall: lCurioTall, amazed: currentAmazed });
      if (isNavExpanded) {
        drawEye(ctx, rx, ry, ew, rEh, { openness: 1, happy: 0, curioTall: 1, amazed: 0 });
      } else {
        drawEye(ctx, rx, ry, ew, eh, { openness, happy: currentHappy, curioTall: rCurioTall, amazed: currentAmazed });
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      running = false;
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isProjecting, onEmotionChange, isNavExpanded, overrideEmotion]);

  return <canvas ref={canvasRef} className={styles.eyesCanvas} data-projecting={isProjecting} />;
}

export default function RobotProjector({ isProjecting, options = {}, children, onClose, onOpen }) {
  const [emotion, setEmotion] = useState('NEUTRAL');
  const [overrideEmotion, setOverrideEmotion] = useState(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // Removed the aggressive scroll listener so the robot acts independently

  useEffect(() => {
    const handleEmotion = (e) => {
      if (e.detail.emotion) setOverrideEmotion(e.detail.emotion);
      if (e.detail.duration) {
        setTimeout(() => {
          setOverrideEmotion(null);
        }, e.detail.duration);
      }
    };
    window.addEventListener('robot-emotion', handleEmotion);

    return () => {
      window.removeEventListener('robot-emotion', handleEmotion);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsNavExpanded(false);
  };

  const navItems = [
    { id: 'about', icon: '👤', label: 'About' },
    { id: 'skills', icon: '⚒️', label: 'Skills' },
    { id: 'projects', icon: '💻', label: 'Projects' },
    { id: 'contact', icon: '✉️', label: 'Contact' }
  ];

  const getMouthStyle = () => {
    if (isProjecting) {
      return { 
        height: options.height || '80vh', 
        width: options.width || '90vw', 
        maxWidth: options.maxWidth || '1000px', 
        opacity: 1, 
        marginTop: 15, 
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(10, 10, 10, 0.5)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
      };
    }
    return { 
      height: 0, 
      width: 0, 
      opacity: 0, 
      marginTop: 0,
      border: '0px solid transparent',
      background: 'rgba(10, 10, 10, 0)',
      backdropFilter: 'blur(0px)',
      boxShadow: 'none'
    };
  };

  // Physical Body Language: The robot head will physically move and tilt depending on its mood
  const emotionVariants = {
    NEUTRAL: { y: 0, rotate: 0, scale: 1 },
    CHEERFUL: { y: -5, rotate: -5, scale: 1.02 },
    THOUGHTFUL: { y: 3, rotate: 10, scale: 0.98 },
    EXCITED: { y: [0, -12, 0], rotate: 0, scale: 1.05, transition: { y: { repeat: Infinity, duration: 0.4 } } },
    AMAZED: { y: -10, rotate: 0, scale: 1.1 },
    SUSPICIOUS: { y: 0, rotate: -8, scale: 0.95 }
  };

  const currentActiveEmotion = overrideEmotion || emotion;

  return (
    <>
      <AnimatePresence>
        {isProjecting && (
          <motion.div
            className={styles.dimmer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={styles.robotWrapper}
        layout="position"
        data-projecting={isProjecting}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onMouseEnter={() => !isProjecting && setIsNavExpanded(true)}
        onMouseLeave={() => setIsNavExpanded(false)}
        onClick={() => {
          if (!isProjecting && onOpen) {
            onOpen();
            setIsNavExpanded(false);
          }
        }}
        drag={!isProjecting}
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.15, cursor: "grabbing" }}
        onDragStart={() => setOverrideEmotion('AMAZED')}
        onDragEnd={() => setOverrideEmotion(null)}
      >
        <AnimatePresence>
          {!isProjecting && isNavExpanded && (
            <motion.div 
              className={styles.canvasOverlayNav}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {navItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  className={styles.canvasNavItem}
                  onClick={(e) => { e.stopPropagation(); scrollTo(item.id); }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.1 * index + 0.2 }}
                >
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className={styles.robotHead}
          layout
          variants={emotionVariants}
          animate={isProjecting ? "NEUTRAL" : currentActiveEmotion}
          transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        >
          <motion.div layout>
            <CanvasEyes isProjecting={isProjecting} onEmotionChange={setEmotion} overrideEmotion={overrideEmotion} />
          </motion.div>

          <motion.div
            className={styles.mouthScreen}
            layout
            initial={{ height: 0, width: 0, marginTop: 0, opacity: 0, border: '0px solid transparent', background: 'rgba(10, 10, 10, 0)', backdropFilter: 'blur(0px)', boxShadow: 'none' }}
            animate={getMouthStyle()}
            transition={{ type: "spring", stiffness: 150, damping: 20, mass: 1 }}
          >
            <AnimatePresence>
              {isProjecting && (
                <motion.div
                  className={styles.projectorContent}
                  data-lenis-prevent="true"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {children}
                  <button className={styles.closeBtn} onClick={onClose}>[ CLOSE CONNECTION ]</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
