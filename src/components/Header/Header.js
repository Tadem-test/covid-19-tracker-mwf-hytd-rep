import React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import CountrySelector from "../CountrySelector/CountrySelector";

export default function Header({
  selectedCountry,
  handleChangeCountry,
  countries,
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            align="center"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Covid-19 Tracker Moderne Web Frameworks
          </Typography>
          <CountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            handleChangeCountry={handleChangeCountry}
          />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}
