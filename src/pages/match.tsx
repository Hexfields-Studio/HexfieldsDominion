import { useNavigate, useParams } from "react-router";
import "../index.css";
import GameField from "../components/game_field";

const MatchPage = () => {
  const params = useParams();
  const navi = useNavigate();
  return (
      <>
        <GameField boardRadius={3}/>
      </>
  );
}

export default MatchPage;