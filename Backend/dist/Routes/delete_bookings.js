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
const postgres_1 = __importDefault(require("../Database/postgres"));
const router = express_1.default.Router();
router.post("/delbooking", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, users, video_chat, date, time } = req.body;
    if (!host || !users || !video_chat || !date || !time) {
        console.log("Video chat link not received ");
        res.status(400).json({ error: "Video chat link not received" });
        return;
    }
    try {
        const del = yield postgres_1.default.query("DELETE FROM bookmeet WHERE host = $1 AND users = $2 AND video_chat = $3 AND date = $4 AND time = $5", [host, users, video_chat, date, time]);
        // Check if any rows were deleted
        if (del.rowCount === 0) {
            res.status(404).json({ error: "Row not found with the given video_chat link" });
        }
        else {
            res.status(200).json({ deleted: del.rowCount });
        }
    }
    catch (error) {
        console.error("Error executing DELETE query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
