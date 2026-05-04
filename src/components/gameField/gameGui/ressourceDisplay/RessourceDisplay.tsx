import { useEffect, useState } from "react";
import type { PlayerRessources } from "@/repository/MatchRepository";
import styles from "./RessourceDisplay.module.scss";
import { useMatchRepository } from "@/contexts/contexts";

const ressources: string[] = ["wood", "brick", "wheat", "sheep"];

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
          <div className={styles.ressourceDisplayLayout}>
            {ressources.map(ressource => 
              <div key={ressource} className={`${styles.ressource} ${styles[ressource]}`}>
                <img src={`${import.meta.env.BASE_URL}ressources/${ressource}.png`}></img>
                <span className={styles.ressourceCountNumber}>{myRessources.get("wood")}</span>
              </div>
            )}
            <button className={styles.bankButton}>
              <img src={`${import.meta.env.BASE_URL}ressources/bank.png`}></img>
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