import { Express, Request, Response } from "express";
import pool from "../Database/postgres";

async function save_events(req: Request, res: Response) {
    try {
        const { Email, date, time, event_name, duration } = req.body;

        if (!Email || !date || !time || !event_name || !duration) {
            console.log("Information not recieved")
        } else {
            const save_data = await pool.query("INSERT INTO events(Email , date , time , event_name , duration ) VALUES ($1, $2, $3, $4 ,$5 ) RETURNING *",
                [Email, date, time, event_name, duration]
            );
            res.status(200).json(save_data.rows[0])
        }

    } catch (error) {
        console.log("error : ", error)
        res.send("Error in Saving Events ")
    }
}
async function get_events(req: Request, res: Response) {
    try {

        const UserID: string = req.params.UserID;
        if(!UserID){
            console.log("UserID not recieved -->" , UserID);
            
        }else{

            const get_all_events = await pool.query(`SELECT * FROM events WHERE Email = ${UserID}`);
    
            console.log("Rows Got --> " , get_all_events.rowCount);
            
            if(get_all_events.rowCount == 0){
                res.status(200).json("No Active Events yet");
            }else{
                res.status(200).json(get_all_events.rows);
            }
        }


    } catch (error) {
        console.log("error : ", error)
        res.send("Error fetching the events");
    }
}

export { save_events, get_events }