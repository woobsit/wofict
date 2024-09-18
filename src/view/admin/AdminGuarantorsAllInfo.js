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
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
//API service
import authService from "../../api/authService";
import getAuthAdminData from "./../../api/handleAuthAdminCookies";
import axiosInstance from "./../../api/axiosInstance";
//utils
import { notify } from "../../utils/Notification";

function AdminGuarantorsAllInfo() {
  const { id } = useParams();
  const { website_info } = getAuthAdminData();
  const navigate = useNavigate();
  const [fetchUserByGuarantorsData, setFetchUserByGuarantorsData] = useState(
    []
  );
  const [fetchUserByGuarantorsStatus, setFetchUserByGuarantorsStatus] =
    useState(false);

  const [loadingViewGuarantors, setLoadingViewGuarantors] = useState(false);

  const [loadingApprovedGuarantor, setLoadingApprovedGuarantor] =
    useState(false);

  const [loadingPendedGuarantor, setLoadingPendedGuarantor] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserWithGuarantors(id); // Pass the id here
    }
  }, [id]);

  //fetch user with the id that has guarantors
  async function fetchUserWithGuarantors(id) {
    try {
      const response = await authService.getUserWithGuarantors(id);
      if (response.status === 201) {
        setFetchUserByGuarantorsData(response.result);
        setFetchUserByGuarantorsStatus(true);
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

  //view user guarantor form
  async function fetchToViewGuarantors(id) {
    setLoadingViewGuarantors(true);
    try {
      const response = await axiosInstance.get(`/view-guarantor-forms/${id}`, {
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
      setLoadingViewGuarantors(false);
    }
  }

  //Approve guarantors status
  async function fetchApprovedGuarantor(id) {
    setLoadingApprovedGuarantor(true);
    try {
      const response = await authService.getApproveGuarantor(id);
      if (response.status === 200) {
        notify("success", "Approved", "Guarantors has been approved");
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
      setLoadingApprovedGuarantor(false);
    }
  }

  //Disapprove/pend guarantors status
  async function fetchPendGuarantor(id) {
    setLoadingPendedGuarantor(true);
    try {
      const response = await authService.getDisapproveGuarantor(id);
      if (response.status === 200) {
        notify(
          "success",
          "Disapproved",
          "Guarantors has now been disapproved "
        );
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
      setLoadingPendedGuarantor(false);
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
          <div className="image-name-button-wrapper">
            {fetchUserByGuarantorsStatus && (
              <div className="image-name-wrapper">
                <img
                  src={
                    website_info[2].value + "" + fetchUserByGuarantorsData.photo
                  }
                  alt={
                    fetchUserByGuarantorsData.firstname +
                    " " +
                    fetchUserByGuarantorsData.surname
                  }
                  title={
                    fetchUserByGuarantorsData.firstname +
                    " " +
                    fetchUserByGuarantorsData.surname
                  }
                  className="user-image"
                />
                <div className="user-fullname-email">
                  <Typography variant="h4" className="user-fullname">
                    {fetchUserByGuarantorsData.firstname +
                      " " +
                      fetchUserByGuarantorsData.surname}
                  </Typography>
                  <Typography variant="span" className="user-email">
                    {fetchUserByGuarantorsData.email}
                  </Typography>
                </div>
              </div>
            )}
            <div>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle
                  split
                  variant="primary"
                  id="dropdown-split-basic"
                  size="sm"
                />
                <Dropdown.Menu>
                  {fetchUserByGuarantorsStatus &&
                  fetchUserByGuarantorsData.guarantors_status === 0 ? (
                    <Dropdown.Item
                      onClick={() => fetchApprovedGuarantor(id)} // Pass id here
                      disabled={loadingApprovedGuarantor}
                    >
                      {loadingApprovedGuarantor
                        ? "Approving guarantors..."
                        : "Approve guarantors"}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item
                      onClick={() => fetchPendGuarantor(id)} // Pass id here
                      disabled={loadingPendedGuarantor}
                    >
                      {loadingPendedGuarantor
                        ? "Disapprove guarantors..."
                        : "Disapprove guarantors"}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
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
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.firstname}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Surname:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.surname}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Other names:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.other_names}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Gender:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.gender}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Date of Birth:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.date_of_birth}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Contact address:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.contact_address}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Phone number:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.phone_number}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  State of Origin:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.state_of_origin}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Credentials status:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                  fetchUserByGuarantorsData.credentials_status === 1
                    ? "Approved"
                    : "Unapproved"}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Guarantor status:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                  fetchUserByGuarantorsData.guarantors_status === 1
                    ? "Approved"
                    : "Unapproved"}
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
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.class_sessions}
                </Typography>
              </div>
              <div className="user-heading-name">
                <Typography variant="h6" className="user-heading">
                  Qualification Level:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  {fetchUserByGuarantorsStatus &&
                    fetchUserByGuarantorsData.qualification_level}
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
                variant="primary"
                size="sm"
                className="user__button--view"
                onClick={() => fetchToViewGuarantors(id)} // Call fetchToViewGuarantors with id
                disabled={loadingViewGuarantors}
              >
                {loadingViewGuarantors ? "Loading PDF..." : "View Guarantors"}
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

export default AdminGuarantorsAllInfo;
