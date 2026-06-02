import { useParams } from "react-router";
import "@/index.css";
import styles from "@/pages/match.module.scss";
import GameField from "@/components/gameField/game_field";
import OptionsButton from "@/components/optionsButton/optionsButton";
import { useEffect, useState } from "react";
import InMemoryMatchRepository from "@/repository/InMemoryMatchRepository";
import { useMatchRepository, useAuth } from "@/contexts/contexts";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { GameProvider } from "@/contexts/GameContext";
import type { Field, Recipes } from "@/repository/MatchRepository";

const MatchPage = () => {
  const params = useParams();
  const matchUUID = params.uuid ?? "";
  const { repository, setRepository } = useMatchRepository();
  const { fetchWithAuth } = useAuth();
  const [lobbyCode, setLobbyCode] = useState<string | undefined>();
  useHeartbeat(lobbyCode);

  useEffect(()=> {
    setRepository(new InMemoryMatchRepository);

    const fetchLobbyCode = async () => {
      const response = await fetchWithAuth(`/games/${matchUUID}/lobby`, "GET");
      if (!response || response.status !== 200) {
        return;
      }

      const responseJson = await response.json();
      
      setLobbyCode(responseJson.lobbyCode);
    };

    fetchLobbyCode();
  }, []);

  useEffect(()=>{
    const fetchFields = async () => {
      const fields = await fetchWithAuth(`/games/${matchUUID}/fields`, "GET");
      const recipes = await fetchWithAuth(`/games/recipes`, "GET");
      if (!fields || fields.status !== 200 || !recipes || recipes.status !== 200) {
        return;
      }

      const fieldsJson: Field[] = await fields.json();
      const recipesJson: Recipes = await recipes.json();
      repository.setFields(fieldsJson);
      repository.setRecipes(recipesJson);
    }
    fetchFields();
  }, [repository])

  return (
    <div className={styles.matchPageContainer}>
      <OptionsButton/>
      <GameProvider gameUUID={matchUUID}>
        <GameField boardRadius={3}/>
      </GameProvider>
    </div>
  );
};

export default MatchPage;