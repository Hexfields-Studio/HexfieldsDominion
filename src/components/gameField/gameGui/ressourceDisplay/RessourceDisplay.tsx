import { resources, type PlayerResources } from "@/repository/MatchRepository";
import styles from "./RessourceDisplay.module.scss";
import { useMyRessources } from "@/hooks/matchHooks/useMyRessources";
import { useEffect, useState } from "react";
import { HIGHLIGHT_GRANTED_RESOURCES_TIMEOUT } from "@/constants/constants";
import TradeBankOrAllButton from "../tradingDialog/TradeBankOrAllButton";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import { useGame } from "@/contexts/contexts";

type ResourceType = "WOOD" | "BRICK" | "WHEAT" | "SHEEP";

const RessourceDisplay = () => {
  const myRessources: PlayerResources | undefined = useMyRessources();
  const isMyTurn = useIsMyTurn();
  const { showGrantedResourcesActionRef } = useGame();

  const [grantedResources, setGrantedResources] = useState<PlayerResources | null>(null);
  const [hideTimer, setHideTimer] = useState<number | null>(null);

  const hideGrantedResources = () => setGrantedResources(null);

  useEffect(() => {
    showGrantedResourcesActionRef.current = ((grantedResources: PlayerResources) => {
      if (hideTimer !== null) {
        clearTimeout(hideTimer);
      }
      setHideTimer(setTimeout(hideGrantedResources, HIGHLIGHT_GRANTED_RESOURCES_TIMEOUT));
      setGrantedResources(grantedResources);
    });
  }, []);

  const isResourceGranted = (resource: ResourceType) => {
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
                    {isResourceGranted(resource) ? `${((grantedResources?.[resource] ?? 0) > 0) ? "+" : ""}${grantedResources?.[resource]}`: ""}
                  </span>
                </div>
              </div>,
            )}
            { isMyTurn &&
              <TradeBankOrAllButton className={styles.bankButton}/>
            }
          </div>
        )
      }
    </>
  );
};
RessourceDisplay.displayName = "RessourceDisplay";

export default RessourceDisplay;
