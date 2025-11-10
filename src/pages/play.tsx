import { useRef } from "react";
import "../index.css";
import Dialog, { type DialogHandle } from "../components/dialog/dialog";

const StartMenu = () => {
  const dialogRef = useRef<DialogHandle | null>(null);

  return (
    <>
      <Dialog ref={dialogRef}>
        <p>tests,össakas</p>
      </Dialog>
      <h1>Start Menu</h1>
      <button onClick={() => dialogRef.current?.toggleDialog()}>
        test
      </button>
    </>
  );
}

export default StartMenu;