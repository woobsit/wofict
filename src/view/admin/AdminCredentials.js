import React, { useState, useEffect } from "react";
//React bootstrap
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
import Footer from "../../components/molecule/Footer";
//Custom component
import Typography from "./../../components/atom/typography/Typography";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
//utils
import { notify } from "./../../utils/Notification";
//API service
import authService from "./../../api/authService";

function AdminCredentials() {
  const [fetchAllUsersData, setFetchAllUsersData] = useState([]);
  const [fetchAllUserDataStatus, setFetchAllUserDataStatus] = useState(false);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const response = await authService.getAllUsers();
        if (response.status === 201) {
          setFetchAllUsersData(response.result.data);
          setFetchAllUserDataStatus(true);
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
    fetchAllUsers();
  }, []);

  return (
    <div className="content">
      <AdminHeader />
      <div className="image-container">
        <div>
          <Typography variant="h3">Credentials</Typography>
        </div>
        <div>
          <FontAwesomeIcon icon={faHome} className="nav__menu-icon" /> /
          <Typography variant="span"> credentials</Typography>
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
      <div className="credentials">
        <div className="credentials__table-box">
          <Tabs
            defaultActiveKey="credentials"
            id="fill-tab-example"
            className="mb-3"
            fill
          >
            <Tab eventKey="credentials" title="All credentials">
              <div className="credentials__table-title-box">
                <Typography variant="p" className="credentials__table-title">
                  All credentials
                </Typography>
                <FontAwesomeIcon
                  icon={faSearch}
                  className="credentials__table-title-icon"
                />
              </div>
              <div className="credentials__table-wrapper">
                <Table>
                  <thead>
                    <tr className="credentials__table-head">
                      <th>#</th>
                      <th>Firstname</th>
                      <th>Surname</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Credentials</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchAllUserDataStatus &&
                      fetchAllUsersData.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.firstname}</td>
                          <td>{user.surname}</td>
                          <td>{user.email}</td>
                          <td>{user.gender}</td>
                          <td>
                            {user.credentials ? "Available" : "Unavailable"}
                          </td>
                          <td>{user.course}</td>
                          <td>
                            <Typography variant="p" className="">
                              {user.credentials_status === 1
                                ? "Approved"
                                : "Unapproved"}
                            </Typography>
                          </td>
                          <td>
                            <Button variant="primary" size="sm">
                              View user details
                            </Button>
                          </td>
                          <td>
                            <Button variant="info" size="sm">
                              View credentials
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </Tab>
            <Tab eventKey="approved" title="Approved">
              Tab content for Home
            </Tab>
            <Tab eventKey="disapproved" title="Disapproved">
              Tab content for Profile
            </Tab>
            <Tab eventKey="trashed" title="Trashed">
              Tab content for Loooonger Tab
            </Tab>
          </Tabs>
        </div>
        <div className="credentials__infograph-box">infograph</div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminCredentials;
