// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
 // 'messagingSenderId': '978592735167'
  'messagingSenderId': '108721153152'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  
  const notificationTitle = 'MEDePAL';
  const notificationOptions = {
    body: payload.data.msg,
    icon: 'http://devsbis.co.in/assets/image/logo-email.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});