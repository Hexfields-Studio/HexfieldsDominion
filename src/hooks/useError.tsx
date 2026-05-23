import type { DialogHandle } from "@/components/dialog/dialog";
import Dialog from "@/components/dialog/dialog";
import { useRef, useState } from "react";

export type useErrorType = {
  errorDialog: React.ReactNode | undefined;
  isError: (response: Response | undefined) => boolean;
  openErrorDialog: (message: string) => void;
  openErrorDialogIfMessage: (response: Response | undefined) => void;
}

export function useError(): useErrorType {
  const [dialog, setDialog] = useState<React.ReactNode | undefined>();
  const dialogRef = useRef<DialogHandle | null>(null);

  const isError: ((response: Response | undefined) => boolean) = (response: Response | undefined) => {
    return !response || response.status >= 400;
  };

  const openErrorDialog: ((message: string) => void) = async (message:string) => {
    setDialog(<Dialog errorMessage={message} ref={dialogRef}/>);
    // wait until dialog state has been updated as it needs to be set where the hook is used to open it
    setTimeout(() => {
      dialogRef.current?.openDialog();
    }, 1000);
  };

  const openErrorDialogIfMessage: ((response: Response | undefined) => void) = async (response: Response | undefined) => {
    if (!response) {
      return;
    }
    const json = await response.json();
    const errorMessage = json.errorMessage;
    if (!errorMessage) {
      return;
    }

    openErrorDialog(errorMessage);
  };

  return { errorDialog: dialog, isError, openErrorDialog, openErrorDialogIfMessage };
}