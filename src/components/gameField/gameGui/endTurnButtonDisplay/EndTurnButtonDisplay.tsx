import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import styles from "./EndTurnButtonDisplay.module.scss";
import DiceContainer from "../dice/DiceContainer";

type EndTurnButtonDisplayProps = {
    rolledSides: number[];
    animationTrigger: number;
}

const EndTurnButtonDisplay: React.FC<EndTurnButtonDisplayProps> = ({rolledSides, animationTrigger}) => {
    const isThisPlayersTurn = useIsMyTurn();

    return (
        <div className={styles["endTurnButtonDisplay"]}>
            <DiceContainer className={styles["endTurnButtonDisplay__diceContainer"]} rolledSides={rolledSides} animationTrigger={animationTrigger} currentDiceSide={"boxed"} />
            
            <button disabled={!isThisPlayersTurn} className={`${styles["endTurnButtonDisplay__endTurnButton"]} ${isThisPlayersTurn ? styles["endTurnButtonDisplay__endTurnButton--active"] : styles["endTurnButtonDisplay__endTurnButton--inactive"]}`}>End Turn</button>
        </div>
    );
}

export default EndTurnButtonDisplay;