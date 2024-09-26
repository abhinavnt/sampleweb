const express = require("express")
const app= express()
const userRoutes=require('./routes/user')
const adminRoutes=require('./routes/admin')
const path=require('path')
const connectDB = require("./db/connectDB")
const userController= require("./controller/userController")
const session=require('express-session')
const nocache=require("nocache")


app.use(nocache())
app.use(session({
    secret:'secretcode',
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24
    }
                            
}))




        

//view enginesetup
app.set('views',path.join(__dirname,'views'))
app.set('view engine',"ejs")

//static access
app.use(express.static('public'));

app.use(express.urlencoded())
app.use(express.json())

//routes
app.use("/user",userRoutes)
app.use("/admin",adminRoutes)

app.post("/user/register",userController.registeruser)

app.use((req,res)=>{
    res.render("user/found")
})






connectDB()
app.listen(3000,()=>{
    console.log("server is running at http://localhost:3000/user/login");
    
})





