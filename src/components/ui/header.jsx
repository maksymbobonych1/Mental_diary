import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Header.module.css";

// HomePage
const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoContainer}>
        <div className={styles.logo}>
          <div className={styles.logoPlaceholder}>🧠</div>
          <span className={styles.logoText}>Mental Diary</span>
        </div>
      </Link>
      <nav className={styles.nav}>
        <Link
          to="/login"
          className={`${styles.navButton} ${styles.registerButton}`}
        >
          Register
        </Link>
        <Link
          to="/login"
          className={`${styles.navButton} ${styles.loginButton}`}
        >
          Log in
        </Link>
      </nav>
    </header>
  );
};

export default Header;
