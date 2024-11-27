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

// References to the data in RTDB
const percentageRef = ref(database, "Percentage");
const stepperRef = ref(database, "1stStepper");
const secondStepperRef = ref(database, "2ndStepper");
const countRef = ref(database, "Count");
const wattsRef = ref(database, "Watts");

// Paths to the JSON files
const batteryFilePath = "./backend/battery.json";
const stepperFilePath = "./backend/1st_Stepper.json";
const secondStepperFilePath = "./backend/2nd_Stepper.json";
const countFilePath = "./backend/Count.json";
const wattsFilePath = "./backend/Watts.json";

// Function to get current timestamp in Philippine Time (UTC+8)
function getCurrentTimestamp() {
  const now = new Date();

  // Convert the current time to UTC, then adjust by adding 8 hours for Philippine Time
  const philippineTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));

  // Return the time in the desired format (YYYY-MM-DD HH:MM:SS)
  return philippineTime.toISOString().replace("T", " ").slice(0, 19);
}

// Function to read the last ID from the JSON file
function getLastId(filePath, callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code === "ENOENT") {
      // If file doesn't exist, start fresh with ID 1
      callback(0);
    } else if (err) {
      console.error(`Error reading ${filePath}:`, err);
    } else {
      try {
        const jsonData = JSON.parse(data);
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          // Get the last entry's ID and return the next sequential ID
          const lastId = jsonData[jsonData.length - 1].id;
          callback(lastId);
        } else {
          // If no entries exist, start with ID 1
          callback(0);
        }
      } catch (parseErr) {
        console.error(`Error parsing JSON from ${filePath}:`, parseErr);
        callback(0); // Reset to 0 if there's a parse error
      }
    }
  });
}

// Function to update the JSON file with new data
function updateJsonFile(filePath, value, label) {
  getLastId(filePath, (lastId) => {
    const newId = lastId + 1; // Increment the last ID by 1

    // Create a new entry with the correct ID and timestamp
    const newEntry = {
      id: newId,
      value: value,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
      created_by: null, // Adjust if you want to capture this value later
    };

    // Read the existing JSON file to append the new entry
    fs.readFile(filePath, "utf8", (err, data) => {
      let jsonData = [];

      if (!err && data) {
        try {
          jsonData = JSON.parse(data); // Parse existing data into an array
          if (!Array.isArray(jsonData)) {
            jsonData = []; // If not an array, reset it
          }
        } catch (parseErr) {
          console.error(`Error parsing ${label} JSON, resetting data:`, parseErr);
          jsonData = []; // Reset to empty on parse error
        }
      } else if (err && err.code === "ENOENT") {
        console.log(`${label} file does not exist, starting fresh.`);
      } else if (err) {
        console.error(`Error reading ${label} file:`, err);
        return; // Exit if there is another unexpected error
      }

      // Append the new entry
      jsonData.push(newEntry);

      // Write the updated data back to the file
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error(`Error writing to ${label}.json:`, writeErr);
        } else {
          console.log(`New entry added to ${label}.json:`, newEntry);
        }
      });
    });
  });
}

// Listen for changes in the "Percentage" value
onValue(percentageRef, (snapshot) => {
  const percentage = snapshot.val();
  console.log("New Percentage Value from RTDB:", percentage);
  updateJsonFile(batteryFilePath, percentage, "battery");
});

// Listen for changes in the "1stStepper" value
onValue(stepperRef, (snapshot) => {
  const stepperValue = snapshot.val();
  console.log("New 1stStepper Value from RTDB:", stepperValue);
  updateJsonFile(stepperFilePath, stepperValue, "1st Stepper");
});

// Listen for changes in the "2ndStepper" value
onValue(secondStepperRef, (snapshot) => {
  const secondStepperValue = snapshot.val();
  console.log("New 2ndStepper Value from RTDB:", secondStepperValue);
  updateJsonFile(secondStepperFilePath, secondStepperValue, "2nd Stepper");
});

// Listen for changes in the "Count" value
onValue(countRef, (snapshot) => {
  const countValue = snapshot.val();
  console.log("New Count Value from RTDB:", countValue);
  updateJsonFile(countFilePath, countValue, "Count");
});

// Listen for changes in the "Watts" value
onValue(wattsRef, (snapshot) => {
  const wattsValue = snapshot.val();
  console.log("New Watts Value from RTDB:", wattsValue);
  updateJsonFile(wattsFilePath, wattsValue, "Watts");
});
