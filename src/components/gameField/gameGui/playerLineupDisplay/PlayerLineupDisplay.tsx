import "./PlayerLineupDisplay.css"

const PlayerLineupDisplay: React.FC = () => {
    return(
        <div className="lineupDisplay">
            <div className="img-wrapper">
                <img src="../playerIcons/KingMale.png"></img>
            </div>
            <div className="img-wrapper">
                <img src="../playerIcons/ArcherFemale.png"></img>
            </div>
            <div className="img-wrapper">
                <img src="../playerIcons/RuneBearerMale.png"></img>
            </div>
        </div>
    )
}

export default PlayerLineupDisplay;