'use strict';

const applicationServerPublicKey = 'BALLYbaDd_lLNS2yzsZXIGGlDRzUU0tnjfrfRIxXS7S_pXTrK8d9Y2Hn5oKAOOFshn5lLwOYHroR0gnczAo64fU';
var pushButton = document.getElementById("pushButton");

let isSubscribed = false;
let swRegistration = null;

function Base64EncodeUrl(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function urlB64ToUint8Array(base64String) {
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

if('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('js/web-push-sw.js')
        .then(function(swReg) {
            console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
            initialiseUI();
        })
        .catch(function(error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
    pushButton.remove(); //remove button if push is not supported in browser
}

function initialiseUI() {
    pushButton.addEventListener('click', function() {
        pushButton.disabled = true;
        if(isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });
    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            if(isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            updateBtn();

        });
}

function updateBtn() {
    if(isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
    } else {
        pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
            console.log('User is subscribed.');

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server

    if(subscription) {
        // var subscriptionJson = document.querySelector('.js-subscription-json');
        // var subscriptionDetails = document.querySelector('.js-subscription-details');

        // var endpointNode = document.getElementById('endpoint');
        // var keyNode = document.getElementById('p256dh');
        // var authNode = document.getElementById('auth');

        // subscriptionJson.textContent = JSON.stringify(subscription);
        // endpointNode.textContent = subscription.endpoint;

        // // i'm checking, if subscription.getKey works in browser. 
        // var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
        // var key = rawKey ? Base64EncodeUrl(btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)))) : '';

        // var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
        // var authSecret = rawAuthSecret ? Base64EncodeUrl(btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret)))) : '';
        // keyNode.textContent = key;
        // authNode.textContent = authSecret;

        // console.log("key: " + key);
        // console.log("authSecret: " + authSecret);
        // console.log('endpoint:', subscription.endpoint);

        // subscriptionJson.classList.remove('is-invisible');
        // subscriptionDetails.classList.remove('is-invisible');
    } else {
        // subscriptionJson.classList.add('is-invisible');
        // subscriptionDetails.classList.add('is-invisible');
    }
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            if(subscription) {
                // TODO: Tell application server to delete subscription
                return subscription.unsubscribe();
            }
        })
        .catch(function(error) {
            console.log('Error unsubscribing', error);
        })
        .then(function() {
            updateSubscriptionOnServer(null);

            console.log('User is unsubscribed.');
            isSubscribed = false;

            updateBtn();
        });
}

const title1 = 'The big hello to unitedTeam!';
const options1 = {
    body: '( ͡° ͜ʖ ͡°) Hi, my web-push messages works!',
    icon: 'img/sw-icon-192x192.png',
    badge: 'img/sw-badge-72x72.png',
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
    actions: [
        {
            action: 'email',
            title: 'Get in touch',
            icon: 'img/envelope.png'
            },
        {
            action: 'linkedIn',
            title: 'Look at linkedIn',
            icon: 'img/linkedin.png'
            }
        ]

};

var target = document.querySelectorAll('.slider__pager, .slider__pagination');

for(var i = 0; i < target.length; i++) {
    target[i].addEventListener('click', function(event) {
        if(isSubscribed) {
            swRegistration.showNotification(title1, options1);
        }
    });
}
