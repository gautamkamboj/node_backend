const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static("public"));

// API endpoint to get IPL data
app.get("/api/ipl-data", (req, res) => {
    fs.readFile("iplData.json", (err, data) => {
        if (err) {
            res.status(500).send("Error reading data");
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
