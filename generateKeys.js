const webpush = require('web-push');
var fs = require('fs');

// VAPID keys should only be generated only once. 
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setGCMAPIKey('AIzaSyDSIjXKI1H4z3325MGMwJkNpgBbw0BcaKo');
webpush.setVapidDetails(
    'mailto:andrew.burn1ng@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);


var outputJson = JSON.stringify(vapidKeys, null, "\t");

fs.writeFile("output.json", outputJson, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 




// This is the same output of calling JSON.stringify on a PushSubscription 
// const pushSubscription = {
//   endpoint: '.....',
//   keys: {
//     auth: '.....',
//     p256dh: '.....'
//   }
// };

// webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
