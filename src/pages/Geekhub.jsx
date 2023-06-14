import React from "react";
import { Box, ButtonBase, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import Article01 from "../components/Post/Article01";

const Geekhub = () => {
    return (
        <div>
            <Box bgcolor={"#121212"} color={"#f2f3f8"}>
                <Navbar />
                <Stack direction="row" spacing={2} justifyContent={"space-between"}>
                    <Box flex={1} sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box flex={8} p={2} height={"86vh"}>
                        <Box sx={{textAlign:"center"}}>
                            <span>Pick your poison</span>
                        </Box>
                        <Box sx={{height:"30px"}}></Box>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: "20px", alignItems: "start",justifyContent:"center" }}>
                            <ButtonBase>
                                <img src="/images/KEYBOARD.jpg" alt="keyboards" style={{ width: "200px" }} />
                            </ButtonBase>
                            <ButtonBase>
                                <img src="/images/AUDIO.jpg" alt="audio" style={{ width: "200px" }} />
                            </ButtonBase>
                            <ButtonBase>
                                <img src="/images/CARDS.jpg" alt="cards" style={{ width: "200px" }} />
                            </ButtonBase>
                        </Box>
                    </Box>
                </Stack>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Geekhub