const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Endpoint to update data.xml
app.post("/update-xml", (req, res) => {
    const { percentage, count } = req.body;

    const xmlData = `
<?xml version="1.0" encoding="UTF-8"?>
<data>
  <Percentage>${percentage}</Percentage>
  <Count>${count}</Count>
</data>
    `;

    fs.writeFile("public/data.xml", xmlData.trim(), (err) => {
        if (err) {
            console.error("Error writing to data.xml:", err);
            res.status(500).send("Error updating XML file");
        } else {
            console.log("data.xml updated successfully");
            res.send("XML file updated successfully");
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
