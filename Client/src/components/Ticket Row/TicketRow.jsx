import Table from "react-bootstrap/Table";

export const TicketRow = ({ ticket, index }) => {
  return (
    <>
      <tr key={index}>
        <td>{ticket.ticket_num}</td>
        <td>{ticket.status === 1 ? "Open" : "Closed"}</td>
        <td>{ticket.printer_num}</td>
        <td>{new Date(ticket.created_on).toLocaleDateString()}</td>
        <td>{ticket.name && ticket.name[0] ? ticket.name[0] : "Unassigned"}</td>
        <td>{ticket.name && ticket.name[1] ? ticket.name[1] : "Nobody Yet"}</td>
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
