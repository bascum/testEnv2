import "../App.css"
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
    priority: 1,
    status: 4,
    printer_num: 5,
    type: 1,
    make_and_model: 5,
    location: null,
    created_on: "2024-10-24T18:09:10.190Z",
    name: ["Bascum Macik", "Test Tech 1", "Marketing"],
    assigned_date: "2024-11-06T18:27:47.373Z",
    description: "Need toner ASAP or I will die",
    dep_id: 4,
  },
  {
    ticket_num: 4,
    priority: 1,
    status: 4,
    printer_num: 5,
    type: 1,
    make_and_model: 5,
    location: null,
    created_on: "2024-10-24T18:09:10.190Z",
    name: ["Bascum Macik", "Test Tech 2", "Marketing"],
    assigned_date: "2024-11-06T18:27:47.373Z",
    description: "Need toner ASAP or I will die",
    dep_id: 4,
  },
  {
    ticket_num: 5,
    priority: 1,
    status: 4,
    printer_num: 5,
    type: 1,
    make_and_model: 5,
    location: null,
    created_on: "2024-10-24T18:09:10.190Z",
    name: ["Bascum Macik", "Test Tech 1", "Marketing"],
    assigned_date: "2024-11-24T18:55:46.467Z",
    description: "Need toner ASAP or I will die",
    dep_id: 4,
  },
  {
    ticket_num: 6,
    priority: 1,
    status: 4,
    printer_num: 5,
    type: 1,
    make_and_model: 5,
    location: null,
    created_on: "2024-10-24T18:09:10.190Z",
    name: ["Bascum Macik", "Test Tech 2", "Marketing"],
    assigned_date: "2024-11-06T18:27:47.373Z",
    description: "Need toner ASAP or I will die",
    dep_id: 4,
    comments: [
      {
        comment_num: 3,
        ticket_num: 6,
        employee_id: 6,
        content:
          "Ticket assigned by admin to Test Tech 2 on Oct 24 2024  4:43PM",
      },
      {
        comment_num: 5,
        ticket_num: 6,
        employee_id: 6,
        content:
          "Ticket assigned by admin to Test Tech 1 on Oct 24 2024  5:33PM",
      },
      {
        comment_num: 11,
        ticket_num: 6,
        employee_id: 6,
        content:
          "Ticket assigned by admin to Test Tech 2 on Nov  5 2024  2:39AM",
      },
    ],
  },
  {
    ticket_num: 7,
    priority: 1,
    status: 4,
    printer_num: 2,
    type: 1,
    make_and_model: 3,
    location: null,
    created_on: "2024-10-24T18:09:10.190Z",
    name: ["admin", "Test Tech 2", "Human Resources"],
    assigned_date: "2024-11-06T18:27:47.373Z",
    description: "Hello",
    dep_id: 1,
  },
  // Add the rest of the objects here...
];

