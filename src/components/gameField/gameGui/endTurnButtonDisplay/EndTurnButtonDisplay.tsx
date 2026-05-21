import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import styles from "./EndTurnButtonDisplay.module.scss";

const EndTurnButtonDisplay: React.FC = () => {
    const isThisPlayersTurn = useIsMyTurn();

    return (
        <div className={styles["endTurnButtonDisplay"]}>
            <p>Put dices here</p>
            <button className={`${styles["endTurnButtonDisplay__endTurnButton"]} ${isThisPlayersTurn ? styles["endTurnButtonDisplay__endTurnButton--active"] : styles["endTurnButtonDisplay__endTurnButton--inactive"]}`}>End Turn</button>
        </div>
    );
}

export default EndTurnButtonDisplay;