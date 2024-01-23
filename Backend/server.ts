import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

import router from "./Routes/user_registration";
import events from "./Routes/events"
 

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(bodyParser.json());

app.use('/' , router); // User Registration 
app.use('/' , events); // Event management

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});