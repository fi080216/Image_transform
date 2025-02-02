const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const imageSize = require("image-size");
const bodyParser = require("body-parser");

// imported function
const post = require("./controllers/post");
const home = require("./controllers/home");
const files= require("./controllers/files");

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json);
app.use('/Images', express.static('Images')); //path for the static files to be loaded
app.set("view engine", "ejs"); // path to render the ejs files
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

app.get("/", home().homepage);

//API to upload the file

app.post("/upload", upload.single("Image"), post().upload);

//API to fetch the file from server and tranform it

app.get('/files/:fileId', files().file);

//Setting the localhost port to run the server

app.listen(8080, () => {
  console.log("server started");
});


