import nodemailer from 'nodemailer';
import Maingen from "mailgen";

const sendMessage = async (video_chat: string , booker : string , host : string  , date :string , time : string , users : string) => {
    // ... your existing code for the sendMessage function
    let config = {
        service : 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
          },
    };
    
    const transporter = nodemailer.createTransport(config);
   
    const Mailgenerator = new Maingen({
        theme : 'default',
        product : {
            name : 'Evently',
            link : 'https://mailgen.js/'
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
    
    let Mail = Mailgenerator.generate(response)

    let message = {
        from : process.env.EMAIL ,
        to : [users, host] ,
        subject : 'Evently - Upcomming Meeting Alert',
        html : Mail
    }

    transporter.sendMail(message)
   

    
  };   

export {sendMessage};