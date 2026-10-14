



import { useState } from "react";
import styles from "./login.module.scss";
import { Link } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
} from 'lucide-react'

interface LoginForm{
    email:string,
    password: string;
}


const Login = ()=> {
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
const [loginFormData,setLoginFormData] = useState<LoginForm>({
    email: "",
    password: ""
})

const [errors,setErrors] = useState<{
    emailError: string,
    passwordError: string
}>({
emailError: "",
passwordError:""
})



  const  handleSubmit = (evt: React.FormEvent<HTMLFormElement>)=> {

    const newErrors = {
        email:"",
        password:""
    }
   evt.preventDefault()
   if(!loginFormData.email || !loginFormData.password) return

  if(!loginFormData.email ){
    newErrors.email = "email is Required"
  }     

  if (!loginFormData.password) {
    newErrors.password = "password id required";
  }

  if(newErrors.email || newErrors.password){
    setErrors(newErrors);
    return
  }
  }


  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>)=>{
    setLoginFormData({
        ...loginFormData,
        [evt.target.name]: evt.target.value
    })
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <LockKeyhole size={25} />
        </div>

        <p className={styles.eyebrow}>WELCOME BACK</p>

        <h2>Sign In to TripGenius</h2>

        <p className={styles.description}>
          Your next adventure is just one step away.
          Sign in to continue your journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email">Email address</label>

          <div className={styles.inputWrapper}>
            <Mail size={19} className={styles.inputIcon} />

            <input
              id="email"
              type="email"
              placeholder="mariam@example.com"
              value={email}
              onChange={handleChange}
              autoComplete="email"
              name="email"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password">Password</label>

            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <div className={styles.inputWrapper}>
            <LockKeyhole size={19} className={styles.inputIcon} />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <label className={styles.remember}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <span className={styles.customCheckbox}>
            {rememberMe && <Check size={13} />}
          </span>

          <span>Remember me</span>
        </label>

        <button type="submit" className={styles.submitButton}>
          <span>Sign In</span>
          <ArrowRight size={19} />
        </button>

        <div className={styles.divider}>
          <span />
          <p>or continue with</p>
          <span />
        </div>

        <button type="button" className={styles.socialButton}>
          <span className={styles.googleIcon}>G</span>
          Continue with Google
        </button>

        <button type="button" className={styles.socialButton}>
          <span className={styles.appleIcon}>●</span>
          Continue with Apple
        </button>

        <p className={styles.registerText}>
          Don't have an account?
          <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>

  );
}

export default Login;
