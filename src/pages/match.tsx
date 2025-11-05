import { useParams } from "react-router";
import "../index.css";

const MatchPage = () => {
  const params = useParams();
  
  return (
      <h1>Match Page, UUID: "{params.uuid}"</h1>
  );
}

export default MatchPage;