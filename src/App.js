import React, { useContext, useEffect } from "react";
import "./style.scss"
import "./App.scss"
import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext";
import Deckbuilder from "./pages/Deckbuilder";
import Community from "./pages/Community";
import { setToLocalStorage } from "./components/LocalStorage/localStorageHelper";
import Deckviewer from "./pages/Deckviewer";
import DeckCardLoader from "./pages/DeckCardLoader";
import smoothscroll from "smoothscroll-polyfill";
import AcardCGHpage from "./pages/AcardCGHpage";
import AcardHXHpage from "./pages/AcardHXHpage";
import AcardIMSpage from "./pages/AcardIMSpage";
import AcardJJKpage from "./pages/AcardJJKpage";
import AcardKMYpage from "./pages/AcardKMYpage";
import AcardTOApage from "./pages/AcardTOApage";
import AcardTSKpage from "./pages/AcardTSKpage";
import AcardBTRpage from "./pages/AcardBTRpage";
import AcardMHApage from "./pages/AcardMHApage";
import AcardGNTpage from "./pages/AcardGNTpage";
import Articleviewer from "./pages/Articleviewer";
import DigimonPage from "./pages/DigimonPage";
import Geekhub from "./pages/Geekhub";
import ArticleUI from "./pages/ArticleUI";
import TestPage from "./pages/TestPage";
import DTCGBTpage from "./pages/DTCGBTpage";
import UnionArenaPage from "./pages/UnionArenaPage";
import UADecklistSharingPage from "./pages/UADecklistSharingPage";
import AccountDetails from "./pages/AccountDetailsPage";

smoothscroll.polyfill();

function App() {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      setToLocalStorage("filteredCards", []);
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        setToLocalStorage("filteredCards", []);
      });
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <div id="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" />
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="account" element={<AccountDetails/>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="credits" element={<Community />} />
          <Route path="articles" element={<Articleviewer />} />
          <Route path="geekhub" element={<Geekhub />} />
          <Route path="deckbuilder" element={<Deckbuilder />} />
          <Route path="deckviewer" element={<Deckviewer />} />
          <Route path="test" element={<TestPage />} />
          <Route path="/deck/:deckId" element={<DeckCardLoader />} />
          <Route path="/unionarena/cgh" element={<AcardCGHpage />} />
          <Route path="/unionarena/hxh" element={<AcardHXHpage />} />
          <Route path="/unionarena/ims" element={<AcardIMSpage />} />
          <Route path="/unionarena/jjk" element={<AcardJJKpage />} />
          <Route path="/unionarena/kmy" element={<AcardKMYpage />} />
          <Route path="/unionarena/toa" element={<AcardTOApage />} />
          <Route path="/unionarena/tsk" element={<AcardTSKpage />} />
          <Route path="/unionarena/btr" element={<AcardBTRpage />} />
          <Route path="/unionarena/mha" element={<AcardMHApage />} />
          <Route path="/unionarena/gnt" element={<AcardGNTpage />} />
          <Route path="unionarena" element={<UnionArenaPage/>} />
          <Route path="uadecklist" element={<UADecklistSharingPage/>} />
          <Route path="digimon" element={<DigimonPage/>}/>
          <Route path="/digimon/:booster" element={<DTCGBTpage/>}/>
          <Route path="/article01" element={<ArticleUI />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
