import { useRef, useState } from "react";
import Dialog, { type DialogHandle } from "../dialog/dialog";
import "./optionsBar.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../../constants/storage";
import { useNavigate } from "react-router";

const OptionsBar = () => {
    const [isLoggedIn] = useState(getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false));
    const navigate = useNavigate();
    const dialogRef = useRef<DialogHandle | null>(null);

    const handleLogout = () => {
        setStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false); // TypeScript/Runtime-Mismatch. Funktioniert trotz Fehler.
        navigate("/");
    };

    return (
        <>
            <Dialog title="Optionen" id="gearDialog" ref={dialogRef}>
                <p>User is logged in: {isLoggedIn ? "Yes" : "No"}</p>
                <button onClick={handleLogout}>Log out</button>
            </Dialog>

            <div id="optionsBar">
                <button id="gearButton"
                    // background-image here because path not valid in css prod
                    //style={{backgroundImage: "url(/HexfieldsDominion/gear.svg)"}}
                    onClick={() => dialogRef.current?.toggleDialog()}/>
            </div>
        </>
    );
}

export default OptionsBar;