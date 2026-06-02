import React from "react";
import styles from "./buildPanel.module.scss";

export type BuildType = "SETTLEMENT" | "STREET" | "TOWN" | null;

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
      <button
        className={`${styles.buildButton} ${selectedBuildType === "SETTLEMENT" ? styles.selected : ""}`}
        onClick={() => handleBuildSelect("SETTLEMENT")}
      >
        🏠 Settlement
      </button>
      <button
        className={`${styles.buildButton} ${selectedBuildType === "STREET" ? styles.selected : ""}`}
        onClick={() => handleBuildSelect("STREET")}
      >
        🛣️ Road
      </button>
      <button
        className={`${styles.buildButton} ${selectedBuildType === "TOWN" ? styles.selected : ""}`}
        onClick={() => handleBuildSelect("TOWN")}
      >
        🏛️ Town
      </button>
      <button
        className={styles.toggleButton}
        onClick={() => onShowHitboxes(!showHitboxes)}
      >
        {showHitboxes ? "Triggers Shown" : "Triggers Hidden"}
      </button>
    </div>
  );
};

export default BuildPanel;