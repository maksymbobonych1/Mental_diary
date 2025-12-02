import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "../../styles/Header.module.css";

const ReviewHeader = ({ currentPage }) => {
  const navToPage = currentPage === "Огляд" ? "/main" : "/review";
  const navText = currentPage === "Огляд" ? "Головна сторінка" : "Огляд";

  const centerText = currentPage === "Main" ? "Головна" : currentPage;

  return (
    <header className={styles.header}>
      <Link to="/profile" className={styles.logoContainer}>
        <div className={styles.logo}>
          <div className={styles.logoPlaceholder}>🧠</div>
          <span className={styles.logoText}>Mental Diary</span>
        </div>
      </Link>

      <h1 className={styles.pageTitle}>{centerText}</h1>

      <nav className={styles.nav}>
        <Link to={navToPage} className={styles.reviewButton}>
          {navText}
        </Link>
        <Link
          to="/profile"
          className={styles.profileIconLink}
          aria-label="Перейти до профілю"
        >
          <div className={styles.profileIconPlaceholder}>🧠</div>
        </Link>
      </nav>
    </header>
  );
};

ReviewHeader.propTypes = {
  currentPage: PropTypes.string.isRequired,
};

export default ReviewHeader;
