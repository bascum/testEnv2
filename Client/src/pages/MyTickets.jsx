import React from "react";
import { Header } from "../components/Header";
import List from "../components/List";

export const MyTickets = (props) => {
  return (
    <>
      <Header loggedIn={props.loggedIn} toggleLogged={props.toggleLogged} />
      <List />
    </>
  );
};

export default MyTickets;
