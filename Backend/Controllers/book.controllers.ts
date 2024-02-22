import { Express, Request, Response } from "express";
import pool from "../Database/postgres";

async function book (req : Request , res : Response) {
    try {
        
        const {link  , booker ,host  ,users , video_chat  ,  date  , time } = req.body ;
    
        if(!link || !booker  || !host  || !users || ! video_chat  || !  date  || ! time ) {
            console.log("Incomplete Information recieved");
        }
        else{
            const add_booking = await pool.query('INSERT INTO bookmeet (link  ,booker ,host  ,users , video_chat  ,  date  , time ) VALUES ($1,  $2,  $3,  $4, $5, $6 , $7) RETURNING *' ,
             [link  ,booker, host  ,users , video_chat  ,  date  , time])

            //  console.log("Rows inserted : " , add_booking.rowCount);
             res.status(200).json({success : true , done : add_booking})
             
        }
    } catch (error) {
        console.log("Error booking the meeting " , error );
         
    }


}

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