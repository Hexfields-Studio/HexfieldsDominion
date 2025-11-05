import { useEffect, useState } from "react";
import "../index.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../constants/storage";


const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false));

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  }, [isLoggedIn]);

  return (
      <>
        <h1>This is the HomePage</h1>
        <p>Logged In: {isLoggedIn ? "true" : "false"}</p>
        <button onClick={()=>setIsLoggedIn(!isLoggedIn)}>Toggle "isLoggedIn"</button>
      </>
  );
}

export default HomePage;