import { useEffect, useState } from "react";
import {
  UserRound,
 
  Settings,
  LockKeyhole,
  ChevronRight,
  LogOut,
  Upload,
  ImageIcon,
  Compass,
  BriefcaseBusiness,
  Heart,
  Plane,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import styles from "./profile.module.scss";
import { useNavigate } from "react-router-dom";

type User = {
  _id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  image?: string;
  role?: string;
};



function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const navigate = useNavigate()
  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("Please log in to view your profile.");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Failed to load profile");
        }

        setUser(data.user);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (loading) {
    return <div className={styles.message}>Loading profile...</div>;
  }

  if (error) {
    return <div className={styles.message}>{error}</div>;
  }

  if (!user) return null;


const logOut = ()=>{
 localStorage.removeItem("accessToken");
 localStorage.removeItem("refreshToken");
 navigate("/login")
}
  return (
    <div className={styles.dashboardGrid}>
  <div className={styles.mainColumn}>
    <section className={styles.dashboardCard}>
      <div className={styles.sectionTitle}>
        <div className={styles.sectionIcon}>
          <UserRound size={21} />
        </div>
        <div>
          <h3>Personal Information</h3>
          <p>Keep your personal details up to date.</p>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <UserRound size={20} />
          <div>
            <span>Full Name</span>
            <strong>{user.username}</strong>
          </div>
        </div>

        <div className={styles.detailItem}>
          <Mail size={20} />
          <div>
            <span>Email Address</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <div className={styles.detailItem}>
          <Phone size={20} />
          <div>
            <span>Phone Number</span>
            <strong>{user.phoneNumber || "Not provided"}</strong>
          </div>
        </div>

        <div className={styles.detailItem}>
          <MapPin size={20} />
          <div>
            <span>Country</span>
            <strong>{user.country || "Not provided"}</strong>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.dashboardCard}>
      <div className={styles.sectionTitle}>
        <div className={styles.sectionIcon}>
          <Plane size={21} />
        </div>
        <div>
          <h3>Travel Preferences</h3>
          <p>Tell us more about your travel style.</p>
        </div>
      </div>

      <div className={styles.preferencesGrid}>
        <div className={styles.preferenceItem}>
          <Heart size={21} />
          <span>Favorite Destinations</span>
          <strong>Not set yet</strong>
        </div>

        <div className={styles.preferenceItem}>
          <BriefcaseBusiness size={21} />
          <span>Travel Style</span>
          <strong>Not set yet</strong>
        </div>

        <div className={styles.preferenceItem}>
          <Compass size={21} />
          <span>Interests</span>
          <strong>Not set yet</strong>
        </div>
      </div>
    </section>
  </div>

  <aside className={styles.sideColumn}>
    <section className={styles.dashboardCard}>
      <div className={styles.sectionTitle}>
        <div className={styles.sectionIcon}>
          <ImageIcon size={21} />
        </div>
        <div>
          <h3>Profile Picture</h3>
          <p>Update your profile picture.</p>
        </div>
      </div>

      <div className={styles.uploadArea}>
        <Upload size={25} />
        <strong>Upload your photo</strong>
        <span>JPG, PNG or WebP (Max 5MB)</span>
        <small>Image upload coming soon</small>
      </div>
    </section>

    <section className={styles.dashboardCard}>
      <div className={styles.sectionTitle}>
        <div className={styles.sectionIcon}>
          <Settings size={21} />
        </div>
        <div>
          <h3>Account Actions</h3>
          <p>Manage your account and security.</p>
        </div>
      </div>

      <button className={styles.actionButton} type="button" disabled>
        <LockKeyhole size={18} />
        Change Password
        <ChevronRight size={17} />
      </button>

      <button
        className={styles.logoutButton}
        type="button"
        onClick={logOut}
      >
        <LogOut size={18} />
        Log Out
      </button>
    </section>
  </aside>
</div>
  );
}

export default Profile;