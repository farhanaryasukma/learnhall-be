const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const clientEMail = process.env.client_email;
const privateKey = process.env.private_key.replace(/\\n/g, "\n");
const spreadsheetId = process.env.spreadsheetid;
const emailUsed = process.env.emailUsed
const emailPass = process.env.emailpass

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

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: emailUsed, // generated ethereal user
      pass: emailPass, // generated ethereal password
    },
  });

const addBookSession = async (req, res) => {
  const { username, email, phone, why } = req.body;

  const setParams = [username, email, phone, why, "Sheet1!A1"]
  const data = await addData(setParams);

  const text = `${username} book a session! contact them right away on ${email} or ${phone}. \n reason: ${why}`

  let info = await transporter.sendMail({
    from: '"farhan.arya.work@gmail.com', // sender address
    to: "farhan.arya.sukma@gmail.com", // list of receivers
    subject: "New Session Book!", // Subject line
    text: text, //email content
  });
  console.log("Message sent: %s", info.response);

  res.send(`success! new data saved`)
};

const addTutorRegistration = async (req, res) => {
    const { username, email, phone, tell } = req.body;

    const setParams = [username, email, phone, tell, "Sheet2!A1"]
    const data = await addData(setParams);
  
    const text = `${username} is interested to become a tutor! contact them right away on ${email} or ${phone}. \n reason: ${tell}`
  
    let info = await transporter.sendMail({
      from: '"farhan.arya.work@gmail.com', // sender address
      to: "farhan.arya.sukma@gmail.com", // list of receivers
      subject: "Someone Interested to be our Tutor!", // Subject line
      text: text,
    });

    console.log("Message sent: %s", info.messageId);
  
    res.send(`success! new data saved`)

}
module.exports = {addBookSession, addTutorRegistration};
