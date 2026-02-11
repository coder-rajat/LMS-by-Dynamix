const express = require("express");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/roles");
const { getDashboardStats } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/dashboard", auth, requireRole(["admin"]), getDashboardStats);

module.exports = router;
