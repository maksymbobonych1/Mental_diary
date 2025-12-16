import React from "react";
import Header from "../components/ui/header";
import Footer from "../components/ui/Footer";
import FeatureCard from "../components/ui/FeatureCard";
import styles from "../styles/HomePage.module.css";

const featuresData = [
  {
    title: "Приватність",
    description:
      "Це буде ваш особистий спосіб розказати про щось, залишивши це в секреті",
  },
  {
    title: "Допомога",
    description:
      "Ведення щоденника допоможе виговоритись, зменшити стресс та покращити ментальне здоров'я",
  },
  {
    title: "Різноманітність",
    description:
      "Ми надамо вам різноманітні інструменти для покращення ментального стану",
  },
  {
    title: "Прогрес",
    description:
      "Ви зможете самостійно побачити зміни у своєму настрої та через наш сайт",
  },
];

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Mental diary: Персональний щоденник
          </h1>
          <p className={styles.heroSubtitle}>
            Створіть свій особистий онлайн щоденник який допоможе вам
          </p>
        </section>
        <section className={styles.features}>
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
