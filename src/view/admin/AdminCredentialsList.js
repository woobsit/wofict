import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//React bootstrap
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
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
//React search autocomplete
import { ReactSearchAutocomplete } from "react-search-autocomplete";
//React Apex chart
import Chart from "react-apexcharts";

function AdminCredentialsList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

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

  const handleSearch = async (query) => {
    if (query.length < 1) return ""; // Prevent search for empty
    try {
      const response = await authService.getSearchedCredentials(query);
      if (response.status === 201) {
        const results = response.result.map((item) => ({
          id: item.id,
          name: item.firstname + " " + item.surname,
        }));
        setItems(results);
      } else if (response.status === 500) {
        notify("error", "System Error", response.message);
      } else {
        notify("error", "Error", "An unexpected error occurred");
      }
    } catch (error) {
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

    if (tabKey === "pending-credentials" && !fetchDisapprovedUserDataStatus) {
      fetchDisapprovedUsers();
    }
  };

  const handlePageChange = (page, type) => {
    if (type === "all") fetchAllUsers(page);
    if (type === "approved") fetchApprovedUsers(page);
    if (type === "pending-credentials") fetchDisapprovedUsers(page);
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

  const handleOnSelect = (item) => {
    navigate(`/admin/user-info-by-credentials/${item.id}`);
    // Handle what happens when an item is selected (e.g., redirect to a page)
  };

  const styling = {
    borderRadius: "5px",
    height: "35px",
    fontFamily: "Roboto",
    searchIconMargin: "0 0 0 4px",
  };

  const options = {
    series: [44, 55, 41],
    chartOptions: {
      labels: ["No credentials", "Pending approval", "Approved"],
    },
  };

  return (
    <div className="content">
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
            placeholder="Search students"
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

                <ReactSearchAutocomplete
                  items={items}
                  onSearch={handleSearch}
                  onSelect={handleOnSelect}
                  placeholder="All credentials..."
                  className="credentials-autosearch"
                  styling={styling}
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
                      <th>Course</th>
                      <th>Credential Status</th>
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
                              {user.credentials_status === 1 ? (
                                <Badge bg="success">approved</Badge>
                              ) : (
                                <Badge bg="info">pending</Badge>
                              )}
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
                      <th>Credential Status</th>
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
                          <td>
                            <Typography variant="p" className="">
                              {user.credentials_status === 1 ? (
                                <Badge bg="success">approved</Badge>
                              ) : (
                                <Badge bg="info">pending</Badge>
                              )}
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
                {renderPagination(paginationApproved, "approved")}
              </div>
            </Tab>

            <Tab eventKey="pending" title="Pending approval">
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
                      <th>Credential Status</th>
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
                          <td>
                            <Typography variant="p" className="">
                              {user.credentials_status === 1 ? (
                                <Badge bg="success">approved</Badge>
                              ) : (
                                <Badge bg="info">pending</Badge>
                              )}
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
                {renderPagination(paginationDisapproved, "pending")}
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className="credentials__infograph-box">
          <div className="credentials__table-box">
            <Chart
              options={options}
              series={options.series}
              type="donut"
              width="380"
            />
          </div>
          <div className="credentials__table-box"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminCredentialsList;
