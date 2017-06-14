let express = require("express");
let bodyParser = require('body-parser');
var request = require('request');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function(req, res) {
    let tokenId = req.body['token'];

    console.log("tokenId received: " + tokenId);

    // Set the headers
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAAWSnY5vc:APA91bF8pG_9W8I9U8xWsAQU_YQ_PlIAifSBxn4gmnvqk5wTd4tVZvhQukWBQ674W02QQNhrYonMD7ucstBtD3JImGM6DmZ9l5-T9WGPZlS_ON15PLOLmmmpGnU_IhF-HqYCyEhKiGVT'
    }

    // Configure the request
    var options = {
            url: 'https://fcm.googleapis.com/fcm/send',
            method: 'POST',
            headers: headers,
            form: {
                "notification": {
                    "title": "Ералаш",
                    "body": "Начало в 21:00",
                    "icon": "https://eralash.ru.rsz.io/sites/all/themes/eralash_v5/logo.png?width=40&height=40",
                    "click_action": "http://eralash.ru/"
                },
                "to": tokenId
            }
        }
        // Start the request
    request(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);
        }
    })

    res.send('tokenId received!');
});

let PORT = process.env.PORT || 3005;
app.listen(PORT, function() {
    console.log(`push_server listening on port ${PORT}!`)
});
