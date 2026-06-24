'use client';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import ProfileCard from '@/components/ProfileCard/ProfileCard';

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        
        {/* Left Side: Massive Brutalist Typography */}
        <motion.div
          className={styles.typographyContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.greeting}>
            <span className={styles.accentLine}></span>
            PORTFOLIO // {new Date().getFullYear()}
          </div>
          
          <h1 className={styles.name}>
            RACHIT<br />GUPTA<span className={styles.accentDot}>.</span>
          </h1>
          
          <div className={styles.roleWrapper}>
            <div className={styles.roleTitle}>Software Engineer & ML Architect</div>
            <div className={styles.roleDescription}>
              Bridging the gap between intelligent AI systems and high-performance web experiences.
              <div className={styles.highlightBlock}>
                <span className={styles.highlight}>Make it raw. Make it work.</span>
              </div>
            </div>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.resumeBtn}>
              [ VIEW RESUME ]
            </a>
          </div>
        </motion.div>

        {/* Right Side: The User's Custom 3D Tilt Profile Card */}
        <motion.div
          className={styles.visualContainer}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.profileCardWrapper}>
            <ProfileCard 
              avatarUrl="/avatar.png"
              showUserInfo={false}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
