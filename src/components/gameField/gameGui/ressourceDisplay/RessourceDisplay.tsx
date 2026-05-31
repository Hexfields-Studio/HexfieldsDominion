import { resources, type PlayerResources } from "@/repository/MatchRepository";
import styles from "./RessourceDisplay.module.scss";
import { useMyRessources } from "@/hooks/matchHooks/useMyRessources";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import TradeWithBankDialog, { type TradeWithBankDialogHandle } from "../tradingDialog/TradeWithBankDialog";
import { HIGHLIGHT_GRANTED_RESOURCES_TIMEOUT } from "@/constants/constants";

type ResourceType = "WOOD" | "BRICK" | "WHEAT" | "SHEEP";

export interface ResourceDisplayHandle {
  queueGrantedResources: (grantedResources: PlayerResources) => void;
}

const RessourceDisplay = forwardRef<ResourceDisplayHandle>((props, ref) => {
  const myRessources: PlayerResources | undefined = useMyRessources();

  const [grantedResources, setGrantedResources] = useState<PlayerResources | null>(null);
  const [hideTimer, setHideTimer] = useState<number | null>(null);
  const tradingDialogRef = useRef<TradeWithBankDialogHandle | null>(null);

  useImperativeHandle(ref, () => ({
    queueGrantedResources,
  }));

  const queueGrantedResources = (grantedResources: PlayerResources) => {
    if (hideTimer !== null) {
      clearTimeout(hideTimer);
    }
    setHideTimer(setTimeout(hideGrantedResources, HIGHLIGHT_GRANTED_RESOURCES_TIMEOUT));
    setGrantedResources(grantedResources);
  };

  const hideGrantedResources = () => setGrantedResources(null);

  const isResourceGranted = (resource: ResourceType) => {
    return grantedResources !== null && grantedResources[resource] !== undefined;
  };

  return (
    <>
      <TradeWithBankDialog ref={tradingDialogRef} setGrantedResources={queueGrantedResources}/>
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
            <button className={styles.bankButton} onClick={() => tradingDialogRef.current?.open()}>
              <img src={`${import.meta.env.BASE_URL}ressources/bank.png`}></img>
            </button>
          </div>
        )
      }
    </>
  );
});
RessourceDisplay.displayName = "RessourceDisplay";

export default RessourceDisplay;
