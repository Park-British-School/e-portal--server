const feeModel = require('../models/feeModel')

const { feeModel__withPriceVariations, feeModel__withoutPriceVariations, FeeModel } = feeModel

exports.getAllFees = async function (req, res) {
  const fees = await FeeModel.find({})
  res.status(200).json(fees)
}

exports.createFee = async function (req, res) {
  const fee = req.body;
  try {
    if (fee.hasPriceVariety === true) {
      const newFee = await new feeModel__withPriceVariations({
        ...fee
      }).save()
      res.status(200).json(newFee)
    }
    if (fee.hasPriceVariety === false) {
      const newFee = await new feeModel__withoutPriceVariations({
        ...fee
      }).save()
      res.status(200).json(newFee)
    }
  } catch (error) {

  }
}

exports.deleteFee = async function (req, res) {
  const feeID = req.params.feeID
  await FeeModel.deleteOne({ _id: feeID })
  res.status(200).json({})
}
