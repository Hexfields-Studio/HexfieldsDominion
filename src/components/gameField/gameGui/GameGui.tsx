import { Layer } from "react-konva";
import PlayerLineupDisplay from "@/components/gameField/gameGui/playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "@/components/gameField/gameGui/ressourceDisplay/RessourceDisplay";
import EndTurnButtonDisplay from "@/components/gameField/gameGui/endTurnButtonDisplay/EndTurnButtonDisplay";
import styles from "./GameGui.module.scss";
import { Html } from "react-konva-utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dialog, { type DialogHandle } from "@/components/dialog/dialog";
import { useAuth, useGame, useMatchRepository } from "@/contexts/contexts";
import { DICE_ANIMATION_DURATION, HIGHLIGHT_DICE_ANIMATION_TIMEOUT, HIGHLIGHT_GRANTED_RESOURCES_TIMEOUT } from "@/constants/constants";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import DiceContainer from "@/components/gameField/gameGui/dice/DiceContainer";
import { useCurrentDiceResult } from "@/hooks/matchHooks/useCurrentDiceResult";
import { useIsRolledDiceThisTurn } from "@/hooks/matchHooks/useIsRolledDiceThisTurn";
import type { PlayerResources } from "@/repository/MatchRepository";
import { useWinner } from "@/hooks/matchHooks/useWinner";
import { useMyPublicId } from "@/hooks/matchHooks/useMyPublicId";
import { useNavigate } from "react-router";
import { useSseListeners } from "@/hooks/sseHooks/useSseListeners";

const GameGui: React.FC = () => {

  const navi = useNavigate();
  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();
  const { repository } = useMatchRepository();
  const isMyTurn = useIsMyTurn();
  const currentDiceResult = useCurrentDiceResult();
  const isRolledDiceThisTurn = useIsRolledDiceThisTurn();
  const winner = useWinner();
  const myPublicId = useMyPublicId();

  const [hideBoxedDices, setHideBoxedDices] = useState<boolean>(false);
  const [grantedResources, setGrantedResources] = useState<PlayerResources | null>(null);
  const animationTrigger = useRef<number>(0);
  const rollDiceAction = useRef<() => void>(() => {});
  const triggeredInitialRollDice = useRef<boolean>(false);

  const dicesDialogRef = useRef<DialogHandle | null>(null);
  const winnerDialogRef = useRef<DialogHandle | null>(null);

  useSseListeners(useMemo(() => [
    {
      type: "rollDice",
      action: (event: MessageEvent) => {
        repository.setMatchData(JSON.parse(event.data));
        animationTrigger.current += 1;
        rollDiceAction.current();
      },
    },
  ], [repository]));

  const rollDice = () => {
    fetchWithAuth(`/games/${uuid}/rollDice`, "POST");
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
        dicesDialogRef.current?.openDialog();
        setHideBoxedDices(true);
      };
      showDialog();
    }

    // necessary because of sseListener in useMemo
    rollDiceAction.current = isMyTurn
      ? () => {
        setTimeout(() => {
          dicesDialogRef.current?.closeDialog();
          setHideBoxedDices(false);
          showGrantedResources();
        }, HIGHLIGHT_DICE_ANIMATION_TIMEOUT);
      }
      : () => {
        setTimeout(() => {
          showGrantedResources();
        }, DICE_ANIMATION_DURATION);
      };
  }, [isMyTurn]);

  useEffect(() => {
    if (winner === null) {
      return;
    }
    winnerDialogRef.current?.openDialog();
  }, [winner]);

  // show current result when reloading
  useEffect(() => {
    if (currentDiceResult === null || triggeredInitialRollDice.current) {
      return;
    }
    triggeredInitialRollDice.current = true;
    animationTrigger.current += 1;
  }, [currentDiceResult]);

  return (
    <Layer>
      <Html divProps={{ className: styles.gui }}>
        <Dialog onClick={rollDice} id="diceContainer" ref={dicesDialogRef} useDefaultStyling={false} closedBy="none">
          <h1 className={styles["gui__diceHeading"]}>{"It's your turn."}</h1>
          <DiceContainer className={styles["gui__diceContainer"]} animationTrigger={animationTrigger} currentDiceSide={"highlighted"} />
          <span className={styles["gui__diceFooter"]}>Click anywhere to roll the dice.</span>
        </Dialog>
        <Dialog id={styles["gui__winnerDialog"]} ref={winnerDialogRef} useDefaultStyling={false} closedBy="none">
          <h1>The game is over. {(winner?.publicId === myPublicId) ? "You won 🎉" : "We have a winner."}</h1>
          <p className={styles["gui__winnerInfo"]}>{(winner?.publicId === myPublicId) ? "You are the winner:" : "The winner is"}</p>
          <p className={styles["gui__winnerName"]}>{winner?.username}</p>
          <h2>🎉 Congratulations 🎉</h2>
          <button className={styles["gui__backToStartMenu"]} onClick={() => navi("/play")}>← Back to Start Menu</button>
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