import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/LoginPage.module.css";
import { useRegister } from "../../api/apiHooks";

const RegistrationForm = ({
  setIsLoginView,
  setError,
  isSubmitting: isPageSubmitting,
  testRegister,
}) => {
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regSurname, setRegSurname] = useState("");
  const [regPassword1, setRegPassword1] = useState("");
  const [regPassword2, setRegPassword2] = useState("");

  const { isRegistering, register: realRegister } = useRegister();
  const register = testRegister || realRegister;
  const isDisabled = isPageSubmitting || isRegistering;

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (setError) setError("");

    if (
      !regEmail.trim() ||
      !regPassword1.trim() ||
      !regName.trim() ||
      !regSurname.trim()
    ) {
      if (setError) setError("Будь ласка, заповніть усі поля.");
      return;
    }
    if (regPassword1 !== regPassword2) {
      if (setError) setError("Паролі не збігаються!");
      return;
    }

    const userData = {
      email: regEmail.trim(),
      password: regPassword1.trim(),
      name: regName.trim(),
      surname: regSurname.trim(),
    };
    const regResult = await register(userData);

    if (regResult.success) {
      alert("Реєстрація успішна!");
      setIsLoginView(true);
    } else {
      if (setError) setError(regResult.error || "Помилка реєстрації.");
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleRegistrationSubmit}>
      <h2 className={styles.formTitle}>Створення облікового запису</h2>
      <p className={styles.subtitle}>Впишіть свою особисту поштову скриньку</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="email"
          placeholder="Електронна пошта"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <p className={styles.subtitle}>Впишіть своє імя</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Ім'я"
          value={regName}
          onChange={(e) => setRegName(e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <p className={styles.subtitle}>Впишіть своє прізвище</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Прізвище"
          value={regSurname}
          onChange={(e) => setRegSurname(e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <p className={styles.subtitle}>Впишіть свій особистий пароль</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Пароль"
          value={regPassword1}
          onChange={(e) => setRegPassword1(e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <p className={styles.subtitle}>Впишіть свій особистий пароль знову</p>
      <div className={styles.inputGroup}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Пароль знову"
          value={regPassword2}
          onChange={(e) => setRegPassword2(e.target.value)}
          disabled={isDisabled}
        />
      </div>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isDisabled}
      >
        {isRegistering ? "Реєстрація..." : "Зареєструвати"}
      </button>
      <p
        className={styles.switchText}
        onClick={() => {
          setIsLoginView(true);
          if (setError) setError("");
        }}
      >
        Вже є акаунт? <span className={styles.link}>Увійти</span>
      </p>
    </form>
  );
};

RegistrationForm.propTypes = {
  setIsLoginView: PropTypes.func.isRequired,
  setError: PropTypes.func,
  isSubmitting: PropTypes.bool,
  testRegister: PropTypes.func,
};

export default RegistrationForm;
