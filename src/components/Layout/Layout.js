import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Card,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import uuid from "react-uuid";

//import { Route, Switch, Redirect, withRouter } from "react-router-dom";

// components
import Header from "../Header/Header";
import Content from "../Content/Content";
import InfoBox from "../InfoBox/InfoBox";
import LineGraph from "../ChartJS/LineGraph";
import { prettyPrintStat } from "../Util/Util";

import "./Layout.css";

//APIs
const BASE_URL_API_1 = "https://covid19.mathdro.id/api";
const BASE_URL_API_2 = "https://api.covid19api.com";

export default function Layout(props) {
  //Country Liste
  const [countries, setCountries] = useState([]);

  //Ausgewählte Country
  const [selectedCountry, setSelectedCountry] = useState("Global");

  //Slug für API abfrage
  const [selectedCountrySlug, setSelectedCountrySlug] = useState("global");

  //später durch eigene liste bit 2 param countryname und slug in countries state speichern
  const [countrylistAPI1, setCountrylistAPI1] = useState([]);
  const [countrylistAPI2, setCountrylistAPI2] = useState([]);

  //Gesamte aktuelle Daten aller Länder und GLobal
  const [countriesData, setCountriesData] = useState([]);

  //aktuelle Daten eines ausgewählten Countrys
  const [countryInfo, setCountryInfo] = useState({});

  const [casesType, setCasesType] = useState("confirmed");

  useEffect(() => {
    const getCountrylistAPI1 = async () => {
      await axios
        .get(`${BASE_URL_API_1}/countries`)
        .then((res) => {
          console.log(res.data);
          setCountrylistAPI1(res.data.countries);
          const countryData = res.data.countries;
          const countriesArray = countryData.map(
            (countryObj) => countryObj.name
          );
          setCountries(countries.concat(countriesArray));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCountrylistAPI1();
  }, []);

  useEffect(() => {
    const getCountrylistAPI2 = async () => {
      await axios
        .get(`${BASE_URL_API_2}/countries`)
        .then((res) => {
          console.log(res.data);
          setCountrylistAPI2(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCountrylistAPI2();
  }, []);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`${BASE_URL_API_2}/summary`)
        .then((res) => {
          console.log(res.data);
          setCountriesData(res.data);
          setCountryInfo(res.data.Global);
          console.log(res.data.Global)
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getData();
  }, []);

  useEffect(() => {
    setCountryInfo(getInfoBoxData(selectedCountry));
  }, [selectedCountry]);

  useEffect(() => {
    console.log(casesType)
  },[casesType])

  //manche länder haben keinen slug diese entfernen
  const getSlug = (countryname) => {
    const findISO2 = countrylistAPI1.filter((obj) => obj.name === countryname);
    const iso2 = findISO2[0].iso2;
    const findSlug = countrylistAPI2.filter((obj) => obj.ISO2 === iso2);
    const slug = findSlug[0].Slug;
    setSelectedCountrySlug(slug);
    return slug;
  };

  const getInfoBoxData = (value) => {
    if (value === "Global") {
      console.log(countriesData.Global);
      return countriesData.Global;
    } else {
      const dataArr = countriesData.Countries;
      const data = dataArr.filter(
        (country) => country.Slug === selectedCountrySlug
      );
      console.log(data[0]);
      return data[0];
    }
  };

  const handleChangeCountry = (event) => {
    setSelectedCountry(event.target.value);
    /*getSelectedCountryData(
      event.target.value,
      "confirmed",
      "2020-03-01T00:00:00Z",
      "2020-04-01T00:00:00Z"
    );*/
  };
    return (
      <>
      <div className="app__left">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Covid-19 Tracker Moderne Web Frameworks
              </Typography>
              <Box sx={{ minWidth: 120 }}>
                <Select
                  id="country-selector"
                  value={selectedCountry}
                  label="Country"
                  onChange={handleChangeCountry}
                  variant="outlined"
                  style={{ backgroundColor: "white" }}
                >
                  <MenuItem key={uuid()} value={"Global"}>
                    Global
                  </MenuItem>
                  {countries.map((country) => {
                    return (
                      <MenuItem key={uuid()} value={country}>
                        {country}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </Box>
        <div className="app__stats">

        </div>
        <Card>
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} selectedCountry={selectedCountry} selectedCountrySlug={selectedCountrySlug} getSlug={getSlug}/>
        </Card>
        </div>
      </>
    );
}
