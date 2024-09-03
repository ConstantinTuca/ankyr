exports.createTransport = config => {
	let nodemailer = require('nodemailer');
      return nodemailer.createTransport({
        host: 'mail.yourcatalog.ro',
        port: 465,
        secure: true,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: 'office@yourcatalog.ro',
          pass: '#DLE4LZ8gwfU'
        }
    });
};
