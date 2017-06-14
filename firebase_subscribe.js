firebase.initializeApp({
    messagingSenderId: '382954170103'
});

// check browser, if any support of notifications
if ('Notification' in window) {
    var messaging = firebase.messaging();

    // user have already accept receiving of notifications,
    // subscribe user for notifications
    if (Notification.permission === 'granted') {
        subscribe();
    }

    // ask for permission and subscribe user by onClick on subscribe-button
    $('#subscribe').on('click', function () {
        subscribe();
    });
}

function subscribe() {
    // ask for permission
    messaging.requestPermission()
        .then(function () {
            // get ID of device
            messaging.getToken()
                .then(function (currentToken) {
                    console.log(currentToken);

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.warn('Не удалось получить токен.');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function (err) {
                    console.warn('При получении токена произошла ошибка.', err);
                    setTokenSentToServer(false);
                });
    })
    .catch(function (err) {
        console.warn('Не удалось получить разрешение на показ уведомлений.', err);
    });
}

// send ID of device to server
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Отправка токена на сервер...');

        var url = ''; // url of script, which save ID of device
        $.post(url, {
            token: currentToken
        });

        setTokenSentToServer(currentToken);
    } else {
        console.log('Токен уже отправлен на сервер.');
    }
}

// use localStorage for subscribe-check of current user
function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}