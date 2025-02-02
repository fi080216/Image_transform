const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const express = require("express");
const app = express();
app.set("views", path.join(__dirname, "views")); // Ensure views directory is correctly set
app.use('/Images', express.static('Images')); //path for the static files to be loaded
app.set("view engine", "ejs"); // path to render the ejs files


function files(){
    return {
        async file(req,res){
            try {
                const { fileId } = req.params;
                const { width, height, format, filter, download } = req.query;
          
                const inputPath = path.join(__dirname, '../Images', fileId);
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
        }
    }
}

module.exports = files;