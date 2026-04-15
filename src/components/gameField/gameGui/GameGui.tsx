import { Layer } from "react-konva";
import PlayerLineupDisplay from "./playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "./ressourceDisplay/RessourceDisplay";
import "./GameGui.css";
import { Html } from "react-konva-utils";
import { useMatchRepository } from "../../../contexts/MatchRepositoryContext";
import { useEffect, useState } from "react";

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