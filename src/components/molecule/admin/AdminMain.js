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
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
//utils
import { notify } from "./../../../utils/Notification";
//Molecule
import AdminBreadcrumbs from "./AdminBreadcrumbs";
//React search autocomplete
import AdminSearchStudent from "./AdminSearchStudent";

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

  //pending guarantors count status
  const [
    countPendingGuarantorsUsersState,
    setCountPendingGuarantorsUsersState,
  ] = useState(false);
  const [countPendingGuarantorsUsers, setCountPendingGuarantorsUsers] =
    useState(null);

  //pending guarantors users growth rate
  const [
    countPendingGuarantorsUsersGrowthRateState,
    setCountPendingGuarantorsUsersGrowthRateState,
  ] = useState(false);
  const [
    countPendingGuarantorsUsersGrowthRate,
    setCountPendingGuarantorsUsersGrowth,
  ] = useState({
    growth_rate: 0,
  });

  //call the functions
  useEffect(() => {
    toCountCurrentStudents();
    toGetStudentsGrowth();
    toCountRegisteredUsers();
    toGetRegisteredUsersGrowth();
    toCountPendingCredentialsUsers();
    toGetPendingCredentialsUsersGrowth();
    toCountPendingGuarantorsUsers();
    toGetPendingGuarantorsUsersGrowth();
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

  //Pending guarantors users count
  async function toCountPendingGuarantorsUsers() {
    setCountPendingGuarantorsUsersState(true);
    try {
      const response = await authService.getPendingGuarantorsUsersCount();
      if (response.status === 201) {
        setCountPendingGuarantorsUsers(response.result);
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
      setCountPendingGuarantorsUsersState(false);
    }
  }

  //pending guarantors users growth rate
  async function toGetPendingGuarantorsUsersGrowth() {
    setCountPendingGuarantorsUsersGrowthRateState(true);
    try {
      const response = await authService.getPendingGuarantorsUsersGrowth();
      if (response.status === 201) {
        setCountPendingGuarantorsUsersGrowth({
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
      setCountPendingGuarantorsUsersGrowthRateState(false);
    }
  }

  return (
    <main>
      <AdminBreadcrumbs firstname={admin_user.firstname} />
      <AdminSearchStudent />
      <div className="cards-container">
        <div className="cards-container__pair">
          <div className="cards-container__inner-box cards-container__inner-box--black">
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
          <div className="cards-container__inner-box cards-container__inner-box--blue">
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
        </div>
        <div className="cards-container__pair">
          <div className="cards-container__inner-box cards-container__inner-box--red">
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
                      {countPendingCredentialsUsersGrowthRate.growth_rate >
                      0 ? (
                        <>
                          <FontAwesomeIcon
                            icon={faArrowUp}
                            className="card-arrow-up-icon" // Up arrow
                          />
                          <span className="growth-rate-positive">
                            {countPendingCredentialsUsersGrowthRate.growth_rate}
                            %{" "}
                          </span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="card-arrow-down-icon" // Down arrow
                          />
                          <span className="growth-rate-negative">
                            {countPendingCredentialsUsersGrowthRate.growth_rate}
                            %{" "}
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
          <div className="cards-container__inner-box cards-container__inner-box--green">
            <Card className="card card__card--green">
              {" "}
              <div className="card-upper">
                <div className="card-upper__wrapper">
                  <div className="card-upper__upper">
                    Pending guarantors approval
                  </div>
                  <div className="card-upper__lower">
                    {countPendingGuarantorsUsersState
                      ? null
                      : countPendingGuarantorsUsers}
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
                  {countPendingGuarantorsUsersGrowthRateState ? (
                    <span className="card-lower-loading">Loading...</span>
                  ) : (
                    <div>
                      {countPendingGuarantorsUsersGrowthRate.growth_rate > 0 ? (
                        <>
                          <FontAwesomeIcon
                            icon={faArrowUp}
                            className="card-arrow-up-icon" // Up arrow
                          />
                          <span className="growth-rate-positive">
                            {countPendingGuarantorsUsersGrowthRate.growth_rate}%{" "}
                          </span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="card-arrow-down-icon" // Down arrow
                          />
                          <span className="growth-rate-negative">
                            {countPendingGuarantorsUsersGrowthRate.growth_rate}%{" "}
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
      </div>
    </main>
  );
}

export default AdminMain;
