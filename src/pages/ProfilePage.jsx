import React, { useState } from "react";
import PropTypes from "prop-types";
import ProfileHeader from "../components/ui/ProfileHeader";
import Footer from "../components/ui/Footer";
import styles from "../styles/ProfilePage.module.css";
import { useProfile, useDiaryEntries, useUpdateProfile } from "../api/apiHooks";

const ChangePasswordForm = ({ onUpdate, isUpdating, onCancel }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Новий пароль і підтвердження не збігаються.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Пароль має містити мінімум 6 символів.");
      return;
    }

    try {
      await onUpdate({ newPassword });
      onCancel();
    } catch (err) {
      setError(err.message || "Не вдалося оновити пароль. Спробуйте пізніше.");
    }
  };

  return (
    <form className={styles.passwordForm} onSubmit={handleSubmit}>
      {error && <p className={styles.formError}>{error}</p>}

      <input
        className={styles.inputField}
        type="password"
        placeholder="Новий пароль (мін. 6 символів)"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={isUpdating}
        required
      />
      <input
        className={styles.inputField}
        type="password"
        placeholder="Підтвердіть новий пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isUpdating}
        required
      />
      <div className={styles.formActions}>
        <button
          type="submit"
          disabled={isUpdating}
          className={styles.submitPasswordButton}
        >
          {isUpdating ? "Оновлення..." : "Зберегти пароль"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Скасувати
        </button>
      </div>
    </form>
  );
};
ChangePasswordForm.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const ProfilePage = ({ onLogout }) => {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { entries, isLoading: isEntriesLoading } = useDiaryEntries();
  const { updateProfile, isUpdating } = useUpdateProfile();

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleAvatarChange = async () => {
    alert("Імітація зміни аватарки. Виконуємо PATCH-запит...");

    const result = await updateProfile({ avatarUrl: "new/path/to/avatar.png" });

    if (result.success) {
      alert(
        "Аватарку оновлено! (В реальному проєкті потрібне перезавантаження даних)"
      );
    } else {
      alert("Помилка оновлення аватарки.");
    }
  };

  const handleUpdatePassword = async (data) => {
    const result = await updateProfile({ newPassword: data.newPassword });

    if (result.success) {
      alert("Пароль успішно змінено!");
      return Promise.resolve();
    } else {
      return Promise.reject(new Error(result.error));
    }
  };

  if (isProfileLoading || isEntriesLoading) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>
        Завантаження даних профілю...
      </h1>
    );
  }

  if (!profile) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>
        Помилка завантаження даних користувача.
      </h1>
    );
  }

  return (
    <div className={styles.container}>
      <ProfileHeader onLogout={onLogout} />

      <main className={styles.mainContent}>
        <section className={styles.profileInfoSection}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarPlaceholder}>
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Аватар користувача"
                  className={styles.avatarImage}
                />
              ) : (
                "👤"
              )}
            </div>
            <button
              className={styles.changeAvatarButton}
              onClick={handleAvatarChange}
              disabled={isUpdating}
            >
              Змінити фото
            </button>
          </div>

          <div className={styles.detailsContainer}>
            <h2 className={styles.dataTitle}>Особисті дані</h2>

            <div className={styles.dataField}>
              <span className={styles.dataLabel}>Імя:</span>
              <span className={styles.dataValue}>{profile.name}</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>Прізвище:</span>
              <span className={styles.dataValue}>{profile.surname}</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>Email:</span>
              <span className={styles.dataValue}>{profile.email}</span>
            </div>

            <div className={styles.securityBlock}>
              <h3 className={styles.securityTitle}>Налаштування безпеки</h3>

              {!showPasswordForm ? (
                <button
                  className={styles.changePasswordButton}
                  onClick={() => setShowPasswordForm(true)}
                  disabled={isUpdating}
                >
                  Змінити пароль
                </button>
              ) : (
                <ChangePasswordForm
                  onUpdate={handleUpdatePassword}
                  isUpdating={isUpdating}
                  onCancel={() => setShowPasswordForm(false)}
                />
              )}
            </div>
          </div>
        </section>

        <section className={styles.journalSection}>
          <h2 className={styles.journalTitle}>Журнал записів</h2>

          <div className={styles.journalListContainer}>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry.id} className={styles.journalEntry}>
                  <div className={styles.entryDetails}>
                    <span className={styles.entryDate}>{entry.date}</span>
                    <span className={styles.entryText}>{entry.text}</span>
                  </div>
                  <div className={styles.entryMetadata}>
                    <span className={styles.entryTag}>{entry.tag}</span>
                    <span className={styles.entryMood}>{entry.mood}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.scrollEndPlaceholder}>
                Записів поки немає.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

ProfilePage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ProfilePage;
