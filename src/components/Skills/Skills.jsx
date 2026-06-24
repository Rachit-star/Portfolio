'use client';
import globalStyles from '@/app/Portfolio.module.css';
import styles from './Skills.module.css';
import FadeUp from '@/components/FadeUp/FadeUp';

export default function Skills() {
  return (
    <section className={`${globalStyles.section} ${styles.section}`}>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.headerRow}>
          <p className={styles.sectionLabel}>02 // THE ARSENAL</p>
        </div>

        <FadeUp>
          <h2 className={styles.massiveTitle}>
            Tools & technologies utilized to engineer digital <span className={styles.accent}>perfection</span>.
          </h2>
        </FadeUp>

        <div className={styles.arsenalList}>
          {/* Languages */}
          <FadeUp delay={0.1}>
            <div className={styles.arsenalRow}>
              <div className={styles.rowLabel}>LANGUAGES</div>
              <div className={styles.rowContent}>
                <span>PYTHON</span>
                <span className={styles.separator}>/</span>
                <span>JAVASCRIPT</span>
                <span className={styles.separator}>/</span>
                <span>JAVA</span>
                <span className={styles.separator}>/</span>
                <span>SQL</span>
              </div>
            </div>
          </FadeUp>

          {/* AI / ML */}
          <FadeUp delay={0.2}>
            <div className={styles.arsenalRow}>
              <div className={styles.rowLabel}>MACHINE LEARNING</div>
              <div className={styles.rowContent}>
                <span>SCIKIT-LEARN</span>
                <span className={styles.separator}>/</span>
                <span>PANDAS</span>
                <span className={styles.separator}>/</span>
                <span>NUMPY</span>
                <span className={styles.separator}>/</span>
                <span>PYTORCH</span>
                <span className={styles.separator}>/</span>
                <span>HUGGING FACE</span>
                <span className={styles.separator}>/</span>
                <span>GROQ API</span>
                <span className={styles.separator}>/</span>
                <span>GEMINI API</span>
              </div>
            </div>
          </FadeUp>

          {/* Frameworks */}
          <FadeUp delay={0.3}>
            <div className={styles.arsenalRow}>
              <div className={styles.rowLabel}>FRAMEWORKS & TOOLS</div>
              <div className={styles.rowContent}>
                <span>REACT</span>
                <span className={styles.separator}>/</span>
                <span>NEXT.JS</span>
                <span className={styles.separator}>/</span>
                <span>NODE.JS</span>
                <span className={styles.separator}>/</span>
                <span>FASTAPI</span>
                <span className={styles.separator}>/</span>
                <span>MONGODB</span>
                <span className={styles.separator}>/</span>
                <span>SUPABASE</span>
                <span className={styles.separator}>/</span>
                <span>FRAMER MOTION</span>
                <span className={styles.separator}>/</span>
                <span>VERCEL</span>
                <span className={styles.separator}>/</span>
                <span>RESEND</span>
                <span className={styles.separator}>/</span>
                <span>GIT</span>
                <span className={styles.separator}>/</span>
                <span>GITHUB</span>
              </div>
            </div>
          </FadeUp>
        </div>

      </div>
    </section>
  );
}
