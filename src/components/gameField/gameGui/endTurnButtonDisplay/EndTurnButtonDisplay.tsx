import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import styles from "./EndTurnButtonDisplay.module.scss";
import DiceContainer from "../dice/DiceContainer";
import { useAuth, useGame } from "@/contexts/contexts";

type EndTurnButtonDisplayProps = {
    rolledSides: number[];
    animationTrigger: number;
    hideBoxedDices: boolean;
}

const EndTurnButtonDisplay: React.FC<EndTurnButtonDisplayProps> = ({ rolledSides, animationTrigger, hideBoxedDices }) => {
  const isMyTurn = useIsMyTurn();
  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();

  const nextPlayer = () => fetchWithAuth(`/games/${uuid}/endTurn`, "POST");

  return (
    <div className={styles["endTurnButtonDisplay"]}>
      <div style={{ visibility: hideBoxedDices ? "hidden" : "visible" }}>
        <DiceContainer className={styles["endTurnButtonDisplay__diceContainer"]} rolledSides={rolledSides} animationTrigger={animationTrigger} currentDiceSide={"boxed"} />
      </div>
            
      <button onClick={nextPlayer} disabled={!isMyTurn} className={`${styles["endTurnButtonDisplay__endTurnButton"]} ${isMyTurn ? styles["endTurnButtonDisplay__endTurnButton--active"] : styles["endTurnButtonDisplay__endTurnButton--inactive"]}`}>End Turn</button>
    </div>
  );
};

export default EndTurnButtonDisplay;