import nodemailer from 'nodemailer';
import Maingen from "mailgen";

module.exports.sendMessage = async (reciever : string) => {
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
        body : { 
            intro : `NEW MEETING SCHEDULED ` ,
            outro : 'You have new meeting Scheduled with ${} . Please visit the website for further details .'
        }
    }
    
    let Mail = Mailgenerator.generate(response)

    let message = {
        from : process.env.EMAIL ,
        to : reciever,
        subject : 'Evently - NEW MEETING',
        html : Mail
    }

    transporter.sendMail(message)
   

    
  };   