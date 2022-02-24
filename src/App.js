import React, { useEffect, useState } from "react";
import { Card, Grid } from "@mui/material";
import axios from "axios";

// components
import Header from "./components/Header/Header";
import ChartJS from "./components/ChartJS/ChartJS";
import DateRangePicker from "./components/DateRangePicker/DateRangePicker";
import ChartSelector from "./components/ChartSelector/ChartSelector";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [countrylistAPI1, setCountrylistAPI1] = useState([]);
  const [countrylistAPI2, setCountrylistAPI2] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountrySlug, setSelectedCountrySlug] = useState("");
  const [selectedChart, setSelectedChart] = useState("line");
  /*const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
    
  });*/
  const defaultDate = new Date();
  const [dateRange, setDateRange] = useState([
    defaultDate.setMonth(defaultDate.getMonth() - 1),
    new Date(),
  ]);

  useEffect(() => {
    const getCountrylistAPI1 = async () => {
      await axios
        .get(`https://covid19.mathdro.id/api/countries`)
        .then((res) => {
          setCountrylistAPI1(res.data.countries);
          const countryData = res.data.countries;
          const countriesArray = countryData.map(
            (countryObj) => countryObj.name
          );
          setCountries(countriesArray);
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
        .get(`https://api.covid19api.com/countries`)
        .then((res) => {
          setCountrylistAPI2(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCountrylistAPI2();
  }, []);

  //manche länder haben keinen slug diese entfernen
  const getSlug = (countryname) => {
    try {
      const findISO2 = countrylistAPI1.filter(
        (obj) => obj.name === countryname
      );
      const iso2 = findISO2[0].iso2;
      const findSlug = countrylistAPI2.filter((obj) => obj.ISO2 === iso2);
      const slug = findSlug[0].Slug;
      setSelectedCountrySlug(slug);
      return slug;
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeCountry = (event) => {
    setSelectedCountry(event.target.value);
  };

  const updateDateRange = (range) => {
    setDateRange(range);
  };

  const handleSelectedChart = (e) => {
    setSelectedChart(e.target.value);
  };

  return (
    <>
      <Header
        selectedCountry={selectedCountry}
        handleChangeCountry={handleChangeCountry}
        countries={countries}
      />
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={7}>
          <DateRangePicker
            updateDateRange={updateDateRange}
            dateRange={dateRange}
          />
        </Grid>
        <Grid item xs={1}>
          <ChartSelector
            selectedChart={selectedChart}
            handleSelectedChart={handleSelectedChart}
          />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Card variant="outlined">
            <ChartJS
              selectedCountry={selectedCountry}
              selectedCountrySlug={selectedCountrySlug}
              getSlug={getSlug}
              dateRange={dateRange}
              selectedChart={selectedChart}
            />
          </Card>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </>
  );
}

/*

*/
