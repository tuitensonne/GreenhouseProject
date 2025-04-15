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

    async sendEmail(to: string,subject: string ,text: any) {
        const mailOptions = {
          from: `"Greenhouse HCMUT" <${process.env.EMAIL_USER}>`,
          to,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px;">
              <div style="background-color: #fff; padding: 20px; border-radius: 10px; border-left: 6px solid #ff4d4f; max-width: 900px; margin: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #ff4d4f;">⚠️ Alert: Sensor Value Exceeded Threshold</h2>
                <p style="font-size: 1.1em; color: #333;">One of the sensors has recorded a value exceeding the allowed threshold. Details below:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                  <tr>
                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">🌱 Greenhouse</th>
                    <td style="text-align: left; padding: 8px;">${text.greenhouseName} - ${text.greenhouseLocation} (ID: ${text.greenhouseId})</td>
                  </tr>
                  <tr>
                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">🆔 Sensor ID</th>
                    <td style="text-align: left; padding: 8px;">${text.sensorId}</td>
                  </tr>
                  <tr>
                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">🔧 Sensor Type</th>
                    <td style="text-align: left; padding: 8px;">${text.sensorType}</td>
                  </tr>
                  <tr>
                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">🔺 Max Threshold Value</th>
                    <td style="text-align: left; padding: 8px;">${text.maxValue}</td>
                  </tr>
                  <tr>
                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">❗ Recorded Value</th>
                    <td style="text-align: left; padding: 8px; color: red; font-weight: bold;">${text.value}</td>
                  </tr>
                </table>
                
                <p style="margin-top: 20px;">Please check and take action soon to avoid any issues with the system.</p>
                
                <div style="margin-top: 20px; font-size: 0.9em; color: #888;">
                  This is an automated email from the greenhouse monitoring system. Please do not reply to this email.
                </div>
              </div>
            </div>
          `
        };
    
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log(`Email sent successfully}`); 
          return info;
        } catch (error) {
          console.error(`Error sending email:`, error);
          throw error;
        }
      }
}
