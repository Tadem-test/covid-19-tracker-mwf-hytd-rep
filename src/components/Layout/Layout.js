import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

// components
import Header from "../Header/Header";

export default function Layout(props) {
  return (
    <>
      <Header />
    </>
  );
}
