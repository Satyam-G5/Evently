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
const node_cron_1 = __importDefault(require("node-cron"));
const ioredis_1 = __importDefault(require("ioredis"));
const postgres_1 = __importDefault(require("./Database/postgres"));
const Mail_1 = require("./Email/Mail");
const redis = new ioredis_1.default();
const sendEmail = (meetingId, video_chat, booker, host, date, time, users) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Mail_1.sendMessage)(video_chat, booker, host, date, time, users);
    console.log(`Sending email for meeting ${host} and ${booker}`);
});
// Define a cron job to run every minute (adjust the schedule as needed)
node_cron_1.default.schedule('*/30 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Checking for scheduled emails...');
    const currentTime = new Date();
    // Check if the data is already in Redis
    const cachedData = yield redis.get('cached_db_meet');
    let db_meet;
    if (cachedData) {
        // Use cached data if available
        db_meet = JSON.parse(cachedData);
        // console.log("Cache data available : " , db_meet);
    }
    else {
        // Fetch data from the database
        // console.log("Cache data is not available");
        // Specify the desired date options
        const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const formattedDate = formatter.format(currentTime);
        // console.log(typeof(formattedDate) , formattedDate);
        db_meet = yield postgres_1.default.query(`SELECT * FROM bookmeet WHERE date ='${formattedDate}' `);
        // console.log("db_meet : ", db_meet.rows);
        // Cache the data in Redis (set the expiration time as needed)
        yield redis.setex('cached_db_meet', 60 * 60 * 2, JSON.stringify(db_meet));
    }
    // Iterate through meetings and send emails
    for (const row of db_meet.rows) {
        console.log("Rows : ", db_meet.rows);
        const [day, month, year] = row.date.split('/');
        const newDateString = `${year}-${month}-${day}`;
        const combinedDateTimeString = `${newDateString} ${row.time}`;
        const meetingDate = new Date(combinedDateTimeString);
        const fiveHoursLater = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000); // Time Ahead 
        console.log("MEeting Date : ", meetingDate, "current time and meeetingdate : ", currentTime && meetingDate, "next time :", fiveHoursLater);
        // Check if the meeting is scheduled within the next 15 minutes
        if (meetingDate > currentTime && meetingDate <= fiveHoursLater) {
            // if (meetingDate > currentTime && meetingDate <= new Date(currentTime.getTime() + 900000)) {
            console.log("Upcomming meeting scheduled");
            yield sendEmail(row.meeting_id, row.video_chat, row.booker, row.host, row.date, row.time, row.users);
            console.log("Sending Email to --> ", row.host, row.users);
            // Remove the meeting from the scheduledMeetings set
            yield redis.zrem('scheduledMeetings', row.meeting_id);
        }
    }
}));
// Handle process termination
process.on('SIGINT', () => {
    console.log('Stopping scheduled task...');
    redis.disconnect();
    process.exit();
});
