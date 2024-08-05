import React, { useState, useEffect } from "react";
//React route dom
import { Link, useNavigate } from "react-router-dom";

//images
import LogoImage from "./../assets/images/logo.png";

//Custom component
import Button from "./../components/atom/button/Button";
import Typography from "./../components/atom/typography/Typography";
import Radio from "./../components/atom/radio/Radio";

//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faEye,
  faUser,
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

//App scss
import "./../App.scss";

function Register() {
  const navigate = useNavigate();

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
      state_of_origin: "",
    },
    educational_background: {
      course: "",
      session: "",
      qualification_level: "",
      english_fluency: "",
    },
    other_info: {
      conversation_strength: "",
      computer_literacy: "",
      ict_referral: "",
    },
  });
  const [errors, setErrors] = useState({
    personal_info: "",
    educational_background: "",
    other_info: "",
  });
  const [submitting, setSubmitting] = useState(false);
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
    let newValue = type === "radio" ? checked : value;

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
            other_info: {
              ...prevState.other_info,
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
      other_info: {},
    };
    switch (page) {
      case 1: {
        if (inputValues.personal_info.firstname.length < 3) {
          errors.personal_info.firstname = "Enter a valid firstname";
        }
        if (inputValues.personal_info.surname.length < 3) {
          errors.personal_info.surname = "Enter a valid surname";
        }
        if (
          inputValues.personal_info.other_names.length < 3 &&
          inputValues.personal_info.other_names
        ) {
          errors.personal_info.other_names = "Enter valid names";
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
        if (inputValues.personal_info.date_of_birth.value === "") {
          errors.personal_info.date_of_birth = "Enter valid date of birth";
        }
        if (!phonePregMatch.test(inputValues.personal_info.phone_number)) {
          errors.personal_info.phone_number = "Enter a valid phone number";
        }
        if (inputValues.personal_info.contact_address.length < 3) {
          errors.personal_info.contact_address =
            "Enter a valid contact address";
        }
        if (
          inputValues.personal_info.state_of_origin.value === "Select state"
        ) {
          errors.personal_info.state_of_origin = "Please select your state";
        }
        return errors;
      }
      case 2: {
        if (
          inputValues.educational_background.course.value === "Select course"
        ) {
          errors.educational_background.course = "Please select an option";
        }
        if (inputValues.educational_background.session.value === "") {
          errors.educational_background.session =
            "Please choose the appropriate option";
        }

        if (
          inputValues.educational_background.qualification_level.value ===
          "Select qualification level"
        ) {
          errors.educational_background.qualification_level =
            "Please select your qualification level";
        }
        if (inputValues.educational_background.english_fluency.value === "") {
          errors.educational_background.english_fluency =
            "Please choose the appropriate option";
        }
        return errors;
      }
      default: {
        if (inputValues.other_info.computer_literacy.value === "") {
          errors.other_info.computer_literacy =
            "Please choose the appropriate option";
        }
        if (inputValues.other_info.ict_referral.value === "") {
          errors.other_info.ict_referral =
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
        break;
      }
      case 2: {
        setErrors(validate(inputFields)); //object of errors
        break;
      }
      default: {
        setErrors(validate(inputFields)); //object of errors
        setSubmitting(true);
        break;
      }
    }
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
          submitting
        ) {
          setPage(3);
        }
        break;
      }
      default: {
        if (Object.keys(errors.other_info).length === 0 && submitting) {
          makeRequest();
        }
      }
    }
  }, [errors.personal_info, errors.educational_background, errors.other_info]);

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
        inputFields.educational_background.course,
        inputFields.educational_background.session,
        inputFields.other_info.conversation_strength,
        inputFields.other_info.computer_literacy,
        inputFields.other_info.ict_referral
      );

      if (response.status === 200) {
        //Register was successfull
        setLoading(false);
        navigate("/home");
      } else if (response.status === 422) {
        setLoading(false);
        notify("error", "Input Validation", response.message);
      } else if (response.status === 401) {
        setLoading(false);
        notify("error", "User Login", response.message);
      } else if (response.status === 500) {
        setLoading(false);
        notify("error", "System Error", response.message);
      } else {
        setLoading(false);
        notify("error", "Error", "An unexpected error occurred");
      }
    } catch (error) {
      setLoading(false);
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    }
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
                        placeholder="Enter your firstname*"
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
                        placeholder="Enter your surname*"
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
                        placeholder="Enter your other names"
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
                        placeholder="Enter your email*"
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
                        placeholder="Enter your password*"
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
                        placeholder="Confirm new password*"
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
                    <Radio
                      id="gender1"
                      name="gender"
                      label="Male"
                      checked="checked"
                      className="landing-form__radio-button"
                    />
                    <Radio
                      id="gender2"
                      name="gender"
                      label="Female"
                      className="landing-form__radio-button"
                    />
                  </div>
                  <div className="landing-form__calender-container">
                    <DatePicker
                      name="date_of_birth"
                      showIcon
                      placeholderText="Enter date of birth*"
                    />
                    <Typography className="landing-form__span" variant="span">
                      {errors.personal_info.date_of_birth}
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
                        placeholder="Enter your phone number*"
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
                  <div>
                    <textarea
                      name="contact_address"
                      placeholder="Enter your contact address"
                    ></textarea>
                  </div>
                  <div>
                    <select name="state">
                      <option>Select state</option>
                      <option>Lagos</option>
                      <option>Abia</option>
                      <option>Osun</option>
                      <option>Kaduna</option>
                    </select>
                  </div>
                </>
              )}
              {page === 2 && (
                <>
                  <div>
                    <select name="course">
                      <option>Select course</option>
                      <option>Graphics Design - UI/UX</option>
                      <option>Web Design</option>
                      <option>Digital Marketing/Content Creation</option>
                      <option>Photography/Video Editing</option>
                    </select>
                  </div>
                  <div>
                    <input type="radio" name="session" id="morning" />
                    <label htmlFor="morning">Morning (10am - 12pm)</label>
                    <input type="radio" name="session" id="afternoon" />
                    <label htmlFor="afternoon">Afternoon (3pm - 5pm)</label>
                    <input type="radio" name="session" id="evening" />
                    <label htmlFor="evening">
                      Weekends only (11am - 2pm) (3pm - 5pm)
                    </label>
                  </div>
                  <div>
                    <select name="qualification_level">
                      <option>Select qualification level</option>
                      <option>O Level/SSCE</option>
                      <option>Undergraduate</option>
                      <option>National Diploma (ND)</option>
                      <option>National Certificate of Education (NCE)</option>
                    </select>
                  </div>
                  <div>
                    <input type="radio" name="english_fluency" id="natural" />
                    <label htmlFor="natural">
                      It happens naturally without me noticing
                    </label>
                    <input type="radio" name="english_fluency" id="easy" />
                    <label htmlFor="easy">
                      It is a lot easier than when I started learning, but I
                      still get confused sometimes
                    </label>
                  </div>
                </>
              )}
              {page === 3 && (
                <>
                  <div>
                    <input
                      type="radio"
                      name="conversation_strength"
                      id="natural"
                    />
                    <label htmlFor="natural">
                      Yes - understanding English is as natural as my native
                      language
                    </label>
                    <input
                      type="radio"
                      name="conversation_strength"
                      id="lost"
                    />
                    <label htmlFor="lost">
                      Most of the time, but sometimes I get lost if everyone is
                      speaking fast
                    </label>
                  </div>
                  <div>
                    <input type="radio" name="computer_literacy" id="1" />
                    <label htmlFor="1">
                      Yes, I can operate the computer system
                    </label>
                    <input type="radio" name="computer_literacy" id="2" />
                    <label htmlFor="2">
                      I have a personal computer and I use it effectively
                    </label>
                  </div>
                  <div>
                    <input type="radio" name="ict_referral" id="1" />
                    <label htmlFor="1">Flyers</label>
                    <input type="radio" name="ict_referral" id="2" />
                    <label htmlFor="2">Banner</label>
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
                  >
                    Clear form
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
