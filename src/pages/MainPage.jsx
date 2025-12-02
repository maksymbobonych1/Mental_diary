import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ReviewHeader from "../components/ui/ReviewHeader";
import Footer from "../components/ui/Footer";
import styles from "../styles/MainPage.module.css";
import { usePostEntry, useDiaryEntries } from "../api/apiHooks";
import { toLocalISODate } from "../../src/features/DateUtils";

const moods = ["😔", "🙁", "😐", "🙂", "😊"];
const tags = ["Робота", "Сон", "Стосунки", "Навчання", "Спорт"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

const MONTHS = [
  { name: "Січень", num: "01" },
  { name: "Лютий", num: "02" },
  { name: "Березень", num: "03" },
  { name: "Квітень", num: "04" },
  { name: "Травень", num: "05" },
  { name: "Червень", num: "06" },
  { name: "Липень", num: "07" },
  { name: "Серпень", num: "08" },
  { name: "Вересень", num: "09" },
  { name: "Жовтень", num: "10" },
  { name: "Листопад", num: "11" },
  { name: "Грудень", num: "12" },
];

const getDaysInMonth = (year, monthNum) => {
  const monthIndex = parseInt(monthNum, 10) - 1;
  return new Date(year, monthIndex + 1, 0).getDate();
};

const CalendarCell = ({ dateString, entryData, isSelected, onClick }) => {
  const hasEntry = entryData.id;
  const dayOfMonth = dateString.split("-").pop();

  return (
    <div
      className={`${styles.calendarCell} ${hasEntry ? styles.calendarCellActive : ""} ${isSelected ? styles.calendarCellSelected : ""}`}
      onClick={onClick}
    >
      <span
        style={{
          fontSize: "0.8rem",
          position: "absolute",
          top: "5px",
          color: hasEntry ? "black" : "#ccc",
        }}
      >
        {dayOfMonth}
      </span>
      {hasEntry && (
        <div
          className={styles.calendarDot}
          style={{ backgroundColor: hasEntry ? "#9775e0" : "transparent" }}
        />
      )}
    </div>
  );
};

const EntryDetails = ({ entry }) => {
  if (!entry)
    return (
      <div className={styles.detailsBlock}>
        <p className={styles.detailsMessage}>
          Натисніть на день у календарі, щоб побачити запис, або створіть новий.
        </p>
      </div>
    );

  return (
    <div className={styles.detailsBlock}>
      <h3 className={styles.detailsTitle}>Запис за {entry.date}</h3>
      <p className={styles.detailsText}>{entry.text}</p>
      <div className={styles.detailsFooter}>
        <span className={styles.detailsTag}>{entry.tag}</span>
        <span className={styles.detailsMood}>{entry.mood}</span>
      </div>
    </div>
  );
};

CalendarCell.propTypes = {
  dateString: PropTypes.string.isRequired,
  entryData: PropTypes.object,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};

EntryDetails.propTypes = {
  entry: PropTypes.object,
};

const MainPage = () => {
  const [mood, setMood] = useState("😐");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const currentMonthNum = String(new Date().getMonth() + 1).padStart(2, "0");
  const [currentMonth, setCurrentMonth] = useState(currentMonthNum);
  const [currentYear, setCurrentYear] = useState(CURRENT_YEAR.toString());
  const [selectedDate, setSelectedDate] = useState(null);

  const { isPosting, postEntry } = usePostEntry();
  const { entries, isLoading: isEntriesLoading, refetch } = useDiaryEntries();

  const calendarDays = useMemo(() => {
    const year = parseInt(currentYear, 10);
    const daysInMonth = getDaysInMonth(year, currentMonth);

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateString = `${currentYear}-${currentMonth}-${String(dayNum).padStart(2, "0")}`;
      const entry = entries.find((e) => e.date === dateString);
      return { dateString, entry: entry || {} };
    });
    return days;
  }, [currentYear, currentMonth, entries]);

  const entriesForSelectedDate = entries.filter((e) => e.date === selectedDate);

  const handleSave = async () => {
    if (!description.trim() || !mood) {
      alert("Будь ласка, оберіть настрій та опишіть свій день.");
      return;
    }

    const todayDateString = toLocalISODate(new Date());

    const newEntry = {
      mood: mood,
      text: description,
      tag: selectedTags.join(", "),
      date: todayDateString,
    };

    const result = await postEntry(newEntry);
    if (result.success) {
      alert("Запис успішно збережено!");
      setDescription("");
      setSelectedTags([]);

      refetch();
      setSelectedDate(todayDateString);
    } else {
      alert("Помилка збереження запису.");
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className={styles.container}>
      <ReviewHeader currentPage="Головна" />

      <main className={styles.mainContent}>
        <section className={styles.entrySection}>
          <h2 className={styles.sectionTitle}>Як ти сьогодні почуваєшся?</h2>

          <div className={styles.moodSelector}>
            {moods.map((m, index) => (
              <button
                key={index}
                className={`${styles.moodButton} ${m === mood ? styles.moodButtonActive : ""}`}
                onClick={() => setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <textarea
            className={styles.descriptionInput}
            placeholder="Опишіть свій день..."
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className={styles.tagSelector}>
            {tags.map((tag, index) => (
              <button
                key={index}
                className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.tagButtonActive : ""}`}
                onClick={() => toggleTag(tag)}
                disabled={isPosting}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isPosting}
          >
            {isPosting ? "Збереження..." : "Зберегти запис"}
          </button>

          <div className={styles.currentEntryDetails}>
            <h2 className={styles.sectionTitle}>
              Перегляд запису ({selectedDate})
            </h2>

            {entriesForSelectedDate.length > 0 ? (
              entriesForSelectedDate.map((entry) => (
                <EntryDetails key={entry.id} entry={entry} />
              ))
            ) : (
              <div className={styles.detailsBlock}>
                <p className={styles.detailsMessage}>
                  Натисніть на день у календарі, щоб побачити запис, або
                  створіть новий.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className={styles.calendarSection}>
          <div className={styles.calendarControls}>
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className={styles.calendarSelect}
            >
              {MONTHS.map((m) => (
                <option key={m.num} value={m.num}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              className={styles.calendarSelect}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <h2 className={styles.sectionTitle}>Календар</h2>

          {isEntriesLoading ? (
            <p style={{ textAlign: "center", color: "#5d48a0" }}>
              Завантаження календаря...
            </p>
          ) : (
            <div className={styles.calendarGrid}>
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => (
                <div key={day} className={styles.calendarDayHeader}>
                  {day}
                </div>
              ))}

              {calendarDays.map(({ dateString, entry }) => {
                return (
                  <CalendarCell
                    key={dateString}
                    dateString={dateString}
                    entryData={entry}
                    isSelected={dateString === selectedDate}
                    onClick={() => setSelectedDate(dateString)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
