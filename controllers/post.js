function post() {
  return {
    upload(req, res) {
      const fileId = req.file.filename;
      res.render("upload", { fileId: fileId });
    },
  };
}

module.exports = post;
