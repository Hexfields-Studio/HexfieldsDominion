import Dice, { type DiceSide } from "./dice"

type DiceContainerProps = {
    className: string;
    rolledSides: number[];
    animationTrigger: number;
    currentDiceSide: DiceSide;
}

const DiceContainer: React.FC<DiceContainerProps> = ({className, rolledSides, animationTrigger, currentDiceSide}) => {
    return(
        <div className={className}>
            <Dice diceTheme={1} rolledSide={rolledSides[0]} animationTrigger={animationTrigger} currentDiceSide={currentDiceSide}/>
            <Dice diceTheme={2} rolledSide={rolledSides[1]} animationTrigger={animationTrigger} currentDiceSide={currentDiceSide}/>
        </div>
    )
}

export default DiceContainer;