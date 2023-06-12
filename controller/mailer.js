const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const clientEMail = process.env.client_email;
const privateKey = process.env.private_key.replace(/\\n/g, "\n");
const spreadsheetId = process.env.spreadsheetid;

let jwtClient = new google.auth.JWT(clientEMail, null, privateKey, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

const addData = async ([username, email, phone, description, range]) => {
  try {
    // Authenticate and authorize the client
    await jwtClient.authorize();
    const data = [username, email, phone, description]

    // Create Google Sheets API instance
    const sheets = google.sheets({ version: "v4", auth: jwtClient });
    const request = {
      spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [data],
      },
    };

    // Make API request to post data
    const response = await sheets.spreadsheets.values.append(request);
    console.log(
      "New row added successfully:",
      response.data.updates.updatedRange
    );
  } catch (error) {
    console.error("Error reading spreadsheet data:", error);
    throw error;
  }
};

const addBookSession = async (req, res) => {
  const { username, email, phone, why } = req.body;

  const setParams = [username, email, phone, why, "Sheet1!A1"]
  const data = await addData(setParams);

  const text = `${username} book a session! contact them right away on ${email} or ${phone}. \n reason: ${why}`

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
    subject: "New Session Book!", // Subject line
    text: text,
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  res.send(`success! new data saved`)
};

const addTutorRegistration = async (req, res) => {
    const { username, email, phone, tell } = req.body;

    const setParams = [username, email, phone, tell, "Sheet2!A1"]
    const data = await addData(setParams);
  
    const text = `${username} book a session! contact them right away on ${email} or ${phone}. \n reason: ${tell}`
  
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
      subject: "New Session Book!", // Subject line
      text: text,
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.send(`success! new data saved`)

}
module.exports = {addBookSession, addTutorRegistration};
