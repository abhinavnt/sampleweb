const adminSchema = require('../model/adminModel')
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const { query } = require('express');
const saltRound = 10;


//admin login page loading
const loadLogin = (req, res) => {
    res.render('admin/login', { message: null })
}

//admin login page authentication
const login = async (req, res) => {
    try {  
        const { username, password } = req.body
        const admin = await adminSchema.findOne({username})
        if (!admin) return res.render('admin/login', { message: 'admin does not exist' })
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.render('admin/login', { message: 'Incorrect password' })
        }
        req.session.admin = true
        res.redirect("/admin/dashBoard")
    } catch (error) {
        console.log(error);
        res.send("somthing went wrong")

    }
}


//adminDashboard loading
const loaddashBoard = async (req, res) => {
    try {
        const admin = req.session.admin;
        req.session.admin=true
        if (!admin) return res.redirect('/login');
        const users = await userModel.find({});
        res.render('admin/dashBoard', { users:users,query:""});
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
};

//user editing
const editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        res.render('admin/editUser', { user:user});
    } catch (err) {
        console.error('Error fetching user for edit:', err);
        res.status(500).send('Internal Server Error');
    }
};

//user update
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await userModel.findByIdAndUpdate(userId, {
            username: req.body.username,   
        });
        res.redirect('/admin/dashBoard');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
};

//userdeleting
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await userModel.findByIdAndDelete(userId);
        res.redirect('/admin/dashBoard');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
};



//adding user
const addUser= async(req,res)=>{
    try{
        const{username,password}=req.body  
        const user = await userModel.findOne({username})
        if(user) return res.render('admin/dashBoard', { users:"",query:""}) 
            const hashPassword = await bcrypt.hash(password,saltRound)   
        const newUser=new userModel({
            username,
            password:hashPassword
        })
        await newUser.save()
        res.redirect('/admin/dashBoard')
    }catch(error){
    console.log(error)
    res.send("somthing went wrong")
    }
    }



//search user
const searchUser = async (req, res) => {
    try {
        const searchQuery = req.query.search;
        const users = await userModel.find({ 
        username: { $regex: searchQuery, $options: 'i' } 
    }) 
     res.render('admin/dashBoard', { users:users,query:searchQuery})    
    } catch (error) {
        console.log(error);
        res.send("Something went wrong during the search");
    }
};    



//logout 
const logout2=(req,res)=>{ 
    req.session.destroy((err)=>{
        if(err){
            return next(err)
        }
    })
    res.redirect("/admin/login")
}


module.exports = { loadLogin, login, loaddashBoard,editUser,updateUser,deleteUser,addUser,searchUser,logout2 }