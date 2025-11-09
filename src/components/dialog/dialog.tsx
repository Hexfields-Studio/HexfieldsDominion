import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
        open ? dialogRef.current?.close() : dialogRef.current?.showModal();
        setOpen(!open);
    }

    return (
        <>
            <dialog className="dialog" ref={dialogRef}>
                <button className="close" onClick={toggleDialog}>
                    X    
                </button>
                {children}
            </dialog>
        </>
    );
});

export default Dialog;