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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await authService.getUser();

        if (response.status === 201) {
          setFetchUserData(response.result);
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
          {fetchUserData?.admission_status === "Pending documentation" ? (
            <>
              <Button variant="primary" onClick={handleShow}>
                Launch static backdrop modal
              </Button>

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
                  currently <b>Pending Documentation</b>. To proceed with the
                  evaluation of your application, please upload the following
                  required documents:. We appreciate your prompt attention to
                  this matter.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : fetchUserData?.admission_status === "Processing" ? (
            "Processing"
          ) : (
            <Main />
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
