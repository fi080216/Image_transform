const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const express = require("express");
const app = express();
app.set("views", path.join(__dirname, "views")); // Ensure views directory is correctly set
app.use("/Images", express.static("Images")); //path for the static files to be loaded

app.set("view engine", "ejs"); // path to render the ejs files

function files() {
  return {
    async file(req, res) {
      try {
        const { fileId } = req.params;
        const { width, height, format, filter, download } = req.query;

        const inputPath = path.join(__dirname, "../Images", fileId);
        if (!fs.existsSync(inputPath)) {
          return res.status(404).send("File not found");
        }

        let transformer = sharp(inputPath);

        // Resize
        if (width || height) {
          transformer = transformer.resize(
            parseInt(width) || null,
            parseInt(height) || null
          );
        }

        // Apply Filters
        if (filter === "grayscale") {
          transformer = transformer.grayscale();
        } else if (filter === "blur") {
          transformer = transformer.blur();
        } else if (filter === "brighten") {
          transformer = transformer.modulate({ brightness: 1.5 });
        }

        // Format Change
        const outputFormat = format || path.extname(fileId).substring(1);
        transformer = transformer.toFormat(outputFormat);

        const outputDir = path.join(__dirname, "../Transformed_Images");
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true }); // Ensure the directory exists
        }

        // Generate a unique filename
        const filename = `processed_${fileId}.${outputFormat}`;
        const outputFilePath = path.join(outputDir, filename);

        // Save transformed image
        await transformer.toFile(outputFilePath);

        // Render EJS with the new image path
        res.render("page", { imageUrl: `/Transformed_Images/${filename}` });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error processing the image");
      }
    },
  };
}

module.exports = files;
