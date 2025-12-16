import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Сторінку не знайдено.</p>
      <p className={styles.description}>
        На жаль, за цією адресою нічого немає.
      </p>
      <Link to="/" className={styles.homeLink}>
        Повернутися на Вступну сторінку
      </Link>
    </div>
  );
};

export default NotFoundPage;
