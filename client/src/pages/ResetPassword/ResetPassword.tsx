import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import styles from "./resetPassword.module.scss";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/reset-password/${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword,
            confirmNewPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Unable to reset password");
        return;
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.card}>
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={38} />
          </div>

          <h1>Password Reset!</h1>

          <p>
            Your password has been successfully updated.
            You can now sign in with your new password.
          </p>

          <button
            className={styles.submitButton}
            onClick={() => navigate("/login", { replace: true })}
          >
            Continue to Sign In
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          <LockKeyhole size={27} strokeWidth={1.7} />
        </div>

        <span className={styles.eyebrow}>ACCOUNT SECURITY</span>

        <h1>Create New Password</h1>

        <p>
          Your new password must be different from your
          previous password. Choose a strong password
          to keep your account secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="newPassword">New Password</label>

          <div className={styles.inputWrapper}>
            <LockKeyhole size={18} />

            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmNewPassword">
            Confirm New Password
          </label>

          <div className={styles.inputWrapper}>
            <LockKeyhole size={18} />

            <input
              id="confirmNewPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              minLength={8}
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !token}
        >
          {loading ? "Resetting..." : "Reset Password"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <Link to="/login" className={styles.backLink}>
        <ArrowLeft size={17} />
        Back to Sign In
      </Link>

      <div className={styles.securityNote}>
        <ShieldCheck size={19} />
        <span>Your account security is our priority.</span>
      </div>
    </div>
  );
};

export default ResetPassword;