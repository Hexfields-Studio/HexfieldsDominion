import { useEffect, useRef, useState } from "react";
import "../../index.css";
import "./play.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../../constants/storage";
import { useNavigate } from "react-router";
import type { DialogHandle } from "../../components/dialog/dialog";
import Dialog from "../../components/dialog/dialog";

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
    setStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false);
    navi("/");
  };

  const createLobby = async () => {
    try {
      console.log("Requesting Lobby from URL: " + API_URL);
      const responseCode = await fetch(`${API_URL}/lobbies`, { method: "PATCH" });
      const responseCodeJson = await responseCode.json();
      const fetchedLobbyCode = responseCodeJson.lobbyCode;
      setLobbyCode(fetchedLobbyCode);

      const responseData = await fetch(`${API_URL}/lobbies/${fetchedLobbyCode}`);
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
    const responseData = await fetch(`${API_URL}/lobbies/${lobbyCode}`);
    if (responseData.status === 400) {
      alert("Es wurde keine Lobby mit diesem Code gefunden.");
      return;
    }
    const reponseDataJson = await responseData.json();
    navi(`/lobby/${lobbyCode}`, { state: { reponseDataJson } });
  };

  return (
    <>
      {/* Join Lobby Dialog */}
      <Dialog title="Lobby beitreten" id="lobbycodeDialog" ref={dialogRef}>
        <form action={(e) => joinLobby(e)}>
          <p>Lobbycode eingeben:</p>
          <input className="input-center" type="text" name="lobbycode" onChange={(e) => setLobbyCode(e.target.value)} placeholder="Lobby Code" />
          <div className="center-row mb-12">
            <button type="submit">Beitreten</button>
          </div>
        </form>
      </Dialog>

      <h1>Start Menu</h1>

      {/* Center box */}
      <p className="boxed">
        <div className="center-row mb-12">
          <button onClick={createLobby}>Lobby erstellen</button>
        </div>

        <div className="center-row mb-12">
          <button onClick={() => dialogRef.current?.toggleDialog()}>Lobby beitreten</button>
        </div>

        {lobbyCode ? <div style={{ marginTop: 8 }}>Letzter Lobby-Code: <strong>{lobbyCode}</strong></div> : null}
      </p>

      {/* Footer */}
      <p className="footer-bottom">
        Logged In: {isLoggedIn ? "true" : "false"} <br />
        <button onClick={handleLogout}>Log out</button>
      </p>
    </>
  );
};

export default StartMenu;