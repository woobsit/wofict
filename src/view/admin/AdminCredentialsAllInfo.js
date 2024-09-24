import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
//Custom component
import Typography from "../../components/atom/typography/Typography";
//React Bootstrap
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import Placeholder from "react-bootstrap/Placeholder";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faUser,
  faVenusMars,
  faCalendar,
  faLocationDot,
  faPhone,
  faSignal,
} from "@fortawesome/free-solid-svg-icons";
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

  const [loadingViewCredentials, setLoadingViewCredentials] = useState(false);

  const [loadingApprovedCredential, setLoadingApprovedCredential] =
    useState(false);

  const [loadingPendedCredential, setLoadingPendedCredential] = useState(false);

  //Display button text
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768); // Update on window resize
    };
    window.addEventListener("resize", handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (id) {
      fetchUserByCredentials(id); // Pass the id here
    }
  }, [id]);

  async function fetchUserByCredentials(id) {
    setFetchUserByCredentialsStatus(true);
    try {
      const response = await authService.getUserByCredentials(id);
      if (response.status === 201) {
        setFetchUserByCredentialsData(response.result);
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
    } finally {
      setFetchUserByCredentialsStatus(false);
    }
  }

  async function fetchToViewCredentials(id) {
    setLoadingViewCredentials(true);
    try {
      const response = await axiosInstance.get(`/view-credentials/${id}`, {
        responseType: "blob",
      });

      if (response.status === 201) {
        const pdfUrl = URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        // Open the PDF in a new tab
        window.open(pdfUrl, "_blank");
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
    } finally {
      setLoadingViewCredentials(false);
    }
  }

  async function fetchApprovedCredential(id) {
    setLoadingApprovedCredential(true);
    try {
      const response = await authService.getApprovedCredential(id);
      if (response.status === 200) {
        notify("success", "Approved", "Credentials are approved");
        // Update the status in the state
        setFetchUserByCredentialsData((prevData) => ({
          ...prevData,
          credentials_status: 1, // Assuming 1 indicates approved
        }));
      } else if (response.status === 404) {
        notify("error", "Error", "User not found");
      } else if (response.status === 500) {
        notify("error", "System Error", response.message);
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoadingApprovedCredential(false);
    }
  }

  async function fetchPendedCredential(id) {
    setLoadingPendedCredential(true);
    try {
      const response = await authService.getPendCredential(id);
      if (response.status === 200) {
        notify("success", "Disapproved", "Credentials are now pending");
        // Update the status in the state
        setFetchUserByCredentialsData((prevData) => ({
          ...prevData,
          credentials_status: 0, // Assuming 0 indicates pending/disapproved
        }));
      } else if (response.status === 404) {
        notify("error", "Error", "User not found");
      } else if (response.status === 500) {
        notify("error", "System Error", response.message);
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoadingPendedCredential(false);
    }
  }

  return (
    <div className="content">
      <AdminHeader />
      <div className="image-container">
        <div>
          <Typography variant="h3" className="credential-text">
            User Info
          </Typography>
        </div>
        <div>
          <FontAwesomeIcon icon={faHome} className="nav__menu-icon" />
          <Typography variant="span" className="credential-text">
            /user-info
          </Typography>
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
          <div className="image-name-button-wrapper">
            {fetchUserByCredentialsStatus ? (
              <>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} size="lg" />
                </Placeholder>
                <Placeholder as="p" animation="wave">
                  <Placeholder xs={12} size="lg" />
                </Placeholder>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} size="xs" />
                </Placeholder>
                <Placeholder as="p" animation="wave">
                  <Placeholder xs={12} size="xs" />
                </Placeholder>
              </>
            ) : (
              <div className="image-name-wrapper">
                <img
                  src={
                    website_info[2].value +
                    "" +
                    fetchUserByCredentialsData.photo
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
              </div>
            )}

            <div>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle
                  split
                  variant="warning"
                  id="dropdown-split-basic"
                  size="sm"
                >
                  {isMobileView ? null : "Action "}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {fetchUserByCredentialsStatus &&
                  fetchUserByCredentialsData.credentials_status === 0 ? (
                    <Dropdown.Item
                      onClick={() => fetchApprovedCredential(id)} // Pass id here
                      disabled={loadingApprovedCredential}
                    >
                      {loadingApprovedCredential ? "Approving..." : "Approve"}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item
                      onClick={() => fetchPendedCredential(id)} // Pass id here
                      disabled={loadingPendedCredential}
                    >
                      {loadingPendedCredential ? "Disapprove..." : "Disapprove"}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="user-info-wrapper">
          <div className="user-info-wrapper-inner">
            <div className="card user-info user-personal-info">
              <Typography
                variant="h4"
                className="user-text user-text--personal"
              >
                Personal Info
              </Typography>
              <div className="">
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Firstname:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsData.firstname}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Surname:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsData.surname}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Other names:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsData.other_names}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Gender:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsData.gender}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Date of Birth:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsData.date_of_birth}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Address:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsData.contact_address}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Phone:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsData.phone_number}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      State of Origin:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsStatus &&
                        fetchUserByCredentialsData.state_of_origin}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faSignal}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Credentials status:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsData.credentials_status === 1 ? (
                        <Badge bg="success">approved</Badge>
                      ) : fetchUserByCredentialsData.credentials_status ===
                        0 ? (
                        <Badge bg="secondary">pending</Badge>
                      ) : (
                        ""
                      )}
                    </Typography>
                  )}
                </div>
                <div className="user-heading-name">
                  <div className="user__firstname-icon">
                    <FontAwesomeIcon
                      icon={faSignal}
                      className="user__user-icon"
                    />
                    <Typography variant="h6" className="user-heading">
                      Guarantor status:
                    </Typography>
                  </div>
                  {fetchUserByCredentialsStatus ? (
                    <>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} size="xs" />
                      </Placeholder>
                    </>
                  ) : (
                    <Typography variant="span" className="user-name-value">
                      {fetchUserByCredentialsStatus ? (
                        fetchUserByCredentialsData.guarantors_status === 1 ? (
                          <Badge bg="success">approved</Badge>
                        ) : fetchUserByCredentialsData.guarantors_status ===
                          0 ? (
                          <Badge bg="secondary">pending</Badge>
                        ) : (
                          ""
                        )
                      ) : (
                        "" // Display nothing while the API is fetching
                      )}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
            <div className="card user-info user-education-info">
              <Typography
                variant="h4"
                className="user-text user-text--educational"
              >
                Education
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
              <Typography variant="h4" className="user-text user-text--other">
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
          </div>
          <div className="card user-button-groups">
            <div>
              <Button
                variant="primary"
                size="sm"
                className="user__button--view"
                onClick={() => fetchToViewCredentials(id)} // Call fetchToViewCredentials with id
                disabled={loadingViewCredentials}
              >
                {loadingViewCredentials ? "Loading PDF..." : "View Credentials"}
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
    </div>
  );
}

export default AdminCredentialsAllInfo;
