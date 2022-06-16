import React from "react";
import masthead from "../../assets/images/masthead.png";
import InputComponent from "../common/input_component/input_component/input_component";
import ButtonComponent from "../common/button_component/button_component.js.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_HOST, SANCTUM } from "../../helpers/global/global_config";
import { useNavigate } from "react-router-dom";
import { ALERT_ENUM, popupAlert } from "../../helpers/alert_response";
import { useDispatch } from "react-redux";
import { setRefresh } from "../../features/reducers/popup_response";
import { axiosHeader } from "../../config/axios_config";

const USER_INFO = {
  user: "user",
  token: "token",
  token_type: "token_type",
};

const LoginView = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loginForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("This field is required")
        .max(255, "Invalid input"),
      password: Yup.string()
        .required("This field is required")
        .max(255, "Invalid input"),
    }),
    onSubmit: async (values) => {
      dispatch(setRefresh(true));
      await axios
        .get(SANCTUM + "sanctum/csrf-cookie")
        .then(async (res) => {
          console.log(res);
          await axios
            .post(API_HOST + "login", values, { axiosHeader })
            .then((res) => {
              const data = res.data;
              window.sessionStorage.getItem(USER_INFO.user);
              window.sessionStorage.getItem(USER_INFO.token);
              window.sessionStorage.getItem(USER_INFO.token_type);
              window.sessionStorage.setItem(USER_INFO.user, data?.user);
              window.sessionStorage.setItem(
                USER_INFO.token,
                data?.access_token
              );
              window.sessionStorage.setItem(
                USER_INFO.token_type,
                data?.token_type
              );
              popupAlert({ message: "Login Successfully" });
              navigate("/rsp/dashboard");
            })
            .catch((err) => {
              console.log(err.response.data.message);
              popupAlert({
                message: err.response.data.message,
                type: ALERT_ENUM.fail,
              });
            });
        })
        .catch((err) => {
          popupAlert({ message: err.message, type: ALERT_ENUM.fail });
        });
      dispatch(setRefresh(false));
    },
  });

  return (
    <React.Fragment>
      <div>
        <div className="blue-div">
          <div className="img-div">
            <img className="image-dost" src={masthead} alt="DOST IHRMIS" />
          </div>
          <div className="title-div">
            <h1>Integrated Human Resource Management Information System</h1>
          </div>
        </div>
        <div className="white-div">
          <form onSubmit={loginForm.handleSubmit}>
            <span>
              <label>
                <strong>Username</strong>
              </label>
              <InputComponent
                name="username"
                onChange={loginForm.handleChange}
                className="input-div"
              />
              {loginForm.touched.username && loginForm.errors.username ? (
                <p className="error-validation-styles">
                  {loginForm.errors.username}
                </p>
              ) : null}
            </span>
            <br />
            <span>
              <label>
                <strong>Password</strong>
              </label>
              <InputComponent
                type="password"
                name="password"
                onChange={loginForm.handleChange}
                className="input-div"
              />
              {loginForm.touched.password && loginForm.errors.password ? (
                <p className="error-validation-styles">
                  {loginForm.errors.password}
                </p>
              ) : null}
            </span>
            <br />
            <br />
            <span>
              <ButtonComponent
                type="submit"
                className="login-button"
                buttonName="Login"
              />
            </span>
            <br />
            <br />
            <span className="copyright-div">
              <p>Copyright 2021 DOST. All rights reserved.</p>
            </span>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginView;
