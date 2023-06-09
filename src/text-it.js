const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const accountSid = process.env.twilioAccountSid;
const authToken = process.env.twilioAuthToken;

// Configure body parse to read request body
app.use(bodyParser.urlencoded({ 
    extended: false 
}));
app.use(bodyParser.json());
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

// Check if twilio credentials are set
if (!accountSid || !authToken) {
    console.log('Failed to read twilio credentials from environment, exiting.');
    process.exit(1)
} else {
    console.log(`Will login as: ${accountSid}`);
}

// This is the content that will be rendered
const content = {
    title: 'Text-it',
    message: 'Text-IT',
    forms: [
        {
            title:'Send a message', 
            sender:'Sender', 
            recipient:'Recipient', 
            message:'Message'
        }]
};

function validateInput(input, message) {
    // Validate that the sender only contains digits, characters and is not longer than 15 characters
    if (input === 'sender' && !message.match(/^\+?[a-zA-Z0-9]{1,15}$/)) {
        console.log(`Invalid sender: ${message}`);
        return false;
    }

    // Validate that the recipient is a valid phone number
    if (input === 'recipient' && !message.match(/^\+?[1-9]\d{1,14}$/)) {
        console.log(`Invalid recipient: ${message}`);
        return false;
    }

    // Validate that the message is not empty and not longer than 160 characters
    if (input === 'text_message' && (!message || message.length > 160)) {
        console.log(`Invalid text_message: ${message}`);
        return false;
    }
    return true;
}

// Render the index page
app.get('/', (req, res) => {
    res.status(200);
    res.send(nunjucks.render('index.html', content));
});

// Retrieve the form data and send the message to twilio
app.post('/send', (req, res) => {
    for (var key in req.body) {
        if (!validateInput(key, req.body[key])) {
            res.status(400);
            res.send(nunjucks.render('index.html', content));
            return;
        }
    }

    var sender = req.body.sender;
    var recipient = req.body.recipient;
    var text_message = req.body.text_message

    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body: text_message,
            to: recipient,
            from: sender
        })
        .then((message) => console.log(message));

    res.status(200);
    res.send(nunjucks.render('index.html', content));
});

// Start the server
app.listen(3000, () => {
    console.log('Listening on 3000');
});
