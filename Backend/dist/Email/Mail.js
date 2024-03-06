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
exports.sendMessage = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailgen_1 = __importDefault(require("mailgen"));
const sendMessage = (video_chat, booker, host, date, time, users) => __awaiter(void 0, void 0, void 0, function* () {
    // ... your existing code for the sendMessage function
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        },
    };
    const transporter = nodemailer_1.default.createTransport(config);
    const Mailgenerator = new mailgen_1.default({
        theme: 'default',
        product: {
            name: 'Evently',
            link: 'https://mailgen.js/'
        }
    });
    let response = {
        body: {
            intro: `Hello ,<br><br> You have an upcoming meeting scheduled at ${time} on ${date}.`,
            outro: `<br>Upcoming meeting alert on Evently:<br>
                    <strong>Booked by:</strong> ${booker}<br>
                    <strong>Host:</strong> ${host}<br>
                    <strong>Time:</strong> ${time}<br>
                    <strong>Date:</strong> ${date}<br>
                    <strong>Meeting Place:</strong> Evently Website<br>
                    <strong>Meeting Link:</strong> ${video_chat}<br><br>
                    Please click the link above to join the meeting.`,
        },
    };
    let Mail = Mailgenerator.generate(response);
    let message = {
        from: process.env.EMAIL,
        to: [users, host],
        subject: 'Evently - Upcomming Meeting Alert',
        html: Mail
    };
    transporter.sendMail(message);
});
exports.sendMessage = sendMessage;
