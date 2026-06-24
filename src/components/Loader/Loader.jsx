'use client';

import { useEffect, useRef } from 'react';
import styles from './Loader.module.css';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EASING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const easeOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeOutCubic = t => 1 - (1 - t) ** 3;
const easeInCubic = t => t ** 3;
const easeInQuad = t => t * t;
const easeInOutCubic = t => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
const easeInOutQuint = t => t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
const easeOutBack = (t, s = 1.4) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const remap = (t, s, e) => clamp((t - s) / (e - s), 0, 1);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DRAW EYE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function drawEye(ctx, x, y, baseW, baseH, {
  openness = 1,
  happy = 0,
  curioTall = 1,
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "> Morning, here is to start the day";
  if (hour >= 12 && hour < 17) return "> No time, let's get to it";
  if (hour >= 17 && hour < 22) return "> feeling lazy? yeah me too, time for tea";
  return "> still up? me too !!";
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LOADER COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Loader({ onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    let W, H, unit;
    let running = true;
    let animId = null;
    let startTime = null;
    let completed = false;
    let metricCache = null;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      unit = Math.min(W, H);
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      metricCache = null;
    }
    resize();
    window.addEventListener('resize', resize);

    function getMetrics() {
      if (metricCache) return metricCache;
      const monoFont = "'Courier New', Courier, monospace";
      const nameSize = Math.max(20, unit * 0.04);
      const greetSize = Math.max(14, unit * 0.02);
      
      ctx.save();
      ctx.font = `400 ${nameSize}px ${monoFont}`;
      const name = "> Rachit Gupta";
      const nameW = ctx.measureText(name).width;
      
      ctx.font = `400 ${greetSize}px ${monoFont}`;
      const greeting = getGreeting();
      const greetW = ctx.measureText(greeting).width;
      ctx.restore();
      
      const textX = W / 2 - nameW / 2;
      const textY = H / 2 + unit * 0.12;
      const greetY = textY + unit * 0.04;
      const greetX = W / 2 - greetW / 2;
      
      metricCache = { monoFont, nameSize, greetSize, name, nameW, greeting, greetW, textX, textY, greetX, greetY };
      return metricCache;
    }

    function draw(ts) {
      if (!running) return;
      if (startTime === null) startTime = ts;
      const t = (ts - startTime) / 1000;

      const cx = W / 2;
      const cy = H / 2;
      const eyeBaseY = cy - unit * 0.030;

      /* ── TIMELINE (Total 8.0s) ── */
      let bootProg = 0;
      if (t >= 0.5 && t < 1.5) bootProg = easeOutCubic(remap(t, 0.5, 1.5));
      else if (t >= 1.5) bootProg = 1;

      let splitProg = 0;
      if (t >= 1.5 && t < 2.2) splitProg = easeInOutCubic(remap(t, 1.5, 2.2));
      else if (t >= 2.2) splitProg = 1;

      let openness = 0.1;
      if (t >= 2.2 && t < 2.8) openness = lerp(0.1, 1.0, easeOutExpo(remap(t, 2.2, 2.8)));
      else if (t >= 2.8) openness = 1;

      if (t >= 2.8 && t < 3.2) {
        openness = t < 3.0
          ? lerp(1, 0.05, easeInQuad(remap(t, 2.8, 3.0)))
          : lerp(0.05, 1, easeOutCubic(remap(t, 3.0, 3.2)));
      }

      let lookShift = 0;
      if (t >= 3.2 && t < 3.6) lookShift = -easeOutCubic(remap(t, 3.2, 3.6));
      else if (t >= 3.6 && t < 3.9) lookShift = -1;
      else if (t >= 3.9 && t < 4.4) lookShift = lerp(-1, 0, easeInOutCubic(remap(t, 3.9, 4.4)));
      const shiftPx = unit * 0.024;

      let curious = 0;
      if (t >= 3.2 && t < 4.4)
        curious = easeOutCubic(remap(t, 3.2, 3.6)) * (1 - easeInCubic(remap(t, 3.9, 4.4)));

      let happy = 0;
      if (t >= 4.8 && t < 5.3)
        happy = easeOutBack(remap(t, 4.8, 5.1), 1.2) * (1 - easeInQuad(remap(t, 5.1, 5.3)));
      happy = clamp(happy, 0, 1);

      const nameTypeStart = 2.0;
      const nameTypeEnd = 3.8;
      const nameProg = clamp(remap(t, nameTypeStart, nameTypeEnd), 0, 1);

      const greetTypeStart = 3.6;
      const greetTypeEnd = 5.2;
      const greetProg = clamp(remap(t, greetTypeStart, greetTypeEnd), 0, 1);

      let mergeProg = 0;
      if (t >= 5.3 && t < 5.8) mergeProg = easeInOutQuint(remap(t, 5.3, 5.8));
      else if (t >= 5.8) mergeProg = 1;

      const wipeStart = 5.8;
      const wipeEnd = 8.0;

      /* ── EYE POSITIONS ── */
      const targetGap = unit * 0.155;
      const targetW = unit * 0.068;
      const targetH = unit * 0.052;

      const currentGap = lerp(targetGap, 0, mergeProg);
      const currentW = lerp(targetW, targetH, mergeProg);

      const gap = lerp(0, currentGap, splitProg);
      const ew = lerp(unit * 0.15, currentW, splitProg);
      const eh = targetH;

      let lx = cx - gap / 2;
      let rx = cx + gap / 2;
      let ly = eyeBaseY;
      let ry = eyeBaseY;

      const lCurioTall = lerp(1, 1.45, curious);
      const rCurioTall = lerp(1, 0.68, curious);
      ly -= lerp(0, unit * 0.014, curious);
      ry += lerp(0, unit * 0.006, curious);

      lx += lookShift * shiftPx;
      rx += lookShift * shiftPx;

      if (happy > 0) {
        lx -= happy * targetGap * 0.07;
        rx += happy * targetGap * 0.07;
      }

      let wipeScale = 1;
      let holeR = 0;
      if (t >= wipeStart) {
        const zp = easeInOutQuint(remap(t, wipeStart, wipeEnd));
        const maxR = Math.sqrt(W * W + H * H) * 1.06;
        const targetWipeScale = maxR / (targetH / 2);
        wipeScale = lerp(1, targetWipeScale, zp);
        
        const eyeCurrentRadius = (targetH / 2) * wipeScale;
        holeR = eyeCurrentRadius * lerp(0, 1.05, easeOutCubic(zp));
      }

      /* ━━━━━━━━━━ RENDER ━━━━━━━━━━ */
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      // Terminal Text
      const nm = getMetrics();
      
      if (t >= nameTypeStart && t < wipeStart + 0.3) {
        const nameLen = Math.floor(nm.name.length * nameProg);
        const showCursor = t % 0.5 < 0.25 && nameProg < 1;
        const typedName = nm.name.substring(0, nameLen) + (showCursor ? '_' : '');
        ctx.save();
        ctx.font = `400 ${nm.nameSize}px ${nm.monoFont}`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = lerp(1, 0, easeInCubic(remap(t, wipeStart, wipeStart + 0.3)));
        ctx.fillText(typedName, nm.textX, nm.textY);
        ctx.restore();
      }

      if (t >= greetTypeStart && t < wipeStart + 0.3) {
        const greetLen = Math.floor(nm.greeting.length * greetProg);
        const showCursor = t % 0.5 < 0.25 && greetProg < 1 && nameProg >= 1;
        const typedGreet = nm.greeting.substring(0, greetLen) + (showCursor ? '_' : '');
        ctx.save();
        ctx.font = `400 ${nm.greetSize}px ${nm.monoFont}`;
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = lerp(1, 0, easeInCubic(remap(t, wipeStart, wipeStart + 0.3)));
        ctx.fillText(typedGreet, nm.greetX, nm.greetY);
        ctx.restore();
      }

      // Eyes
      if (bootProg > 0.005 && t < wipeEnd) {
        drawEye(ctx, lx, ly, ew, eh, {
          openness, happy, curioTall: lCurioTall, scale: wipeScale, opacity: bootProg, mergeProg
        });
        if (mergeProg < 1) {
          drawEye(ctx, rx, ry, ew, eh, {
            openness, happy, curioTall: rCurioTall, scale: wipeScale, opacity: bootProg, mergeProg
          });
        }
      }

      // Iris wipe (hole inside the eye)
      if (t >= wipeStart) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(cx, eyeBaseY, holeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (t < wipeEnd + 0.05 && running) {
        animId = requestAnimationFrame(draw);
      } else if (!completed) {
        completed = true;
        running = false;
        onComplete();
      }
    }

    const ready = document.fonts?.ready || Promise.resolve();
    ready.then(() => { if (running) animId = requestAnimationFrame(draw); });

    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [onComplete]);

  return (
    <div className={styles.loader}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}