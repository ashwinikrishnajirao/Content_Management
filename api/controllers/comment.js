import { db } from "../db.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transportx
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ananyabhat23@gmail.com',
        pass: 'rjtdmgeggondfxdr'
    }
});
function checkEmailQueue() {
  db.query('SELECT * FROM email_queue', (error, results) => {
    if (error) {
      console.error('Error fetching email queue:', error);
      return;
    }
    // Process each row in the email_queue table
    results.forEach(row => {
      const { id, writer_email, blog_title, email_message } = row;
      // Send email using nodemailer
      transporter.sendMail({
        from: 'ananyabhat23@gmail.com',
        to: writer_email,
        subject: 'New Comment on Your Blog Post ' + blog_title,
        html: email_message
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
export const getComments = (req, res) => {
  const q = `
    SELECT c.*, u.id AS userId, username
    FROM comments AS c 
    JOIN user_info AS u ON (u.id = c.user_id)
    WHERE c.post_id = ? 
    ORDER BY c.commentedOn DESC
  `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});
  const token = cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");
  const decodedToken = jwt.decode(token);
  const userId = decodedToken.id;
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      INSERT INTO comments(content, commentedOn, user_id, post_id) 
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      req.body.content,
      moment().format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.post_id
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      checkEmailQueue();
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE id = ? AND user_id = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};

