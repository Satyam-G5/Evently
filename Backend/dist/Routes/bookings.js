"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controllers_1 = require("../Controllers/book.controllers");
const router = express_1.default.Router();
router.post("/booking_success", book_controllers_1.book);
router.post("/collect_book", book_controllers_1.get_book);
exports.default = router;
