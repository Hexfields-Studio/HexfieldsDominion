import type { DialogHandle } from "@/components/dialog/dialog";
import Dialog from "@/components/dialog/dialog";
import { useMyRessources } from "@/hooks/matchHooks/useMyRessources";
import { resources, type PlayerResources, type PlayerTrade, type TradingStatus, type TradingTarget } from "@/repository/MatchRepository";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState, type ChangeEvent } from "react";
import styles from "./TradeWithPlayerDialog.module.scss";
import { useAuth, useGame, useMatchRepository } from "@/contexts/contexts";
import { useError } from "@/hooks/useError";
import { useIsMyTurn } from "@/hooks/matchHooks/useIsMyTurn";
import { usePlayerTrades } from "@/hooks/matchHooks/usePlayerTrades";
import { useSseListeners } from "@/hooks/sseHooks/useSseListeners";
import { useMyPublicId } from "@/hooks/matchHooks/useMyPublicId";
import { useMatchData } from "@/hooks/matchHooks/useMatchData";

const DTO_TYPE = "TRADE_PLAYER";

const defaultPlayerResources = (value: undefined | 0): PlayerResources => ({
  "BRICK": value,
  "SHEEP": value,
  "WHEAT": value,
  "WOOD": value,
});

const addResourcesFromTrade = (playerResources: PlayerResources, trade: PlayerTrade, createdBy: "ME" | "NOT_ME") => {
  resources.forEach(resource => {
    playerResources[resource] = (createdBy === "ME")
      ? (playerResources[resource] ?? 0) + (trade.requested[resource] ?? 0)
      : (playerResources[resource] ?? 0) - (trade.requested[resource] ?? 0);
    playerResources[resource] = (createdBy === "ME")
      ? (playerResources[resource] ?? 0) - (trade.offered[resource] ?? 0)
      : (playerResources[resource] ?? 0) + (trade.offered[resource] ?? 0);
    // 0 should not be shown as difference -> undefined
    if (playerResources[resource] === 0) {
      playerResources[resource] = undefined;
    }
  });
};

type TradeWithPlayerDialogProps = {
  targetId?: number | undefined;
}

export interface TradeWithPlayerDialogHandle {
  open: () => void;
}

