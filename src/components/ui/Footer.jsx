import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.contactSection}>
          <h4 className={styles.sectionTitle}>Контакти</h4>
          <p>Телефон: +38 (066) 214-95-03</p>
          <p>Email: bobonych.maksym@student.uzhnu.edu.ua</p>
          <p>Адреса: смт.Міжгіря, вул. Шевченка, 1</p>
        </div>

        <div className={styles.navSection}>
          <h4 className={styles.sectionTitle}>Про проєкт</h4>
          <ul>
            <li>
              <Link to="/review" className={styles.footerLink}>
                Огляд
              </Link>
            </li>
            <li>
              <Link to="/login" className={styles.footerLink}>
                Авторизація
              </Link>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Умови використання
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Політика конфіденційності
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Mental Diary. Всі права захищено.
      </div>
    </footer>
  );
};

export default Footer;
