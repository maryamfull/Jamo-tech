import React, { useState } from 'react';
import './style.css'; // Custom styles
import { useParams } from 'react-router-dom';
import Header from './Header';

const FeedbackForm = () => {
    const [message, setMessage] = useState("");
    const { productID } = useParams();
    const [submitted, setSubmitted] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username"));

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const submitProductFeedback = async (e) => {
        e.preventDefault()

        setSubmitted(true);
        const userId = localStorage.getItem("userId")

        try {
            const response = await fetch(`http://localhost:8000/product/${productID}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, comment: message }),
            });
            const data = await response.json();
            if (data.status === "status") {
                setSubmitted(false)
            }

        } catch (error) {
            setSubmitted(false)
            return {
                success: false,
                message: error.message,
            };
        }
    };


    return (
        <div className="theme-bg height_full">
            <Header />
            <div className="container p-4">
                <div className="card shadow-lg p-4 feedback-card">
                    <h3 className="mb-4 text-center text-primary">We Value Your Feedback 💬</h3>
                    {submitted ?
                        <div className="alert alert-success mt-3" role="alert">
                            Thank you for your feedback! 🌟
                        </div>
                        :
                        <form onSubmit={submitProductFeedback}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Product ID"
                                    value={productID}
                                    readOnly
                                />
                                <label>Product ID</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Name"
                                    placeholder="Name"
                                    value={username}
                                    readOnly
                                />
                                <label>User</label>
                            </div>

                            <div className="form-floating mb-3">
                                <textarea
                                    className="form-control"
                                    placeholder="Leave your feedback here"
                                    name="message"
                                    style={{ height: '200px' }}
                                    value={message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                                <label>Feedback</label>
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-lg">
                                    <i className="fas fa-paper-plane me-2"></i> Submit Feedback
                                </button>
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
