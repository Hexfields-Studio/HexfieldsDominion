import { useRef, useState } from "react";
import "@/index.css";
import "./play.css";
import { useNavigate } from "react-router";
import type { DialogHandle } from "@/components/dialog/dialog";
import Dialog from "@/components/dialog/dialog";
import OptionsButton from "@/components/optionsButton/optionsButton";
import { STORAGE_KEYS } from "@/constants/storage";
import { useAuth } from "@/contexts/contexts";
import { useError } from "@/hooks/useError";

const StartMenu = () => {
  const { fetchWithAuth } = useAuth();
  const { errorDialog, isError, openErrorDialogIfMessage } = useError();

  const [lobbyCode, setLobbyCode] = useState<string>(localStorage.getItem(STORAGE_KEYS.LAST_LOBBY_CODE) ?? "");

  const navi = useNavigate();
  const dialogEnterLobbycodeRef = useRef<DialogHandle | null>(null);

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

    executeJoin(lobbyCode);
  };

  const executeJoin = async (lobbyCode: string) => {
    const responseLobbyExists = await fetchWithAuth(`/lobbies/${lobbyCode}/exists`, "GET");
    if (isError(responseLobbyExists)) {
      openErrorDialogIfMessage(responseLobbyExists);
      return;
    }
    
    navi(`/lobby/${lobbyCode}`);
  };

  const isLobbycodeValid = (codeToCheck: string) => codeToCheck && codeToCheck.match("^([a-zA-Z0-9])+$");

  return (
    <>
      {/* Join Lobby Dialog */}
      <Dialog title="Join Lobby" id="lobbycodeDialog" ref={dialogEnterLobbycodeRef}>
        <form action={(e) => joinLobby(e)}>
          <p>Enter Lobbycode:</p>
          <input className="input-center" type="text" name="lobbycode" value={lobbyCode} onChange={(e) => setLobbyCode(e.target.value.trim())} placeholder="Lobby Code" />
          <div className="center-row mb-12">
            <button disabled={!isLobbycodeValid(lobbyCode)} type="submit">Join</button>
          </div>
        </form>
      </Dialog>

      { errorDialog }
      
      <OptionsButton/>

      <div style={{ textAlign: "center", margin: "2em 0em 1em 0em" }}>
        <img className="logo" src={`${import.meta.env.BASE_URL}logo_big.png`} alt="Logo" style={{ width: "20em", height: "auto" }} />
      </div>


      {/* Center box */}
      <div className="boxed">

        <h2>Start Menu</h2>

        <div className="center-row">
          <button onClick={createLobby}>Create Lobby</button>
          <button onClick={() => dialogEnterLobbycodeRef.current?.toggleDialog()}>Join Lobby</button>
        </div>

        <div style={{ marginTop: 20 }}>
          Last Lobby Code: <strong>{lobbyCode ? lobbyCode : "None"}</strong>
        </div>
      </div>
    </>
  );
};

export default StartMenu;