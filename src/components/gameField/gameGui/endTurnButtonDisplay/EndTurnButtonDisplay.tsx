import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import Dice from "@/components/gameField/gameGui/dice/dice";
import styles from "./EndTurnButtonDisplay.module.scss";
import { useEffect, useState } from "react";

const EndTurnButtonDisplay: React.FC = () => {
    const isThisPlayersTurn = useIsMyTurn();

    const [rolledSides, setRolledSides] = useState<number[]>([0, 0]);
    const [animationTrigger, setAnimationTrigger] = useState<number>(0);

    const rollDice = () => {
        setRolledSides([
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ]);
    }

    useEffect(()=>{
        setAnimationTrigger(a => a + 1);
      }, [rolledSides]);

    return (
        <div className={styles["endTurnButtonDisplay"]}>
            <div className={styles["endTurnButtonDisplay__diceContainer"]} onClick={()=>rollDice()}>
                <Dice diceTheme={1} rolledSide={rolledSides[0]} animationTrigger={animationTrigger} currentDiceSide={"boxed"}/>
                <Dice diceTheme={2} rolledSide={rolledSides[1]} animationTrigger={animationTrigger} currentDiceSide={"boxed"}/>
            </div>
            <button className={`${styles["endTurnButtonDisplay__endTurnButton"]} ${isThisPlayersTurn ? styles["endTurnButtonDisplay__endTurnButton--active"] : styles["endTurnButtonDisplay__endTurnButton--inactive"]}`}>End Turn</button>
        </div>
    );
}

export default EndTurnButtonDisplay;