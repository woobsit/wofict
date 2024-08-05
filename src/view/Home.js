import React, { useState, useEffect } from "react";
//React route dom
import { useNavigate, Link } from "react-router-dom";
//API service
import authService from "./../api/authService";
//utils
import { notify } from "./../utils/Notification";
//Spinner loader
import Loader from "./../components/atom/loader";
//Custom component
import Card from "./../components/atom/card/Card";
import Typography from "./../components/atom/typography/Typography";
//js-cookies
import Cookies from "js-cookie";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faBell,
  faEllipsisVertical,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchWebsiteInfo, setFetchWebsiteInfo] = useState({});
  const [fetchUserData, setFetchUserData] = useState({});
  const [fetchStatus, setFetchStatus] = useState(false);

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
  const userLogout = async () => {
    try {
      setLoading(true);
      const response = await authService.userLogout();

      if (response.status === 204) {
        setLoading(false);
        Cookies.remove("auth_user_token"); // remove token in cookies
        navigate("/");
      } else if (response.status === 401) {
        setLoading(false);
        notify("error", "Unauthorized", response.message);
      } else if (response.status === 500) {
        setLoading(false);
        notify("error", "System Error", response.message);
      }
    } catch (error) {
      setLoading(false);
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="dashboard-container">
        <sidebar className="sidebar">
          Sidebar
          <button onClick={userLogout} disabled={loading}>
            Logout
          </button>
        </sidebar>
        <div className="content-bar">
          <header className="header">
            <nav className="nav">
              <Link to="/home">
                <img
                  className="nav__logo"
                  src={
                    fetchStatus &&
                    fetchWebsiteInfo[2].value + fetchWebsiteInfo[3].value
                  }
                  alt={fetchStatus && fetchWebsiteInfo[0].value}
                  title={fetchStatus && fetchWebsiteInfo[0].value}
                />
              </Link>
              <div className="nav__menu-box">
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
                <FontAwesomeIcon icon={faCog} className="nav__menu-icon" />
                <FontAwesomeIcon icon={faBell} className="nav__menu-icon" />
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="nav__menu-icon"
                />
              </div>
            </nav>
          </header>

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
            <div>
              <Card className="" />
            </div>
            <div className="cards-container">
              <div className="cards-container__inner-box">
                <Card className="card card__card--blue" />
                <Card className="card card__card--red" />
              </div>
              <div className="cards-container__inner-box">
                <Card className="card card__card--green" />
                <Card className="card card__card--black" />
              </div>
            </div>
          </main>
          <footer>Footer</footer>
        </div>
      </div>
    </>
  );
}

export default Home;
