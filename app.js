const express = require("express");
const bodyParser = require("body-parser");
const https = require('node:https');

const app = express();

const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
  })

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log(firstName, lastName, email)

    const data = {
        members: [
            {
               email_address: email,
               status: "subscribed",
               merge_fields: {
                FNAME: firstName,
                LNAME: lastName
               }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    mailchimp.setConfig({
        apiKey: "aea25f9cc8d39879f28386e4a932b85a-us21",
        server: "us21",
      });

    const run = async () => {
        try {
            const response = await mailchimp.lists.batchListMembers("a259290dac", jsonData);
            console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
            res.sendFile(__dirname + "/success.html");
        } 
        catch (e) {
            res.sendFile(__dirname + "/failure.html");
        }
    }
      
      run();

//     const url = "https://us21.api.mailchimp.com/3.0/lists/a259290dac";
//     const options = {
//         method: "POST",
//         auth: "artur:aea25f9cc8d39879f28386e4a932b85a-us21"
//     }

//    const request = https.request(url, options, (res) => {
//         res.on("data", (data) => {
//             console.log(JSON.parse(data));
//         })
//     })
//     request.write(jsonData);
//     request.end();

})


app.post('/success', (req, res) => {
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is fine. Running on port X3")
})


// API Key
// aea25f9cc8d39879f28386e4a932b85a-us21

// List Id
// a259290dac
