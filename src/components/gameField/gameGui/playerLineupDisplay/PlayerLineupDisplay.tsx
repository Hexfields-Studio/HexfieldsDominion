import { useCurrentPlayersTurn } from "@/hooks/matchHooks/useCurrentPlayersTurn";
import styles from "./PlayerLineupDisplay.module.scss";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import { useMatchData } from "@/hooks/matchHooks/useMatchData";
import { useMyPublicId } from "@/hooks/matchHooks/useMyPublicId";

const PlayerLineupDisplay: React.FC = () => {

  const matchData = useMatchData();
  const isItMyTurn = useIsMyTurn();
  const myPublicId = useMyPublicId();
  const currentPlayersTurn = useCurrentPlayersTurn();

  return(
    <div className={styles.lineupDisplay}>
      {matchData?.players.map(player =>
        <div key={player.username} className={`${styles.playerPortrait} ${(player.publicId === currentPlayersTurn) ? styles.highlightPlayer : ""}`}>
          {/* TODO: might be a security risk to directly insert the provided portrait name into the path */}
          <img src={`../playerIcons/${player.chosenPortrait}.png`}></img>
          {(player.publicId === myPublicId) && isItMyTurn ? (
            <p className={styles.portraitText}>Your Turn!</p>
          ) : ""}
        </div>,
      )}
    </div>
  );
};

export default PlayerLineupDisplay;