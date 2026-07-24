import React from "react";
import styles from "./RecipeDisplay.module.scss";
import type { StructureType } from "@/repository/MatchRepository";
import { useRecipes } from "@/hooks/matchHooks/useRecipes";

interface RecipeDisplayProps {
  structureType: StructureType;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = (props: RecipeDisplayProps) => {
  const { structureType } = props;

  const recipes = useRecipes();

  return (
    <div className={styles.recipeDisplay}>
      <h5>Recipe</h5>
      { recipes &&
            (Object.entries(recipes[structureType])).map(entry => {
              const [resource, amount] = entry;
              return <p key={resource}>{`${amount}x ${resource.toLowerCase()}`}</p>;
            })
      }
    </div>
  );
};

export default RecipeDisplay;