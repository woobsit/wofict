import React, { useState } from "react";
//React route dom
import { useNavigate, Link } from "react-router-dom";
//API service
import authService from "./../../../api/authService";
import getAuthAdminData from "./../../../api/handleAuthAdminCookies";
//js-cookies
import Cookies from "js-cookie";
//utils
import { notify } from "./../../../utils/Notification";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faBell, faBars } from "@fortawesome/free-solid-svg-icons";
//Spinner loader
import Loader from "./../../../components/atom/loader";
//Atom component
//import Card from "./../../atom/card/Card";
// React Bootstrap
import { Dropdown } from "react-bootstrap";

function AdminHeader() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [menuStatus, setMenuStatus] = useState(false);

  const setMenu = () => {
    setMenuStatus(!menuStatus);
  };

  const adminLogout = async () => {
    try {
      setLoading(true);
      const response = await authService.adminLogout();

      if (response.status === 204) {
        setLoading(false);
        Cookies.remove("auth_admin_data"); // remove token in cookies
        navigate("/admin/login");
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

  const { admin_user, website_info } = getAuthAdminData();

  return (
    <>
      {loading && <Loader />}
      <header className="header">
        <nav className="nav">
          <Link to="/home">
            <img
              className="nav__logo"
              src={website_info[2].value + "" + website_info[3].value}
              alt={website_info[0].value}
              title={website_info[0].value}
            />
          </Link>
          <div className="nav__menu-box">
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
              />
            </div>

            <img
              className="nav__menu-image"
              src={website_info[2].value + "" + admin_user.photo}
              alt={admin_user.firstname + " " + admin_user.surname}
              title={admin_user.firstname + " " + admin_user.surname}
            />
            <Dropdown show={menuStatus} className="dropdown-menu-end">
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                as="div" // Needed to avoid a button being rendered
                onClick={setMenu}
              >
                {/* The icon button will be used to trigger the dropdown */}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end"></Dropdown.Menu>
            </Dropdown>
            {menuStatus && (
              <Dropdown show={menuStatus} className="dropdown-menu-end">
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  as="div" // Needed to avoid a button being rendered
                  onClick={setMenu}
                >
                  {/* The icon button will be used to trigger the dropdown */}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={adminLogout}>Log out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default AdminHeader;
