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
//Sweetalert2
import Swal from "sweetalert2";
//Spinner loader
import Loader from "./../../components/atom/loader";
//React search autocomplete
import AdminSearchStudent from "./../../components/molecule/admin/AdminSearchStudent";

function AdminToAdmitUsers() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  //All users to be admitted
  const [fetchAllUsersToBeAdmittedData, setFetchAllUsersToBeAdmittedData] =
    useState([]);
  const [
    fetchAllUsersToBeAdmittedDataStatus,
    setFetchAllUsersToBeAdmittedDataStatus,
  ] = useState(false);
  const [
    fetchAllUserToBeAdmittedDataStatus,
    setFetchAllUserToBeAdmittedDataStatus,
  ] = useState(false);
  const [
    fetchAllUsersToBeAdmittedDataNoRecords,
    setFetchAllUsersToBeAdmittedDataNoRecords,
  ] = useState("");

  //admit status
  const [admitStatus, setAdmitStatus] = useState(false);

  //Paginations
  const [pagination, setPagination] = useState({});

  //tabs
  const [activeTab, setActiveTab] = useState("users-to-be-admitted");

  // Fetch all users to be admitted
  async function fetchAllUsersToBeAdmitted(page = 1) {
    setFetchAllUsersToBeAdmittedDataStatus(true);
    try {
      const response = await authService.getUsersToBeAdmitted(page);
      if (response.status === 201 && response.result.length > 0) {
        setFetchAllUsersToBeAdmittedData(response.result);
        setPagination(response.pagination);
        setFetchAllUserToBeAdmittedDataStatus(true);
        setFetchAllUsersToBeAdmittedDataNoRecords("");
      } else if (response.status === 404 || response.result.length === 0) {
        setFetchAllUsersToBeAdmittedData([]);
        setPagination(null);
        setFetchAllUsersToBeAdmittedDataNoRecords("No records found");
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
      setFetchAllUsersToBeAdmittedDataStatus(false);
    }
  }

  // Fetch all users when component mounts
  useEffect(() => {
    fetchAllUsersToBeAdmitted();
  }, []);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);

    if (
      tabKey === "users-to-be-admitted" &&
      !fetchAllUsersToBeAdmittedDataStatus
    ) {
      fetchAllUsersToBeAdmitted();
    }
  };

  const handlePageChange = (page, type) => {
    if (type === "users-to-be-admitted") fetchAllUsersToBeAdmitted(page);
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

  //Search all users to be admitted
  const handleSearch = async (query) => {
    if (query.length < 1) return ""; // Prevent search for empty
    try {
      const response = await authService.getSearchedUsersToBeAdmitted(query);
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

  // Admit user
  async function fetchAdmit($id) {
    setAdmitStatus(true);
    try {
      const response = await authService.getAdmit($id);
      if (response.status === 200) {
        notify("success", "User admitted", response.message);
        // Remove the admitted user from the state
        setFetchAllUsersToBeAdmittedData((prevData) =>
          prevData.filter((user) => user.id !== $id)
        );
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
      setAdmitStatus(false);
    }
  }

  const admitUser = ($id) => {
    Swal.fire({
      icon: "question",
      title: "Admit user?",
      showCancelButton: true,
      text: "User will be admitted as a student",
      showConfirmButton: true, // Show the "OK" button
      allowOutsideClick: false, // Prevent closing by clicking outside the dialog
    }).then((result) => {
      if (result.isConfirmed) {
        fetchAdmit($id);
      }
    });
  };

  const styling = {
    borderRadius: "5px",
    height: "35px",
    fontFamily: "Roboto",
    searchIconMargin: "0 0 0 4px",
  };

  return (
    <>
      {admitStatus && <Loader />}
      <div className="content">
        <AdminHeader />

        <div className="image-container">
          <div>
            <Typography variant="h3" className="credential-text">
              Users to be admitted
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
              <Tab eventKey="users-to-be-admitted" title="Users to be admitted">
                <div className="credentials__table-title-box">
                  <Typography variant="h4" className="credentials__table-title">
                    Users to be admitted
                  </Typography>

                  <ReactSearchAutocomplete
                    items={items}
                    onSearch={handleSearch}
                    onSelect={handleOnSelect}
                    placeholder="Users to be admitted..."
                    className="credentials-autosearch"
                    styling={styling}
                  />
                </div>
                {fetchAllUsersToBeAdmittedDataStatus ? (
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
                          {fetchAllUserToBeAdmittedDataStatus &&
                          fetchAllUsersToBeAdmittedData.length > 0 ? (
                            fetchAllUsersToBeAdmittedData.map((user, index) => (
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
                                    onClick={() =>
                                      handleViewUserDetails(user.id)
                                    }
                                  >
                                    View details
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => {
                                      admitUser(user.id);
                                    }}
                                  >
                                    Admit user
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : fetchAllUsersToBeAdmittedDataNoRecords ? (
                            <tr>
                              <td colSpan="8" className="text-center">
                                {fetchAllUsersToBeAdmittedDataNoRecords}
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </Table>
                    </div>
                    {pagination &&
                      renderPagination(pagination, "users-to-be-admitted")}
                  </>
                )}
              </Tab>
            </Tabs>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default AdminToAdmitUsers;
