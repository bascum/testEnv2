import Table from "react-bootstrap/Table";
import DropdownPrimary from "../dropdowns/DropdownPrimary";

export const TicketRow = ({
  ticket,
  index,
  currentUser,
  techs,
  onAssignment,
}) => {
  return (
    <>
      <tr key={index}>
        <td>{ticket.ticket_num}</td>
        <td>{ticket.status === 1 ? "Open" : "Closed"}</td>
        <td>{ticket.printer_num}</td>
        <td>{new Date(ticket.created_on).toLocaleDateString()}</td>
        <td>{ticket.name && ticket.name[0] ? ticket.name[0] : "Unassigned"}</td>
        {currentUser.type > 2 ? (
          <>
            <DropdownPrimary
              listOfValues={techs}
              selected={ticket.name[1] != null ? ticket.name[1] : "Unassigned"}
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
          {ticket.description ? ticket.description : "No description provided."}
        </td>
      </tr>
    </>
  );
};
