import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./createTrip.module.scss";

type TripFormData = {
  destination: string;
  days: number;
  budget: string;
  travelers: number;
  interests: string[];
  pace: string;
};

const interestOptions = [
  "history",
  "food",
  "nature",
  "adventure",
  "art",
  "shopping",
];

function CreateTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    days: 5,
    budget: "medium",
    travelers: 1,
    interests: [],
    pace: "normal",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "days" || name === "travelers"
          ? Number(value)
          : value,
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.destination.trim()) {
      setError("Destination is required");
      return;
    }

    if (
      !Number.isInteger(formData.days) ||
      formData.days < 1 ||
      formData.days > 14 ||
      !Number.isInteger(formData.travelers) ||
      formData.travelers < 1
    ) {
      setError("Please enter valid trip details");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Please sign in to create a trip");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/createTrip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create trip");
        return;
      }

      navigate(`/trip/${data._id}`);

    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.heading}>
        <span>✦ TRIPGENIUS AI PLANNER</span>
        <h1>Plan Your Next Adventure</h1>
        <p>
          Tell us about your dream trip and let AI create
          a personalized itinerary.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Destination
          <input
            name="destination"
            placeholder="Where do you want to go?"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </label>

        <div className={styles.row}>
          <label>
            Number of days
            <input
              type="number"
              name="days"
              min={1}
              max={14}
              value={formData.days}
              onChange={handleChange}
            />
          </label>

          <label>
            Travelers
            <input
              type="number"
              name="travelers"
              min={1}
              value={formData.travelers}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Budget
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          >
            <option value="low">Budget Friendly</option>
            <option value="medium">Moderate</option>
            <option value="high">Luxury</option>
          </select>
        </label>

        <div className={styles.interests}>
          <h3>What interests you?</h3>

          <div className={styles.interestList}>
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                className={
                  formData.interests.includes(interest)
                    ? styles.activeInterest
                    : styles.interestButton
                }
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <label>
          Travel Pace
          <select
            name="pace"
            value={formData.pace}
            onChange={handleChange}
          >
            <option value="relaxed">Relaxed</option>
            <option value="normal">Balanced</option>
            <option value="fast">Fast Paced</option>
          </select>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Generating your trip..." : "✦ Generate My Trip"}
        </button>
      </form>
    </main>
  );
}

export default CreateTrip;