const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const dotenv = require('dotenv').config()

const app = express();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.get('/success', function (req, res) {
  res.sendFile(__dirname + '/success.html');
})

app.get('/failure', function (req, res) {
  res.sendFile(__dirname + '/failure.html');
})

app.post('/failure', function (req, res) {
  res.redirect('/');
})

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  var members = {
    members: [{
  email_address: email,
  status: 'subscribed',
  merge_fields: {
    FNAME: firstName,
    EMAIL: email,
  }
}]};

  members = JSON.stringify(members);

  console.log(members);

  const options = {
    auth: process.env.chimpAuth,
    host: process.env.chimpHost,
    path: process.env.chimpPath,
    method: 'POST',
    headers: {
        'Content-Length': members.length
    }
};

  const request = https.request(options, function(response) {
    console.log('statusCode:', response.statusCode);
    console.log('headers:', response.headers);

    response.on('data', function(data) {
      const jsonData = JSON.parse(data);
      console.log(jsonData);
      if (jsonData.error_count === 0) {
        res.redirect('/success');
      }
      else {
        res.redirect('/failure');
      }
    });
  });

  request.write(members);
  request.end();
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Server is listening on port 3k');
});

