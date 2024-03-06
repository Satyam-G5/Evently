"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_controllers_1 = require("../Controllers/events.controllers");
const router = express_1.default.Router();
router.post("/save_events", events_controllers_1.save_events);
router.post("/get_events", events_controllers_1.get_events);
router.post("/book_events", events_controllers_1.book_events);
exports.default = router;
