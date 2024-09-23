import React, { useState } from "react";
//React route dom
import { useNavigate, Link } from "react-router-dom";
//API service
import authService from "./../../api/authService";
import getAuthUserData from "./../../api/handleAuthUserCookies";
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
//import Card from "./../atom/card/Card";
// React Bootstrap
import { Dropdown, DropdownButton } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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
        Cookies.remove("auth_user_data"); // remove token in cookies
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

  const { user, website_info } = getAuthUserData();
  return (
    <>
      {loading && <Loader />}
      <header className="header">
        <nav className="nav">
          <Link to="/home">
            <img
              className="nav__logo"
              src={website_info[2].value + website_info[3].value}
              alt={website_info[0].value}
              title={website_info[0].value}
            />
          </Link>
          <div className="nav__menu-box">
            <img
              className="nav__menu-image"
              src={website_info[2].value + "" + user.photo}
              alt={user.firstname + " " + user.surname}
              title={user.firstname + " " + user.surname}
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
              <DropdownButton
                id="dropdown-basic-button"
                title="Menu"
                align="end"
              >
                <Dropdown.Item href="#/action-1">List One</Dropdown.Item>
                <Dropdown.Item onClick={userLogout}>Log out</Dropdown.Item>
              </DropdownButton>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
