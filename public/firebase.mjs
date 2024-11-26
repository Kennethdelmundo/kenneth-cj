// Import Firebase and File System modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import fs from "fs";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd8VEzRTWl_8OHu74xr44Nkyhxa8TDrV4",
  authDomain: "step-powered.firebaseapp.com",
  databaseURL: "https://step-powered-default-rtdb.firebaseio.com",
  projectId: "step-powered",
  storageBucket: "step-powered.firebasestorage.app",
  messagingSenderId: "657696685745",
  appId: "1:657696685745:web:637a1807c3e14a3de1ac90",
  measurementId: "G-C3CKHKHX38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the "Percentage" data in RTDB
const percentageRef = ref(database, "Percentage");

// Path to the JSON file
const filePath = "./battery.json"; // Adjust the path as needed

// Listen for changes in the "Percentage" value
onValue(percentageRef, (snapshot) => {
  const percentage = snapshot.val();
  console.log("New Percentage Value from RTDB:", percentage);

  // Read the existing data in the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    let jsonData = [];

    if (!err && data) {
      try {
        jsonData = JSON.parse(data); // Parse existing data into an array
        if (!Array.isArray(jsonData)) {
          jsonData = []; // If not an array, reset it
        }
      } catch (parseErr) {
        console.error("Error parsing JSON, resetting data:", parseErr);
        jsonData = []; // Reset to empty on parse error
      }
    } else if (err && err.code === "ENOENT") {
      console.log("File does not exist, starting fresh.");
    } else if (err) {
      console.error("Error reading the file:", err);
      return; // Exit if there is another unexpected error
    }

    // Append the new percentage with a timestamp
    const newEntry = {
      percentage: percentage,
      updatedAt: new Date().toISOString(),
    };

    jsonData.push(newEntry);

    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing to battery.json:", writeErr);
      } else {
        console.log("New entry added to battery.json:", newEntry);
      }
    });
  });
});
