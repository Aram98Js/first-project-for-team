
import {

  Zap,
  Crown,
  MapPin,
} from "lucide-react";


import styles from "./authLayout.module.scss"
import {  Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader";

const  AuthLayout = ()=> {
  return (
    <div className={styles.auth_page}>
      
<SiteHeader />
      <main className={styles.auth_main}>
        <section className={styles.auth_intro}>
          <p className={styles.auth_eyebrow}>JOIN TRIPGENIUS</p>

          <h1>
            Create Your
            <span>Account</span>
          </h1>

          <p className={styles.auth_description}>
            Join TripGenius and start planning
            extraordinary trips with the power of AI
            and real travel experts.
          </p>

          <div className={styles.auth_features}>
            <div className={styles.auth_feature}>
              <div className={styles.auth_feature_icon}>
                <Zap size={29} />
              </div>

              <div>
                <h3>Personalized Itineraries</h3>
                <p>Trips tailored to your style</p>
              </div>
            </div>

            <div className={styles.auth_feature}>
              <div className={styles.auth_feature_icon}>
                <Crown size={29} />
              </div>

              <div>
                <h3>Exclusive Stays</h3>
                <p>Handpicked hotels and experiences</p>
              </div>
            </div>

            <div className={styles.auth_feature}>
              <div className={styles.auth_feature_icon}>
                <MapPin size={29} />
              </div>

              <div>
                <h3>Travel Smarter</h3>
                <p>Save time, discover more</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.auth_card}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AuthLayout;
