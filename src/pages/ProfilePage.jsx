import React from "react";
import PropTypes from "prop-types";
import ProfileHeader from "../components/ui/ProfileHeader";
import Footer from "../components/ui/Footer";
import styles from "../styles/ProfilePage.module.css";

const mockEntries = [
  {
    date: "2025.03.01",
    mood: "🙂",
    text: "Сьогодні було все класно",
    tag: "Робота",
  },
  {
    date: "2025.02.07",
    mood: "😔",
    text: "Сьогодні було все погано",
    tag: "Сон",
  },
  {
    date: "2025.02.03",
    mood: "🙁",
    text: "Сьогодні було просто нормально",
    tag: "Стосунки",
  },
  {
    date: "2025.01.05",
    mood: "🙂",
    text: "Сьогодні було все добре",
    tag: "Робота",
  },
  {
    date: "2024.12.18",
    mood: "😐",
    text: "Звичайний день, без пригод",
    tag: "Сон",
  },
  {
    date: "2024.11.25",
    mood: "😊",
    text: "Дуже радісний день! Успіх!",
    tag: "Стосунки",
  },
];

const ProfilePage = ({ onLogout }) => {
  const handleAvatarChange = () =>
    alert("Імітація завантаження нової аватарки");
  const handleChangePassword = () => alert("Імітація зміни пароля");

  return (
    <div className={styles.container}>
      <ProfileHeader onLogout={onLogout} />

      <main className={styles.mainContent}>
        <section className={styles.profileInfoSection}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarPlaceholder}>👤</div>
            <button
              className={styles.changeAvatarButton}
              onClick={handleAvatarChange}
            >
              Змінити фото
            </button>
          </div>

          <div className={styles.detailsContainer}>
            <h2 className={styles.dataTitle}>Особисті дані</h2>

            <div className={styles.dataField}>
              <span className={styles.dataLabel}>Імя:</span>
              <span className={styles.dataValue}>Ivan</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>Прізвище:</span>
              <span className={styles.dataValue}>Bagrov</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>Email:</span>
              <span className={styles.dataValue}>ivan.bagrov@gmail.com</span>
            </div>

            <div className={styles.securityBlock}>
              <h3 className={styles.securityTitle}>Налаштування безпеки</h3>
              <button
                className={styles.changePasswordButton}
                onClick={handleChangePassword}
              >
                Змінити пароль
              </button>
            </div>
          </div>
        </section>

        <section className={styles.journalSection}>
          <h2 className={styles.journalTitle}>Журнал записів</h2>

          <div className={styles.journalListContainer}>
            {mockEntries.map((entry, index) => (
              <div key={index} className={styles.journalEntry}>
                <div className={styles.entryDetails}>
                  <span className={styles.entryDate}>{entry.date}</span>
                  <span className={styles.entryText}>{entry.text}</span>
                </div>
                <div className={styles.entryMetadata}>
                  <span className={styles.entryTag}>{entry.tag}</span>
                  <span className={styles.entryMood}>{entry.mood}</span>
                </div>
              </div>
            ))}
            <div className={styles.scrollEndPlaceholder}>Кінець історії</div>
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
