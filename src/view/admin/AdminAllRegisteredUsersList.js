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
import { faHome } from "@fortawesome/free-solid-svg-icons";
//utils
import { notify } from "../../utils/Notification";
//API service
import authService from "../../api/authService";
//React search autocomplete
import { ReactSearchAutocomplete } from "react-search-autocomplete";
//React search autocomplete
import AdminSearchStudent from "./../../components/molecule/admin/AdminSearchStudent";

function AdminAllRegisteredUsersList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  //All registered users
  const [fetchAllRegisteredUsersData, setFetchAllRegisteredUsersData] =
    useState([]);
  const [
    fetchAllRegisteredUsersDataStatus,
    setFetchAllRegisteredUsersDataStatus,
  ] = useState(false);
  const [
    fetchAllRegisteredUserDataStatus,
    setFetchAllRegisteredUserDataStatus,
  ] = useState(false);
  const [
    fetchAllRegisteredUsersDataNoRecords,
    setFetchAllRegisteredUsersDataNoRecords,
  ] = useState("");

  //Paginations
  const [pagination, setPagination] = useState({});

  //tabs
  const [activeTab, setActiveTab] = useState("all-registered-users");

  // Fetch all registered users
  async function fetchAllRegisteredUsers(page = 1) {
    setFetchAllRegisteredUsersDataStatus(true);
    try {
      const response = await authService.getAllRegisteredUsers(page);
      if (response.status === 201 && response.result.length > 0) {
        setFetchAllRegisteredUsersData(response.result);
        setPagination(response.pagination);
        setFetchAllRegisteredUserDataStatus(true);
        setFetchAllRegisteredUsersDataNoRecords("");
      } else if (response.status === 404 || response.result.length === 0) {
        setFetchAllRegisteredUsersData([]);
        setPagination(null);
        setFetchAllRegisteredUsersDataNoRecords("No records found");
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
      setFetchAllRegisteredUsersDataStatus(false);
    }
  }

  // Fetch all users when component mounts
  useEffect(() => {
    fetchAllRegisteredUsers();
  }, []);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);

    if (
      tabKey === "all-registered-users" &&
      !fetchAllRegisteredUsersDataStatus
    ) {
      fetchAllRegisteredUsers();
    }
  };

  const handlePageChange = (page, type) => {
    if (type === "all-registered-users") fetchAllRegisteredUsers(page);
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
    navigate(`/admin/registered-user-info/${id}`);
  };

  const handleOnSelect = (item) => {
    navigate(`/admin/registered-user-info/${item.id}`);
    // Handle what happens when an item is selected (e.g., redirect to a page)
  };

  //Search all registered users
  const handleSearch = async (query) => {
    if (query.length < 1) return ""; // Prevent search for empty
    try {
      const response = await authService.getSearchAllRegisteredUsers(query);
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
            Registered Users
          </Typography>
        </div>
        <div>
          <FontAwesomeIcon icon={faHome} className="nav__menu-icon" />
          <Typography variant="span" className="credential-span">
            /all users
          </Typography>
        </div>
      </div>

      <AdminSearchStudent />
      <div className="credentials">
        <div className="credentials__table-box">
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            id="fill-tab-example"
            className="mb-3"
            fill
          >
            <Tab eventKey="all-registered-users" title="All registered users">
              <div className="credentials__table-title-box">
                <Typography variant="h4" className="credentials__table-title">
                  Registered users
                </Typography>

                <ReactSearchAutocomplete
                  items={items}
                  onSearch={handleSearch}
                  onSelect={handleOnSelect}
                  placeholder="All registered users..."
                  className="credentials-autosearch"
                  styling={styling}
                />
              </div>
              {fetchAllRegisteredUsersDataStatus ? (
                <>
                  <Placeholder as="p" animation="wave">
                    <Placeholder
                      xs={1}
                      size="lg"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="lg"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="lg"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="lg"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={4}
                      size="lg"
                      style={{ marginRight: "20px" }}
                    />
                  </Placeholder>
                  <Placeholder as="p" animation="glow">
                    <Placeholder
                      xs={1}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={4}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                  </Placeholder>
                  <Placeholder as="p" animation="wave">
                    <Placeholder
                      xs={1}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={2}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
                    <Placeholder
                      xs={4}
                      size="xs"
                      style={{ marginRight: "20px" }}
                    />
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
                          <th>Guarantor Status</th>

                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fetchAllRegisteredUserDataStatus &&
                        fetchAllRegisteredUsersData.length > 0 ? (
                          fetchAllRegisteredUsersData.map((user, index) => (
                            <tr key={user.id}>
                              <td>{index + 1}</td>
                              <td>{user.firstname}</td>
                              <td>{user.surname}</td>
                              <td>{user.email}</td>
                              <td>{user.gender}</td>
                              <td>{user.course}</td>
                              <td>
                                <Typography variant="p" className="">
                                  {user.credentials === null ? (
                                    <Badge bg="danger">
                                      no credentials uploaded
                                    </Badge>
                                  ) : user.credentials_status === 1 ? (
                                    <Badge bg="success">approved</Badge>
                                  ) : (
                                    <Badge bg="secondary">
                                      pending/disapproved
                                    </Badge>
                                  )}
                                </Typography>
                              </td>
                              <td>
                                <Typography variant="p" className="">
                                  {user.guarantors_1 === null ||
                                  user.guarantors_2 === null ? (
                                    <Badge bg="danger">
                                      no guarantors uploaded
                                    </Badge>
                                  ) : user.guarantors_status === 1 ? (
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
                        ) : fetchAllRegisteredUsersDataNoRecords ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              {fetchAllRegisteredUsersDataNoRecords}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </Table>
                  </div>
                  {pagination &&
                    renderPagination(pagination, "all-registered-users")}
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

export default AdminAllRegisteredUsersList;
