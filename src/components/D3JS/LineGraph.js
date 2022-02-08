import React,{ useEffect, useState} from 'react';
import { LineChart } from 'react-charts-d3';
import axios from "axios";
import moment from "moment";
import { format } from "date-fns";

const BASE_URL_API_2 = "https://api.covid19api.com";

export default function LineGraph({dateRange, selectedCountry, getSlug}) {
    const [infectedData, setInfectedData] = useState({});
    const [deathsData, setDeathsData] = useState({});
    const data = [
      { key: 'Group 1', values: [ { x: 'A', y: 23 }, { x: 'B', y: 8 } ] },
      { key: 'Group 2', values: [ { x: 'A', y: 15 }, { x: 'B', y: 37 } ] },
    ];
    data.push({ key: 'Group 3', values: [ { x: 'A', y: 15 }, { x: 'B', y: 37 } ] })

    function getStatisticData(countrydata) {
        console.log(countrydata);
          const statData = {};
          for (var index = 0; index < countrydata.length; index++) {
            const date = countrydata[index].Date;
            const utcStart = new moment(date, "YYYY-MM-DDTHH:mm:ssZ").utc();
            const selectedDate = utcStart.format('DD/MM/YY');
            const casesValue = countrydata[index].Cases;
            statData[selectedDate] = casesValue;
          }
          return statData;
        }
      
      const buildChartData = (data,type) => {
        let chartData = {key: type, values: []};
        for (let date in data) {
            chartData.values.push({x: date, y: data[date]});
        }
        return chartData;
      };

    useEffect(() => {
        if (selectedCountry === "Global") {
          //getCOuntryData für Global
        } else {
          const slug = getSlug(selectedCountry);
          const start = `${format(dateRange.start, "yyyy-MM-dd")}`;
          const end = `${format(dateRange.end, "yyyy-MM-dd")}`;
          console.log(start, end)
    
          const getData = async () => {
            await axios
              .get(
               // `${BASE_URL_API_2}/country/${slug}/status/${type}?from=${from}&to=${to}`
               `${BASE_URL_API_2}/country/${slug}/status/confirmed?from=${start}T00:00:00Z&to=${end}T00:00:00Z`
              )
              .then((res) => {
                let chartData = buildChartData(getStatisticData(res.data),"confirmed")
                setInfectedData(chartData);
              })
              .catch((err) => {
                console.log(err);
              });
          };
          getData();
    
          const getDeathsData = async () => {
            await axios
              .get(
               // `${BASE_URL_API_2}/country/${slug}/status/${type}?from=${from}&to=${to}`
               `${BASE_URL_API_2}/country/${slug}/status/deaths?from=${start}&to=${end}`
    
              )
              .then((res) => {
                let chartData = buildChartData(getStatisticData(res.data),"deaths")
                console.log(chartData)
                setDeathsData(chartData);
              })
              .catch((err) => {
                console.log(err);
              });
          };
          getDeathsData();
          console.log("Start: "+dateRange.start+" End: "+dateRange.end);
        }
      },[dateRange,selectedCountry])

    return(
        <LineChart data={data} />
    );
};