import { useCurrentPlayersTurn } from "@/hooks/matchHooks/useCurrentPlayersTurn";
import styles from "@/components/gameField/gameGui/playerLineupDisplay/PlayerLineupDisplay.module.scss";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import { useMatchData } from "@/hooks/matchHooks/useMatchData";
import { useMyPublicId } from "@/hooks/matchHooks/useMyPublicId";
import TradeWithPlayerDialog, { type TradeWithPlayerDialogHandle } from "../tradingDialog/TradeWithPlayerDialog";
import { useRef, useState } from "react";
import type { PlayerRepresentation } from "@/repository/MatchRepository";

const PlayerLineupDisplay: React.FC = () => {
  const matchData = useMatchData();
  const isItMyTurn = useIsMyTurn();
  const myPublicId = useMyPublicId();
  const currentPlayersTurn = useCurrentPlayersTurn();

  const [tradingTargetId, setTradingTargetId] = useState<number | undefined>();
  const tradingPlayerDialogRef = useRef<TradeWithPlayerDialogHandle | null>(null);

  const openTradingPlayerDialog = (player: PlayerRepresentation) => {
    if (!isItMyTurn && ((player.publicId === myPublicId) || (player.publicId !== currentPlayersTurn))) {
      return;
    }
    setTradingTargetId(player.publicId);
    tradingPlayerDialogRef.current?.open();
  };

  return(
    <>
      <TradeWithPlayerDialog ref={tradingPlayerDialogRef} targetId={tradingTargetId}/>
      <div className={styles.lineupDisplay}>
        {matchData?.players.map(player =>
          <div
            key={player.username}
            onClick={() => openTradingPlayerDialog(player)}
            className={`${styles.playerPortrait} ${(player.publicId === currentPlayersTurn) ? styles.highlightPlayer : ""}`}
            style={{ cursor: (isItMyTurn || (!isItMyTurn && player.publicId === currentPlayersTurn)) ? "pointer" : "not-allowed" }}
            title={((!isItMyTurn && player.publicId !== currentPlayersTurn) ? "You can only trade with player current turn" : undefined)}>
            <span className={styles.playerName}>{`${(player.publicId === myPublicId) ? "YOU: " : ""}${player.username}`}</span>
            {/* TODO: might be a security risk to directly insert the provided portrait name into the path */}
            <img src={`../playerIcons/${player.chosenPortrait}.png`} />
            {/*//TODO: info for trade? ! or number in circle or similar*/}
            <span className={styles.pointsText}>{`Points: ${player.points}`}</span>
            {(player.publicId === myPublicId) && isItMyTurn ? (
              <p className={styles.portraitText}>Your Turn!</p>
            ) : ""}
          </div>,
        )}
      </div>
    </>
  );
};

export default PlayerLineupDisplay;