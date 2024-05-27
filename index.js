const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `File-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint to handle image upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a file!" });
  }

  const filePath = path.join(uploadDir, req.file.filename);

  // Process the image with Google Generative AI
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBqvG7BgojRbw0ZzUNyIICyUMu42t5-vI4"
  );

  const run = async () => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const image = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    try {
      const result = await model.generateContent([image]);
      console.log(result.response.text());
      res.status(200).json({
        message: "Image processed successfully!",
        result: result.response.text(),
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Error processing image" });
    }
  };
  run();
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port} 🟢`);
});
