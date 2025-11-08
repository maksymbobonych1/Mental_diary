import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../styles/Header.module.css";

const ProfileHeader = ({ onLogout }) => {
  return (
    <header className={styles.header}>
      {/* Логотип веде на Головну MainPage */}
      <Link to="/main" className={styles.logoContainer}>
        <div className={styles.logo}>
          <div className={styles.logoPlaceholder}>🧠</div>
          <span className={styles.logoText}>Mental Diary</span>
        </div>
      </Link>

      <h1 className={styles.pageTitle}>Профіль</h1>

      <nav className={styles.nav}>
        {/* Кнопка Головна сторінка */}
        <Link
          to="/main"
          className={styles.reviewButton}
          style={{ marginRight: "10px" }}
        >
          Головна сторінка
        </Link>
        {/* Кнопка Вихід */}
        <Link
          to="/"
          className={`${styles.navButton} ${styles.logoutButton}`}
          onClick={onLogout}
        >
          Вихід
        </Link>
      </nav>
    </header>
  );
};

ProfileHeader.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ProfileHeader;
