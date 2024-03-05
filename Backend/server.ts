import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import bodyParser from 'body-parser';
import { createServer, get } from "http";
import cors from 'cors'

import router from "./Routes/user_registration";
import events from "./Routes/events"
import bookings from "./Routes/bookings"
import payments from "./Routes/payments"
import delete_bookings from "./Routes/delete_bookings"
import "./redis";

//   Use toast npm pakage for the popups 

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 8000;

const corsOptions = { 
  origin: '*',
  methods: ['GET', 'POST'],
}; 


app.use(express.json());
app.use(bodyParser.json());


// *********************************************************************************

app.use('/' , payments); // stripe payments
app.use('/' , router); // User Registration 
app.use('/' , events); // Event management
app.use('/' , bookings); // booking management
app.use('/' , delete_bookings); // delete bookings

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})




// ************************************************* Socket io ***********************************************

const io = new Server(httpServer, { cors: corsOptions });

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();


io.on("connection", (socket: Socket) => {
  console.log("User Connected -- Socket.io ", socket.id);
  
  socket.emit("getUsers", socket.id);

  socket.on("room:join", (mail, room) => {
    console.log("room:join -on- ", mail , room);
    
    emailToSocketIdMap.set(mail, socket.id);
    socketidToEmailMap.set(socket.id, mail);

    io.to(room).emit("user:joined",   { mail, socketId: socket.id } );
    io.to(room).emit("user:joined_toast",  mail  );
    socket.join(room)
    io.to(socket.id).emit("room:join", mail , room);
  });

 
// **************************************************** Call Initiation ********************************************************88
 
  socket.on("user_calling",async ({  user , offer }) => {
    console.log("usercalling backend : ",  user, offer);

   
    // io.to(reciever_id).emit('call_incoming' , Name);
    console.log("Incoming Call from the caller "); 
    io.to(user).emit("incomming:call", { from: socket.id , offer });
  });    

 
  // //  **************************************************** Call Acceptance *******************************************************************

  socket.on("call:accepted_res", ({to , ans }) => {
    console.log("Call Accepted true");
    
    io.to(to).emit("call:accepted", { from: socket.id, ans }); 
    console.log("Answer send to caller : " , ans);
  });                
            
  
// ************************************************ Negotiation Needed **********************************************************
 
 
  socket.on("peer:nego:needed", ({to , offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer }); 
    console.log("peer:nego:needed executed success : ", offer);
  });   
 
  socket.on("peer:nego:done", ({to , ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans }); 
  });   
    
  socket.on("eventcomplete" , ()=>{    
    socket.emit("Finall_Call")       
    console.log("********** Final Call Triggered ***********");
        
  }) 

  // ************************************* Message Socket Logic *********************************** 
  
  socket.on('hostpresent' , (hostpresent) =>{
    socket.broadcast.emit('hostpresent')
  });

  socket.on('sendMessage', ({data}: any) => { 
    // console.log("Data in backend  : " , data);
    socket.broadcast.emit('getMessasge' , {data})
  });  
});    