import { useRef } from "react";
import TradeWithBankDialog, { type TradeWithBankDialogHandle } from "./TradeWithBankDialog";
import Dialog, { type DialogHandle } from "@/components/dialog/dialog";
import type { TradeWithPlayerDialogHandle } from "./TradeWithPlayerDialog";
import TradeWithPlayerDialog from "./TradeWithPlayerDialog";

type TradeWithBankOrAllButtonProps = {
  className: string;
}

const TradeBankOrAllButton = (props: TradeWithBankOrAllButtonProps) => {
  const { className } = props;
  
  const tradingDialogRef = useRef<DialogHandle | null>(null);
  const tradingBankDialogRef = useRef<TradeWithBankDialogHandle | null>(null);
  const tradingPlayerDialogRef = useRef<TradeWithPlayerDialogHandle | null>(null);

  return (
    <>
      <Dialog title="Trade" ref={tradingDialogRef}>
        <button onClick={() => tradingBankDialogRef.current?.open()}>Trade with bank</button>
        <button onClick={() => tradingPlayerDialogRef.current?.open()}>Trade with all players</button>
      </Dialog>

      <TradeWithBankDialog ref={tradingBankDialogRef}/>
      <TradeWithPlayerDialog ref={tradingPlayerDialogRef}/>
      <button className={className} onClick={() => tradingDialogRef.current?.openDialog()}>
        <img src={`${import.meta.env.BASE_URL}ressources/bank.png`}/>
      </button>
    </>
  );
};

export default TradeBankOrAllButton;