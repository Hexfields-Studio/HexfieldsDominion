import { useRef, useState } from "react";
import Dialog, { type DialogHandle } from "../../components/dialog/dialog";
import "./loggedIn.css";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../../constants/storage";
import { useNavigate } from "react-router";

interface LoggedInProps {
    children: React.ReactNode;
}

const LoggedIn = (props: LoggedInProps) => {
    const {children} = props;
    
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
                <p>Logged In: {isLoggedIn ? "true" : "false"}</p>
                <button onClick={handleLogout}>Log out</button>
            </Dialog>

            <div id="root">
                <button id="gearButton" onClick={() => dialogRef.current?.toggleDialog()}/>
                {children}
            </div>
        </>
    );
}

export default LoggedIn;