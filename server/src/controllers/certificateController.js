const path = require("path");
const Certificate = require("../models/Certificate");

const myCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate("course", "title")
      .sort({ issuedAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

const downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate("student", "_id");
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (certificate.student._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const filePath = path.resolve(certificate.filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Failed to download certificate" });
  }
};

module.exports = { myCertificates, downloadCertificate };
