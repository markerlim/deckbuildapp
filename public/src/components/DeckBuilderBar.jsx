import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close,
  Delete,
  ImportExport,
  MoreVert,
  Save,
  SystemUpdateAlt,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { setToLocalStorage } from "./LocalStorage/localStorageHelper";
import { db } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FullScreenDialog from "./FullScreenDialog";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ImagePickerModal from "./ImagePickerModal";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";

// Card Picker Modal Component
const CardPickerModal = ({ open, onClose, filteredCards, onCardSelect }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#26262d",
          color: "#f2f3f8",
          padding: "20px",
          borderRadius: "10px",
          height: "80%",
          width: "80%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Pick a Card
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
            width: "100%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          {filteredCards &&
            filteredCards.map((card, index) => (
              <Box
                key={index}
                sx={{
                  width: "80px",
                  height: "120px",
                  cursor: "pointer",
                  border: "2px solid transparent",
                  borderRadius: "8px",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "#d14a5b",
                  },
                }}
                onClick={() => {
                  onCardSelect(card.urlimage || card.image);
                  onClose(); // Close modal after card selection
                }}
              >
                <img
                  src={card.urlimage || card.image}
                  alt={`Card ${index + 1}`}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            ))}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "#fff",
          }}
        >
          <Close />
        </IconButton>
      </Box>
    </Modal>
  );
};

