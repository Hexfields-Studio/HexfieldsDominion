import { Layer } from "react-konva";
import PlayerLineupDisplay from "./playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "./ressourceDisplay/RessourceDisplay";
import "./GameGui.css";
import { Html } from "react-konva-utils";
import { useIsMyTurn } from "../../../hooks/useIsMyTurn";

const GameGui: React.FC = () => {

  const isThisPlayersTurn = useIsMyTurn();

  return (
    <Layer>
      <Html divProps={{ className: "gui" }}>
        <div className="flexboxes">
          <PlayerLineupDisplay/>
          <RessourceDisplay/>
          <button className={`endTurnButton ${isThisPlayersTurn ? "endTurnButton-active" : "endTurnButton-inactive"} font`}>End Turn</button>
        </div>
      </Html>
    </Layer>
  );
};

export default GameGui;