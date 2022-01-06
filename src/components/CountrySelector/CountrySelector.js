import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { maxHeight } from "@mui/system";
import uuid from 'react-uuid';

const BASE_URL_API_1 = "https://covid19.mathdro.id/api";
const BASE_URL_API_2 = "https://api.covid19api.com"

export default function CountrySelector() {
  const [countries, setCountries] = useState(["Global"]);
  const [selectedCountry, setSelectedCountry] = useState("Global");
  const [countrylistAPI1, setCountrylistAPI1] = useState([]);
  const [countrylistAPI2, setCountrylistAPI2] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL_API_1}/countries`).then((response) => {
      setCountrylistAPI1(response.data.countries);
      const countryData = response.data.countries;
      const countriesArray = countryData.map((countryObj) => countryObj.name)
      setCountries(countries.concat(countriesArray));
    });
    axios.get(`${BASE_URL_API_2}/countries`).then((response) => {
      setCountrylistAPI2(response.data);
    });
  }, []);

  const getSelectedCountryData = (countryname,type,from,to) => {
    const slug = getSlug(countryname);
    axios.get(`${BASE_URL_API_2}/country/${slug}/status/${type}?from=${from}&to=${to}`).then((response) => {
      console.log(response.data);
    })
  };

  const getSlug = (countryname) => {
    const findISO2 = countrylistAPI1.filter((obj) => obj.name === countryname);
    const iso2 = findISO2[0].iso2;
    const findSlug = countrylistAPI2.filter((obj) => obj.ISO2 === iso2);
    const slug = findSlug[0].Slug;
    return slug;
  };

  const handleChange = (event) => {
    setSelectedCountry(event.target.value);
    console.log(event.target.value);
    getSelectedCountryData(event.target.value,"confirmed","2020-03-01T00:00:00Z","2020-04-01T00:00:00Z");
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Select
        id="country-selector"
        value={selectedCountry}
        label="Country"
        onChange={handleChange}
        variant="outlined"
        style={{ backgroundColor: "white" }}
      >
        {countries.map((country) => {
          return <MenuItem key={uuid()} value={country}>{country}</MenuItem>;
        })}
      </Select>
    </Box>
  );
}
