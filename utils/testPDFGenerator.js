const pdfKit = require('pdfkit')
const fs = require('fs')
const doc = new pdfKit({ size: 'A4' })

doc.pipe(fs.createWriteStream('testfile.pdf'))

doc
  .roundedRect(30, 30, 535.28, 781.89, 50)
  .stroke()

doc
  .font('Times-Bold')
  .fontSize(25)
  .text('PARK BRITISH SCHOOL',
    {
      bold: true,
      align: "center"
    }
  )
  .moveDown(0.5)

doc
  .fontSize(15)
  .text('Autumn Half Term Assessment',
    {
      bold: true,
      align: "center"
    }
  )
  .moveDown()

doc
  .fontSize(11)
  .text('YEAR 3',
    {
      bold: true,
    }
  )
  .moveDown()

doc
  .lineCap('round')
  .lineWidth(4)
  .moveTo(50, 165)
  .lineTo(545.28, 165)
  .stroke()

doc
  .lineCap('round')
  .lineWidth(4)
  .moveTo(50, 210)
  .lineTo(545.28, 210)
  .stroke()


doc
  .text('Candidate Name', 70, 175)
  .text('Session', 230, 175)
  .text('Overall Percentage', 320, 175)
  .text('Grade', 470, 175)

doc
  .text('Candidate Name', 70, 190)
  .text('Session', 230, 190)
  .text('Overall Percentage', 320, 190)
  .text('Grade', 470, 190)

doc
  .text('SYLLABUS TITLE', 70, 230)
  .text('SCORE', 320, 230)
  .text('GRADE', 470, 230)

const scoreSheet = [
  ['test1', 4, 'A'],
  ['test1', 4, 'A'],
  ['test1', 4, 'A'],
  ['test1', 4, 'A']
]

let col = 70
let row = 250
scoreSheet.forEach((item, index, array) => {
  item.forEach((item, index) => {
    if (index === 0) {
      col = 70
    }
    if (index === 1) {
      col = 320
    }
    if (index === 2) {
      col = 470
    }
    doc.text(item.toString().toUpperCase(), col, row, { bold: true })
    col += 100
  })
  row += 20
})

doc
  .lineWidth(1)
  .rect(50, row, 150, 40)
  .stroke()
  .fontSize(14)
  .text("CLASS TEACHER'S REMARK", 53, row + 3, { width: 150 })

doc
  .lineWidth(1)
  .rect(50 + 150, row, 350, 40)
  .stroke()
  .text('test 3', 53 + 150, row + 3)

doc
  .lineWidth(1)
  .rect(50, row + 40, 150, 40)
  .stroke()
  .text("CLASS TEACHER'S NAME", 53, row + 43, { width: 150 })

doc
  .lineWidth(1)
  .rect(50 + 150, row + 40, 350, 40)
  .stroke()
  .text('test 3', 53 + 150, row + 43)


doc
  .lineWidth(1)
  .rect(50, row + 90, 500, 90)
  .stroke()
  .text('Principal\'s Remark and Signature', 54, row + 94)
  .text('test', 54, row + 115)

doc.end()