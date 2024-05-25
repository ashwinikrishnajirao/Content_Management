import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getLikes = (req,res)=>{
    const q = "SELECT COUNT(*) AS liked FROM likes WHERE `postId` = ?";

    db.query(q,req.query.postId, (err, data) => {
      if (err) return res.status(500).json(err);
      const liked = data[0].liked;
      return res.status(200).json({liked});
    });
}
export const getLikedStatus = (req, res) => {
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name.trim()] = value.trim(); // Trim whitespace from cookie name and value
    return acc;
  }, {});
  const token = cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "SELECT COUNT(*) AS liked FROM likes WHERE `userId` = ? AND `postId` = ?";
    const values = [userInfo.id, req.query.postId];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      const liked = data[0].liked === 1; // Check if user has liked the post
      return res.status(200).json({ liked });
    });
  });
};

export const addLike = (req, res) => {
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});
  const token = cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.postId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {

  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});
  const token = cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been disliked.");
    });
  });
};