import React, { useState, useEffect } from "react";
import numeral from "numeral";
import axios from "axios";
import moment from "moment";
import { format } from "date-fns";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  
} from 'chart.js'

import { Chart, Line } from 'react-chartjs-2'


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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

const buildChartData = (data) => {
  let chartData = [];
  for (let date in data) {
      chartData.push(data[date]);
  }
  return chartData;
};

const buildChartDate = (data) => {
  let chartData = [];
  for (let date in data) {
      chartData.push(date);
  }
  return chartData;
};


function LineGraph({dateRange, selectedCountry, selectedCountrySlug, getSlug}) {
  const [infectedData, setInfectedData] = useState({});
  const [deathsData, setDeathsData] = useState({});
  
  const [date1, setDate1] = useState([0,1]);


  const lineChartData = {
    labels: date1,
   //labels: [10,11,12],
    datasets: [
      {
        data: infectedData,
        label: "Infected",
        borderColor: "#3333ff",
        fill: true,
        lineTension: 0.5
      },
      {
        data: deathsData,
        label: "Deaths",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        fill: true,
        lineTension: 0.5
      }
    ]
  }

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
            let chartData = buildChartData(getStatisticData(res.data))
            let chartDate1 = buildChartDate(getStatisticData(res.data))
              setInfectedData(chartData);
              setDate1(chartDate1);
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
            let chartData = buildChartData(getStatisticData(res.data))
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

  return (
    <div>
       <Line
      type="line"
      width={160}
      height={60}
      options={{
        title: {
          display: true,
          text: "COVID-19 Cases of Last 6 Months",
          fontSize: 20
        },
        legend: {
          display: true, //Is the legend shown?
          position: "top" //Position of the legend.
        }
      }}
      data={lineChartData}
    />
    </div>
  );
}

export default LineGraph;