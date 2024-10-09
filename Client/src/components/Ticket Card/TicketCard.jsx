import React from "react";
import { Card } from "react-bootstrap";

export const TicketCard = ({ ticket }) => {
    return (
        <Card style={{ maxWidth: "300px", margin: "auto", height: '500px' }}>
            <Card.Header>Ticket #{ticket.ticket_num}</Card.Header>
            <Card.Body>
                <Card.Text>
                    <strong>Status:</strong> {ticket.status === 1 ? "Open" : "Closed"}
                </Card.Text>
                <Card.Text>
                    <strong>Printer Number:</strong> {ticket.printer_num}
                </Card.Text>
                <Card.Text>
                    <strong>Created On:</strong>{" "}
                    {new Date(ticket.created_on).toLocaleDateString()}
                </Card.Text>
                <Card.Text>
                    <strong>Created By:</strong>{" "}
                    {ticket.name && ticket.name[0] ? ticket.name[0] : "Unassigned"}
                </Card.Text>
                <Card.Text>
                    <strong>Assigned To:</strong>{" "}
                    {ticket.name && ticket.name[1] ? ticket.name[1] : "Nobody Yet"}
                </Card.Text>
                {ticket.assigned_date && (
                    <Card.Text>
                        <strong>Assigned Date:</strong>{" "}
                        {new Date(ticket.assigned_date).toLocaleDateString()}
                    </Card.Text>
                )}
                <Card.Text>
                    <strong>Description:</strong>{" "}
                    {ticket.description ? ticket.description : "No description provided."}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default TicketCard;
