const express = require("express");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/roles");
const { listUsers, updateUserRole, updateUserStatus } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", auth, requireRole(["admin"]), listUsers);
router.put("/users/:id/role", auth, requireRole(["admin"]), updateUserRole);
router.put("/users/:id/status", auth, requireRole(["admin"]), updateUserStatus);

module.exports = router;
