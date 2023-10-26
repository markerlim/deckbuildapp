
import BottomNav from "../components/BottomNav"
import { Box } from "@mui/material"

import NavbarHome from "../components/NavbarHome";
import { useState } from "react";
import { DrawerElement } from "../components/DrawerElement";
import FAQAccountEdit from "../components/FAQComponents/AccountEdit";
import FAQReportError from "../components/FAQComponents/ReportError";
import FAQSupportGeekstack from "../components/FAQComponents/SupportGeekstack";

const FAQPage = () => {
    const FAQdata = [
        { content: <FAQAccountEdit />, des: 'How to edit account details?' },
        { content: <FAQSupportGeekstack />, des: 'How to support Geekstack?' },
    ]
    const [openDrawer, setOpenDrawer] = useState(false);
    const [currentContent, setCurrentContent] = useState(null);

    const handleOpenDrawer = (contentComponent) => {
        setCurrentContent(contentComponent);
        setOpenDrawer(true);
    }

    const handleCloseDrawer = () => {
        setOpenDrawer(false)
    }
    return (
        <div>
            <Box color={"#f2f3f8"}>
                <NavbarHome />
                <Box>
                    <Box sx={{ paddingLeft: "15px", paddingRight: "15px", paddingTop: '10px', display: "flex", flexDirection: "column", alignItems: "center", gap: '15px', height: "calc(100vh - 144px)" }} overflowY={"auto"}>
                        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: '0px',}}>
                            <Box component={'img'} src="FAQimages/FAQheader.webp" sx={{ width: '150px' }} />
                            <Box sx={{ fontSize: '8px', textAlign: 'center' }}>
                                <span>The literal and graphical information presented on this site about Union Arena,Digimon and Onepiece including all data about the cards is copyright by Bandai Namco Entertainment.
                                    <br></br>
                                    This website is not produced by, endorsed by, supported by or affiliated with Bandai Namco Entertainment. Please support the official card game by Bandai Namco Entertainment.</span>
                                <span>
                                    <br></br>
                                    Also, do note that we will be implementing more features along the way so please do be patient.</span>
                            </Box>
                        </Box>
                        {FAQdata.map((faq => (
                            <>
                                <Box sx={{ backgroundColor: '#26252d', width: '80vw', padding: '5vw', borderRadius: '20px' }} onClick={() => handleOpenDrawer(faq.content)}>{faq.des}</Box>
                                <DrawerElement
                                    open={openDrawer}
                                    onClose={handleCloseDrawer}
                                    content={currentContent}
                                />
                            </>
                        )))}
                    </Box>
                    <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
                </Box>
            </Box>
        </div>
    );
}

export default FAQPage