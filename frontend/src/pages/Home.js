import React, { Fragment, useEffect, useState } from "react";
import breeze1 from "../assets/breeze1.jpg";
import breeze2 from "../assets/breeze2.jpg";
import { numberWithCommas } from "../utils/helperFunctions";

const Home = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // fetch the data from the backend
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/");
        const jsonData = await response.json();
        setUserData(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };
    getUser();
  }, []);

  const renderInfoSection = () => {
    return (
      <Fragment>
        {userData ? (
          <div>
            <h2>Hey Breeze!</h2>
            <h3>You have {numberWithCommas(userData.points)} points!</h3>
          </div>
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
        <img src={breeze1} alt="breeze1" width="18%" />
        <img src={breeze2} alt="breeze2" width="18%" />
      </div>
    );
  };

  return (
    <div className="center">
      <div className="center-block">
        {renderInfoSection()}

        {renderButtonSection()}

        {renderImageSection()}
      </div>
    </div>
  );
};

export default Home;
