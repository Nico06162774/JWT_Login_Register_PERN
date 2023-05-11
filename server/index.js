const express = require ("express");
const app = express()
const cors = require("cors");

//middleware

app.use (express.json()) //req body
app.use (cors())

//routes//

//register and login routes
app.use("/auth", require("./routes/jwtAuth"));

  
app.listen(5000,()=>{
    console.log("Server Connected to Port 5000")
})
