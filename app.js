const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/lokasi", async (req, res) => {
    const kota = req.query.kota; 
    const apiKey = "4smQml5NNH14vs0qTGct"; 
    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;

    