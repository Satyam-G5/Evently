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
exports.book_events = exports.get_events = exports.save_events = void 0;
const postgres_1 = __importDefault(require("../Database/postgres"));
function save_events(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Email, link, time_start, time_end, event_name, days_selected, duration } = req.body;
            if (!Email || !link || !time_start || !time_end || !event_name || !days_selected || !duration) {
                console.log("Information not received");
                res.status(400).json({ error: "Information not received" });
                return;
            }
            // Check if Email exists in the database
            const existingRecord = yield postgres_1.default.query("SELECT * FROM events WHERE Email = $1", [Email]);
            if (existingRecord.rows.length > 0) {
                // Email exists, perform an UPDATE query
                const update_data = yield postgres_1.default.query("UPDATE events SET link = $2, time_start = $3, time_end = $4, event_name = $5, days_selected = $6, duration = $7 WHERE Email = $1 RETURNING *", [Email, link, time_start, time_end, event_name, days_selected, duration]);
                res.status(200).json(update_data.rows[0]);
            }
            else {
                // Email does not exist, perform an INSERT query
                const save_data = yield postgres_1.default.query("INSERT INTO events(Email, link, time_start, time_end, event_name, days_selected, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [Email, link, time_start, time_end, event_name, days_selected, duration]);
                res.status(200).json(save_data.rows[0]);
            }
        }
        catch (error) {
            console.log("Error: ", error);
            res.status(500).json({ error: "Error in Saving Events" });
        }
    });
}
exports.save_events = save_events;
function get_events(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { Email } = req.body;
            if (!Email) {
                console.log("Email not recieved -->", Email);
            }
            else {
                // console.log("Email recieved : ",Email);
                const get_all_events = yield postgres_1.default.query(`SELECT * FROM events WHERE Email = '${Email}'`);
                // console.log("Rows Got --> " , get_all_events.rowCount);
                if (get_all_events.rowCount == 0) {
                    res.status(200).json("No Active Events yet");
                }
                else {
                    res.json({ ID: get_all_events.rows[0] });
                }
            }
        }
        catch (error) {
            console.log("error : ", error);
            res.send("Error fetching the events");
        }
    });
}
exports.get_events = get_events;
function book_events(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { link } = req.body;
            if (!link) {
                console.log("Link not recieved in backend");
            }
            else {
                // console.log("Link in the backend : " , link);
                const get_all_events = yield postgres_1.default.query(`SELECT * FROM events WHERE link = '${link}'`);
                // console.log("Rows Got --> " , get_all_events.rowCount);
                res.json({ ID: get_all_events.rows[0] });
            }
        }
        catch (error) {
            console.log("Error fetching events ", error);
            res.send(error);
        }
    });
}
exports.book_events = book_events;
