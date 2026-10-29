import { ArrowRight, Compass } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import styles from './authLayout.module.scss';

export default function SiteHeader() {
  const signedIn = Boolean(localStorage.getItem('accessToken'));
  return (
    <header className={styles.auth_navbar}>
      <Link to="/" className={styles.auth_logo}>
        <span className={styles.auth_logo_icon}>✦</span>TripGenius
      </Link>
      <nav className={styles.auth_nav_links} aria-label="Main navigation">
        <NavLink to="/destinations">Destinations</NavLink>
        <Link to="/how-it-works">How It Works</Link>
      </nav>
      <div className={styles.auth_nav_actions}>
        <Link to={signedIn ? '/profile' : '/login'} className={styles.auth_nav_signin}>
          {signedIn ? 'My Profile' : 'Sign In'}
        </Link>
        <Link to="/destinations" className={styles.auth_plan_button}>
          <Compass size={18} /> Plan My Trip <ArrowRight size={18} />
        </Link>
      </div>
    </header>
  );
}
