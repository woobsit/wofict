import React, { useState, useEffect } from "react";
//React route dom
import authService from "./../api/authService";
//utils
import { notify } from "./../utils/Notification";
//Custom component
import Card from "./../components/atom/card/Card";
import Typography from "./../components/atom/typography/Typography";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
//Molecule
import Header from "./../components/molecule/Header";
import Sidebar from "./../components/molecule/Sidebar";

//App scss
import "./../App.scss";

function Home() {
  const [fetchUserData, setFetchUserData] = useState({});
  const [fetchStatus, setFetchStatus] = useState(false);
  const [fetchWebsiteInfo, setFetchWebsiteInfo] = useState({});

  useEffect(() => {
    async function displayWebsiteInfo() {
      try {
        const response = await authService.websiteInfo();
        if (response.status === 201) {
          setFetchStatus(true);
          setFetchWebsiteInfo(response.result);
        } else if (response.status === 500) {
          notify("error", "System Error", response.message);
        }
      } catch (error) {
        notify(
          "error",
          "Error",
          "An unexpected error occurred. Please try again."
        );
      }
    }
    displayWebsiteInfo();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await authService.getUser();

        if (response.status === 201) {
          setFetchStatus(true);
          setFetchUserData(response.result);
        } else if (response.status === 500) {
          notify("error", "System Error", response.message);
        }
      } catch (error) {
        notify(
          "error",
          "Error",
          "An unexpected error occurred. Please try again."
        );
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="dashboard-container">
        <div className="content">
          <Sidebar />
          <div className="content__content-bar">
            <Header />
            <main>
              <div className="image-container">
                <div>
                  <Typography variant="h3">Dashboard</Typography>
                  <Typography variant="span">Welcome back, ahmed </Typography>
                </div>
                <div>
                  <FontAwesomeIcon icon={faHome} className="nav__menu-icon" /> /
                  <Typography variant="span"> dashboard</Typography>
                </div>
              </div>
              <div className="search-input-container">
                <div className="landing-form__input-box">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="landing-form__input-icon"
                  />
                  <input
                    type="text"
                    placeholder="search"
                    className="landing-form__input"
                    name="email"
                  />
                </div>
              </div>
              <div className="card-student-info-container">
                <Card className="card-student-info">
                  <div>
                    <img
                      className="nav__menu-image"
                      src={
                        fetchStatus &&
                        fetchWebsiteInfo[2].value + fetchUserData.photo
                      }
                      alt={
                        fetchStatus &&
                        fetchUserData.firstname + fetchUserData.surname
                      }
                      title={
                        fetchStatus &&
                        fetchUserData.firstname + fetchUserData.surname
                      }
                    />
                    <Typography variant="h3">Olusesi Ahmed</Typography>
                  </div>
                  <div></div>
                  <div></div>
                </Card>
              </div>
              <div className="cards-container">
                <div className="cards-container__inner-box">
                  <Card className="card card__card--blue">dfdfd</Card>
                  <Card className="card card__card--red">hdfefe</Card>
                </div>
                <div className="cards-container__inner-box">
                  <Card className="card card__card--green">Hello</Card>
                  <Card className="card card__card--black">dfdfd</Card>
                </div>
              </div>
            </main>
            <footer>Footer</footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
