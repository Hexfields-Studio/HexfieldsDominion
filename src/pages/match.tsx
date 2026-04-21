import { useNavigate, useParams } from "react-router";
import "../index.css";
import GameField from "../components/gameField/game_field";
import OptionsButton from "../components/optionsButton/optionsButton";
import { useEffect } from "react";
import InMemoryMatchRepository from "../repository/InMemoryMatchRepository";
import { useMatchRepository } from "../contexts/contexts";

const MatchPage = () => {
  const params = useParams();
  const navi = useNavigate();
  const { repository, setRepository } = useMatchRepository();

  useEffect(()=>{
    repository.closeConnection();
    setRepository(new InMemoryMatchRepository);
    return () => repository.closeConnection();
  },[]);

  return (
    <>
      <OptionsButton/>
        
      <GameField boardRadius={3}/>
    </>
  );
};

export default MatchPage;