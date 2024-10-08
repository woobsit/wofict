import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
//Custom component
import Typography from "../../components/atom/typography/Typography";
//React Bootstrap
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faVenusMars,
  faCalendar,
  faLocationDot,
  faPhone,
  faSignal,
  faUniversity,
  faClock,
  faBookJournalWhills,
  faCheck,
  faMicrophone,
  faComputer,
} from "@fortawesome/free-solid-svg-icons";
//API service
import authService from "../../api/authService";
import getAuthAdminData from "../../api/handleAuthAdminCookies";
//utils
import { notify } from "../../utils/Notification";
//React search autocomplete
import AdminSearchStudent from "./../../components/molecule/admin/AdminSearchStudent";

function AdminAllRegisteredUserAllInfo() {
  const { id } = useParams();
  const { website_info } = getAuthAdminData();
  const navigate = useNavigate();

  //Fetch registered user by id.
  const [registeredUserData, setRegisteredUserData] = useState([]);
  const [registeredUserStatus, setRegisteredUserStatus] = useState(false);

  //fetch user details by id.
  useEffect(() => {
    if (id) {
      fetchRegisteredUser(id); // Pass the id here
    }
  }, [id]);

  //fetch user with the id that has registered
  async function fetchRegisteredUser(id) {
    setRegisteredUserStatus(true);
    try {
      const response = await authService.getRegisteredUser(id);
      if (response.status === 201) {
        setRegisteredUserData(response.result);
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
      setRegisteredUserStatus(false);
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
      <AdminSearchStudent />
      <div>
        <div className="card user-name">
          <div className="image-name-button-wrapper">
            {registeredUserStatus ? (
              <Typography variant="h4" className="image-name__loader">
                loading...
              </Typography>
            ) : (
              <div className="image-name-wrapper">
                <img
                  src={website_info[2].value + "" + registeredUserData.photo}
                  alt={
                    registeredUserData.firstname +
                    " " +
                    registeredUserData.surname
                  }
                  title={
                    registeredUserData.firstname +
                    " " +
                    registeredUserData.surname
                  }
                  className="user-image"
                />
                <div className="user-fullname-email">
                  <Typography variant="h4" className="user-fullname">
                    {registeredUserData.firstname +
                      " " +
                      registeredUserData.surname}
                  </Typography>
                  <Typography variant="span" className="user-email">
                    {registeredUserData.email}
                  </Typography>
                </div>
              </div>
            )}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.firstname}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.surname}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.other_names}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.gender}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.date_of_birth}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.contact_address}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.phone_number}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.state_of_origin}
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.credentials === null ? (
                        <Badge bg="danger">no credentials uploaded</Badge>
                      ) : registeredUserData.credentials_status === 1 ? (
                        <Badge bg="success">approved</Badge>
                      ) : (
                        <Badge bg="secondary">pending/disapproved</Badge>
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
                  {registeredUserStatus ? null : (
                    <Typography variant="span" className="user-name-value">
                      {registeredUserData.guarantors_1 === null ||
                      registeredUserData.guarantors_2 === null ? (
                        <Badge bg="danger">No guarantors uploaded</Badge>
                      ) : registeredUserData.guarantors_status === 1 ? (
                        <Badge bg="success">Approved</Badge>
                      ) : (
                        <Badge bg="secondary">Pending</Badge>
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
                  <FontAwesomeIcon
                    icon={faUniversity}
                    className="user__user-icon"
                  />
                  <Typography variant="h6" className="user-heading">
                    Course:
                  </Typography>
                  <Typography variant="span" className="user-name-value">
                    To be set later
                  </Typography>
                </div>
                <div className="user-heading-name">
                  <FontAwesomeIcon icon={faClock} className="user__user-icon" />
                  <Typography variant="h6" className="user-heading">
                    Session:
                  </Typography>
                  <Typography variant="span" className="user-name-value">
                    {registeredUserStatus && registeredUserData.class_sessions}
                  </Typography>
                </div>
                <div className="user-heading-name">
                  <FontAwesomeIcon
                    icon={faBookJournalWhills}
                    className="user__user-icon"
                  />
                  <Typography variant="h6" className="user-heading">
                    Qualification Level:
                  </Typography>
                  <Typography variant="span" className="user-name-value">
                    {registeredUserStatus &&
                      registeredUserData.qualification_level}
                  </Typography>
                </div>
                <div className="user-heading-name">
                  <FontAwesomeIcon icon={faCheck} className="user__user-icon" />
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
                <FontAwesomeIcon
                  icon={faMicrophone}
                  className="user__user-icon"
                />
                <Typography variant="h6" className="user-heading">
                  Conversation Strenght:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  To be set later
                </Typography>
              </div>
              <div className="user-heading-name">
                <FontAwesomeIcon
                  icon={faComputer}
                  className="user__user-icon"
                />
                <Typography variant="h6" className="user-heading">
                  Computer Literacy:
                </Typography>
                <Typography variant="span" className="user-name-value">
                  To be set later
                </Typography>
              </div>
              <div className="user-heading-name">
                <FontAwesomeIcon icon={faPhone} className="user__user-icon" />
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

export default AdminAllRegisteredUserAllInfo;
