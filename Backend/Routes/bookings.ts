import express , { Express  , Request , Response} from "express";
import { book , get_book } from "../Controllers/book.controllers";

const router = express.Router() ;

router.post("/booking_success" , book );
router.post ("/collect_book", get_book);
 

export default router; 