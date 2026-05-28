import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import styles from "./EndTurnButtonDisplay.module.scss";
import DiceContainer from "../dice/DiceContainer";
import { useAuth, useGame } from "@/contexts/contexts";
import { useMemo, useState } from "react";
import { useSseListeners } from "@/hooks/sseHooks/useSseListeners";

type EndTurnButtonDisplayProps = {
    animationTrigger: number;
    hideBoxedDices: boolean;
}

const EndTurnButtonDisplay: React.FC<EndTurnButtonDisplayProps> = ({ animationTrigger, hideBoxedDices }) => {
  const isMyTurn = useIsMyTurn();
  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();

  // hide dices until end of turn. Show again on rollDice
  const [hideDicesInternal, setHideDicesInternal] = useState<boolean>(false);

  useSseListeners(useMemo(() => [
    {
      type: "rollDice",
      action: () => {
        setHideDicesInternal(false);
      },
    },
  ], []));

  const nextPlayer = () => {
    setHideDicesInternal(true);
    fetchWithAuth(`/games/${uuid}/endTurn`, "POST");
    sessionStorage.setItem("rolledDiceThisTurn", "false");
  };

  const hideDiceBox = () => {
    return hideBoxedDices || hideDicesInternal;
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