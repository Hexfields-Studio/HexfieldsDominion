import type { MatchRepository, PlayerRepresentation, PlayerRessources, Ressource } from "./MatchRepository";

class InMemoryMatchRepository implements MatchRepository{
  eventSource: EventSource | undefined;
  subscribers: any[] = [];
  matchData: PlayerRepresentation[] = [   // This is just mock data
    {
      username: "Faker",
      isThisPlayersTurn: true,
      publicId: 1,
      ressources: new Map<Ressource, number>([
        ["wood", 9],
        ["brick", 9],
        ["wheat", 6],
        ["sheep", 6],
      ]),
      chosenPortrait: "KingMale",
    },
    {
      username: "BackStraightenReminder",
      isThisPlayersTurn: false,
      publicId: 2,
      ressources: new Map<Ressource, number>([
        ["wood", 1],
        ["brick", 2],
        ["wheat", 3],
        ["sheep", 4],
      ]),
      chosenPortrait: "ArcherFemale",
    },
  ];

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