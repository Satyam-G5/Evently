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
exports.get_book = exports.book = void 0;
const postgres_1 = __importDefault(require("../Database/postgres"));
function book(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { link, booker, host, users, video_chat, date, time } = req.body;
            if (!link || !booker || !host || !users || !video_chat || !date || !time) {
                console.log("Incomplete Information recieved");
            }
            else {
                const add_booking = yield postgres_1.default.query('INSERT INTO bookmeet (link  ,booker ,host  ,users , video_chat  ,  date  , time ) VALUES ($1,  $2,  $3,  $4, $5, $6 , $7) RETURNING *', [link, booker, host, users, video_chat, date, time]);
                //  console.log("Rows inserted : " , add_booking.rowCount);
                res.status(200).json({ success: true, done: add_booking });
            }
        }
        catch (error) {
            console.log("Error booking the meeting ", error);
        }
    });
}
exports.book = book;
function get_book(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Email } = req.body;
        try {
            if (!Email) {
                console.log("Email not recieved in the backend");
            }
            else {
                const details = yield postgres_1.default.query(`SELECT * FROM bookmeet WHERE host = '${Email}' OR users = '${Email}'`);
                // console.log("No of booking recieved : ", details.rowCount);
                res.status(200).json({ success: true, details: details.rows });
            }
        }
        catch (error) {
            console.log("Error fetching the database : ", error);
            res.status(404).send(error);
        }
    });
}
exports.get_book = get_book;
