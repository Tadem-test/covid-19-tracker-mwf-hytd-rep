import React from "react";
import { MenuItem, Select } from "@mui/material";
import uuid from "react-uuid";

export default function ChartSelector({ selectedChart, handleSelectedChart }) {
  return (
    <Select
      id="chart-selector"
      value={selectedChart}
      label="Chart"
      onChange={handleSelectedChart}
      variant="standard"
      color="primary"
    >
      <MenuItem key={uuid()} value={"line"}>
        Line Chart
      </MenuItem>
      <MenuItem key={uuid()} value={"bar"}>
        Bar Chart
      </MenuItem>
    </Select>
  );
}
