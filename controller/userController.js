const userSchema = require('../model/userModel')
const bcrypt= require('bcrypt')
const saltRound=10;


//logout function
const logout=(req,res)=>{ 
    req.session.destroy((err)=>{
        if(err){
            return next(err)
        }
    })
    res.redirect("/user/login")
}


// signup page verification

const registeruser= async(req,res)=>{
try{
    const{username,password}=req.body  
    const user = await userSchema.findOne({username})
    if(user) return res.render('user/register',{message:'user already exists'}) 
        const hashPassword = await bcrypt.hash(password,saltRound)   
    const newUser=new userSchema({
        username,
        password:hashPassword
    })
    await newUser.save()
    res.render('user/login',{message:'user created sucessfully'})
}catch(error){
console.log(error)
res.send("somthing went wrong")
}
}


// login verification

const login = async (req,res)=>{
    try{
        const {username,password}=req.body
        const user= await userSchema.findOne({username})
        if(!user) return res.render('user/login',{message:'user does not exist'})
            const isMatch= await bcrypt.compare(password,user.password)
            if(!isMatch)return res.render('user/login',{message:'Incorrect password'})
                req.session.user=true
                res.render("user/home",{message:"login successfull"})
    }catch(error){
        console.log(error);
        res.send("somthing went wrong")
        
    }
}



const loadRegister=(req,res)=>{
    res.render('user/register',{message:null})
}

const loadLogin=(req,res)=>{
    res.render('user/login',{message:null})
}

const loadHome=(req,res)=>{
    res.render('user/home')
}


module.exports={registeruser,loadLogin,loadRegister,login,loadHome,logout}
