import { useNavigate, useParams } from "react-router";
import "../index.css";
import GameField from "../components/game_field";
import OptionsBar from "../components/optionsBar/optionsBar";

const MatchPage = () => {
  const params = useParams();
  const navi = useNavigate();
  return (
      <>
        <OptionsBar/>
        
        <GameField boardRadius={3}/>
      </>
  );
}

export default MatchPage;