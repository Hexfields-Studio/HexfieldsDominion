import { useEffect, useRef, useState } from "react";
import "../../index.css";
import "./play.css";
import { useNavigate } from "react-router";
import type { DialogHandle } from "../../components/dialog/dialog";
import Dialog from "../../components/dialog/dialog";
import OptionsButton from "../../components/optionsButton/optionsButton";
import { useAuth } from "../../contexts/AuthContext";
import {STORAGE_KEYS} from "../../constants/storage";

const API_URL = import.meta.env.VITE_API_URL; // .env Dateien

const StartMenu = () => {
  const {token} = useAuth();

  const [lobbyCode, setLobbyCode] = useState<string>(() => localStorage.getItem(STORAGE_KEYS.LAST_LOBBY_CODE) ?? "");

  const navi = useNavigate();
  const dialogEnterLobbycodeRef = useRef<DialogHandle | null>(null);
  const dialogErrorInvalidLobbycodeRef = useRef<DialogHandle | null>(null);

  const createLobby = async () => {
    try {
      console.log("Requesting Lobby from URL: " + API_URL);
      const responseCode = await fetch(`${API_URL}/lobbies`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const responseCodeJson = await responseCode.json();
      const fetchedLobbyCode = responseCodeJson.lobbyCode;

      setLobbyCode(fetchedLobbyCode);
      localStorage.setItem(STORAGE_KEYS.LAST_LOBBY_CODE, fetchedLobbyCode);

      const responseData = await fetch(`${API_URL}/lobbies/${fetchedLobbyCode}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const reponseDataJson = await responseData.json();
      navi(`/lobby/${fetchedLobbyCode}`, { state: { reponseDataJson } });
    } catch (error) {
      console.error("Error", error);
    }
  };

  const joinLobby = async (formData: FormData) => {
    if (!formData.get("lobbycode")) {
      return;
    }
    const responseData = await fetch(`${API_URL}/lobbies/${lobbyCode}`, {
      headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
      }
    });
    if (responseData.status === 400) {
      dialogErrorInvalidLobbycodeRef.current?.toggleDialog();
      return;
    }
    const reponseDataJson = await responseData.json();
    localStorage.setItem(STORAGE_KEYS.LAST_LOBBY_CODE, lobbyCode);
    navi(`/lobby/${lobbyCode}`, { state: { reponseDataJson } });
  };

  const isLobbycodeValid = (codeToCheck: string) => codeToCheck && codeToCheck.match("^([a-zA-Z0-9])+$");

  return (
    <>
      {/* Join Lobby Dialog */}
      <Dialog title="Lobby beitreten" id="lobbycodeDialog" ref={dialogEnterLobbycodeRef}>
        <form action={(e) => joinLobby(e)}>
          <p>Lobbycode eingeben:</p>
          <input className="input-center" type="text" name="lobbycode" value={lobbyCode} onChange={(e) => setLobbyCode(e.target.value.trim())} placeholder="Lobby Code" />
          <div className="center-row mb-12">
            <button disabled={!isLobbycodeValid(lobbyCode)} type="submit">Beitreten</button>
          </div>
        </form>
      </Dialog>

      <Dialog errorMessage="Es wurde keine Lobby mit diesem Code gefunden." ref={dialogErrorInvalidLobbycodeRef}/>
      
      <OptionsButton/>

      <h1>Start Menu</h1>

      {/* Center box */}
      <div className="boxed">
        <div className="center-row mb-12">
          <button onClick={createLobby}>Lobby erstellen</button>
        </div>

        <div className="center-row mb-12">
          <button onClick={() => dialogEnterLobbycodeRef.current?.toggleDialog()}>Lobby beitreten</button>
        </div>

        <div style={{ marginTop: 8 }}>
          Last Lobby Code: <strong>{lobbyCode ? lobbyCode : "None"}</strong>
        </div>
      </div>
    </>
  );
};

export default StartMenu;