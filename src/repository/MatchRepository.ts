// Keep in mind: all existing ressources are actually sent from the backend
export const resources = ["WOOD", "BRICK", "WHEAT", "SHEEP"] as const;
export const resourcesFields = [...resources, "DUNES"] as const;

export type Field = {
  numberChip: number;
  pos: {
    q: number;
    r: number;
  }
  resource: typeof resourcesFields[number];
}

export type PlayerResources = Record<typeof resources[number], number | undefined>;

export type Recipes = Record<StructureType, Record<typeof resources[number], number>>;

// Keep in mind: This PlayerRepresentation is a simplified/untrue version of what the backend would actually send
export type PlayerRepresentation = {
    username: string,
    publicId: number,   // Not sure if this is the correct use of the "publicId"
    resources: PlayerResources,
    chosenPortrait: string, //Invented, keep portraits or use colors?
    points: number,
    playerHue: number // hue value where 0 = #ff0000, 120 = #00ff00, 240 = #0000ff, etc.
}

export type StructureType = "SETTLEMENT" | "TOWN" | "STREET";

export type AxialPosition = {
	q: number,
	r: number
}

export type Structure = {
  rotation: number,
  type: StructureType,
	ownerId: number,
	pos: AxialPosition[],
	recipe: any
}

export type TradingStatus = "OFFERED" | "CHANGED" | "ACCEPTED" | "DENIED" | "CANCELLED";

export type TradingTarget = {
  allPlayers: boolean,
  playerId?: number | undefined
}

export type PlayerTrade = {
  id: number,
  predecessorId?: number,
  status: TradingStatus,
  target: TradingTarget,
  createdBy: number,
  offered: PlayerResources,
  requested: PlayerResources,
}

export type MatchData = {
    playerCurrentTurn: number,
    players: PlayerRepresentation[],
    currentDiceResult: number[] | null,
    structures: Structure[],
    rolledDiceThisTurn: boolean,
    winner: PlayerRepresentation | null
    playerHueMap: PlayerHueMap
}

export type PlayerHueMap = Map<number, number>; // Map<publicId, playerHue>

export interface MatchRepository{
    subscribe: (subscriber: any) => void
    setMatchData: (matchData: MatchData) => void
    getMatchData: () => MatchData | undefined
    emitChange: () => void
    
    setRecipes: (recipes: Recipes) => void
    getRecipes: () => Recipes | undefined
    setFields: (fields: Field[]) => void
    getFields: () => Field[]
    setStructures: (structures: Structure[]) => void
    getStructures: () => Structure[]
    setPlayerTrades: (playerTrades: PlayerTrade[]) => void
    getPlayerTrades: () => PlayerTrade[]
    getMyPublicId: () => number | undefined
    getMyRessources: () => PlayerResources | undefined
    isItMyTurn: () => boolean
    setCurrentPlayersTurn: (publicId: number) => void
    getCurrentPlayersTurn: () => number | undefined
    setCurrentDiceResult: (diceResult: number[] | null) => void;
    getCurrentDiceResult: () => number[] | null;
    isRolledDiceThisTurn: () => boolean;
    getWinner: () => PlayerRepresentation | null;
}