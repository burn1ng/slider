importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: '382954170103'
});

const messaging = firebase.messaging();
