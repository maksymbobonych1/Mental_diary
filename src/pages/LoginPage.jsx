import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/LoginPage.module.css";

const LoginPage = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const action = isLoginView ? "Вхід" : "Реєстрація";
    alert(`Імітація відправки форми: ${action}`);

    if (isLoginView) {
      onLogin();
      navigate("/main");
    }
  };

  const LoginForm = () => (
    <>
      <h2 className={styles.formTitle}>Увійти у свій акаунт</h2>

      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="email"
          placeholder="Електронна пошта"
          aria-label="Електронна пошта"
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Пароль"
          aria-label="Пароль"
        />
      </div>

      <button className={styles.submitButton} type="submit">
        Увійти
      </button>

      <div className={styles.linksContainer}>
        <p className={styles.switchText} onClick={() => setIsLoginView(false)}>
          Немає акаунту? <span className={styles.link}>Створити новий</span>
        </p>
        <p className={styles.forgotPassword}>
          <span
            className={styles.link}
            onClick={() => alert("Імітація відновлення пароля")}
          >
            Забули пароль?
          </span>
        </p>
      </div>
    </>
  );

  const RegisterForm = () => (
    <>
      <h2 className={styles.formTitle}>Створення облікового запису</h2>

      <p className={styles.subtitle}>Впишіть свою особисту поштову скриньку</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="email"
          placeholder="Електронна пошта"
          aria-label="Електронна пошта"
        />
      </div>

      <p className={styles.subtitle}>Впишіть своє імя</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Ім'я"
          aria-label="Ім'я"
        />
      </div>

      <p className={styles.subtitle}>Впишіть своє прізвище</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Прізвище"
          aria-label="Прізвище"
        />
      </div>

      <p className={styles.subtitle}>Впишіть свій особистий пароль</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Пароль"
          aria-label="Пароль"
        />
      </div>

      <p className={styles.subtitle}>Впишіть свій особистий пароль знову</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Пароль"
          aria-label="Пароль знову"
        />
      </div>

      <button className={styles.submitButton} type="submit">
        Зареєструвати
      </button>

      <p className={styles.switchText} onClick={() => setIsLoginView(true)}>
        Вже є акаунт? <span className={styles.link}>Увійти</span>
      </p>
    </>
  );

  return (
    <div className={styles.outerContainer}>
      <header className={styles.authHeader}>
        <h1 className={styles.headerTitle}>
          {isLoginView ? "Авторизація" : "Реєстрація"}
        </h1>
      </header>

      <main className={styles.mainContent}>
        <form className={styles.authForm} onSubmit={handleFormSubmit}>
          {isLoginView ? <LoginForm /> : <RegisterForm />}
        </form>
      </main>
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
