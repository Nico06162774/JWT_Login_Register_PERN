const router = require("express").Router()
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization")

//register route
router.post("/register", validInfo, async(req,res) =>{
    try {
        //1. destructure req.body(request body) (name, email, password)

        const {name, email, password} = req.body;

        //2. check if user exist (if user exist throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        
        if(user.rows.length !==0){
            return res.status(403).send("User Already Exist!");
        }

        //3. bcrypt password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password,salt);


        //4. insert user to db

        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *", [
            name, email, bcryptPassword
        ]);
        // res.json(newUser.rows[0]);



        //5 generate jwt token

        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({token});


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});


//login route
router.post("/login", validInfo, async(req,res)=>{

try {
    
//1. destructure the req.body

const {email, password} = req.body;


//2. check if user doesnt exist (if not throw error)

const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[email]);

if(user.rows.length === 0){
    return res.status(401).json("Email or Password is Incorrect!");
}

//3. check if password the same in db


const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

if(!validPassword){
    return res.status(401).send("Email or Password is Incorrect")
}


//4. give the jwt token

const token =  jwtGenerator(user.rows[0].user_id);

res.json({token});



} catch (error) {

    console.error(error.message);
        res.status(500).send("Server Error");
}

})


router.get("/is-verify",authorization, async (req,res)=>{
    try {
        res.json(true);
    } catch (error) {

        console.error(error.message);
        res.status(500).send("Server Error");
     
    }
});

module.exports = router;