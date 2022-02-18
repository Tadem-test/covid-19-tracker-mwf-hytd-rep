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
  BarElement,
} from "chart.js";

import { Chart, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BASE_URL_API_2 = "https://api.covid19api.com";

function getStatisticData(countrydata) {
  console.log(countrydata);
  const statData = {};
  for (var index = 0; index < countrydata.length; index++) {
    const date = countrydata[index].Date;
    const utcStart = new moment(date, "YYYY-MM-DDTHH:mm:ssZ").utc();
    const selectedDate = utcStart.format("DD/MM/YY");
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

function LineGraph({
  dateRange,
  selectedCountry,
  selectedCountrySlug,
  getSlug,
  selectedChart,
}) {
  const [infectedData, setInfectedData] = useState({});
  const [deathsData, setDeathsData] = useState({});

  const [date1, setDate1] = useState([0, 1]);

  const lineChartData = {
    labels: date1,
    //labels: [10,11,12],
    datasets: [
      {
        data: infectedData,
        label: "Infected",
        borderColor: "#3333ff",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: deathsData,
        label: "Deaths",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        fill: true,
        lineTension: 0.5,
      },
    ],
  };

  const barChartData = {
    labels: date1,
    datasets: [
      {
        label: "Infected",
        backgroundColor: "#3333ff",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: infectedData,
      },
      {
        label: "Deaths",
        backgroundColor: "#ff3333",
        borderColor: "rgba(255, 0, 0, 0.5)",
        borderWidth: 1,
        data: deathsData,
      },
    ],
  };

  useEffect(() => {
    if (selectedCountry === "Global") {
      //getCOuntryData für Global
    } else {
      const slug = getSlug(selectedCountry);
      const start = `${format(dateRange.start, "yyyy-MM-dd")}`;
      const end = `${format(dateRange.end, "yyyy-MM-dd")}`;
      console.log(start, end);

      const getData = async () => {
        await axios
          .get(
            // `${BASE_URL_API_2}/country/${slug}/status/${type}?from=${from}&to=${to}`
            `${BASE_URL_API_2}/country/${slug}/status/confirmed?from=${start}T00:00:00Z&to=${end}T00:00:00Z`
          )
          .then((res) => {
            let chartData = buildChartData(getStatisticData(res.data));
            let chartDate1 = buildChartDate(getStatisticData(res.data));
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
            let chartData = buildChartData(getStatisticData(res.data));
            setDeathsData(chartData);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getDeathsData();
      console.log("Start: " + dateRange.start + " End: " + dateRange.end);
    }
  }, [dateRange, selectedCountry]);

  return (
    <div>
      {selectedChart === "line" && (
        <Line
          type="line"
          width={160}
          height={60}
          options={{
            title: {
              display: true,
              text: "COVID-19 Cases of Last 6 Months",
              fontSize: 20,
            },
            legend: {
              display: true, //Is the legend shown?
              position: "top", //Position of the legend.
            },
          }}
          data={lineChartData}
        />
      )}
      {selectedChart === "bar" && (
        <Bar
          data={barChartData}
          options={{
            title: {
              display: true,
              text: "Average Rainfall per month",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;