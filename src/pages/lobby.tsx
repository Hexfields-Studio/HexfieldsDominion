import "../index.css";
import { useNavigate, useParams } from "react-router";

const Lobby = () => {
  const params = useParams();
  const navi = useNavigate();
  
  return (
      <>
        <h1>Lobby, Code: "{params.code}"</h1>
        <button onClick={()=>navi("/play")}>Leave</button>
      </>
  );
}

export default Lobby;