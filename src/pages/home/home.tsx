import { useState } from "react";
import "../../index.css";
import "./home.css";
import OptionsButton from "../../components/optionsButton/optionsButton";
import { useAuth } from "../../contexts/AuthContext";

const HomePage = () => {
  const {register, login} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    register(email, password);
  }

  const handleLogin = () => {
    login(email, password);
  }

  return (
    <>
      <OptionsButton/>

      <h1>Home Page</h1>

      <div className="boxed">
        {/* Email + Password */}
        <label className="field-full">
          Email
          <br />
          <input
            className="input-center"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button onClick={handleLogin}>
            Login
          </button>

          <button onClick={handleRegister}>
            Registrieren
          </button>
        </div>

        {/* Guest login */}
        <div className="form-row small row-seperated">
          <button>
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