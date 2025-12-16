import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import ProfileHeader from "../components/ui/ProfileHeader";
import Footer from "../components/ui/Footer";
import styles from "../styles/ProfilePage.module.css";
import {
  useProfile,
  useDiaryEntries,
  useUpdateProfile,
  useUploadAvatar,
} from "../api/apiHooks";

const ChangePasswordForm = ({ onUpdate, isUpdating, onCancel }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Паролі не збігаються.");
      return;
    }
    if (newPassword.length < 5) {
      setError("Пароль має містити мінімум 5 символів.");
      return;
    }

    try {
      await onUpdate({ newPassword });
      setNewPassword("");
      setConfirmPassword("");
      onCancel();
    } catch (err) {
      setError(err.message || "Не вдалося оновити пароль.");
    }
  };

  return (
    <form className={styles.passwordForm} onSubmit={handleSubmit}>
      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
      <input
        className={styles.inputField}
        type="password"
        placeholder="Новий пароль"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={isUpdating}
        required
      />
      <input
        className={styles.inputField}
        type="password"
        placeholder="Підтвердіть пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isUpdating}
        required
      />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          type="submit"
          className={styles.changePasswordButton}
          disabled={isUpdating}
        >
          {isUpdating ? "Збереження..." : "Зберегти"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={styles.changeAvatarButton}
          style={{ border: "1px solid #ccc", color: "#ccc" }}
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
  const { profile, isLoading: isProfileLoading, refetch } = useProfile();
  const { entries, isLoading: isEntriesLoading } = useDiaryEntries();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const { uploadAvatar, isUploading } = useUploadAvatar();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const result = await uploadAvatar(file);

    if (result.success) {
      alert("Фото успішно оновлено!");
      refetch();
    } else {
      alert("Помилка завантаження: " + (result.error || "Невідома помилка"));
    }
  };

  const handleUpdatePassword = async (data) => {
    const result = await updateProfile({ newPassword: data.newPassword });

    if (result.success) {
      alert("Пароль успішно змінено!");
      return Promise.resolve();
    } else {
      alert("Помилка: " + result.error);
      return Promise.reject(new Error(result.error));
    }
  };

  if (isProfileLoading || isEntriesLoading) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "100px", color: "#fff" }}>
        Завантаження...
      </h1>
    );
  }

  if (!profile) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "100px", color: "#fff" }}>
        Помилка завантаження даних.
      </h1>
    );
  }

  const backendUrl = "http://localhost:3001";
  let displayAvatarUrl = profile.avatarUrl;
  if (profile.avatarUrl && profile.avatarUrl.startsWith("/uploads/")) {
    displayAvatarUrl = `${backendUrl}${profile.avatarUrl}`;
  }

  return (
    <div className={styles.container}>
      <ProfileHeader onLogout={onLogout} />

      <main className={styles.mainContent}>
        <section className={styles.profileInfoSection}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarPlaceholder}>
              {displayAvatarUrl ? (
                <img
                  src={displayAvatarUrl}
                  alt="Аватар"
                  className={styles.avatarImage}
                />
              ) : (
                "👤"
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <button
              className={styles.changeAvatarButton}
              onClick={handleAvatarButtonClick}
              disabled={isUploading}
            >
              {isUploading ? "Завантаження..." : "Змінити фото"}
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
