import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8800/api/comments?postId=${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      return response.json();
    },
  });
  

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await fetch("http://localhost:8800/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  
  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({
      content: desc,
      commentedOn: new Date().toISOString(),
      user_id: currentUser.id, 
      post_id: postId,
    });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <input
          type="text"
          placeholder="What are your thoughts?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading..."
        : data.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="info">
                <span>{comment.username}</span>
                <p>{comment.content}</p>
              </div>
              <span className="date">
                {moment(comment.commentedOn).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
