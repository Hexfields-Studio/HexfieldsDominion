import "./PlayerLineupDisplay.css";
import { useIsMyTurn } from "../../../../hooks/matchHooks/useIsMyTurn";
import { useMatchData } from "../../../../hooks/matchHooks/useMatchData";

const PlayerLineupDisplay: React.FC = () => {

  const matchData = useMatchData();
  const isItMyTurn = useIsMyTurn();

  return(
    <div className="lineupDisplay">
      {matchData.map(player =>
        <div key={player.username} className={`lineupDisplay-img-wrapper ${player.isThisPlayersTurn ? "highlightPlayer" : ""}`}>
          <img src={`../playerIcons/${player.chosenPortrait}.png`}></img>
          {player.isThisPlayersTurn && isItMyTurn ? (
            <p className="portraitText">Your Turn!</p>
          ) : ""}
        </div>,
      )}
    </div>
  );
};

export default PlayerLineupDisplay;