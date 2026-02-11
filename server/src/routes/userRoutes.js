const express = require("express");
const auth = require("../middleware/auth");
const { updateProfile } = require("../controllers/userController");

const router = express.Router();

router.put("/me", auth, updateProfile);

module.exports = router;
