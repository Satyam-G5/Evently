import cron from 'node-cron';
import Redis from 'ioredis';
import pool from './Database/postgres';
import { sendMessage } from './Email/Mail';

const internalRedisUrl = 'rediss://red-cnk7pcnsc6pc73f7tqi0:JCzr3tsxgSmAMCXgiITf4F7BAN0kohOd@oregon-redis.render.com:6379';  // Render
const redis = new Redis(internalRedisUrl);

// redis-cli -u redis://default:0ZpibZDlfIu8qulHW6C5EuHnxYR8hIOr@redis-17112.c326.us-east-1-3.ec2.cloud.redislabs.com:17112

// Function to handle sending email
const sendEmail = async (meetingId: string, video_chat: string, booker: string, host: string, date: string, time: string, users: string) => {
  try {
    sendMessage(video_chat, booker, host, date, time, users);
    console.log(`Sending email for meeting ${host} and ${booker}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Define a cron job to run every minute (adjust the schedule as needed)
// cron.schedule('*/30 * * * *', async () => {
cron.schedule('* * * * *', async () => {

  try {
    console.log('Checking for scheduled emails...');

    const currentTime = new Date();

    // Check if the data is already in Redis
    const cachedData = await redis.get('cached_db_meet');

    let db_meet;

    if (cachedData) {
      // Use cached data if available
      db_meet = JSON.parse(cachedData);
    } else {
      // Fetch data from the database and cache it in Redis
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'numeric', year: 'numeric' };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      const formattedDate = formatter.format(currentTime);

      db_meet = await pool.query(`SELECT * FROM bookmeet WHERE date ='${formattedDate}'`);
      await redis.setex('cached_db_meet', 60 * 60 * 2, JSON.stringify(db_meet));
    }

    // Iterate through meetings and send emails
    for (const row of db_meet.rows) {
      const [day, month, year] = row.date.split('/');
      const newDateString = `${year}-${month}-${day}`;
      const combinedDateTimeString = `${newDateString} ${row.time}`;
      const meetingDate = new Date(combinedDateTimeString);
      const fiveHoursLater = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000);

      // Check if the meeting is scheduled within the next 15 minutes
      if (meetingDate > currentTime && meetingDate <= fiveHoursLater) {
        console.log("Upcoming meeting scheduled");
        await sendEmail(row.meeting_id, row.video_chat, row.booker, row.host, row.date, row.time, row.users);
        console.log("Sending Email to -->", row.host, row.users);
        await redis.zrem('scheduledMeetings', row.meeting_id);
      }
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping scheduled task...');
  redis.disconnect();
  process.exit();
});
