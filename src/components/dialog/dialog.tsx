import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./dialog.css";
import "@/index.css";
import JSConfetti from 'js-confetti';

interface DialogProps {
    title?: string;
    id?: string;
    children?: React.ReactNode;
    errorMessage?: string;
    closedBy?: "none" | "any";
    useDefaultStyling?: boolean;
    onClick?: () => void | undefined;
    showConfetti?: boolean;
}

export interface DialogHandle {
  toggleDialog: () => void;
  openDialog: () => void;
}

const Dialog = forwardRef<DialogHandle, DialogProps>((props, ref) => {
  const {
    title = "",
    id,
    children,
    errorMessage,
    closedBy = "any",
    useDefaultStyling = true,
    onClick = undefined,
    showConfetti = false,
  } = props;

  const [open, setOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    toggleDialog,
    openDialog,
  }));

  const toggleDialog = () => (open ? closeDialog() : openDialog());

  const openDialog = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  useEffect(()=>{
    if (!canvasRef.current) return;
    if (!showConfetti) return;
    canvasRef.current.className = "confetti";
    const jsConfetti = new JSConfetti({
      canvas: canvasRef.current,
    });
    jsConfetti.addConfetti({
      confettiRadius: 6,
      confettiNumber: 500,
    });
  }, [showConfetti]);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
    setOpen(false);
  }, []);

  useEffect(() => {
    const currentRef = dialogRef.current;
    currentRef?.addEventListener("close", closeDialog);
    return () => {
      currentRef?.removeEventListener("close", closeDialog);
    };
  }, [closeDialog]);

  const showHeader = closedBy === "any" || errorMessage || title;
  const headerTitle: string = errorMessage ? "Error" : title;

  return (
    <>
      <dialog className={`${useDefaultStyling ? "dialog" : "noBorderAndBackground"} ${errorMessage ? "errorDialog" : ""}`} ref={dialogRef} onClick={onClick}>
        {<canvas ref={canvasRef} width={"100%"} height={"100%"}></canvas>}
        {showHeader && (
          <div className="closeContainer">
            {headerTitle && (
              <h3 className="title">{headerTitle}</h3>
            )}

            {closedBy === "any" && (
              <button className="closeButton" onClick={toggleDialog}>
                X
              </button>
            )}
          </div>
        )}
        
        <div className={useDefaultStyling ? "childrenContainer" : ""} id={id}>
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
Dialog.displayName = "Dialog";

export default Dialog;