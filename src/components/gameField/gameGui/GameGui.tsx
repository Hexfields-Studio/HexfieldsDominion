import { Layer } from "react-konva";
import PlayerLineupDisplay from "./playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "./ressourceDisplay/RessourceDisplay";
import styles from "./GameGui.module.scss";
import { Html } from "react-konva-utils";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import Dice from "@/components/gameField/gameGui/dice/dice";
import { useEffect, useRef, useState } from "react";
import Dialog, { type DialogHandle } from "@/components/dialog/dialog";

const getRandomNumber = () => Math.floor(Math.random() * 6) + 1;

const GameGui: React.FC = () => {

  const isThisPlayersTurn = useIsMyTurn();
  const [rolledSides, setRolledSides] = useState<number[]>([0, 0]);
  const [animationTrigger, setAnimationTrigger] = useState<number>(0);

  const rollDice = () => setRolledSides([getRandomNumber(), getRandomNumber()]);

  const dialogRef = useRef<DialogHandle | null>(null);

  useEffect(()=>{
    console.log("Rolled:", rolledSides);
    setAnimationTrigger(animationTrigger + 1);
  }, [rolledSides]);

  return (
    <Layer>
      <Html divProps={{ className: styles.gui }}>
        <Dialog id="diceContainer" useDefaultStyling={false} ref={dialogRef} closedBy="none">
          <div className={styles["diceContainer"]}>
            <Dice rolledSide={rolledSides[0]} animationTrigger={animationTrigger} rollDice={rollDice}/>
            <Dice rolledSide={rolledSides[1]} animationTrigger={animationTrigger} rollDice={rollDice}/>
          </div>
        </Dialog>
        <button onClick={()=>dialogRef.current?.toggleDialog()} style={{pointerEvents: "all"}}>Test</button>
        <div className={styles["flexboxes"]}>
          <PlayerLineupDisplay/>
          <RessourceDisplay/>
        </div>
        <button className={`${styles["gui__endTurnButton"]} ${isThisPlayersTurn ? styles["gui__endTurnButton--active"] : styles["gui__endTurnButton--inctive"]}`}>End Turn</button>
      </Html>
    </Layer>
  );
};
export default GameGui;