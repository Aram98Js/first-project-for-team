
import { useState } from "react";
import styles from "./privacy.module.scss";

const PrivacyPolicy = () => {
  const privacySections = [
    {
      id: "introduction",
      number: "01",
      title: "Introduction",
      text: [
        "Welcome to TripGenius. Your privacy matters to us. This Privacy Policy explains how we may collect, use, store, and protect your personal information when you use our travel planning platform.",
        "Our goal is to create personalized travel experiences while being transparent about how your information is handled.",
      ],
    },
    {
      id: "information",
      number: "02",
      title: "Information We Collect",
      text: [
        "When you create an account, we may collect information such as your name, email address, country, and optional phone number.",
        "We may also collect travel preferences, selected destinations, trip dates, budgets, saved itineraries, and information you choose to share when planning a journey.",
        "Technical information, such as browser type and device information, may be collected to help improve the platform.",
      ],
    },
    {
      id: "usage",
      number: "03",
      title: "How We Use Your Information",
      text: [
        "We use your information to provide and improve our services, personalize travel recommendations, create itineraries, manage accounts, and respond to support requests.",
        "Where permitted, we may also send service updates or travel-related communications based on your preferences.",
      ],
    },
    {
      id: "ai",
      number: "04",
      title: "AI-Powered Personalization",
      text: [
        "TripGenius is designed to use artificial intelligence to suggest destinations, activities, accommodations, and travel experiences based on the information you provide.",
        "Travel suggestions are intended to assist your planning. Availability, prices, entry requirements, and other travel details should be independently verified before booking.",
      ],
    },
    {
      id: "sharing",
      number: "05",
      title: "Information Sharing",
      text: [
        "We may share information with service providers when necessary to operate the platform, process requests, or provide features you choose to use.",
        "We may also disclose information where required by applicable law. Our data-sharing practices should be clearly explained before production launch.",
      ],
    },
    {
      id: "security",
      number: "06",
      title: "Data Security",
      text: [
        "We aim to protect personal information through appropriate technical and organizational safeguards.",
        "No internet-based system can guarantee absolute security. We encourage users to create strong passwords and protect their account credentials.",
      ],
    },
    {
      id: "cookies",
      number: "07",
      title: "Cookies & Tracking",
      text: [
        "TripGenius may use cookies and similar technologies to support essential website functionality, remember preferences, and understand platform performance.",
        "Any optional analytics or marketing technologies should be explained through appropriate notices and consent controls where required.",
      ],
    },
    {
      id: "rights",
      number: "08",
      title: "Your Privacy Rights",
      text: [
        "Depending on applicable law, you may have rights to request access to, correction of, or deletion of your personal information.",
        "You may also have rights to object to certain processing activities or withdraw consent where processing is based on consent.",
      ],
    },
    {
      id: "retention",
      number: "09",
      title: "Data Retention",
      text: [
        "Personal information should be retained only for as long as necessary for legitimate service purposes, legal obligations, or other applicable requirements.",
        "Specific retention periods should be documented according to the platform's actual data practices.",
      ],
    },
    {
      id: "updates",
      number: "10",
      title: "Changes to This Policy",
      text: [
        "We may update this Privacy Policy as our services develop or legal requirements change.",
        "When significant changes are made, we aim to provide appropriate notice and make the updated policy available on this page.",
      ],
    },
  ];

  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <div className={styles.tg_privacy}>
      {/* NAVIGATION */}
      <header className={styles.tg_privacy_navbar}>
        <a href="/" className={styles.tg_privacy_logo}>
          <span className={styles.tg_privacy_plane}>✈</span>
          <span>TripGenius</span>
        </a>

        <nav className={styles.tg_privacy_navlinks}>
          <a href="/#destinations">Destinations</a>
          <a href="/#how-it-works">How It Works</a>
          <a href="/#about">About</a>
          <a href="/#blog">Blog</a>
        </nav>

        <div className={styles.tg_privacy_actions}>
          <a href="/login" className={styles.tg_privacy_signin}>
            Sign In
          </a>

          <a href="/" className={styles.tg_privacy_plan}>
            Plan My Trip <span>→</span>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.tg_privacy_hero}>
        <div className={styles.tg_privacy_hero_overlay} />

        <div className={styles.tg_privacy_hero_content}>
          <span className={styles.tg_privacy_eyebrow}>
            YOUR TRUST. OUR PRIORITY.
          </span>

          <h1>
            Your Privacy,
            <br />
            <em>Our Promise.</em>
          </h1>

          <p>
            Every extraordinary journey begins with trust.
            Discover how TripGenius approaches your
            privacy and personal information.
          </p>

          <div className={styles.tg_privacy_hero_badge}>
            <span>✦</span>
            Designed with privacy in mind
          </div>
        </div>

        <div className={styles.tg_privacy_hero_caption}>
          <span>TRIPGENIUS</span>
          <span className={styles.tg_privacy_caption_line} />
          <span>PRIVACY POLICY</span>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className={styles.tg_privacy_main}>
        <div className={styles.tg_privacy_heading}>
          <span className={styles.tg_privacy_eyebrow}>
            TRANSPARENCY & TRUST
          </span>

          <h2>
            Privacy <em>Policy.</em>
          </h2>

          <p>
            We believe exploring the world should feel
            effortless, inspiring, and secure. Learn more
            about how your information may be handled
            throughout your TripGenius experience.
          </p>

          <div className={styles.tg_privacy_update}>
            <span>✦</span>
            Draft policy — October 2026
          </div>
        </div>

        <div className={styles.tg_privacy_layout}>
          {/* SIDEBAR */}
          <aside className={styles.tg_privacy_sidebar}>
            <div className={styles.tg_privacy_sidebar_label}>
              ON THIS PAGE
            </div>

            {privacySections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={[
                  styles.tg_privacy_sidebar_link,
                  activeSection === section.id ? styles.active : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.number}</span>
                {section.title}
              </a>
            ))}

            <div className={styles.tg_privacy_sidebar_bottom}>
              <span>✦</span>
              <p>
                Thoughtful journeys.
                <br />
                Respectful experiences.
              </p>
            </div>
          </aside>

          {/* POLICY CONTENT */}
          <div className={styles.tg_privacy_content}>
            <div className={styles.tg_privacy_welcome}>
              <span className={styles.tg_privacy_eyebrow}>
                A NOTE FROM TRIPGENIUS
              </span>

              <h3>
                Travel beautifully.
                <br />
                <em>Explore confidently.</em>
              </h3>

              <p>
                Your travel dreams are personal.
                We believe your information deserves
                thoughtful and responsible handling.
              </p>
            </div>

            {privacySections.map((section) => (
              <section
                className={styles.tg_privacy_section}
                id={section.id}
                key={section.id}
              >
                <div className={styles.tg_privacy_section_number}>
                  {section.number}
                </div>

                <div className={styles.tg_privacy_section_body}>
                  <h3>{section.title}</h3>

                  {section.text.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            {/* CONTACT CARD */}
            <div className={styles.tg_privacy_contact}>
              <div className={styles.tg_privacy_contact_icon}>
                ✉
              </div>

              <span className={styles.tg_privacy_eyebrow}>
                WE'RE HERE TO HELP
              </span>

              <h3>
                Questions about
                <br />
                <em>your privacy?</em>
              </h3>

              <p>
                If you have questions about this policy
                or how your information is handled,
                please contact the TripGenius team
                through our official support channel.
              </p>

              <a href="/contact">
                Contact Us <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.tg_privacy_footer}>
        <div className={styles.tg_privacy_footer_top}>
          <div>
            <a href="/" className={styles.tg_privacy_logo}>
              <span className={styles.tg_privacy_plane}>✈</span>
              <span>TripGenius</span>
            </a>

            <p>
              Extraordinary journeys,
              thoughtfully designed.
            </p>
          </div>

          <div className={styles.tg_privacy_footer_links}>
            <a href="/">Home</a>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div className={styles.tg_privacy_footer_bottom}>
          <span>© 2026 TripGenius. All rights reserved.</span>
          <span>Travel, designed around you.</span>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;