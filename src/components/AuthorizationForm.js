import React from "react";
import { Link } from "react-router-dom";
import "./AuthorizationForm.css";

function AuthorizationForm(props) {

  return (
    <div className="auth-container">
      <div className="upper-flex-container">
        <h2 className="auth-container__title">{props.title}</h2>
        <div className="auth-container__inputs">
          <div className="auth-container__input-group">
            <input
              id="auth-container__email-input"
              className="auth-container__input"
              placeholder="Email"
            />
            <span
              id="auth-container__email-input-error"
              className="auth-container__input-error"
            ></span>
          </div>
          <div className="auth-container__input-group">
            <input
              id="auth-container__password-input"
              className="auth-container__input"
              placeholder="Password"
            />
            <span
              id="auth-container__password-input-error"
              className="auth-container__input-error"
            ></span>
          </div>
        </div>
      </div>
      <div className="lower-flex-container">
        <button className="auth-container__submit-button" onClick={props.onAuthorizationSubmit}>
          {props.buttonTitle}
        </button>
        <Link to={props.pageLink} className="auth-container__switch-link">
          {props.pageLinkTitle}
        </Link>
      </div>
    </div>
  );
}

export default AuthorizationForm;
