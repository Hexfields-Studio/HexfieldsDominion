import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/home";
import StartMenu from "./pages/play/play";
import Lobby from "./pages/lobby";
import MatchPage from "./pages/match";
import ProtectedRoute from "./components/protected_route";
import { ContextProviderTEST } from "./context/TestContext";

// https://reactrouter.com/start/declarative/routing


const BASE_URL = "/HexfieldsDominion/";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ContextProviderTEST>
        <BrowserRouter basename={BASE_URL}>
            <Routes>

                {/*
                    / or /home = Home Page
                    /play = Start menu
                    /lobby = Lobby
                    /match = Match Page
                */}
                <Route path={"/"} element={<HomePage />} />
                <Route path={"home"} element={<HomePage />} />

                <Route element={<ProtectedRoute redirectTo={"home"}/>}>
                    <Route path={"play"} element={<StartMenu />} />
                    <Route path={"lobby/:code"} element={<Lobby />} />
                    <Route path={"match/:uuid"} element={<MatchPage />} />

                    <Route path={"lobby"} element={<Navigate to="/play" />} />
                    <Route path={"match"} element={<Navigate to="/play" />} />
                    {//Ohne code auf Start Page zurückweisen oder so
                    }
                </Route>
            </Routes>
        </BrowserRouter>
    </ContextProviderTEST>
);