const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    // Render the "welcome" view
    res.render("welcome");
});

module.exports = router;
