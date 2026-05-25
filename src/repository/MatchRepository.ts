// Keep in mind: all existing ressources are actually sent from the backend
export const resources = ["WOOD", "BRICK", "WHEAT", "SHEEP"] as const;
export const resourcesFields = [...resources, "DUNES"] as const;

export type PlayerResources = Record<typeof resources[number], number>;

// Keep in mind: This PlayerRepresentation is a simplified/untrue version of what the backend would actually send
export type PlayerRepresentation = {
    username: string,
    publicId: number,   // Not sure if this is the correct use of the "publicId"
    resources: PlayerResources
    chosenPortrait: string //Invented, keep portraits or use colors?
}

export type MatchData = {
    playerCurrentTurn: number,
    players: PlayerRepresentation[]
}

export interface MatchRepository{
    subscribe: (subscriber: any)=>void
    setMatchData: (matchData: MatchData) => void
    getMatchData: ()=>MatchData | undefined
    emitChange: ()=>void
    
    getMyPublicId: ()=>number | undefined
    getMyRessources: ()=>PlayerResources | undefined
    isItMyTurn: ()=>boolean
    setCurrentPlayersTurn: (publicId: number) => void
    getCurrentPlayersTurn: () => number | undefined
    closeConnection: ()=>void
}