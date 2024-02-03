import { Express, Request, Response } from "express";
import pool from "../Database/postgres";

async function save_events(req: Request, res: Response) {
    try {
        const { Email ,link, time_start, time_end, event_name, days_selected, duration } = req.body;

        // console.log("INFO recieved : ",Email ,link, time_start, time_end, event_name, days_selected, duration);
        

        if (!Email || !link || !time_start || !time_end || !event_name || !days_selected || !duration) {
            console.log("Information not recieved")
        } else {
            const save_data = await pool.query("INSERT INTO events(Email ,link , time_start , time_end , event_name , days_selected , duration ) VALUES ($1, $2, $3, $4 ,$5 , $6 , $7) RETURNING *",
                [Email ,link, time_start, time_end, event_name, days_selected, duration]
            );
            res.status(200).json(save_data.rows[0])
            // console.log("Data saved to database " , save_data.rows[0]);
            
        }

    } catch (error) {
        console.log("error : ", error)
        res.send("Error in Saving Events ")
    }
}

async function get_events (req: Request, res: Response) {
    try {

        const {Email} = req.body;
        if(!Email){
            console.log("Email not recieved -->" , Email);
            
        }else{
            // console.log("Email recieved : ",Email);
            
            const get_all_events = await pool.query(`SELECT link FROM events WHERE Email = '${Email}'`);
    
            // console.log("Rows Got --> " , get_all_events.rowCount);
            
            if(get_all_events.rowCount == 0){
                res.status(200).json("No Active Events yet");
            }else{
                res.json({ID : get_all_events.rows[0]});
            }
        }


    } catch (error) {
        console.log("error : ", error)
        res.send("Error fetching the events");
    }
}

async function book_events(req: Request, res: Response) {

    try {
        const {link} = req.body ;

        if(!link){
            console.log("Link not recieved in backend");
        }else{
            // console.log("Link in the backend : " , link);
            
            const get_all_events = await pool.query(`SELECT * FROM events WHERE link = '${link}'`);
            // console.log("Rows Got --> " , get_all_events.rowCount);

            res.json({ID : get_all_events.rows[0]});

        }
        
    } catch (error) {
        console.log("Error fetching events ", error);
        res.send(error)
    }
    
}

export { save_events, get_events ,book_events }