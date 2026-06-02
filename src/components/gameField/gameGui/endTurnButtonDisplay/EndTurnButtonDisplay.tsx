import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import styles from "./EndTurnButtonDisplay.module.scss";
import DiceContainer from "../dice/DiceContainer";
import { useAuth, useGame } from "@/contexts/contexts";
import { useIsRolledDiceThisTurn } from "@/hooks/matchHooks/useIsRolledDiceThisTurn";
import type { RefObject } from "react";

type EndTurnButtonDisplayProps = {
    animationTrigger: RefObject<number>;
    hideBoxedDices: boolean;
}

const EndTurnButtonDisplay: React.FC<EndTurnButtonDisplayProps> = ({ animationTrigger, hideBoxedDices }) => {
  const isMyTurn = useIsMyTurn();
  const isRolledDiceThisTurn = useIsRolledDiceThisTurn();
  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();

  const nextPlayer = () => {
    fetchWithAuth(`/games/${uuid}/endTurn`, "POST");
  };

  const hideDiceBox = () => {
    return hideBoxedDices || !isRolledDiceThisTurn;
  };

  return (
    <div className={styles["endTurnButtonDisplay"]}>
      <div style={{ visibility: hideDiceBox() ? "hidden" : "visible" }}>
        <DiceContainer className={styles["endTurnButtonDisplay__diceContainer"]} animationTrigger={animationTrigger} currentDiceSide={"boxed"} />
      </div>
            
      <button onClick={nextPlayer} disabled={!isMyTurn} className={`${styles["endTurnButtonDisplay__endTurnButton"]} ${isMyTurn ? styles["endTurnButtonDisplay__endTurnButton--active"] : styles["endTurnButtonDisplay__endTurnButton--inactive"]}`}>End Turn</button>
    </div>
  );
};

export default EndTurnButtonDisplay;