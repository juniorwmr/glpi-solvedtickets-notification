require('dotenv').config();

const { sendMail } = require('./mail');
const { solvedTickets } = require('./tickets');

solvedTickets().then((tickets) => {
  let tickets_length = tickets.length;
  if (tickets_length === 0) {
    console.log('Não há chamados solucionados no momento.');
    return;
  }

  console.log(`Há ${tickets_length} chamados solucionados até o momento.`);
  tickets.forEach(({ username, protocolo }) => {
    if (username) {
      setTimeout(async () => {
        const response = await sendMail({
          username: 'ti.suporte9',
          protocolo,
        });
        console.log(response);
      }, 5000 * tickets_length);
    }
    tickets_length -= 1;
  });
});
