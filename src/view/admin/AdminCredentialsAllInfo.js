import React, { useState, useEffect } from "react";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
//Custom component
import Typography from "../../components/atom/typography/Typography";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
//API service
import authService from "../../api/authService";
import getAuthAdminData from "./../../api/handleAuthAdminCookies";
//utils
import { notify } from "../../utils/Notification";

function AdminCredentialsAllInfo() {
  const { id } = useParams();
  const { website_info } = getAuthAdminData();

  const [fetchUserByCredentialsData, setFetchUserByCredentialsData] = useState(
    []
  );
  const [fetchUserByCredentialsStatus, setFetchUserByCredentialsStatus] =
    useState(false);

  useEffect(() => {
    if (id) {
      fetchUserByCredentials(id); // Pass the id here
    }
  }, [id]);

  async function fetchUserByCredentials(id) {
    try {
      const response = await authService.getUserByCredentials(id);
      if (response.status === 201) {
        setFetchUserByCredentialsData(response.result);
        setFetchUserByCredentialsStatus(true);
      } else if (response.status === 404) {
        notify(
          "error",
          "Error",
          "User not found. Please check the ID and try again."
        );
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

  return (
    <div className="content">
      <AdminHeader />
      <div className="image-container">
        <div>
          <Typography variant="h3">User Info</Typography>
        </div>
        <div>
          <FontAwesomeIcon icon={faHome} className="nav__menu-icon" /> /
          <Typography variant="span"> user-info</Typography>
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
            placeholder="Search student"
            className="landing-form__input"
            name="email"
          />
        </div>
      </div>
      <div>
        <div className="card user-name">
          {fetchUserByCredentialsStatus && (
            <>
              <img
                src={
                  website_info[2].value + "" + fetchUserByCredentialsData.photo
                }
                alt={
                  fetchUserByCredentialsData.firstname +
                  " " +
                  fetchUserByCredentialsData.surname
                }
                title={
                  fetchUserByCredentialsData.firstname +
                  " " +
                  fetchUserByCredentialsData.surname
                }
                className="user-image"
              />
              <div className="user-fullname-email">
                <Typography variant="h4" className="user-fullname">
                  {fetchUserByCredentialsData.firstname +
                    " " +
                    fetchUserByCredentialsData.surname}
                </Typography>
                <Typography variant="p" className="user-email">
                  {fetchUserByCredentialsData.email}
                </Typography>
              </div>
            </>
          )}
        </div>
        <div className="user-info-wrapper">
          <div className="card user-info user-personal-info"></div>
          <div className="card user-info user-education-info"></div>
          <div className="card user-info user-other-info"></div>
        </div>
      </div>
    </div>
  );
}

export default AdminCredentialsAllInfo;
