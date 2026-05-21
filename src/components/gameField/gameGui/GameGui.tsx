import { Layer } from "react-konva";
import PlayerLineupDisplay from "@/components/gameField/gameGui/playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "@/components/gameField/gameGui/ressourceDisplay/RessourceDisplay";
import EndTurnButtonDisplay from "@/components/gameField/gameGui/endTurnButtonDisplay/EndTurnButtonDisplay";
import styles from "./GameGui.module.scss";
import { Html } from "react-konva-utils";
import Dice from "@/components/gameField/gameGui/dice/dice";
import { useEffect, useMemo, useRef, useState } from "react";
import Dialog, { type DialogHandle } from "@/components/dialog/dialog";
import { useAuth, useGame } from "@/contexts/contexts";
import { ROLLING_DICES_DIALOG_TIMEOUT } from "@/constants/constants";
import { useSseListeners } from "@/hooks/sseHooks/useSseListeners";

type DiceValuePairType = {
  value1: number,
  value2: number
}

const GameGui: React.FC = () => {

  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();

  const [rolledSides, setRolledSides] = useState<number[]>([0, 0]);
  const [animationTrigger, setAnimationTrigger] = useState<number>(0);

  const dialogRef = useRef<DialogHandle | null>(null);

  useSseListeners(useMemo(() => [
    {
      type: "rollDice",
      action: (event: MessageEvent) => {
        showDiceAnimation(JSON.parse(event.data));
      },
    },
  ], []));

  const rollDice = () => {
    (async () => {
      const response = await fetchWithAuth(`/games/${uuid}/rollDice`, "POST");
      if (!response || response.status !== 200) {
        return;
      }

      const responseJson = await response.json();

      showDiceAnimation(responseJson);
    })();
  };

  const showDiceAnimation = (diceValuePair: DiceValuePairType) => {
    dialogRef.current?.toggleDialog();

    setRolledSides([diceValuePair.value1, diceValuePair.value2]);
    
    setTimeout(() => dialogRef.current?.toggleDialog(), ROLLING_DICES_DIALOG_TIMEOUT);
  };

  useEffect(()=>{
    setAnimationTrigger(a => a + 1);
  }, [rolledSides]);

  return (
    <Layer>
      <Html divProps={{ className: styles.gui }}>
        <Dialog id="diceContainer" ref={dialogRef} useDefaultStyling={false} closedBy="none">
          <div className={styles["diceContainer"]}>
            <Dice theme="blue" rolledSide={rolledSides[0]} animationTrigger={animationTrigger}/>
            <Dice theme="red" rolledSide={rolledSides[1]} animationTrigger={animationTrigger}/>
          </div>
        </Dialog>
        <button onClick={rollDice} style={{pointerEvents: "all"}}>Test</button>
        <div className={styles["flexboxes"]}>
          <PlayerLineupDisplay/>
          <RessourceDisplay/>
          <EndTurnButtonDisplay/>
        </div>
      </Html>
    </Layer>
  );
};
export default GameGui;