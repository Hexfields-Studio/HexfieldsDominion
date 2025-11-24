import { useNavigate, useParams } from "react-router";
import "../index.css";
import GameField from "../components/game_field";
import OptionsButton from "../components/optionsButton/optionsButton";

const MatchPage = () => {
  const params = useParams();
  const navi = useNavigate();
  return (
      <>
        <OptionsButton/>
        
        <GameField boardRadius={3}/>
      </>
  );
}

export default MatchPage;