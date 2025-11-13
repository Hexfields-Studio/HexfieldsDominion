import { useEffect, useRef, useState } from "react";
import "../../index.css";
import "./play.css";
import { getStorageItem, STORAGE_KEYS } from "../../constants/storage";
import { useNavigate } from "react-router";
import type { DialogHandle } from "../../components/dialog/dialog";
import Dialog from "../../components/dialog/dialog";
import LoggedIn from "../loggedIn/loggedIn";

const API_URL = import.meta.env.VITE_API_URL; // .env Dateien

const StartMenu = () => {
  const [isLoggedIn] = useState(getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false));
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const navi = useNavigate();
  const dialogEnterLobbycodeRef = useRef<DialogHandle | null>(null);
  const dialogErrorInvalidLobbycodeRef = useRef<DialogHandle | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navi("/"); // Wenn nicht eingeloggt, zurück zur Home Page
    }
  }, [isLoggedIn, navi]);

  const createLobby = async () => {
    try {
      // curl -X PATCH /lobbies -> {"lobbyCode":"XXXXXXX"}
      console.log("Requesting Lobby from URL: " + API_URL);
      const responseCode = await fetch(`${API_URL}/lobbies`, {
          method: 'PATCH'
      });
      const responseCodeJson = await responseCode.json();

      // Setze Lobby Code
      const fetchedLobbyCode = responseCodeJson.lobbyCode;
      setLobbyCode(fetchedLobbyCode);

      // curl -X GET /XXXXXXX -> lobby data 
      const responseData = await fetch(`${API_URL}/lobbies/${fetchedLobbyCode}`);
      const reponseDataJson = await responseData.json();        
      
      // Navigiere zur Lobby
      navi(`/lobby/${fetchedLobbyCode}`, { state: { reponseDataJson } });
    } catch (error) {
        console.error('Error', error);
    }
  };

  const joinLobby = async (formData: FormData) => {
      if (!formData.get("lobbycode")) {
        return;
      }

      // curl -X GET /XXXXXXX -> lobby data 
      const responseData = await fetch(`${API_URL}/lobbies/${lobbyCode}`);
      if (responseData.status === 400) {
        dialogErrorInvalidLobbycodeRef.current?.toggleDialog();
        return;
      }

      const reponseDataJson = await responseData.json();        
      
      // Navigiere zur Lobby
      navi(`/lobby/${lobbyCode}`, { state: { reponseDataJson } });
  }

  const isLobbycodeValid = (codeToCheck: string) => codeToCheck && codeToCheck.match("^([a-zA-Z0-9])+$");

  return (
      <>
        <Dialog title="Lobby beitreten" id="lobbycodeDialog" ref={dialogEnterLobbycodeRef}>
          <form action={(e) => joinLobby(e)}>
            <p>Lobbycode eingeben:</p>
            <input type="text" name="lobbycode" value={lobbyCode} onChange={(e) => setLobbyCode(e.target.value.trim())} placeholder="Lobby Code"/>
            <button disabled={!isLobbycodeValid(lobbyCode)} type="submit">Beitreten</button>
          </form>
        </Dialog>

        <Dialog errorMessage="Es wurde keine Lobby mit diesem Code gefunden." ref={dialogErrorInvalidLobbycodeRef}/>

        
        <LoggedIn>
          <h1>Start Menu</h1>

          <button onClick={createLobby}>Lobby erstellen</button>

          <button onClick={() => dialogEnterLobbycodeRef.current?.toggleDialog()}>Lobby beitreten</button>
        </LoggedIn>
      </>
  );
}

export default StartMenu;