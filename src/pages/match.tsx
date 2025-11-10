import { useNavigate, useParams } from "react-router";
import "../index.css";

const MatchPage = () => {
  const params = useParams();
  const navi = useNavigate();
  
  return (
      <>
        <h1>You are in the Match with UUID: "{params.uuid}"</h1>
        <button onClick={()=>navi(`/lobby/${params.uuid}`)}>Leave Match</button>
      </>
  );
}

export default MatchPage;