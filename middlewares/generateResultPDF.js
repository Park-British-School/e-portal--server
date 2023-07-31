const pdfKit = require("pdfkit");
const fs = require("fs");

function generateResultPDF(req, res, next) {
  let result = req.body.result;
  const doc = new pdfKit({ size: "A4" });

  doc.roundedRect(30, 30, 535.28, 781.89, 50).stroke();

  doc.image("static/images/logos/logo.png", 50, 50, { width: 50 });
  doc.image("static/images/logos/logo.png", 495, 50, { width: 50 });

  doc
    .font("Times-Roman")
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
    .lineWidth(2)
    .moveTo(50, 165)
    .lineTo(545.28, 165)
    .stroke();

  doc
    .lineCap("round")
    .lineWidth(2)
    .moveTo(50, 205)
    .lineTo(545.28, 205)
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
  let row = 230;

  scoreSheet.shift();
  if (result.type === "midTerm") {
    doc
      .text("SYLLABUS TITLE", 70, 215)
      .text("SCORE", 320, 215)
      .text("GRADE", 470, 215);

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
      row += 15;
    });
  }

  if (result.type === "endOfTerm") {
    doc
      .fontSize(9)
      .text("SYLLABUS TITLE", 70, 215)
      .text("TEST", 300, 215)
      .text("EXAM", 340, 215)
      .text("AVG. PERCENTAGE", 390, 215)
      .text("GRADE", 490, 215);

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
      row += 15;
    });
  }

  row += 10;

  doc
    .lineWidth(1)
    .fontSize(11)
    .text("ELECTIVES", 70, row)
    .lineCap("round")
    .lineWidth(1)
    .moveTo(50, row + 15)
    .lineTo(545.28, row + 15)
    .stroke();

  row += 25;

  if (result.electives.length === 0) {
    doc.fontSize(11).text("No electives to show", 70, row);
    row += 15;
  } else {
    result.electives.forEach((elective, index) => {
      doc.fontSize(11).text(elective.title, 73, row + 2);

      doc.fontSize(11).text(elective.grade, 300, row + 2);

      row += 20;
    });
  }

  row += 10;

  doc
    .fontSize(11)
    .text("CLASS TEACHER'S REMARK", 70, row, { width: 300 })
    .lineCap("round")
    .lineWidth(1)
    .moveTo(50, row + 15)
    .lineTo(545.28, row + 15)
    .stroke();

  row += 25;

  doc.fontSize(11).text(result.teachersRemark, 70, row);

  row += Math.ceil(result.teachersRemark.length / 110) * 15;

  row += 25;

  doc
    .text("PRINCIPAL'S REMARK AND SIGNATURE", 70, row, { bold: true })
    .lineCap("round")
    .lineWidth(1)
    .moveTo(50, row + 15)
    .lineTo(545.28, row + 15)
    .stroke()
    .fontSize(11)
    .text(result.principalsRemark, 70, row + 20);

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
