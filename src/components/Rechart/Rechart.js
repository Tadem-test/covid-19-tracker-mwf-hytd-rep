import React, { useState, useEffect, useRef } from 'react';
import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import axios from "axios";
import moment from "moment";
import { format } from "date-fns";

const BASE_URL_API_2 = "https://api.covid19api.com";

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

    const buildChartData = (infected, deaths) => {
        let chartData = [];
        for (let date in infected) {
            chartData.push({name: date, infected: infected[date], deaths: deaths[date] });
        }
        return chartData;
      };

function Rechart({dateRange, selectedCountry, getSlug}) {
    const [infected,setInfected] = useState([]);
    const [deaths,setDeaths] = useState([]);
    const [data, setData] = useState([]);
    let renderer = useRef(null);

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
                let chartData = getStatisticData(res.data)
                setInfected(chartData);
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
                let chartData = getStatisticData(res.data)
                setDeaths(chartData);
              })
              .catch((err) => {
                console.log(err);
              });
          };
          getDeathsData();
          
          setData(buildChartData(infected,deaths))

        }
      },[dateRange,selectedCountry])

      useEffect(() => {
        renderer.current = <ResponsiveContainer width="100%" aspect={3}>
        <LineChart data={data} margin={{ right: 300 }}>
            <CartesianGrid />
            <XAxis dataKey="name" 
                interval={'preserveStartEnd'} />
            <YAxis></YAxis>
            <Legend />
            <Tooltip />
            <Line dataKey="infected"
                stroke="black" activeDot={{ r: 8 }} />
            <Line dataKey="deaths"
                stroke="red" activeDot={{ r: 8 }} />
        </LineChart>
    </ResponsiveContainer>
      },[data])

    return (
        <>
        <h1 className="text-heading">
            Line Chart Using Rechart
        </h1>
        {renderer.current}
    </>
    );
}

export default Rechart;