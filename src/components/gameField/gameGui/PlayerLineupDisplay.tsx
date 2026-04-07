import { Html } from "react-konva-utils";

const PlayerLineupDisplay: React.FC = () => {
    return(
        <Html x={100} y={100}>
                  <div style={{ padding: 10 }}>
                    Hello, its possible to let react-konva render HTML DOM Elements.
                    This is useful because now we can use css styling to provide the layout of the gui.
                  </div>
        </Html>
    )

}

export default PlayerLineupDisplay;