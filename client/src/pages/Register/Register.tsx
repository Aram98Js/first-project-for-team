
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './register.module.scss'
import Button from "../../components/Ui/Button";
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
import { GoogleLogin } from "@react-oauth/google";

interface RegisterFormData{
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  phoneNumber: string,
  country: string,
}


const Register = ()=> {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkBoxed,setCheckBoxed] = useState<boolean>(false);
  const [termsError, setTermsError] = useState<string>("");
  const [registerFormData,setRegisterFormData] = useState<RegisterFormData>({
    username:"",
    email:"",
    password:"",
    confirmPassword:"",
    phoneNumber:"",
    country:""
  })
const navigate = useNavigate()
const [errors, setErrors] = useState<
  { path: string; msg: string }[]
>([]);
  const handleSumbit = async(evt: React.FormEvent<HTMLFormElement>)=>{
        evt.preventDefault()

        if(!checkBoxed){
setTermsError("You must agree to the Terms of Service and Privacy Policy");
return
        }
         setTermsError("");
    try {
      const response = await fetch("http://localhost:5000/api/register",{
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: registerFormData.username,
          email: registerFormData.email,
          password: registerFormData.password,
          confirmPassword: registerFormData.confirmPassword,
          phoneNumber: registerFormData.phoneNumber,
          country: registerFormData.country
        })
      })

      const data = await response.json();


 if (!response.ok) {
  setErrors(
    data.errors || [
      { path: "general", msg: data.msg || "Something went wrong" }
    ]
  );
  return;
}
    setErrors([]);
   if (response.ok && data.requiresVerification) {
  navigate("/otp-verification", {
    state: {
      email: data.email
    }
  });
}
      
    } catch (error) {
      console.error(error)
    }

  }

  const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
  setRegisterFormData({
    ...registerFormData,
    [evt.target.name]: evt.target.value
  })
}
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
        onSubmit={handleSumbit}
      >
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.inputIcon}>
              <UserRound size={17} />
            </span>

            <input
            onChange={handleChange}
              type="text"
              value={registerFormData.username}
              placeholder="Full name"
              autoComplete="name"
              name="username"
            
            />
          </label>

          <label className={styles.field}>
            <span className={styles.inputIcon}>
              <Mail size={17} />
            </span>

            <input
            onChange={handleChange}
              type="email"
              value={registerFormData.email}
              placeholder="Email address"
              autoComplete="email"
              name="email"
             
            />
  
          </label>
        </div>

        <div className={styles.hintRow}>
         {errors.find((error) => error.path === "username") ? (
  <span className={styles.error}>
    {errors.find((error) => error.path === "username")?.msg}
  </span>
) : (
  <span className={styles.fieldHint}>
    e.g. Mariam Hakobyan
  </span>
)}



                   {errors.find((error) => error.path === "email") ? (
  <span className={styles.error}>
    {errors.find((error) => error.path === "email")?.msg}
  </span>
) : (
  <span className={styles.fieldHint}>
    e.g. mariamhakobyan@gmail.com
  </span>
)}
        </div>

        <label className={styles.field}>
          <span className={styles.inputIcon}>
            <LockKeyhole size={17} />
          </span>

          <input
          onChange={handleChange}
            value={registerFormData.password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            minLength={8}
            name="password"
            
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
<div  className={styles.hintRow}>
    {errors.find((error) => error.path === "password") ? (
  <span className={styles.error}>
    {errors.find((error) => error.path === "password")?.msg}
  </span>
) : (
  <span className={styles.fieldHint}>
  *
  </span>
)}
</div>
        
 

        <label className={styles.field}>
          <span className={styles.inputIcon}>
            <LockKeyhole size={17} />
          </span>

          <input
          onChange={handleChange}
            value={registerFormData.confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            autoComplete="new-password"
            minLength={8}
            name="confirmPassword"
            
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
  <div className = {styles.hintRow}>
    {errors.find((error) => error.path === "confirmPassword") && (
  <span className={styles.error}>
    {errors.find((error) => error.path === "confirmPassword")?.msg}
  </span>
)}
  </div>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.inputIcon}>
              <Globe size={17} />
            </span>


            <input
              type="text"
              onChange={handleChange}
                 value={registerFormData.country}
              placeholder="Country"
              autoComplete="country"
              name="country"
              
            />
     

          </label>
<div  className={styles.hintRow}>
    {errors.find((error) => error.path === "country") ? (
  <span className={styles.error}>
    {errors.find((error) => error.path === "country")?.msg}
  </span>
) : (
  <span className={styles.fieldHint}>
  
  </span>
)}
</div>
          <label className={styles.field}>
            <span className={styles.inputIcon}>
              <Phone size={17} />
            </span>

            <input
              value={registerFormData.phoneNumber}
              onChange={handleChange}
              type="tel"
              placeholder="Phone (optional)"
              autoComplete="tel"
              name="phoneNumber"
            />
            
          </label>
          <div  className={styles.hintRow}>
    {errors.find((error) => error.path === "phoneNumber") ? (
  <span className={styles.error}>
    {errors.find((error) => error.path === "phoneNumber")?.msg}
  </span>
) : (
  <span className={styles.fieldHint}>
  
  </span>
)}
</div>
        </div>

        <label className={styles.terms}>
          <input type="checkbox" checked={checkBoxed} onChange={(evt:React.ChangeEvent<HTMLInputElement>)=>setCheckBoxed(evt.target.checked)} />

          <span className={styles.checkIcon}>
            <Check size={12} />
          </span>

          <span>
            I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>
          </span>
          {termsError && <p className={styles.error}>{termsError}</p>}
        </label>

        <Button type="submit" className={styles.createButton}>
          Create Account
          <ArrowRight size={17} />
        </Button>

        <div className={styles.divider}>
          <span />
          <p>or continue with</p>
          <span />
        </div>

        <div className={styles.socialButtons}>
          <GoogleLogin
          onSuccess={async(response) => {
            const credential = response.credential;
        
          const result = await fetch(
            "http://localhost:5000/api/auth/google",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ credential }),
            }
          );
        
          const data = await result.json();
         if (!result.ok) {
        console.error(data.msg || "Google login failed");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      navigate("/profile");
          }}
          onError={() => {
            console.log("Google Login Failed");
          }}
        />

         
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