const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const imageSize = require("image-size");
const bodyParser = require("body-parser");


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json);
app.use('/Images', express.static('Images'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views directory is correctly set

//multer for uploading the file in the Images folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    console.log(file);

    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file Type"), false);
    }
  },
});

//API for fetching the home page

app.get("/", (req, res) => {
  res.render("main", {fileId: null});
});

//API to upload the file

app.post("/upload", upload.single("Image"), (req, res) => {
  const fileId = req.file.filename;
  res.render("main", { fileId : fileId});
  
});



//API to fetch the file from server and tranform it

// app.get("/files/:fileId", async (req, res) => {
//   const fileId = req.params.fileId;
//   res.render("transform", {fileId})
  
// });

app.get('/files/:fileId', async (req, res) => {
  try {
      const { fileId } = req.params;
      const { width, height, format, filter, download } = req.query;

      const inputPath = path.join(__dirname, 'Images', fileId);
      if (!fs.existsSync(inputPath)) {
          return res.status(404).send('File not found');
      }

      let transformer = sharp(inputPath);

      // Resize
      if (width || height) {
          transformer = transformer.resize(parseInt(width) || null, parseInt(height) || null);
      }

      // Apply Filters
      if (filter === 'grayscale') {
          transformer = transformer.grayscale();
      } else if (filter === 'blur') {
          transformer = transformer.blur();
      } else if (filter === 'brighten') {
          transformer = transformer.modulate({ brightness: 1.5 });
      }

      // Format Change
      const outputFormat = format || path.extname(fileId).substring(1);
      transformer = transformer.toFormat(outputFormat);

      // Set response headers
      const filename = fileId.split('.').shift() + '.' + outputFormat;
      res.setHeader('Content-Type', `image/${outputFormat}`);

      // If "download" is true, force file download
      if (download === 'true') {
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      }

      // Stream transformed image to response
      transformer.pipe(res);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error processing the image');
  }
});

//Setting the localhost port to run the server

app.listen(8080, () => {
  console.log("server started");
});


