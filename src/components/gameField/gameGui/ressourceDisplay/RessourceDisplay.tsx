import type { PlayerRessources } from "../../../../repository/MatchRepository";
import "./RessourceDisplay.css";
import { useMyRessources } from "../../../../hooks/matchHooks/useMyRessources";

const RessourceDisplay: React.FC = () => {

  const myRessources: PlayerRessources | undefined = useMyRessources();

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