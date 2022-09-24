const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    
    cb(null, "./")
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1]
    cb(null, `uploads/${req.body.fileName}.jpeg`)
  }
})

const upload = multer({
  storage: storage
})

module.exports = upload