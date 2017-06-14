const webpush = require('web-push');

// VAPID keys should only be generated only once. 
const vapidKeys = webpush.generateVAPIDKeys();

function setVapidDetails() {
    webpush.setGCMAPIKey('AIzaSyDSIjXKI1H4z3325MGMwJkNpgBbw0BcaKo');
    webpush.setVapidDetails(
        'mailto:andrew.burn1ng@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
}

exports.setVapidDetails = setVapidDetails;
// This is the same output of calling JSON.stringify on a PushSubscription 
// const pushSubscription = {
//   endpoint: '.....',
//   keys: {
//     auth: '.....',
//     p256dh: '.....'
//   }
// };

// webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
