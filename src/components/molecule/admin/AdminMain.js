import React, { useState, useEffect } from "react";
//API service
import authService from "./../../../api/authService";
import getAuthAdminData from "./../../../api/handleAuthAdminCookies";
//Custom component
import Card from "./../../../components/atom/card/Card";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faFile,
  faHourglassHalf,
  faSearch,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
//utils
import { notify } from "./../../../utils/Notification";
//Molecule
import AdminBreadcrumbs from "./AdminBreadcrumbs";

function AdminMain() {
  const { admin_user } = getAuthAdminData();

  //student count state
  const [countCurrentStudentsState, setCountCurrentStudentsState] =
    useState(false);
  const [countCurrentStudents, setCountCurrentStudents] = useState(null);
  //student growth state
  const [studentsGrowthState, setStudentsGrowthState] = useState(false);
  const [studentsGrowth, setStudentsGrowth] = useState({ growth_rate: 0 });
  //registered users count state
  const [countRegisteredUsersState, setCountRegisteredUsersState] =
    useState(false);
  const [countRegisteredUsers, setCountRegisteredUsers] = useState(null);
  //registered users growth
  const [registeredUsersGrowthState, setRegisteredUsersGrowthState] =
    useState(false);
  const [registeredUsersGrowth, setRegisteredUsersGrowth] = useState({
    growth_rate: 0,
  });
  //pending credentials count status
  const [
    countPendingCredentialsUsersState,
    setCountPendingCredentialsUsersState,
  ] = useState(false);
  const [countPendingCredentialsUsers, setCountPendingCredentialsUsers] =
    useState(null);
  //pending credentials users growth rate
  const [
    countPendingCredentialsUsersGrowthRateState,
    setCountPendingCredentialsUsersGrowthRateState,
  ] = useState(false);
  const [
    countPendingCredentialsUsersGrowthRate,
    setCountPendingCredentialsUsersGrowth,
  ] = useState({
    growth_rate: 0,
  });

  useEffect(() => {
    toCountCurrentStudents();
    toGetStudentsGrowth();
    toCountRegisteredUsers();
    toGetRegisteredUsersGrowth();
    toCountPendingCredentialsUsers();
    toGetPendingCredentialsUsersGrowth();
  }, []);

  // count current students
  async function toCountCurrentStudents() {
    setCountCurrentStudentsState(true);
    try {
      const response = await authService.getCurrentStudentsCount();
      if (response.status === 201) {
        setCountCurrentStudents(response.result);
      } else {
        notify(
          "error",
          "Error",
          response.message || "An unexpected error occurred"
        );
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setCountCurrentStudentsState(false);
    }
  }

  //students growth
  async function toGetStudentsGrowth() {
    setStudentsGrowthState(true);
    try {
      const response = await authService.getCurrentStudentsGrowth();
      if (response.status === 201) {
        setStudentsGrowth({ growth_rate: response.data.growth_rate }); // Ensure you're accessing growth_rate
      } else {
        notify(
          "error",
          "Error",
          response.message || "An unexpected error occurred"
        );
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setStudentsGrowthState(false);
    }
  }

  //registered users count
  async function toCountRegisteredUsers() {
    setCountRegisteredUsersState(true);
    try {
      const response = await authService.getRegisteredUsersCount();
      if (response.status === 201) {
        setCountRegisteredUsers(response.result);
      } else {
        notify(
          "error",
          "Error",
          response.message || "An unexpected error occurred"
        );
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setCountRegisteredUsersState(false);
    }
  }

  //registered users growth
  async function toGetRegisteredUsersGrowth() {
    setRegisteredUsersGrowthState(true);
    try {
      const response = await authService.getRegisteredUsersGrowth();
      if (response.status === 201) {
        setRegisteredUsersGrowth({ growth_rate: response.data.growth_rate }); // Ensure you're accessing growth_rate
      } else {
        notify(
          "error",
          "Error",
          response.message || "An unexpected error occurred"
        );
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setRegisteredUsersGrowthState(false);
    }
  }

  //Pending credentials users count
  async function toCountPendingCredentialsUsers() {
    setCountPendingCredentialsUsersState(true);
    try {
      const response = await authService.getPendingCredentialsUsersCount();
      if (response.status === 201) {
        setCountPendingCredentialsUsers(response.result);
      } else {
        notify(
          "error",
          "Error",
          response.message || "An unexpected error occurred"
        );
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setCountPendingCredentialsUsersState(false);
    }
  }

  //pending credentials users growth rate
  async function toGetPendingCredentialsUsersGrowth() {
    setCountPendingCredentialsUsersGrowthRateState(true);
    try {
      const response = await authService.getPendingCredentialsUsersGrowth();
      if (response.status === 201) {
        setCountPendingCredentialsUsersGrowth({
          growth_rate: response.data.growth_rate,
        }); // Ensure you're accessing growth_rate
      } else {
        notify(
          "error",
          "Error",
          response.message || "An unexpected error occurred"
        );
      }
    } catch (error) {
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setCountPendingCredentialsUsersGrowthRateState(false);
    }
  }

  return (
    <main>
      <AdminBreadcrumbs firstname={admin_user.firstname} />

      <div className="search-input-container">
        <div className="landing-form__input-box">
          <FontAwesomeIcon
            icon={faSearch}
            className="landing-form__input-icon"
          />
          <input
            type="text"
            placeholder="search"
            className="landing-form__input"
            name="email"
          />
        </div>
      </div>
      <div className="card-student-info-container">
        {/* <Card className="card-student-info">
          <div>
            <img
              className="nav__menu-image"
              src={
                fetchWebsiteDataStatus &&
                fetchAdminDataStatus &&
                fetchWebsiteInfo[2].value + fetchAdminData.photo
              }
              alt={
                fetchAdminDataStatus &&
                fetchAdminData.firstname + " " + fetchAdminData.surname
              }
              title={
                fetchAdminDataStatus &&
                fetchAdminData.firstname + " " + fetchAdminData.surname
              }
            />
            <Typography variant="h3">
              {fetchAdminDataStatus &&
                fetchAdminData.firstname + " " + fetchAdminData.surname}
            </Typography>
          </div>
          <div></div>
          <div></div>
        </Card> */}
      </div>
      <div className="cards-container">
        <div className="cards-container__inner-box">
          <Card className="card card__card--black">
            <div className="card-upper">
              <div className="card-upper__wrapper">
                <div className="card-upper__upper">Admitted Users</div>
                <div className="card-upper__lower">
                  {countCurrentStudentsState ? null : countCurrentStudents}
                </div>
              </div>
              <div className="card-lower__wrapper">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="card-lower__users-icon"
                />
              </div>
            </div>
            <div className="card-lower-border--black">
              <div className="card-lower-icon-value">
                {studentsGrowthState ? (
                  <span className="card-lower-loading">Loading...</span>
                ) : (
                  <div>
                    {studentsGrowth.growth_rate > 0 ? (
                      <>
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="card-arrow-up-icon" // Up arrow
                        />
                        <span className="growth-rate-positive">
                          {studentsGrowth.growth_rate}%{" "}
                        </span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="card-arrow-down-icon" // Down arrow
                        />
                        <span className="growth-rate-negative">
                          {studentsGrowth.growth_rate}%{" "}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <span className="card-lower-text">increased this month</span>
            </div>
          </Card>
        </div>
        <div className="cards-container__inner-box">
          <Card className="card card__card--blue">
            <div className="card-upper">
              <div className="card-upper__wrapper">
                <div className="card-upper__upper">Registered Users</div>
                <div className="card-upper__lower">
                  {countRegisteredUsersState ? null : countRegisteredUsers}
                </div>
              </div>
              <div className="card-lower__wrapper">
                <FontAwesomeIcon
                  icon={faFile}
                  className="card-lower__users-icon"
                />
              </div>
            </div>
            <div className="card-lower-border--blue">
              <div className="card-lower-icon-value">
                {registeredUsersGrowthState ? (
                  <span className="card-lower-loading">Loading...</span>
                ) : (
                  <div>
                    {registeredUsersGrowth.growth_rate > 0 ? (
                      <>
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="card-arrow-up-icon" // Up arrow
                        />
                        <span className="growth-rate-positive">
                          {registeredUsersGrowth.growth_rate}%{" "}
                        </span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="card-arrow-down-icon" // Down arrow
                        />
                        <span className="growth-rate-negative">
                          {registeredUsersGrowth.growth_rate}%{" "}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <span className="card-lower-text">increased this month</span>
            </div>
          </Card>
        </div>
        <div className="cards-container__inner-box">
          <Card className="card card__card--red">
            <div className="card-upper">
              <div className="card-upper__wrapper">
                <div className="card-upper__upper">
                  Pending credentials approval
                </div>
                <div className="card-upper__lower">
                  {countPendingCredentialsUsersState
                    ? null
                    : countPendingCredentialsUsers}
                </div>
              </div>
              <div className="card-lower__wrapper">
                <FontAwesomeIcon
                  icon={faHourglassHalf}
                  className="card-lower__users-icon"
                />
              </div>
            </div>
            <div className="card-lower-border--red">
              <div className="card-lower-icon-value">
                {countPendingCredentialsUsersGrowthRateState ? (
                  <span className="card-lower-loading">Loading...</span>
                ) : (
                  <div>
                    {countPendingCredentialsUsersGrowthRate.growth_rate > 0 ? (
                      <>
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="card-arrow-up-icon" // Up arrow
                        />
                        <span className="growth-rate-positive">
                          {countPendingCredentialsUsersGrowthRate.growth_rate}%{" "}
                        </span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="card-arrow-down-icon" // Down arrow
                        />
                        <span className="growth-rate-negative">
                          {countPendingCredentialsUsersGrowthRate.growth_rate}%{" "}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <span className="card-lower-text">increased this month</span>
            </div>
          </Card>
        </div>
        <div className="cards-container__inner-box">
          <Card className="card card__card--green">
            {" "}
            <div className="card-upper">
              <div className="card-upper__wrapper">
                <div className="card-upper__upper">
                  Pending guarantors approval
                </div>
                <div className="card-upper__lower">
                  {countPendingCredentialsUsersState
                    ? null
                    : countPendingCredentialsUsers}
                </div>
              </div>
              <div className="card-lower__wrapper">
                <FontAwesomeIcon
                  icon={faHourglassHalf}
                  className="card-lower__users-icon"
                />
              </div>
            </div>
            <div className="card-lower-border--green">
              <div className="card-lower-icon-value">
                {countPendingCredentialsUsersGrowthRateState ? (
                  <span className="card-lower-loading">Loading...</span>
                ) : (
                  <div>
                    {countPendingCredentialsUsersGrowthRate.growth_rate > 0 ? (
                      <>
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="card-arrow-up-icon" // Up arrow
                        />
                        <span className="growth-rate-positive">
                          {countPendingCredentialsUsersGrowthRate.growth_rate}%{" "}
                        </span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="card-arrow-down-icon" // Down arrow
                        />
                        <span className="growth-rate-negative">
                          {countPendingCredentialsUsersGrowthRate.growth_rate}%{" "}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <span className="card-lower-text">increased this month</span>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default AdminMain;
