'use client';
import globalStyles from '@/app/Portfolio.module.css';
import styles from './Contact.module.css';
import FadeUp from '@/components/FadeUp/FadeUp';
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Transmitting...');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus('Transmission Successful.');
      } else {
        setStatus(`FAILED: ${result.error || 'Unknown Error'}`);
        console.error("Transmission Error:", result);
      }
    } catch (err) {
      console.error(err);
      setStatus('Error Initializing Transmission.');
    }
  };

  return (
    <section className={`${globalStyles.section} ${styles.section}`}>
      <div className={styles.container}>
        
        <div className={styles.headerRow}>
          <p className={styles.sectionLabel}>05 // LET'S TALK</p>
        </div>

        <FadeUp>
          <h2 className={styles.massiveTitle}>
            Ready to build <span className={styles.accent}>something</span> together?
          </h2>
        </FadeUp>

        <div className={styles.flexContainer}>
          <div className={styles.formCol}>
            <FadeUp delay={0.1}>
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label>NAME</label>
                  <input type="text" name="name" className={styles.brutalistInput} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>EMAIL</label>
                  <input type="email" name="email" className={styles.brutalistInput} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>MESSAGE</label>
                  <textarea name="message" className={`${styles.brutalistInput} ${styles.textArea}`} required></textarea>
                </div>
                <button type="submit" className={styles.brutalistSubmit} disabled={status === 'Transmitting...'}>
                  {status ? `[ ${status.toUpperCase()} ]` : 'SEND MESSAGE'}
                </button>
              </form>
            </FadeUp>
          </div>

          <div className={styles.infoCol}>
            <FadeUp delay={0.2}>
              <div className={styles.contactBlock}>
                <div className={styles.contactTitle}>CONNECT</div>
                <div className={styles.contactLinks}>
                  <a href="mailto:rachitgupta2903@gmail.com">EMAIL</a>
                  <a href="https://www.linkedin.com/in/rachit-gupta-7394a2322/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
                  <a href="https://github.com/Rachit-star" target="_blank" rel="noopener noreferrer">GITHUB</a>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>

        <FadeUp delay={0.3}>
          <div className={styles.footerRow}>
            <span>&copy; {new Date().getFullYear()} RACHIT GUPTA</span>
            <button 
              className={styles.backToTopBtn} 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              [ BACK TO TOP ]
            </button>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
