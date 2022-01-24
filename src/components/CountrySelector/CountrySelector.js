import React from "react";
import { Box, MenuItem, Select } from "@mui/material";
import uuid from "react-uuid";

export default function CountrySelector({selectedCountry, handleChangeCountry, countries}) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <Select
        id="country-selector"
        value={selectedCountry}
        label="Country"
        onChange={handleChangeCountry}
        variant="outlined"
        style={{ backgroundColor: "white" }}
      >
        {countries.map((country) => {
          return (
            <MenuItem key={uuid()} value={country}>
              {country}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}
