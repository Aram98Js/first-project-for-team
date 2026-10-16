
import { useState } from "react";
import styles from  "./Terms.module.scss"



export default function TermsOfService() {

  const [active, setActive] = useState("acceptance");
const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing or using TripGenius, you agree to these Terms of Service. If you do not agree, please do not use our platform.",
  },
  {
    id: "services",
    title: "Our Services",
    content:
      "TripGenius provides AI-assisted travel planning, destination discovery, personalized itineraries, and travel recommendations. Suggestions are informational and may change based on availability.",
  },
  {
    id: "accounts",
    title: "User Accounts",
    content:
      "You are responsible for providing accurate registration information, maintaining the confidentiality of your account credentials, and notifying us of unauthorized account activity.",
  },
  {
    id: "ai",
    title: "AI-Generated Recommendations",
    content:
      "AI-generated itineraries may contain inaccuracies or outdated information. Always verify travel requirements, pricing, schedules, safety information, and reservations before making decisions.",
  },
  {
    id: "bookings",
    title: "Bookings & Payments",
    content:
      "Third-party travel providers may apply their own prices, booking conditions, cancellation policies, and refund rules. TripGenius does not guarantee third-party availability.",
  },
  {
    id: "conduct",
    title: "Acceptable Use",
    content:
      "You agree not to misuse the platform, attempt unauthorized access, interfere with its operation, or use its services for unlawful purposes.",
  },
  {
    id: "liability",
    title: "Limitations of Liability",
    content:
      "To the extent permitted by applicable law, TripGenius is not responsible for losses caused by inaccurate third-party information, travel disruptions, or circumstances beyond its reasonable control.",
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    content:
      "We may update these terms as our services evolve. Material changes will be communicated where required by applicable law.",
  },
  {
    id: "contact",
    title: "Contact Us",
    content:
      "For questions about these Terms of Service, please contact the TripGenius support team through our official support channels.",
  },
];
  return (
    <div className={styles.legal_page}>
      <header className={styles.legal_hero}>
        <nav className={styles.legal_navbar}>
          <a className={styles.legal_logo}  href="/">
            <span className={styles.legal_logo_icon}>✈</span>
            TripGenius
          </a>

          <div className={styles.legal_nav_links}>
            <a href="/#destinations">Destinations</a>
            <a href="/#how-it-works">How It Works</a>
            <a href="/#about">About</a>
            <a href="/#blog">Blog</a>
          </div>

          <a className={styles.legal_nav_button} href="/login">
            Sign In →
          </a>
        </nav>

        <div className={styles.legal_hero_content}>
          <span className={styles.legal_eyebrow}>
            THE TRIPGENIUS EXPERIENCE
          </span>

          <h1>
            Terms of <em>Service.</em>
          </h1>

          <p>
            Every extraordinary journey begins with trust.
            Explore the guidelines that make your
            TripGenius experience seamless and secure.
          </p>

          <span className="legal-updated">
            Last updated: October 15, 2026
          </span>
        </div>
      </header>

      <main className={styles.legal_main}>
        <div className={styles.legal_intro}>
          <span className={styles.legal_eyebrow}>
            TRANSPARENCY & TRUST
          </span>
          <h2>
            Your journey, <em>our commitment.</em>
          </h2>
          <p>
            Please review the following terms to understand
            how TripGenius works and the responsibilities
            involved in using our travel planning platform.
          </p>
        </div>

        <div className={styles.legal_layout}>
          <aside className={styles.legal_sidebar}>
            <span className={styles.legal_sidebar_title}>
              ON THIS PAGE
            </span>

            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={
                  active === section.id ? "active" : ""
                }
                onClick={() => setActive(section.id)}
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            ))}
          </aside>

          <div className={styles.legal_content}>
            {sections.map((section, index) => (
              <section
                className={styles.legal__section}
                id={section.id}
                key={section.id}
              >
                <span className={styles.legal_section_number}>
                  {String(index + 1).padStart(2, "0")}
                  {" / "}09
                </span>

                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </section>
            ))}

            <div className={styles.legal_bottom_card}>
              <span className={styles.legal_eyebrow}>
                YOUR PRIVACY MATTERS
              </span>

              <h3>Travel with confidence.</h3>

              <p>
                Learn more about how we handle and protect
                your personal information.
              </p>

              <a href="/privacy-policy">
                Explore Privacy Policy →
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.legal_footer}>
        <div className={styles.legal_footer_brand}>
          <span>✈ TripGenius</span>
          <p>Extraordinary journeys, intelligently designed.</p>
        </div>

        <div className={styles.legal_footer_links}>
          <a href="/">Home</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>

        <small>© 2026 TripGenius. All rights reserved.</small>
      </footer>
    </div>
  );
}
