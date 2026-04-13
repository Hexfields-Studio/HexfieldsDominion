import { useState, useEffect } from "react";
import { useMatchRepository } from "../../../../contexts/MatchRepositoryContext";
import "./PlayerLineupDisplay.css"

const PlayerLineupDisplay: React.FC = () => {

    const {repository} = useMatchRepository();
    const [matchData, setMatchData] = useState(repository.getMatchData())
    const [isItMyTurn, setIsItMyTurn] = useState<boolean>(false)

    useEffect(()=>{
        repository.keepMeUpdated(setMatchData);
    }, [])

    useEffect(()=>{
        setIsItMyTurn(repository.isItMyTurn());
    }, [matchData])

    return(
        <div className="lineupDisplay">
            {matchData.map(player =>
                <div key={player.username} className={`lineupDisplay-img-wrapper ${player.isThisPlayersTurn ? "highlightPlayer" : ""}`}>
                    <img src={`../playerIcons/${player.chosenPortrait}.png`}></img>
                    {player.isThisPlayersTurn && isItMyTurn ? (
                        <p className="portraitText">Your Turn!</p>
                    ) : ""}
                </div>
            )}
        </div>
    )
}

export default PlayerLineupDisplay;