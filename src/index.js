require('dotenv').config()

const { sendMail } = require('./mail');
const { solvedTickets } = require('./tickets');

async function init() {
  const solved_tickets = await solvedTickets();
  solved_tickets.forEach((ticket) => {
    sendMail({
      username: ticket.username,
      protocolo: ticket.protocolo,
    });
  });
}

init();
