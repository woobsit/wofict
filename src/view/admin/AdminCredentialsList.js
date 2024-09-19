import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//React bootstrap
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Placeholder from "react-bootstrap/Placeholder";
import Pagination from "react-bootstrap/Pagination";
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
  const [fetchAllUsersDataStatus, setFetchAllUsersDataStatus] = useState(false);
  const [fetchApprovedUsersData, setFetchApprovedUsersData] = useState([]);
  const [fetchPendingApprovalUsersData, setFetchPendingApprovalUsersData] =
    useState([]);
  const [fetchAllUserDataStatus, setFetchAllUserDataStatus] = useState(false);
  const [fetchApprovedUserDataStatus, setFetchApprovedUserDataStatus] =
    useState(false);
  const [
    fetchPendingApprovalUserDataStatus,
    setFetchPendingApprovalUserDataStatus,
  ] = useState(false);

  const [pagination, setPagination] = useState({});
  const [paginationApproved, setPaginationApproved] = useState({});
  const [paginationPendingApproval, setPaginationPendingApproval] = useState(
    {}
  );

  const [activeTab, setActiveTab] = useState("credentials");

  //Pie chart data
  const [fetchPieChartStatus, setFetchPieChartStatus] = useState(false);
  const [chartData, setChartData] = useState({
    series: [],
    chartOptions: {
      labels: [],
    },
  });

  // Fetch functions for all, approved, and disapproved users
  async function fetchAllUsers(page = 1) {
    setFetchAllUsersDataStatus(true);
    try {
      const response = await authService.getAllUsers(page);
      if (response.status === 201) {
        setFetchAllUsersData(response.result);
        setPagination(response.pagination);
        setFetchAllUserDataStatus(true);
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
      setFetchAllUsersDataStatus(false);
    }
  }

  async function fetchApprovedUsers(page = 1) {
    try {
      const response = await authService.getApprovedCredentials(page);
      if (response.status === 201) {
        setFetchApprovedUsersData(response.result);
        setPaginationApproved(response.pagination);
        setFetchApprovedUserDataStatus(true);
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
    }
  }

  async function fetchPendingApprovalUsers(page = 1) {
    try {
      const response = await authService.getPendingApprovalCredentials(page);
      if (response.status === 201) {
        setFetchPendingApprovalUsersData(response.result);
        setPaginationPendingApproval(response.pagination);
        setFetchPendingApprovalUserDataStatus(true);
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

    if (
      tabKey === "pending-credentials" &&
      !fetchPendingApprovalUserDataStatus
    ) {
      fetchPendingApprovalUsers();
    }
  };

  const handlePageChange = (page, type) => {
    if (type === "all") fetchAllUsers(page);
    if (type === "approved") fetchApprovedUsers(page);
    if (type === "pending-credentials") fetchPendingApprovalUsers(page);
  };

  // Updated renderPagination function to accept parameters
  const renderPagination = (paginationData, type) => {
    const totalPages = paginationData.last_page;
    const currentPage = paginationData.current_page;

    if (totalPages <= 1) return null;

    const items = [];

    // First and previous buttons
    items.push(
      <Pagination.First
        key="first"
        onClick={() => handlePageChange(1, type)}
        disabled={currentPage === 1}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1, type)}
        disabled={currentPage === 1}
      />
    );

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        items.push(
          <Pagination.Item key={i} active>
            {i}
          </Pagination.Item>
        );
      } else {
        items.push(
          <Pagination.Item key={i} onClick={() => handlePageChange(i, type)}>
            {i}
          </Pagination.Item>
        );
      }
    }

    // Next and last buttons
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1, type)}
        disabled={currentPage === totalPages}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        onClick={() => handlePageChange(totalPages, type)}
        disabled={currentPage === totalPages}
      />
    );

    return <Pagination className="pagination-controls">{items}</Pagination>;
  };

  const handleViewUserDetails = (id) => {
    navigate(`/admin/user-info-by-credentials/${id}`);
  };

  const handleOnSelect = (item) => {
    navigate(`/admin/user-info-by-credentials/${item.id}`);
    // Handle what happens when an item is selected (e.g., redirect to a page)
  };

  //Pie chart data
  useEffect(() => {
    async function fetchGetAllAppliedUsers() {
      setFetchPieChartStatus(true);
      try {
        const response = await authService.getAllAppliedUsers();
        if (response.status === 201) {
          const apiData = response.result;
          // Transform data for the chart
          const seriesData = apiData.map((item) => item.user_count); // Extract counts
          const labelData = apiData.map((item) => item.group_name); // Extract group names

          // Update chart data
          setChartData({
            series: seriesData,
            chartOptions: {
              labels: labelData,
            },
          });
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
        setFetchPieChartStatus(false);
      }
    }
    fetchGetAllAppliedUsers();
  }, []);

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
    }
  };

  const handleSearchApproved = async (query) => {
    if (query.length < 1) return ""; // Prevent search for empty
    try {
      const response = await authService.getSearchedApprovedCredentials(query);
      if (response.status === 201) {
        const results = response.result.map((item) => ({
          id: item.id,
          name: item.firstname + " " + item.surname,
        }));
        setItems(results);
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
    }
  };

  const handleSearchPending = async (query) => {
    if (query.length < 1) return ""; // Prevent search for empty
    try {
      const response = await authService.getSearchedPendingCredentials(query);
      if (response.status === 201) {
        const results = response.result.map((item) => ({
          id: item.id,
          name: item.firstname + " " + item.surname,
        }));
        setItems(results);
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
    }
  };

  const styling = {
    borderRadius: "5px",
    height: "35px",
    fontFamily: "Roboto",
    searchIconMargin: "0 0 0 4px",
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
              {fetchAllUsersDataStatus ? (
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
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                  <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} size="xs" />
                  </Placeholder>
                </>
              ) : (
                <>
                  <div className="credentials__table-wrapper">
                    <Table striped bordered hover responsive>
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
                                    <Badge bg="secondary">pending</Badge>
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
                  {renderPagination(pagination, "all")}
                </>
              )}
            </Tab>

            <Tab eventKey="pending-credentials" title="Pending approval">
              {/* Pending approval Credentials Table */}
              <div className="credentials__table-title-box">
                <Typography variant="h4" className="credentials__table-title">
                  Pending approval
                </Typography>

                <ReactSearchAutocomplete
                  items={items}
                  onSearch={handleSearchPending}
                  onSelect={handleOnSelect}
                  placeholder="Pending approval..."
                  className="credentials-autosearch"
                  styling={styling}
                />
              </div>
              <div className="credentials__table-wrapper">
                <Table striped bordered hover responsive>
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
                    {fetchPendingApprovalUserDataStatus &&
                      fetchPendingApprovalUsersData.map((user, index) => (
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
                                <Badge bg="secondary">disapproved</Badge>
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
                {renderPagination(
                  paginationPendingApproval,
                  "pending-credentials"
                )}
              </div>
            </Tab>

            <Tab eventKey="approved" title="Approved">
              {/* Approved Credentials Table */}
              <div className="credentials__table-title-box">
                <Typography variant="h4" className="credentials__table-title">
                  Approved credentials
                </Typography>

                <ReactSearchAutocomplete
                  items={items}
                  onSearch={handleSearchApproved}
                  onSelect={handleOnSelect}
                  placeholder="Approved credentials..."
                  className="credentials-autosearch"
                  styling={styling}
                />
              </div>
              <div className="credentials__table-wrapper">
                <Table striped bordered hover responsive>
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
                                <Badge bg="secondary">pending</Badge>
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
          </Tabs>
        </div>
        <div className="credentials__infograph-box">
          <div className="credentials__table-box">
            {fetchPieChartStatus ? (
              "Loading"
            ) : (
              <Chart
                options={chartData}
                series={chartData.series}
                type="donut"
                width="380"
              />
            )}
          </div>
          <div className="credentials__table-box"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminCredentialsList;
