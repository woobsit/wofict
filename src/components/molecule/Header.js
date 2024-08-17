import React, { useState, useEffect } from "react";
//React route dom
import { useNavigate, Link } from "react-router-dom";
//API service
import authService from "./../../api/authService";
//js-cookies
import Cookies from "js-cookie";
//utils
import { notify } from "./../../utils/Notification";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faBell, faBars } from "@fortawesome/free-solid-svg-icons";
//Spinner loader
import Loader from "./../../components/atom/loader";
//Atom component
import Card from "./../atom/card/Card";

function Header() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchWebsiteInfo, setFetchWebsiteInfo] = useState({});
  const [fetchUserData, setFetchUserData] = useState({});
  const [fetchWebsiteDataStatus, setFetchWebsiteDataStatus] = useState(false);
  const [fetchUserDataStatus, setFetchUserDataStatus] = useState(false);

  const [menuStatus, setMenuStatus] = useState(false);

  const setMenu = () => {
    setMenuStatus(!menuStatus);
  };

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

  useEffect(() => {
    async function displayWebsiteInfo() {
      try {
        const response = await authService.websiteInfo();
        if (response.status === 201) {
          setFetchWebsiteInfo(response.result);
          setFetchWebsiteDataStatus(true);
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
          setFetchUserData(response.result);
          setFetchUserDataStatus(true);
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
      {loading && <Loader />}
      <header className="header">
        <nav className="nav">
          <Link to="/home">
            <img
              className="nav__logo"
              src={
                fetchWebsiteDataStatus &&
                fetchWebsiteInfo[2].value + "" + fetchWebsiteInfo[3].value
              }
              alt={fetchWebsiteDataStatus && fetchWebsiteInfo[0].value}
              title={fetchWebsiteDataStatus && fetchWebsiteInfo[0].value}
            />
          </Link>
          <div className="nav__menu-box">
            <img
              className="nav__menu-image"
              src={
                fetchWebsiteDataStatus &&
                fetchUserDataStatus &&
                fetchWebsiteInfo[2].value + "" + fetchUserData.photo
              }
              alt={
                fetchWebsiteDataStatus &&
                fetchUserDataStatus &&
                fetchUserData.firstname + " " + fetchUserData.surname
              }
              title={
                fetchWebsiteDataStatus &&
                fetchUserDataStatus &&
                fetchUserData.firstname + " " + fetchUserData.surname
              }
            />
            <div className="nav__menu-icon__wrapper nav__menu-icon__wrapper-cog">
              <FontAwesomeIcon
                icon={faCog}
                className="nav__menu-icon nav__menu-icon-cog"
              />
            </div>
            <div className="nav__menu-icon__wrapper nav__menu-icon__wrapper-bell">
              <FontAwesomeIcon
                icon={faBell}
                className="nav__menu-icon nav__menu-icon-bell"
              />
            </div>
            <div className="nav__menu-icon__wrapper nav__menu-icon__wrapper-bars">
              <FontAwesomeIcon
                icon={faBars}
                className="nav__menu-icon nav__menu-icon-bars"
                onClick={setMenu}
              />
            </div>
            {menuStatus && (
              <Card className="header-hamburger">
                <ul>
                  <li>list one</li>
                  {/* <li onClick={userLogout} disabled={loading}>
              Log out
            </li> */}
                </ul>
              </Card>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
