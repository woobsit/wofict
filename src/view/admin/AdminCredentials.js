import React from "react";
//React bootstrap
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
//Molecule
import AdminHeader from "../../components/molecule/admin/AdminHeader";
import Footer from "../../components/molecule/Footer";
//Custom component
import Typography from "./../../components/atom/typography/Typography";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";

function AdminCredentials() {
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
                      <th>Credentials status</th>
                      <th>Approve</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                      <td>@mdo</td>
                      <td>@mdo</td>
                      <td>@mdo</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                      <td>@fat</td>
                      <td>@fat</td>
                      <td>@fat</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Larry the Bird</td>
                      <td>@twitter</td>
                      <td>@twitter</td>
                      <td>@twitter</td>
                      <td>@twitter</td>
                      <td>@twitter</td>
                      <td>@twitter</td>
                    </tr>
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
