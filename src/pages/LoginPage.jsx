import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../styles/LoginPage.module.css";
import LoginForm from "../components/ui/LoginForm";
import RegistrationForm from "../components/ui/RegistrationForm";

const LoginPage = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  return (
    <div className={styles.outerContainer}>
      <header className={styles.authHeader}>
        <h1 className={styles.headerTitle}>
          {isLoginView ? "Авторизація" : "Реєстрація"}
        </h1>
      </header>

      <main className={styles.mainContent}>
        {isLoginView ? (
          <LoginForm
            key="login-view"
            onLogin={onLogin}
            navigate={navigate}
            setIsLoginView={setIsLoginView}
            setError={setError}
            error={error}
          />
        ) : (
          <RegistrationForm
            key="register-view"
            setIsLoginView={setIsLoginView}
            setError={setError}
          />
        )}
      </main>
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
