
import BottomNav from "../components/BottomNav"
import { Box, Button, ButtonBase } from "@mui/material"

import NavbarHome from "../components/NavbarHome";
import { Link } from "react-router-dom";

const Listofnews = () => {
    const imageData = [
        { src: 'latestreleasebanner/jjkncnewrelease.jpg', path: '/unionarena/jjk?booster=ua02nc' },
        { src: 'latestreleasebanner/kmyncnewrelease.jpg', path: '/unionarena/kmy?booster=ua01nc' },
        { src: 'latestreleasebanner/st11newrelease.jpg', path: '/onepiece/OPST11' },
        { src: 'latestreleasebanner/bluelocknewrelease.jpg', path: '/unionarena/blk' },
        { src: 'latestreleasebanner/bleachnewrelease.jpg', path: '/unionarena/blc' },
        { src: 'latestreleasebanner/op05newrelease.jpg', path: '/onepiece/OP05' },
    ];
    return (
        <div>
            <Box color={"#f2f3f8"}>
                <NavbarHome />
                <Box>
                    <Box sx={{ paddingLeft: "15px", paddingRight: "15px", paddingTop: '10px', display: "flex", flexDirection: "column", alignItems: "center", gap: '15px', height: "calc(100vh - 144px)" }} overflowY={"auto"}>
                        <img src="images/LATEST RELEASE.png" alt="latestrelease" style={{ width: "300px" }} />
                        {imageData.map((image, index) => (
                            <Link key={index} to={image.path}>
                                <Box component={'img'} src={image.src} sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, height: 'auto', borderRadius: '15px' }} />
                            </Link>
                        ))}
                        <div style={{ height: '1px',padding:'10px' }}>
                            <br/>
                        </div>
                    </Box>
                    <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
                </Box>
            </Box>
        </div>
    );
}

export default Listofnews