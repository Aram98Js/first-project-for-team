
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HowItWorks.module.scss";


const steps = [
  {
    number: "01",
    icon: "🌍",
    title: "Choose Your Destination",
    description:
      "Tell us where you want to go. From iconic cities to hidden gems, your journey begins with a destination.",
  },
  {
    number: "02",
    icon: "🎯",
    title: "Personalize Your Trip",
    description:
      "Choose your travel dates, budget, interests, group size, and preferred travel pace.",
  },
  {
    number: "03",
    icon: "✨",
    title: "Let AI Plan the Journey",
    description:
      "Our AI creates a personalized day-by-day itinerary based on your preferences.",
  },
  {
    number: "04",
    icon: "🧳",
    title: "Explore Your Adventure",
    description:
      "Review your itinerary, discover suggested activities, and access your saved plans anytime.",
  },
];

const benefits = [
  {
    icon: "🧠",
    title: "AI-Powered Planning",
    description:
      "Travel itineraries tailored to your interests and preferences.",
  },
  {
    icon: "⏱️",
    title: "Save Valuable Time",
    description:
      "Spend less time organizing and more time looking forward to your trip.",
  },
  {
    icon: "💰",
    title: "Budget-Aware",
    description:
      "Get travel suggestions that take your preferred budget into account.",
  },
  {
    icon: "🗺️",
    title: "Day-by-Day Itineraries",
    description:
      "Explore an organized schedule of activities for each day.",
  },
];

const faqs = [
  {
    question: "How does TripGenius work?",
    answer:
      "Tell us your destination and travel preferences. Our AI generates a personalized itinerary with daily activities and suggestions.",
  },
  {
    question: "Can I save my travel plans?",
    answer:
      "Yes! Your generated trips are saved to your account and can be accessed from the My Trips page.",
  },
  {
    question: "Can I customize my itinerary?",
    answer:
      "You can customize your destination, travel duration, budget, interests, and other preferences before generating your itinerary.",
  },
  {
    question: "Are travel prices guaranteed?",
    answer:
      "No. AI-generated prices and recommendations are estimates. Always verify prices, availability, and travel requirements before booking.",
  },
];

function HowItWorks() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Փոխիր, եթե CreateTrip էջիդ route-ն այլ է։
  const goToCreateTrip = () => navigate("/create-trip");

  return (
    <main className={styles.page}>
               
      {/* HERO */}
      <section className={styles.hero}>
        
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            DISCOVER A SMARTER WAY TO TRAVEL
          </span>

          <h1>
            Your Journey.
            <br />
            <span>Made Simple.</span>
          </h1>

          <p>
            From your first travel idea to a personalized
            itinerary, TripGenius makes planning your next
            adventure easier than ever.
          </p>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={goToCreateTrip}
          >
            Start Planning <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className={styles.heroBottom}>
          <span>EXPLORE MORE. PLAN LESS.</span>
          <span>↓ SCROLL TO DISCOVER</span>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <span className={styles.sectionLabel}>
          THE PROCESS
        </span>

        <h2>
          Four Simple Steps to
          <br />
          <span>Your Next Adventure</span>
        </h2>

        <p>
          No complicated spreadsheets. No endless searching.
          Just a travel experience designed around you.
        </p>
      </section>

      {/* STEPS */}
      <section className={styles.stepsSection}>
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <article
              key={step.number}
              className={styles.stepCard}
            >
              <div className={styles.stepTop}>
                <span className={styles.stepNumber}>
                  {step.number}
                </span>

                <span className={styles.stepIcon}>
                  {step.icon}
                </span>
              </div>

              <h3>{step.title}</h3>
              <p>{step.description}</p>

              <div className={styles.stepLine} />
            </article>
          ))}
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className={styles.featureSection}>
        <div className={styles.featureImage}>
          <div className={styles.imageBadge}>
            <span>✦</span>
            <div>
              <strong>Made for explorers</strong>
              <small>Powered by intelligent planning</small>
            </div>
          </div>
        </div>

        <div className={styles.featureContent}>
          <span className={styles.sectionLabel}>
            TRAVEL DIFFERENTLY
          </span>

          <h2>
            Less Planning.
            <br />
            <span>More Discovering.</span>
          </h2>

          <p>
            Every traveler is different. TripGenius uses
            your preferences to create an itinerary that
            reflects the way you want to explore.
          </p>

          <p>
            Whether you love history, nature, food, or
            adventure, your travel plan is built around
            what matters most to you.
          </p>

          <button
            type="button"
            className={styles.textButton}
            onClick={goToCreateTrip}
          >
            Create Your Journey <span>→</span>
          </button>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>
            WHY TRIPGENIUS
          </span>

          <h2>
            Everything You Need,
            <br />
            <span>Nothing You Don't.</span>
          </h2>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className={styles.benefitCard}
            >
              <div className={styles.benefitIcon}>
                {benefit.icon}
              </div>

              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.faqIntro}>
          <span className={styles.sectionLabel}>
            NEED SOME ANSWERS?
          </span>

          <h2>
            Frequently Asked
            <br />
            <span>Questions.</span>
          </h2>

          <p>
            Everything you need to know before planning
            your next adventure.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;

            return (
              <div
                key={faq.question}
                className={`${styles.faqItem} ${
                  isOpen ? styles.faqOpen : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() =>
                    setActiveFaq(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>

                  <span className={styles.faqToggle}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaOverlay} />

        <div className={styles.ctaContent}>
          <span className={styles.eyebrow}>
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h2>
            The World Is Waiting.
            <br />
            <span>Are You Ready?</span>
          </h2>

          <p>
            Turn your travel dreams into a personalized
            adventure with TripGenius.
          </p>

          <button
            type="button"
            className={styles.ctaButton}
            onClick={goToCreateTrip}
          >
            Plan My Trip <span>↗</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default HowItWorks;