const DeckBuilderBar = ({
  changeClick,
  setChangeClick,
  setHideDeckbar,
  style,
}) => {
  const { currentUser } = useAuth();
  const { filteredCards, setFilteredCards } = useCardState();
  const [deckName, setDeckName] = useState("myDeckId");
  const [totalCount, setTotalCount] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeckLoaderModal, setShowDeckLoaderModal] = useState(false); // State to manage the visibility of the DeckLoader modal
  const [isUpdatingExistingDeck, setIsUpdatingExistingDeck] = useState(false);
  const [loadedDeckUid, setLoadedDeckUid] = useState(null);
  const [deckDetails, setDeckDetails] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [shouldSaveDeck, setShouldSaveDeck] = useState(false);
  const [viewDeckbar, setViewDeckbar] = useState(true);
  const [viewdeckStatus, setViewdeckStatus] = useState(null);
  const [deckviewMode, setDeckviewMode] = useState(false);
  const [showPadding, setShowPadding] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportImage, setExportImage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [chosenCardUrl, setChosenCardUrl] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [deckUidParams, setDeckUidParams] = useState(
    searchParams.get("deckUid") || ""
  );
  const [loadedFromParams, setLoadedFromParams] = useState(false);
  const sortedCards = [...filteredCards].sort((a, b) => {
    const categoryOrder = { character: 0, event: 1, field: 2 };

    // Compare categories based on the predefined order
    const categoryComparison =
      categoryOrder[a.category] - categoryOrder[b.category];
    if (categoryComparison !== 0) return categoryComparison;

    // If categories are the same, sort by energycost
    return a.energycost - b.energycost;
  });

  const sorttotalCount = sortedCards.reduce(
    (acc, card) => acc + (card.count || 0),
    0
  );

  useEffect(() => {
    if (changeClick === true) {
      setFilteredCards(sortedCards);
      setTotalCount(sorttotalCount);
      console.log("Card count changed! TRUE");
    }
    if (changeClick === false) {
      setFilteredCards(sortedCards);
      setTotalCount(sorttotalCount);
      console.log("Card count changed! FALSE");
    }
  }, [changeClick]);

  const images = [
    "/images/deckimage.jpg",
    "/images/deckimage1.jpg",
    "/images/deckimage2.jpg",
    "/images/deckimage3.jpg",
    "/images/deckimage4.jpg",
    "/images/deckimage5.jpg",
    "/images/deckimage6.jpg",
    "/images/deckimage7.jpg",
    "/images/deckimage8.jpg",
    "/images/deckimage9.jpg",
    "/images/deckimage10.jpg",
    "/images/deckimage11.jpg",
    "/images/deckimage12.jpg",
    "/images/deckimage13.jpg",
    "/images/deckimage14.jpg",
    "/images/deckimage15.jpg",
    "/images/deckimage16.jpg",
    "/images/deckimage17.jpg",
    "/images/deckimage18.jpg",
    "/images/deckimage19.jpg",
    "/images/deckimage20.jpg",
    "/images/deckimage21.jpg",
    "/images/deckimage22.jpg",
    "/images/deckimage23.jpg",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage24.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage25.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage26.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage27.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage28.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage29.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage30.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage31.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage32.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage33.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage34.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage35.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage36.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckimage37.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-1.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-2.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-3.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-4.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-5.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-6.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-7.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-8.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-9.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-10.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-11.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-12.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-13.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-14.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-15.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-16.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-17.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-18.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-19.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-20.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-21.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-22.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-23.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-24.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-25.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-26.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-27.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-28.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-29.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-30.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-31.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-32.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-33.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-34.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-35.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-36.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-37.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-38.webp",
    "https://storage.googleapis.com/geek-stack.appspot.com/deckcovers/deckcover-39.webp",
  ];
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClearClick = () => {
    setToLocalStorage("filteredCards", []);
    setDeckName("myDeckId");
    setLoadedDeckUid(null); // Clear the loadedDeckUid
    setIsUpdatingExistingDeck(false); // Set isUpdatingExistingDeck to false
    handleMenuClose();
    setFilteredCards([]);
    setDeckUidParams("");
    setTotalCount(0);
    const currentPath = window.location.pathname;
    window.history.pushState({}, "", currentPath);
  };
  // Filter the cards based on the triggerState that are color
  const colorCards = filteredCards.filter(
    (card) => card.triggerState.toLowerCase() === "color".toLowerCase()
  );
  const colorCount = colorCards.reduce(
    (accumulator, card) => accumulator + (card.count || 0),
    0
  );
  // Filter the cards based on the triggerState that are special
  const specialCards = filteredCards.filter(
    (card) => card.triggerState.toLowerCase() === "special".toLowerCase()
  );
  const specialCount = specialCards.reduce(
    (accumulator, card) => accumulator + (card.count || 0),
    0
  );
  // Filter the cards based on the triggerState that are final
  const finalCards = filteredCards.filter(
    (card) => card.triggerState.toLowerCase() === "final".toLowerCase()
  );
  const finalCount = finalCards.reduce(
    (accumulator, card) => accumulator + (card.count || 0),
    0
  );
  const calculateStats = () => {
    const energyCounts = filteredCards.reduce((acc, card) => {
      const energyKey = card.energycost >= 10 ? 10 : card.energycost;
      acc[energyKey] = (acc[energyKey] || 0) + card.count;
      return acc;
    }, {});

    return energyCounts;
  };

  const stats = calculateStats();
  const handleExportClick = () => {
    const exportElement = document.getElementById("UATCGExport");
    if (exportElement) {
      html2canvas(exportElement, { useCORS: true })
        .then((canvas) => {
          // Compress the image by setting the quality parameter (0.0 to 1.0)
          const imgData = canvas.toDataURL("image/jpeg", 0.5); // Adjust quality parameter as needed (e.g., 0.5 for 50% quality)

          const link = document.createElement("a");
          link.href = imgData;
          link.download = "exported_image.jpg";
          link.click();
        })
        .catch((error) => {
          console.error("Error exporting image:", error);
        });
    }
  };
  const createNewDeck = async (uid, specialImage) => {
    const userDocRef = doc(db, "users", uid);

    // Get the decksCounter from the user document
    const userDocSnapshot = await getDoc(userDocRef);
    const decksCounter = userDocSnapshot.get("decksCounter") || 0;

    // Update the decksCounter for the user
    await updateDoc(userDocRef, { decksCounter: decksCounter + 1 });

    // Generate a new deckuid based on the updated decksCounter
    const deckUid = `gsdeck${String(decksCounter + 1).padStart(8, "0")}`;
    const deckDocRef = doc(db, `users/${uid}/decks`, deckUid);

    const deckInfo = {
      deckName: deckName,
      deckuid: deckUid,
      colorCount: colorCount,
      specialCount: specialCount,
      finalCount: finalCount,
      image: specialImage,
      // Add any other information about the deck as required
    };
    // Create a document for the deck with the new name and deck info
    await setDoc(deckDocRef, deckInfo);

    // Create a placeholder document in the  collection if it doesn't exist yet
    const placeholderRef = doc(db, `users/${uid}/decks`, "placeholder");
    if (!(await getDoc(placeholderRef)).exists()) {
      await setDoc(placeholderRef, {
        placeholder: true,
        // any other default values you'd like to set
      });
    }

    return deckUid; // return this value so we can use it in handleSaveClick
  };
  const updateExistingDeck = async (uid, deckUid, specialImage) => {
    console.log("Updating", specialImage);
    const deckDocRef = doc(db, `users/${uid}/decks`, deckUid);

    const deckInfo = {
      deckName: deckName,
      deckuid: deckUid,
      colorCount: colorCount,
      specialCount: specialCount,
      finalCount: finalCount,
      image: specialImage,
      // Add any other information about the deck as required
    };
    // Update the deck name in the existing document
    await updateDoc(deckDocRef, { deckName: deckName, ...deckInfo });
  };
  const handleSaveClick = async (specialImage, proceed = false) => {
    if (!proceed && totalCount < 50) {
      setShowConfirmDialog(true);
      return;
    }

    if (!currentUser) {
      return;
    }

    const uid = currentUser.uid;

    try {
      let deckUid;
      if (!isUpdatingExistingDeck) {
        deckUid = await createNewDeck(uid, specialImage);
      } else {
        deckUid = loadedDeckUid;
        await updateExistingDeck(uid, deckUid, specialImage);
      }

      const cardsCollectionRef = collection(
        db,
        `users/${uid}/decks/${deckUid}/cards`
      );
      const existingCardSnapshot = await getDocs(cardsCollectionRef);
      const existingCards = existingCardSnapshot.docs.map(
        (doc) => doc.data().cardUid
      );

      await Promise.all(
        filteredCards.map(async (card) => {
          const cardDocRef = doc(cardsCollectionRef, card.cardUid);
          const cardData = {
            anime: card.anime,
            animeLower: card.animeLower,
            apcost: card.apcost,
            banRatio: card.banRatio,
            banWith: card.banWith,
            basicpower: card.basicpower,
            booster: card.booster,
            boosterLower: card.boosterLower,
            cardId: card.cardId,
            cardUid: card.cardUid,
            cardName: card.cardName,
            cardNameLower: card.cardNameLower,
            cardNameTokens: card.cardNameTokens,
            category: card.category,
            color: card.color,
            effect: card.effect,
            energycost: card.energycost,
            energygen: card.energygen,
            image: card.image,
            rarity: card.rarity,
            rarityLower: card.rarityLower,
            traits: card.traits,
            trigger: card.trigger,
            triggerState: card.triggerState,
            urlimage: card.urlimage,
            count: card.count,
          };
          try {
            await setDoc(cardDocRef, cardData);
            console.log("Card saved successfully:", card.cardUid);
          } catch (error) {
            console.error("Error saving card:", error);
          }
        })
      );

      for (const cardUid of existingCards) {
        if (!filteredCards.some((card) => card.cardUid === cardUid)) {
          const cardToDeleteRef = doc(cardsCollectionRef, cardUid);
          await deleteDoc(cardToDeleteRef);
          console.log("Card deleted:", cardUid);
        }
      }

      console.log("Data saved successfully!");
      setSaveStatus("success");
      // Reset the component state
      setIsUpdatingExistingDeck(false);
      setLoadedDeckUid(null);
      setShouldSaveDeck(false); // Reset shouldSaveDeck to false
    } catch (error) {
      console.error("Error saving data: ", error);
      setSaveStatus("error");
    }
  };

  const handleProceedSave = () => {
    setShouldSaveDeck(true);
    setShowImagePickerModal(true);
    setShowConfirmDialog(false);
  };

  const handleLoadDeckClick = () => {
    setShowDeckLoaderModal(true); // Open the DeckLoader modal
    setDeckUidParams("");
    const currentPath = window.location.pathname;
    window.history.pushState({}, "", currentPath);
    handleMenuClose();
  };

  const handleViewModeClick = () => {
    if (sortedCards && sortedCards.length > 0) {
      setDeckviewMode(true);
      setViewdeckStatus(null);
    } else {
      setViewdeckStatus("no cards");
    }
    handleMenuClose();
  };

  const handleViewModeClose = () => {
    setDeckviewMode(false);
    setViewdeckStatus(null);
  };

  const handleDeckLoaded = (
    loadedDeckId,
    loadedDeckUid,
    loadedDeckName,
    loadedDeckImage
  ) => {
    setDeckName(loadedDeckName);
    setLoadedDeckUid(loadedDeckUid); // Update the loadedDeckUid
    setExportImage(loadedDeckImage);
    setIsUpdatingExistingDeck(true); //Update the previousDeckName
    setShowDeckLoaderModal(false); // Close the DeckLoader modal
    setChangeClick((prevState) => !prevState);
  };

  const getImageSrc = (energycost) => {
    switch (energycost) {
      case 0:
        return "/images/ENERGY0.png";
      case 1:
        return "/images/ENERGY1.png";
      case 2:
        return "/images/ENERGY2.png";
      case 3:
        return "/images/ENERGY3.png";
      case 4:
        return "/images/ENERGY4.png";
      case 5:
        return "/images/ENERGY5.png";
      case 6:
        return "/images/ENERGY6.png";
      case 7:
        return "/images/ENERGY7.png";
      case 8:
        return "/images/ENERGY8.png";
      case 9:
        return "/images/ENERGY9.png";
      case 10:
        return "/images/ENERGY10.png";
      // Add more cases as needed
      default:
        return "/images/ENERGYDEFAULT.png";
    }
  };

  const fetchDeckDetails = async (deckUid) => {
    if (!currentUser || !deckUid) {
      return;
    }

    const uid = currentUser.uid;
    try {
      const deckRef = doc(db, `users/${uid}/decks`, deckUid);
      const deckSnapshot = await getDoc(deckRef);

      if (deckSnapshot.exists()) {
        const data = deckSnapshot.data();
        return {
          id: deckSnapshot.id,
          name: data.deckName,
          description: data.description,
          colorCount: data.colorCount,
          specialCount: data.specialCount,
          finalCount: data.finalCount,
          image: data.image,
          ...data,
        };
      } else {
        // Handle the case where the deck does not exist
        console.log("No such deck!");
        return null;
      }
    } catch (error) {
      // Handle any errors
      console.error("Error fetching deck details: ", error);
      return null;
    }
  };

  const loadDeckCards = async (deckId) => {
    const querySnapshot = await getDocs(
      collection(db, `users/${currentUser.uid}/decks/${deckId}/cards`)
    );
    const cards = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cards.push({
        id: doc.id,
        ...data,
      });
    });
    return cards;
  };
  const handleDeckClick = async (deck) => {
    const cards = await loadDeckCards(deck.id);

    setFilteredCards(cards);
    handleDeckLoaded(deck.id, deck.deckuid, deck.name, deck.image);
  };

  const handleDeckview = () => {
    setViewDeckbar((prev) => !prev);
    setHideDeckbar((prev) => !prev);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePickingImage = () => {
    setIsModalOpen(true);
  };

  const handleCardSelect = (cardUrl) => {
    setChosenCardUrl(cardUrl);
  };

  useEffect(() => {
    const loadDeckData = async () => {
      if (deckUidParams && deckUidParams.trim() !== "") {
        try {
          // Assuming fetchDeckDetails is an async function that returns deck details
          const deckDetails = await fetchDeckDetails(deckUidParams);
          if (deckDetails) {
            // Call handleDeckClick with the fetched deck details
            await handleDeckClick(deckDetails);
          }
        } catch (error) {
          console.error("Error loading deck details:", error);
        }
      }
    };

    loadDeckData();
  }, [deckUidParams]); // Dependency array includes deckUidParams

  useEffect(() => {
    if (saveStatus === "success") {
      handleClearClick();
      console.log("cleared");
    }
  }, [saveStatus]);

  useEffect(() => {
    if (viewDeckbar) {
      setShowPadding(true);
    } else {
      // 300ms is the default transition duration for Collapse.
      // Adjust if you've set a different duration.
      setTimeout(() => {
        setShowPadding(false);
      }, 300);
    }
    // Clear the timeout when the component is unmounted
    return () => clearTimeout();
  }, [viewDeckbar]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        bgcolor: "#f2f3f8",
        color: "#121212",
        zIndex: 1,
        paddingTop: showPadding ? "10px" : "0px",
        paddingBottom: showPadding ? "10px" : "0px",
        paddingLeft: "10px",
        paddingRight: "10px",
        ...style,
      }}
    >
      <Collapse in={viewDeckbar}>
        <Box display={"flex"} flexDirection={"row"} gap={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Box>
                <TextField
                  label="Deck Name"
                  variant="outlined"
                  size="small"
                  value={deckName}
                  onChange={(event) => setDeckName(event.target.value)}
                  inputProps={{ style: { color: "#121212" } }}
                  sx={{
                    "& .MuiInputLabel-filled": { color: "#121212" },
                    "& .MuiFilledInput-input": { color: "#121212" },
                  }}
                />
              </Box>
              <Box sx={{ fontSize: 11 }}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <img src="/icons/TTOTAL.png" alt="Total:" />{" "}
                      <span
                        style={{ color: totalCount > 50 ? "red" : "inherit" }}
                      >
                        {totalCount}
                        <span className="mobile-hidden">/50</span>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <img src="/icons/TCOLOR.png" alt="Color:" />{" "}
                      <span
                        style={{ color: colorCount > 4 ? "red" : "inherit" }}
                      >
                        {colorCount}
                        <span className="mobile-hidden">/4</span>
                      </span>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <img src="/icons/TSPECIAL.png" alt="Special:" />{" "}
                      <span
                        style={{ color: specialCount > 4 ? "red" : "inherit" }}
                      >
                        {specialCount}
                        <span className="mobile-hidden">/4</span>
                      </span>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <img src="/icons/TFINAL.png" alt="Final:" />{" "}
                      <span
                        style={{ color: finalCount > 4 ? "red" : "inherit" }}
                      >
                        {finalCount}
                        <span className="mobile-hidden">/4</span>
                      </span>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  flexWrap: "wrap",
                }}
              >
                {Array.from({ length: 11 }).map((_, index) => (
                  <Box
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                    }}
                  >
                    <img
                      src={getImageSrc(index)}
                      alt={`Energy cost ${index}`}
                      width="30px"
                      height="auto"
                    />
                    <span>:{stats[index] || 0}</span>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "row",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#171614",
                  borderRadius: "5px",
                  "&:hover": { bgcolor: "#171614" },
                }}
                onClick={handleClearClick}
              >
                <Delete
                  sx={{ fontSize: "10px", color: "#c8a2c8", fontWeight: "600" }}
                />
                <Typography
                  sx={{ fontSize: "10px", color: "#c8a2c8", fontWeight: "600" }}
                  component="div"
                >
                  Clear
                </Typography>
              </Button>
              <Button
                sx={{
                  backgroundColor: "#171614",
                  borderRadius: "5px",
                  "&:hover": { bgcolor: "#171614" },
                }}
                onClick={handleLoadDeckClick}
              >
                <SystemUpdateAlt
                  sx={{ fontSize: "10px", color: "#c8a2c8", fontWeight: "600" }}
                />
                <Typography
                  sx={{ fontSize: "10px", color: "#c8a2c8", fontWeight: "600" }}
                  component="div"
                >
                  Load
                </Typography>
              </Button>
              <Button
                sx={{
                  backgroundColor: "#171614",
                  borderRadius: "5px",
                  "&:hover": { bgcolor: "#171614" },
                }}
                onClick={() => setShowImagePickerModal(true)}
              >
                <Save
                  sx={{ fontSize: "10px", color: "#c8a2c8", fontWeight: "600" }}
                />
                <Typography
                  sx={{ fontSize: "10px", color: "#c8a2c8", fontWeight: "600" }}
                  component="div"
                >
                  Save
                </Typography>
              </Button>
              <Button
                sx={{
                  backgroundColor: "#171614",
                  borderRadius: "5px",
                  display: "none",
                  "&:hover": { bgcolor: "#171614" },
                }}
                onClick={handleExportClick}
              >
                <ImportExport
                  sx={{ fontSize: "10px", color: "#c8a2c8", fontWeight: "600" }}
                />
                <Typography
                  sx={{ fontSize: "10px", color: "#c8a2c8", fontWeight: "600" }}
                  component="div"
                >
                  Export
                </Typography>
                {isExporting && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress size={"10px"} sx={{ color: "#7C4FFF" }} />
                  </Box>
                )}
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleClearClick}>clear</MenuItem>
              <MenuItem onClick={() => setShowImagePickerModal(true)}>
                save
              </MenuItem>
              <MenuItem onClick={handleLoadDeckClick}>load</MenuItem>
              <MenuItem onClick={handleViewModeClick}>view mode</MenuItem>
              <MenuItem sx={{ display: "none" }} onClick={handleExportClick}>
                export
              </MenuItem>
            </Menu>
            {isExporting && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={"10px"} sx={{ color: "#7C4FFF" }} />
              </Box>
            )}
          </Box>
        </Box>
      </Collapse>
      <Button
        disableRipple
        sx={{
          marginLeft: "auto",
          bgcolor: "#f2f3f8",
          "&:hover": { bgcolor: "#f2f3f8" },
        }}
        onClick={handleDeckview}
      >
        {viewDeckbar ? (
          <>
            <Visibility />
          </>
        ) : (
          <>
            <VisibilityOff />
          </>
        )}
      </Button>
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>{"Save incomplete deck?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your deck has less than 50 cards. Do you want to save it anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleProceedSave()} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <FullScreenDialog
        open={showDeckLoaderModal}
        handleClose={() => setShowDeckLoaderModal(false)}
        handleDeckLoaded={(deckName, deckUid, loadedDeckName, deckimage) =>
          handleDeckLoaded(deckName, deckUid, loadedDeckName, deckimage)
        }
        loadedFromParams={loadedFromParams}
        setLoadedFromParams={setLoadedFromParams}
        deckDetails={deckDetails}
      />
      <Snackbar
        open={saveStatus === "success"}
        autoHideDuration={6000}
        onClose={() => setSaveStatus(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          height: "100%",
        }}
      >
        <Alert
          onClose={() => setSaveStatus(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Deck saved successfully!
          <br />
          Please load your deck to view/edit.
        </Alert>
      </Snackbar>
      <Snackbar
        open={viewdeckStatus === "no cards"}
        autoHideDuration={6000}
        onClose={() => setViewdeckStatus(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          height: "100%",
        }}
      >
        <Alert
          onClose={() => setViewdeckStatus(null)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          There are no cards to view in deck view mode
          <br />
          Please load your deck or build a deck to continue.
        </Alert>
      </Snackbar>
      <ImagePickerModal
        open={showImagePickerModal}
        handleClose={() => setShowImagePickerModal(false)}
        images={images}
        handleSaveClick={handleSaveClick}
      />
      <Modal open={deckviewMode} onClose={handleViewModeClose}>
        <Box
          className="rotated-background"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100vw", sm: "100vw" },
            height: { xs: "100vh", sm: "100vh" },
            p: 10,
          }}
        >
          {chosenCardUrl ? (
            <Box
              sx={{
                position: "relative",
                textAlign: "left",
                height: "300px",
                width: "100%",
                borderRadius: "8px",
                marginTop:'10px',
                backgroundImage: `url('${chosenCardUrl}')`,
                backgroundSize: "cover", // Changed to cover for better background scaling
                backgroundPosition: "0% 0%", // Changed to center for better alignment
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
                  zIndex: 1, // Ensure overlay is above the background image
                },
              }}
              onClick={handlePickingImage}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  height: "100%",
                  paddingLeft: "10px",
                  paddingBottom: "10px",
                  paddingRight: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "end",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{ position: "absolute", bottom: "15px", right: "10px" }}
                >
                  <strong
                    style={{
                      fontSize: "22px",
                      opacity: "0.5",
                      padding: "5px",
                      color: "#F2F3F8",
                      textShadow:
                        "-1px -1px 0 #7C4FFF,1px -1px 0 #7C4FFF,-1px 1px 0 #7C4FFF,1px 1px 0 #7C4FFF",
                    }}
                  >
                    GEEKSTACK
                  </strong>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                position: "relative",
                textAlign: "left",
                height: "300px",
                width: "100%",
                marginTop:'10px',
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: "#f2f3f8",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
                  zIndex: 1, // Ensure overlay is above the background image
                },
              }}
              onClick={handlePickingImage}
            >
              <Box
                sx={{
                  height: "50px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Pick a cover image for
              </Box>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  height: "calc(100% - 50px)",
                  paddingLeft: "10px",
                  paddingBottom: "10px",
                  paddingRight: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "end",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{ position: "absolute", bottom: "15px", right: "10px" }}
                >
                  <strong
                    style={{
                      fontSize: "22px",
                      opacity: "0.5",
                      padding: "5px",
                      color: "#F2F3F8",
                      textShadow:
                        "-1px -1px 0 #7C4FFF,1px -1px 0 #7C4FFF,-1px 1px 0 #7C4FFF,1px 1px 0 #7C4FFF",
                    }}
                  >
                    GEEKSTACK
                  </strong>
                </Box>
              </Box>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "calc(100% - 20px)",
              justifyContent: "center",
              alignItems: "start",
              padding: "10px",
            }}
          >
            {filteredCards.map((uacard) =>
              [...Array(uacard.count || 1)].map((_, index) => (
                <Box
                  key={uacard.cardId + index + "EXPORT"}
                  sx={{
                    flexBasis: "calc(100% / 10)",
                  }}
                >
                  <img
                    loading="lazy"
                    src={uacard.urlimage || uacard.image}
                    draggable="false"
                    alt={uacard.cardId}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Box>
              ))
            )}
          </Box>
          <Box sx={{bottom:'10px',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Button
              variant="contained"
              onClick={handleViewModeClose}
              sx={{ mt: 3 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      <CardPickerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filteredCards={filteredCards}
        onCardSelect={handleCardSelect}
      />
    </Box>
  );
};

export default DeckBuilderBar;
