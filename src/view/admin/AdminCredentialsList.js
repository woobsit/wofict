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

function AdminCredentialsList() {
  const navigate = useNavigate();

  const [fetchAllUsersData, setFetchAllUsersData] = useState([]);
  const [fetchAllUserDataStatus, setFetchAllUserDataStatus] = useState(false);
  const [pagination, setPagination] = useState({});

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

  // Fetch users when component mounts or when page changes
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handlePageChange = (page) => {
    fetchAllUsers(page);
  };

  const renderPagination = () => {
    const totalPages = pagination.last_page;
    const currentPage = pagination.current_page;
    const maxVisibleButtons = 5; // Max number of visible pagination buttons

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
          onClick={() => handlePageChange(1)}
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
          onClick={() => handlePageChange(i)}
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
          onClick={() => handlePageChange(totalPages)}
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
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleViewUserDetails(user.id)}
                            >
                              View user details
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="pagination-controls">{renderPagination()}</div>
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