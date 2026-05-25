import { Layer } from "react-konva";
import PlayerLineupDisplay from "@/components/gameField/gameGui/playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "@/components/gameField/gameGui/ressourceDisplay/RessourceDisplay";
import EndTurnButtonDisplay from "@/components/gameField/gameGui/endTurnButtonDisplay/EndTurnButtonDisplay";
import styles from "./GameGui.module.scss";
import { Html } from "react-konva-utils";
import { useEffect, useMemo, useRef, useState } from "react";
import Dialog, { type DialogHandle } from "@/components/dialog/dialog";
import { useAuth, useGame } from "@/contexts/contexts";
import { HIGHLIGHT_DICE_ANIMATION_TIMEOUT } from "@/constants/constants";
import { useSseListeners } from "@/hooks/sseHooks/useSseListeners";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import DiceContainer from "@/components/gameField/gameGui/dice/DiceContainer";

type DiceValuePairType = {
  value1: number,
  value2: number
}

const GameGui: React.FC = () => {

  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();
  const isMyTurn = useIsMyTurn();
  const [hideBoxedDices, setHideBoxedDices] = useState<boolean>(false);

  const [rolledSides, setRolledSides] = useState<number[]>([0, 0]);
  const [animationTrigger, setAnimationTrigger] = useState<number>(0);

  const dialogRef = useRef<DialogHandle | null>(null);

  useSseListeners(useMemo(() => [
    {
      type: "rollDice",
      action: (event: MessageEvent) => {
        highlightDiceAnimation(JSON.parse(event.data));
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

      highlightDiceAnimation(responseJson);
    })();
  };

  const highlightDiceAnimation = (diceValuePair: DiceValuePairType) => {
    if(isMyTurn){
      dialogRef.current?.toggleDialog();
      setHideBoxedDices(true);
      setTimeout(() => {
        dialogRef.current?.toggleDialog();
        setHideBoxedDices(false);
      }, HIGHLIGHT_DICE_ANIMATION_TIMEOUT);
    }
    setRolledSides([diceValuePair.value1, diceValuePair.value2]);
  };

  useEffect(()=>{
    setAnimationTrigger(a => a + 1);
  }, [rolledSides]);

  return (
    <Layer>
      <Html divProps={{ className: styles.gui }}>
        <Dialog id="diceContainer" ref={dialogRef} useDefaultStyling={false} closedBy="none">
          <DiceContainer className={styles["gui__diceContainer"]} rolledSides={rolledSides} animationTrigger={animationTrigger} currentDiceSide={"highlighted"} />
        </Dialog>
        <button onClick={rollDice} style={{pointerEvents: "all"}}>Test</button>
        <div className={styles["gui__flexboxes"]}>
          <PlayerLineupDisplay/>
          <RessourceDisplay/>
          <EndTurnButtonDisplay rolledSides={rolledSides} animationTrigger={animationTrigger} hideBoxedDices={hideBoxedDices}/>
        </div>
      </Html>
    </Layer>
  );
};
export default GameGui;