import Table from "react-bootstrap/Table";
import DropdownPrimary from "../dropdowns/DropdownPrimary";

import { useState } from "react";

export const TicketRow = ({
  ticket,
  index,
  currentUser,
  techs,
  onAssignment,
  getComments,
  handleCommentSubmit
}) => {
  const status = {
    1: "Open",
    2: "Assigned",
    3: "In-Progress",
    4: "Closed",
  };

  const [selected, setSelected] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const handleCommentChange = (e) => {
    e.stopPropagation();
    setCommentContent(e.target.value);
  }



  const handleClick = (e) => {
    setSelected(!selected);
    getComments(e);
  };

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
            {ticket.assigned_date
              ? new Date(ticket.assigned_date).toLocaleDateString()
              : "N/A"}
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
                    <p>
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
                          onClick={(e) => handleCommentSubmit(ticket.ticket_num, commentContent, e)}
                        >
                          Submit
                        </button>
                      </div>
                    </p>
                  </div>
                </div>
                {currentUser.type > 2 && (
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
                )}
              </div>
            </td>
          </tr>
        </>
      )}
    </>
  );
};
