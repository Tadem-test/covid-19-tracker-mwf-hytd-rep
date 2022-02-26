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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedChart, setSelectedChart] = useState("line");

  const defaultDate = new Date();
  const [dateRange, setDateRange] = useState([
    defaultDate.setMonth(defaultDate.getMonth() - 1),
    new Date(),
  ]);

  useEffect(() => {
    const getCountrylist = async () => {
      await axios
        .get(`https://api.covid19api.com/countries`)
        .then((res) => {
          const data = res.data;
          const sortedCountryList = data.sort((a, b) =>
            a.Country > b.Country ? 1 : b.Country > a.Country ? -1 : 0
          );
          setCountries(sortedCountryList);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCountrylist();
  }, []);

  const changeCountry = (country) => {
    setSelectedCountry(country);
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
        changeCountry={changeCountry}
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
