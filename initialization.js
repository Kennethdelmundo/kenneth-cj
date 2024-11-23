const firebaseConfig = {
    apiKey: "AIzaSyDd8VEzRTWl_8OHu74xr44Nkyhxa8TDrV4",
    authDomain: "step-powered.firebaseapp.com",
    databaseURL: "https://step-powered-default-rtdb.firebaseio.com",
    projectId: "step-powered",
    storageBucket: "step-powered.firebasestorage.app",
    messagingSenderId: "657696685745",
    appId: "1:657696685745:web:637a1807c3e14a3de1ac90",
    measurementId: "G-C3CKHKHX38"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);