
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Globe,
  Phone,
  ArrowRight,
  Check,
} from "lucide-react";

import styles from "./Register.module.scss";
import Button from "../../components/Ui/Button";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <p className={styles.eyebrow}>JOIN TRIPGENIUS</p>

        <h2>Create Your Account</h2>

        <p className={styles.description}>
          Start planning extraordinary trips with personalized
          recommendations and unforgettable experiences.
        </p>
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.inputIcon}>
              <UserRound size={17} />
            </span>

            <input
              type="text"
              placeholder="Full name"
              autoComplete="name"
              name="name"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.inputIcon}>
              <Mail size={17} />
            </span>

            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              name="email"
              required
            />
          </label>
        </div>

        <div className={styles.hintRow}>
          <span>e.g. Mariam Hakobyan</span>
          <span>e.g. mariam@example.com</span>
        </div>

        <label className={styles.field}>
          <span className={styles.inputIcon}>
            <LockKeyhole size={17} />
          </span>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            minLength={8}
            name="password"
            required
          />

          <button
            type="button"
            className={styles.visibilityButton}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </label>

        <span className={styles.fieldHint}>
          At least 8 characters
        </span>

        <label className={styles.field}>
          <span className={styles.inputIcon}>
            <LockKeyhole size={17} />
          </span>

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            autoComplete="new-password"
            minLength={8}
            name="confirmPassword"
            required
          />

          <button
            type="button"
            className={styles.visibilityButton}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}
          </button>
        </label>

        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.inputIcon}>
              <Globe size={17} />
            </span>

            <select defaultValue="Armenia" aria-label="Country">
              <option value="Armenia">Armenia</option>
              <option value="Georgia">Georgia</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
              <option value="United States">United States</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.inputIcon}>
              <Phone size={17} />
            </span>

            <input
              type="tel"
              placeholder="Phone (optional)"
              autoComplete="tel"
              name="phoneNumber"
            />
          </label>
        </div>

        <label className={styles.terms}>
          <input type="checkbox" required />

          <span className={styles.checkIcon}>
            <Check size={12} />
          </span>

          <span>
            I agree to the <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>
          </span>
        </label>

        <button type="submit" className={styles.createButton}>
          Create Account
          <ArrowRight size={17} />
        </button>

        <div className={styles.divider}>
          <span />
          <p>or continue with</p>
          <span />
        </div>

        <div className={styles.socialButtons}>
          <Button onClick={()=>alert("hello")} className={styles.socialButton}>
            <span className={styles.googleIcon}>G</span>
            Google
          </Button>

          <Button onClick={()=>alert("hello")} className={styles.socialButton}>
            <span className={styles.appleIcon}>●</span>
            Apple
          </Button>
        </div>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;