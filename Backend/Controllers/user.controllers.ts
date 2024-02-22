import { Express, Request, Response } from "express";
import pool from '../Database/postgres'


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_USER || "Secret";
 
// *********************** User Registration **********************

const addusers = async (req: any, res: Response) => {

    try {
        const { firstname, lastname, email, password } = req.body;

        console.log("Received data:", req.body);

        // Password Hashing ...
        if (!firstname || !lastname || !email || !password ) {
            console.log("Get undef");
            return res.status(401).json({ success: false, message: "Informaition Missing" });
        } else {
            const salt = await bcrypt.genSalt(8);
            const hashpass = await bcrypt.hash(password, salt);
            if(hashpass){
            const newUser = await pool.query(
                "INSERT INTO panel(Firstname , LastName , Email , password  ) VALUES ($1, $2, $3, $4 ) RETURNING *",
                [firstname, lastname, email, hashpass]
            );

            // Generate a JWT token ...
            const payload = { userId: newUser.rows[0].user_id };
            const token = jwt.sign(payload, secretKey);

            res.json({ user: newUser.rows[0], token });

        }
    }
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }


};

const loguser = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        const check_Email: any = await pool.query("SELECT * FROM panel WHERE Email = $1", [email]);

        if (check_Email.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Email not found" });
        }
        try {

            const isPasswordMatch = await bcrypt.compare(password, check_Email.rows[0].password);

            if (!isPasswordMatch) {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
            // If password matched ...
            const payload = { userId: check_Email.rows[0].user_id };
            const token = jwt.sign(payload, secretKey);

            res.json({ success: true, token });
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ success: false, message: 'An error occurred while comparing passwords.' });
        }

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
};

const getuser = async (req: Request, res: Response) => {

    const token = req.header('Authorization');

    if (!token) {
        res.status(404).json({ success: false, message: 'Token not found in the header' })
    }

    try {
        // console.log("Recieved token : ", token)
        const decoded = jwt.verify(token, secretKey);

        // console.log("Decoded token:", decoded);
        // console.log("User ID:", decoded.userId);


        const user: any = await pool.query("SELECT * FROM panel WHERE user_id = $1", [decoded.userId]);
        // console.log("The recieving user is ", user)

        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: user.rows[0] });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Access denied. Invalid token." });
    }
};

const getalluser =async (req:Request  ,res : Response) => {
    // console.log("Get all user endpoint hit ");
    
    try {

        const user: any = await pool.query("SELECT * FROM users");


        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No Contact list present" });
        }

        res.json({ success: true, user: user.rows });
        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Access denied. NO Users Present ." });
    }
}


export { addusers, loguser, getuser , getalluser }