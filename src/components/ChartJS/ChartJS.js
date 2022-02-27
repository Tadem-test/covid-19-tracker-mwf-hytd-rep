import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { format, getDate } from "date-fns";

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
  console.log(countrydata);
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
     chartData.push(moment(date, "DD.MM.YYYY")._i);
  }
  return chartData;
};

const buildChartDataNew = (data) => {
  let chartData = [];
  let result;
  let result3;

  let result1;
  for (let date in data) {
       result = new Date(date);
       result.setDate(result.getDate() + 1)

       if (result.getMonth() < 10 && result.getDate() < 10 ) {
        result3 = "0"+ (result.getMonth() + 1) +  "/0"+ result.getDate() + "/" + result.getFullYear();;
        console.log(result3);
      } else  if (result.getMonth() < 10 ) { 
        result3 = "0"+ (result.getMonth() + 1) +  "/"+ result.getDate() + "/" + result.getFullYear();;
        console.log(result3);
    } else  if (result.getDate() < 10 ) { 
      result3 = (result.getMonth() + 1) +  "/0"+ result.getDate() + "/" + result.getFullYear();;
      console.log(result3);
    }
     else {
      result3 = (result.getMonth() + 1) +  "/"+ result.getDate() + "/" + result.getFullYear();;
        console.log(result3);

      }
   result1 = data[result3] - data[date];
    chartData.push(result1);
  }
  return chartData;
};

function LineGraph({ dateRange, selectedCountry, selectedChart }) {
  const [infectedDataTotal, setInfectedDataTotal] = useState({});
  const [infectedDataDay, setInfectedDataDay] = useState({});
  const [deathsDataTotal, setDeathsDataTotal] = useState({});
  const [deathsData, setDeathsData] = useState({});
  console.log(dateRange);
  const [date1, setDate1] = useState([0, 1]);

  const lineChartData = {
    labels: date1,
    //labels: [10,11,12],
    datasets: [
      {
        data: infectedDataTotal,
        label: "Infected",
        borderColor: "#3333ff",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: infectedDataDay,
        label: "InfectedA",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 255)",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: deathsDataTotal,
        label: "Deaths",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: deathsData,
        label: "DeathsA",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 255)",
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
        data: infectedDataTotal,
      },
      {
        label: "InfectedA",
        backgroundColor: "#ff3333",
        borderColor: "rgba(0, 0, 0, 255)",
        borderWidth: 1,
        data: infectedDataDay,
      },
      {
        label: "Deaths",
        backgroundColor: "#ff3333",
        borderColor: "rgba(255, 0, 0, 0.5)",
        borderWidth: 1,
        data: deathsDataTotal,
      },
      {
        label: "Deaths",
        backgroundColor: "#ff3333",
        borderColor: "rgba(255, 0, 0, 255)",
        borderWidth: 1,
        data: deathsData,
      },

    ],
  };

  useEffect(() => {
    if (selectedCountry === "") {
    } else {
      const slug = selectedCountry.Slug;
      const start = `${format(dateRange[0], "yyyy-MM-dd")}`;
      const end = `${format(dateRange[1], "yyyy-MM-dd")}`;
      console.log(start, end);

      const getData = async () => {
        await axios
          .get(
            `${BASE_URL_API_2}/country/${slug}/status/confirmed?from=${start}T00:00:00Z&to=${end}T00:00:00Z`
          )
          .then((res) => {
            let chartData = buildChartData(getStatisticData(res.data));
            let chartDate1 = buildChartDate(getStatisticData(res.data));
            let chartDate2 = buildChartDataNew(getStatisticData(res.data));
            setInfectedDataTotal(chartData);
            setDate1(chartDate1);
            setInfectedDataDay(chartDate2);
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
            let chartData = buildChartData(getStatisticData(res.data));
            let chartData2 = buildChartDataNew(getStatisticData(res.data));
            setDeathsData(chartData2);
            setDeathsDataTotal(chartData);
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
