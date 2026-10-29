
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./myTrips.module.scss";

type Trip = {
  _id: string;
  questionnaire: {
    destination: string;
    days: number;
    adults?: number;
    children?: number;
    travelers?: number;
    interests?: string[];
  };
  overview?: {
    estimatedTotal?: number;
    currency?: string;
  };
  createdAt: string;
};

const API_URL = "http://localhost:5000";

function MyTrips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const getTrips = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("accessToken");

        if (!token) {
          throw new Error("Please log in to view your trips");
        }

        // Փոխիր հասցեն, եթե backend-ում այլ route ունես։
        const response = await fetch(
          `${API_URL}/api/getMyTrip`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load trips (${response.status})`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid trips response");
        }

        setTrips(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getTrips();

    return () => controller.abort();
  }, []);

  const filteredTrips = trips.filter((trip) =>
    trip.questionnaire.destination
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const getTravelers = (trip: Trip) => {
    const q = trip.questionnaire;

    return (
      q.travelers ??
      (q.adults ?? 1) + (q.children ?? 0)
    );
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              YOUR TRAVEL COLLECTION
            </span>

            <h1>My Trips</h1>

            <p>
              Every journey has a story.
              Explore your saved adventures.
            </p>
          </div>

          <button
            className={styles.createButton}
            onClick={() => navigate("/create-trip")}
          >
            + Create New Trip
          </button>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span className={styles.tripCount}>
            {filteredTrips.length} Trips
          </span>
        </div>

        {loading && (
          <div className={styles.message}>
            Loading your adventures...
          </div>
        )}

        {!loading && error && (
          <div className={styles.message}>
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className={styles.message}>
            <h2>No trips yet</h2>
            <p>
              Your next adventure is waiting to be planned.
            </p>

            <button
              className={styles.createButton}
              onClick={() => navigate("/create-trip")}
            >
              Plan Your First Trip
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          trips.length > 0 &&
          filteredTrips.length === 0 && (
            <div className={styles.message}>
              No matching destinations found.
            </div>
          )}

        {!loading && !error && (
          <div className={styles.grid}>
            {filteredTrips.map((trip) => (
              <article
                key={trip._id}
                className={styles.tripCard}
                onClick={() =>
                  navigate(`/trip/${trip._id}`)
                }
              >
                <div className={styles.cardVisual}>
                  <span className={styles.visualIcon}>
                    ✈
                  </span>

                  <span className={styles.dayBadge}>
                    {trip.questionnaire.days} Days
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>
                    TRAVEL ITINERARY
                  </span>

                  <h2>
                    {trip.questionnaire.destination}
                  </h2>

                  <div className={styles.meta}>
                    <span>
                      👥 {getTravelers(trip)} Travelers
                    </span>

                    <span>
                      📅{" "}
                      {new Date(
                        trip.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className={styles.cardFooter}>
                    <div>
                      <small>Estimated budget</small>

                      <strong>
                        {trip.overview?.estimatedTotal ?? "—"}{" "}
                        {trip.overview?.currency ?? ""}
                      </strong>
                    </div>

                    <span className={styles.arrow}>
                      ↗
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyTrips;
