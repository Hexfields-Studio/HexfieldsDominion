import { useState } from "react";
import "../index.css";
import { useNavigate, useParams } from "react-router";

const Lobby = () => {
  const params = useParams();
  const navi = useNavigate();
  const code = params.code ?? "";
  const uuid = params.uuid ?? "";

  const [copied, setCopied] = useState(false);

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
          <p className="boxed">
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

            <div className="center-row mb-12">
              <button className="btn-wide" type="button" onClick={() => {
                if (!uuid) {
                  alert("Match UUID not available.");
                  return;
                }
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
          </p>
        </main>

        {/* Right: Mods (boxed) */}
        <aside className="col-aside">
          <div className="boxed-aside mods">
            <h3>Modifications</h3>
            <ul className="list-vertical">
              <li className="list-item">Classic Ruleset</li>
              {/* OTHER MODS */}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Lobby;