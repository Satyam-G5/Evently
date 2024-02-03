import express , { Express  , Request , Response} from "express";
import {save_events , get_events , book_events } from '../Controllers/events.controllers'


const router = express.Router() ;

router.post("/save_events" , save_events );
 
router.post("/get_events" , get_events); 

router.post("/book_events" , book_events)

export default router; 