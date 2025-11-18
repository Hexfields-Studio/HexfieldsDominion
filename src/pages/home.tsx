import { useEffect, useState } from "react";
import "../index.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../constants/storage";
import { useNavigate } from "react-router";
import OptionsBar from "../components/optionsBar/optionsBar";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navi = useNavigate();

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <OptionsBar/>

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
            placeholder="Enter username"
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
            placeholder="Enter password"
          />
        </label>

        {/* Login + Guest-Login */}
        <div className="form-row">
          <button
            type="button"
            onClick={() => {
              if (isLoggedIn) {
                navi("/play");
              } else {
                alert("You must be logged in to proceed to Play.");
              }
            }}
            data-functional="true"
          >
            Login
          </button>

          <button type="button" >Login as guest</button>
        </div>

        {/* Register + Password forgotten */}
        <div className="form-row small">
          <button type="button" >Register</button>
          <button type="button" >Password forgotten</button>
        </div>
      </div>

      {/* Debug Login */}
      <p className="footer-bottom">
        Logged In: {isLoggedIn ? "true" : "false"}
        <br />
        <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Toggle "isLoggedIn"</button>
      </p>
    </>
  );
};

export default HomePage;