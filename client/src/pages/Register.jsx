import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
    if (!response.ok) {
      if (data === "User already exists!") {
        setError({ message: "User already exists!" });
      } else {
        throw new Error("Registration failed");
      }
    } else {
      navigate("/login");
    }
  } catch (error) {
    console.error(error);
    setError({ message: "Registration failed. Please try again." });
  }
};

  return (
    <div className="auth">
      <div className={`wrapper`}>
        <div className={`form-container sign-up `}>
            <form>
              <h2>Register</h2>
              <div className="form-group">
                <input type="text" name = "username" onChange={handleChange} required/>
                <label htmlFor="">Username</label>
              </div>
              <div className="form-group">
                <input type="text" name = "email" onChange={handleChange} required/>
                <label htmlFor="">Email</label>
              </div>
              <div className="form-group">
                <input type="password" name = "password" onChange={handleChange} required/>
                <label htmlFor="">Password</label>
              </div>
              <button type = "submit" onClick = {handleSubmit} className = "btn">
                Register
              </button>
              {err && <p>{err.message}</p>}
              <span className='link' >Already have an account?<Link to ="/Login"> Login</Link></span>
            </form>
          </div>
        </div>
    </div>
  );
};

export default Register;
