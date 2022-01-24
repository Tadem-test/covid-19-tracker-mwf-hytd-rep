import React, { useEffect, useState } from 'react';
import InfoBox from "../InfoBox/InfoBox";
import { prettyPrintStat } from "../Util/Util";

export default function Content({selectedCountry, getInfoBoxData}) {
    const [data,setData] = useState();
    const [casesType, setCasesType] = useState("cases");

    useEffect(() => {
      setData(getInfoBoxData(selectedCountry));
    },[])

      const handleClick = (type) => {
        setCasesType(type);
      }

  return(
    <div>
      <p>
      ${JSON.stringify(data)}
      </p>
    </div>
  )
  /*return (
    <div>
      <InfoBox
        onClick={(e) => handleClick("cases")}
        title="Cases"
        cases={prettyPrintStat(countryData.NewConfirmed)}
        total={prettyPrintStat(countryData.TotalConfirmed)}
      />
      <InfoBox
        onClick={(e) => handleClick("deaths")}
        title="Deaths"
        cases={prettyPrintStat(countryData.NewDeaths)}
        total={prettyPrintStat(countryData.TotalDeaths)}
      />
    </div>
  );*/
}
