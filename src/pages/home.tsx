import { useEffect, useState } from "react";
import "../index.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../constants/storage";
import { useNavigate } from "react-router";


const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false));
  const [codeOrUUID, setCodeOrUUID] = useState("");
  const navi = useNavigate();

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  }, [isLoggedIn]);

  return (
      <>
        <h1>This is the HomePage</h1>
        <p>Logged In: {isLoggedIn ? "true" : "false"}</p>
        <button onClick={()=>setIsLoggedIn(!isLoggedIn)}>Toggle "isLoggedIn"</button><br/>
        <input type="text" onChange={(e) => {setCodeOrUUID(e.target.value)}} placeholder="code/uuid"/>
        <button onClick={()=>{navi(`/lobby/${codeOrUUID}`);}}>Join Lobby</button>
        <button onClick={()=>{navi(`/match/${codeOrUUID}`);}}>Join Match</button>
      </>
  );
}

export default HomePage;