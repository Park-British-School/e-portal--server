
function rangeCompare(minValue, maxValue, value) {
  if (value >= minValue && value <= maxValue) {
    return true
  }
}

function getGrade(gradingScale, score) {
  console.log(score)
  let grade = ""
  switch (gradingScale) {
    case "foundation":
      grade = rangeCompare(90, 100, score) && "A+"
        || rangeCompare(80, 89, score) && "A"
        || rangeCompare(75, 79, score) && "B+"
        || rangeCompare(65, 74, score) && "B"
        || rangeCompare(60, 64, score) && "C+"
        || rangeCompare(50, 59, score) && "C"
        || rangeCompare(40, 49, score) && "D"
        || rangeCompare(0, 39, score) && "F"
      break;

    case "pbs":
      grade = rangeCompare(95, 100, score) && "A+"
        || rangeCompare(90, 94, score) && "A"
        || rangeCompare(85, 89, score) && "A-"
        || rangeCompare(80, 84, score) && "B+"
        || rangeCompare(75, 79, score) && "B"
        || rangeCompare(70, 74, score) && "B-"
        || rangeCompare(65, 69, score) && "C+"
        || rangeCompare(60, 64, score) && "C"
        || rangeCompare(56, 59, score) && "C-"
        || rangeCompare(50, 55, score) && "D"
        || rangeCompare(40, 49, score) && "E"
        || rangeCompare(30, 39, score) && "F"
        || rangeCompare(0, 29, score) && "U"
      break;

    case "prc":
      grade = rangeCompare(95, 100, score) && "A+"
        || rangeCompare(90, 94, score) && "A"
        || rangeCompare(85, 89, score) && "A-"
        || rangeCompare(80, 84, score) && "B+"
        || rangeCompare(75, 79, score) && "B"
        || rangeCompare(70, 74, score) && "B-"
        || rangeCompare(65, 69, score) && "C+"
        || rangeCompare(60, 64, score) && "C"
        || rangeCompare(56, 59, score) && "C-"
        || rangeCompare(50, 55, score) && "D"
        || rangeCompare(40, 49, score) && "E"
        || rangeCompare(30, 39, score) && "F"
        || rangeCompare(0, 29, score) && "U"
      break;

    case "igcse":
      grade = rangeCompare(90, 100, score) && "A*"
        || rangeCompare(80, 89, score) && "A"
        || rangeCompare(70, 79, score) && "B"
        || rangeCompare(60, 69, score) && "C"
        || rangeCompare(50, 59, score) && "D"
        || rangeCompare(40, 49, score) && "E"
        || rangeCompare(30, 39, score) && "F"
        || rangeCompare(20, 29, score) && "G"
        || rangeCompare(0, 19, score) && "U"
      break;
    case "waec":
      grade = rangeCompare(80, 100, score) && "A1"
        || rangeCompare(75, 79, score) && "B2"
        || rangeCompare(70, 74, score) && "B3"
        || rangeCompare(60, 69, score) && "C4"
        || rangeCompare(56, 59, score) && "C5"
        || rangeCompare(50, 55, score) && "C6"
        || rangeCompare(45, 49, score) && "D7"
        || rangeCompare(40, 44, score) && "E8"
        || rangeCompare(0, 39, score) && "F9"
      break;

    case "aslevel":
      grade = rangeCompare(80, 100, score) && "a"
        || rangeCompare(70, 79, score) && "b"
        || rangeCompare(60, 69, score) && "c"
        || rangeCompare(50, 59, score) && "d"
        || rangeCompare(40, 49, score) && "e"
        || rangeCompare(0, 39, score) && "u"
      break;
    default:
      break;
  }
  return grade
}


const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

function computeGrade(req, res, next) {
  const scoreSheet = JSON.parse(req.body.scoreSheet)

  let scores = []

  scoreSheet.forEach((item, index) => {

    if (index === 0) {
      if (req.body.type === "midTerm") {
        item.push("GRADE")

      }
      if (req.body.type === "endOfTerm") {
        item.push("AVERAGE PERCENTAGE")
        item.push("GRADE")
      }
    }

    if (index > 0) {
      if (req.body.type === "midTerm") {
        scores.push(parseInt(item[item.length - 1].value))
        item.push(
          {
            value: getGrade(req.body.gradingScale, parseInt(item[item.length - 1].value))
          }
        )
      }
      if (req.body.type === "endOfTerm") {
        console.log(req.body)
        item.push(
          {
            value: average([parseInt(item[item.length - 1].value), parseInt(item[item.length - 2].value)])
          }
        )
        scores.push(parseInt(item[item.length - 1].value))
        console.log(item[item.length - 1])
        item.push(
          {
            value: getGrade(req.body.gradingScale, parseInt(item[item.length - 1].value))
          }
        )
      }
    }
  })

  const overallPercentage = average(scores).toFixed(1)
  const overallGrade = getGrade(req.body.gradingScale, Math.round(overallPercentage))
  console.log(scoreSheet)
  req.body.scoreSheet = JSON.stringify(scoreSheet)
  req.body.overallGrade = overallGrade
  req.body.overallPercentage = overallPercentage
  next()
}

module.exports = computeGrade