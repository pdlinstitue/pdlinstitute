import nodemailer from "nodemailer";

interface TransportOptions {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  }
  
const sendEmail = async (option:any) => {
//Using transporter service to send email.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST as string,
        port: process.env.EMAIL_PORT as unknown as number,
        auth:{
            user:process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASSWORD as string
        }
    } as TransportOptions)
//Defining email options
    const emailOptions = {
        from: 'support@cineflix.com',
        to: option.email,
        subject: option.subject,
        text:option.message
    }
    await transporter.sendMail(emailOptions);
}
export default sendEmail; 