export const MyTickets = ({ setMessageOfTheDay, currentUser }) => {
  let navigate = useNavigate();

  const filterInt = 15; // 15 = 1111 = all filters active

  const [myTickets, setMyTickets] = useState([]);
  const [shownTickets, setShownTickets] = useState([]);
  const [techs, setTechs] = useState([]);
  const [ticketText, setTicketText] = useState("Ticket #");
  const [ticketNumberSearchToggle, setTicketNumberSearchToggle] =
    useState(false);
  const [ticketNumberSearchText, setTicketNumberSearchText] = useState("0");
  const [printerNumText, setPrinterNumText] = useState("Printer #");
  const [printerNumSearchToggle, setPrinterNumSearchToggle] = useState(false);
  const [printerNumSearchText, setPrinterNumSearchText] = useState("0");
  const [error, setError] = useState("");
  const [filterSettings, setFilterSettings] = useState({
    includeStatus: {
      toner: true,
      service: true,
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

  const setOneTicket = async (ticketNum, comments) => {
    //console.log("setOneTicket: \nTicketNum: ", ticketNum);
    //console.log("setOneTicket: \nComemnts: ", comments);
    try {
      let result = await axios.post("/ticket/one_ticket", {
        ticket_num: ticketNum,
      });

      if (result.data.success == "yes") {
        let targetTicket = result.data.ticket;
        targetTicket = { ...targetTicket, comments: comments };
        //console.log("TargetTicket: ", targetTicket);
        let newTickets = myTickets.map((ticket) =>
          ticket.ticket_num == targetTicket.ticket_num ? targetTicket : ticket
        );
        setMyTickets(newTickets);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeTicket = async (ticket, content, e) => {
    try {
      //console.log("closeTicket");
      e.stopPropagation();
      e.preventDefault();
      let result = await axios.post("/ticket/close", {
        ticket_num: ticket.ticket_num,
        content: content,
      });

      if (result.data.success == "yes") {
        await getComments(ticket.ticket_num);
        return false;
      } else {
        return result.data.error;
      }
    } catch (err) {
      //console.log("Hit an error", err);
    }
  };

  const setInProgress = async (ticket, e) => {
    //console.log("setInProgress");
    e.stopPropagation();
    e.preventDefault();
    let result = await axios.post("/ticket/set_inprogress", {
      ticket_num: ticket.ticket_num,
    });
    //console.log(result.data);
    if (result.data.success == "yes") {
      await getComments(ticket.ticket_num);
      return false;
    } else {
      return result.data.error;
    }
  };

  const getTickets = async () => {
    //console.log("GetTickets");
    let results = await axios.get("/ticket/dashboard/get_tickets");
    if (results.data.success == "yes") {
      let tickets = results.data.tickets;
      ////console.log("Tickets from Get request", tickets);
      setMyTickets(tickets);
      setShownTickets(tickets);
    } else {
      setMessageOfTheDay("Error occurred retreiving tickets");
      return navigate("/");
    }
  };

  const convertTechs = (techs) => {
    //console.log("converTechs");
    return techs.map((tech) => {
      // Destructure the tech object, replacing 'id' with 'value'
      const { id, ...rest } = tech;
      return { value: id, ...rest };
    });
  };

  const getTechs = async () => {
    //console.log("GetTechs");
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

  const getComments = async (ticketNum, e) => {
    //console.log("GetComments: \nTicketNum: ", ticketNum);
    let body = { ticketNum: ticketNum };
    let results = await axios.post("/ticket/get_comments", body);
    if (results.data.success == "yes") {
      setOneTicket(ticketNum, results.data.comments);
    }
  };

  const handleTicketNumSearch = (e) => {
    console.log("Handle Ticket Num Search: ", e.target);
    e.preventDefault();
    e.stopPropagation();

    setTicketNumberSearchText(e.target.value);

  };

  const handlePrinterNumSearch = (e) => {
    console.log("Handle Printer Num Search: ", e.target);
    e.preventDefault();
    e.stopPropagation();

    setPrinterNumSearchText(e.target.value);

  };

  const handleCommentSubmit = async (ticketNum, commentContent, e) => {
    //console.log("handleCommentSubmit");
    e.stopPropagation();
    e.preventDefault();

    let body = {
      ticket_num: ticketNum,
      employee_id: currentUser.id,
      content: commentContent,
      employee_name: currentUser.name,
    };

    let results = await axios.post("/ticket/add_comment", body);
    //console.log("Comment: ", results.data);
    getComments(ticketNum);
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
      //console.log("First Ticket Map (input): ", ticket);
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

    //console.log("First Ticket Map (Out): ", outputArr);

    outputArr = outputArr.map((ticket) => {
      //console.log("Second Ticket Map (input): ", ticket);
      if (ticket != null) {
        if (ticket.type == 1) {
          return filterSettings.includeStatus.toner ? ticket : null;
        }

        if (ticket.type == 2) {
          return filterSettings.includeStatus.service ? ticket : null;
        }
      }
    });

    outputArr = outputArr.map((ticket) => {
      //console.log("Ticket Num Search Filter in: ", ticket);
      //console.log("ticketNumSearch: ", ticketNumberSearchText);
      if (ticket != null) {
        if (ticketNumberSearchText != "0" && ticketNumberSearchText != 0) {
          //console.log("if statement running");
          try {
            let searchNum = parseInt(ticketNumberSearchText);
            if (ticket.ticket_num == searchNum) {
              return ticket;
            } else {
              return null;
            }
          } catch {
            setError("Please only input numbers into the ticket number search");
            return ticket;
          }
        } else if (ticketNumberSearchText == "0") {
          return ticket;
        }
      }
    });

    outputArr = outputArr.map((ticket) => {
      //console.log("Printer Num Search Filter in: ", ticket);
      if (ticket != null) {
        if (printerNumSearchText != "0" && printerNumSearchText != 0) {
          try {
            let searchNum = parseInt(printerNumSearchText);
            if (ticket.printer_num == searchNum) {
              return ticket;
            } else {
              return null;
            }
          } catch {
            setError(
              "Please only input numbers into the printer number search"
            );
            return ticket;
          }
        } else if (printerNumSearchText == "0") {
          return ticket;
        }
      }
    });

    //console.log("Second Ticket Map (Output): ", outputArr);

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
        if (a.assigned_date == undefined) {
          return 1;
        } else if (b.assigned_date == undefined) {
          return -1;
        } else {
          return new Date(a.assigned_date) - new Date(b.assigned_date);
        }
      });
    } else if (filterSettings.sortBy.descendingAssignmentDate) {
      outputArr.sort((a, b) => {
        //console.log("a: ", a);
        //console.log("b: ", b);
        if (a.assigned_date == undefined) {
          return 1;
        } else if (b.assigned_date == undefined) {
          return -1;
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
    console.log("e: ", e.target);
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
    //console.log("Tickets: ", myTickets);
    //console.log("Shown Tickets: ", shownTickets);
    await getTechs();
    //console.log("Techs: ", techs);
  };

  useEffect(() => {
    startup();
  }, []);

  useEffect(() => {
    //console.log("Render due to getTickets()");
  }, [myTickets]);

  useEffect(() => {
    if (myTickets && myTickets.length > 0) {
      sortTickets();
    }
  }, [myTickets, filterSettings, printerNumSearchText, ticketNumberSearchText]);


  return (
    <>
      <div className="overflow-auto body">
        <Dropdown
          style={{ marginLeft: "2.5%", marginBottom: "0" }}
          title="This is main drop"
          autoClose="outside"
        >
          <Dropdown.Toggle id="dropdown-basic">Filter</Dropdown.Toggle>
          <Dropdown.Menu title="Hello there">
            <Form.Label
              style={{
                margin: "8px",
              }}
            >
              Include:
            </Form.Label>
            <div>
              <Form.Check // prettier-ignore
                type="switch"
                id="toner_Ticket_Switch"
                label="Toner Tickets"
                name="toner"
                onChange={sortTicketsFilters}
                checked={filterSettings.includeStatus.toner}
                style={{
                  margin: "8px",
                }}
              />
            </div>
            <div>
              <Form.Check // prettier-ignore
                type="switch"
                id="service_Ticket_Switch"
                label="Service Tickets"
                name="service"
                onChange={sortTicketsFilters}
                checked={filterSettings.includeStatus.service}
                style={{
                  margin: "8px",
                }}
              />
            </div>
            <Dropdown.Divider />
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
                onChange={sortTicketsSorting}
                checked={filterSettings.sortBy.ascendingCreationDate}
              />
              <Form.Check
                type="radio"
                id="descendingCreationDate"
                label="Descending Creation Date"
                name="sortBy"
                onChange={sortTicketsSorting}
                checked={filterSettings.sortBy.descendingCreationDate}
              />
              <Form.Check
                type="radio"
                id="ascendingAssignmentDate"
                label="Ascending Assignment Date"
                name="sortBy"
                onChange={sortTicketsSorting}
                checked={filterSettings.sortBy.ascendingAssignmentDate}
              />
              <Form.Check
                type="radio"
                id="descendingAssignmentDate"
                label="Descending Assignment Date"
                name="sortBy"
                onChange={sortTicketsSorting}
                checked={filterSettings.sortBy.descendingAssignmentDate}
              />
              <Form.Check
                type="radio"
                id="printerNumAscending"
                label="Printer Number Ascending"
                name="sortBy"
                onChange={sortTicketsSorting}
                checked={filterSettings.sortBy.printerNumAscending}
              />
              <Form.Check
                type="radio"
                id="printerNumDescending"
                label="Printer Number Descending"
                name="sortBy"
                onChange={sortTicketsSorting}
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
              <th>
                <div
                  onClick={() => {
                    if (!ticketNumberSearchToggle) {
                      setTicketNumberSearchToggle(!ticketNumberSearchToggle);
                    }
                  }}
                  onMouseEnter={() => {
                    setTicketText("Click to Search");
                  }}
                  onMouseLeave={() => {
                    setTicketText("Ticket #");
                  }}
                >
                  {ticketNumberSearchToggle ? (
                    <input
                      type="number"
                      placeholder="Enter Ticket Number"
                      value={ticketNumberSearchText}
                      onChange={handleTicketNumSearch}
                      onBlur={() => {
                        setTicketNumberSearchToggle(false);
                        setTicketNumberSearchText("0");
                      }}
                      autoFocus
                    />
                  ) : (
                    <>{ticketText}</>
                  )}
                </div>
              </th>

              <th>Status</th>
              <th>
                <div
                  onMouseEnter={() => {
                    setPrinterNumText("Click to Search");
                  }}
                  onMouseLeave={() => {
                    setPrinterNumText("Printer #");
                  }}
                  onClick={() => {
                    if (!printerNumSearchToggle) {
                      setPrinterNumSearchToggle(!printerNumSearchToggle);
                    }
                  }}
                >
                  {printerNumSearchToggle ? (
                    <input
                      type="number"
                      placeholder="Enter Printer Number"
                      value={printerNumSearchText}
                      onChange={handlePrinterNumSearch}
                      onBlur={() => {
                        setPrinterNumSearchToggle(false);
                        setPrinterNumSearchText("0");
                      }}
                      autoFocus
                    />
                  ) : (
                    <>{printerNumText}</>
                  )}
                </div>
              </th>
              <th>Created On</th>
              <th>Created By</th>
              <th>Assigned To</th>
              <th>Ticket Type</th>
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
                    getComments={(e) => getComments(ticket.ticket_num, e)}
                    handleCommentSubmit={handleCommentSubmit}
                    setInProgress={setInProgress}
                    closeTicket={closeTicket}
                  />
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default MyTickets;
