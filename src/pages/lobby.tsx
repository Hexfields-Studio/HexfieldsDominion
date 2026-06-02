import { useCallback, useEffect, useMemo, useState } from "react";
import "@/index.css";
import { useNavigate, useParams } from "react-router";
import OptionsButton from "@/components/optionsButton/optionsButton";
import Select from "react-select";
import type { SingleValue } from "react-select";
import type { SelectOption, SseListener } from "@/constants/customTypes";
import { DefaultSelectStyle } from "@/constants/selectStyles";
import { STORAGE_KEYS } from "@/constants/storage";
import { useSseEventSource } from "@/hooks/sseHooks/useSseEventSource";
import { useAuth } from "@/contexts/contexts";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { useError } from "@/hooks/useError";

interface Player {
  id: number;
  username: string;
  isAccount: boolean;
}

const selectOptionsMultiplayerMode: SelectOption[] = [
  { value: 0, label: "Realtime" },
  { value: 1, label: "Turn-Based" },
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

type MatchCreatedDataType = {
  matchUUID: string,
}

const Lobby = () => {
  const params = useParams();
  const navi = useNavigate();
  const { fetchWithAuth } = useAuth();
  const { errorDialog, isError, openErrorDialogIfMessage } = useError();
  const code = params.code ?? "";
  useHeartbeat(code);

  const joinMatch = useCallback((data: MatchCreatedDataType) => {
    localStorage.setItem(STORAGE_KEYS.LAST_MATCH_UUID, data.matchUUID);
    navi(`/match/${data.matchUUID}`);
  }, [navi]);
  
  const sseListeners: SseListener[] = useMemo(() => [
    {
      type: "lobbyUpdate",
      action: (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        setPlayers(data);
      },
    },
    {
      type: "matchCreated",
      action: (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        joinMatch(data);
      },
    },
  ], [joinMatch]);
  const { connectSse } = useSseEventSource({ path: `lobbies/${code}/events`, listeners: sseListeners });

  const [copied, setCopied] = useState<boolean>(false);
  const [selectedMultiplayerMode, setSelectedMultiplayerMode] = useState<SelectOption | null>(null);
  const [selectedTurnTimeout, setSelectedTurnTimeout] = useState<SelectOption | null>(null);
  const [selectedMods, setSelectedMods] = useState<SelectOption | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const onSelectMultiplayerMode = (selectedOption: SingleValue<SelectOption>) => setSelectedMultiplayerMode(selectedOption);
  const onSelectTurnTimeout = (selectedOption: SingleValue<SelectOption>) => setSelectedTurnTimeout(selectedOption);
  const onSelectMods = (selectedOption: SingleValue<SelectOption>) => setSelectedMods(selectedOption);

  useEffect(() => {
    connectSse();
  });

  useEffect(() => {
    const executeJoin = async (lobbyCode: string) => {
      const response = await fetchWithAuth(`/lobbies/${lobbyCode}`, "POST");
      if (!response || response.status !== 200) {
        return;
      }

      const responseJson = await response.json();

      //TODO: replace with LobbyContext
      localStorage.setItem("playerId", responseJson.createdPlayer.id);
      
      setIsOwner(responseJson.isLobbyOwner);

      localStorage.setItem(STORAGE_KEYS.LAST_LOBBY_CODE, lobbyCode);
    };

    executeJoin(code);
  }, [code, fetchWithAuth]);

  const createMatch = async () => {
    const response = await fetchWithAuth(`/lobbies/${code}/match`, "POST");
    if (isError(response)) {
      openErrorDialogIfMessage(response);
      return;
    }

    const responseJson = await response?.json();
    joinMatch(responseJson);
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

  const placeholder = isOwner ? "Select" : "-";

  return (
    <>
      { errorDialog }

      <OptionsButton/>

      <div style={{ textAlign: "left", margin: "2em 0em 0em 2em" }}>
        <img className="logo" src={`${import.meta.env.BASE_URL}logo_big.png`} alt="Logo" style={{ width: "10em", height: "auto" }} />
      </div>

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

            { isOwner &&
              <div className="center-row">
                <button className="btn-wide" type="button" onClick={createMatch}>
                  Create Match
                </button>
              </div>
            }

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
            <h3>Configuration</h3>
            <div className="selectContainer">
              <p>Multiplayer-Mode</p>
              <Select isDisabled={!isOwner} defaultValue={selectedMultiplayerMode} options={selectOptionsMultiplayerMode} onChange={onSelectMultiplayerMode} placeholder={placeholder} styles={DefaultSelectStyle} isSearchable={false}/>
              <p>Turn-Timeout</p>
              <Select isDisabled={!isOwner} defaultValue={selectedTurnTimeout} options={selectOptionsTurnTimeout} onChange={onSelectTurnTimeout} placeholder={placeholder} styles={DefaultSelectStyle} isSearchable={false}/>
              <p>Mods</p>
              <Select isDisabled={!isOwner} defaultValue={selectedMods} options={selectOptionsMods} onChange={onSelectMods} placeholder={placeholder} styles={DefaultSelectStyle} isSearchable={false}/>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Lobby;