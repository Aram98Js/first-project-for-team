
import { useState } from "react";
import "./LegalPages.css";

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

export default function TermsOfService() {
  const [active, setActive] = useState("acceptance");

  return (
    <div className="legal-page">
      <header className="legal-hero">
        <nav className="legal-navbar">
          <a className="legal-logo" href="/">
            <span className="legal-logo-icon">✈</span>
            TripGenius
          </a>

          <div className="legal-nav-links">
            <a href="/#destinations">Destinations</a>
            <a href="/#how-it-works">How It Works</a>
            <a href="/#about">About</a>
            <a href="/#blog">Blog</a>
          </div>

          <a className="legal-nav-button" href="/login">
            Sign In →
          </a>
        </nav>

        <div className="legal-hero-content">
          <span className="legal-eyebrow">
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

      <main className="legal-main">
        <div className="legal-intro">
          <span className="legal-eyebrow">
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

        <div className="legal-layout">
          <aside className="legal-sidebar">
            <span className="legal-sidebar-title">
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

          <div className="legal-content">
            {sections.map((section, index) => (
              <section
                className="legal-section"
                id={section.id}
                key={section.id}
              >
                <span className="legal-section-number">
                  {String(index + 1).padStart(2, "0")}
                  {" / "}09
                </span>

                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </section>
            ))}

            <div className="legal-bottom-card">
              <span className="legal-eyebrow">
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

      <footer className="legal-footer">
        <div className="legal-footer-brand">
          <span>✈ TripGenius</span>
          <p>Extraordinary journeys, intelligently designed.</p>
        </div>

        <div className="legal-footer-links">
          <a href="/">Home</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>

        <small>© 2026 TripGenius. All rights reserved.</small>
      </footer>
    </div>
  );
}
