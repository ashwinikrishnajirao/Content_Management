import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const Likes = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    // Fetch the number of likes for the post from the server
    const fetchLikesCount = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/likes/count?postId=${postId}`, {
          method: "GET",
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error("Failed to fetch likes count");
        }
        const data = await response.json();
        setLikesCount(data.liked);
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };

    fetchLikesCount();
  }, [postId]);

  useEffect(() => {
    // Check if the current user has liked the post
    const fetchLikedStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/likes/status?postId=${postId}`, {
          method: "GET",
          credentials: 'include'
        });
        // Fetching liked status using the correct endpoint '/status'
        if (!response.ok) {
          throw new Error("Failed to fetch liked status");
        }
        const data = await response.json();
        setLiked(data.liked);
      } catch (error) {
        console.error("Error fetching liked status:", error);
      }
    };

    fetchLikedStatus();
  }, [postId]);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8800/api/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to like post");
      }
      setLiked(true);
      setLikesCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(`http://localhost:8800/api/likes?postId=${postId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to unlike post");
      }
      setLiked(false);
      setLikesCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  return (
    <div className="likes" style={{display:"flex",gap:"5px"}}>
      <button style={{ backgroundColor: "white", border: "white" }}onClick={liked ? handleUnlike : handleLike}>
      <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} style={{ backgroundColor: "white", border: "white" }} />
      </button>
      <span className="likes-count">{likesCount}</span>
    </div>
  );
};

export default Likes;
