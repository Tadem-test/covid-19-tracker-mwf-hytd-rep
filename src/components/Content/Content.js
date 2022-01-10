import React, { useEffect, useState } from 'react';
import InfoBox from "../InfoBox/InfoBox";
import axios from "axios";
import { prettyPrintStat } from "../Util/Util";

export default function Content({countryData}) {
    const [casesType, setCasesType] = useState("cases");

    useEffect(() => {
        console.log(countryData);
    },[countryData])

      const handleClick = (type) => {
        setCasesType(type);
      }

  return (
    <div>
      <InfoBox
        onClick={(e) => handleClick("cases")}
        title="Cases"
        cases={prettyPrintStat(countryData.New_cases)}
        total={prettyPrintStat(countryData.Cumulative_cases)}
      />
      <InfoBox
        onClick={(e) => handleClick("deaths")}
        title="Deaths"
        cases={prettyPrintStat(countryData.New_deaths)}
        total={prettyPrintStat(countryData.Cumulative_deaths)}
      />
    </div>
  );
}
