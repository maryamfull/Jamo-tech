import React, { useEffect, useState } from 'react';
import './style.css';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';

const ProductFeedbackCard = () => {
    const [ProductListing, setProduct] = useState([]);
    const { productID } = useParams();

    useEffect(() => {
        fetchDate()
    }, [])

    const fetchDate = async () => {
        try {
            const response = await Axios.get(`http://localhost:8000/feedback/${productID}`);
            
            if (response?.status) {
                setProduct(response?.data.product)
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <div className="theme-bg height_full">
            <Header></Header>
            <div className="container py-4">
                <h2 className="mb-4 text-center">Product Feedback</h2>
                <div className="card mb-4 shadow-sm product-feedback-card">
                    <div className="row">
                        <div className="col-md-5 col-sm-12">
                            <img
                                src={ProductListing?.image}
                                alt={ProductListing?.title}
                                className="fb-img"
                            />
                        </div>
                        <div className="col-md-7 col-sm-12" >
                            <div className="card-body">
                                <h5 className="card-title text-primary">{ProductListing?.title}</h5>
                                <p className="text-muted mb-4">Code: <strong>{ProductListing?._id}</strong></p>
                                {ProductListing?.feedbacks?.map((item) =>
                                    <div className='mb-4'>
                                        <p className="card-text">"{item?.comment}"</p>
                                        <p className="card-text">
                                            <small className="text-muted">– {item?.user?.username}</small>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFeedbackCard;
