const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/UserController");

// These are correct usage — passing handler functions
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
