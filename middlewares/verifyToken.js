const jwt = require('jsonwebtoken')

const verify = (req, res, next)=>{
  const token = req.header('auth-token');
  if(!token) return res.status(401).json({msg : 'Access Denied'})

  try{
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    req.role = jwt.decode(token, process.env.TOKEN_SECRET).role
    req.id = jwt.decode(token, process.env.TOKEN_SECRET)._id
    next()
  } catch(err){
    res.status(400).json({ msg: err })
  }
}

module.exports = verify