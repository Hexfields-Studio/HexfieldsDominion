import { Layer } from "react-konva";
import PlayerLineupDisplay from "./playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "./ressourceDisplay/RessourceDisplay";
import styles from "./GameGui.module.scss";
import { Html } from "react-konva-utils";
import { useEffect, useState } from "react";
import { useMatchRepository } from "@/contexts/contexts";

const GameGui: React.FC = () => {

  const { repository } = useMatchRepository();
  const [matchData, setMatchData] = useState(repository.getMatchData());
  const [isThisPlayersTurn, setIsThisPlayersTurn] = useState<boolean>(false);

  useEffect(()=>{
    repository.keepMeUpdated(setMatchData);
  }, []);

  useEffect(()=>{
    setIsThisPlayersTurn(repository.isItMyTurn());
  }, [matchData]);

  return (
    <Layer>
      <Html divProps={{ className: styles.gui }}>
        <div className={styles.flexboxes}>
          <PlayerLineupDisplay/>
          <RessourceDisplay/>
        </div>
        <button className={`${styles["gui__endTurnButton"]} ${isThisPlayersTurn ? styles["gui__endTurnButton--active"] : styles["gui__endTurnButton--inctive"]}`}>End Turn</button>
      </Html>
    </Layer>
  );
};

export default GameGui;