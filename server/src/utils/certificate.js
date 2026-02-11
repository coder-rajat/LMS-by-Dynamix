const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const generateCertificatePdf = async ({
  studentName,
  courseTitle,
  certificateId,
  issuedAt,
}) => {
  const fileName = `certificate-${certificateId}.pdf`;
  const outputDir = path.join(__dirname, "..", "..", "uploads", "certificates");
  const filePath = path.join(outputDir, fileName);

  await fs.promises.mkdir(outputDir, { recursive: true });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(24).text("Certificate of Completion", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(16).text("This certifies that", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(22).text(studentName, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(16).text("has successfully completed the course", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(20).text(courseTitle, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(12).text(`Certificate ID: ${certificateId}`, { align: "center" });
    doc.text(`Issued: ${issuedAt.toDateString()}`, { align: "center" });

    doc.end();

    stream.on("finish", () => resolve({ filePath, fileName }));
    stream.on("error", reject);
  });
};

module.exports = { generateCertificatePdf };
