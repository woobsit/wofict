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
//Atom component
import Typography from "./../components/atom/typography/Typography";
//React bootstrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
//images
import UploadImage from "./../assets/images/upload.jpg";
import GuarantorImage from "./../assets/images/guarantor.jpg";
import LetterImage from "./../assets/images/letter.jpg";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const [fetchUserData, setFetchUserData] = useState({});
  const [fetchUserDataStatus, setFetchUserDataStatus] = useState(false);
  const [show, setShow] = useState(true);
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  // Form state for upload credentials
  const [inputFields, setInputFields] = useState({
    qualification: "",
    upload_credentials: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseCredentialForm = () => setShowCredentialForm(false);
  const handleShowCredentialForm = () => setShowCredentialForm(true);

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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;
    setInputFields({ ...inputFields, [name]: newValue });
  };

  const validate = (inputValues) => {
    let errors = {};
    if (!inputValues.qualification) {
      errors.qualification = "Qualification is required";
    }
    if (!inputValues.upload_credentials) {
      errors.upload_credentials = "Please upload your credentials";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(inputFields));
    setSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      uploadCredentials();
    }
  }, [errors]);

  async function fetchAcknowledgement() {
    try {
      const response = await authService.downloadAcknowledgement();
      if (response.status === 500) {
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

  async function fetchGuarantor() {
    try {
      const response = await authService.downloadGuarantor();
      if (response.status === 500) {
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

  async function uploadCredentials() {
    try {
      setLoading(true);
      const response = await authService.uploadCredentials(
        inputFields.qualification,
        inputFields.upload_credentials
      );
      setLoading(false);
      if (response.status === 200) {
        notify("success", "Success", "Credentials uploaded successfully.");
        handleCloseCredentialForm();
      } else if (response.status === 422) {
        notify("error", "Input Validation", response.message);
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
  }

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

          <div>
            <div className="admission-container">
              <FontAwesomeIcon icon={faDoorOpen} className="icon-door-open" />
              <Typography variant="h2" className="admission-text">
                Admission Stage
              </Typography>
            </div>
            <div className="bootstrap-cards-container">
              <div className="bootstrap-cards-inner-box">
                <Card className="bootstrap-card">
                  <Card.Img variant="top" src={LetterImage} />
                  <Card.Body>
                    <Card.Title>Acknowledgement letter</Card.Title>
                    <Card.Text>
                      Kindly download and print your acknowledgement letter
                    </Card.Text>
                    <Button variant="info" onClick={fetchAcknowledgement}>
                      Download
                    </Button>
                  </Card.Body>
                </Card>
                <Card className="bootstrap-card">
                  <Card.Img variant="top" src={GuarantorImage} />
                  <Card.Body>
                    <Card.Title>Guarantor form</Card.Title>
                    <Card.Text>
                      Kindly download, print and fill up the guarantor form and
                      then upload it. This will also be needed in the
                      registration
                    </Card.Text>
                    <Button variant="info" onClick={fetchGuarantor}>
                      Download
                    </Button>
                  </Card.Body>
                </Card>
              </div>
              <div className="bootstrap-cards-inner-box">
                <Card className="bootstrap-card">
                  <Card.Img variant="top" src={UploadImage} />
                  <Card.Body>
                    <Card.Title>Upload credentials</Card.Title>
                    <Card.Text>
                      Kindly download and print your acknowledgement letter
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={handleShowCredentialForm}
                    >
                      Upload credentials
                    </Button>
                  </Card.Body>
                </Card>
                <Card className="bootstrap-card">
                  <Card.Img variant="top" src={GuarantorImage} />
                  <Card.Body>
                    <Card.Title>Guarantor form (filled)</Card.Title>
                    <Card.Text>
                      Kindly download, print and fill up the guarantor form and
                      then upload it. This will also be needed in the
                      registration
                    </Card.Text>
                    <Button variant="primary">Upload guarantor form</Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>

          <Modal show={showCredentialForm} onHide={handleCloseCredentialForm}>
            <Modal.Header closeButton>
              <Modal.Title>Upload credentials</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Qualification</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g SSCE"
                    size="sm"
                    name="qualification"
                    value={inputFields.qualification}
                    onChange={handleChange}
                    isInvalid={!!errors.qualification}
                  />
                  <span>
                    *Minimum Qualification: SSCE/O &#39;Level Certifcate
                  </span>

                  <Form.Control.Feedback type="invalid">
                    {errors.qualification}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formFileSm" className="mb-3">
                  <Form.Label>Upload credentials</Form.Label>
                  <Form.Control
                    type="file"
                    size="sm"
                    name="upload_credentials"
                    onChange={handleChange}
                    isInvalid={!!errors.upload_credentials}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.upload_credentials}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseCredentialForm}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload credentials"}
              </Button>
            </Modal.Footer>
          </Modal>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
