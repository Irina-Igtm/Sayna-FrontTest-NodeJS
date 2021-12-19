const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
    console.log(req.body);
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
  
      const bearerToken = bearerHeader.split(" ")[1];
  
      req.token = bearerToken;
      
      next();
  
    } else {
  
      res.sendStatus(403);
  
    }
};
module.exports = verifyToken