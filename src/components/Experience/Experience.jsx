'use client';
import globalStyles from '@/app/Portfolio.module.css';
import styles from './Experience.module.css';
import FadeUp from '@/components/FadeUp/FadeUp';
import Image from 'next/image';

export default function Experience({ handleOpenProjector }) {
  return (
    <section className={`${globalStyles.section} ${styles.section}`}>
      <div className={styles.container}>
        
        <div className={styles.headerRow}>
          <p className={styles.sectionLabel}>04 // EXPERIENCE & ACHIEVEMENTS</p>
        </div>

        <div className={styles.experienceList}>
          {/* Freelance / Intern */}
          <FadeUp delay={0.1}>
            <div className={styles.experienceRow}>
              <div className={styles.expDate}>PRESENT</div>
              <div className={styles.expContent}>
                <h3 className={styles.expRole}>Software Developer (Contract)</h3>
                <div className={styles.expCompany}>Independent Client (Former Director, Ministry of External Affairs)</div>
                <p className={styles.expDesc}>
                  Architecting a professional multilingual digital platform for Dr. Shikha Gupta, a high-profile diplomat and academic. Implementing robust English-to-Hindi internationalization (i18n) and integrating Resend API for scalable email workflows.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Hackathon */}
          <FadeUp delay={0.2}>
            <div className={styles.experienceRow}>
              <div className={styles.expDate}>JAN — FEB 2026</div>
              <div className={styles.expContent}>
                <h3 className={styles.expRole}>Hackathon Runner-Up (2nd Place)</h3>
                <div className={styles.expCompany}>Vibehack (by GENX AI)</div>
                <p className={styles.expDesc}>
                  Secured 2nd position overall by engineering an AI-powered Data Structures and Algorithms (DSA) Visualizer utilizing Google Gemini Studio.
                </p>
                <button 
                  className={styles.projectorBtn} 
                  onClick={() => handleOpenProjector(
                    <div className={styles.photoContainer}>
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image src="/vibehack.jpeg" alt="Vibehack Team" fill style={{ objectFit: 'contain' }} className={styles.photoImage} />
                      </div>
                    </div>,
                    { maxWidth: '500px', height: '85vh' }
                  )}
                >
                  [ VIEW TEAM PHOTO ]
                </button>
              </div>
            </div>
          </FadeUp>
        </div>

      </div>
    </section>
  );
}
