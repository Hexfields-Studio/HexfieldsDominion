import { Circle, Layer, Rect } from "react-konva";
import PlayerLineupDisplay from "./PlayerLineupDisplay"

const GameGui: React.FC = () => {

    return (
        <Layer>
            <Circle key={1234} x={100} y={100} radius={100} opacity={1}
                                        fillLinearGradientStartPoint={{ x: -100, y: -100 }}
                                        fillLinearGradientEndPoint={{ x: 100, y: 100 }}
                                        fillLinearGradientColorStops={[0, 'turquoise', 1, 'blue']}
                                            onClick={()=>console.log("???")}/>
            <PlayerLineupDisplay/>
        </Layer>
    )

}

export default GameGui;