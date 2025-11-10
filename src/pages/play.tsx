import { useEffect, useState } from "react";
import "../index.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../constants/storage";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL; // .env Dateien

const StartMenu = () => {
  const [isLoggedIn] = useState(getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false));
  const [lobbyCode, setLobbyCode] = useState("");
  const navi = useNavigate();

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
      const responseData = await fetch(`${API_URL}/${fetchedLobbyCode}`);
      const reponseDataJson = await responseData.json();        
      
      // Navigiere zur Lobby
      navi(`/${fetchedLobbyCode}`, { state: { reponseDataJson } });
    } catch (error) {
        console.error('Error', error);
    }
  };

  const joinLobby = async () => {
      // curl -X GET /XXXXXXX -> lobby data 
      const responseData = await fetch(`${API_URL}/${lobbyCode}`);
      const reponseDataJson = await responseData.json();        
      
      // Navigiere zur Lobby
      navi(`/${lobbyCode}`, { state: { reponseDataJson } });
  }

  return (
      <>
        <h1>Start Menu</h1>
        
        <p>
          Logged In: {isLoggedIn ? "true" : "false"} <br/>
          <button onClick={handleLogout}>Log out</button><br/>
        </p>

        <p>
          Create a new lobby:<br/>
          <button onClick={createLobby}>Create Lobby</button>
        </p>


        <p>
          Join a lobby:<br/>
          <input type="text" onChange={(e) => setLobbyCode(e.target.value)} placeholder="Lobby Code"/>
          <button onClick={joinLobby}>Join Lobby</button>
        </p>
      </>
  );
}

export default StartMenu;