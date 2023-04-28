import React from "react";
import { Box, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"

const Community = () => {
    return (
        <div>
            <Box bgcolor={"#121212"} color={"#f2f3f8"}>
                <Navbar />
                <Stack direction="row" spacing={2} justifyContent={"space-between"}>
                    <Box flex={2} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                        <Sidebar />
                    </Box>
                    <Box flex={8} p={2} height={"100vh"} >
                        <span style={{ color: "#DA9292" }}><strong>DISCLAIMER: Do note that the account creation is mainly a security feature for the Website itself (from Bots) and we will have no access to your credentials whatsoever.
                            Your account information is kept confidential and secure, and we take all necessary steps to prevent any unauthorized access to your account.</strong></span>
                        <br></br>
                        <br></br>
                        <span>Also, do note that we will be implementing more features along the way so please do be patient.</span>
                        <br></br>
                        <br></br>
                        <span><strong>Latest patch:</strong> The images in all the decks created before 27/04/2023 are stored on an alternate database. However only the export jpeg feature is affected.</span>
                        <span>In order to work around this, you can load your deck in deckbuild and resave your deck. You should thereafter be able to export</span>
                    </Box>
                </Stack>
                <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Community