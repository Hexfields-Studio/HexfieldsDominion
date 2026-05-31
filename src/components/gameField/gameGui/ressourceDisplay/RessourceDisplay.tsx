import { resources, type PlayerResources } from "@/repository/MatchRepository";
import styles from "./RessourceDisplay.module.scss";
import { useMyRessources } from "@/hooks/matchHooks/useMyRessources";
import { useRef, useState } from "react";
import type { DialogHandle } from "@/components/dialog/dialog";
import Dialog from "@/components/dialog/dialog";

const TRADE_GIVE_AMOUNT = 4;

type ResourceType = "WOOD" | "BRICK" | "WHEAT" | "SHEEP";

type ResourceDisplayProps = {
  grantedResources: PlayerResources | null
}

const RessourceDisplay: React.FC<ResourceDisplayProps> = ({ grantedResources }) => {

  const myRessources: PlayerResources | undefined = useMyRessources();
  const tradingDialogRef = useRef<DialogHandle | null>(null);

  const [selectedResourceGive, setSelectedResourceGive] = useState<ResourceType | null>(null);
  const [selectedResourceGet, setSelectedResourceGet] = useState<ResourceType | null>(null);

  const openTradeBankDialog = () => {
    setSelectedResourceGive(null);
    setSelectedResourceGet(null);
    tradingDialogRef.current?.toggleDialog();
  };

  const isResourceGranted = (resource: ResourceType) => {
    return grantedResources !== null && grantedResources[resource] !== undefined;
  };

  return (
    <>
      <Dialog id={styles["tradeBankDialog"]} title="Trade with bank" ref={tradingDialogRef}>
        <div className={styles["tradeBankDialog__config"]}>
          <div className={styles["tradeBankDialog__config__column"]}>
            <span>{`Give ${TRADE_GIVE_AMOUNT}x`}</span>
            { myRessources && resources.map(resource => 
              <button
                key={resource}
                className={styles[`${(selectedResourceGive === resource) ? "tradeBankDialog__config__button--selected" : "tradeBankDialog__config__button--default"}`]}
                disabled={myRessources[resource] < TRADE_GIVE_AMOUNT}
                onClick={() => {
                  setSelectedResourceGive(resource);
                  setSelectedResourceGet(null);
                }}>
                {resource.toLowerCase()}
              </button>)
            }
          </div>
          <span>→</span>
          <div className={styles["tradeBankDialog__config__column"]}>
            <span>Get 1x</span>
            { resources.map(resource => 
              <button
                key={resource}
                className={(selectedResourceGet === resource) ? styles["tradeBankDialog__config__button--selected"] : styles["tradeBankDialog__config__button--default"]}
                disabled={!selectedResourceGive || (selectedResourceGive === resource)}
                onClick={() => setSelectedResourceGet(resource)}>
                {resource.toLowerCase()}
              </button>)
            }
          </div>
        </div>
        <button disabled={!selectedResourceGive || !selectedResourceGet}>Trade</button>
      </Dialog>
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
            <button className={styles.bankButton} onClick={openTradeBankDialog}>
              <img src={`${import.meta.env.BASE_URL}ressources/bank.png`}></img>
            </button>
          </div>
        )
      }
    </>
  );
};

export default RessourceDisplay;
