"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const user_registration_1 = __importDefault(require("./Routes/user_registration"));
const events_1 = __importDefault(require("./Routes/events"));
const bookings_1 = __importDefault(require("./Routes/bookings"));
const payments_1 = __importDefault(require("./Routes/payments"));
const delete_bookings_1 = __importDefault(require("./Routes/delete_bookings"));
require("./redis");
//   Use toast npm pakage for the popups 
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const port = process.env.PORT || 8000;
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
};
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// *********************************************************************************
app.use('/', payments_1.default); // stripe payments
app.use('/', user_registration_1.default); // User Registration 
app.use('/', events_1.default); // Event management
app.use('/', bookings_1.default); // booking management
app.use('/', delete_bookings_1.default); // delete bookings
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
// ************************************************* Socket io ***********************************************
const io = new socket_io_1.Server(httpServer, { cors: corsOptions });
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
io.on("connection", (socket) => {
    console.log("User Connected -- Socket.io ", socket.id);
    socket.emit("getUsers", socket.id);
    socket.on("room:join", (mail, room) => {
        console.log("room:join -on- ", mail, room);
        emailToSocketIdMap.set(mail, socket.id);
        socketidToEmailMap.set(socket.id, mail);
        io.to(room).emit("user:joined", { mail, socketId: socket.id });
        io.to(room).emit("user:joined_toast", mail);
        socket.join(room);
        io.to(socket.id).emit("room:join", mail, room);
    });
    // **************************************************** Call Initiation ********************************************************88
    socket.on("user_calling", ({ user, offer }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("usercalling backend : ", user, offer);
        // io.to(reciever_id).emit('call_incoming' , Name);
        console.log("Incoming Call from the caller ");
        io.to(user).emit("incomming:call", { from: socket.id, offer });
    }));
    // //  **************************************************** Call Acceptance *******************************************************************
    socket.on("call:accepted_res", ({ to, ans }) => {
        console.log("Call Accepted true");
        io.to(to).emit("call:accepted", { from: socket.id, ans });
        console.log("Answer send to caller : ", ans);
    });
    // ************************************************ Negotiation Needed **********************************************************
    socket.on("peer:nego:needed", ({ to, offer }) => {
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
        console.log("peer:nego:needed executed success : ", offer);
    });
    socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
    socket.on("eventcomplete", () => {
        socket.emit("Finall_Call");
        console.log("********** Final Call Triggered ***********");
    });
    // ************************************* Message Socket Logic *********************************** 
    socket.on('hostpresent', (hostpresent) => {
        socket.broadcast.emit('hostpresent');
    });
    socket.on('sendMessage', ({ data }) => {
        // console.log("Data in backend  : " , data);
        socket.broadcast.emit('getMessasge', { data });
    });
});
