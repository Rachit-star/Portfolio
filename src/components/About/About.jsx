'use client';
import { motion } from 'framer-motion';
import globalStyles from '@/app/Portfolio.module.css';
import styles from './About.module.css';
import FadeUp from '@/components/FadeUp/FadeUp';

export default function About() {
  return (
    <section className={`${globalStyles.section} ${styles.section}`}>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.headerRow}>
          <p className={styles.sectionLabel}>01 // ABOUT ME</p>
        </div>

        {/* Massive Typography Body */}
        <FadeUp>
          <div className={styles.textContent}>
            I'm a computer science student who loves building things that are <span className={styles.accent}>clever</span> under the hood and <span className={styles.accent}>beautiful</span> on the screen. I spend most of my time mixing machine learning with interactive web design to create projects that actually <span className={styles.accent}>feel alive</span>.
          </div>
        </FadeUp>

        {/* Brutalist Stats Grid */}
        <FadeUp delay={0.2}>
          <div className={styles.statsGrid}>
            <div className={styles.statCol}>
              <div className={styles.statLabel}>// PURSUING</div>
              <div className={styles.statValue}>B.Tech Computer Science</div>
            </div>
            <div className={styles.statCol}>
              <div className={styles.statLabel}>// PREFERRED LOCATIONS</div>
              <div className={styles.statValue}>Remote / Delhi / India</div>
            </div>
            <div className={styles.statCol}>
              <div className={styles.statLabel}>// ROLES INTERESTED IN</div>
              <div className={styles.statValue}>ML / Data / Web Dev</div>
            </div>
          </div>
        </FadeUp>
        
      </div>
    </section>
  );
}
