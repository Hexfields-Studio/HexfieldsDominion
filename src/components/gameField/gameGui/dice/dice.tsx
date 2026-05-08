import { useEffect, useState } from "react";
import "./dice.css";
import type { DiceProps } from "./DiceProps";

const Dice: React.FC<DiceProps> = ({ className, rolledSide }) => {
    const [diceSide, setDiceSide] = useState(1);
    const [style, setStyle] = useState<React.CSSProperties>();
    const [reRoll, setReRoll] = useState<boolean>(false);

    const rollDice = () => {
        if(diceSide === 6) setDiceSide(1);
        else setDiceSide(diceSide + 1)
    };

    const test = () => {
        setReRoll(!reRoll);
        console.log("test")
    }
    
    useEffect(()=>{
        setStyle({
            transform: "rotateX(720deg) rotateZ(720deg) rotateY(720deg)"
        });
        console.log("style", reRoll, className);
    }, [reRoll]);

        //<div id="dice" data-side={diceSide} onClick={rollDice}>
    return (
        <div className={className} style={{}}>
            <div id="dice" className={reRoll ? "reRoll" : ""} onClick={test} style={!reRoll ? style : undefined}>
                <div className="sides side-1">
                    <span className="dot dot-1"></span>
                </div>
                <div className="sides side-2">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>
                </div>
                <div className="sides side-3">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>  
                    <span className="dot dot-3"></span>
                </div>
                <div className="sides side-4">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>  
                    <span className="dot dot-3"></span>
                    <span className="dot dot-4"></span>
                </div>
                <div className="sides side-5">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>  
                    <span className="dot dot-3"></span>
                    <span className="dot dot-4"></span>
                    <span className="dot dot-5"></span>
                </div>
                <div className="sides side-6">
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>  
                    <span className="dot dot-3"></span>
                    <span className="dot dot-4"></span>
                    <span className="dot dot-5"></span>
                    <span className="dot dot-6"></span>
                </div>
            </div>
        </div>
    );
}

export default Dice;