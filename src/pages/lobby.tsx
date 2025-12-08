import { useState } from "react";
import "../index.css";
import { useNavigate, useParams } from "react-router";
import OptionsButton from "../components/optionsButton/optionsButton";
import Select from "react-select";
import type { SingleValue } from "react-select";
import type { SelectOption } from "../constants/customTypes";
import { DefaultSelectStyle } from "../constants/selectStyles";
import {STORAGE_KEYS} from "../constants/storage";

const selectOptionsMultiplayerMode: SelectOption[] = [
  {value: 0, label: "Echtzeit"},
  {value: 1, label: "Zugbasiert"}
]

const selectOptionsTurnTimeout: SelectOption[] = [
  {value: 0, label: "1 min"},
  {value: 1, label: "5 min"},
  {value: 2, label: "15 min"}
]

const selectOptionsMods: SelectOption[] = [
  {value: 0, label: "..."},
  {value: 1, label: "..."}
]

const generateUUID = () => {
  const hexDigits = '0123456789abcdef';
  let uuid = '';
  
  // Erzeuge 32 zufällige Hex-Zeichen
  for (let i = 0; i < 32; i++) {
    // Füge Bindestriche an den richtigen Stellen ein (8-4-4-4-12)
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    
    // Bei Position 12 muss die Version auf 4 gesetzt werden (Bit 12-15 = 0100)
    if (i === 12) {
      uuid += '4';
    } 
    // Bei Position 16 muss das Variant-Feld auf 10xx gesetzt werden (8, 9, a, b)
    else if (i === 16) {
      const variants = ['8', '9', 'a', 'b'];
      uuid += variants[Math.floor(Math.random() * 4)];
    }
    // Normale zufällige Hex-Ziffer
    else {
      uuid += hexDigits[Math.floor(Math.random() * 16)];
    }
  }
  
  return uuid;
};

const Lobby = () => {
  const params = useParams();
  const navi = useNavigate();
  const code = params.code ?? "";

  const [matchUUID, setMatchUUID] = useState<string>(() => localStorage.getItem(STORAGE_KEYS.LAST_MATCH_UUID) ?? "");
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedMultiplayerMode, setSelectedMultiplayerMode] = useState<SelectOption | null>(null);
  const [selectedTurnTimeout, setSelectedTurnTimeout] = useState<SelectOption | null>(null);
  const [selectedMods, setSelectedMods] = useState<SelectOption | null>(null);

  const onSelectMultiplayerMode = (selectedOption: SingleValue<SelectOption>) => setSelectedMultiplayerMode(selectedOption);
  const onSelectTurnTimeout = (selectedOption: SingleValue<SelectOption>) => setSelectedTurnTimeout(selectedOption);
  const onSelectMods = (selectedOption: SingleValue<SelectOption>) => setSelectedMods(selectedOption);

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
              <li className="list-item">Gaming_123</li>
              {/* PLAYERS */}
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
              <button className="btn-wide" type="button" onClick={() => {
                // wrong, uuid should be requested from server
                const uuid = generateUUID();
                
                setMatchUUID(uuid);
                localStorage.setItem(STORAGE_KEYS.LAST_MATCH_UUID, uuid);
                
                navi(`/match/${uuid}`);
              }}>
                Join Match
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