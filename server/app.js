(function () {
  const express = require("express");
  const path = require("path");

  const app = express();

  const clientPath = path.join(__dirname, "../client");

  app.use(express.json());

  // Serve HTML, CSS, JavaScript, images, and other frontend files
  app.use(express.static(clientPath));

  // Test API route
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      message: "Server is running",
    });
  });

  // Send index.html when the home page is requested
  app.get("/", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });

  module.exports = app;
})();
