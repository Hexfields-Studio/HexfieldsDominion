import { Layer } from "react-konva";
import PlayerLineupDisplay from "./playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "./ressourceDisplay/RessourceDisplay";
import styles from "./GameGui.module.scss";
import { Html } from "react-konva-utils";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";

const GameGui: React.FC = () => {

  const isThisPlayersTurn = useIsMyTurn();

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