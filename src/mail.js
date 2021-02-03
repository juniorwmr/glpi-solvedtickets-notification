const nodemailer = require('nodemailer');

module.exports = {
  async sendMail({ protocolo, username }) {
    const mailerSettings = {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      tls: {
        ciphers: 'SSLv3',
      },
      auth: {
        user: process.env.MAIL_AUTH_EMAIL,
        pass: process.env.MAIL_AUTH_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(mailerSettings);

    var mailOptions = {
      from: process.env.MAIL_AUTH_EMAIL,
      to: `${username}@${process.env.COMPANY_DOMAIN}`, 
      subject: `[SUPORTE] - CHAMADO Nº ${protocolo}`, 
      html: `<div align="center"><div style="padding: 5px; height: 30px; width: 582px;" align="center"><a href="http://www.intranet.ac.sebrae.com.br/" target="_blank" rel="noopener"><img style="width: 219px; margin: -100px; border: 0px;" src="https://anprotec.org.br/site/wp-content/uploads/2020/06/sebrae-logo-1-1024x554.png" alt="Logo" height="118" /></a></div></div><br><br><br><br><br><p style="font-family: Sans-serif">Prezado(a),</br>informamos que o <strong>chamado com protocolo ${protocolo}</strong> encontra-se solucionado, <u style="background-color: #ffff80">aguardando apenas a sua aprovação</u> para ser encerrado.</p><p style="font-family: Sans-serif">Para aprovar o chamado, <a href="https://www.suporte.ac.sebrae.com.br/index.php?redirect=ticket_${protocolo}_Ticket$1&noAUTO=1" target="_blank" rel="noopener">clique aqui</a>.</p><br><p style="font-size: 14px;">Dúvidas? Fale com a gente pelo número 3216-2190 ou pelo ramal 2190.</p>`, // html body
    };

    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  },
};
