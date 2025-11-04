import { useTestContext } from "../context/TestContext";
import "../index.css";


const HomePage = () => {
  const {isLoggedIn, setIsLoggedIn} = useTestContext();
  return (
      <>
        <h1>This is the HomePage</h1>
        <p>Logged In: {isLoggedIn ? "true" : "false"}</p>
        <button onClick={()=>setIsLoggedIn(!isLoggedIn)}>Toggle "isLoggedIn"</button>
      </>
  );
}

export default HomePage;