import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/HomePage.module.css";

const FeatureCard = ({ title, description }) => {
  return (
    <div className={styles.featureCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
};

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default FeatureCard;
