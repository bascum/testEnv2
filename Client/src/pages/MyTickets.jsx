import React from "react";
import Form from "react-bootstrap/Form";
import { Header } from "../components/header/Header";
import { TicketRow } from "../components/Ticket Row/TicketRow";
import { TicketCard } from "../components/Ticket Card/TicketCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Table, Dropdown } from "react-bootstrap";
import axios from "axios";

const testTickets = [
  {
    ticket_num: 3,
    status: 2,
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

export const MyTickets = ({ setMessageOfTheDay, currentUser }) => {
  let navigate = useNavigate();

  const filterInt = 15; // 15 = 1111 = all filters active

  const [myTickets, setMyTickets] = useState([]);
  const [shownTickets, setShownTickets] = useState([]);
  const [techs, setTechs] = useState([]);
  const [filterSettings, setFilterSettings] = useState({
    includeStatus: {
      open: true,
      assigned: true,
      in_progress: true,
      closed: false,
    },
    sortBy: {
      ascendingCreationDate: false,
      descendingCreationDate: true,
      ascendingAssignmentDate: false,
      descendingAssignmentDate: false,
      printerNumAscending: false,
      printerNumDescending: false,
    },
  });

  const getTickets = async () => {
    let results = await axios.get("/ticket/dashboard/get_tickets");
    if (results.data.success == "yes") {
      let tickets = results.data.tickets;
      //console.log("Tickets from Get request", tickets);
      setMyTickets(tickets);
      setShownTickets(tickets);
    } else {
      setMessageOfTheDay("Error occurred retreiving tickets");
      return navigate("/");
    }
  };

  const convertTechs = (techs) => {
    return techs.map((tech) => {
      // Destructure the tech object, replacing 'id' with 'value'
      const { id, ...rest } = tech;
      return { value: id, ...rest };
    });
  };

  const getTechs = async () => {
    let results = await axios.get("/user/get_techs");
    //console.log(results.data);
    if (results.data.success == "yes") {
      let techs = results.data.techs;
      //console.log("Techs: ", techs);
      techs = convertTechs(techs);
      setTechs(techs);
    } else {
      setMessageOfTheDay("Error getting Techs");
      return navigate("/");
    }
  };

  const onAssignment = async (ticket, e) => {
    //console.log(e);
    let value = e.target.value;
    let result = await axios.post("/ticket/assign", {
      id: value,
      ticket_number: ticket.ticket_num,
    });
    if (result.data.success == "yes") {
      ////console.log("assigned Ticket");
      getTickets();
    }
  };

  const sortTickets = async () => {
    //console.log("FilterSettings in sortTickets: ", filterSettings);
    let outputArr = myTickets.map((ticket) => {
      //console.log(ticket)
      //Create an array with only the tickets to be shown based on the filter settings
      if (ticket.status == 1) {
        return filterSettings.includeStatus.open ? ticket : null;
      } else if (ticket.status == 2) {
        return filterSettings.includeStatus.assigned ? ticket : null;
      } else if (ticket.status == 3) {
        return filterSettings.includeStatus.in_progress ? ticket : null;
      } else if (ticket.status == 4) {
        return filterSettings.includeStatus.closed ? ticket : null;
      }
    });

    outputArr = outputArr.filter((ticket) => {
      //console.log(ticket);
      if (ticket != null) {
        return true;
      }
    }); //Hopefully filter out all null tickets
    //console.log("OutputArr: ", outputArr);

    if (filterSettings.sortBy.ascendingAssignmentDate) {
      // Need different sort functions for each sort so we have this
      outputArr.sort((a, b) => {
        //console.log("a: ", a);
        //console.log("b: ", b);
        if (a.assigned_date == undefined || b.assigned_date == undefined) {
          return 0;
        } else {
          return new Date(a.assigned_date) - new Date(b.assigned_date);
        }
      });
    } else if (filterSettings.sortBy.descendingAssignmentDate) {
      outputArr.sort((a, b) => {
        //console.log("a: ", a);
        //console.log("b: ", b);
        if (a.assigned_date == undefined || b.assigned_date == undefined) {
          return 0;
        } else {
          return new Date(b.assigned_date) - new Date(a.assigned_date);
        }
      });
    } else if (filterSettings.sortBy.ascendingCreationDate) {
      outputArr.sort((a, b) => {
        //console.log("a: ", a);
        //console.log("b: ", b);
        return new Date(a.created_on) - new Date(b.created_on);
      });
    } else if (filterSettings.sortBy.descendingCreationDate) {
      outputArr.sort((a, b) => {
        //console.log("a: ", a);
        //console.log("b: ", b);
        return new Date(b.created_on) - new Date(a.created_on);
      });
    } else if (filterSettings.sortBy.printerNumAscending) {
      outputArr.sort((a, b) => {
        //console.log("a: ", a);
        //console.log("b: ", b);
        return a.printer_num - b.printer_num;
      });
    } else if (filterSettings.sortBy.printerNumDescending) {
      outputArr.sort((a, b) => {
        //console.log("a: ", a);
        //console.log("b: ", b);
        return b.printer_num - a.printer_num;
      });
    }

    setShownTickets(outputArr);
  };

  const sortTicketsFilters = async (e) => {
    //console.log("e: ", e.target);
    const name = e.target.name;
    const checked = e.target.checked;
    await setFilterSettings({
      ...filterSettings,
      includeStatus: {
        ...filterSettings.includeStatus,
        [name]: checked,
      },
    });
  };

  const sortTicketsSorting = async (e) => {
    //console.log("e: ", e.target);
    const id = e.target.id;
    const checked = e.target.checked;

    let newSort = {
      ascendingCreationDate: false,
      descendingCreationDate: false,
      ascendingAssignmentDate: false,
      descendingAssignmentDate: false,
      printerNumAscending: false,
      printerNumDescending: false,
    };

    newSort = {
      ...newSort,
      [id]: checked,
    };

    await setFilterSettings({
      ...filterSettings,
      sortBy: newSort,
    });
  };

  const startup = async () => {
    await getTickets();
    console.log("Tickets: ", myTickets);
    console.log("Shown Tickets: ", shownTickets);
    await getTechs();
    console.log("Techs: ", techs);
  }

  useEffect(() => {
    startup();
  }, []);

  useEffect(() => {
    console.log("render");
  });

  useEffect(() => {
    if (myTickets && myTickets.length > 0) {
      sortTickets();
    }
  }, [myTickets]);

  return (
    <>
      <Dropdown
        style={{ marginLeft: "2.5%", marginTop: "2.5%", marginBottom: "0" }}
        title="This is main drop"
        autoClose="outside"
      >
        <Dropdown.Toggle id="dropdown-basic">Filter</Dropdown.Toggle>
        <Dropdown.Menu title="Hello there">
          <Form.Label>Include:</Form.Label>
          <div>
            <Form.Check // prettier-ignore
              type="switch"
              id="open_Ticket_Switch"
              label="Open Tickets"
              name="open"
              onChange={sortTicketsFilters}
              checked={filterSettings.includeStatus.open}
              style={{
                margin: "8px",
              }}
            />
          </div>
          <div>
            <Form.Check // prettier-ignore
              type="switch"
              id="assigned_Ticket_Switch"
              label="Assigned Tickets"
              name="assigned"
              onChange={sortTicketsFilters}
              checked={filterSettings.includeStatus.assigned}
              value={filterSettings.includeStatus.assigned}
              style={{
                margin: "8px",
              }}
            />
          </div>
          <div>
            <Form.Check // prettier-ignore
              type="switch"
              id="in_progress_Ticket_Switch"
              label="In-Progress Tickets"
              name="in_progress"
              onChange={sortTicketsFilters}
              checked={filterSettings.includeStatus.in_progress}
              style={{
                margin: "8px",
              }}
            />
          </div>
          <Dropdown.Divider />

          <div style={{ padding: "8px" }}>
            <Form.Label>Sort By:</Form.Label>
            <Form.Check
              type="radio"
              id="ascendingCreationDate"
              label="Ascending Creation Date"
              name="sortBy"
              onChange={sortTicketsSorting} // Updated function
              checked={filterSettings.sortBy.ascendingCreationDate}
            />
            <Form.Check
              type="radio"
              id="descendingCreationDate"
              label="Descending Creation Date"
              name="sortBy"
              onChange={sortTicketsSorting} // Updated function
              checked={filterSettings.sortBy.descendingCreationDate}
            />
            <Form.Check
              type="radio"
              id="ascendingAssignmentDate"
              label="Ascending Assignment Date"
              name="sortBy"
              onChange={sortTicketsSorting} // Updated function
              checked={filterSettings.sortBy.ascendingAssignmentDate}
            />
            <Form.Check
              type="radio"
              id="descendingAssignmentDate"
              label="Descending Assignment Date"
              name="sortBy"
              onChange={sortTicketsSorting} // Updated function
              checked={filterSettings.sortBy.descendingAssignmentDate}
            />
            <Form.Check
              type="radio"
              id="printerNumAscending"
              label="Printer Number Ascending"
              name="sortBy"
              onChange={sortTicketsSorting} // Updated function
              checked={filterSettings.sortBy.printerNumAscending}
            />
            <Form.Check
              type="radio"
              id="printerNumDescending"
              label="Printer Number Descending"
              name="sortBy"
              onChange={sortTicketsSorting} // Updated function
              checked={filterSettings.sortBy.printerNumDescending}
            />
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <Table
        striped
        bordered
        hover
        responsive
        className="mt-4 mx-auto"
        style={{ maxWidth: "95%" }}
      >
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
            shownTickets.map((ticket, index) => {
              return (
                <TicketRow
                  ticket={ticket}
                  index={index}
                  currentUser={currentUser}
                  techs={techs}
                  onAssignment={(e) => onAssignment(ticket, e)}
                />
              );
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
