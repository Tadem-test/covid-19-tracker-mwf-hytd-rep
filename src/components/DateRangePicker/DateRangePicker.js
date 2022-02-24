import React from "react";
import TextField from "@mui/material/TextField";
import DateRangePickerComponent from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";

export default function DateRangePicker({ updateDateRange, dateRange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePickerComponent
        startText="Von"
        endText="Bis"
        value={dateRange}
        onChange={(newDateRange) => {
          updateDateRange(newDateRange);
        }}
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </>
        )}
        maxDate={new Date()}
      />
    </LocalizationProvider>
  );
}
