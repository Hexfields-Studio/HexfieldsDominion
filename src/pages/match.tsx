import { useNavigate, useParams } from "react-router";
import "../index.css";

const MatchPage = () => {
  const params = useParams();
  const navi = useNavigate();
  
  return (
      <>
        <h1>Match Page, UUID: "{params.uuid}"</h1>
        <button onClick={()=>navi("/play")}>Leave</button>
      </>
  );
}

export default MatchPage;