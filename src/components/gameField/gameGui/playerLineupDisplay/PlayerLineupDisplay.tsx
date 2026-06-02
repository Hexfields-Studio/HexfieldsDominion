import { useCurrentPlayersTurn } from "@/hooks/matchHooks/useCurrentPlayersTurn";
import styles from "@/components/gameField/gameGui/playerLineupDisplay/PlayerLineupDisplay.module.scss";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import { useMatchData } from "@/hooks/matchHooks/useMatchData";
import { useMyPublicId } from "@/hooks/matchHooks/useMyPublicId";
import { useAuth, useGame } from "@/contexts/contexts";

const PlayerLineupDisplay: React.FC = () => {

  const { fetchWithAuth } = useAuth();
  const { uuid } = useGame();

  const matchData = useMatchData();
  const isItMyTurn = useIsMyTurn();
  const myPublicId = useMyPublicId();
  const currentPlayersTurn = useCurrentPlayersTurn();

  // temporary to test updating
  const addPoint = () => fetchWithAuth(`/games/${uuid}/addPoint`, "POST");

  return(
    <div className={styles.lineupDisplay}>
      {matchData?.players.map(player => {
        return (
          <div key={player.username} className={`${styles.playerPortrait} ${(player.publicId === currentPlayersTurn) ? styles.highlightPlayer : ""}`} style={{ backgroundColor: `hsl(${player.playerHue}, 100%, 50%)` }}>
            {/* TODO: might be a security risk to directly insert the provided portrait name into the path */}
            <img src={`../playerIcons/${player.chosenPortrait}.png`} />
            <span onClick={addPoint} className={styles.pointsText}>{`Points: ${player.points}`}</span>
            {(player.publicId === myPublicId) && isItMyTurn ? (
              <p className={styles.portraitText}>Your Turn!</p>
            ) : ""}
          </div>
        );
      },
      )}
    </div>
  );
};

export default PlayerLineupDisplay;