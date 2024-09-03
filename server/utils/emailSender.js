module.exports = smtpTransportYour => {
  'use strict';

  let htmlTop = `<div width="100%" height="100%" style="height:100%;margin:0;padding:0;width:100%">
  <table
    style="border-collapse:separate;width:100%;min-width:100%;font-size:14px;font-family:Arial,'times new roman',times,serif;background-color:rgb(225,227,226);padding:40px 0px"
    width="100%" cellpadding="0" cellspacing="0">
    <tbody>
      <tr>
        <td>
          <center>
            <table
              style="width:100%;margin:0px auto;float:none;border:0px none rgb(255,255,255);max-width:680px;background-color:rgb(255,255,255)"
              align="center" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td>
                    <table
                      style="padding:15px 20px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table"
                      cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <td>
                            <table
                              style="margin:0px auto;float:left;border:0px none rgb(255,255,255);padding:0px;max-width:67px"
                              align="left" cellpadding="0" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td>
                                    <a style="text-decoration:none; font-size: 34px; font-weight: bold;"><span style="color: #226e36; font-size: 34px;">Your</span><span style="color: #000000; font-size: 34px;">Catalog</span></a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0"
                      style="padding:0px 10px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table">
                      <tbody>
                        <tr>
                          <td>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                              style="min-width:100%;max-width:100%;width:100%;min-height:1px">
                              <tbody>
                                <tr>
                                  <td
                                    style="height:1px;width:100%;min-width:100%;line-height:1px;font-size:1px;background-color:rgb(164,164,164)">
                                    <br>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style="padding:13px 20px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table"
                      cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <td>
                            <table
                              style="width:100%;min-width:100%;border:0px none rgb(255,255,255);padding:0px;word-break:break-word;background-color:transparent;font-size:14px;font-family:'times new roman',times,serif"
                              cellpadding="0" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td>
                                    <div>`;
  let htmlBottom = `</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0"
                      style="padding:13px 10px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table">
                      <tbody>
                        <tr>
                          <td>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%"
                              style="min-width:100%;max-width:100%;width:100%;min-height:1px">
                              <tbody>
                                <tr>
                                  <td
                                    style="height:1px;width:100%;min-width:100%;line-height:1px;font-size:1px;background-color:rgb(164,164,164)">
                                    <br>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style="padding:15px 20px;background-color:transparent;width:100%;border:0px none rgb(255,255,255);min-width:100%;text-align:left;display:table"
                      cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <td>
                            <table
                              style="width:100%;min-width:100%;border:0px none rgb(255,255,255);padding:0px;word-break:break-word;background-color:transparent;font-size:14px;font-family:'times new roman',times,serif"
                              cellpadding="0" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td>
                                    <div>
                                      <span style="font-size:12px"><span
                                          style="font-family:arial,helvetica,sans-serif;color:black !important">&copy; yourCatalog. Toate drepturile
                                          rezervate.<br>
                                          <br>
                                          Acesta este un email generat automat. Te rugăm să nu răspunzi la acest
                                          email.</span></span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </td>
      </tr>
    </tbody>
  </table>
</div>`;

  function getHtmlLoginKey(person_name, auth_code, auth_code_simple) {
    return `<span style="line-height:1.5">
      <span style="font-size:16px">
        <div style="margin-bottom: 15px;">Bună <b>${person_name}</b></div>
        <div style="margin-bottom: 15px; color:#000000 !important; text-indent: 25px;">Primiți acest email pentru că a fost creat un nou utilizator cu emailul dumneavoastră în platforma <a href="https://www.yourcatalog.ro"><b><span style="color: #226e36;">Your</span><span style="color: #000000;">Catalog</span></b></a>.</div>
        <div style="margin-bottom: 30px; color:#000000 !important">Accesați acest link pentru crearea contului:</div>
        <div style="margin-bottom: 30px; text-align: center;">
          <a href="https://www.yourcatalog.ro/account/signup/${auth_code}" style="position: relative; background: #ffffff; border-radius: 5px; color: #226e36; font-size: 16px; 
          letter-spacing: 1px; padding: 15px 20px;min-width: 230px; border-top: 1px solid #CCCCCC;
          border-right: 1px solid #333333;
          border-bottom: 1px solid #333333;
          border-left: 1px solid #CCCCCC;">Înregistrează contul</a>
        </div>
        <div>Dacă nu vizualizați acest email corect vă rog să introduceți acest cod: </div> <div>${auth_code_simple}</div> <div>în platforma YourCatalog la linkul https://www.yourcatalog.ro/ la secțiunea înregistrare cont nou.</div>
      </span>
    </span>`;
  }

  function getHtmlForgotPassword(access_token) {
    return `
    <span style="line-height:1.5">
      <span style="font-size:16px">
        <div style="margin-bottom: 30px; color:#000000 !important">Accesați acest link pentru resetarea parolei:</div>
        <div style="text-align: center;">
          <a href="https://www.yourcatalog.ro/account/password-reset/${access_token}" style="position: relative; background: #ffffff; border-radius: 5px; color: #226e36; font-size: 16px; 
          letter-spacing: 1px; padding: 15px 20px;min-width: 230px; border-top: 1px solid #CCCCCC;
          border-right: 1px solid #333333;
          border-bottom: 1px solid #333333;
          border-left: 1px solid #CCCCCC;">Resetează parola</a>
        </div>
      </span>
    </span>
    `;
  }

  function getHtmlSituation(student_name) {
    return `
    <span style="line-height:1.5">
      <span style="font-size:16px">
        <div style="margin-bottom: 30px; color:#000000 !important">Aveți informații noi în carnetul elevului <b>${student_name}</b> </div>
        <div style="margin-bottom: 30px; color:#000000 !important">Accesați acest link pentru vizualizare</b>: </div>
        <div style="text-align: center;">
          <a href="https://www.yourcatalog.ro/" style="position: relative; background: #ffffff; border-radius: 5px; color: #226e36; font-size: 16px; 
          letter-spacing: 1px; padding: 15px 20px;min-width: 230px; border-top: 1px solid #CCCCCC;
          border-right: 1px solid #333333;
          border-bottom: 1px solid #333333;
          border-left: 1px solid #CCCCCC;">Conectare</a>
        </div>
      </span>
    </span>
    `;
  }

  return {
    sendMail: (unitate, cui, email, pass, resetPass) => {
      if (config.env === 'production' && email) {
        let mailOptions = {
          from: 'Catalog electronic <catalog@yourconsulting.ro>',
          to: [email, 'development.yourconsulting@gmail.com', 'costi.tuca@gmail.com'],
          subject: 'ConstantinTuca - Catalog electronic',
          html: getHtmlBody(unitate, cui, email, pass, resetPass)
        };
        smtpTransportYour.sendMail(mailOptions, (error) => {
          if (error) {
            console.error('Email send err: ', error);
          } else {
            console.info('Email send YC!! ');
          }
        });
      } else {
        return null;
      }
    },

    sendMailErr: text => {
      if (config.env === 'production') {
        let mailOptions = {
          from: 'Catalog electronic <catalog@yourconsulting.ro>',
          to: ['development.yourconsulting@gmail.com', 'costi.tuca@gmail.com', 'laurentiu.vizitiu.c@gmail.com', 'ionut.o.morosanu@gmail.com'],
          subject: 'Eroare Catalog electronic',
          text: text
        };
        smtpTransportYour.sendMail(mailOptions, error => {
          if (error) {
            console.error('Email send err: ', error);
          } else {
            console.info('Email send YC!! ');
          }
        });
      } else {
        return null;
      }
    },

    sendMailContact: ({ subject, message, first_name, last_name, role, unit }) => {
      if (config.env === 'production') {
        let mailOptions = {
          from: 'Catalog electronic <catalog@yourconsulting.ro>',
          to: ['office.yourconsulting@gmail.com', 'development.yourconsulting@gmail.com'],
          subject: `Catalog electronic - Mesaj nou`,
          text: `
            Subiect: ${subject}
            Mesaj: ${message}

            ${first_name && last_name ? 'Nume: ' + first_name + ' ' + last_name : ''}
            ${role ? 'Rol: ' + role : ''}
            ${unit && unit.name ? 'Unitate: ' + unit.name : ''}
          `
        };
        smtpTransportYour.sendMail(mailOptions, error => {
          if (error) {
            console.error('Email send err: ', error);
          } else {
            console.info('Email send YC!! ');
          }
        });
      } else {
        return null;
      }
    },

    sendMailSituation: (student_name, emails) => {
      if(config.env === 'production' && emails.length) {
        let tmpHtml = getHtmlSituation(student_name);
        let mailOptions = {
          from: 'Catalog electronic <catalog@yourconsulting.ro>',
          to: emails,
          subject: `YourCatalog - Detalii noi în carnetul de elev`,
          html: htmlTop + tmpHtml + htmlBottom
        };
        smtpTransportYour.sendMail(mailOptions, error => {
          if (error) {
            console.error('Email send err: ', error);
          } else {
            console.info('Email send YC!! ');
          }
        });
      }
    },

    sendMailLoginKey: (options) => {
      let login_key = encodeURIComponent(options.login_key);
      let tmpHtml = getHtmlLoginKey(options.name_text, login_key, options.login_key);
      let mailOptions = {
        from: 'Catalog electronic <catalog@yourconsulting.ro>',
        to: [options.email],
        subject: `YourCatalog - Înregistrare cont nou`,
        html: htmlTop + tmpHtml + htmlBottom
      };
      smtpTransportYour.sendMail(mailOptions, error => {
        if (error) {
          console.error('Email send err: ', error);
        } else {
          console.info('Email send YC!! ');
        }
      });
    },

    sendMailLoginKeyAsync: (options) => new Promise(function (resolve, reject) {
      let login_key = encodeURIComponent(options.login_key);
      let tmpHtml = getHtmlLoginKey(options.name_text, login_key, options.login_key);
      let mailOptions = {
        from: 'Catalog electronic <catalog@yourconsulting.ro>',
        to: [options.email],
        subject: `YourCatalog - Înregistrare cont nou`,
        html: htmlTop + tmpHtml + htmlBottom
      };
      smtpTransportYour.sendMail(mailOptions, error => {
        if (error) {
          reject(error);
        } else {
          resolve('Email send YC!! ');
        }
      });
    }),

    sendMailResetPassword: (access_token, email) => {
      let token = encodeURIComponent(access_token);
      let tmpHtml = getHtmlForgotPassword(token);
      let mailOptions = {
        from: 'Catalog electronic <catalog@yourconsulting.ro>',
        to: [email],
        subject: `YourCatalog - Resetare parola`,
        html: htmlTop + tmpHtml + htmlBottom
      };
      smtpTransportYour.sendMail(mailOptions, error => {
        if (error) {
          console.error('Email send err: ', error);
        } else {
          console.info('Email send YC!! ');
        }
      });
    }
  };
};
