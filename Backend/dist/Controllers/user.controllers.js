"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getalluser = exports.getuser = exports.loguser = exports.addusers = void 0;
const postgres_1 = __importDefault(require("../Database/postgres"));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_USER || "Secret";
// *********************** User Registration **********************
const addusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, email, password } = req.body;
        console.log("Received data:", req.body);
        // Password Hashing ...
        if (!firstname || !lastname || !email || !password) {
            console.log("Get undef");
            return res.status(401).json({ success: false, message: "Informaition Missing" });
        }
        else {
            const salt = yield bcrypt.genSalt(8);
            const hashpass = yield bcrypt.hash(password, salt);
            if (hashpass) {
                const newUser = yield postgres_1.default.query("INSERT INTO panel(Firstname , LastName , Email , password  ) VALUES ($1, $2, $3, $4 ) RETURNING *", [firstname, lastname, email, hashpass]);
                // Generate a JWT token ...
                const payload = { userId: newUser.rows[0].user_id };
                const token = jwt.sign(payload, secretKey);
                res.json({ user: newUser.rows[0], token });
            }
        }
    }
    catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});
exports.addusers = addusers;
const loguser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const check_Email = yield postgres_1.default.query("SELECT * FROM panel WHERE Email = $1", [email]);
        if (check_Email.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Email not found" });
        }
        try {
            const isPasswordMatch = yield bcrypt.compare(password, check_Email.rows[0].password);
            if (!isPasswordMatch) {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
            // If password matched ...
            const payload = { userId: check_Email.rows[0].user_id };
            const token = jwt.sign(payload, secretKey);
            res.json({ success: true, token });
        }
        catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ success: false, message: 'An error occurred while comparing passwords.' });
        }
    }
    catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});
exports.loguser = loguser;
const getuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        res.status(404).json({ success: false, message: 'Token not found in the header' });
    }
    try {
        // console.log("Recieved token : ", token)
        const decoded = jwt.verify(token, secretKey);
        // console.log("Decoded token:", decoded);
        // console.log("User ID:", decoded.userId);
        const user = yield postgres_1.default.query("SELECT * FROM panel WHERE user_id = $1", [decoded.userId]);
        // console.log("The recieving user is ", user)
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user: user.rows[0] });
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Access denied. Invalid token." });
    }
});
exports.getuser = getuser;
const getalluser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("Get all user endpoint hit ");
    try {
        const user = yield postgres_1.default.query("SELECT * FROM users");
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No Contact list present" });
        }
        res.json({ success: true, user: user.rows });
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Access denied. NO Users Present ." });
    }
});
exports.getalluser = getalluser;
