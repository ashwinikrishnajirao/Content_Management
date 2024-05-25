import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const { cat, postId } = req.query;
  let q = `SELECT p.*, c.name AS category 
           FROM posts p 
           LEFT JOIN post_category pc ON p.id = pc.post_id 
           LEFT JOIN category c ON pc.cat_id = c.cid`;

  const queryParams = [];
  if (cat) {
    q += ` WHERE c.name = ?`;
    queryParams.push(cat);
  }
  if (postId) {
    q += ` AND p.id != ?`;
    queryParams.push(postId);
  }
  q += ` ORDER BY p.date DESC`;
  db.query(q, queryParams, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};


export const getPost = (req, res) => {
  const q = `SELECT p.id, u.username, p.title, p.desc, p.img, u.img AS userImg, c.name AS category, p.date 
             FROM user_info u 
             JOIN posts p ON u.id = p.user_id 
             LEFT JOIN post_category pc ON p.id = pc.post_id 
             LEFT JOIN category c ON pc.cat_id = c.cid 
             WHERE p.id = ?`;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});
  const token = cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { title, desc, img, date, cat } = req.body;
    // Check if a post with both the same title and content exists
    const checkBothQuery = `SELECT * FROM posts WHERE title = ? AND \`desc\` = ?`;
    db.query(checkBothQuery, [title, desc], (checkBothErr, checkBothResult) => {
      if (checkBothErr) return res.status(500).json(checkBothErr);
      if (checkBothResult.length > 0) {
        return res.status(409).json("Post with the same title and content already exists.");
      }
    // Check if a post with the same title exists
    const checkTitleQuery = `SELECT * FROM posts WHERE title = ?`;
    db.query(checkTitleQuery, [title], (checkTitleErr, checkTitleResult) => {
      if (checkTitleErr) return res.status(500).json(checkTitleErr);
      if (checkTitleResult.length > 0) {
        return res.status(409).json("Post with the same title already exists.");
      }

      // Check if a post with the same content exists
      const checkContentQuery = `SELECT * FROM posts WHERE \`desc\` = ?`;
      db.query(checkContentQuery, [desc], (checkContentErr, checkContentResult) => {
        if (checkContentErr) return res.status(500).json(checkContentErr);
        if (checkContentResult.length > 0) {
          return res.status(409).json("Post with the same content already exists.");
        }

          // Retrieve category ID based on category name
          const catQuery = `SELECT cid FROM category WHERE name = ?`;
          db.query(catQuery, [cat], (catErr, catResult) => {
            if (catErr) return res.status(500).json(catErr);
            if (catResult.length === 0) {
              return res.status(404).json("Category not found");
            }

            const categoryId = catResult[0].cid;

            // Insert post into posts table
            const postQuery = `INSERT INTO posts(title, \`desc\`, img, date, user_id) VALUES (?, ?, ?, ?, ?)`;
            const postValues = [title, desc, img, date, userInfo.id];

            db.query(postQuery, postValues, (postErr, postResult) => {
              if (postErr) return res.status(500).json(postErr);

              const postId = postResult.insertId;

              // Insert into post_category table
              const postCatQuery = `INSERT INTO post_category(post_id, cat_id) VALUES (?, ?)`;
              db.query(postCatQuery, [postId, categoryId], (pcErr, pcResult) => {
                if (pcErr) return res.status(500).json(pcErr);

                return res.json("Post has been created.");
              });
            });
          });
        });
      });
    });
  });
};



export const deletePost = (req, res) => {
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});
  const token = cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;

    // Delete post-category relationships first
    const delCatQuery = "DELETE FROM post_category WHERE post_id = ?";
    db.query(delCatQuery, [postId], (delCatErr, delCatResult) => {
      if (delCatErr) return res.status(500).json(delCatErr);

      // If deletion from post_category is successful, proceed to delete post
      const delPostQuery = "DELETE FROM posts WHERE id = ? AND user_id = ?";
      db.query(delPostQuery, [postId, userInfo.id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
          return res.status(403).json("You can delete only your post!");
        }

        return res.json("Post has been deleted!");
      });
    });
  });
};


export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const { title, desc, img, cat } = req.body;

    const updatePostQuery =
      "UPDATE posts SET title=?, `desc`=?, img=? WHERE id = ? AND user_id = ?";
    const updateValues = [title, desc, img, postId, userInfo.id];

    db.query(updatePostQuery, updateValues, (updateErr, updateResult) => {
      if (updateErr) return res.status(500).json(updateErr);

      if (updateResult.affectedRows === 0) {
        return res.status(403).json("You can update only your post!");
      }
      const catQuery = `SELECT cid FROM category WHERE name = ?`;
      db.query(catQuery, [cat], (catErr, catResult) => {
        if (catErr) return res.status(500).json(catErr);
        if (catResult.length === 0) {
          return res.status(404).json("Category not found");
        }

        const categoryId = catResult[0].cid;
        // Update post-category relationship
        const updateCatQuery = "UPDATE post_category SET cat_id = ? WHERE post_id = ?";
        db.query(updateCatQuery, [categoryId, postId], (updateCatErr, updateCatResult) => {
          if (updateCatErr) return res.status(500).json(updateCatErr);

          return res.json("Post has been updated.");
        });
      });
    });
  });
};
