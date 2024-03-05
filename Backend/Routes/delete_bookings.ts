import express, { Request, Response } from "express";
import pool from "../Database/postgres";

const router = express.Router();

router.post("/delbooking", async (req: Request, res: Response) => {
  const { host  ,users , video_chat  ,  date  , time } = req.body;

  if (!host  || !users || ! video_chat  || !  date  || ! time) {
    console.log("Video chat link not received ");
    res.status(400).json({ error: "Video chat link not received" });
    return;
  }

  try {
    const del = await pool.query(
      "DELETE FROM bookmeet WHERE host = $1 AND users = $2 AND video_chat = $3 AND date = $4 AND time = $5",
      [host, users, video_chat, date, time]
    );    
    // Check if any rows were deleted
    if (del.rowCount === 0) {
      res.status(404).json({ error: "Row not found with the given video_chat link" });
    } else {
      res.status(200).json({ deleted: del.rowCount });
    }
  } catch (error) {
    console.error("Error executing DELETE query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
