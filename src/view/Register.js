import React, { useState, useEffect } from "react";
//React route dom
import { Link, useNavigate } from "react-router-dom";

//images
import LogoImage from "./../assets/images/logo.png";

//Custom component
import Button from "./../components/atom/button/Button";
import Typography from "./../components/atom/typography/Typography";
//import Radio from "./../components/atom/radio/Radio";

//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faEye,
  faUser,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

//Date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//Validator
import validator from "validator";

//Spinner loader
import Loader from "./../components/atom/loader";

//API service
import authService from "./../api/authService";

//utils
import { notify } from "./../utils/Notification";
import { phonePregMatch } from "./../utils/PregMatch";

//sweetalert2
import Swal from "sweetalert2";

//React bootstrap
import Form from "react-bootstrap/Form";
//import ProgressBar from "react-bootstrap/ProgressBar";

function Register() {
  const navigate = useNavigate();
  //fetch states from api
  const [nigerianStates, setNigerianStates] = useState([]);
  const [nigerianStatesLoading, setNigerianStatesLoading] = useState(false);
  //fetch courses
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const [inputFields, setInputFields] = useState({
    personal_info: {
      firstname: "",
      surname: "",
      other_names: "",
      email: "",
      password: "",
      password_confirmation: "",
      gender: "",
      date_of_birth: "Enter date of birth",
      phone_number: "",
      contact_address: "",
      state_of_origin: "Select state",
    },
    educational_background: {
      qualification_level: "Select qualification level",
      english_fluency: "",
      conversation_strength: "",
    },
    course_information: {
      course: "Select course",
      session: "",
      computer_literacy: "",
      ict_referral: "",
    },
  });
  const [errors, setErrors] = useState({
    personal_info: "",
    educational_background: "",
    course_information: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitting2, setSubmitting2] = useState(false);
  const [submitting3, setSubmitting3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  //Show and hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  //Set value of inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue;

    if (type === "radio") {
      newValue = value; // For radio buttons, use the value directly
    } else if (type === "select") {
      newValue = value; // For select elements, use the value directly
    } else {
      newValue = type === "checkbox" ? checked : value; // For other inputs
    }

    setInputFields((prevState) => {
      switch (page) {
        case 1:
          return {
            ...prevState,
            personal_info: {
              ...prevState.personal_info,
              [name]: newValue,
            },
          };
        case 2:
          return {
            ...prevState,
            educational_background: {
              ...prevState.educational_background,
              [name]: newValue,
            },
          };
        default:
          return {
            ...prevState,
            course_information: {
              ...prevState.course_information,
              [name]: newValue,
            },
          };
      }
    });
  };
  //Validate inputs
  const validate = (inputValues) => {
    let errors = {
      personal_info: {},
      educational_background: {},
      course_information: {},
    };
    switch (page) {
      case 1: {
        if (
          inputValues.personal_info.firstname.length < 3 ||
          inputValues.personal_info.firstname.length > 30
        ) {
          errors.personal_info.firstname = "Enter a valid firstname";
        }
        if (
          inputValues.personal_info.surname.length < 3 ||
          inputValues.personal_info.surname.length > 30
        ) {
          errors.personal_info.surname = "Enter a valid surname";
        }
        if (
          (inputValues.personal_info.other_names &&
            inputValues.personal_info.other_names.length < 3) ||
          inputValues.personal_info.other_names.length > 30
        ) {
          errors.personal_info.other_names = "Enter valid other names";
        }
        if (!validator.isEmail(inputValues.personal_info.email)) {
          errors.personal_info.email = "Enter a valid email address";
        }
        if (inputValues.personal_info.password.length < 6) {
          errors.personal_info.password =
            "Password should not be less than 6 characters";
        } else if (
          inputValues.personal_info.password !==
          inputValues.personal_info.password_confirmation
        ) {
          errors.personal_info.password_confirmation =
            "Password and confirm password did not match";
        }
        if (inputValues.personal_info.gender === "") {
          errors.personal_info.gender = "Choose gender";
        }
        if (inputValues.personal_info.date_of_birth === "Enter date of birth") {
          errors.personal_info.date_of_birth = "Enter valid date of birth";
        }
        if (!phonePregMatch.test(inputValues.personal_info.phone_number)) {
          errors.personal_info.phone_number = "Enter a valid phone number";
        }
        if (
          inputValues.personal_info.contact_address.length < 3 ||
          inputValues.personal_info.contact_address.length > 1000
        ) {
          errors.personal_info.contact_address =
            "Enter a valid contact address";
        }
        if (inputValues.personal_info.state_of_origin === "Select state") {
          errors.personal_info.state_of_origin = "Please select your state";
        }
        return errors;
      }
      case 2: {
        if (
          inputValues.educational_background.qualification_level ===
          "Select qualification level"
        ) {
          errors.educational_background.qualification_level =
            "Please select your qualification level";
        }
        if (inputValues.educational_background.english_fluency === "") {
          errors.educational_background.english_fluency =
            "Please choose the appropriate option";
        }
        if (inputValues.educational_background.conversation_strength === "") {
          errors.educational_background.conversation_strength =
            "Please choose the appropriate option";
        }

        return errors;
      }
      default: {
        if (inputValues.course_information.course === "Select course") {
          errors.course_information.course = "Please select an option";
        }
        if (inputValues.course_information.session === "") {
          errors.course_information.session =
            "Please choose the appropriate option";
        }
        if (inputValues.course_information.computer_literacy === "") {
          errors.course_information.computer_literacy =
            "Please choose the appropriate option";
        }
        if (inputValues.course_information.ict_referral === "") {
          errors.course_information.ict_referral =
            "Please choose the appropriate option";
        }
        return errors;
      }
    }
  };

  //Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    switch (page) {
      case 1: {
        setErrors(validate(inputFields)); //object of errors
        setSubmitting(true);
        break;
      }
      case 2: {
        setErrors(validate(inputFields)); //object of errors
        setSubmitting2(true);
        break;
      }
      default: {
        setErrors(validate(inputFields)); //object of errors
        setSubmitting3(true);
        break;
      }
    }
  };

  //clear form
  const clearForm = () => {
    notify(
      "info",
      "Clear form?",
      "This will remove your answers from all questions, and cannot be undone."
    );

    Swal.fire({
      title: "Clear form?",
      text: "This will remove your answers from all questions, and cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Clear form",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setInputFields({
          personal_info: {
            firstname: "",
            surname: "",
            other_names: "",
            email: "",
            password: "",
            password_confirmation: "",
            gender: "",
            date_of_birth: "Enter date of birth",
            phone_number: "",
            contact_address: "",
            state_of_origin: "Select state",
          },
          educational_background: {
            qualification_level: "Select qualification level",
            english_fluency: "",
            conversation_strength: "",
          },
          course_information: {
            course: "Select course",
            session: "",
            computer_literacy: "",
            ict_referral: "",
          },
        });
        setSubmitting(false);
        setSubmitting2(false);
        setSubmitting3(false);
      }
    });
  };

  //When form values are valid
  useEffect(() => {
    switch (page) {
      case 1: {
        if (Object.keys(errors.personal_info).length === 0 && submitting) {
          setPage(2);
        }
        break;
      }
      case 2: {
        if (
          Object.keys(errors.educational_background).length === 0 &&
          submitting2
        ) {
          setPage(3);
        }
        break;
      }
      default: {
        if (
          Object.keys(errors.course_information).length === 0 &&
          submitting3 &&
          submitting2 &&
          submitting
        ) {
          makeRequest();
        }
      }
    }
  }, [
    errors.personal_info,
    errors.educational_background,
    errors.course_information,
  ]);

  const makeRequest = async () => {
    try {
      setLoading(true);
      const response = await authService.userRegister(
        inputFields.personal_info.firstname,
        inputFields.personal_info.surname,
        inputFields.personal_info.other_names,
        inputFields.personal_info.email,
        inputFields.personal_info.password,
        inputFields.personal_info.password_confirmation,
        inputFields.personal_info.gender,
        inputFields.personal_info.date_of_birth,
        inputFields.personal_info.phone_number,
        inputFields.personal_info.contact_address,
        inputFields.personal_info.state_of_origin,
        inputFields.educational_background.qualification_level,
        inputFields.educational_background.english_fluency,
        inputFields.educational_background.conversation_strength,
        inputFields.course_information.course,
        inputFields.course_information.session,
        inputFields.course_information.computer_literacy,
        inputFields.course_information.ict_referral
      );

      if (response.status === 201) {
        //Register was successful
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Thank you for registering! A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account. If you don't see the email, be sure to check your spam folder.",
          showConfirmButton: true, // Show the "OK" button
          allowOutsideClick: false, // Prevent closing by clicking outside the dialog
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
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
    } finally {
      setLoading(false);
    }
  };

  //Fetch the Nigerian states
  useEffect(() => {
    async function fetchStates() {
      const response = await authService.getNigerianStates();
      try {
        setNigerianStatesLoading(true);
        if (response.status === 200) {
          setNigerianStates(response.data);
        }
      } catch (error) {
        notify(
          "error",
          "Error",
          "An unexpected error occurred. Please try again."
        );
      } finally {
        setNigerianStatesLoading(false);
      }
    }

    fetchStates();
  }, []);

  //Fetch all courses
  useEffect(() => {
    async function fetchCourses() {
      const response = await authService.getAllCourses();
      try {
        setCoursesLoading(true);
        if (response.status === 200) {
          setCourses(response.result);
        }
      } catch (error) {
        notify(
          "error",
          "Error",
          "An unexpected error occurred. Please try again."
        );
      } finally {
        setCoursesLoading(false);
      }
    }

    fetchCourses();
  }, []);

  //Go back to page one
  const backToPageOne = () => {
    setPage(1);
  };

  //Go back to page 2
  const backToPageTwo = () => {
    setPage(2);
  };

  return (
    <>
      {loading && <Loader />}

      <div className="landing-form__container">
        <form className="landing-form" onSubmit={handleSubmit}>
          <div className="landing-form__logo-container">
            <Link to="/">
              <img
                src={LogoImage}
                alt="logo"
                className="landing-form__logo-image"
              />
            </Link>
          </div>
          <div className="landing-form__box">
            <Typography variant="h3" className="landing-form__header-one">
              Student Register
            </Typography>

            <Typography variant="p" className="landing-form__header-two">
              Enter your info to register
            </Typography>

            <div className="steps">
              <div className="steps__content-container">
                <div className="steps__content-number">1</div>
                <Typography variant="span" className="steps__content-text">
                  Personal info
                </Typography>
                <span></span>
              </div>
              <div className="steps__content-container">
                <div className="steps__content-number">2</div>
                <Typography variant="span" className="steps__content-text">
                  Educational background
                </Typography>
              </div>
              <div className="steps__content-container">
                <div className="steps__content-number">3</div>
                <Typography variant="span" className="steps__content-text">
                  Course of choice
                </Typography>
              </div>
            </div>
            <div className="landing-form__inputs-box">
              {page === 1 && (
                <>
                  <div className="landing-form__input-box-container">
                    <div className="landing-form__input-box">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="landing-form__input-icon"
                      />
                      <input
                        type="text"
                        placeholder="Firstname*"
                        className="landing-form__input"
                        // required
                        value={inputFields.personal_info.firstname}
                        onChange={handleChange}
                        name="firstname"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.firstname}
                    </Typography>
                  </div>
                  <div className="landing-form__input-box-container">
                    <div className="landing-form__input-box">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="landing-form__input-icon"
                      />
                      <input
                        type="text"
                        placeholder="Surname*"
                        className="landing-form__input"
                        // required
                        value={inputFields.personal_info.surname}
                        onChange={handleChange}
                        name="surname"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.surname}
                    </Typography>
                  </div>
                  <div className="landing-form__input-box-container">
                    <div className="landing-form__input-box">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="landing-form__input-icon"
                      />
                      <input
                        type="text"
                        placeholder="Other names"
                        className="landing-form__input"
                        // required
                        value={inputFields.personal_info.other_names}
                        onChange={handleChange}
                        name="other_names"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.other_names}
                    </Typography>
                  </div>
                  <div className="landing-form__input-box-container">
                    <div className="landing-form__input-box">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="landing-form__input-icon"
                      />
                      <input
                        type="text"
                        placeholder="Email*"
                        className="landing-form__input"
                        // required
                        value={inputFields.personal_info.email}
                        onChange={handleChange}
                        name="email"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.email}
                    </Typography>
                  </div>
                  <div className="landing-form__input-box-container">
                    <div className="landing-form__input-box">
                      <FontAwesomeIcon
                        icon={faKey}
                        className="landing-form__input-icon"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password*"
                        className="landing-form__input"
                        // required
                        value={inputFields.personal_info.password}
                        onChange={handleChange}
                        name="password"
                      />
                      <FontAwesomeIcon
                        icon={faEye}
                        className="landing-form__input-icon--eye"
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.password}
                    </Typography>
                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.password_confirmation}
                    </Typography>
                  </div>
                  <div className="landing-form__input-box-container">
                    <div className="landing-form__input-box">
                      <FontAwesomeIcon
                        icon={faKey}
                        className="landing-form__input-icon"
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password*"
                        className="landing-form__input"
                        // required
                        value={inputFields.personal_info.password_confirmation}
                        onChange={handleChange}
                        name="password_confirmation"
                      />
                      <FontAwesomeIcon
                        icon={faEye}
                        className="landing-form__input-icon--eye"
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    </div>
                  </div>

                  <div className="landing-form__radio-container">
                    <div className="landing-form__radio-top">
                      <Form.Check
                        inline
                        label="Male"
                        name="gender"
                        type="radio"
                        id="gender1"
                        value="Male" // Radio button value for Male
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={inputFields.personal_info.gender === "Male"} // Checked if gender is Male
                      />
                      <Form.Check
                        inline
                        label="Female"
                        name="gender"
                        type="radio"
                        id="gender2"
                        value="Female" // Radio button value for Female
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={inputFields.personal_info.gender === "Female"} // Checked if gender is Female
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.gender}
                    </Typography>
                  </div>

                  <div className="landing-form__calender-container">
                    <DatePicker
                      name="date_of_birth"
                      showIcon
                      selected={
                        inputFields.personal_info.date_of_birth !==
                        "Enter date of birth"
                          ? new Date(inputFields.personal_info.date_of_birth)
                          : null
                      }
                      onChange={(date) => {
                        // Ensure the date is formatted as YYYY-MM-DD for Laravel
                        const formattedDate = date
                          ? date.toISOString().split("T")[0] // Format date as YYYY-MM-DD
                          : "Enter date of birth";

                        setInputFields((prevState) => ({
                          ...prevState,
                          personal_info: {
                            ...prevState.personal_info,
                            date_of_birth: formattedDate, // Store formatted date
                          },
                        }));
                      }}
                      placeholderText="Enter date of birth*"
                    />

                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.date_of_birth}
                    </Typography>
                  </div>

                  <div className="landing-form__input-box-container">
                    <div className="landing-form__input-box">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="landing-form__input-icon"
                      />
                      <input
                        type="text"
                        placeholder="Phone number*"
                        className="landing-form__input"
                        // required
                        value={inputFields.personal_info.phone_number}
                        onChange={handleChange}
                        name="phone_number"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.phone_number}
                    </Typography>
                  </div>
                  <div className="landing-form__textarea-box-container">
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Address*"
                        name="contact_address"
                        value={inputFields.personal_info.contact_address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.contact_address}
                    </Typography>
                  </div>

                  <div className="landing-form__select-box-container">
                    <Form.Select
                      aria-label="Default select example"
                      name="state_of_origin" // Ensure this matches the state in inputFields
                      value={inputFields.personal_info.state_of_origin} // Bind the select value to state
                      onChange={handleChange} // Call handleChange on selection
                    >
                      <option value="Select state">Select state</option>
                      {nigerianStatesLoading ? (
                        <option>Loading...</option>
                      ) : (
                        nigerianStates.map((state) => (
                          <option key={state.state_code} value={state.name}>
                            {state.name}
                          </option>
                        ))
                      )}
                    </Form.Select>
                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.state_of_origin}
                    </Typography>
                  </div>
                </>
              )}
              {page === 2 && (
                <>
                  <div className="landing-form__select-box-container">
                    <Form.Select
                      aria-label="Default select example"
                      name="qualification_level" // Ensure this matches the state in inputFields
                      value={
                        inputFields.educational_background.qualification_level
                      } // Bind the select value to state
                      onChange={handleChange} // Call handleChange on selection
                    >
                      <option>Select qualification level</option>
                      <option>O&apos;Level/SSCE</option>
                      <option>Undergraduate</option>
                      <option>National Diploma (ND)</option>
                      <option>National Certificate of Education (NCE)</option>
                      <option>Higher National Diploma (HND)</option>
                      <option>Degree (BSc, B.Tech, B.Edu)</option>
                      <option>Post Graduate</option>
                    </Form.Select>
                    <Typography className="landing-form__span" variant="span">
                      {errors.educational_background.qualification_level}
                    </Typography>
                  </div>
                  <div className="landing-form__box-container">
                    <Typography
                      variant="h5"
                      className="landing-form__radio-heading"
                    >
                      How easy is it for you to speak in English? *
                    </Typography>

                    <div key="default-radio-fluency">
                      <Form.Check
                        label="It happens naturally without me noticing"
                        name="english_fluency"
                        type="radio"
                        id="It happens naturally without me noticing"
                        value="It happens naturally without me noticing"
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={
                          inputFields.educational_background.english_fluency ===
                          "It happens naturally without me noticing"
                        }
                      />
                      <Form.Check
                        label="It is a lot easier than when I started learning, but I still get confused sometimes"
                        name="english_fluency"
                        type="radio"
                        id="It is a lot easier than when I started learning, but I still get confused sometimes"
                        value="It is a lot easier than when I started learning, but I still get confused sometimes"
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={
                          inputFields.educational_background.english_fluency ===
                          `It is a lot easier than when I started learning, but I still get confused sometimes`
                        }
                      />

                      <Form.Check
                        label="I find it quite tricky and have to think about it a lot"
                        name="english_fluency"
                        type="radio"
                        id="I find it quite tricky and have to think about it a lot"
                        value="I find it quite tricky and have to think about it a lot"
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={
                          inputFields.educational_background.english_fluency ===
                          "I find it quite tricky and have to think about it a lot"
                        }
                      />

                      <Form.Check
                        label="I find it hard to string sentences together and use grammar rules correctly"
                        name="english_fluency"
                        type="radio"
                        id="I find it hard to string sentences together and use grammar rules correctly"
                        value="I find it hard to string sentences together and use grammar rules correctly"
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={
                          inputFields.educational_background.english_fluency ===
                          "I find it hard to string sentences together and use grammar rules correctly"
                        }
                      />
                      <Typography className="landing-form__span" variant="span">
                        {errors.educational_background.english_fluency}
                      </Typography>
                    </div>
                  </div>
                  <div className="landing-form__box-container">
                    <Typography
                      variant="h5"
                      className="landing-form__radio-heading"
                    >
                      Can you understand conversations easily? *
                    </Typography>
                    <div key="default-radio-conversation">
                      <Form.Check
                        label="Yes - understanding English is as natural as my native language"
                        name="conversation_strength"
                        type="radio"
                        id="Yes - understanding English is as natural as my native language"
                        value="Yes - understanding English is as natural as my native language"
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={
                          inputFields.educational_background
                            .conversation_strength ===
                          "Yes - understanding English is as natural as my native language"
                        }
                      />
                      <Form.Check
                        label="Most of the time, but sometimes I get lost if everyone is speaking fast"
                        name="conversation_strength"
                        type="radio"
                        id="Most of the time, but sometimes I get lost if everyone is speaking fast"
                        value="Most of the time, but sometimes I get lost if everyone is speaking fast"
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={
                          inputFields.educational_background
                            .conversation_strength ===
                          "Most of the time, but sometimes I get lost if everyone is speaking fast"
                        }
                      />
                      <Form.Check
                        label="I can understand when people speak slowly and clearly"
                        name="conversation_strength"
                        type="radio"
                        id="I can understand when people speak slowly and clearly"
                        value="I can understand when people speak slowly and clearly"
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={
                          inputFields.educational_background
                            .conversation_strength ===
                          "I can understand when people speak slowly and clearly"
                        }
                      />
                      <Form.Check
                        label="I get lost easily and usually only understand a few words in conversation"
                        name="conversation_strength"
                        type="radio"
                        id="I get lost easily and usually only understand a few words in conversation"
                        value="I get lost easily and usually only understand a few words in conversation"
                        className="landing-form__radio-button"
                        onChange={handleChange}
                        checked={
                          inputFields.educational_background
                            .conversation_strength ===
                          "I get lost easily and usually only understand a few words in conversation"
                        }
                      />
                      <Typography className="landing-form__span" variant="span">
                        {errors.educational_background.conversation_strength}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
              {page === 3 && (
                <>
                  <div>
                    <div className="landing-form__select-box-container">
                      <Form.Select
                        aria-label="Default select example"
                        name="course" // Ensure this matches the state in inputFields
                        value={inputFields.course_information.course} // Bind the select value to state
                        onChange={handleChange} // Call handleChange on selection
                      >
                        <option value="Select course">Select course</option>
                        {coursesLoading ? (
                          <option>Loading...</option>
                        ) : (
                          courses.map((course) => (
                            <option key={course.id} value={course.course_name}>
                              {course.course_name}
                            </option>
                          ))
                        )}
                      </Form.Select>
                      <Typography className="landing-form__span" variant="span">
                        {errors.course_information.course}
                      </Typography>
                    </div>

                    <div className="landing-form__box-container">
                      <Typography
                        variant="h5"
                        className="landing-form__radio-heading"
                      >
                        Preferred Class Session *
                      </Typography>
                      <div key="default-radio">
                        <Form.Check
                          label="Morning (10am - 12pm)"
                          name="session"
                          type="radio"
                          id="Morning (10am - 12pm)"
                          value="Morning (10am - 12pm)"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.session ===
                            "Morning (10am - 12pm)"
                          }
                        />
                        <Form.Check
                          label="Afternoon (3pm - 5pm)"
                          name="session"
                          type="radio"
                          id="Afternoon (3pm - 5pm)"
                          value="Afternoon (3pm - 5pm)"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.session ===
                            "Afternoon (3pm - 5pm)"
                          }
                        />
                        <Form.Check
                          label="Weekends only (11am - 2pm) (3pm - 5pm)"
                          name="session"
                          type="radio"
                          id="Weekends only (11am - 2pm) (3pm - 5pm)"
                          value="Weekends only (11am - 2pm) (3pm - 5pm)"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.session ===
                            "Weekends only (11am - 2pm) (3pm - 5pm)"
                          }
                        />
                        <Typography
                          className="landing-form__span"
                          variant="span"
                        >
                          {errors.course_information.session}
                        </Typography>
                      </div>
                    </div>
                    <div className="landing-form__box-container">
                      <Typography
                        variant="h5"
                        className="landing-form__radio-heading"
                      >
                        Do you have basic understanding of computer systems *
                      </Typography>
                      <div key="default-radio">
                        <Form.Check
                          label="Yes, I can operate the computer system"
                          name="computer_literacy"
                          type="radio"
                          id="Yes, I can operate the computer system"
                          value="Yes, I can operate the computer system"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.computer_literacy ===
                            "Yes, I can operate the computer system"
                          }
                        />

                        <Form.Check
                          label="I have a personal computer and I use it effectively"
                          name="computer_literacy"
                          type="radio"
                          id="I have a personal computer and I use it effectively"
                          value="I have a personal computer and I use it effectively"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.computer_literacy ===
                            "I have a personal computer and I use it effectively"
                          }
                        />

                        <Form.Check
                          label="I do not have a personal computer but I can operate a computer system well"
                          name="computer_literacy"
                          type="radio"
                          id="I do not have a personal computer but I can operate a computer system well"
                          value="I do not have a personal computer but I can operate a computer system well"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.computer_literacy ===
                            "I do not have a personal computer but I can operate a computer system well"
                          }
                        />

                        <Form.Check
                          label="No, I have never operated a computer system"
                          name="computer_literacy"
                          type="radio"
                          id="No, I have never operated a computer system"
                          value="No, I have never operated a computer system"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.computer_literacy ===
                            "No, I have never operated a computer system"
                          }
                        />
                        <Typography
                          className="landing-form__span"
                          variant="span"
                        >
                          {errors.course_information.computer_literacy}
                        </Typography>
                      </div>
                    </div>

                    <div className="landing-form__box-container">
                      <Typography
                        variant="h5"
                        className="landing-form__radio-heading"
                      >
                        How did you hear about the ICT Hub? *
                      </Typography>
                      <div key="default-radio">
                        <Form.Check
                          label="Flyers"
                          name="ict_referral"
                          type="radio"
                          id="Flyers"
                          value="Flyers"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.ict_referral ===
                            "Flyers"
                          }
                        />
                        <Form.Check
                          label="Banner"
                          name="ict_referral"
                          type="radio"
                          id="Banner"
                          value="Banner"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.ict_referral ===
                            "Banner"
                          }
                        />
                        <Form.Check
                          label="Road jingle"
                          name="ict_referral"
                          type="radio"
                          id="Road jingle"
                          value="Road jingle"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.ict_referral ===
                            "Road jingle"
                          }
                        />
                        <Form.Check
                          label="Social Media Advert"
                          name="ict_referral"
                          type="radio"
                          id="Social Media Advert"
                          value="Social Media Advert"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.ict_referral ===
                            "Social Media Advert"
                          }
                        />
                        <Form.Check
                          label="Radio Jingle"
                          name="ict_referral"
                          type="radio"
                          id="Radio Jingle"
                          value="Radio Jingle"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.ict_referral ===
                            "Radio Jingle"
                          }
                        />
                        <Form.Check
                          label="Through a friend, relative or someone"
                          name="ict_referral"
                          type="radio"
                          id="Through a friend, relative or someone"
                          value="Through a friend, relative or someone"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.ict_referral ===
                            "Through a friend, relative or someone"
                          }
                        />
                        <Form.Check
                          label="Through a WOF batch 1 students"
                          name="ict_referral"
                          type="radio"
                          id="Through a WOF batch 1 students"
                          value="Through a WOF batch 1 students"
                          className="landing-form__radio-button"
                          onChange={handleChange}
                          checked={
                            inputFields.course_information.ict_referral ===
                            "Through a WOF batch 1 students"
                          }
                        />
                        <Typography
                          className="landing-form__span"
                          variant="span"
                        >
                          {errors.course_information.ict_referral}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="landing-form__progress-bar-container">
                <div className="landing-form__progress-bar">
                  <div className="landing-form__progress-bar-box">
                    <div
                      className="landing-form__progress-bar-level"
                      style={{ width: (page / 3) * 100 + "%" }}
                    ></div>
                  </div>
                  <Typography
                    variant="span"
                    className="landing-form__progress-bar-text"
                  >
                    Page {page} of 3
                  </Typography>
                </div>
                <div className="landing-form__progress-bar-button-group">
                  <div className="landing-form__progress-bar-buttons">
                    {page === 1 ? (
                      <Button
                        className="landing-form__progress-bar-button--back"
                        disabled={loading}
                      >
                        Next
                      </Button>
                    ) : (
                      ""
                    )}
                    {page === 2 ? (
                      <>
                        <Button
                          className="landing-form__progress-bar-button--back"
                          disabled={loading}
                          onClick={backToPageOne}
                        >
                          Back
                        </Button>
                        <Button
                          className="landing-form__progress-bar-button--next"
                          disabled={loading}
                        >
                          Next
                        </Button>
                      </>
                    ) : (
                      ""
                    )}
                    {page === 3 ? (
                      <>
                        <Button
                          className="landing-form__progress-bar-button--back"
                          disabled={loading}
                          onClick={backToPageTwo}
                        >
                          Back
                        </Button>
                        <Button
                          className="landing-form__progress-bar-button--submit"
                          disabled={loading}
                        >
                          Submit
                        </Button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <Typography
                    variant="span"
                    className="landing-form__progress-bar-button-group-text"
                    onClick={clearForm}
                  >
                    Clear form
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="landing-form__text-link-box">
            <Typography variant="span">Already registered?</Typography>{" "}
            <Typography
              variant="span"
              className="landing-form__typography-link"
            >
              <Link to="/">Login now</Link>
            </Typography>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
