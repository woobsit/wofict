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
import Card from "react-bootstrap/Card";

//images
import AcknowledgementImage from "./../assets/images/acknowledgement.jpg";
import GuarantorImage from "./../assets/images/guarantor.jpg";
// import Divider from "../components/atom/divider/Divider";

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
          {fetchUserDataStatus && (
            <>
              {(fetchUserData.admission_status === "Pending documentation" && (
                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Admission Status</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Dear {fetchUserData.firstname},
                    {fetchUserData.credentials_status === 0 &&
                    fetchUserData.guarantor_status === 0 ? (
                      <>
                        <p>
                          Thank you for applying. Your admission status is
                          currently{" "}
                          <span className="modal-body__span-text">
                            Pending Documentation
                          </span>
                          .
                        </p>
                        <p>
                          To proceed with the evaluation of your application,
                          please tender the following required documents:
                        </p>
                        <ol>
                          <li>Acknowledgement letter</li>
                          <li>School Credentials</li>
                          <li>Guarantor form</li>
                        </ol>
                      </>
                    ) : (
                      <>
                        <p>
                          Thank you for your continued interest in WOB ICT HUB.
                          We have received some of the required documents for
                          your application. However, we are still missing the
                          following document(s):
                        </p>
                        <ol>
                          {fetchUserData.credentials_status === 0 && (
                            <li>School Credentials</li>
                          )}
                          {fetchUserData.guarantor_status === 0 && (
                            <li>Guarantor form</li>
                          )}
                        </ol>
                        <p>
                          Your admission status remains{" "}
                          <span className="modal-body__span-text">
                            Pending Documentation
                          </span>{" "}
                          until all required documents have been submitted.
                        </p>
                        <p>
                          To avoid any delays in the processing of your
                          application, please upload the remaining document(s).
                        </p>
                      </>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              )) ||
                (fetchUserData.admission_status === "Processing" && (
                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Admission Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Dear {fetchUserData.firstname}, we are pleased to inform
                      you that we have received the required documents for your
                      application. Your admission status is now{" "}
                      <span className="modal-body__span-text">In Progress</span>
                      , as our admissions team is processing the documents you
                      provided. Thank you for promptly submitting the necessary
                      documentation.
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )) ||
                (fetchUserData.admission_status === "Admitted" && <Main />)}
            </>
          )}
          <div className="bootstrap-cards-container">
            <div className="bootstrap-cards-inner-box">
              <Card className="bootstrap-card">
                <Card.Img variant="top" src={AcknowledgementImage} />
                <Card.Body>
                  <Card.Title>Acknowledgement letter</Card.Title>
                  <Card.Text>
                    Kindly download and print your acknowledgement letter
                  </Card.Text>
                  <Button variant="info">Download</Button>
                </Card.Body>
              </Card>
              <Card className="bootstrap-card">
                <Card.Img variant="top" src={GuarantorImage} />
                <Card.Body>
                  <Card.Title>Guarantor form</Card.Title>
                  <Card.Text>
                    Kindly download, print and fill up the guarantor form and
                    then upload it. This will also be needed in the registration
                  </Card.Text>
                  <Button variant="info">Download</Button>
                </Card.Body>
              </Card>
            </div>
            <div className="bootstrap-cards-inner-box">
              <Card className="bootstrap-card">
                <Card.Img variant="top" src={AcknowledgementImage} />
                <Card.Body>
                  <Card.Title>Upload credentials</Card.Title>
                  <Card.Text>
                    Kindly download and print your acknowledgement letter
                  </Card.Text>
                  <Button variant="primary">Upload credentials</Button>
                </Card.Body>
              </Card>
              <Card className="bootstrap-card">
                <Card.Img variant="top" src={GuarantorImage} />
                <Card.Body>
                  <Card.Title>Guarantor form (filled)</Card.Title>
                  <Card.Text>
                    Kindly download, print and fill up the guarantor form and
                    then upload it. This will also be needed in the registration
                  </Card.Text>
                  <Button variant="primary">Upload guarantor form</Button>
                </Card.Body>
              </Card>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
