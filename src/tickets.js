const fetch = require('node-fetch');

const { initSessionGLPI } = require('./auth');

module.exports = {
  async solvedTickets() {
    const session_token = await initSessionGLPI();

    // --- RESTRIÇÕES DE BUSCA -- //
    // --  3 dias atrás da data atual  -- //
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 3);
    const day = String(('0' + currentDate.getDate()).slice(-2));
    const month = String(('0' + (currentDate.getMonth() + 1)).slice(-2));
    const year = String(currentDate.getFullYear());
    // -------------------------- //

    try {
      const solved_tickets = await fetch(
        `${process.env.GLPI_URL}/apirest.php/search/Ticket?criteria%5B0%5D%5Bfield%5D=12&criteria%5B0%5D%5Bsearchtype%5D=equals&criteria%5B0%5D%5Bvalue%5D=5&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=15&criteria%5B1%5D%5Bsearchtype%5D=lessthan&_select_criteria%5B1%5D%5Bvalue%5D=0&criteria%5B1%5D%5Bvalue%5D=${year}-${month}-${day}+00%3A00%3A00&range=0-1000`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Session-Token': session_token,
          },
        }
      );

      const { data, count } = await solved_tickets.json();

      if (count === 0) {
        return [];
      }

      const promise = data.map(async (item) => {
        const response = await fetch(
          `${process.env.GLPI_URL}/apirest.php/User/${item['4']}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Session-Token': session_token,
            },
          }
        );

        const user = await response.json();
        return { username: user.name, protocolo: item['2'] };
      });

      return Promise.all(promise).then((tickets) => tickets);
    } catch (err) {
      console.log(err);
    }
  },
};
