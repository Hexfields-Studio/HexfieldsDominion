import type { DialogHandle } from "@/components/dialog/dialog";
import Dialog from "@/components/dialog/dialog";
import { useMyRessources } from "@/hooks/matchHooks/useMyRessources";
import { resources, type PlayerResources } from "@/repository/MatchRepository";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import styles from "./TradeWithBankDialog.module.scss";
import { useAuth, useGame } from "@/contexts/contexts";
import { useError } from "@/hooks/useError";

const TRADE_GIVE_AMOUNT = 4;
const TRADE_GET_AMOUNT = 1;

type ResourceType = "WOOD" | "BRICK" | "WHEAT" | "SHEEP";

export interface TradeWithBankDialogHandle {
  open: () => void;
}

const TradeWithBankDialog = forwardRef<TradeWithBankDialogHandle>((props, ref) => {
  const myRessources: PlayerResources | undefined = useMyRessources();
  const { fetchWithAuth } = useAuth();
  const { uuid, showGrantedResources } = useGame();
  const { isError, openErrorDialogIfMessage, errorDialog } = useError();

  const [selectedResourceGive, setSelectedResourceGive] = useState<ResourceType | null>(null);
  const [selectedResourceGet, setSelectedResourceGet] = useState<ResourceType | null>(null);

  const dialogRef = useRef<DialogHandle | null>(null);
  
  useImperativeHandle(ref, () => ({
    open,
  }));

  const open = () => {
    setSelectedResourceGive(null);
    setSelectedResourceGet(null);
    dialogRef.current?.openDialog();
  };

  const trade = async () => {
    const response = await fetchWithAuth(`/games/${uuid}/makeMove`, "POST", JSON.stringify({
      type: "TRADE_BANK",
      resourceOffered: selectedResourceGive,
      amountOffered: TRADE_GIVE_AMOUNT,
      resourceRequested: selectedResourceGet,
      amountRequested: TRADE_GET_AMOUNT,
    }));
    if (isError(response)) {
      openErrorDialogIfMessage(response);
      return;
    }
    dialogRef.current?.closeDialog();
    showGrantedResources({
      "BRICK": getGrantedAmount("BRICK"),
      "SHEEP": getGrantedAmount("SHEEP"),
      "WHEAT": getGrantedAmount("WHEAT"),
      "WOOD": getGrantedAmount("WOOD"),
    });
  };

  const getGrantedAmount = (resource: ResourceType) => {
    return (selectedResourceGet === resource ? TRADE_GET_AMOUNT : (selectedResourceGive === resource ? -TRADE_GIVE_AMOUNT : undefined));
  };

  const disableButtonGive = (resource: ResourceType) => {
    return !myRessources || !myRessources[resource] || myRessources[resource] < TRADE_GIVE_AMOUNT;
  };

  return (
    <>
      { errorDialog }

      <Dialog id={styles["tradeBankDialog"]} title="Trade with bank" ref={dialogRef}>
        <div className={styles["tradeBankDialog__config"]}>
          <div className={styles["tradeBankDialog__config__column"]}>
            <span>{`Give ${TRADE_GIVE_AMOUNT}x`}</span>
            { myRessources && resources.map(resource => 
              <button
                key={resource}
                className={styles[`${(selectedResourceGive === resource) ? "tradeBankDialog__config__button--selected" : "tradeBankDialog__config__button--default"}`]}
                disabled={disableButtonGive(resource)}
                title={disableButtonGive(resource) ? "Not enough resources" : undefined /* tooltip */}
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
        <button disabled={!selectedResourceGive || !selectedResourceGet} onClick={trade}>Trade</button>
      </Dialog>
    </>
  );
});
TradeWithBankDialog.displayName = "TradeWithBankDialog";

export default TradeWithBankDialog;