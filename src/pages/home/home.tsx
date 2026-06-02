import { useState } from "react";
import "@/index.css";
import "./home.css";
import OptionsButton from "@/components/optionsButton/optionsButton";
import { useAuth } from "@/contexts/contexts";
import { useError } from "@/hooks/useError";

const HomePage = () => {
  const { register, login, guest } = useAuth();
  const { errorDialog, isError, openErrorDialogIfMessage } = useError();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const response = await register({ username, password });
    if (isError(response)) {
      openErrorDialogIfMessage(response);
    }
  };

  const handleLogin = async () => {
    const response = await login({ username, password });
    if (isError(response)) {
      openErrorDialogIfMessage(response);
    }
  };

  const handlePlayAsGuest = () => {
    guest();
  };

  const isUsernameOrPwValid = (input: string) => input && input.match("^([a-zA-Z0-9*._\\-+=()!%@])+$");

  return (
    <>
      { errorDialog }
      
      <OptionsButton showLogOut={false}/>

      <div style={{ textAlign: "center", margin: "2em 0em 1em 0em" }}>
        <img className="logo" src="logo_big.png" alt="Logo" style={{ width: "20em", height: "auto" }} />
      </div>

      <div className="boxed">
        {/* Username + Password */}
        <h2 style={{ textAlign: "center" }}>Sign in</h2>

        <label className="field-full">
          Username
          <br />
          <input
            className="input-center"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label className="field-full">
          Password
          <br />
          <input
            className="input-center"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {/* Login + Register */}
        <div className="form-row">
          <button onClick={handleLogin} disabled={!isUsernameOrPwValid(username) || !isUsernameOrPwValid(password)}>
            Login
          </button>

          <button onClick={handleRegister} disabled={!isUsernameOrPwValid(username) || !isUsernameOrPwValid(password)}>
            Register
          </button>
        </div>

        {/* Password forgotten */}
        <div className="form-row small">
          <button onClick={() => alert("Password recovery not implemented yet. \n\nIf issues persist, contact us on GitHub: \ngithub.com/Hexfields-Studio")}>
            Forgotten password
          </button>
        </div>

        {/* Guest login */}
        <div className="form-row small row-seperated">
          <button onClick={handlePlayAsGuest}>
            Play as Guest
          </button>
        </div>

      </div>
    </>
  );
};

export default HomePage;