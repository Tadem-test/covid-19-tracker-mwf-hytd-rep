import React, { useState, useEffect } from "react";
import numeral from "numeral";
import axios from "axios";
import moment from "moment";

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


function LineGraph({casesType, selectedCountry, selectedCountrySlug, getSlug}) {
  const [data, setData] = useState({});
  
  const [date1, setDate1] = useState({});


  const lineChartData = {
 //   labels: date1,
    labels: [10,11,12],
    datasets: [
      {
        data: data,
        label: "Infected",
        borderColor: "#3333ff",
        fill: true,
        lineTension: 0.5
      },
      {
        data: [22, 33, 44,66,77,88,99,200],
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
 
      const getData = async () => {
        await axios
          .get(
           // `${BASE_URL_API_2}/country/${slug}/status/${type}?from=${from}&to=${to}`
           `${BASE_URL_API_2}/country/${slug}/status/${casesType}?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z`
          )
          .then((res) => {
            let chartData = buildChartData(getStatisticData(res.data))
            let chartDate1 = buildChartDate(getStatisticData(res.data))
              setData(chartData);
              setDate1(chartDate1);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getData();

    }

  },[casesType,selectedCountry])

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