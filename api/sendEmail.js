import { db } from "./db.js";
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ananyabhat23@gmail.com',
        pass: 'rjtdmgeggondfxdr'
    }
  });
  
  // Function to periodically check the email_queue table and send emails
   function checkEmailQueue() {
    db.query('SELECT * FROM email_queue', (error, results) => {
      if (error) {
        console.error('Error fetching email queue:', error);
        return;
      }
      
      // Process each row in the email_queue table
      results.forEach(row => {
        const { id, recipient, subject, message } = row;
  
        // Send email using nodemailer
        transporter.sendMail({
          from: 'ananyabhat23@gmail.com',
          to: recipient,
          subject: 'New Comment on Your Blog Post ' + subject,
          html: message
        }, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return;
          }
          console.log('Email sent:', info.response);
  
          // Remove the sent email from the email_queue table
          db.query('DELETE FROM email_queue WHERE id = ?', [id], (error, result) => {
            if (error) {
              console.error('Error deleting email from queue:', error);
            }
          });
        });
      });
    });
  }
  
 