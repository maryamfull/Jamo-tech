import React, { useEffect, useState, } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const [errMsg, setErrMsg] = useState({
    role: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    matchPassowrd: ""
  });

  useEffect(() => {
    const isLogin = localStorage.getItem("isLoggedIn")
    if (isLogin) {
      navigate("/")
    }
  }, [])

  const submitHandler = async (e) => {
    errMsg["username"] = false
    errMsg["email"] = false
    errMsg["password"] = false
    errMsg["confirmPassword"] = false
    errMsg["matchPassowrd"] = false
    errMsg["role"] = false

    e.preventDefault();
    if (data.role == "") {
      setErrMsg({ ...errMsg, role: true })
      return;
    }
    if (data.username == "") {
      setErrMsg({ ...errMsg, username: true })
      return;
    }
    if (data.email == "") {
      setErrMsg({ ...errMsg, email: true })
      return;
    }
    if (data.password == "") {
      setErrMsg({ ...errMsg, password: true })
      return;
    }
    if (data.confirmPassword == "") {
      setErrMsg({ ...errMsg, confirmPassword: true })
      return;
    }

    if (data.confirmPassword != data.password) {
      setErrMsg({ ...errMsg, matchPassowrd: true })
      return;
    }

    try {
      const response = await Axios.post(`http://localhost:8000/register`, {
        username: data.username,
        email: data.email,
        password: data.password,
        userType: data.role
      });
      if (response.status == 201) {
        //user created successfully
        navigate('/login');
        alert("User created successfully")
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "something went wrong")
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  const handleOnChnage = (e) => {
    const value = e.target.value
    const name = e.target.name
    setData({ ...data, [name]: value })
  }

  return (
    <div className="theme-bg height_full">
      <h3 className="auth_header">Signup</h3>
      <div className="container center">
        <div className="login-cnt">
          <img
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSeW1XoHqyqpO3d3EFqK2aC5kOwO3Q3rEVXNz1kv9JqYvS1rOSY"
            className="product-logo" />
          <p className="login-heading">Create your account</p>
          <div className="mb-10">
            <div className="d-flex">
              <label htmlFor="roleSelect" className="form-label">Select Role:</label>
              <select
                id="roleSelect"
                name="role"
                className="usernameinput"
                value={data.role}
                onChange={handleOnChnage}
              >
                <option value="">-- Select Role --</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            {errMsg.role && <span className="err-msg">Role is required</span>}
          </div>

          <div className="mb-10">
            <div className="d-flex">
              <label>Username:</label>
              <input type="text" value={data.username} onChange={handleOnChnage} name="username" className="usernameinput" />
            </div>
            {errMsg.username && <span className="err-msg">Username is required</span>}
          </div>

          <div className="mb-10">
            <div className="d-flex">
              <label>Email:</label>
              <input type="text" value={data.email} onChange={handleOnChnage} name="email" className="passwordinput" />
            </div>
            {errMsg.email && <span className="err-msg">Email is required</span>}
          </div>

          <div>
            <div className="d-flex mb-10">
              <label>Password:</label>
              <input type="password" value={data.password} onChange={handleOnChnage} name="password" className="passwordinput" />
            </div>
            {errMsg.password && <span className="err-msg">Password is required</span>}
          </div>

          <div className="mb-10">
            <div className="d-flex">
              <label>Confirm Passowrd:</label>
              <input type="password" value={data.confirmPassword} onChange={handleOnChnage} name="confirmPassword" className="passwordinput" />
            </div>
            {errMsg.confirmPassword && <span className="err-msg">Confirm Passowrd is required</span>}
            {errMsg.matchPassowrd && <span className="err-msg">Confirm Passowrd should match with password</span>}
          </div>
          <button onClick={submitHandler} className="loginBtn">Signup</button>
          <Link to={"/login"} className="if-you"><button className="btn ">Login</button></Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default SignUp;
