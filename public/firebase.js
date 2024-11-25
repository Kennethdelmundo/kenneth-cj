// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDd8VEzRTWl_8OHu74xr44Nkyhxa8TDrV4",
    authDomain: "step-powered.firebaseapp.com",
    databaseURL: "https://step-powered-default-rtdb.firebaseio.com",
    projectId: "step-powered",
    storageBucket: "step-powered.appspot.com",
    messagingSenderId: "657696685745",
    appId: "1:657696685745:web:637a1807c3e14a3de1ac90",
    measurementId: "G-C3CKHKHX38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the Firebase Realtime Database location
const dbRef = ref(database);

// Listen for real-time updates
onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Real-time Update:", data); // Debugging

        // Update UI elements
        const percentage = data["Percentage"] || "No data";
        document.getElementById("percentage").textContent = percentage + "%";
        
        // Update battery fill based on percentage
        const batteryFill = document.getElementById("batteryFill");
        batteryFill.style.width = percentage + "%";
        
        // Change battery fill color based on percentage
        if (percentage < 20) {
            batteryFill.style.backgroundColor = "red"; // Red color for low battery
        } else {
            batteryFill.style.backgroundColor = "green"; // Green color for sufficient battery
        }

        const count = data["Count"] || "No data";
        document.getElementById("count").textContent = count;
        
    } else {
        console.error("No data found in the database.");
        alert("No data available in the database.");
    }
}, (error) => {
    console.error("Error listening for real-time updates:", error);
    alert("An error occurred while listening for updates. Check the console for details.");
});
