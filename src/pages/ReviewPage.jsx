import React from "react";
import ReviewHeader from "../components/ui/ReviewHeader";
import Footer from "../components/ui/Footer";
import styles from "../styles/ReviewPage.module.css";

const tipsData = [
  "Дихай глибоко: зроби 5 глибоких вдихів.",
  "Зроби перерву: пройдися 10 хвилин на свіжому повітрі.",
  "Запиши: випиши три речі, за які ти вдячний.",
  "Посміхнись: подивись смішне відео.",
];
const filmData = ["ФІЛЬМ 1", "ФІЛЬМ 2", "ФІЛЬМ 3", "ФІЛЬМ 4"];

const ReviewPage = () => {
  const handleSliderClick = (type, direction) => {
    alert(`Імітація прокрутки ${type}: ${direction}`);
  };

  return (
    <div className={styles.container}>
      <ReviewHeader currentPage="Огляд" />

      <main className={styles.mainContent}>
        <section className={styles.moodGraphSection}>
          <h2 className={styles.sectionTitle}>Графік настрою</h2>
          <div className={styles.graphPlaceholder}>
            <svg
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
              className={styles.moodGraph}
            >
              <polyline
                fill="none"
                stroke="#9775e0"
                strokeWidth="2"
                points="5,40 25,20 50,30 75,10 95,35"
              />
            </svg>
          </div>
        </section>

        <section className={styles.tipsSection}>
          <h2 className={styles.sectionTitle}>Поради для покращення стану</h2>
          <div className={styles.sliderContainer}>
            <button
              className={styles.sliderArrow}
              onClick={() => handleSliderClick("Поради", "Назад")}
            >
              &larr;
            </button>

            <div className={styles.tipsCards}>
              {tipsData.slice(0, 3).map((tip, index) => (
                <div key={index} className={styles.tipCard}>
                  {tip}
                </div>
              ))}
            </div>

            <button
              className={styles.sliderArrow}
              onClick={() => handleSliderClick("Поради", "Вперед")}
            >
              &rarr;
            </button>
          </div>
        </section>

        <section className={styles.filmsSection}>
          <h2 className={styles.sectionTitle}>
            Фільми, які піднімають настрій
          </h2>
          <div className={styles.sliderContainer}>
            <button
              className={styles.sliderArrow}
              onClick={() => handleSliderClick("Фільми", "Назад")}
            >
              &larr;
            </button>

            <div className={styles.filmCards}>
              {filmData.slice(0, 3).map((film, index) => (
                <div key={index} className={styles.filmCard}>
                  {film}
                </div>
              ))}
            </div>

            <button
              className={styles.sliderArrow}
              onClick={() => handleSliderClick("Фільми", "Вперед")}
            >
              &rarr;
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewPage;
