import cron from 'node-cron';
import Redis from 'ioredis';
import pool from './Database/postgres';
import { sendMessage } from './Email/Mail';

const internalRedisUrl = 'redis://red-cnk7pcnsc6pc73f7tqi0:6379';
const redis = new Redis(internalRedisUrl);

const sendEmail = async (meetingId: string, video_chat: string , booker : string , host : string  , date :string , time : string , users : string  ) => {
  sendMessage(video_chat , booker , host , date , time , users);
  console.log(`Sending email for meeting ${host} and ${booker}`);

};

// Define a cron job to run every minute (adjust the schedule as needed)
cron.schedule('*/30 * * * *', async () => {
  console.log('Checking for scheduled emails...');

  const currentTime = new Date();

  // Check if the data is already in Redis
  const cachedData = await redis.get('cached_db_meet');

  let db_meet;

  if (cachedData) {
    // Use cached data if available
    db_meet = JSON.parse(cachedData);
    // console.log("Cache data available : " , db_meet);
    
  } else {
    // Fetch data from the database
    // console.log("Cache data is not available");

// Specify the desired date options


const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'numeric', year: 'numeric' };
const formatter = new Intl.DateTimeFormat('en-GB', options);
const formattedDate = formatter.format(currentTime);

// console.log(typeof(formattedDate) , formattedDate);



    db_meet = await pool.query(`SELECT * FROM bookmeet WHERE date ='${formattedDate}' `);
    // console.log("db_meet : ", db_meet.rows);
 

    // Cache the data in Redis (set the expiration time as needed)
    await redis.setex('cached_db_meet', 60 * 60 * 2, JSON.stringify(db_meet));
  }

// Iterate through meetings and send emails
for (const row of db_meet.rows) {
  console.log("Rows : ", db_meet.rows);

  
  const [day, month, year] = row.date.split('/');
  const newDateString = `${year}-${month}-${day}`;
  const combinedDateTimeString = `${newDateString} ${row.time}`;
  const meetingDate = new Date(combinedDateTimeString);
  const fiveHoursLater = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000); // Time Ahead 

  console.log("MEeting Date : ", meetingDate , "current time and meeetingdate : " , currentTime && meetingDate , "next time :" , fiveHoursLater );


  // Check if the meeting is scheduled within the next 15 minutes
  if (meetingDate > currentTime && meetingDate <= fiveHoursLater) {
    // if (meetingDate > currentTime && meetingDate <= new Date(currentTime.getTime() + 900000)) {
    console.log("Upcomming meeting scheduled");
    
    
      await sendEmail(row.meeting_id, row.video_chat , row.booker , row.host , row.date , row.time , row.users);
      console.log("Sending Email to --> ", row.host , row.users);
      

    // Remove the meeting from the scheduledMeetings set
    await redis.zrem('scheduledMeetings', row.meeting_id);
  }
}

});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping scheduled task...');
  redis.disconnect();
  process.exit();
});
