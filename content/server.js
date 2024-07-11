const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

// Twilio credentials
const accountSid = 'your_account_sid'; // Replace with your Twilio account SID
const authToken = 'your_auth_token'; // Replace with your Twilio auth token
const client = new twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
    
    const textMessage = `
        Name: ${name}
        Email: ${email ? email : 'Not provided'}
        Message: ${message}
    `;

    client.messages.create({
        body: textMessage,
        from: 'your_twilio_phone_number', // Replace with your Twilio phone number
        to: '+47 908 09 670' // Replace with the recipient's phone number
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));

    res.send('Message sent!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
