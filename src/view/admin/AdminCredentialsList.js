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

function AdminCredentialsList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  //For all users with credentials
  const [fetchAllUsersData, setFetchAllUsersData] = useState([]);
  const [fetchAllUsersDataStatus, setFetchAllUsersDataStatus] = useState(false);
  const [fetchAllUserDataStatus, setFetchAllUserDataStatus] = useState(false);
  const [fetchAllUsersDataNoRecords, setFetchAllUsersDataNoRecords] =
    useState("");

  //For users with pending approval/disapproval credentials
  const [fetchAllPendingUsersDataStatus, setFetchAllPendingUsersDataStatus] =
    useState(false);
  const [fetchPendingApprovalUsersData, setFetchPendingApprovalUsersData] =
    useState([]);
  const [
    fetchPendingApprovalUserDataStatus,
    setFetchPendingApprovalUserDataStatus,
  ] = useState(false);
  const [
    fetchPendingApprovalUsersNoRecords,
    setFetchPendingApprovalUsersNoRecords,
  ] = useState("");

  //For users with approved credentials
  const [fetchAllApprovedUsersDataStatus, setFetchAllApprovedUsersDataStatus] =
    useState(false);
  const [fetchApprovedUsersData, setFetchApprovedUsersData] = useState([]);
  const [fetchApprovedUserDataStatus, setFetchApprovedUserDataStatus] =
    useState(false);
  const [fetchApprovedUserDataNoRecords, setFetchApprovedUserDataNoRecords] =
    useState("");

  //Paginations
  const [pagination, setPagination] = useState({});
  const [paginationApproved, setPaginationApproved] = useState({});
  const [paginationPendingApproval, setPaginationPendingApproval] = useState(
    {}
  );
  //tabs
  const [activeTab, setActiveTab] = useState("credentials");

  // Fetch users that have credentials
  async function fetchAllUsers(page = 1) {
    setFetchAllUsersDataStatus(true);
    try {
      const response = await authService.getAllUsers(page);
      if (response.status === 201 && response.result.length > 0) {
        setFetchAllUsersData(response.result);
        setPagination(response.pagination);
        setFetchAllUserDataStatus(true);
        setFetchAllUsersDataNoRecords(""); // Clear the 'no records' message
      } else if (response.status === 404 || response.result.length === 0) {
        setFetchAllUsersData([]); // Set empty data
        setPagination(null); // Reset pagination
        setFetchAllUsersDataNoRecords("No records found");
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

  // Fetch users that have credentials that are pending approval or disapproval
  async function fetchPendingApprovalUsers(page = 1) {
    setFetchAllPendingUsersDataStatus(true);
    try {
      const response = await authService.getPendingApprovalCredentials(page);
      if (response.status === 201 && response.result.length > 0) {
        setFetchPendingApprovalUsersData(response.result);
        setPaginationPendingApproval(response.pagination);
        setFetchPendingApprovalUserDataStatus(true);
        setFetchPendingApprovalUsersNoRecords("");
      } else if (response.status === 404 || response.result.length === 0) {
        setFetchPendingApprovalUsersData([]);
        setPaginationPendingApproval(null);
        setFetchPendingApprovalUsersNoRecords("No records found");
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
      setFetchAllPendingUsersDataStatus(false);
    }
  }

  // Fetch users that have credentials that are approved
  async function fetchApprovedUsers(page = 1) {
    setFetchAllApprovedUsersDataStatus(true);
    try {
      const response = await authService.getApprovedCredentials(page);
      if (response.status === 201 && response.result.length > 0) {
        setFetchApprovedUsersData(response.result);
        setPaginationApproved(response.pagination);
        setFetchApprovedUserDataStatus(true);
        setFetchApprovedUserDataNoRecords("");
      } else if (response.status === 404 || response.result.length === 0) {
        setFetchApprovedUsersData([]);
        setPaginationApproved(null);
        setFetchApprovedUserDataNoRecords("No records found");
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
      setFetchAllApprovedUsersDataStatus(false);
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

    // Add page numbers with ellipsis for large sets of pages
    const maxPagesToShow = 5; // Number of pages to display around the current page
    const pagesAroundCurrent = Math.floor(maxPagesToShow / 2); // Pages to show before and after the current page

    // Show ellipsis and first page if current page is far from the first page
    if (currentPage > pagesAroundCurrent + 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1, type)}>
          {1}
        </Pagination.Item>
      );
      items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    // Generate page numbers dynamically based on the current page
    const startPage = Math.max(1, currentPage - pagesAroundCurrent);
    const endPage = Math.min(totalPages, currentPage + pagesAroundCurrent);

    for (let i = startPage; i <= endPage; i++) {
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

    // Show ellipsis and last page if current page is far from the last page
    if (currentPage < totalPages - pagesAroundCurrent) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages, type)}
        >
          {totalPages}
        </Pagination.Item>
      );
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
                        fetchAllUsersData.length > 0 ? (
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
                                    <Badge bg="secondary">
                                      pending/disapproved
                                    </Badge>
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
                          ))
                        ) : fetchAllUsersDataNoRecords ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              {fetchAllUsersDataNoRecords}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </Table>
                  </div>
                  {pagination && renderPagination(pagination, "all")}
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
              {fetchAllPendingUsersDataStatus ? (
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
                        {fetchPendingApprovalUserDataStatus &&
                        fetchPendingApprovalUsersData.length > 0 ? (
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
                                    <Badge bg="secondary">
                                      pending/disapproved
                                    </Badge>
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
                          ))
                        ) : fetchPendingApprovalUsersNoRecords ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              {fetchPendingApprovalUsersNoRecords}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </Table>
                  </div>
                  <div className="pagination-controls">
                    {paginationPendingApproval &&
                      renderPagination(
                        paginationPendingApproval,
                        "pending-credentials"
                      )}
                  </div>
                </>
              )}
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
              {fetchAllApprovedUsersDataStatus ? (
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
                        {fetchApprovedUserDataStatus &&
                        fetchApprovedUsersData.length > 0 ? (
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
                                    <Badge bg="secondary">
                                      pending/disapproved
                                    </Badge>
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
                          ))
                        ) : fetchApprovedUserDataNoRecords ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              {fetchApprovedUserDataNoRecords}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </Table>
                  </div>
                  <div className="pagination-controls">
                    {paginationApproved &&
                      renderPagination(paginationApproved, "approved")}
                  </div>
                </>
              )}
            </Tab>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminCredentialsList;
