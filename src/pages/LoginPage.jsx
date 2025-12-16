import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/LoginPage.module.css";
import { useAuth } from "../api/apiHooks";

const LoginPage = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const [email, setEmail] = useState("test@mail.com");
  const [password, setPassword] = useState("12345");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoginView) {
      alert(
        "Імітація реєстрації. Для входу використовуйте test@mail.com та 12345"
      );
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Будь ласка, заповніть усі поля.");
      return;
    }

    setIsSubmitting(true);

    const result = await login(email, password);

    setIsSubmitting(false);

    if (result.success) {
      onLogin();
      navigate("/main");
    } else {
      setError(result.error);
    }
  };

  const LoginForm = () => (
    <>
      <h2 className={styles.formTitle}>Увійти у свій акаунт</h2>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
          {error}
        </p>
      )}

      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="email"
          placeholder="Електронна пошта"
          aria-label="Електронна пошта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Пароль"
          aria-label="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Вхід..." : "Увійти"}
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
          autoComplete="email"
        />
      </div>

      <p className={styles.subtitle}>Впишіть своє імя</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Ім'я"
          aria-label="Ім'я"
          autoComplete="given-name"
        />
      </div>

      <p className={styles.subtitle}>Впишіть своє прізвище</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Прізвище"
          aria-label="Прізвище"
          autoComplete="family-name"
        />
      </div>

      <p className={styles.subtitle}>Впишіть свій особистий пароль</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Пароль"
          aria-label="Пароль"
          autoComplete="new-password"
        />
      </div>

      <p className={styles.subtitle}>Впишіть свій особистий пароль знову</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Пароль"
          aria-label="Пароль знову"
          autoComplete="new-password"
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
