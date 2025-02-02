function home() {
  return {
    homepage(req, res) {
      res.render("main", { fileId: null });
    },
  };
}

module.exports = home;
