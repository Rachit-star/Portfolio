'use client';
import globalStyles from '@/app/Portfolio.module.css';
import styles from './Projects.module.css';
import FadeUp from '@/components/FadeUp/FadeUp';

// Payload for Project Projection
export const ProjectPayload = ({ title, status, desc, details, url }) => (
  <div className={styles.payloadBox}>
    <h2 className={styles.payloadTitle}>{title}</h2>
    <div className={styles.payloadStatus}>
      // STATUS: {status}
    </div>
    
    <div className={styles.payloadImage}>
      {url ? (
        <div className={styles.iframeWrapper}>
          <iframe 
            src={url} 
            className={styles.scaledIframe}
            title={`${title} Live Preview`}
            scrolling="no"
            sandbox="allow-scripts allow-same-origin"
          />
          <div className={styles.iframeGradientOverlay} />
          <div className={styles.launchButtonContainer}>
            <a href={url} target="_blank" rel="noopener noreferrer" className={styles.payloadLink}>
              [ LAUNCH EXTERNAL ]
            </a>
          </div>
        </div>
      ) : (
        <div className={styles.noDataText}>
          [ VISUAL DATA UNAVAILABLE ]
        </div>
      )}
    </div>
    
    <p className={styles.payloadDesc}>{desc}</p>
    <ul className={styles.payloadList}>
      {details.map((d, i) => <li key={i}>{d}</li>)}
    </ul>
  </div>
);

export default function Projects({ handleOpenProjector }) {
  return (
    <section className={`${globalStyles.section} ${styles.section}`}>
      <div className={styles.container}>
        
        <div className={styles.headerRow}>
          <p className={styles.sectionLabel}>03 // DIGITAL EXPERIENCES</p>
        </div>

        <div className={styles.projectList}>
          <FadeUp delay={0.1}>
            <div className={styles.projectHoverRow} onClick={() => handleOpenProjector(
              <ProjectPayload 
                title="Bias Mirror" 
                status="Deployed Live" 
                desc="An interactive application designed to detect, analyze, and visualize bias in textual data and AI models." 
                details={["Real-time NLP processing", "Bias detection algorithms", "Interactive dashboard visualization", "Live: bias-mirror.vercel.app"]} 
                url="https://bias-mirror.vercel.app/"
              />
            )}>
              <div className={styles.projectTitle}>Bias Mirror</div>
              <div className={styles.projectMeta}>
                <span className={styles.projectType}>Data / Web</span>
                <span className={styles.projectAction}>[ VIEW ]</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className={styles.projectHoverRow} onClick={() => handleOpenProjector(
              <ProjectPayload 
                title="TrackHire - AI-Powered Internship Tracker" 
                status="Deployed Live" 
                desc="A full-stack internship tracking app that automatically scans Gmail for recruiter emails using AI, classifies them, and updates your application pipeline - no manual entry needed." 
                details={[
                  "Gmail OAuth integration with daily automated background scanning",
                  "Groq LLM classifies recruiter emails - interview invites, rejections, offers",
                  "Auto-creates application entries from untracked recruiter emails",
                  "Supabase backend with per-user token management and deduplication",
                  "Vercel cron job runs daily at 8:30am IST for all users",
                  "Built with Next.js 16, React 19, Supabase, Groq API"
                ]} 
                url="https://track-hire-blush.vercel.app"
              />
            )}>
              <div className={styles.projectTitle}>TrackHire</div>
              <div className={styles.projectMeta}>
                <span className={styles.projectType}>Next.js · AI · Supabase</span>
                <span className={styles.projectAction}>[ VIEW ]</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className={styles.projectHoverRow} onClick={() => handleOpenProjector(
              <ProjectPayload 
                title="FormulaForge" 
                status="Deployed Live" 
                desc="Your personal formula vault for quant prep. Store, organize, and render your formulas flawlessly." 
                details={[
                  "Structured Storage: A living database for your theorems",
                  "Live LaTeX: Flawless KaTeX rendering",
                  "Auto-Quizzes: Test memory with generated quizzes",
                  "Exam Arena: Train on Past Year Questions",
                  "Built with modern web technologies"
                ]} 
                url="https://formula-vault-eight.vercel.app/"
              />
            )}>
              <div className={styles.projectTitle}>FormulaForge</div>
              <div className={styles.projectMeta}>
                <span className={styles.projectType}>Next.js · KaTeX · Auth</span>
                <span className={styles.projectAction}>[ VIEW ]</span>
              </div>
            </div>
          </FadeUp>
        </div>

      </div>
    </section>
  );
}
