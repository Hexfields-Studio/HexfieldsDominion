import { resources, type PlayerResources } from "@/repository/MatchRepository";
import styles from "./RessourceDisplay.module.scss";
import { useMyRessources } from "@/hooks/matchHooks/useMyRessources";

type ResourceDisplayProps = {
  grantedResources: PlayerResources | null
}

const RessourceDisplay: React.FC<ResourceDisplayProps> = ({ grantedResources }) => {

  const myRessources: PlayerResources | undefined = useMyRessources();

  const isResourceGranted = (resource: "WOOD" | "BRICK" | "WHEAT" | "SHEEP") => {
    return grantedResources !== null && grantedResources[resource] !== undefined;
  };

  return (
    <>
      {
        myRessources && (
          <div className={styles.ressourceDisplayLayout}>
            {resources.map(resource => 
              <div key={resource.toLowerCase()} className={`${styles.ressource} ${styles[resource.toLowerCase()]}`}>
                <img src={`${import.meta.env.BASE_URL}ressources/${resource.toLowerCase()}.png`}></img>
                <div className={styles.resourceTextContainer}>
                  <span className={styles.resourceCountNumber}>{myRessources[resource] ?? 0}</span>
                  <span className={`${styles.resourceGrantedNumber} ${isResourceGranted(resource) ? styles["resourceGrantedNumber--active"] : styles["resourceGrantedNumber--inactive"]}`}>
                    {isResourceGranted(resource) ? `+${grantedResources?.[resource]}`: ""}
                  </span>
                </div>
              </div>,
            )}
            <button className={styles.bankButton}>
              <img src={`${import.meta.env.BASE_URL}ressources/bank.png`}></img>
            </button>
          </div>
        )
      }
    </>
  );
};

export default RessourceDisplay;
