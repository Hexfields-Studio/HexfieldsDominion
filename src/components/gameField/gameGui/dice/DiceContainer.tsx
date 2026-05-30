import { useCurrentDiceResult } from "@/hooks/matchHooks/useCurrentDiceResult";
import Dice, { type DiceSide } from "./Dice";

type DiceContainerProps = {
    className: string;
    animationTrigger: number;
    currentDiceSide: DiceSide;
}

const DiceContainer: React.FC<DiceContainerProps> = ({ className, animationTrigger, currentDiceSide }) => {
  const currentDiceResult = useCurrentDiceResult();
  
  return(
    <div className={className}>
      <Dice diceTheme={1} rolledSide={currentDiceResult?.[0] ?? 0} animationTrigger={animationTrigger} currentDiceSide={currentDiceSide}/>
      <Dice diceTheme={2} rolledSide={currentDiceResult?.[1] ?? 0} animationTrigger={animationTrigger} currentDiceSide={currentDiceSide}/>
    </div>
  );
};

export default DiceContainer;