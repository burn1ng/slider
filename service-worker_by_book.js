if(!('serviceWorker' in navigator)) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    return;
}

if(!('PushManager' in window)) {
    // Push isn't supported on this browser, disable or hide UI.
    return;
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker_by_book.js')
        .then(function(registration) {
            console.log('Yes! My service worker successfully registered.');
            return registration;
        })
        .catch(function(err) {
            console.error('Oh no! Unable to register my service worker.', err);
        });
}

function askPermission() {
    return new Promise(function(resolve, reject) {
            const permissionResult = Notification.requestPermission(function(result) {
                resolve(result);
            });

            if(permissionResult) {
                permissionResult.then(resolve, reject);
            }
        })
        .then(function(permissionResult) {
            if(permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
}

function getNotificationPermissionState() {
    if(navigator.permissions) {
        return navigator.permissions.query({ name: 'notifications' })
            .then((result) => {
                return result.state;
            });
    }

    return new Promise((resolve) => {
        resolve(Notification.permission);
    });
}

function subscribeUserToPush() {
    return getSWRegistration()
        .then(function(registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    'BALLYbaDd_lLNS2yzsZXIGGlDRzUU0tnjfrfRIxXS7S_pXTrK8d9Y2Hn5oKAOOFshn5lLwOYHroR0gnczAo64fU'
                )
            };

            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function(pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            return pushSubscription;
        });
}

const subscriptionObject = {
    endpoint: pushSubscription.endpoint,
    keys: {
        p256dh: pushSubscription.getKeys('p256dh'),
        auth: pushSubscription.getKeys('auth')
    }
};
// The above is the same output as:
// const subscriptionObjectToo = JSON.stringify(pushSubscription);

function sendSubscriptionToBackEnd(subscription) {
    return fetch('/api/save-subscription/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        })
        .then(function(response) {
            if(!response.ok) {
                throw new Error('Bad status code from server.');
            }

            return response.json();
        })
        .then(function(responseData) {
            if(!(responseData.data && responseData.data.success)) {
                throw new Error('Bad response from server.');
            }
        });
}

app.post('/api/save-subscription/', function(req, res) {
    if(!isValidSaveRequest(req, res)) {
        return;
    }

    return saveSubscriptionToDatabase(req.body)
        .then(function(subscriptionId) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true } }));
        })
        .catch(function(err) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    id: 'unable-to-save-subscription',
                    message: 'The subscription was received but we were unable to save it to our database.'
                }
            }));
        });
});
