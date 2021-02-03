const fetch = require('node-fetch');

const { initSessionGLPI } = require('./auth');

module.exports = {
  async solvedTickets() {
    const session_token = await initSessionGLPI();

    const solved_tickets = await fetch(
      `${process.env.GLPI_URL}/apirest.php/search/Ticket?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=12&criteria%5B0%5D%5Bsearchtype%5D=equals&criteria%5B0%5D%5Bvalue%5D=5&search=Pesquisar&itemtype=Ticket&start=0`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Session-Token': session_token,
        },
      }
    );

    const { data } = await solved_tickets.json();

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
  },
};
