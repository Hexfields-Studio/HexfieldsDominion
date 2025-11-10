import { useEffect, useState } from "react";
import "../index.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../constants/storage";
import { useNavigate } from "react-router";


const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false));
  const navi = useNavigate();

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  }, [isLoggedIn]);

  return (
      <>
        <h1>Home Page</h1>
        <p>
          Logged In: {isLoggedIn ? "true" : "false"} <br/>
          <button onClick={()=>setIsLoggedIn(!isLoggedIn)}>Toggle "isLoggedIn"</button>
        </p>
        <p>
          <button onClick={() => {
            // Nur wenn eingeloggt weiterleiten
            if (isLoggedIn) {
              navi('/play');
            } else {
              // Muss noch mit eigenem Popup ersetzt werden
              alert("You must be logged in to proceed to Play.");
            }
          }}>Login</button>
        </p>
      </>
  );
}

export default HomePage;