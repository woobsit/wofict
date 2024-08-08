import React, { useState, useEffect } from "react";
//API service
import authService from "./../api/authService";
//utils
import { notify } from "./../utils/Notification";
//Molecule
import Header from "./../components/molecule/Header";
import Sidebar from "./../components/molecule/Sidebar";
import Main from "./../components/molecule/Main";
import Footer from "./../components/molecule/Footer";
// import PendingDocumentation from "./../components/molecule/PendingDocumentation";
//React bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
//images
// import EmptyImage from "./../assets/images/logo.png";

function Home() {
  const [fetchUserData, setFetchUserData] = useState({});
  const [fetchUserDataStatus, setFetchUserDataStatus] = useState(false);

  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await authService.getUser();

        if (response.status === 201) {
          setFetchUserData(response.result);
          setFetchUserDataStatus(true);
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
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="content">
        <Sidebar />
        <div className="content__content-bar">
          <Header />
          {fetchUserDataStatus &&
          fetchUserData.credentials_status === 0 &&
          fetchUserData.guarantor_status === 0 &&
          fetchUserData.admission_status !== "Admitted" ? (
            <>
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Admission status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Dear Ahmed, Thank you for applying. Your admission status is
                  currently{" "}
                  <span className="modal-body__span-text">
                    Pending Documentation
                  </span>
                  . To proceed with the evaluation of your application, please
                  upload the following required documents:
                  <ul>
                    <li>Acknowledge letter</li>
                  </ul>
                  . We appreciate your prompt attention to this matter.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : fetchUserDataStatus &&
            fetchUserData.admission_status === "Processing" &&
            fetchUserData.admission_status !== "Admitted" ? (
            "Processing"
          ) : fetchUserDataStatus &&
            fetchUserData.admission_status === "Admitted" ? (
            <Main />
          ) : (
            ""
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
