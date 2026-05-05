import type { PlayerRessources } from "@/repository/MatchRepository";
import styles from "./RessourceDisplay.module.scss";
import { useMyRessources } from "@/hooks/matchHooks/useMyRessources";

const ressources: string[] = ["wood", "brick", "wheat", "sheep"];

const RessourceDisplay: React.FC = () => {

  const myRessources: PlayerRessources | undefined = useMyRessources();

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
