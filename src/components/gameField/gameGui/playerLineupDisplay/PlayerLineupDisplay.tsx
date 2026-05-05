import { useState, useEffect } from "react";
import styles from "./PlayerLineupDisplay.module.scss";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import { useMatchData } from "@/hooks/matchHooks/useMatchData";

const PlayerLineupDisplay: React.FC = () => {

  const matchData = useMatchData();
  const isItMyTurn = useIsMyTurn();

  return(
    <div className={styles.lineupDisplay}>
      {matchData.map(player =>
        <div key={player.username} className={`${styles.playerPortrait} ${player.isThisPlayersTurn ? styles.highlightPlayer : ""}`}>
          <img src={`../playerIcons/${player.chosenPortrait}.png`}></img>
          {player.isThisPlayersTurn && isItMyTurn ? (
            <p className={styles.portraitText}>Your Turn!</p>
          ) : ""}
        </div>,
      )}
    </div>
  );
};

export default PlayerLineupDisplay;