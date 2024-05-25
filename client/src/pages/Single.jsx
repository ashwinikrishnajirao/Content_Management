import React, { useEffect, useState, useContext } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import Comments from "../components/Comments.jsx"; 
import moment from "moment";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";
import Likes from "../components/Likes.jsx"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const Single = () => {
  const [post, setPost] = useState({});
  const [showComments, setShowComments] = useState(false); // State to manage comments visibility
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/posts/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8800/api/posts/${postId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const handleCommentsClick = () => {
    setShowComments(!showComments); // Toggle comments visibility
  };

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="" />
        <div className="user">
          {post.userImg && (
            <img src={post.userImg} alt="" />
          )}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser && currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=${postId}`} state={post}>
                <img src={Edit} alt="" style= {{width:"25px",height:"25px"}} />
              </Link>
              <img onClick={handleDelete} style= {{width:"25px",height:"25px"}} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}
        ></p>
        <div className ="lc">
          <Likes postId = {postId}/>
          <FontAwesomeIcon icon={faComments} onClick={handleCommentsClick} style={{ cursor: "pointer" }} />
        </div>
        {/* Render Comments only when showComments is true */}
        {showComments && <Comments postId={postId} />}
      </div>
      <Menu cat={post.category} postId={postId} />
      
      {/* FontAwesomeIcon for comments */}
    </div>
  );
};

export default Single;
