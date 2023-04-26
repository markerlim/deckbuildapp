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
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="disclaimer" element={<Community />} />
          <Route path="deckbuilder" element={<Deckbuilder />} />
          <Route path="deckviewer" element={<Deckviewer />} />
          <Route path="/deck/:deckId" element={<DeckCardLoader />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
