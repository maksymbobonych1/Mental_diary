import React from "react";
import PropTypes from "prop-types";
import ReviewHeader from "../components/ui/ReviewHeader";
import Footer from "../components/ui/Footer";
import styles from "../styles/MainPage.module.css";

const moods = ["😔", "🙁", "😐", "🙂", "😊"];
const tags = ["Робота", "Сон", "Стосунки", "Навчання", "Спорт"];
const calendarDots = [
  { day: 7, color: "#9775e0" },
  { day: 15, color: "#9775e0" },
  { day: 20, color: "#9775e0" },
  { day: 24, color: "#9775e0" },
  { day: 29, color: "#9775e0" },
];

const CalendarCell = ({ day }) => {
  const dot = calendarDots.find((d) => d.day === day);
  return (
    <div className={styles.calendarCell}>
      {dot && (
        <div
          className={styles.calendarDot}
          style={{ backgroundColor: dot.color }}
        />
      )}
    </div>
  );
};

CalendarCell.propTypes = {
  day: PropTypes.number.isRequired,
};

const MainPage = () => {
  const handleSave = () => {
    alert("Запис збережено! (Без бізнес-логіки)");
  };

  const calendarCells = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      <ReviewHeader currentPage="Головна" />

      <main className={styles.mainContent}>
        <section className={styles.entrySection}>
          <h2 className={styles.sectionTitle}>Як ти сьогодні почуваєшся?</h2>

          <div className={styles.moodSelector}>
            {moods.map((mood, index) => (
              <button key={index} className={styles.moodButton}>
                {mood}
              </button>
            ))}
          </div>

          <textarea
            className={styles.descriptionInput}
            placeholder="Опишіть свій день..."
            rows="5"
          />

          <div className={styles.tagSelector}>
            {tags.map((tag, index) => (
              <button key={index} className={styles.tagButton}>
                {tag}
              </button>
            ))}
          </div>

          <button className={styles.saveButton} onClick={handleSave}>
            Зберегти запис
          </button>
        </section>

        <section className={styles.calendarSection}>
          <h2 className={styles.sectionTitle}>Календар</h2>
          <div className={styles.calendarGrid}>
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => (
              <div key={day} className={styles.calendarDayHeader}></div>
            ))}

            {calendarCells.map((day) => (
              <CalendarCell key={day} day={day} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
