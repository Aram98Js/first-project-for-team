
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./tripDetails.module.scss";

type Activity = {
  time: string;
  title: string;
  description: string;
  category: string;
  cost: number;
  place: string;
};

type TripDay = {
  day: number;
  title: string;
  summary: string;
  activities: Activity[];
};

type Trip = {
  _id: string;
  questionnaire: {
    destination: string;
    days: number;
    adults: number;
    children: number;
  };
  overview: {
    summary: string;
    bestTime: string;
    estimatedTotal: number;
    currency: string;
    tips: string[];
    packing: string[];
    phrases: {
      local: string;
      meaning: string;
    }[];
  };
  plan: TripDay[];
};

export default function TripDetails() {
  const { id } = useParams();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `http://localhost:5000/api/getTrip/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load trip");
        }

        const data: Trip = await response.json();
        setTrip(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTrip();
  }, [id]);

  if (loading) return <p>Loading your trip...</p>;
  if (error) return <p>{error}</p>;
  if (!trip) return <p>Trip not found</p>;

  const day = trip.plan[activeDay];

  return (
    <main className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>
          YOUR PERSONALIZED JOURNEY
        </span>

        <h1>{trip.questionnaire.destination}</h1>

        <p>{trip.overview.summary}</p>

        <div className={styles.stats}>
          <span>{trip.questionnaire.days} Days</span>
          <span>
            {trip.questionnaire.adults +
              trip.questionnaire.children} Travelers
          </span>
          <span>
            {trip.overview.estimatedTotal}{" "}
            {trip.overview.currency}
          </span>
        </div>
      </header>

      <section className={styles.content}>
        <h2>Your Itinerary</h2>

        <div className={styles.days}>
          {trip.plan.map((item, index) => (
            <button
              key={item.day}
              className={
                activeDay === index ? styles.active : ""
              }
              onClick={() => setActiveDay(index)}
            >
              Day {item.day}
            </button>
          ))}
        </div>

        {day && (
          <div className={styles.dayContent}>
            <h3>{day.title}</h3>
            <p>{day.summary}</p>

            <div className={styles.timeline}>
              {day.activities.map((activity, index) => (
                <article
                  key={index}
                  className={styles.activity}
                >
                  <div className={styles.time}>
                    {activity.time}
                  </div>

                  <div>
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>

                    {activity.place && (
                      <span>{activity.place}</span>
                    )}

                    <strong>
                      {activity.cost}{" "}
                      {trip.overview.currency}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
