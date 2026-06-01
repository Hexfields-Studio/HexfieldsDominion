import React from "react";
import styles from "./BuildPanel.module.scss";

export type BuildType = "house" | "road" | "big_house" | null;

interface BuildPanelProps {
  isMyTurn: boolean;
  selectedBuildType: BuildType;
  onSelectBuildType: (type: BuildType) => void;
  onShowHitboxes: (show: boolean) => void;
  showHitboxes: boolean;
}

const BuildPanel: React.FC<BuildPanelProps> = ({
  isMyTurn,
  selectedBuildType,
  onSelectBuildType,
  onShowHitboxes,
  showHitboxes,
}) => {
  if (!isMyTurn) return null;

  const handleBuildSelect = (type: BuildType) => {
    if (selectedBuildType === type) {
      onSelectBuildType(null);
    } else {
      onSelectBuildType(type);
      onShowHitboxes(true);
    }
  };

  return (
    <div className={styles.buildPanel}>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.buildButton} ${selectedBuildType === "house" ? styles.selected : ""}`}
          onClick={() => handleBuildSelect("house")}
        >
          <span className={styles.icon}>🏠</span>
          <span className={styles.label}>House</span>
        </button>
        <button
          className={`${styles.buildButton} ${selectedBuildType === "road" ? styles.selected : ""}`}
          onClick={() => handleBuildSelect("road")}
        >
          <span className={styles.icon}>🛣️</span>
          <span className={styles.label}>Road</span>
        </button>
        <button
          className={`${styles.buildButton} ${selectedBuildType === "big_house" ? styles.selected : ""}`}
          onClick={() => handleBuildSelect("big_house")}
        >
          <span className={styles.icon}>🏛️</span>
          <span className={styles.label}>Big House</span>
        </button>
      </div>
      
      <button
        className={styles.toggleButton}
        onClick={() => onShowHitboxes(!showHitboxes)}
        title={showHitboxes ? "Hide hitboxes" : "Show hitboxes"}
      >
        {showHitboxes ? "👁️" : "👁️‍🗨️"}
      </button>
    </div>
  );
};

export default BuildPanel;