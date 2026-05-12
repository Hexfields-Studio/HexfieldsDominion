import { useRef, useState } from "react";
import "@/index.css";
import "./play.css";
import { useNavigate } from "react-router";
import type { DialogHandle } from "@/components/dialog/dialog";
import Dialog from "@/components/dialog/dialog";
import OptionsButton from "@/components/optionsButton/optionsButton";
import { STORAGE_KEYS } from "@/constants/storage";
import { useAuth } from "@/contexts/contexts";

const StartMenu = () => {
  const { fetchWithAuth } = useAuth();

  const [lobbyCode, setLobbyCode] = useState<string>(localStorage.getItem(STORAGE_KEYS.LAST_LOBBY_CODE) ?? "");

  const navi = useNavigate();
  const dialogEnterLobbycodeRef = useRef<DialogHandle | null>(null);
  const dialogErrorInvalidLobbycodeRef = useRef<DialogHandle | null>(null);

  const createLobby = async () => {
    // create lobby
    const responseCode = await fetchWithAuth("/lobbies", "PATCH");
    if (!responseCode || responseCode?.status !== 200) {
      return;
    }
    const responseCodeJson = await responseCode.json();
    const fetchedLobbyCode = responseCodeJson.lobbyCode;

    // join created lobby
    executeJoin(fetchedLobbyCode);
  };

  const joinLobby = async (formData: FormData) => {
    if (!formData.get("lobbycode")) {
      return;
    }

    executeJoin(lobbyCode, () => dialogErrorInvalidLobbycodeRef.current?.toggleDialog());
  };

  const executeJoin = async (lobbyCode: string, notFoundAction?: (() => void)) => {
    const responseLobbyExists = await fetchWithAuth(`/lobbies/${lobbyCode}/exists`, "GET");
    if (!responseLobbyExists || responseLobbyExists.status !== 200) {
      return;
    }

    const responseText = await responseLobbyExists.text();
    if (responseText !== "true") {
      if (notFoundAction) {
        notFoundAction();
      }
      return;
    }
    
    navi(`/lobby/${lobbyCode}`);
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