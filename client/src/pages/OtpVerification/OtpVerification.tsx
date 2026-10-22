
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { MailCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./otpVerification.module.scss";

const OTP_LENGTH = 6;
const OTP_DURATION = 300;

function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as { email?: string } | null)?.email;

  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION);
  const [expiresAt, setExpiresAt] = useState(
    () => Date.now() + OTP_DURATION * 1000
  );

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer
  useEffect(() => {
    const updateTimer = () => {
      setSecondsLeft(
        Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
      );
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formattedTime = `${String(
    Math.floor(secondsLeft / 60)
  ).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  // OTP input
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value;

    if (!/^\d?$/.test(value)) return;

    setOtp((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paste OTP
  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedCode) return;

    const updated = Array<string>(OTP_LENGTH).fill("");

    pastedCode.split("").forEach((digit, index) => {
      updated[index] = digit;
    });

    setOtp(updated);
    setError("");

    inputRefs.current[
      Math.min(pastedCode.length, OTP_LENGTH - 1)
    ]?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const code = otp.join("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "http://localhost:5000/api/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid verification code.");
        return;
      }

      setSuccess("Email verified successfully!");

      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!email) {
      setError("Email address is missing.");
      return;
    }

    try {
      setResending(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "http://localhost:5000/api/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend OTP.");
        return;
      }

      setOtp(Array(OTP_LENGTH).fill(""));
      setExpiresAt(Date.now() + OTP_DURATION * 1000);
      setSuccess("A new verification code has been sent.");

      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
      setError("Could not resend the verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className={styles.verifyPage}>
      <div className={styles.verifyCard}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>✦</span>
          <span>TripGenius</span>
        </div>

        <div className={styles.iconWrapper}>
          <MailCheck size={34} />
        </div>

        <h1>Verify Your Email</h1>

        <p className={styles.description}>
          We've sent a 6-digit verification code
          to your email address.
        </p>

        <p className={styles.email}>
          {email || "Email address unavailable"}
        </p>

        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={handlePaste}
              className={styles.otpInput}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <p className={styles.timer}>
          {secondsLeft > 0 ? (
            <>
              The code expires in <span>{formattedTime}</span>
            </>
          ) : (
            <span>Verification code expired</span>
          )}
        </p>

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        {success && (
          <p className={styles.success}>{success}</p>
        )}

        <button
          type="button"
          className={styles.verifyButton}
          onClick={handleVerify}
          disabled={
            loading ||
            secondsLeft === 0 ||
            otp.some((digit) => digit === "") ||
            !email
          }
        >
          {loading ? "Verifying..." : "Verify Email"}
          <ArrowRight size={18} />
        </button>

        <p className={styles.resendText}>
          Didn't receive the code?{" "}
          <button
            type="button"
            className={styles.resendButton}
            onClick={handleResendOtp}
            disabled={resending || !email}
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </p>

        <Link to="/register" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to registration
        </Link>
      </div>
    </main>
  );
}

export default OtpVerification;
