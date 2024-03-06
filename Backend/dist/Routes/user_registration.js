"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../Controllers/user.controllers");
const router = express_1.default.Router();
router.post("/add_user", user_controllers_1.addusers); // Registering the user 
router.post("/log_user", user_controllers_1.loguser); // Loggin the user
router.get("/get_user", user_controllers_1.getuser); // User details 
router.get("/all_user", user_controllers_1.getalluser); // all users in database 
exports.default = router;
