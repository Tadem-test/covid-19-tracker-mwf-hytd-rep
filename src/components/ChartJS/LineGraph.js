import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

function getStatistikData(countrydata) {
    const cases = {};
    const deaths = {};
    const statData = {};
    const test = "Hallo Emre";
  
    for (var index = data.length - 1; index > 0; index--) {
      const selectedDate = moment.unix(data[index].Date_reported).format('MM/DD/YY');
      const casesValue = data[index].New_cases;
      const deathsValue = data[index].New_deaths;
      cases[selectedDate] = casesValue;
      deaths[selectedDate] = deathsValue;
    }
  
    statData["cases"] = cases;
    statData["deaths"] = deaths;
  
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
const buildChartData = (data, casesType) => {
  let chartData = [];
  for (let date in data.cases) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date],
      };
      chartData.push(newDataPoint);
  }
  return chartData;
};

function LineGraph(countrydata) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`http://localhost:5000/api/${country}/stat`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType,country]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
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