import type { Field, MatchData, MatchRepository, PlayerRepresentation, PlayerResources, Structure } from "./MatchRepository";
import { getStorageItem } from "@/constants/storage";

class InMemoryMatchRepository implements MatchRepository{
  subscribers: any[] = [];
  matchData: MatchData | undefined;
  fields: Field[] = [];
  structures: Structure[] = [];

  setFields = (fields: Field[]) => {
    this.fields = fields;
  };

  getFields = () => this.fields;

  setStructures = (structures: Structure[]) => {
	  this.structures = structures;
  };

  getStructures = () => this.structures;

  /* useSyncExternalStore setup */
  subscribe = (listener: any) => {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter(
        l => l !== listener,
      );
    };
  };

  setMatchData = (matchData: MatchData) => {
    this.matchData = matchData;
    this.structures = matchData.structures;
  };

  getMatchData = () => this.matchData;

  emitChange = (): void => {
    this.subscribers.forEach(listener => listener());
  };
  /*############################*/

  getMyPublicId = (): number | undefined => {
    return getStorageItem("playerId", undefined);
  };

  getMyRessources = (): PlayerResources | undefined => {
    return this.matchData?.players.find(playerRessource => playerRessource.publicId === this.getMyPublicId())?.resources;
  };

  isItMyTurn = (): boolean => {
    if (this.matchData === undefined) {
      return false;
    }
    return this.matchData.playerCurrentTurn === this.getMyPublicId();
  };

  setCurrentPlayersTurn = (publicId: number) => {
    if (this.matchData === undefined) {
      return;
    }
    this.matchData.playerCurrentTurn = publicId;
  };

  getCurrentPlayersTurn = (): number | undefined => this.matchData?.playerCurrentTurn;

  setCurrentDiceResult = (diceResult: number[] | null) => {
    if (this.matchData === undefined) {
      return;
    }
    this.matchData.currentDiceResult = diceResult;
  };

  getCurrentDiceResult = (): number[] | null => this.matchData?.currentDiceResult ?? null;

  isRolledDiceThisTurn = (): boolean => this.matchData?.rolledDiceThisTurn ?? false;

  getWinner = (): PlayerRepresentation | null => this.matchData?.winner ?? null;
}

export default InMemoryMatchRepository;