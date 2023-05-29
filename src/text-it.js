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
    message: 'Text it application',
    forms: [
        {
            title:'Send a message', 
            sender:'Sender', 
            recipient:'Recipient', 
            message:'Message'
        }]
};

app.get('/', (req, res) => {
    console.log(req.query)
    res.status(200);
    res.send(nunjucks.render('index.html', content));
});

// Retrieve the form data and send the message to twilio
app.post('/send', (req, res) => {
    var sender = req.body.sender;
    var recipient = req.body.recipient;
    var message = req.body.text_message
    console.log(req.body);
    res.status(200);
    res.send(nunjucks.render('index.html', content));
});


// Start the server
app.listen(3001, () => {
    console.log('Listening on 3001');
});