const TradeWithPlayerDialog = forwardRef<TradeWithPlayerDialogHandle, TradeWithPlayerDialogProps>((props, ref) => {
  const { targetId } = props;

  const myRessources: PlayerResources | undefined = useMyRessources();
  const { fetchWithAuth } = useAuth();
  const { uuid, showGrantedResources } = useGame();
  const { isError, openErrorDialogIfMessage, errorDialog } = useError();
  const { repository } = useMatchRepository();
  const isMyTurn = useIsMyTurn();
  const playerTrades = usePlayerTrades();
  const myPublicId = useMyPublicId();
  const matchData = useMatchData();

  const [selectedResourcesGive, setSelectedResourcesGive] = useState<PlayerResources>(defaultPlayerResources(0));
  const [selectedResourcesGet, setSelectedResourcesGet] = useState<PlayerResources>(defaultPlayerResources(0));
  const [editingTrade, setEditingTrade] = useState<PlayerTrade | null>(null);

  const dialogOverviewRef = useRef<DialogHandle | null>(null);
  const dialogCreateRef = useRef<DialogHandle | null>(null);
  
  useImperativeHandle(ref, () => ({
    open,
  }));

  useSseListeners(useMemo(() => [
    {
      type: "playerTrades",
      action: (event: MessageEvent) => {
        const playerTradesUpdated: PlayerTrade[] = JSON.parse(event.data);

        // show granted resources if status of relevant trades changed to ACCEPTED
        repository.playerTrades.forEach(tradeBefore => {
          const tradeUpdated = playerTradesUpdated.find(t => t.id === tradeBefore.id);
          if (tradeUpdated && (tradeUpdated.status === "ACCEPTED" && tradeBefore.status !== "ACCEPTED")) {
            if (tradeUpdated.createdBy === myPublicId || tradeUpdated.target.playerId === myPublicId) {
              const grantedResources: PlayerResources = defaultPlayerResources(undefined);
              if (tradeUpdated.createdBy === myPublicId) {
                addResourcesFromTrade(grantedResources, tradeUpdated, "ME");
              }
              if (!tradeUpdated.target.allPlayers && tradeUpdated.target.playerId === myPublicId) {
                addResourcesFromTrade(grantedResources, tradeUpdated, "NOT_ME");
              }
              showGrantedResources(grantedResources);
            }
          }
        });

        repository.setPlayerTrades(playerTradesUpdated);
      },
    },
  ], [repository, showGrantedResources, myPublicId]));

  const open = () => {
    dialogOverviewRef.current?.openDialog();
  };

  const openCreateOffer = () => {
    setEditingTrade(null);
    setSelectedResourcesGive(defaultPlayerResources(0));
    setSelectedResourcesGet(defaultPlayerResources(0));
    dialogCreateRef.current?.openDialog();
  };

  const openEditOffer = (trade: PlayerTrade) => {
    setEditingTrade(trade);
    setSelectedResourcesGive(structuredClone(trade.requested));
    setSelectedResourcesGet(structuredClone(trade.offered));
    dialogCreateRef.current?.openDialog();
  };

  const createOffer = async () => {
    const target: TradingTarget = isMyTurn
      ? { allPlayers: true }
      : { allPlayers: false, playerId: targetId };
    const response = await fetchWithAuth(`/games/${uuid}/makeMove`, "POST", JSON.stringify({
      type: DTO_TYPE,
      status: "OFFERED",
      target: target,
      offered: selectedResourcesGive,
      requested: selectedResourcesGet,
    }));
    if (isError(response)) {
      openErrorDialogIfMessage(response);
      return;
    }
    dialogCreateRef.current?.closeDialog();
  };

  const editOffer = async () => {
    const response = await fetchWithAuth(`/games/${uuid}/makeMove`, "POST", JSON.stringify({
      ...editingTrade,
      type: DTO_TYPE,
      status: "CHANGED",
      offered: selectedResourcesGet,
      requested: selectedResourcesGive,
    }));
    if (isError(response)) {
      openErrorDialogIfMessage(response);
      return;
    }
    setEditingTrade(null);
    dialogCreateRef.current?.closeDialog();
  };

  const denyOrCancelOrAcceptOffer = async (trade: PlayerTrade, status: TradingStatus) => {
    const response = await fetchWithAuth(`/games/${uuid}/makeMove`, "POST", JSON.stringify({
      type: DTO_TYPE,
      status: status,
      id: trade.id,
    }));
    if (isError(response)) {
      openErrorDialogIfMessage(response);
      return;
    }
  };

  return (
    <>
      { errorDialog }

      <Dialog title="Your trades" ref={dialogOverviewRef} id={styles["overviewDialog"]}>
        <button onClick={openCreateOffer}>Create offer</button>
        { playerTrades?.map(trade =>
          <div key={trade.id}>
            { (trade.status === "OFFERED" || trade.status === "CHANGED") && (trade.createdBy === myPublicId || trade.target.allPlayers || (!trade.target.allPlayers && trade.target.playerId === myPublicId)) && (trade.createdBy === myPublicId || !playerTrades.find(t => t.predecessorId === trade.id)) &&
              <div className={styles["overviewDialog__trade"]}>
                <span>{`${trade.id} | Status: ${trade.status === "OFFERED" ? "New" : "Changes proposed"}${(trade.predecessorId !== undefined && playerTrades.find(t => t.id === trade.predecessorId)) ? ` | Based on: ${playerTrades.find(t => t.id === trade.predecessorId)?.id}` : ""}`}</span>
                <div className={styles["overviewDialog__trade__resources"]}>
                  <div className={styles["overviewDialog__trade__resources__column"]}>
                    <span>Offered by</span>
                    {/* possibly a problem: Players could choose the username "You" or similar and confuse others */}
                    <span>{(myPublicId === trade.createdBy)
                      ? "You"
                      : (matchData?.players.find(player => player.publicId === trade.createdBy)?.username ?? "<unknown>")}</span>
                    { resources.map(resource =>
                      !trade.offered[resource] ? undefined :
                        <span key={resource}>
                          {`${trade.offered[resource]}x ${resource.toLowerCase()}`}
                        </span>,
                    )}
                  </div>
                  <span>⇄</span>
                  <div className={styles["overviewDialog__trade__resources__column"]}>
                    <span>Requested from</span>
                    <span>{(!trade.target.allPlayers && trade.target.playerId === myPublicId)
                      ? "You"
                      : (trade.target.allPlayers ? "<all>" : (matchData?.players.find(player => player.publicId === trade.target.playerId)?.username ?? "<unknown>"))}</span>
                    { resources.map(resource =>
                      !trade.requested[resource] ? undefined :
                        <span key={resource}>
                          {`${trade.requested[resource]}x ${resource.toLowerCase()}`}
                        </span>,
                    )}
                  </div>
                </div>
                <div>
                  { ((trade.status === "OFFERED" && (myPublicId !== trade.createdBy) && (trade.target.allPlayers || myPublicId === trade.target.playerId)) || (trade.status === "CHANGED" && (myPublicId === trade.createdBy))) &&
                    <>
                      <button
                        onClick={() => denyOrCancelOrAcceptOffer(trade, "ACCEPTED")}
                        disabled={(trade.createdBy === myPublicId)
                          ? (resources.map(resource => !trade.offered[resource] || (myRessources !== undefined && myRessources[resource] !== undefined && (myRessources[resource] >= trade.offered[resource]))).find(v => !v) !== undefined)
                          : (resources.map(resource => !trade.requested[resource] || (myRessources !== undefined && myRessources[resource] !== undefined && (myRessources[resource] >= trade.requested[resource]))).find(v => !v) !== undefined)}>
                          Accept
                      </button>
                      { !trade.target.allPlayers &&
                        <button onClick={() => denyOrCancelOrAcceptOffer(trade, "DENIED")}>Deny</button>
                      }
                    </>
                  }
                  { trade.status === "OFFERED" && (myPublicId !== trade.createdBy) && (trade.target.allPlayers || myPublicId === trade.target.playerId) &&
                    <button
                      onClick={() => openEditOffer(trade)}>
                        Propose changes
                    </button>
                  }
                  { trade.status === "OFFERED" && (myPublicId === trade.createdBy) &&
                    <button onClick={() => denyOrCancelOrAcceptOffer(trade, "CANCELLED")}>Cancel</button>
                  }
                </div>
              </div>
            }
          </div>,
        )}
      </Dialog>

      <Dialog title={`${!editingTrade ? "Create" : "Edit"} offer`} ref={dialogCreateRef} id={styles["createEditDialog"]}>
        <div className={styles["createEditDialog__config"]}>
          <div className={styles["createEditDialog__config__column"]}>
            <span>Give</span>
            { myRessources && resources.map(resource => 
              <div key={resource} className={styles["createEditDialog__config__column__resourceInfo"]}>
                <input
                  type="number"
                  min={0}
                  value={selectedResourcesGive[resource]}
                  disabled={(!editingTrade && (0 === (myRessources[resource] ?? 0))) || (selectedResourcesGet !== undefined && selectedResourcesGet[resource] !== undefined && selectedResourcesGet[resource] > 0)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const numValue = Number(event.target.value);
                    if ((((selectedResourcesGive[resource] ?? 0) < numValue) && (numValue > (myRessources[resource] ?? 0)))) {
                      return;
                    }
                    selectedResourcesGive[resource] = numValue;
                    setSelectedResourcesGive(selectedResourcesGive);
                  }}
                />
                <span>{resource.toLowerCase()}</span>
              </div>)
            }
          </div>
          <span>→</span>
          <div className={styles["createEditDialog__config__column"]}>
            <span>Get</span>
            { myRessources && resources.map(resource => 
              <div key={resource} className={styles["createEditDialog__config__column__resourceInfo"]}>
                <input
                  type="number"
                  min={0}
                  value={selectedResourcesGet[resource]}
                  disabled={selectedResourcesGive !== undefined && selectedResourcesGive[resource] !== undefined && selectedResourcesGive[resource] > 0}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    selectedResourcesGet[resource] = Number(event.target.value);
                    setSelectedResourcesGet(selectedResourcesGet);
                  }}
                />
                <span>{resource.toLowerCase()}</span>
              </div>)
            }
          </div>
        </div>
        <button
          disabled={resources.map(resource => (!selectedResourcesGive[resource]) || (selectedResourcesGive[resource] !== undefined && myRessources !== undefined && myRessources[resource] !== undefined && (selectedResourcesGive[resource] <= myRessources[resource]))).find(v => !v) !== undefined}
          onClick={!editingTrade ? createOffer : editOffer}>
          {`${!editingTrade ? "Create offer" : "Propose changes"}`}
        </button>
      </Dialog>
    </>
  );
});
TradeWithPlayerDialog.displayName = "TradeWithPlayerDialog";

export default TradeWithPlayerDialog;