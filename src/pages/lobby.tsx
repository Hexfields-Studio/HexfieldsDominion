import "../index.css";
import { useParams } from "react-router";

const Lobby = () => {
  const params = useParams();
  
  return (
      <h1>Lobby, Code: "{params.code}"</h1>
  );
}

export default Lobby;