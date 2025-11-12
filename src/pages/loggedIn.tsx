import { useRef } from "react";
import Dialog, { type DialogHandle } from "../components/dialog/dialog";
import "./loggedIn.css";

interface LoggedInProps {
    children: React.ReactNode;
}

const LoggedIn = (props: LoggedInProps) => {
    const {children} = props;
    const dialogRef = useRef<DialogHandle | null>(null);

    return (
        <>
            <Dialog title="Optionen" id="gearDialog" ref={dialogRef}>
                <p>test</p>
            </Dialog>

            <div id="root">
                <button id="gearButton" onClick={dialogRef.current?.toggleDialog}/>
                {children}
            </div>
        </>
    );
}

export default LoggedIn;