const jwt =  require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req, res, next)=>{

    try {

        //1. destructure token

        const jwtToken = req.header("token");

        if(!jwtToken){
            return res.status(403).json("Not Authorized!");
        }

        //2. check if token is valid
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload.user;

        next();
        
    } catch (error) {
        console.error(error.message);
        return res.status(403).json("Not Authorized!");
    }

}