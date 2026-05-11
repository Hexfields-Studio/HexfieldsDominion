import { useEffect, useState } from "react";
import "./dice.css";

//TODO: Refactor this so it doesnt store big strings

const sideDefault = {
    0: "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
    1: "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
    2: "rotateX(0deg) rotateY(180deg) rotateZ(0deg)",
    3: "rotateX(0deg) rotateY(270deg) rotateZ(0deg)",
    4: "rotateX(0deg) rotateY(90deg) rotateZ(0deg)",
    5: "rotateX(270deg) rotateY(0deg) rotateZ(0deg)",
    6: "rotateX(90deg) rotateY(0deg) rotateZ(0deg)"
}

const sideChaotic = {
    0: "rotateX(720deg) rotateY(720deg) rotateZ(720deg)",
    1: "rotateX(360deg) rotateY(360deg) rotateZ(720deg)",
    2: "rotateX(360deg) rotateY(540deg) rotateZ(720deg)",
    3: "rotateX(360deg) rotateY(630deg) rotateZ(720deg)",
    4: "rotateX(360deg) rotateY(450deg) rotateZ(720deg)",
    5: "rotateX(630deg) rotateY(360deg) rotateZ(720deg)",
    6: "rotateX(450deg) rotateY(360deg) rotateZ(720deg)"
}

type DiceProps = {
    rolledSide: number;
    rollDice: () => void;
    animationTrigger: number;
}

// 37:30 für Zwei dice und fix rfandom number immer animation
const Dice: React.FC<DiceProps> = ({ rolledSide, rollDice, animationTrigger }) => {
    const [style, setStyle] = useState<React.CSSProperties>();
    const [useDefaultSide, setUseDefaultSide] = useState<boolean>(false);

    useEffect(()=>{
        setUseDefaultSide(!useDefaultSide);
        console.log("Update");
    }, [animationTrigger]);
    
    useEffect(()=>{
        setStyle({
            transform: useDefaultSide ? 
                sideDefault[rolledSide as keyof typeof sideDefault] :
                sideChaotic[rolledSide as keyof typeof sideChaotic]
        });
        console.log("DICE SIDE:", rolledSide, useDefaultSide ? "DEFAULT" : "CHAOTIC");
        //console.log("REROLL:", reRoll);
    }, [useDefaultSide]);

        //<div id="dice" data-side={diceSide} onClick={rollDice}>
    return (//className={reRoll ? "reRoll" : ""}
        <div id="dice" onClick={rollDice} style={style}>
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
    );
}

export default Dice;