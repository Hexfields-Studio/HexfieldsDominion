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

export type PlayerResources = Record<typeof resources[number], number>;

// Keep in mind: This PlayerRepresentation is a simplified/untrue version of what the backend would actually send
export type PlayerRepresentation = {
    username: string,
    publicId: number,   // Not sure if this is the correct use of the "publicId"
    resources: PlayerResources,
    chosenPortrait: string, //Invented, keep portraits or use colors?
    points: number
}

export type MatchData = {
    playerCurrentTurn: number,
    players: PlayerRepresentation[],
    currentDiceResult: number[] | null,
    rolledDiceThisTurn: boolean,
    winner: PlayerRepresentation | null
}

export interface MatchRepository{
    subscribe: (subscriber: any) => void
    setMatchData: (matchData: MatchData) => void
    getMatchData: () => MatchData | undefined
    emitChange: () => void
    
    setFields: (fields: Field[]) => void
    getFields: () => Field[]
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