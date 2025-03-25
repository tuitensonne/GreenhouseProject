import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        const transport = {
            service: 'gmail', 
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS
            }
        }
        
        this.transporter = nodemailer.createTransport(transport);
    }

    async sendEmail(to: string, subject: string, text: string) {
        const mailOptions = {
          from: `"Greenhouse HCMUT" <${process.env.EMAIL_USER}>`,
          to,
          subject,
          text
        };
    
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log(`Email sent: ${info.messageId}`);
          return info;
        } catch (error) {
          console.error(`Error sending email:`, error);
          throw error;
        }
      }
}
