import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/LoginPage.module.css";
import { useAuth } from "../../api/apiHooks";

const LoginForm = ({
  onLogin,
  navigate,
  setIsLoginView,
  setError,
  testLogin,
}) => {
  const [email, setEmail] = useState("test@mail.com");
  const [password, setPassword] = useState("12345");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login: realLogin } = useAuth();
  const login = testLogin || realLogin;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (setError) setError("");

    if (!email.trim() || !password.trim()) {
      setLocalError("Будь ласка, заповніть усі обов'язкові поля.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password.trim());
    setIsSubmitting(false);

    if (result.success) {
      onLogin();
      navigate("/main");
    } else {
      setLocalError(result.error || "Невідома помилка входу.");
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleFormSubmit}>
      <h2 className={styles.formTitle}>Увійти у свій акаунт</h2>
      {localError && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
          {localError}
        </p>
      )}

      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="email"
          placeholder="Електронна пошта"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type={showPassword ? "text" : "password"}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="button"
          className={styles.togglePasswordButton}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "👁️" : "🔒"}
        </button>
      </div>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Вхід..." : "Увійти"}
      </button>

      <div className={styles.linksContainer}>
        <p
          className={styles.switchText}
          onClick={() => {
            setIsLoginView(false);
            setLocalError("");
            if (setError) setError("");
          }}
        >
          Немає акаунту? <span className={styles.link}>Створити новий</span>
        </p>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  setIsLoginView: PropTypes.func.isRequired,
  setError: PropTypes.func,
  testLogin: PropTypes.func,
};

export default LoginForm;
