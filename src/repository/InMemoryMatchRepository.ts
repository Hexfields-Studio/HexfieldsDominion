import type { Field, MatchRepository, PlayerRepresentation, PlayerRessources, ResourceType } from "./MatchRepository";

class InMemoryMatchRepository implements MatchRepository{
  eventSource: EventSource | undefined;
  subscribers: any[] = [];
  matchData: PlayerRepresentation[] = [   // This is just mock data
    {
      username: "Faker",
      isThisPlayersTurn: true,
      publicId: 1,
      ressources: new Map<ResourceType, number>([
        ["WOOD", 9],
        ["BRICK", 9],
        ["WHEAT", 6],
        ["SHEEP", 6],
      ]),
      chosenPortrait: "KingMale",
    },
    {
      username: "BackStraightenReminder",
      isThisPlayersTurn: false,
      publicId: 2,
      ressources: new Map<ResourceType, number>([
        ["WOOD", 1],
        ["BRICK", 2],
        ["WHEAT", 3],
        ["SHEEP", 4],
      ]),
      chosenPortrait: "ArcherFemale",
    },
  ];
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
    this.fields = fields
  };

  getFields = () => this.fields;

  /* useSyncExternalStore setup */
  subscribe = (listener: any) => {
    this.subscribers.push(listener);
    return () => {
      this.subscribers.filter(l => l !== listener);
    }
  };

  getMatchData = () => this.matchData;

  emitChange = (): void => {
    this.subscribers.forEach(listener => listener());
  };
  /*############################*/

  getMyPublicId = (): number => {
    return 1;
  };

  getMyRessources = (): PlayerRessources | undefined => this.matchData.find(playerRessource => playerRessource.publicId === this.getMyPublicId())?.ressources;
    
  isItMyTurn = (): boolean => this.matchData.find(playerRessource => playerRessource.publicId === this.getMyPublicId())?.isThisPlayersTurn ?? false;

  // Always invoke this when unmounting from Match Page
  closeConnection = (): void => this.eventSource?.close();
}

export default InMemoryMatchRepository;