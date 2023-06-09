const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const clientEMail = process.env.client_email;
const privateKey = process.env.private_key.replace(/\\n/g, "\n");
const spreadSheetId = process.env.spreadsheetid;

let jwtClient = new google.auth.JWT(clientEMail, null, privateKey, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

//authenticate request
jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log("error loh");
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

const getDataFromSheet = async (spreadsheetId, range)  => {
    try {
      // Authenticate and authorize the client
      await jwtClient.authorize();
  
      // Create Google Sheets API instance
      const sheets = google.sheets({ version: 'v4', auth: jwtClient });
  
      // Make API request to get data
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
  
      return response.data.values;
    } catch (error) {
      console.error('Error reading spreadsheet data:', error);
      throw error;
    }
  }
  

const main = async () => {
  const data = await getDataFromSheet(spreadSheetId, "Sheet1!A1");
  const text = data.toString()
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello :(", // Subject line
    text: text,
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
module.exports = main;
