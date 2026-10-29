
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./editProfile.module.scss";

type User = {
  _id: string;
  username: string;
  email: string;
  country: string;
  phoneNumber: string;
};

type ProfileForm = Pick<
  User,
  "username" | "country" | "phoneNumber"
>;

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProfileForm>({
    username: "",
    country: "",
    phoneNumber: "",
  });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const getProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.msg || "Failed to load profile"
          );
        }

        const user: User = data.user;

        setFormData({
          username: user.username || "",
          country: user.country || "",
          phoneNumber: user.phoneNumber || "",
        });

        setEmail(user.email || "");
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void getProfile();

    return () => controller.abort();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/editProfile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg || "Failed to update profile"
        );
      }

      setFormData({
        username: data.user.username || "",
        country: data.user.country || "",
        phoneNumber: data.user.phoneNumber || "",
      });

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading your profile...
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/profile")}
          >
            ← Back to Profile
          </button>

          <h1>Edit Profile</h1>
          <p>
            Manage your personal information and keep
            your profile up to date.
          </p>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {formData.username
                .charAt(0)
                .toUpperCase() || "U"}
            </div>

            <div>
              <h2>{formData.username || "User"}</h2>
              <p>{email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  minLength={2}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="country">
                  Country
                </label>

                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phoneNumber">
                  Phone Number
                </label>

                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+374..."
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                />

                <small>
                  Email cannot be changed here.
                </small>
              </div>
            </div>

            {error && (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            )}

            {success && (
              <p role="status" className={styles.success}>
                {success}
              </p>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.saveButton}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
