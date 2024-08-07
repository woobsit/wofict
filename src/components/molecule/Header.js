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
import {
  faCog,
  faBell,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
//Spinner loader
import Loader from "./../../components/atom/loader";

function Header() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchWebsiteInfo, setFetchWebsiteInfo] = useState({});
  const [fetchUserData, setFetchUserData] = useState({});

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
              src={`${fetchWebsiteInfo[2]?.value ?? ""}${fetchWebsiteInfo[3]?.value ?? ""}`}
              alt={fetchWebsiteInfo[0]?.value ?? ""}
              title={fetchWebsiteInfo[0]?.value ?? ""}
            />
          </Link>
          <div className="nav__menu-box">
            <img
              className="nav__menu-image"
              src={`${fetchWebsiteInfo[2]?.value ?? ""}${fetchUserData.photo ?? ""}`}
              alt={`${fetchUserData.firstname ?? ""} ${fetchUserData.surname ?? ""}`}
              title={`${fetchUserData.firstname ?? ""} ${fetchUserData.surname ?? ""}`}
            />
            <FontAwesomeIcon icon={faCog} className="nav__menu-icon" />
            <FontAwesomeIcon icon={faBell} className="nav__menu-icon" />
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="nav__menu-icon"
              onClick={userLogout}
              disabled={loading}
            />
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
