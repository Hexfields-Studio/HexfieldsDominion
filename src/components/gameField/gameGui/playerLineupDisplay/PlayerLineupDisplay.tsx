import { useState, useEffect } from "react";
import styles from "./PlayerLineupDisplay.module.scss";
import { useMatchRepository } from "@/contexts/contexts";

const PlayerLineupDisplay: React.FC = () => {

  const { repository } = useMatchRepository();
  const [matchData, setMatchData] = useState(repository.getMatchData());
  const [isItMyTurn, setIsItMyTurn] = useState<boolean>(false);

  useEffect(()=>{
    repository.keepMeUpdated(setMatchData);
  }, []);

  useEffect(()=>{
    setIsItMyTurn(repository.isItMyTurn());
  }, [matchData]);

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