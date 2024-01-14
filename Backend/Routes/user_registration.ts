import express , { Express , Request , Response } from "express";
import {addusers , loguser , getuser , getalluser} from '../Controllers/user.controllers'

const router = express.Router()

router.post("/add_user" , addusers );  // Registering the user 

router.post("/log_user" , loguser );   // Loggin the user

router.get("/get_user" , getuser);  // User details 

router.get("/all_user" , getalluser);  // all users in database 

export default router ;  

