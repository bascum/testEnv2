import DropdownPrimary from "../dropdowns/DropdownPrimary";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import { useEffect, useState } from "react";

export const TicketRow = ({
  ticket,
  index,
  currentUser,
  techs,
  onAssignment,
  getComments,
  handleCommentSubmit,
  setInProgress,
  closeTicket,
}) => {
  try{
  const status = {
    1: "Open",
    2: "Assigned",
    3: "In-Progress",
    4: "Closed",
  };

  const [selected, setSelected] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [closeTicketContent, setCloseTicketContent] = useState("");
  const [ticketNum, setTicketNum] = useState(-1);

  const handleCloseTicketContentChange = (e) => {
    e.stopPropagation();
    setCloseTicketContent(e.target.value);
  };

  const handleCommentChange = (e) => {
    e.stopPropagation();
    setCommentContent(e.target.value);
  };

  const handleClick = (e) => {
    try{
    setSelected(!selected);
    getComments(e);
    } catch (err) {
      //console.log("handleclick: ", err);
    }
  };

  const checkTicketNum = () => {
    if (ticketNum == -1){
      setTicketNum(0);
    } else if (ticketNum != ticket.ticket_num) {
      setTicketNum(ticket.ticket_num);
      setSelected(false);
    }
  }

  useEffect(() => {checkTicketNum();})

  return (
    <>
      {ticket == undefined ? (
        <></>
      ) : !selected ? (
        <tr key={index} onClick={handleClick}>
          <td>{ticket.ticket_num}</td>
          <td>{status[ticket.status]}</td>
          <td>{ticket.printer_num}</td>
          <td>{new Date(ticket.created_on).toLocaleDateString()}</td>
          <td>
            {ticket.name && ticket.name[0] ? ticket.name[0] : "Unassigned"}
          </td>
          {currentUser.type > 2 ? (
            <>
              <DropdownPrimary
                listOfValues={techs}
                selected={
                  ticket.name[1] != null ? ticket.name[1] : "Unassigned"
                }
                onSelect={onAssignment}
              />
            </>
          ) : (
            <td>
              {ticket.name && ticket.name[1] ? ticket.name[1] : "Nobody Yet"}
            </td>
          )}
          <td>
            {ticket.type == 1
              ? "Toner"
              : "Service"}
          </td>
          <td>
            {ticket.description
              ? ticket.description
              : "No description provided."}
          </td>
        </tr>
      ) : (
        <>
          <tr key={index} className="expanded-row" onClick={handleClick}>
            <td colSpan="8">
              <div className="ticket-expanded-content">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Ticket Information</h6>
                    <p>
                      <strong>Ticket Number:</strong> {ticket.ticket_num}
                    </p>
                    <p>
                      <strong>Status:</strong> {status[ticket.status]}
                    </p>
                    <p>
                      <strong>Printer Number:</strong> {ticket.printer_num}
                    </p>
                    <p>
                      <strong>Created On:</strong>{" "}
                      {new Date(ticket.created_on).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Assigned Technician:</strong>{" "}
                      {ticket.name && ticket.name[1]
                        ? ticket.name[1]
                        : "Nobody Yet"}
                    </p>
                    <p>
                      <strong>Assigned Date:</strong>{" "}
                      {ticket.assigned_date
                        ? new Date(ticket.assigned_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {ticket.description
                        ? ticket.description
                        : "No description provided."}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Additional Details</h6>
                    <p>
                      <strong>Priority:</strong> {ticket.priority || "Normal"}
                    </p>
                    {ticket.hasOwnProperty("comments") ? (
                      <p>
                        <strong>Comments:</strong>
                        <ul>
                          {ticket.comments && ticket.comments.length > 0 ? (
                            ticket.comments.map((comment, i) => (
                              <li key={i}>{comment.content}</li>
                            ))
                          ) : (
                            <li>No comments available</li>
                          )}
                        </ul>
                      </p>
                    ) : (
                      <></>
                    )}
                      <label htmlFor={`add-comment-${ticket.ticket_num}`}>
                        <strong>Add Comment:</strong>
                      </label>
                      <div className="input-group mt-2">
                        <input
                          type="text"
                          id={`add-comment-${ticket.ticket_num}`}
                          className="form-control"
                          placeholder="Enter your comment here"
                          value={commentContent}
                          onChange={handleCommentChange}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={(e) =>
                            handleCommentSubmit(
                              ticket.ticket_num,
                              commentContent,
                              e
                            )
                          }
                        >
                          Submit
                        </button>
                      </div>
                  </div>
                </div>
                {currentUser.type > 2 ? (
                  <div className="row">
                    <div className="col-md-6">
                      <DropdownPrimary
                        listOfValues={techs}
                        selected={
                          ticket.name && ticket.name[1] != null
                            ? ticket.name[1]
                            : "Unassigned"
                        }
                        onSelect={onAssignment}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {currentUser.type > 2 ? (
                <>
                  <hr />
                  <div className="row">
                    <div className="col">
                      {ticket.status < 3 ? (
                        <button
                          className="btn btn-primary"
                          onClick={(e) => setInProgress(ticket, e)}
                        >
                          Set as In-Progress
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="col"></div>
                    <div className="col">
                      {currentUser.type > 2 ? (
                        ticket.status == 3 || currentUser.type == 4 ? (
                          <Popup
                            trigger={
                              <button className="btn btn-primary">
                                {" "}
                                Close
                              </button>
                            }
                            position="right center"
                          >
                            <div>
                              <h4>Please enter a closing comment</h4>
                              <form>
                                <input
                                  type="text"
                                  name="inputBox"
                                  placeholder="Enter Closing Comment"
                                  className="form-control mb-2"
                                  value={closeTicketContent}
                                  onChange={handleCloseTicketContentChange}
                                />
                                <button
                                  className="btn btn-primary"
                                  onClick={(e) =>
                                    closeTicket(ticket, closeTicketContent, e)
                                  }
                                >
                                  Close
                                </button>
                              </form>
                            </div>
                          </Popup>
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </td>
          </tr>
        </>
      )}
    </>
  );} catch (err) {
    console.log(err)
  }
};
