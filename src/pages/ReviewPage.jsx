import React, { useState, useMemo } from "react";
import ReviewHeader from "../components/ui/ReviewHeader";
import Footer from "../components/ui/Footer";
import styles from "../styles/ReviewPage.module.css";
import { useDiaryEntries, useContent } from "../api/apiHooks";

const ITEMS_PER_SLIDE = 3;

const ReviewPage = () => {
  const {
    entries,
    moodGraphData,
    isLoading: isEntriesLoading,
  } = useDiaryEntries();
  const { content, isLoading: isContentLoading } = useContent();

  const [tipSlide, setTipSlide] = useState(0);
  const [filmSlide, setFilmSlide] = useState(0);

  const isLoading = isEntriesLoading || isContentLoading;

  const handleSlide = (type, direction) => {
    const data = type === "tips" ? content.tips : content.films;
    const currentSlide = type === "tips" ? tipSlide : filmSlide;
    const totalSlides = Math.ceil(data.length / ITEMS_PER_SLIDE);

    let newSlide = currentSlide + direction;

    if (newSlide < 0) {
      newSlide = totalSlides - 1;
    } else if (newSlide >= totalSlides) {
      newSlide = 0;
    }

    if (type === "tips") {
      setTipSlide(newSlide);
    } else {
      setFilmSlide(newSlide);
    }
  };

  const tipsToShow = useMemo(() => {
    const start = tipSlide * ITEMS_PER_SLIDE;
    return content.tips.slice(start, start + ITEMS_PER_SLIDE);
  }, [content.tips, tipSlide]);

  const filmsToShow = useMemo(() => {
    const start = filmSlide * ITEMS_PER_SLIDE;
    return content.films.slice(start, start + ITEMS_PER_SLIDE);
  }, [content.films, filmSlide]);

  // ЛОГІКА ГРАФІКА
  const svgPoints = useMemo(() => {
    if (!moodGraphData || moodGraphData.length === 0) {
      return "0,25 100,25";
    }

    const dataLength = moodGraphData.length;

    return moodGraphData
      .map((d, index) => {
        const x = dataLength === 1 ? 50 : (index / (dataLength - 1)) * 100;

        const y = 50 - d.moodValue * 10;

        return `${x},${y}`;
      })
      .join(" ");
  }, [moodGraphData]);

  const xAxisLabels = useMemo(() => {
    if (!moodGraphData || moodGraphData.length === 0) return [];

    const dataLength = moodGraphData.length;

    return moodGraphData.map((d, index) => {
      const x = dataLength === 1 ? 50 : (index / (dataLength - 1)) * 100;
      const label = d.date ? d.date.slice(5) : index + 1;

      return { x: x, label: label };
    });
  }, [moodGraphData]);

  if (isLoading) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>
        Завантаження даних огляду...
      </h1>
    );
  }

  return (
    <div className={styles.container}>
      <ReviewHeader currentPage="Огляд" />

      <main className={styles.mainContent}>
        {/* Графік Настрою */}
        <section className={styles.moodGraphSection}>
          <h2 className={styles.sectionTitle}>
            Графік настрою за останні {moodGraphData.length} днів
          </h2>

          <div className={styles.graphPlaceholder}>
            <svg
              viewBox="-5 0 105 54.5"
              preserveAspectRatio="none"
              className={styles.moodGraph}
            >
              {[5, 4, 3, 2, 1].map((moodValue) => {
                const y = 50 - moodValue * 10;
                return (
                  <g key={moodValue}>
                    <line
                      x1="0"
                      y1={y}
                      x2="100"
                      y2={y}
                      stroke="#c9c3ff"
                      strokeDasharray="1,2"
                      strokeWidth="0.3"
                    />
                    <text
                      x="-1.5"
                      y={y + 1.5}
                      fontSize="3"
                      fill="#5d48a0"
                      textAnchor="end"
                    >
                      {moodValue}
                    </text>
                  </g>
                );
              })}

              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke="#5d48a0"
                strokeWidth="0.5"
              />

              {moodGraphData.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#5d48a0"
                  strokeWidth="0.7"
                  points={svgPoints}
                />
              )}

              {xAxisLabels.map((p, index) => (
                <text
                  key={index}
                  x={p.x}
                  y="53"
                  fontSize="3.5"
                  fill="#5d48a0"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              ))}
            </svg>
          </div>
        </section>

        {/* Поради */}
        <section className={styles.tipsSection}>
          <h2 className={styles.sectionTitle}>Поради для покращення стану</h2>
          <div className={styles.sliderContainer}>
            <button
              className={styles.sliderArrow}
              onClick={() => handleSlide("tips", -1)}
            >
              &larr;
            </button>

            <div className={styles.tipsCards}>
              {tipsToShow.map((tip) => (
                <div key={tip.id} className={styles.tipCard}>
                  {tip.text}
                </div>
              ))}
            </div>

            <button
              className={styles.sliderArrow}
              onClick={() => handleSlide("tips", 1)}
            >
              &rarr;
            </button>
          </div>
        </section>

        {/* Фільми */}
        <section className={styles.filmsSection}>
          <h2 className={styles.sectionTitle}>
            Фільми, які піднімають настрій
          </h2>
          <div className={styles.sliderContainer}>
            <button
              className={styles.sliderArrow}
              onClick={() => handleSlide("films", -1)}
            >
              &larr;
            </button>

            <div className={styles.filmCards}>
              {filmsToShow.map((film) => (
                <div key={film.id} className={styles.filmCard}>
                  {film.image_url ? (
                    <img
                      src={film.image_url}
                      alt={film.title}
                      className={styles.filmPoster}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {film.title}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              className={styles.sliderArrow}
              onClick={() => handleSlide("films", 1)}
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
