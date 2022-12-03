const pdfKit = require("pdfkit");
const fs = require("fs");

function generateResultPDF(req, res, next) {
  const result = req.body.result;
  const doc = new pdfKit({ size: "A4" });

  doc.roundedRect(30, 30, 535.28, 781.89, 50).stroke();

  doc.image("static/images/logos/logo.png", 50, 50, { width: 50 });
  doc.image("static/images/logos/logo.png", 495, 50, { width: 50 });

  doc
    .font("Times-Bold")
    .fontSize(25)
    .text(`${result.school.toUpperCase()}`, {
      bold: true,
      align: "center",
    })
    .moveDown(0.5);

  doc
    .fontSize(11)
    .text(`${result.title.toUpperCase()}`, {
      bold: true,
      align: "center",
    })
    .moveDown();

  doc
    .fontSize(13)
    .text(`${result.class.name.toUpperCase()}`, {
      bold: true,
    })
    .moveDown();

  doc
    .lineCap("round")
    .lineWidth(4)
    .moveTo(50, 165)
    .lineTo(545.28, 165)
    .stroke();

  doc
    .lineCap("round")
    .lineWidth(4)
    .moveTo(50, 210)
    .lineTo(545.28, 210)
    .stroke();

  doc
    .text("Candidate Name", 70, 175)
    .text("Session", 230, 175)
    .text("Overall Percentage", 320, 175)
    .text("Grade", 470, 175);

  doc
    .fontSize(9)
    .text(
      `${result.student.firstName.toUpperCase()} ${result.student.lastName.toUpperCase()}`,
      70,
      190
    )
    .text(result.session, 230, 190)
    .text(`${result.overallPercentage}%`, 320, 190)
    .text(result.overallGrade, 470, 190);
  const scoreSheet = JSON.parse(result.scoreSheet);

  let col = 70;
  let row = 250;
  scoreSheet.shift();
  if (result.type === "midTerm") {
    doc
      .text("SYLLABUS TITLE", 70, 230)
      .text("SCORE", 320, 230)
      .text("GRADE", 470, 230);

    scoreSheet.forEach((item, index, array) => {
      item.forEach((item, index) => {
        if (index === 0) {
          col = 70;
        }
        if (index === 1) {
          col = 320;
        }
        if (index === 2) {
          col = 470;
        }
        doc.text(item.value.toString().toUpperCase(), col, row, { bold: true });
        col += 100;
      });
      row += 20;
    });
  }

  if (result.type === "endOfTerm") {
    doc
      .fontSize(9)
      .text("SYLLABUS TITLE", 70, 230)
      .text("TEST", 300, 230)
      .text("EXAM", 340, 230)
      .text("AVG. PERCENTAGE", 390, 230)
      .text("GRADE", 490, 230);

    scoreSheet.forEach((item, index, array) => {
      item.forEach((item, index) => {
        if (index === 0) {
          col = 70;
        }
        if (index === 1) {
          col = 300;
        }
        if (index === 2) {
          col = 340;
        }
        if (index === 3) {
          col = 390;
        }
        if (index === 4) {
          col = 490;
        }
        doc.text(item.value.toString().toUpperCase(), col, row, { bold: true });
        col += 100;
      });
      row += 20;
    });
  }

  doc
    .lineWidth(1)
    .rect(50, row, 150, 40)
    .stroke()
    .fontSize(11)
    .text("CLASS TEACHER'S REMARK", 53, row + 3, { width: 150 });

  doc
    .lineWidth(1)
    .rect(50 + 150, row, 350, 40)
    .stroke()
    .fontSize(11)
    .text(result.teachersRemark, 53 + 150, row + 3);

  doc
    .lineWidth(1)
    .rect(50, row + 40, 500, 90)
    .stroke()
    .fontSize(14)
    .text("Principal's Remark and Signature:", 54, row + 44, { bold: true })
    .fontSize(11)
    .text(result.principalsRemark, 54, row + 65);

  if (result.isApproved) {
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(13)
      .text("AMA", 480, row + 115, { bold: true });
  }

  doc.end();

  res.setHeader("Content-Disposition", "attachment; result.pdf");
  doc.pipe(res);
}

module.exports = generateResultPDF;
