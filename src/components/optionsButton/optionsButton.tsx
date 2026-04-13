import { useRef  } from "react";
import Dialog, { type DialogHandle } from "../dialog/dialog";
import "./optionsButton.css";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

interface OptionsButtonProps {
    showLogOut?: boolean;
}

const OptionsButton = (props: OptionsButtonProps) => {
    const {showLogOut = true} = props;

    const {logout} = useAuth();
    const { toggleTheme, theme } = useTheme();
    
    const dialogRef = useRef<DialogHandle | null>(null);

    const handleLogout = () => {
        logout();
        dialogRef.current?.toggleDialog();
    }

    const handleThemeToggle = () => {
        toggleTheme();
    }

    return (
        <>
            <Dialog title="Optionen" id="gearDialog" ref={dialogRef}>
                {showLogOut && <button onClick={handleLogout}>Log out</button>}
                <button onClick={handleThemeToggle}>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
            </Dialog>

            <button id="gearButton" onClick={() => dialogRef.current?.toggleDialog()}/>
        </>
    );
}

export default OptionsButton;