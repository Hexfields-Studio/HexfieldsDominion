import { useAuth, useGame } from "@/contexts/contexts";
import styles from "./PointsDisplay.module.scss";
import { useMyPoints } from "@/hooks/matchHooks/useMyPoints";

const PointsDisplay: React.FC = () => {
  const myPoints = useMyPoints();
  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();

  // temporary to test updating
  const addPoint = () => fetchWithAuth(`/games/${uuid}/addPoint`, "POST");

  return (
    <>
      <div className={styles["pointsDisplay"]}>
        <p onClick={addPoint} className={styles["pointsDisplay__text"]}>{`Siegpunkte: ${myPoints}`}</p>
      </div>
    </>
  );
};

export default PointsDisplay;