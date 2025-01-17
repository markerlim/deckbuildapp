import React, { useEffect, useState } from "react";
import { Box, Grid, Select, MenuItem, FormControl, Button, Slider, useMediaQuery } from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { CRBTCGCardDrawerNF } from "./CRBTCGCardDrawerFormatted";


const CRBTCGcardFormat = () => {
    const [carddata, setCarddata] = useState([]);
    const cookierunboosterurl = "https://geekstack.up.railway.app/api/boosterlist/cookierunbraverse"
    const { booster: rawBooster } = useParams();
    const boostercode = rawBooster.toUpperCase();
    const [listOfColors, setListofColors] = useState([]);
    const [listOfRarities, setListofRarities] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [imageWidth, setImageWidth] = useState(100); //store value of slider
    const imageHeight = imageWidth * 1.395;
    const [boosterFilter, setBoosterFilter] = useState("");
    const [boosterName, setBoosterName] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [rarityFilter, setRarityFilter] = useState("");
    const isMedium = useMediaQuery('(min-width:900px)');
    const navigate = useNavigate();
    const location = useLocation();

    const goBack = () => {
        navigate(-1);
    };
    const getCurrentImage = (document) => {
        let currentImage = document.image;
        return currentImage;
    };
    const handleOpenModal = (document) => {
        const currentImage = getCurrentImage(document);
        setSelectedCard({
            ...document,
            currentImage: currentImage
        });
        setOpenModal(true);
    };
    const handleSwipeLeft = () => {
        let currentIndex = filteredDocuments.findIndex((doc) => doc.cardNo === selectedCard.cardNo);
        let nextIndex = (currentIndex + 1) % filteredDocuments.length;
        let nextDocument = filteredDocuments[nextIndex];

        const currentImage = getCurrentImage(nextDocument);
        setSelectedCard({
            ...nextDocument,
            currentImage: currentImage
        });
    };
    const handleSwipeRight = () => {
        let currentIndex = filteredDocuments.findIndex((doc) => doc.cardNo === selectedCard.cardNo);
        let prevIndex = (currentIndex - 1 + filteredDocuments.length) % filteredDocuments.length;
        let prevDocument = filteredDocuments[prevIndex];
        const currentImage = getCurrentImage(prevDocument);
        setSelectedCard({
            ...prevDocument,
            currentImage: currentImage
        });
    };
    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };
    const resetFilters = () => {
        setBoosterFilter("");
        setColorFilter("");
        setRarityFilter("");
        setDetailsByBoosterCode(boostercode);
    };
    const filteredDocuments = documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.boostercode === boosterFilter;
        const colorFilterMatch = !colorFilter || document.energyType === colorFilter;
        const rarityFilterMatch = !rarityFilter || document.rarity === rarityFilter;

        return boosterFilterMatch && colorFilterMatch && rarityFilterMatch;
    });
    const handleSliderChange = (event, newValue) => {
        setImageWidth(newValue);
    };

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }
    const setDetailsByBoosterCode = (boostercode) => {
        const boosterDetails = carddata.find(data => data.booster === boostercode);
        if (boosterDetails) {
            setBoosterFilter(boosterDetails.boostercode);
            setListofColors(boosterDetails.listofcolors || []);
            setListofRarities(boosterDetails.listofrarities || []);
        } else {
            console.error(`No details found for code: ${boostercode}`);
        }
    };

    useEffect(() => {
        // Fetch the booster data first
        fetch(cookierunboosterurl)
            .then(response => response.json())
            .then(data => {
                setCarddata(data);
                // After fetching the card data, find the anime details based on the animecode
                const booster = boostercode.toLowerCase();
                const boosterDetails = data.find(item => item.booster === booster);
                if (booster) {
                    const fetchDocuments = async () => {
                        try {
                            const response = await fetch(`https://geekstack.up.railway.app/api/cookierunbraverse/${booster}?page=0&size=100`);
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                
                            const data = await response.json();
                            setDocuments(data.content || []); // Assuming the response contains a "content" array
                        } catch (err) {
                            console.error("Error fetching cards:", err);
                        }
                    };
                
            
                    fetchDocuments();
                    setBoosterName(booster);
                    setBoosterFilter(booster);
                    setListofColors(boosterDetails.listofcolors || []);
                    setListofRarities(boosterDetails.listofrarities || []);
                } else {
                    console.error(`No booster details found for code: ${boostercode}`);
                }

                const queryParams = new URLSearchParams(window.location.search);
                const boosterParam = queryParams.get('booster');

                // Set the booster filter if the parameter exists
                if (boosterParam) {
                    setBoosterFilter(boosterParam.toUpperCase());
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [boostercode]);



    return (
        <div style={{ position: 'relative' }}>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, flexDirection: "column", justifyContent: "center", marginBottom: 2, alignItems: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FormControl sx={{ margin: 1 }}>
                        <Select
                            sx={{
                                display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                                whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                                fontSize: 11, width: "60px", height: "30px",
                                '& .MuiSelect-icon': {
                                    display: "none",
                                    position: "absolute"
                                },
                            }}
                            value={rarityFilter}
                            onChange={(event) => setRarityFilter(event.target.value)}
                            displayEmpty // Add this prop to display the placeholder when the value is empty
                            renderValue={(selectedValue) => selectedValue || 'Rarity'} // Add this prop to display the placeholder text when the value is empty
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {listOfRarities.map(rarity => (
                                <MenuItem key={rarity} value={rarity}>
                                    {rarity}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ margin: 1 }}>
                        <Select
                            sx={{
                                display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                                whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                                fontSize: 11, width: "60px", height: "30px",
                                '& .MuiSelect-icon': {
                                    display: "none",
                                    position: "absolute"
                                },
                            }}
                            value={colorFilter}
                            onChange={(event) => setColorFilter(event.target.value)}
                            displayEmpty // Add this prop to display the placeholder when the value is empty
                            renderValue={(selectedValue) => selectedValue || 'Color'}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {listOfColors.map(color => (
                                <MenuItem key={color} value={color}>
                                    {color}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        sx={{
                            minWidth: 0, // Set the minimum width to 0 to allow the button to shrink
                            width: 30, // Change this value to adjust the width
                            height: 20,
                            margin: 1,
                            padding: 1, // Adjust the padding as needed 
                            backgroundColor: "#f2f3f8",
                            color: "#240052",
                            '&:hover': {
                                backgroundColor: "#240052", // Change this to the desired hover background color
                                color: "#f2f3f8", // Change this to the desired hover text color if needed
                            },
                        }}
                        onClick={resetFilters}
                    >
                        <Refresh sx={{ fontSize: 15 }} />
                    </Button>
                    <Box sx={{ width: 100 }}>
                        <Slider
                            value={imageWidth}
                            onChange={handleSliderChange}
                            aria-labelledby="continuous-slider"
                            valueLabelDisplay="auto"
                            min={75}
                            max={250}
                            sx={{
                                '& .MuiSlider-thumb': {
                                    color: '#F2F3F8', // color of the thumb
                                },
                                '& .MuiSlider-track': {
                                    color: '#F2F3F8', // color of the track
                                },
                                '& .MuiSlider-rail': {
                                    color: '#F2F3F8', // color of the rail
                                },
                                margin: 1,
                            }}
                        />
                    </Box>
                </Box>
                <Box>
                    <Button
                        sx={{
                            fontSize: 10,
                            height: 20,
                            padding: 1, // Adjust the padding as needed 
                            backgroundColor: "#f2f3f8",
                            color: "#240052",
                            display: isMedium ? 'normal' : 'none',
                            '&:hover': {
                                backgroundColor: "#240052", // Change this to the desired hover background color
                                color: "#f2f3f8", // Change this to the desired hover text color if needed
                            },
                        }}
                        onClick={goBack}
                    >
                        Back <ArrowBack sx={{ fontSize: 15 }} />
                    </Button>
                </Box>
            </Box>
            <div style={{ overflowY: "auto", height: "86vh" }} className="hide-scrollbar">
            <Box sx={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'center', display: { xs: 'block', sm: 'block', md: 'none' } }}>
                    <span>{boosterName}</span>
                </Box>
                <Grid container spacing={2} justifyContent="center">
                    {filteredDocuments.map((document) => {
                        return (
                            <Grid item key={document.cardUid} sx={{ position: "relative" }}>
                                <Box onClick={() => handleOpenModal(document)} sx={{ overflow: "hidden", position: "relative", cursor: "pointer" }} height={imageHeight} width={imageWidth}>
                                    <img
                                        loading="lazy"
                                        src={document.urlimage}
                                        draggable="false"
                                        alt={`Card of ${document.title} from ${document.boostercode}`}
                                        width={imageWidth}
                                        height={imageHeight}
                                    />
                                </Box>
                            </Grid>
                        )
                    })}
                    {selectedCard && (
                        <CRBTCGCardDrawerNF
                            open={openModal}
                            onClose={handleCloseModal}
                            selectedCard={selectedCard}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                    )}
                </Grid>
                <div style={{ height: '200px' }} />
            </div>
            <Box sx={{
                display: { xs: 'flex', sm: 'flex', md: 'none' }, position: 'fixed', backgroundColor: '#121212',
                width: '100vw', bottom: isIOS() ? '80px' : '70px', justifyContent: "center", alignItems: "center"
            }}>
                <FormControl sx={{ margin: 1 }}>
                    <Select
                        sx={{
                            display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                            whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                            fontSize: 11, width: "60px", height: "30px",
                            '& .MuiSelect-icon': {
                                display: "none",
                                position: "absolute"
                            },
                        }}
                        value={rarityFilter}
                        onChange={(event) => setRarityFilter(event.target.value)}
                        displayEmpty // Add this prop to display the placeholder when the value is empty
                        renderValue={(selectedValue) => selectedValue || 'Rarity'} // Add this prop to display the placeholder text when the value is empty
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {listOfRarities.map(rarity => (
                            <MenuItem key={rarity} value={rarity}>
                                {rarity}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ margin: 1 }}>
                    <Select
                        sx={{
                            display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                            whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                            fontSize: 11, width: "60px", height: "30px",
                            '& .MuiSelect-icon': {
                                display: "none",
                                position: "absolute"
                            },
                        }}
                        value={colorFilter}
                        onChange={(event) => setColorFilter(event.target.value)}
                        displayEmpty // Add this prop to display the placeholder when the value is empty
                        renderValue={(selectedValue) => selectedValue || 'Color'}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {listOfColors.map(color => (
                            <MenuItem key={color} value={color}>
                                {color}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    sx={{
                        minWidth: 0, // Set the minimum width to 0 to allow the button to shrink
                        width: 30, // Change this value to adjust the width
                        height: 20,
                        margin: 1,
                        padding: 1, // Adjust the padding as needed 
                        backgroundColor: "#f2f3f8",
                        color: "#240052",
                        '&:hover': {
                            backgroundColor: "#240052", // Change this to the desired hover background color
                            color: "#f2f3f8", // Change this to the desired hover text color if needed
                        },
                    }}
                    onClick={resetFilters}
                >
                    <Refresh sx={{ fontSize: 15 }} />
                </Button>
                <Box sx={{ width: 100 }}>
                    <Slider
                        value={imageWidth}
                        onChange={handleSliderChange}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        min={75}
                        max={250}
                        sx={{
                            '& .MuiSlider-thumb': {
                                color: '#F2F3F8', // color of the thumb
                            },
                            '& .MuiSlider-track': {
                                color: '#F2F3F8', // color of the track
                            },
                            '& .MuiSlider-rail': {
                                color: '#F2F3F8', // color of the rail
                            },
                            margin: 1,
                        }}
                    />
                </Box>
            </Box>
        </div >
    );
};

export default CRBTCGcardFormat;

