import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./dialog.css";

interface DialogProps {
    children: React.ReactNode;
}

export interface DialogHandle {
  toggleDialog: () => void;
}

const Dialog = forwardRef<DialogHandle, DialogProps>((props, ref) => {
    const {children} = props;

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
        dialogRef.current?.addEventListener("close", () => closeDialog())
    }, [closeDialog]);

    return (
        <>
            <dialog className="dialog" ref={dialogRef} closedby="any">
                <div className="closeContainer">
                    <button className="closeButton" onClick={toggleDialog}>
                        X
                    </button>
                </div>
                {children}
            </dialog>
        </>
    );
});

export default Dialog;