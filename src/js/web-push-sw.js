self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'The big hello to unitedTeam!';
    const options = {
        body: '( ͡° ͜ʖ ͡°) Hi, my web-push messages works!',
        icon: '../img/sw-icon-192x192.png',
        badge: '../img/sw-badge-192x192.png',
        //image: '../img/sw-image-1350x.jpg',
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
        actions: [
            {
                action: 'email',
                title: 'Get in touch',
                icon: '../img/envelope.png'
            },
            {
                action: 'linkedIn',
                title: 'Look at linkedIn',
                icon: '../img/linkedin.png'
            }
        ]

    };

    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
    console.log(event);
    console.dir(event);
    if(event.action === "") {
        // An empty string means the notification body was clicked (no action button was clicked)
        // Keep in mind action buttons are only supported on Chrome 48+ so some users will only be able 
        // to click the notification body
        event.waitUntil(
            clients.openWindow('http://unitedtm.by/')
        );
    } else if(event.action === 'email') {
        event.waitUntil(
            clients.openWindow('http://andreidushkou.tech/#contact')
        );
    } else if(event.action === 'linkedIn') {
        event.waitUntil(
            clients.openWindow('https://www.linkedin.com/in/andreidushkou/')
        );
    }

    event.notification.close();
});
