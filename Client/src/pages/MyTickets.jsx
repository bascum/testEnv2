import React from "react";
import { Header } from "../components/header/Header";
import List from "../components/list/List";

export const MyTickets = (props) => {
  return (
    <>
      <Header loggedIn={props.loggedIn} toggleLogged={props.toggleLogged} />
      <List />
    </>
  );
};

export default MyTickets;
