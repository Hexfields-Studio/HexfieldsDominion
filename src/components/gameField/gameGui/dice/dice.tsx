// This component is inspired by: https://codepen.io/abirana/pen/rNMLrPB
import { useEffect, useState } from "react";
import styles from "./dice.module.scss";

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
    theme: string;
    rolledSide: number;
    rollDice: () => void;
    animationTrigger: number;
}

// 37:30 für Zwei dice und fix rfandom number immer animation
const Dice: React.FC<DiceProps> = ({ theme, rolledSide, rollDice, animationTrigger }) => {
    const [style, setStyle] = useState<React.CSSProperties>();
    const [useDefaultSide, setUseDefaultSide] = useState<boolean>(false);

    useEffect(()=>{
        setUseDefaultSide(!useDefaultSide);
    }, [animationTrigger]);
    
    useEffect(()=>{
        setStyle({
            transform: useDefaultSide ? 
                sideDefault[rolledSide as keyof typeof sideDefault] :
                sideChaotic[rolledSide as keyof typeof sideChaotic]
        });
    }, [useDefaultSide]);

    const range = (i: number) => Array.from({ length: i }, (_, j) => j + 1);

        //<div id="dice" data-side={diceSide} onClick={rollDice}>
    return (//className={reRoll ? "reRoll" : ""}
        <div id={styles.dice} data-theme={theme} onClick={rollDice} style={style}>
            {
                [1,2,3,4,5,6].map((i) => (
                    <div className={`${styles.side} ${styles[`side-${i}`]}`} key={`side-${i}`}>
                        {
                            range(i).map((j) => {
                                return <span className={`${styles.dot} ${styles[`dot-${j}`]}`} key={`side-${i}-dot-${j}`}></span>;
                            })
                        }
                    </div>
                ))
            }
            
        </div>
    );
}

export default Dice;