import type { Field, MatchData, MatchRepository, PlayerResources, PlayerRepresentation } from "./MatchRepository";
import { getStorageItem } from "@/constants/storage";

class InMemoryMatchRepository implements MatchRepository{
  eventSource: EventSource | undefined;
  subscribers: any[] = [];
  matchData: MatchData | undefined;
  fields: Field[] = [];

  constructor(){
    /* Connect to backends SSE endpoint. Example code:

            const eventSource = new EventSource("http://localhost:3000/events"); // On connect backend could instantly send "loadMatches" data (see https://github.com/Hexfields-Studio/HexfieldsDominion-Artefacts/blob/main/srs/game/match_starten/match_starten.md#sequenzdiagramm)
            
            eventSource.onmessage = (event) => {        // Then collect the data
                const data = JSON.parse(event.data);
                updateAllHooks(data);
            };

            eventSource.onerror = (err) => {
                console.error("SSE error:", err);
            };
        
        */
        
  }

  setFields = (fields: Field[]) => {
    this.fields = fields;
  };

  getFields = () => this.fields;

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

  getMyPoints = (): number => {
    return this.matchData?.players.find(playerRessource => playerRessource.publicId === this.getMyPublicId())?.points ?? 0;
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

  // Always invoke this when unmounting from Match Page
  closeConnection = (): void => this.eventSource?.close();
}

export default InMemoryMatchRepository;