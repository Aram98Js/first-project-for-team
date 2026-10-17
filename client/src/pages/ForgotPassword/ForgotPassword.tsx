import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  LockKeyhole,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import styles from "./forgotPassword.module.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
const [loading,setLoading] = useState<boolean>(false)
const [error, setError] = useState<string>("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        setLoading(true)
        setError("")
        const response = await fetch("http://localhost:5000/api/forgotPassword",{
    method: "POST",
    headers: {
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        email: email
    })
})
 
const data = await response.json();

if (!response.ok) {
      setError(data.msg || "Something went wrong");
      return;
    }



    setIsSubmitted(true);
    } catch (error) {
     console.log(error);

            setError("Unable to connect to the server");
    }finally{
        setLoading(false)
    }

  };

  return (
    <div className={styles.card}>
      {!isSubmitted ? (
        <>
          <div className={styles.header}>
            <div className={styles.iconBox}>
              <LockKeyhole size={27} strokeWidth={1.7} />
            </div>

            <span className={styles.eyebrow}>
              ACCOUNT RECOVERY
            </span>

            <h1>Forgot your password?</h1>

            <p>
              No worries! Enter the email address associated
              with your account and we'll help you reset
              your password.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>

            <div className={styles.inputWrapper}>
              <Mail size={19} />

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            
              />
              {error && <p className={styles.error}>{error}</p>}
            </div>

            <button type="submit" className={styles.submitButton}>
              {loading ? "Sending..." : "Send Reset Link"}
              <ArrowRight size={18} />
            </button>
          </form>

          <Link to="/login" className={styles.backLink}>
            <ArrowLeft size={17} />
            Back to Sign In
          </Link>

          <div className={styles.securityNote}>
            <ShieldCheck size={19} />
            <span>
              Your account security is our priority.
            </span>
          </div>
        </>
      ) : (
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={39} strokeWidth={1.6} />
          </div>

          <span className={styles.eyebrow}>
            ACCOUNT RECOVERY
          </span>

          <h1>Check your email</h1>

          <p>
            If an account exists for <strong>{email}</strong>,
            you'll receive instructions to reset your password.
          </p>

          <button
            type="button"
            className={styles.submitButton}
            onClick={() => setIsSubmitted(false)}
          >
            Try another email
            <ArrowRight size={18} />
          </button>

          <Link to="/login" className={styles.backLink}>
            <ArrowLeft size={17} />
            Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;