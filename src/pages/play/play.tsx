import { useEffect, useRef, useState } from "react";
import "../../index.css";
import "./play.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../../constants/storage";
import { useNavigate } from "react-router";
import type { DialogHandle } from "../../components/dialog/dialog";
import Dialog from "../../components/dialog/dialog";
import LoggedIn from "../loggedIn/loggedIn";

const API_URL = import.meta.env.VITE_API_URL; // .env Dateien

const StartMenu = () => {
  const [isLoggedIn] = useState(getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false));
  const [lobbyCode, setLobbyCode] = useState("");
  const navi = useNavigate();
  const dialogRef = useRef<DialogHandle | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navi("/"); // Wenn nicht eingeloggt, zurück zur Home Page
    }
  }, [isLoggedIn, navi]);

  const handleLogout = () => {
    setStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false); // TypeScript/Runtime-Mismatch. Funktioniert trotz Fehler.
    navi("/");
  };

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
        alert("Es wurde keine Lobby mit diesem Code gefunden.");
        return;
      }

      const reponseDataJson = await responseData.json();        
      
      // Navigiere zur Lobby
      navi(`/lobby/${lobbyCode}`, { state: { reponseDataJson } });
  }

  return (
      <>
        <Dialog title="Lobby beitreten" id="lobbycodeDialog" ref={dialogRef}>
          <form action={(e) => joinLobby(e)}>
            <p>Lobbycode eingeben:</p>
            <input type="text" name="lobbycode" onChange={(e) => setLobbyCode(e.target.value)} placeholder="Lobby Code"/>
            <button disabled={!lobbyCode.trim()} type="submit">Beitreten</button>
          </form>
        </Dialog>

        <LoggedIn>
          <h1>Start Menu</h1>
          
          <p>
            Logged In: {isLoggedIn ? "true" : "false"} <br/>
            <button onClick={handleLogout}>Log out</button><br/>
          </p>

          <p>
            <button onClick={createLobby}>Lobby erstellen</button>
          </p>

          <button onClick={() => dialogRef.current?.toggleDialog()}>Lobby beitreten</button>
        </LoggedIn>
      </>
  );
}

export default StartMenu;