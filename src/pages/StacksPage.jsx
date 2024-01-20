import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import BottomNav from "../components/BottomNav";
import { Helmet } from "react-helmet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PWAPrompt from 'react-ios-pwa-prompt';
import CardStackFlood from "../components/StacksPageComponent/CardStackFlood";

const StacksPage = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "webmanifest";
        link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const categorytags = ['ALL', 'UNION-ARENA', 'ONE-PIECE'];
    const unionarenatags = ['HTR', 'JJK', 'CGH', 'KMY', 'IMS', 'TOA', 'TSK', 'BLC', 'BTR', 'MHA', 'BLK', 'TKN', 'DST'];
    const [selectedCategoryTag, setSelectedCategoryTag] = useState('ALL');
    const [selectedUAtag, setSelectedUAtag] = useState(null);
    const scrollWholeContainerRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const touchY = useRef(null);

    useEffect(() => {
        const handleTouchMove = (event) => {
            const currentTouchY = event.touches[0].clientY;

            if (touchY.current !== null) {
                const deltaY = touchY.current - currentTouchY;

                if (deltaY > 0) {
                    setIsNavVisible(false);
                } else if (deltaY < 0) {
                    setIsNavVisible(true);
                }
            }

            touchY.current = currentTouchY;
        };

        const handleTouchEnd = () => {
            touchY.current = null;
        };

        const scrollContainer = scrollWholeContainerRef.current;

        if (scrollContainer) {
            scrollContainer.addEventListener("touchmove", handleTouchMove);
            scrollContainer.addEventListener("touchend", handleTouchEnd);
            return () => {
                scrollContainer.removeEventListener("touchmove", handleTouchMove);
                scrollContainer.removeEventListener("touchend", handleTouchEnd);
            };
        }

        return () => {};
    }, [scrollWholeContainerRef, setIsNavVisible, touchY]);



    const handleCategorytagClick = (tag) => {
        setSelectedCategoryTag(tag);

        // Scroll the selected filter into view
        if (scrollContainerRef.current) {
            const selectedFilterElement = scrollContainerRef.current.querySelector(`[category-filter="${tag}"]`);

            if (selectedFilterElement) {
                const containerRect = scrollContainerRef.current.getBoundingClientRect();
                const elementRect = selectedFilterElement.getBoundingClientRect();

                const offset = elementRect.left - containerRect.left - (containerRect.width - elementRect.width) / 2;
                scrollContainerRef.current.scrollLeft += offset;
            }
        }
    };
    const handleUAtagClick = (tag) => {
        if (selectedUAtag === tag) {
            setSelectedUAtag(null);
        } else {
            setSelectedUAtag(tag);
        }

        if (scrollContainerRef.current) {
            const selectedFilterElement = scrollContainerRef.current.querySelector(`[data-filter="${tag}"]`);

            if (selectedFilterElement) {
                const containerRect = scrollContainerRef.current.getBoundingClientRect();
                const elementRect = selectedFilterElement.getBoundingClientRect();

                const offset = elementRect.left - containerRect.left - (containerRect.width - elementRect.width) / 2;
                scrollContainerRef.current.scrollLeft += offset;
            }
        }
    };

    return (
        <div>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <PWAPrompt promptOnVisit={1} timesToShow={1} copyClosePrompt="Close" permanentlyHideOnDismiss={false} />
            <Box color={"#f2f3f8"} >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",marginTop:'-20px',position:'relative',gap:'0px'}} overflowY={"auto"} height={"calc(100vh - 114px)"} ref={scrollWholeContainerRef}>
                    <Box sx={{position: 'fixed', top: 0, zIndex: 1000,backgroundColor: '#101418', height: '54px',width:'100vw',display: 'flex', flex: '0 0 auto', justifyContent: 'center', alignItems: 'center' }}>
                        <img style={{ width: "auto", height: "30px" }} alt="uniondeck" src="/icons/geekstackicon.svg" />
                    </Box>
                    <Box sx={{ position: 'fixed', top: '54px', zIndex: 900, backgroundColor: '#101418', transition: 'transform 0.3s ease', transform: `translateY(${isNavVisible ? '0' : 'calc(-100%)'})` }}>
                        <Box
                            ref={scrollContainerRef}
                            sx={{
                                display: 'flex',
                                height: '25px',
                                verticalAlign: 'middle',
                                overflowX: 'auto', // Enable horizontal scrolling
                                gap: '10px',
                                flex: '0 0 auto',
                                justifyContent: 'left',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                transition: '1s ease',
                                scrollBehavior: 'smooth',
                                width: 'calc(100vw - 40px)',
                                scrollbarWidth: 'none', // Firefox
                                msOverflowStyle: 'none', // IE
                                '&::-webkit-scrollbar': {
                                    width: 0, // Hide scrollbar in Webkit browsers
                                },
                            }}
                        >
                            {categorytags.map((tag, index) => (
                                <Box
                                    sx={{
                                        flex: '0 0 auto',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        color: selectedCategoryTag === tag ? '#ffffff' : '#435364',
                                        transition: '0.3s linear'
                                    }}
                                    key={index}
                                    onClick={() => handleCategorytagClick(tag)}
                                    category-filter={tag}
                                >
                                    {tag}
                                </Box>
                            ))}
                        </Box>
                        {selectedCategoryTag === 'UNION-ARENA' && (
                            <Box
                                ref={scrollContainerRef}
                                sx={{
                                    display: 'flex',
                                    overflowX: 'auto', // Enable horizontal scrolling
                                    gap: '10px',
                                    justifyContent: 'left',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    height: '30px',
                                    flex: '0 0 auto',
                                    verticalAlign: 'middle',
                                    transition: '1s ease',
                                    scrollBehavior: 'smooth',
                                    width: 'calc(100vw - 40px)',
                                    scrollbarWidth: 'none', // Firefox
                                    msOverflowStyle: 'none', // IE
                                    '&::-webkit-scrollbar': {
                                        width: 0, // Hide scrollbar in Webkit browsers
                                    },
                                }}
                            >
                                {unionarenatags.map((tag, index) => (
                                    <Box
                                        sx={{
                                            flex: '0 0 auto',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            color: selectedUAtag === tag ? '#ffffff' : '#435364',
                                            transition: '0.3s linear',
                                        }}
                                        key={index}
                                        onClick={() => handleUAtagClick(tag)}
                                        data-filter={tag}
                                    >
                                        {tag}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <CardStackFlood selectedCategoryTag={selectedCategoryTag} selectedUAtag={selectedUAtag} />
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default StacksPage;
