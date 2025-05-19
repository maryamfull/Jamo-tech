import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import Footer from "./Footer";
const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const [errMsg, setErrMsg] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        const isLogin = localStorage.getItem("isLoggedIn")
        if (isLogin) {
            navigate("/")
        }
    }, [])

    const handleOnChnage = (e) => {
        const value = e.target.value
        const name = e.target.name
        setData({ ...data, [name]: value })
    }

    const submitHandler = async (e) => {
        errMsg["username"] = false
        errMsg["password"] = false
        e.preventDefault();
        if (data.username == "") {
            setErrMsg({ ...errMsg, username: true })
            return;
        }
        if (data.password == "") {
            setErrMsg({ ...errMsg, password: true })
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8000/login`, {
                username: data.username,
                password: data.password,
            });
            if (response.status == 200) {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("username", response.data.user.username);
                localStorage.setItem("userId", response.data.user._id);
                localStorage.setItem("userType", response.data.user.userType);
                setData({
                    username: "",
                    password: "",
                });
                if (response.data.user.userType === "Admin") {
                    navigate("/Admin")
                }
                else {
                    navigate("/")
                }
                alert("loggedIn successfully")
            }
        } catch (error) {
            alert(error.response?.data?.message || error.message || "something went wrong")
            console.error("Error:", error.response?.data?.message || error.message);
        }
    };
    return (
        <div className="theme-bg height_full">
            <h3 className="auth_header">Login</h3>
            <div className="container center mb-4">
                <div className="login-cnt">
                    <img
                        src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSeW1XoHqyqpO3d3EFqK2aC5kOwO3Q3rEVXNz1kv9JqYvS1rOSY"
                        className="product-logo" />
                    <p className="login-heading">Login</p>
                    <div className="mb-10">
                        <div className="d-flex">
                            <label>Username:</label>
                            <input type="text" value={data.username} onChange={handleOnChnage} name="username" className="usernameinput" />
                        </div>
                        {errMsg.username && <span className="err-msg">Username is required</span>}
                    </div>

                    <div className="mb-10">
                        <div className="d-flex">
                            <label>Passowrd:</label>
                            <input type="password" value={data.password} onChange={handleOnChnage} name="password" className="passwordinput" />
                        </div>
                        {errMsg.password && <span className="err-msg">Passowrd is required</span>}
                    </div>
                    <button className="loginBtn" onClick={submitHandler}>Login</button>
                    <span className="if-you">Don't have account:<Link className="signupbtn" to={"/signup"} >Create an account</Link></span>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default Login;
