// firebase.js

// Firebase configuration
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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Reference to the Firebase Realtime Database location
const dbRef = database.ref();

// Fetch data and display it
dbRef.once("value", (snapshot) => {
    const data = snapshot.val();

    document.getElementById("first-stepper").textContent = data["1stStepper"] || "No data";
    document.getElementById("second-stepper").textContent = data["2ndStepper"] || "No data";
    document.getElementById("count").textContent = data["Count"] || "No data";
    document.getElementById("percentage").textContent = data["Percentage"] || "No data";
    document.getElementById("watts").textContent = data["Watts"] || "No data";
});
