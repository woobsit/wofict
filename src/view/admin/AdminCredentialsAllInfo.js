import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
//Custom component
import Typography from "../../components/atom/typography/Typography";
import Button from "react-bootstrap/Button";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
//API service
import authService from "../../api/authService";
import getAuthAdminData from "./../../api/handleAuthAdminCookies";
import axiosInstance from "./../../api/axiosInstance";

//utils
import { notify } from "../../utils/Notification";

function AdminCredentialsAllInfo() {
  const { id } = useParams();
  const { website_info } = getAuthAdminData();
  const navigate = useNavigate();

  const [fetchUserByCredentialsData, setFetchUserByCredentialsData] = useState(
    []
  );
  const [fetchUserByCredentialsStatus, setFetchUserByCredentialsStatus] =
    useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

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

  async function fetchCredentials(id) {
    try {
      const response = await axiosInstance.get(`/view-credentials/${id}`, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const pdfUrl = URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        setPdfUrl(pdfUrl);
      } else if (response.status === 404) {
        notify("error", "Error", "PDF not found");
      } else {
        throw new Error("Failed to fetch PDF");
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
                <Typography variant="span" className="user-email">
                  {fetchUserByCredentialsData.email}
                </Typography>
              </div>
            </>
          )}
        </div>
        <div className="user-info-wrapper">
          <div className="card user-info user-personal-info">
            <Typography variant="h4" className="user-text">
              Personal Info
            </Typography>
            <div className="">
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Firstname:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.firstname}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Surname:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.surname}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Other names:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.other_names}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Gender:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.gender}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Date of Birth:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.date_of_birth}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Contact address:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.contact_address}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Phone number:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.phone_number}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  State of Origin:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.state_of_origin}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Credentials status:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                  fetchUserByCredentialsData.credentials_status === 1
                    ? "Verified"
                    : "Unverified"}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Guarantor status:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                  fetchUserByCredentialsData.guarantors_status === 1
                    ? "Verified"
                    : "Unverified"}
                </Typography>
              </div>
            </div>
          </div>
          <div className="card user-info user-education-info">
            <Typography variant="h4" className="user-text">
              Educational Background
            </Typography>
            <div className="">
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Course:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  To be set later
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Session:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.class_sessions}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Qualification Level:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByCredentialsStatus &&
                    fetchUserByCredentialsData.qualification_level}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  English Language Fluency:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  To be set later
                </Typography>
              </div>
            </div>
          </div>
          <div className="card user-info user-other-info">
            <Typography variant="h4" className="user-text">
              Other Info
            </Typography>
            <div className="user-heading-name">
              <Typography variant="h6" className="user-heading">
                Conversation Strenght:
              </Typography>
              <Typography variant="span" className="user-name-value">
                To be set later
              </Typography>
            </div>
            <div className="user-heading-name">
              <Typography variant="h6" className="user-heading">
                Computer Literacy:
              </Typography>
              <Typography variant="span" className="user-name-value">
                To be set later
              </Typography>
            </div>
            <div className="user-heading-name">
              <Typography variant="h6" className="user-heading">
                ICT Referral:
              </Typography>
              <Typography variant="span" className="user-name-value">
                To be set later
              </Typography>
            </div>
          </div>
          <div className="card user-button-groups">
            <div>
              <Button
                variant="info"
                size="sm"
                className="user__button--view"
                onClick={() => fetchCredentials(id)} // Call fetchCredentials with id
              >
                View Credentials
              </Button>
              <Button variant="primary" size="sm">
                Download Credentials
              </Button>
            </div>
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
      {pdfUrl && (
        <div className="pdf-viewer">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            width="100%"
            height="500px"
            style={{ border: "none" }}
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default AdminCredentialsAllInfo;
