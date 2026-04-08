import { Circle, Layer, Rect } from "react-konva";
import PlayerLineupDisplay from "./playerLineupDisplay/PlayerLineupDisplay";
import RessourceDisplay from "./ressourceDisplay/RessourceDisplay";
import "./GameGui.css"
import { Html } from "react-konva-utils";

const GameGui: React.FC = () => {
    return (
        <Layer>
            <Html divProps={{className: "gui"}}>
                <div className="flexboxes">
                    <PlayerLineupDisplay/>
                    <RessourceDisplay/>
                </div>
            </Html>
        </Layer>
    )
}

export default GameGui;