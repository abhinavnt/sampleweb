const express = require("express")
const router = express.Router()
const adminController= require('../controller/adminController')
const adminAuth=require("../middlleware/adminAuth")
const { login, loaddashBoard } = require("../controller/adminController")
const { checkSession } = require("../middlleware/adminAuth")




router.get("/login",adminAuth.isLogin,adminController.loadLogin)
router.post('/login', login)
router.get('/dashBoard', checkSession, loaddashBoard)
router.get('/edit-user/:id', adminController.editUser)
router.post('/update-user/:id', adminController.updateUser);
router.post('/delete-user/:id', adminController.deleteUser)
router.post('/add-user', adminController.addUser)
router.get('/search-user', adminController.searchUser)
router.post('/logout2',adminController.logout2)
module.exports=router