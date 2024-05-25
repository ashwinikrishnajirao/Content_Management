import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);


  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs)
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };
  return (
    <div className="auth">
      <div className={`wrapper`}>
        <div className={`form-container sign-in`}>
          <form>
            <h2>Login</h2>
            <div className="form-group">
              <input type="text" name = "username" onChange = {handleChange} required/>
              <label htmlFor="">Username</label>
            </div>
            <div className="form-group">
              <input type="password" name = "password" onChange = {handleChange}  required/>
              <label htmlFor="">Password</label>
            </div>
            <button className = "btn" onClick={handleSubmit}>Login</button>
            {err && <p>{console.log(err.message)}</p>}
            
            <span className='link'>
              Don't you have an account? <Link to="/register">Register</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
