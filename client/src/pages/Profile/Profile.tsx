import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Pencil,
  LogOut,
  Plane,
  Camera,
  Compass,
  LockKeyhole,
} from "lucide-react";

import styles from "./profile.module.scss";

type ProfileUser = {
  _id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  image?: string;
  role?: string;
  createdAt?: string;
};

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const getProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Failed to load profile");
        }

        setUser(data.user);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getProfile();

    return () => controller.abort();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return <div className={styles.status}>Loading your profile...</div>;
  }

  if (error) {
    return <div className={styles.status}>{error}</div>;
  }

  if (!user) return null;

  return (
    <main className={styles.profilePage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className={styles.brand}>
            <Plane size={23} />
            <span>
              Trip<span className={styles.brandAccent}>Genius</span>
            </span>
          </div>

          <button
            type="button"
            className={styles.logoutTop}
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Log Out
          </button>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroOverlay}>
            <span className={styles.eyebrow}>
              YOUR JOURNEY STARTS HERE
            </span>

            <h1>
              Every journey
              <br />
              tells a <em>story.</em>
            </h1>

            <p>
              Your world, your adventures, your personal space.
            </p>
          </div>
        </section>

        <section className={styles.identity}>
          <div className={styles.avatar}>
            {user.image ? (
              <img src={user.image} alt="Profile avatar" />
            ) : (
              <UserRound size={46} />
            )}

            <span className={styles.cameraIcon}>
              <Camera size={15} />
            </span>
          </div>

          <div className={styles.identityText}>
            <span className={styles.smallLabel}>TRIPGENIUS MEMBER</span>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>

          <span className={styles.role}>
            <ShieldCheck size={15} />
            {user.role || "user"}
          </span>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.information}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.smallLabel}>ABOUT YOU</span>
                <h2>Personal Information</h2>
                <p>
                  Your personal details, all in one place.
                </p>
              </div>

              <button
                type="button"
                className={styles.editButton}
                disabled
                title="Editing will be available soon"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>

            <div className={styles.details}>
              <div className={styles.detail}>
                <UserRound size={19} />
                <div>
                  <span>Full Name</span>
                  <strong>{user.username}</strong>
                </div>
              </div>

              <div className={styles.detail}>
                <Mail size={19} />
                <div>
                  <span>Email Address</span>
                  <strong>{user.email}</strong>
                </div>
              </div>

              <div className={styles.detail}>
                <Phone size={19} />
                <div>
                  <span>Phone Number</span>
                  <strong>{user.phoneNumber || "Not provided"}</strong>
                </div>
              </div>

              <div className={styles.detail}>
                <MapPin size={19} />
                <div>
                  <span>Country</span>
                  <strong>{user.country || "Not provided"}</strong>
                </div>
              </div>
            </div>
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.travelCard}>
              <div className={styles.travelIcon}>
                <Compass size={25} />
              </div>

              <span className={styles.smallLabel}>THE WORLD AWAITS</span>

              <h3>
                Where to
                <br />
                next?
              </h3>

              <p>
                Beautiful places and unforgettable experiences
                are waiting to be discovered.
              </p>

              <Link to="/create-trip" className={styles.exploreButton}>
                Explore Destinations 
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className={styles.securityCard}>
              <LockKeyhole size={20} />
              <div>
                <h4>Account Security</h4>
                <p>Keep your travel account protected.</p>
              </div>
              <ShieldCheck size={19} className={styles.securityCheck} />
            </div>
          </aside>
        </div>

        <footer className={styles.footer}>
          <span>© TripGenius — Explore beyond boundaries.</span>
          <span>Made for curious travelers.</span>
        </footer>
      </div>
    </main>
  );
}

export default Profile;