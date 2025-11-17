import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./dialog.css";
import "../../index.css";

interface DialogProps {
    title?: string;
    id?: string;
    children?: React.ReactNode;
    errorMessage?: string;
}

export interface DialogHandle {
  toggleDialog: () => void;
}

const Dialog = forwardRef<DialogHandle, DialogProps>((props, ref) => {
    const {
        title = "",
        id,
        children,
        errorMessage
    } = props;

    const [open, setOpen] = useState<boolean>(false);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useImperativeHandle(ref, () => ({
        toggleDialog
    }));

    const toggleDialog = () => {
        open ? closeDialog() : openDialog();
    }

    const openDialog = () => {
        dialogRef.current?.showModal();
        setOpen(true);
    }

    const closeDialog = () => {
        dialogRef.current?.close();
        setOpen(false);
    }

    useEffect(() => {
        dialogRef.current?.addEventListener("close", closeDialog);
        return () => {
            dialogRef.current?.removeEventListener("close", closeDialog)
        }
    }, [closeDialog]);

    return (
        <>
            <dialog className={"dialog" + (errorMessage ? " errorDialog" : "")} ref={dialogRef} closedby="any">
                <div className="closeContainer">
                    <h3 className="title">{errorMessage ? "Fehler" : title}</h3>
                    <button className="closeButton" onClick={toggleDialog}>
                        X
                    </button>
                </div>
                <div className="childrenContainer" id={id}>
                    {errorMessage ? (
                        <>
                            <p className="errorMessage">{errorMessage}</p>
                            <button onClick={closeDialog}>OK</button>
                        </>
                    ) : children
                    }
                </div>
            </dialog>
        </>
    );
});

export default Dialog;