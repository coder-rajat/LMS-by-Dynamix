const express = require("express");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/roles");
const {
  myCertificates,
  downloadCertificate,
} = require("../controllers/certificateController");

const router = express.Router();

router.get("/mine", auth, requireRole(["student", "admin"]), myCertificates);
router.get("/:id/download", auth, downloadCertificate);

module.exports = router;
