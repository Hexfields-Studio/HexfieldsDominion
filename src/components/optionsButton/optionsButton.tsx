import { useRef  } from "react";
import Dialog, { type DialogHandle } from "../dialog/dialog";
import "./optionsButton.css";
import { useAuth } from "../../contexts/AuthContext";

const OptionsButton = () => {
    const {logout} = useAuth();
    
    const dialogRef = useRef<DialogHandle | null>(null);

    const handleLogout = () => {
        logout();
        dialogRef.current?.toggleDialog();
    }

    return (
        <>
            <Dialog title="Optionen" id="gearDialog" ref={dialogRef}>
                <button onClick={handleLogout}>Log out</button>
            </Dialog>

            <button id="gearButton" onClick={() => dialogRef.current?.toggleDialog()}/>
        </>
    );
}

export default OptionsButton;