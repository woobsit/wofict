import React, { useState, useEffect } from "react";
//API service
import authService from "./../../../api/authService";
import getAuthAdminData from "./../../../api/handleAuthAdminCookies";
//Custom component
import Card from "./../../../components/atom/card/Card";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUsers } from "@fortawesome/free-solid-svg-icons";
//utils
import { notify } from "./../../../utils/Notification";
//Molecule
import AdminBreadcrumbs from "./AdminBreadcrumbs";

function AdminMain() {
  const { admin_user } = getAuthAdminData();

  const [countCurrentStudentsState, setCountCurrentStudentsState] =
    useState(false);
  const [countCurrentStudents, setCountCurrentStudents] = useState(null);

  useEffect(() => {
    toCountCurrentStudents();
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
          <Card className="card card__card--blue">
            <div className="card-upper">
              <div className="card-upper__wrapper">
                <div className="card-upper__upper">Current Students</div>
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
            <div className="card-lower">
              <span className="">2.4%</span>increased this month
            </div>
          </Card>
        </div>
        <div className="cards-container__inner-box">
          <Card className="card card__card--red">hdfefe</Card>
        </div>
        <div className="cards-container__inner-box">
          <Card className="card card__card--black">dfdfd</Card>
        </div>
        <div className="cards-container__inner-box">
          <Card className="card card__card--green">Hello</Card>
        </div>
      </div>
    </main>
  );
}

export default AdminMain;
