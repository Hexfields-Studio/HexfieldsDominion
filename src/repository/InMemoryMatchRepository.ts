import type { Field, MatchData, MatchRepository, PlayerRepresentation, PlayerResources, Structure, PlayerHueMap } from "./MatchRepository";
import { getStorageItem } from "@/constants/storage";

class InMemoryMatchRepository implements MatchRepository{
  subscribers: any[] = [];
  matchData: MatchData | undefined;
  fields: Field[] = [];
  structures: Structure[] = [];
  playerHueMap: PlayerHueMap = new Map<number, number>();

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

    this.structures = matchData.structures.map(structure =>
      this.structures.find(old => old.pos.map(h => `${h.q},${h.r}`).sort().join("|") === structure.pos.map(h => `${h.q},${h.r}`).sort().join("|") && old.type === structure.type)
      ?? ({...structure, rotation: Math.random() * 20 - 10} as Structure)
    )

    console.log(this.structures.length)

    //const newStructures: Structure[] =  matchData.structures
    //    .filter(structure => !this.structures.find(old => old.pos.map(h => `${h.q},${h.r}`).sort().join("|") === structure.pos.map(h => `${h.q},${h.r}`).sort().join("|") && old.type !== structure.type))
    //    .map(structure => ({...structure, rotation: Math.random() * 20 - 10} as Structure))

    //this.structures = [...this.structures, ...newStructures];
     //= matchData.structures.map(structure => ({...structure, rotation: Math.random() * 20 - 10} as Structure));
    const hueMap = new Map<number, number>();
    matchData.players.forEach(player => {
      hueMap.set(player.publicId, player.playerHue);
    });
    this.playerHueMap = hueMap;
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

  getPlayerHueMap = () => this.playerHueMap;

  setPlayerHueMap = (map: PlayerHueMap) => this.playerHueMap = map;
}
export default InMemoryMatchRepository;