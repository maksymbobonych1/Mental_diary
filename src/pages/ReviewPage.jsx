import React, { useState, useMemo } from "react";
import ReviewHeader from "../components/ui/ReviewHeader";
import Footer from "../components/ui/Footer";
import styles from "../styles/ReviewPage.module.css";
import { useDiaryEntries, useContent } from "../api/apiHooks";

const ITEMS_PER_SLIDE = 3;

const ReviewPage = () => {
  const { moodGraphData, isLoading: isEntriesLoading } = useDiaryEntries();
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
    return content.tips
      ? content.tips.slice(start, start + ITEMS_PER_SLIDE)
      : [];
  }, [content.tips, tipSlide]);

  const filmsToShow = useMemo(() => {
    const start = filmSlide * ITEMS_PER_SLIDE;
    return content.films
      ? content.films.slice(start, start + ITEMS_PER_SLIDE)
      : [];
  }, [content.films, filmSlide]);

  const svgPathData = useMemo(() => {
    if (!moodGraphData || moodGraphData.length === 0) {
      return "M0,50 L100,50";
    }

    const dataLength = moodGraphData.length;

    const linePath = moodGraphData
      .map((d, index) => {
        const x = dataLength === 1 ? 50 : (index / (dataLength - 1)) * 100;
        const y = 50 - d.moodValue * 10;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

    const areaPath = `${linePath} L100,50 L0,50 Z`;

    return areaPath;
  }, [moodGraphData]);

  const svgPoints = useMemo(() => {
    if (!moodGraphData || moodGraphData.length === 0) {
      return "0,50 100,50";
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
      const label = d.date ? d.date.slice(8, 10) : index + 1;
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
        <section className={styles.moodGraphSection}>
          <h2 className={styles.sectionTitle}>
            Графік настрою за останні {moodGraphData.length} днів
          </h2>

          <div className={styles.graphPlaceholder}>
            <svg
              viewBox="-10 -5 120 65"
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
                      stroke="#e0e0e0"
                      strokeWidth="0.5"
                    />
                    <text
                      x="-3"
                      y={y + 1.5}
                      fontSize="3"
                      fill="#666666"
                      textAnchor="end"
                    >
                      {moodValue}
                    </text>
                  </g>
                );
              })}

              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="50"
                  stroke="#f0f0f0"
                  strokeWidth="0.5"
                />
              ))}

              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke="#cccccc"
                strokeWidth="1"
              />

              {moodGraphData.length > 0 && (
                <path
                  d={svgPathData}
                  fill="rgba(74, 144, 226, 0.15)"
                  stroke="none"
                />
              )}

              {moodGraphData.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#4a90e2"
                  strokeWidth="1"
                  points={svgPoints}
                />
              )}

              {xAxisLabels.map((p, index) => {
                const showLabel =
                  index === 0 ||
                  (index + 1) % 5 === 0 ||
                  index === xAxisLabels.length - 1;

                if (!showLabel) return null;

                return (
                  <React.Fragment key={index}>
                    <line
                      x1={p.x}
                      y1="50"
                      x2={p.x}
                      y2="52"
                      stroke="#999"
                      strokeWidth="0.5"
                    />
                    <text
                      x={p.x}
                      y="58"
                      fontSize="3"
                      fill="#666666"
                      textAnchor="middle"
                    >
                      {p.label}
                    </text>
                  </React.Fragment>
                );
              })}
            </svg>
          </div>
        </section>

        <section className={styles.tipsSection}>
          <h2 className={styles.sectionTitle}>Поради для покращення стану</h2>
          <div className={styles.sliderContainer}>
            <button
              className={styles.sliderArrow}
              onClick={() => handleSlide("tips", -1)}
              disabled={!content.tips || content.tips.length <= ITEMS_PER_SLIDE}
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
              disabled={!content.tips || content.tips.length <= ITEMS_PER_SLIDE}
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
              onClick={() => handleSlide("films", -1)}
              disabled={
                !content.films || content.films.length <= ITEMS_PER_SLIDE
              }
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
              disabled={
                !content.films || content.films.length <= ITEMS_PER_SLIDE
              }
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
