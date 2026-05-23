// Keep in mind: all existing ressources are actually sent from the backend
export type ResourceType = "WHEAT" | "WOOD" | "BRICK" | "SHEEP" | "DUNES";

export type Field = {
  numberChip: number;
  pos: {
    q: number;
    r: number;
  }
  resource: ResourceType;
}

export type PlayerRessources = Map<ResourceType, number>;

// Keep in mind: This PlayerRepresentation is a simplified/untrue version of what the backend would actually send
export type PlayerRepresentation = {
    username: string,
    isThisPlayersTurn: boolean,
    publicId: number,   // Not sure if this is the correct use of the "publicId"
    ressources: PlayerRessources
    chosenPortrait: string //Invented, keep portraits or use colors?
}

export interface MatchRepository{
    subscribe: (subscriber: any)=>void
    getMatchData: ()=>PlayerRepresentation[]
    emitChange: ()=>void
    
    setFields: (fields: Field[]) => void
    getFields: () => Field[]
    getMyPublicId: ()=>number
    getMyRessources: ()=>PlayerRessources | undefined
    isItMyTurn: ()=>boolean
    closeConnection: ()=>void
}