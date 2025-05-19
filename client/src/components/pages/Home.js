import React, { useEffect } from "react";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeoLocationData, fetchIpAddress } from "../../redux/ipGeoSlice";
import Footer from "./Footer";

function HomePage() {
  const dispatch = useDispatch();
  const { ip, geoData, loading, error } = useSelector((state) => state.data);

  // Fetch IP address when the component loads
  useEffect(() => {
    dispatch(fetchIpAddress());
  }, [dispatch]);

  // Fetch geolocation data when IP is available
  useEffect(() => {
    if (ip) {
      dispatch(fetchGeoLocationData(ip));
    }
  }, [dispatch, ip]);

  return (
    <div className="theme-bg height_full">
      <Header />
      <div className="container">
        <div className="card">
          <div className="text-center">
            <h1 className="my-4">Mobile Phones at Best Prices in Oman</h1>
            <div className="text-center my-4">
              <img
                src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSeW1XoHqyqpO3d3EFqK2aC5kOwO3Q3rEVXNz1kv9JqYvS1rOSY"
                alt="JAMO TECH Logo"
                style={{ maxWidth: "200px", height: "auto" }}
              />
            </div>
            <div className="">
              {/* <div>IP: {ip}</div> */}
              {/* <div>Country: {geoData?.location?.country}</div> */}
              {/*<div>Region: {geoData?.location?.region}</div>*/}
              <div>Region: Al Batinah, Shinas/Aqr</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
