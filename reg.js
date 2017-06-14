const webpush = require('web-push');

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for(let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const vapidPublicKey = 'BALLYbaDd_lLNS2yzsZXIGGlDRzUU0tnjfrfRIxXS7S_pXTrK8d9Y2Hn5oKAOOFshn5lLwOYHroR0gnczAo64fU'; //already generated
const vapidPrivateKey = '"privateKey": "rJKYXXg_NgkRDxLIRszjHSQNcFS1gg4MUCEeH0uIyqQ"'; //already generated


const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
});

//////////////////

// const pushSubscription = {
//     endpoint: '< Push Subscription URL >',
//     keys: {
//         p256dh: '< User Public Encryption Key >',
//         auth: '< User Auth Secret >'
//     }
// };

// const payload = '< Push Payload String >';

// const options = {
//     gcmAPIKey: 'AIzaSyDSIjXKI1H4z3325MGMwJkNpgBbw0BcaKo',
//     vapidDetails: {
//         subject: 'andrew.burn1ng@gmail.com',
//         publicKey: 'BALLYbaDd_lLNS2yzsZXIGGlDRzUU0tnjfrfRIxXS7S_pXTrK8d9Y2Hn5oKAOOFshn5lLwOYHroR0gnczAo64fU',
//         privateKey: 'rJKYXXg_NgkRDxLIRszjHSQNcFS1gg4MUCEeH0uIyqQ'
//     },
//     TTL: 60,
//     headers: {
//         'myTestHeader': 'myTestHeaderValue'
//     }
// }

// webpush.sendNotification(
//     pushSubscription,
//     payload,
//     options
// );
