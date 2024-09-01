import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import qr from "qr-image";

const dir = dirname(fileURLToPath(import.meta.url));
const port = 3000;
const app = express();
app.use(express.static(dir));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(dir + "/index.html");
});

app.post("/submit", (req, res) => {
  const text = req.body.text;
  const qrCode = qr.image(text, {
    type: "png",
    size: 10,
    margin: 2,
  });

  const buffer = [];
  qrCode.on("data", (chunk) => {
    buffer.push(chunk);
  });
  qrCode.on("end", () => {
    const imageData = Buffer.concat(buffer);
    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", "inline; filename='qr_code.png'");
    res.send(imageData);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});