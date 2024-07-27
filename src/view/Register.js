import React, { useState, useEffect } from "react";
//React route dom
import { Link, useNavigate } from "react-router-dom";
//app.css style
import "./../App.css";

//images
import LogoImage from "./../assets/images/logo.png";

//Custom component
import Button from "./../components/atom/button/Button";
import Typography from "./../components/atom/typography/Typography";

//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faEye } from "@fortawesome/free-solid-svg-icons";

//Validator
import validator from "validator";

//Spinner loader
import Loader from "./../components/atom/loader";

//API service
import authService from "./../api/authService";

//js-cookies
import Cookies from "js-cookie";

//utils
import { notify } from "./../utils/Notification";
import { phonePregMatch } from "./../utils/PregMatch";

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
      date_of_birth: "",
      phone_number: "",
      contact_address: "",
      state_of_origin: "",
    },
    educational_background: {
      qualification_level: "",
      english_fluency: "",
      conversation_strength: "",
    },
    course_of_choice: {
      course: "",
      session: "",
      computer_literacy: "",
      ict_referral: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [firstPage, setFirstPage] = useState(true);
  const [secondPage, setSecondPage] = useState(false);
  const [thirdPage, setThirdPage] = useState(false);

  //Show and hide password
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //Set value of inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" || type === "radio" ? checked : value;

    setInputFields({ ...inputFields, [name]: newValue });
  };

  //Validate inputs
  const validate = (inputValues) => {
    setFirstPage(false);
    setSecondPage(false);
    setThirdPage(false);
    let errors = {};
    if (inputValues.firstname.length < 3) {
      errors.firstname = "Enter a valid firstname";
    }
    if (inputValues.surname.length < 3) {
      errors.surname = "Enter a valid surname";
    }
    if (
      inputValues.other_names.length < 3 ||
      inputValues.other_names.length === 0
    ) {
      errors.other_names = "Enter valid other names";
    }
    if (!validator.isEmail(inputValues.email)) {
      errors.email = "Enter a valid email address";
    }
    if (inputValues.password.length < 6) {
      errors.password = "Password should not be less than 6 characters";
    } else if (inputValues.password !== inputValues.password_confirmation) {
      errors.password_confirmation =
        "Password and confirm password did not match";
    }
    if (inputValues.date_of_birth.value === "") {
      errors.date_of_birth = "Enter valid date of birth";
    }
    if (!phonePregMatch.test(inputValues.phone_number)) {
      errors.phone_number = "Enter a valid phone number";
    }
    if (inputValues.contact_address.length < 3) {
      errors.contact_address = "Enter a valid contact address";
    }
    if (inputValues.state_of_origin.value === "Select state") {
      errors.state_of_origin = "Please select your state";
    }
    if (inputValues.course.value === "Select course") {
      errors.course = "Please select an option";
    }
    if (inputValues.session.value === "") {
      errors.session = "Please choose the appropriate option";
    }

    if (inputValues.qualification_level.value === "") {
      errors.qualification_level = "Please choose the appropriate option";
    }
    if (inputValues.english_fluency.value === "") {
      errors.english_fluency = "Please choose the appropriate option";
    }
    if (inputValues.computer_literacy.value === "") {
      errors.computer_literacy = "Please choose the appropriate option";
    }
    if (inputValues.ict_referral.value === "") {
      errors.ict_referral = "Please choose the appropriate option";
    }

    return errors;
  };

  //Next button
  // const nextButton = (e) => {
  //   e.preventDefault();
  //   setErrors(validate(inputFields)); //object of errors
  //   setSubmitting(true);
  // };

  //Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(inputFields)); //object of errors
    setSubmitting(true);
  };

  //When form values are valid
  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      makeRequest();
    }
  }, [errors]);

  const makeRequest = async () => {
    try {
      setLoading(true);
      const response = await authService.userRegister(
        inputFields.firstname,
        inputFields.surname,
        inputFields.other_names,
        inputFields.email,
        inputFields.password,
        inputFields.password_confirmation,
        inputFields.gender,
        inputFields.date_of_birth,
        inputFields.phone_number,
        inputFields.contact_address,
        inputFields.state_of_origin,
        inputFields.course,
        inputFields.session,
        inputFields.qualification_level,
        inputFields.english_fluency,
        inputFields.conversation_strength,
        inputFields.computer_literacy,
        inputFields.ict_referral
      );

      if (response.status === 200) {
        //Here I used the remember me value in the checkbox as the condition of the lenght of the token. With this I do not have to create a remember me cookie which would be different from the token cookie.
        const expirationTime = response.remember_me ? 30 : 1;
        Cookies.set("auth_user_token", response.token, {
          expires: expirationTime,
          secure: true,
          sameSite: "lax",
        });
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
              {firstPage && (
                <>
                  <div className="landing-form__input-box-container">
                    <div className="landing-form__input-box">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="landing-form__input-icon"
                      />
                      <input
                        type="text"
                        placeholder="Enter your firstname"
                        className="landing-form__input"
                        // required
                        value={inputFields.firstname}
                        onChange={handleChange}
                        name="firstname"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.firstname}
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
                        placeholder="Enter your surname"
                        className="landing-form__input"
                        // required
                        value={inputFields.surname}
                        onChange={handleChange}
                        name="surname"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.surname}
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
                        placeholder="Enter your other names"
                        className="landing-form__input"
                        // required
                        value={inputFields.other_names}
                        onChange={handleChange}
                        name="other_names"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.other_names}
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
                        placeholder="Enter your email"
                        className="landing-form__input"
                        // required
                        value={inputFields.email}
                        onChange={handleChange}
                        name="email"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.email}
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
                        placeholder="Enter your password"
                        className="landing-form__input"
                        // required
                        value={inputFields.password}
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
                      {errors.password}
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
                        placeholder="Enter your password"
                        className="landing-form__input"
                        // required
                        value={inputFields.password}
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
                      {errors.password}
                    </Typography>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      checked="checked"
                    />
                    <label htmlFor="male">Male</label>
                    <input type="radio" name="gender" id="female" />
                    <label htmlFor="female">Female</label>
                  </div>
                  <div>
                    <input type="date" name="date_of_birth" />
                    <Typography className="landing-form__span" variant="span">
                      {errors.date_of_birth}
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
                        placeholder="Enter your phone number"
                        className="landing-form__input"
                        // required
                        value={inputFields.phone_number}
                        onChange={handleChange}
                        name="phone_number"
                      />
                    </div>

                    <Typography className="landing-form__span" variant="span">
                      {errors.phone_number}
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
              {secondPage && (
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
                      <option>Select course</option>
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
              {thirdPage && (
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
              <Button className="landing-form__button" disabled={loading}>
                Next
              </Button>
              {secondPage && (
                <Button className="landing-form__button" disabled={loading}>
                  Back
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
