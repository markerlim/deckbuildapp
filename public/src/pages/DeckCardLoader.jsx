import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import { Box, Grid, Stack } from "@mui/material";
import { CardModal } from "../components/CardModal";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from "recharts";
import DeckCardExporter from "../components/DeckCardExporter";
import ExportWrapper from "../components/ExportWrapper";
import { toJpeg } from "html-to-image";
import { Helmet } from "react-helmet";

const DeckCardLoader = () => {
  const { currentUser } = useAuth();
  const { deckId } = useParams();

  console.log("Deck ID:", deckId);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [energyStats, setEnergyStats] = useState({});
  const [apStats, setApStats] = useState({});
  const [categoryStats, setCategoryStats] = useState({});
  const [showExportWrapper, setShowExportWrapper] = useState(false);

  const calculateStats = () => {
    const energyCounts = cards.reduce((acc, card) => {
      acc[card.energycost] = (acc[card.energycost] || 0) + card.count;
      return acc;
    }, {});

    const apCounts = cards.reduce((acc, card) => {
      acc[card.apcost] = (acc[card.apcost] || 0) + card.count;
      return acc;
    }, {});

    const categoryCounts = cards.reduce((acc, card) => {
      acc[card.category] = (acc[card.category] || 0) + card.count;
      return acc;
    }, {});

    setEnergyStats(energyCounts);
    setApStats(apCounts);
    setCategoryStats(categoryCounts);
  };

  const createChartData = (stats) => {
    return Object.entries(stats).map(([key, value]) => {
      return { key, value };
    });
  };

  const energyChartData = createChartData(energyStats);
  const apChartData = createChartData(apStats);
  const categoryChartData = createChartData(categoryStats);


  const handleOpenModal = (cardId) => {
    const cardsData = JSON.parse(localStorage.getItem("temporaryDocument"));
    const selectedCardData = cardsData.find((card) => card.cardId === cardId);
    setSelectedCard(selectedCardData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };

  const exportDeckAsJpeg = async () => {
    setShowExportWrapper(true);

    setTimeout(async () => {
      const node = document.getElementById("export-wrapper");
      if (!node) {
        return;
      }

      const originalTransform = node.style.transform;
      const originalWidth = node.style.width;
      const originalHeight = node.style.height;

      // Set the desired dimensions for the exported image
      node.style.width = "1920px";
      node.style.height = "1080px";
      node.style.transform = "scale(1)";

      try {
        const dataUrl = await toJpeg(node, { quality: 0.95 });
        const link = document.createElement("a");
        link.download = "deck-export.jpeg";
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to export deck as JPEG:", err);
      } finally {
        // Reset the styles after exporting
        node.style.transform = originalTransform;
        node.style.width = originalWidth;
        node.style.height = originalHeight;
      }
      setShowExportWrapper(false);
    }, 500); // You can adjust the timeout duration (in milliseconds) if needed.
  };



  useEffect(() => {
    const fetchCards = async () => {
      if (!currentUser) {
        return;
      }

      const uid = currentUser.uid;
      const querySnapshot = await getDocs(collection(db, `users/${uid}/decks/${deckId}/cards`));
      const cardDocs = [];
      querySnapshot.forEach((doc) => {
        cardDocs.push(doc.data());
      });
      setCards(cardDocs);
      console.log(cardDocs)
      // Log the fetched cards to the console
      console.log("Fetched cards:", cardDocs);
    };

    fetchCards();
  }, [currentUser, deckId]);

  useEffect(() => {
    // Save the cards to the localStorage
    localStorage.setItem("temporaryDocument", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    calculateStats();
  }, [cards]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "webmanifest";
    link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div >
      <Helmet>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Box bgcolor={"#121212"} color={"#f2f3f8"} minHeight="100vh">
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent={"space-between"}>
          <Box flex={1} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Sidebar />
          </Box>
          <Box flex={10} sx={{ display: "flex", flexDirection: "column" }}>
            <br></br>
            <Box id="stats-and-cards" sx={{ display: "flex", flexDirection: "row" }}>
              <Box flex={8} p={1} sx={{ overflowY: "auto", height: { xs: "calc(100vh - 112px)", sm: "calc(100vh - 112px)", md: "calc(100vh - 64px)" }, }} className="hide-scrollbar">
                <Grid container spacing={2} justifyContent="center">
                  {cards.sort((a, b) => {
                    if (a.category === b.category) {
                      return a.energycost - b.energycost; // If the categories are the same, sort by energycost
                    }
                    return a.category > b.category ? 1 : -1; // Else sort by category
                  }).map((card) => (
                    <Grid item key={card.id}>
                      <Box display={"flex"} flexDirection={"column"} sx={{ textAlign: "center" }}>
                        <img
                          loading="lazy"
                          src={card.image}
                          draggable="false"
                          alt={card.front}
                          className="image-responsive"
                          onClick={() => handleOpenModal(card.cardId)}
                        />
                        <span>{card.count}</span>
                      </Box>
                    </Grid>
                  ))}
                  <div style={{ height: '300px' }} />
                  {selectedCard && (
                    <CardModal
                      open={openModal}
                      onClose={handleCloseModal}
                      selectedCard={selectedCard}
                    />
                  )}
                </Grid>
                <div style={{ height: "100px" }} />
              </Box>
              <Box flex={2} p={1} sx={{ display: { xs: "none", sm: "none", md: "block" }, textAlign: "center", color: "#f2f3f8" }}>
                <Box sx={{ display: { xs: "none", sm: "block" } }}><img style={{ width: "auto", height: 150 }} alt="uniondeck" src="/icons/uniondecklogo.png" /></Box>
                <br></br>
                <Box width="100%" textAlign="center"><button onClick={exportDeckAsJpeg} disabled>Export as JPEG</button></Box>
              </Box>
            </Box>
          </Box>
        </Stack>
        <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
          <BottomNav />
        </Box>
      </Box>
      {showExportWrapper && (
        <ExportWrapper>
          <DeckCardExporter
            cards={cards}
            energyChartData={energyChartData}
            apChartData={apChartData}
            categoryChartData={categoryChartData}
          />
        </ExportWrapper>
      )};

    </div>
  );
};

export default DeckCardLoader;
