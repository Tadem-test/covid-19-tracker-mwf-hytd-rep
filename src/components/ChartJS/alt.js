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
import { Chart } from 'react-chartjs-2'

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
        const selectedDate = moment.unix(utcStart).format('MM/DD/YY');
        //const splited = date.split('T');
        //const selectedDate = splited[0];
      const casesValue = countrydata[index].Cases;
      statData[selectedDate] = casesValue;
    }
    console.log(statData);
    return statData;
  }

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data) => {
  let chartData = [];
  for (let date in data) {
      let newDataPoint = {
        x: date,
        y: data[date],
      };
      chartData.push(newDataPoint);
  }
  console.log(chartData);
  return chartData;
};

function LineGraph({casesType, selectedCountry, selectedCountrySlug, getSlug}) {
  const [data, setData] = useState({});

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
              setData(chartData);
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
      {data?.length > 0 && (
        <LineElement
          data={{
            datasets: [
              {
                backgroundColor: "#e8a0a5",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;