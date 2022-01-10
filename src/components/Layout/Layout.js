import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

// components
import Header from "../Header/Header";
import Content from "../Content/Content";

//APIs
const BASE_URL_API_1 = "https://covid19.mathdro.id/api";
const BASE_URL_API_2 = "https://api.covid19api.com";

export default function Layout(props) {
  const [countries, setCountries] = useState(["Global"]);
  const [selectedCountry, setSelectedCountry] = useState("Global");
  const [selectedCountrySlug, setSelectedCountrySlug] = useState("global");
  const [countrylistAPI1, setCountrylistAPI1] = useState([]);
  const [countrylistAPI2, setCountrylistAPI2] = useState([]);
  const [countriesData, setCountriesData] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL_API_1}/countries`).then((response) => {
      console.log(response);
      setCountrylistAPI1(response.data.countries);
      const countryData = response.data.countries;
      const countriesArray = countryData.map((countryObj) => countryObj.name);
      console.log(countriesArray);
      setCountries(countries.concat(countriesArray));
    });
    axios.get(`${BASE_URL_API_2}/countries`).then((response) => {
      setCountrylistAPI2(response.data);
    });
    axios.get(`${BASE_URL_API_2}/summary`).then((response) => {
      console.log(response.data);
      setCountriesData(response.data);
    });
  }, []);

  useEffect(() => {}, [selectedCountry]);

  const getSlug = (countryname) => {
    const findISO2 = countrylistAPI1.filter((obj) => obj.name === countryname);
    const iso2 = findISO2[0].iso2;
    const findSlug = countrylistAPI2.filter((obj) => obj.ISO2 === iso2);
    const slug = findSlug[0].Slug;
    setSelectedCountrySlug(slug);
    return slug;
  };

  const getSelectedCountryData = (countryname, type, from, to) => {
    if (countryname === "Global") {
    } else {
      const slug = getSlug(countryname);
      axios
        .get(
          `${BASE_URL_API_2}/country/${slug}/status/${type}?from=${from}&to=${to}`
        )
        .then((response) => {
          console.log(response.data);
        });
    }
  };

  const getInfoBoxData = () => {
    if (selectedCountry === "Global") {
    } else {
    const dataArr = countriesData.Countries;
    const data = dataArr.filter((country) => country.Slug ===selectedCountrySlug);
    return data;
    }
  };

  const handleChangeCountry = (event) => {
    setSelectedCountry(event.target.value);
    console.log(event.target.value);
    getSelectedCountryData(
      event.target.value,
      "confirmed",
      "2020-03-01T00:00:00Z",
      "2020-04-01T00:00:00Z"
    );
  };

  return (
    <>
      <Header
        countries={countries}
        selectedCountry={selectedCountry}
        handleChangeCountry={handleChangeCountry}
      />
      <Content countryData={getInfoBoxData()} />
    </>
  );
}
