import React, { Fragment, useEffect, useState } from "react";
import { numberWithCommas } from "../utils/helperFunctions";
import breeze1 from "../assets/breeze1.jpg";
import breeze2 from "../assets/breeze2.jpg";

const Home = () => {
  const [userData, setUserData] = useState(null);

  // call the getUsers function when the component loads
  useEffect(() => {
    getUsers();
  }, []);

  // fetch the data from the backend
  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/");
      const jsonData = await response.json();
      setUserData(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const renderInfoSection = () => {
    return (
      <Fragment>
        {userData ? (
          <h2>You have {numberWithCommas(userData.points)} points!</h2>
        ) : null}
      </Fragment>
    );
  };

  // button that navigates to balances page
  const renderButtonSection = () => {
    return (
      <Fragment>
        <a href="/tx" className="btn ">
          Add Transaction
        </a>
        <a href="/spend" className="btn ">
          Spend Points
        </a>
        <a href="/balances" className="btn ">
          View Payer Balances
        </a>
      </Fragment>
    );
  };

  // render images breeze1 and breeze2 side by side size 500 x 500
  const renderImageSection = () => {
    return (
      <div>
        <img src={breeze1} alt="breeze1" width="20%" />
        <img src={breeze2} alt="breeze2" width="20%" />
      </div>
    );
  };

  return (
    <div className="center">
      <div className="center-block">
        <h1>Hey Breeze!</h1>
        {renderInfoSection()}

        {renderButtonSection()}

        {renderImageSection()}
      </div>
    </div>
  );
};

export default Home;
