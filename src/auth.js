const fetch = require('node-fetch');

const userToken = `user_token ${process.env.GLPI_USER_TOKEN}`;

module.exports = {
  async initSessionGLPI() {
    const token = await fetch(
      `${process.env.GLPI_URL}/apirest.php/initSession`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
        },
      }
    )
      .then((response) => response.json())
      .then(({ session_token }) => session_token)
      .catch((err) => {
        console.log(err);
      });

    return token;
  },
};
