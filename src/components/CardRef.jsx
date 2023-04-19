import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal"
import {ResponsiveImage} from "./ResponsiveImage";

const CardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleOpenModal = (document) => {
        setSelectedCard(document);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    useEffect(() => {
        const fetchDocuments = async () => {
            const querySnapshot = await getDocs(collection(db, "unionarenatcg"));
            const documentsArray = [];
            querySnapshot.forEach((doc) => {
                documentsArray.push(doc.data());
            });
            setDocuments(documentsArray);
            setToLocalStorage("documents", documentsArray);
        };
    
        const localDocuments = getFromLocalStorage("documents");
        if (localDocuments) {
            setDocuments(localDocuments);
        } else {
            fetchDocuments();
        }
    }, []);


    return (
        <div>
            <Grid container spacing={2} justifyContent="center">
                {documents.map((document) => (
                    <Grid item key={document.cardId}>
                        <Box onClick={() => handleOpenModal(document)} >
                            <ResponsiveImage
                                loading="lazy"
                                src={document.image}
                                draggable="false"
                                alt="test"
                            />
                        </Box>
                    </Grid>
                ))}
                {selectedCard && (
                    <CardModal
                        open={openModal}
                        onClose={handleCloseModal}
                        selectedCard={selectedCard}
                    />
                )}
            </Grid>
        </div>
    );
}

export default CardRef