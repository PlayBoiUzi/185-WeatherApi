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

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const koordinat = feature.geometry.coordinates; 

            let negara = "-", provinsi = "-", kecamatan = "-";
            if(feature.context) {
                feature.context.forEach(ctx => {
                    if (ctx.id.startsWith('country')) negara = ctx.text;
                    if (ctx.id.startsWith('region') || ctx.id.startsWith('province')) provinsi = ctx.text;
                    if (ctx.id.startsWith('county') || ctx.id.startsWith('municipality') || ctx.id.startsWith('city')) kecamatan = ctx.text;
                });
            }
            if (kecamatan === "-") kecamatan = feature.text;

            res.json({
                negara: negara,
                provinsi: provinsi,
                kecamatan: kecamatan,
                longitude: koordinat[0].toFixed(6),
                latitude: koordinat[1].toFixed(6)
            });
        } else {
            res.status(404).json({ message: "Lokasi tidak ditemukan" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Gagal mengambil data dari MapTiler" });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});