import { useState } from "react";
import "@/index.css";
import "./home.css";
import OptionsButton from "@/components/optionsButton/optionsButton";
import { useAuth } from "@/contexts/contexts";

const HomePage = () => {
  const { register, login, guest } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    register({ username, password });
  };

  const handleLogin = () => {
    login({ username, password });
  };

  const handlePlayAsGuest = () => {
    guest();
  };

  const isUsernameOrPwValid = (input: string) => input && input.match("^([a-zA-Z0-9*._\\-+=()!%@])+$");

  return (
    <>
      <OptionsButton showLogOut={false}/>

      <h1>Home Page</h1>

      <div className="boxed">
        {/* Username + Password */}
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
          Passwort
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
            Registrieren
          </button>
        </div>

        {/* Guest login */}
        <div className="form-row small row-seperated">
          <button onClick={handlePlayAsGuest}>
            Als Gast spielen
          </button>
        </div>

        {/* Password forgotten */}
        <div className="form-row small row-seperated">
          <button>
            Password vergessen
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;