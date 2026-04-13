// Keep in mind: all existing ressources are actually sent from the backend
export type Ressource = "wood" | "brick" | "wheat" | "sheep";

export type PlayerRessources = Map<Ressource, number>;

// Keep in mind: This PlayerRepresentation is a simplified/untrue version of what the backend would actually send
export type PlayerRepresentation = {
    username: string,
    isThisPlayersTurn: boolean,
    publicId: number,   // Not sure if this is the correct use of the "publicId"
    ressources: PlayerRessources
    chosenPortrait: string //Invented, keep portraits or use colors?
}

export interface MatchRepository{
    getMyPublicId: ()=>number
    getMatchData: ()=>void
    isItMyTurn: ()=>boolean
    keepMeUpdated: (setStateAction: React.Dispatch<React.SetStateAction<any>>)=>void    //This method adds SetStateAction functions to a list. All functions from that list get called with the new data when available.
    updateThem: ()=>void
    closeConnection: ()=>void
}