import { useEffect, useState } from "react";
import type { PlayerRessources } from "../../../../repository/MatchRepository";
import "./RessourceDisplay.css";
import { useMatchRepository } from "../../../../contexts/contexts";

const RessourceDisplay: React.FC = () => {

  const { repository } = useMatchRepository();
  const [matchData, setMatchData] = useState(repository.getMatchData());
  const [myRessources, setMyRessources] = useState<PlayerRessources>();

  useEffect(()=>{
    repository.keepMeUpdated(setMatchData);
  }, []);

  useEffect(()=>{
    const myRessources: PlayerRessources | undefined = matchData.find(playerRessource => playerRessource.publicId === repository.getMyPublicId())?.ressources;
    if (myRessources) setMyRessources(myRessources);
  }, [matchData]);

  return (
    <>
      {
        myRessources ? (
          <div className="ressourceDisplay">
            <div className="ressourceDisplay-img-wrapper" style={{ backgroundColor: "darkolivegreen" }}>
              <img src="../ressources/wood.png"></img>
              <span className="ressourceCountNumber">{myRessources.get("wood")}</span>
            </div>
            <div className="ressourceDisplay-img-wrapper" style={{ backgroundColor: "darkred" }}>
              <img src="../ressources/brick.png"></img>
              <span className="ressourceCountNumber">{myRessources.get("brick")}</span>
            </div>
            <div className="ressourceDisplay-img-wrapper" style={{ backgroundColor: "darkkhaki" }}>
              <img src="../ressources/wheat.png"></img>
              <span className="ressourceCountNumber">{myRessources.get("wheat")}</span>
            </div>
            <div className="ressourceDisplay-img-wrapper" style={{ backgroundColor: "ThreeDDarkShadow" }}>
              <img src="../ressources/sheep.png"></img>
              <span className="ressourceCountNumber">{myRessources.get("sheep")}</span>
            </div>
            <button className="ressourceDisplay-img-wrapper bankButton">
              <img src="../ressources/bank.png"></img>
            </button>
          </div>
        ) : (
          <span>ERROR!!!</span>
        )
      }
    </>
  );
};

export default RessourceDisplay;