const nodemailer = require("nodemailer");
const { google } = require("googleapis");

require("dotenv").config();

const clientEmail = process.env.CLIENT_EMAIL;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const spreadsheetId = process.env.SPREADSHEET_ID;
const emailUsed = process.env.EMAIL_USED;
const emailPass = process.env.EMAIL_PASS;

const jwtClient = new google.auth.JWT(clientEmail, null, privateKey, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

const addData = async (values, range) => {
  try {
    // Authenticate and authorize the client
    await jwtClient.authorize();

    // Create Google Sheets API instance
    const sheets = google.sheets({ version: "v4", auth: jwtClient });

    const request = {
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [values],
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
    user: emailUsed,
    pass: emailPass,
  },
});

const addBookSession = async (req, res) => {
  const { username, email, phone, why } = req.body;
  const setParams = [username, email, phone, why];
  const range = "'tutor registration'!A1:A10";

  await addData(setParams, range);

  const text = `${username} booked a session! Contact them right away on ${email} or ${phone}.\nReason: ${why}`;

  let info = await transporter.sendMail({
    from: "info@learnhall.com",
    to: "mwhoeft@gmail.com",
    subject: "New Session Book!",
    text: text,
  });

  console.log("Message sent: %s", info.response);
  res.send("Success! New data saved.");
};

const addTutorRegistration = async (req, res) => {
  const { username, email, phone, tell } = req.body;
  const setParams = [username, email, phone, tell];
  const range = "'Sheet1'!A1";

  await addData(setParams, range);

  const text = `${username} is interested in becoming a tutor! Contact them right away on ${email} or ${phone}.\nReason: ${tell}`;

  let info = await transporter.sendMail({
    from: emailUsed,
    to: "mwhoeft@gmail.com",
    subject: "Someone Interested to be our Tutor!",
    text: text,
  });

  console.log("Message sent: %s", info.messageId);
  res.send("Success! New data saved.");
};

module.exports = { addBookSession, addTutorRegistration };
