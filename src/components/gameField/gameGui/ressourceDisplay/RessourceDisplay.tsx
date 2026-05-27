import { resources, type PlayerResources } from "@/repository/MatchRepository";
import styles from "./RessourceDisplay.module.scss";
import { useMyRessources } from "@/hooks/matchHooks/useMyRessources";

const RessourceDisplay: React.FC = () => {

  const myRessources: PlayerResources | undefined = useMyRessources();

  return (
    <>
      {
        myRessources ? (
          <div className={styles.ressourceDisplayLayout}>
            {resources.map(resource => 
              <div key={resource.toLowerCase()} className={`${styles.ressource} ${styles[resource.toLowerCase()]}`}>
                <img src={`${import.meta.env.BASE_URL}ressources/${resource.toLowerCase()}.png`}></img>
                <span className={styles.ressourceCountNumber}>{myRessources[resource] ?? 0}</span>
              </div>,
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
