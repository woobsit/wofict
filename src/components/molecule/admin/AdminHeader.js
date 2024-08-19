import React, { useState, useEffect } from "react";
//React route dom
import { useNavigate, Link } from "react-router-dom";
//API service
import authService from "./../../../api/authService";
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
import Card from "./../../atom/card/Card";

function AdminHeader() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchWebsiteInfo, setFetchWebsiteInfo] = useState({});
  const [fetchAdminData, setFetchAdminData] = useState({});
  const [fetchWebsiteDataStatus, setFetchWebsiteDataStatus] = useState(false);
  const [fetchAdminDataStatus, setFetchAdminDataStatus] = useState(false);

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
        Cookies.remove("auth_admin_token"); // remove token in cookies
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
        const response = await authService.getAdmin();

        if (response.status === 201) {
          setFetchAdminData(response.result);
          setFetchAdminDataStatus(true);
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
                fetchAdminDataStatus &&
                fetchWebsiteInfo[2].value + "" + fetchAdminData.photo
              }
              alt={
                fetchWebsiteDataStatus &&
                fetchAdminDataStatus &&
                fetchAdminData.firstname + " " + fetchAdminData.surname
              }
              title={
                fetchWebsiteDataStatus &&
                fetchAdminDataStatus &&
                fetchAdminData.firstname + " " + fetchAdminData.surname
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
              <Card
                className="header-hamburger"
                onClick={adminLogout}
                disabled={loading}
              >
                <ul>
                  <li>list one</li>
                  {<li>Log out</li>}
                </ul>
              </Card>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default AdminHeader;
