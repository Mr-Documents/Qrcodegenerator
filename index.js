import express from "express";
import fs from "fs";
import qr from "qr-image";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/generate", (req, res) => {
    const  url  = req.body.urls;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const qrsvgimg = qr.image(url, { type: "png" });
    const qrpath = "Qr-img.png";

    qrsvgimg.pipe(fs.createWriteStream(qrpath));

    fs.writeFile("URL.txt", url, (err) => {
        if (err) console.error("Error saving URL:", err);
        else console.log("URL saved successfully.");
    });


       

    res.setHeader("Content-Type", "image/png");
    qrsvgimg.pipe(res);
     //sending the qr to the client
     
});



app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
