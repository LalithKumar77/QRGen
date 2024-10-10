import express from "express";
import { fileURLToPath } from "url";
import { dirname ,join} from "path";
import bodyParser from "body-parser";
import qr from "qr-image";

const dir = dirname(fileURLToPath(import.meta.url));
const port = 3000;
const app = express();
app.use(express.static(join(dir,'../public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(join(dir , "../public/index.html"));
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
  console.log(`Server is Running on `);
  console.log(`http://localhost:${port}`);
});