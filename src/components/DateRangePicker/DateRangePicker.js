import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DateRangePicker as DateRange } from "react-date-range";

export default function DateRangePicker({ updateDateRange }) {
  const [openDateRangeDialog, setOpenDateRangeDialog] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleClickOpen = () => {
    setOpenDateRangeDialog(true);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleClose = () => {
    setOpenDateRangeDialog(false);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleSaveAndSearch = () => {
    setOpenDateRangeDialog(false);
    updateDateRange({ start: startDate, end: endDate });
  };

  const handleReset = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
    console.log(ranges.selection);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Date Range
      </Button>
      <Dialog
        open={openDateRangeDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Pick Date Range:"}</DialogTitle>
        <DialogContent>
          <DateRange
            ranges={[selectionRange]}
            onChange={handleSelect}
            dateDisplayFormat="yyyy"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleSaveAndSearch} autoFocus>
            Save and Search
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
