import express , { Express  , Request , Response} from "express";
import {save_events , get_events } from '../Controllers/events.controllers'


const router = express.Router() ;

router.post("/save_events" , save_events );

router.get("/get_events:UserID" , get_events);