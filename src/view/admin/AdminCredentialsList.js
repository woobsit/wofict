import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//React bootstrap
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
import Footer from "../../components/molecule/Footer";
//Custom component
import Typography from "../../components/atom/typography/Typography";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
//utils
import { notify } from "../../utils/Notification";
//API service
import authService from "../../api/authService";
//Utility Spinner
import Loader from "./../../components/atom/loader";

function AdminCredentialsList() {
  const navigate = useNavigate();

  const [prospectiveStudentsFields, setProspectiveStudentsFields] = useState({
    prospective_students: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fetchAllUsersData, setFetchAllUsersData] = useState([]);
  const [fetchApprovedUsersData, setFetchApprovedUsersData] = useState([]);
  const [fetchDisapprovedUsersData, setFetchDisapprovedUsersData] = useState(
    []
  );
  const [fetchAllUserDataStatus, setFetchAllUserDataStatus] = useState(false);
  const [fetchApprovedUserDataStatus, setFetchApprovedUserDataStatus] =
    useState(false);
  const [fetchDisapprovedUserDataStatus, setFetchDisapprovedUserDataStatus] =
    useState(false);

  const [pagination, setPagination] = useState({});
  const [paginationApproved, setPaginationApproved] = useState({});
  const [paginationDisapproved, setPaginationDisapproved] = useState({});

  const [activeTab, setActiveTab] = useState("credentials");

  //Set value of inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = value;
    setProspectiveStudentsFields({
      ...prospectiveStudentsFields,
      [name]: newValue,
    });
  };

  //Validate inputs
  const validate = (inputValues) => {
    let errors = {};
    if (inputValues.prospective_students.length === "") {
      errors.prospective_students = "Input is empty. Please enter a value";
    }
    return errors;
  };

  //Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(prospectiveStudentsFields)); //object of errors
    setSubmitting(true);
  };

  //When form values are valid
  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      makeSearchRequest();
    }
  }, [errors]);

  const makeSearchRequest = async () => {
    try {
      setLoading(true);
      const response = await authService.getSearchedCredentials(
        prospectiveStudentsFields.prospective_students
      );

      if (response.status === 201) {
        setLoading(false);
      } else if (response.status === 400) {
        setLoading(false);
        notify("error", "Wrong input", response.message);
      } else if (response.status === 404) {
        setLoading(false);
        notify("error", "No User", response.message);
      } else if (response.status === 500) {
        setLoading(false);
        notify("error", "System Error", response.message);
      } else {
        setLoading(false);
        notify("error", "Error", "An unexpected error occurred");
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

  // Fetch functions for all, approved, and disapproved users
  async function fetchAllUsers(page = 1) {
    try {
      const response = await authService.getAllUsers(page);
      if (response.status === 201) {
        setFetchAllUsersData(response.result);
        setPagination(response.pagination);
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

  async function fetchApprovedUsers(page = 1) {
    try {
      const response = await authService.getApprovedCredentials(page);
      if (response.status === 201) {
        setFetchApprovedUsersData(response.result);
        setPaginationApproved(response.pagination);
        setFetchApprovedUserDataStatus(true);
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

  async function fetchDisapprovedUsers(page = 1) {
    try {
      const response = await authService.getUnapprovedCredentials(page);
      if (response.status === 201) {
        setFetchDisapprovedUsersData(response.result);
        setPaginationDisapproved(response.pagination);
        setFetchDisapprovedUserDataStatus(true);
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

  // Fetch all users when component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);

    if (tabKey === "approved" && !fetchApprovedUserDataStatus) {
      fetchApprovedUsers();
    }

    if (tabKey === "disapproved" && !fetchDisapprovedUserDataStatus) {
      fetchDisapprovedUsers();
    }
  };

  const handlePageChange = (page, type) => {
    if (type === "all") fetchAllUsers(page);
    if (type === "approved") fetchApprovedUsers(page);
    if (type === "disapproved") fetchDisapprovedUsers(page);
  };

  // Updated renderPagination function to accept parameters
  const renderPagination = (paginationData, type) => {
    const totalPages = paginationData.last_page;
    const currentPage = paginationData.current_page;
    const maxVisibleButtons = 10; // Max number of visible pagination buttons

    if (totalPages <= 1) return null;

    const paginationButtons = [];

    // Calculate which buttons to show
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = startPage + maxVisibleButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      paginationButtons.push(
        <Button
          key={1}
          variant="outline-primary"
          onClick={() => handlePageChange(1, type)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        paginationButtons.push(<span key="start-ellipsis">...</span>);
      }
    }

    // Add the page buttons
    for (let i = startPage; i <= endPage; i++) {
      paginationButtons.push(
        <Button
          key={i}
          variant="outline-primary"
          onClick={() => handlePageChange(i, type)}
          active={i === currentPage}
        >
          {i}
        </Button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationButtons.push(<span key="end-ellipsis">...</span>);
      }
      paginationButtons.push(
        <Button
          key={totalPages}
          variant="outline-primary"
          onClick={() => handlePageChange(totalPages, type)}
        >
          {totalPages}
        </Button>
      );
    }

    return paginationButtons;
  };

  const handleViewUserDetails = (id) => {
    navigate(`/admin/user-info-by-credentials/${id}`);
  };

  return (
    <div className="content">
      {loading && <Loader />}

      <AdminHeader />

      <div className="image-container">
        <div>
          <Typography variant="h3" className="credential-text">
            Credentials
          </Typography>
        </div>
        <div>
          <FontAwesomeIcon icon={faHome} className="nav__menu-icon" />
          <Typography variant="span" className="credential-span">
            /credentials
          </Typography>
        </div>
      </div>

      <div className="search-input-container">
        <div className="landing-form__input-box">
          <input
            type="text"
            placeholder="Search student"
            className="landing-form__input"
            name="email"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="landing-student-form__input-icon"
          />
        </div>
      </div>
      <div className="credentials">
        <div className="credentials__table-box">
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            id="fill-tab-example"
            className="mb-3"
            fill
          >
            <Tab eventKey="credentials" title="All credentials">
              <div className="credentials__table-title-box">
                <Typography variant="h4" className="credentials__table-title">
                  All credentials
                </Typography>

                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Search credentials"
                    className="landing-form__input"
                    name="prospective_students"
                    value={prospectiveStudentsFields.prospective_students}
                    onChange={handleChange}
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="landing-form__input-icon"
                  />
                </form>
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
                      <th>Course</th>
                      <th>Status</th>
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
                          <td>{user.course}</td>
                          <td>
                            <Typography variant="p" className="">
                              {user.credentials_status === 1
                                ? "Approved"
                                : "Unapproved"}
                            </Typography>
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleViewUserDetails(user.id)}
                            >
                              View details
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="pagination-controls">
                {renderPagination(pagination, "all")}
              </div>
            </Tab>

            <Tab eventKey="approved" title="Approved">
              {/* Approved Credentials Table */}
              <div className="credentials__table-wrapper">
                <Table>
                  <thead>
                    <tr className="credentials__table-head">
                      <th>#</th>
                      <th>Firstname</th>
                      <th>Surname</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchApprovedUserDataStatus &&
                      fetchApprovedUsersData.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.firstname}</td>
                          <td>{user.surname}</td>
                          <td>{user.email}</td>
                          <td>{user.gender}</td>
                          <td>{user.course}</td>
                          <td>Approved</td>
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleViewUserDetails(user.id)}
                            >
                              View details
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="pagination-controls">
                {renderPagination(paginationApproved, "approved")}
              </div>
            </Tab>

            <Tab eventKey="disapproved" title="Disapproved">
              {/* Disapproved Credentials Table */}
              <div className="credentials__table-wrapper">
                <Table>
                  <thead>
                    <tr className="credentials__table-head">
                      <th>#</th>
                      <th>Firstname</th>
                      <th>Surname</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchDisapprovedUserDataStatus &&
                      fetchDisapprovedUsersData.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.firstname}</td>
                          <td>{user.surname}</td>
                          <td>{user.email}</td>
                          <td>{user.gender}</td>
                          <td>{user.course}</td>
                          <td>Disapproved</td>
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleViewUserDetails(user.id)}
                            >
                              View details
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="pagination-controls">
                {renderPagination(paginationDisapproved, "disapproved")}
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className="credentials__infograph-box">
          <div className="credentials__table-box"></div>
          <div className="credentials__table-box"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminCredentialsList;
