import React from "react";
import { Header } from "../components/header/Header";
import { TicketRow } from "../components/Ticket Row/TicketRow";
import { TicketCard } from "../components/Ticket Card/TicketCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import axios from "axios";

const testTickets = [
  {
    ticket_num: 3,
    status: 1,
    printer_num: 5,
    created_on: "2024-10-09T15:36:15.133Z",
    name: ["Bascum Macik", "Bascum Macik"],
    assigned_date: "2024-10-09T15:36:15.133Z",
  },
  {
    ticket_num: 4,
    status: 1,
    printer_num: 5,
    created_on: "2024-10-09T15:36:15.133Z",
    name: ["Bascum Macik", null],
    assigned_date: null,
  },
  {
    ticket_num: 5,
    status: 1,
    printer_num: 5,
    created_on: "2024-10-09T15:36:15.133Z",
    name: ["Bascum Macik", null],
    assigned_date: null,
  },
  {
    ticket_num: 6,
    status: 1,
    printer_num: 5,
    created_on: "2024-10-09T15:36:15.133Z",
    name: ["Bascum Macik", null],
    assigned_date: null,
  },
  {
    ticket_num: 7,
    status: 1,
    printer_num: 2,
    created_on: "2024-10-09T15:36:15.133Z",
    name: ["admin", null],
    assigned_date: null,
  },
  {
    ticket_num: 8,
    status: 1,
    printer_num: 2,
    created_on: "2024-10-09T15:36:15.133Z",
    name: ["admin", null],
    assigned_date: null,
  },
  {
    ticket_num: 9,
    status: 1,
    printer_num: 2,
    created_on: "2024-10-09T15:36:15.133Z",
    name: ["admin", null],
    assigned_date: null,
  },
  {
    ticket_num: 10,
    status: 1,
    printer_num: 2,
    created_on: "2024-10-09T15:36:15.133Z",
    name: ["admin", null],
    assigned_date: null,
  },
];

export const MyTickets = ({ setMessageOfTheDay }) => {
  let navigate = useNavigate();

  const [myTickets, setMyTickets] = useState([]);

  const getTickets = async () => {
    let results = await axios.get("/ticket/dashboard/get_tickets");
    if (results.data.success == "yes") {
      let tickets = results.data.tickets;
      console.log("Tickets from Get request", tickets);
      setMyTickets(tickets);
    } else {
      setMessageOfTheDay("Error occurred retreiving tickets");
      return navigate("/");
    }
  };

  useEffect(() => {
    //getTickets();
  }, []);

  return (
    <>
      <Table striped bordered hover responsive className="mt-4 mx-auto" style={{ maxWidth: "95%" }}>
        <thead>
          <tr>
            <th>Ticket #</th>
            <th>Status</th>
            <th>Printer Number</th>
            <th>Created On</th>
            <th>Created By</th>
            <th>Assigned To</th>
            <th>Assigned Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {myTickets.length > 0 ? (
            myTickets.map((ticket, index) => {
              return <TicketRow ticket={ticket} index={index} />;
            })
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default MyTickets;
