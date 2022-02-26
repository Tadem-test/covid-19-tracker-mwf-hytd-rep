import React from "react";
import { Box, MenuItem, Select } from "@mui/material";
import uuid from "react-uuid";

export default function CountrySelector({
  selectedCountry,
  changeCountry,
  countries,
}) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <Select
        placeholder="Select a Country"
        id="country-selector"
        value={selectedCountry}
        label="Country"
        onChange={(e) => {
          changeCountry(e.target.value);
        }}
        color="primary"
        style={{ backgroundColor: "white" }}
      >
        {countries.map((country) => {
          return (
            <MenuItem key={uuid()} value={country}>
              {country.Country}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}
