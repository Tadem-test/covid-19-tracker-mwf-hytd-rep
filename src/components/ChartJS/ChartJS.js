import React, { useState, useEffect } from "react";
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

import { Line, Bar } from "react-chartjs-2";

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
  const statData = {};
  for (var index = 0; index < countrydata.length; index++) {
    const date = countrydata[index].Date;
    const utcStart = new moment(date, "YYYY-MM-DDTHH:mm:ssZ").utc();
    const selectedDate = utcStart.format("MM/DD/YYYY");
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

const buildChartDataNew = (data) => {
  let results = [];
  let attr = Object.keys(data);

  results.push(0);

  for (let i = 1; i < attr.length; i++) {
    const value = data[attr[i]] - data[attr[i - 1]];
    results.push(value);
  }

  return results;
};

function LineGraph({ dateRange, selectedCountry, selectedChart }) {
  const [infectedTotal, setInfectedTotal] = useState({});
  const [infectedDaily, setInfectedDaily] = useState({});
  const [deathsTotal, setDeathsTotal] = useState({});
  const [deathsDaily, setDeathsDaily] = useState({});
  const [date, setDate] = useState([0, 1]);

  const lineChartData = {
    labels: date,
    datasets: [
      {
        data: infectedTotal,
        label: "Infected Total",
        borderColor: "#095763",
        backgroundColor: "#188c9e",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: infectedDaily,
        label: "Infected Daily",
        borderColor: "#6e602d",
        backgroundColor: "#d1b44b",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: deathsTotal,
        label: "Deaths Total",
        borderColor: "#544470",
        backgroundColor: "#7b64a3",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: deathsDaily,
        label: "Deaths Daily",
        borderColor: "#378051",
        backgroundColor: "#3bb367",
        fill: true,
        lineTension: 0.5,
      },
    ],
  };

  const barChartData = {
    labels: date,
    datasets: [
      {
        label: "Infected Total",
        borderColor: "#095763",
        backgroundColor: "#188c9e",
        borderWidth: 1,
        data: infectedTotal,
      },
      {
        label: "Infected Daily",
        borderColor: "#6e602d",
        backgroundColor: "#d1b44b",
        borderWidth: 1,
        data: infectedDaily,
      },
      {
        label: "Deaths Total",
        borderColor: "#544470",
        backgroundColor: "#7b64a3",
        borderWidth: 1,
        data: deathsTotal,
      },
      {
        label: "Deaths Daily",
        borderColor: "#378051",
        backgroundColor: "#3bb367",
        borderWidth: 1,
        data: deathsDaily,
      },
    ],
  };

  useEffect(() => {
    if (selectedCountry != "") {
      const slug = selectedCountry.Slug;
      const start = `${format(dateRange[0], "yyyy-MM-dd")}`;
      const end = `${format(dateRange[1], "yyyy-MM-dd")}`;

      const getData = async () => {
        await axios
          .get(
            `${BASE_URL_API_2}/country/${slug}/status/confirmed?from=${start}T00:00:00Z&to=${end}T00:00:00Z`
          )
          .then((res) => {
            setInfectedTotal(buildChartData(getStatisticData(res.data)));
            setInfectedDaily(buildChartDataNew(getStatisticData(res.data)));
            setDate(buildChartDate(getStatisticData(res.data)));
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getData();

      const getDeathsData = async () => {
        await axios
          .get(
            `${BASE_URL_API_2}/country/${slug}/status/deaths?from=${start}&to=${end}`
          )
          .then((res) => {
            setDeathsTotal(buildChartData(getStatisticData(res.data)));
            setDeathsDaily(buildChartDataNew(getStatisticData(res.data)));
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getDeathsData();
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
              text: "COVID-19 Cases Line Chart",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "top",
            },
          }}
          data={lineChartData}
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        />
      )}
      {selectedChart === "bar" && (
        <Bar
          data={barChartData}
          options={{
            title: {
              display: true,
              text: "COVID-19 Cases Bar Chart",
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
