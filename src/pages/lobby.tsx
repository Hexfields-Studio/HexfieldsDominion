import { useEffect, useState } from "react";
import "@/index.css";
import { useNavigate, useParams } from "react-router";
import OptionsButton from "@/components/optionsButton/optionsButton";
import Select from "react-select";
import type { SingleValue } from "react-select";
import type { SelectOption } from "@/constants/customTypes";
import { DefaultSelectStyle } from "@/constants/selectStyles";
import { STORAGE_KEYS } from "@/constants/storage";
import { useSseEventSource } from "@/hooks/useSseEventSource";
import { useAuth } from "@/contexts/contexts";
import { useHeartbeat } from "@/hooks/useHeartbeat";

interface Player {
  id: number;
  username: string;
  isAccount: boolean;
}

const selectOptionsMultiplayerMode: SelectOption[] = [
  { value: 0, label: "Echtzeit" },
  { value: 1, label: "Zugbasiert" },
];

const selectOptionsTurnTimeout: SelectOption[] = [
  { value: 0, label: "1 min" },
  { value: 1, label: "5 min" },
  { value: 2, label: "15 min" },
];

const selectOptionsMods: SelectOption[] = [
  { value: 0, label: "..." },
  { value: 1, label: "..." },
];

const Lobby = () => {
  const params = useParams();
  const navi = useNavigate();
  const { fetchWithAuth } = useAuth();
  const code = params.code ?? "";
  const eventSource = useSseEventSource(`lobbies/${code}/events`);
  useHeartbeat(code);

  const [matchUUID, setMatchUUID] = useState<string>(() => localStorage.getItem(STORAGE_KEYS.LAST_MATCH_UUID) ?? "");
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedMultiplayerMode, setSelectedMultiplayerMode] = useState<SelectOption | null>(null);
  const [selectedTurnTimeout, setSelectedTurnTimeout] = useState<SelectOption | null>(null);
  const [selectedMods, setSelectedMods] = useState<SelectOption | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const onSelectMultiplayerMode = (selectedOption: SingleValue<SelectOption>) => setSelectedMultiplayerMode(selectedOption);
  const onSelectTurnTimeout = (selectedOption: SingleValue<SelectOption>) => setSelectedTurnTimeout(selectedOption);
  const onSelectMods = (selectedOption: SingleValue<SelectOption>) => setSelectedMods(selectedOption);

  eventSource?.addEventListener("lobbyUpdate", (event) => {
    const data = JSON.parse(event.data);
    setPlayers(data);
  });

  useEffect(() => {
    const executeJoin = async (lobbyCode: string) => {
      const response = await fetchWithAuth(`/lobbies/${lobbyCode}`, "POST");
      if (!response || response.status !== 200) {
        return;
      }

      const responseJson = await response.json();

      //TODO: replace with LobbyContext
      localStorage.setItem("playerId", responseJson.id);

      localStorage.setItem(STORAGE_KEYS.LAST_LOBBY_CODE, lobbyCode);
    };

    executeJoin(code);
  }, [code, fetchWithAuth]);

  const createMatch = async () => {
    const response = await fetchWithAuth(`/lobbies/${code}/match`, "POST");
    if (!response || response.status !== 200) {
      return;
    }

    const responseJson = await response.json();
    const uuid = responseJson.matchUUID;
    
    setMatchUUID(uuid);
    localStorage.setItem(STORAGE_KEYS.LAST_MATCH_UUID, uuid);
    
    navi(`/match/${uuid}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
      alert("Copy failed");
    }
  };

  return (
    <>
      <OptionsButton/>

      <h1>Lobby</h1>

      <div className="page-container">
        {/* Left: Players (boxed) */}
        <aside className="col-aside">
          <div className="boxed-aside">
            <h3>Players</h3>
            <ul className="list-vertical">
              {players.length > 0 ? (
                players.map((player) => (
                  <li key={player.id} className="list-item">
                    {player.username}
                  </li>
                ))
              ) : (
                <li className="list-item">No players yet</li>
              )}
            </ul>
          </div>
        </aside>

        {/* Center: Code + Buttons */}
        <main className="col-main">
          <div className="boxed">
            <label className="field-full">
              <div className="label-note">Lobby Code</div>

              <div className="field-row">
                <input
                  className="input-center"
                  readOnly
                  value={code}
                  onFocus={(e) => (e.target as HTMLInputElement).select()}
                  data-nocolor="true"
                />
                <button type="button" onClick={handleCopy} data-functional="true">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </label>

            <div className="spacer-sm" aria-hidden="true" />

            <div className="center-row">
              <button className="btn-wide" type="button" onClick={createMatch}>
                Create Match
              </button>
            </div>

            <div className="center-row">
              <button className="btn-wide" type="button" onClick={() => navi("/play")}>
                Leave Lobby
              </button>
            </div>
          </div>
        </main>

        {/* Right: Mods (boxed) */}
        <aside className="col-aside">
          <div className="boxed-aside">
            <h3>Konfiguration</h3>
            <div className="selectContainer">
              <p>Multiplayer-Modus</p>
              <Select defaultValue={selectedMultiplayerMode} options={selectOptionsMultiplayerMode} onChange={onSelectMultiplayerMode} placeholder="Auswählen" styles={DefaultSelectStyle} isSearchable={false}/>
              <p>Spielzug-Timeout</p>
              <Select defaultValue={selectedTurnTimeout} options={selectOptionsTurnTimeout} onChange={onSelectTurnTimeout} placeholder="Auswählen" styles={DefaultSelectStyle} isSearchable={false}/>
              <p>Mods</p>
              <Select defaultValue={selectedMods} options={selectOptionsMods} onChange={onSelectMods} placeholder="Auswählen" styles={DefaultSelectStyle} isSearchable={false}/>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Lobby;