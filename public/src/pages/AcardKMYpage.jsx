import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import AcardKMY from "../components/AcardKMY";
import { Helmet } from "react-helmet";

const AcardKMYpage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
  };
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
    <div>
      <Helmet>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Box bgcolor={"#121212"} color={"#f2f3f8"}>
        <Navbar onSearch={handleSearch} />
        <Box>
          <Stack direction="row" spacing={2} justifyContent={"space-between"}>
            <Box flex={2} sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
            <Box flex={17} p={2}>
              <AcardKMY searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </Box>
          </Stack>
          <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default AcardKMYpage