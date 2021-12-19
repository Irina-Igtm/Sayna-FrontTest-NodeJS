const jwt = require('jsonwebtoken')
const apiResponse = require("../helpers/apiResponse");
const verifyToken = (req, res, next) => {
    console.log(req.body);
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
  
      const bearerToken = bearerHeader.split(" ")[1];
  
      req.token = bearerToken;
      
      next();
  
    } else {
  
      return apiResponse.TokenErrone(res,"Votre token n'est pas correct")
  
    }
};
module.exports = verifyToken