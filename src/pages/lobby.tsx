import "../index.css";
import { useNavigate, useParams } from "react-router";

const Lobby = () => {
  const params = useParams();
  const navi = useNavigate();
  
  return (
      <>
        <h1>You are in the Lobby with Code: "{params.code}"</h1>
        
        <button onClick={()=>{navi(`/match/${params.uuid}`);}}>Join Match</button>

        <button onClick={()=>navi("/play")}>Leave Lobby</button>
      </>
  );
}

export default Lobby;