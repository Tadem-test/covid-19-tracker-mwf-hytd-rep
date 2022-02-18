import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import axios from "axios";

// components
import Header from "./components/Header/Header";
import ChartJS from "./components/ChartJS/ChartJS";
import DateRangePicker from "./components/DateRangePicker/DateRangePicker";
import ChartSelector from "./components/ChartSelector/ChartSelector";

export default function App() {
  //Country Liste
  const [countries, setCountries] = useState([]);

  //Ausgewählte Country
  const [selectedCountry, setSelectedCountry] = useState("Global");

  //Slug für API abfrage
  const [selectedCountrySlug, setSelectedCountrySlug] = useState("global");

  //später durch eigene liste bit 2 param countryname und slug in countries state speichern
  const [countrylistAPI1, setCountrylistAPI1] = useState([]);
  const [countrylistAPI2, setCountrylistAPI2] = useState([]);

  const [selectedChart, setSelectedChart] = useState("line");

  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    const getCountrylistAPI1 = async () => {
      await axios
        .get(`https://covid19.mathdro.id/api/countries`)
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
    const findISO2 = countrylistAPI1.filter((obj) => obj.name === countryname);
    const iso2 = findISO2[0].iso2;
    const findSlug = countrylistAPI2.filter((obj) => obj.ISO2 === iso2);
    const slug = findSlug[0].Slug;
    setSelectedCountrySlug(slug);
    return slug;
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
      <div className="app__left">
        <Header
          selectedCountry={selectedCountry}
          handleChangeCountry={handleChangeCountry}
          countries={countries}
        />
        <div className="app__stats"></div>
        <Card>
          <h3>COVID-19 Chart</h3>
          <DateRangePicker updateDateRange={updateDateRange} />
          <ChartSelector
            selectedChart={selectedChart}
            handleSelectedChart={handleSelectedChart}
          />
          <ChartJS
            selectedCountry={selectedCountry}
            selectedCountrySlug={selectedCountrySlug}
            getSlug={getSlug}
            dateRange={dateRange}
            selectedChart={selectedChart}
          />
        </Card>
      </div>
    </>
  );
}
