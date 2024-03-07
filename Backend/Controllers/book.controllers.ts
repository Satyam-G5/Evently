import { Express, Request, Response } from "express";
import pool from "../Database/postgres";

async function book(req: Request, res: Response) {
    try {
        const { link, booker, host, users, video_chat, date, time } = req.body;

        if (!link || !booker || !host || !users || !video_chat || !date || !time) {
            console.log("Incomplete Information received");
            return res.status(400).json({ success: false, error: "Incomplete Information received" });
        }

        // Check if the specified date and time are already booked
        const existingBooking = await pool.query('SELECT * FROM bookmeet WHERE date = $1 AND time = $2', [date, time]);

        if (existingBooking.rows.length > 0) {
            console.log("Time is already booked");
            return res.status(400).json({ success: false, error: "Time is already booked" });
        } else {
            // If the time is available, proceed with the booking
            const addBooking = await pool.query('INSERT INTO bookmeet (link, booker, host, users, video_chat, date, time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [link, booker, host, users, video_chat, date, time]);

            console.log("Booking successful");
            return res.status(200).json({ success: true, done: addBooking.rows[0] });
        }
    } catch (error) {
        console.log("Error booking the meeting", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export default book;


async function get_book(req : Request , res : Response) {

    const {Email} = req.body ;

    try {
        if (!Email){
            console.log("Email not recieved in the backend"); 
        }else{

            const details = await pool.query(`SELECT * FROM bookmeet WHERE host = '${Email}' OR users = '${Email}'`);

            // console.log("No of booking recieved : ", details.rowCount);
            res.status(200).json({success : true , details : details.rows})
            
        }

        
    } catch (error) {
        console.log("Error fetching the database : " ,error);
        res.status(404).send(error)
    }

}

export {book , get_book}