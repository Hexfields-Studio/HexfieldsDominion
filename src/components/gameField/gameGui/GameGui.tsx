import { Layer } from "react-konva";
import PlayerLineupDisplay from "@/components/gameField/gameGui/playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "@/components/gameField/gameGui/ressourceDisplay/RessourceDisplay";
import EndTurnButtonDisplay from "@/components/gameField/gameGui/endTurnButtonDisplay/EndTurnButtonDisplay";
import styles from "./GameGui.module.scss";
import { Html } from "react-konva-utils";
import { useCallback, useEffect, useRef, useState } from "react";
import Dialog, { type DialogHandle } from "@/components/dialog/dialog";
import { useAuth, useGame } from "@/contexts/contexts";
import { HIGHLIGHT_DICE_ANIMATION_TIMEOUT, HIGHLIGHT_GRANTED_RESOURCES_TIMEOUT } from "@/constants/constants";
import { useError } from "@/hooks/useError";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import DiceContainer from "@/components/gameField/gameGui/dice/DiceContainer";
import { useCurrentDiceResult } from "@/hooks/matchHooks/useCurrentDiceResult";
import { useIsRolledDiceThisTurn } from "@/hooks/matchHooks/useIsRolledDiceThisTurn";
import type { PlayerResources } from "@/repository/MatchRepository";

const GameGui: React.FC = () => {

  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();
  const { isError } = useError();
  const isMyTurn = useIsMyTurn();
  const currentDiceResult = useCurrentDiceResult();
  const isRolledDiceThisTurn = useIsRolledDiceThisTurn();

  const [hideBoxedDices, setHideBoxedDices] = useState<boolean>(false);
  const [animationTrigger, setAnimationTrigger] = useState<number>(0);
  const [grantedResources, setGrantedResources] = useState<PlayerResources | null>(null);

  const dialogRef = useRef<DialogHandle | null>(null);

  const rollDice = () => {
    (async () => {
      const response = await fetchWithAuth(`/games/${uuid}/rollDice`, "POST");
      if (isError(response)) {
        return;
      }

      setTimeout(() => {
        dialogRef.current?.toggleDialog();
        setHideBoxedDices(false);
        showGrantedResources();
      }, HIGHLIGHT_DICE_ANIMATION_TIMEOUT);
    })();
  };

  const showGrantedResources = async () => {
    const response = await fetchWithAuth(`/games/${uuid}/grantedResources`, "GET");
    if (response?.status === 204) {
      return;
    }
    const responseJson = await response?.json();

    setGrantedResources(responseJson);
    setTimeout(() => setGrantedResources(null), HIGHLIGHT_GRANTED_RESOURCES_TIMEOUT);
  };

  const isNotShowingDialog = useCallback(() => {
    return isMyTurn && !isRolledDiceThisTurn;
  }, [isMyTurn, isRolledDiceThisTurn]);

  useEffect(() => {
    if (isNotShowingDialog()) {
      const showDialog = async () => {
        dialogRef.current?.toggleDialog();
        setHideBoxedDices(true);
      };
      showDialog();
    }
  }, [isNotShowingDialog]);

  useEffect(() => {
    if (currentDiceResult === null || isNotShowingDialog()) {
      return;
    }
    const triggerAnimation = async () => {
      setAnimationTrigger(a => a + 1);
      if (!isMyTurn) {
        setTimeout(() => showGrantedResources(), 2000);
      };
    };
    triggerAnimation();
    // stringify to prevent trigger with the same value -> not object based
  }, [JSON.stringify(currentDiceResult)]);

  return (
    <Layer>
      <Html divProps={{ className: styles.gui }}>
        <Dialog onClick={rollDice} id="diceContainer" ref={dialogRef} useDefaultStyling={false} closedBy="none">
          <h1 className={styles["gui__heading"]}>Du bist dran.</h1>
          <DiceContainer className={styles["gui__diceContainer"]} animationTrigger={animationTrigger} currentDiceSide={"highlighted"} />
          <span className={styles["gui__footer"]}>Klicke auf eine beliebige Stelle, um zu würfeln.</span>
        </Dialog>
        <div className={styles["gui__flexboxes"]}>
          <PlayerLineupDisplay/>
          <RessourceDisplay grantedResources={grantedResources}/>
          <EndTurnButtonDisplay animationTrigger={animationTrigger} hideBoxedDices={hideBoxedDices}/>
        </div>
      </Html>
    </Layer>
  );
};
export default GameGui;