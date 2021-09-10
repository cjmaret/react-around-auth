import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.svg";
import HamburgerMenuIcon from "../images/hamburger_icon_white.svg";
import CloseMenuIcon from "../images/close-icon.svg";

function Header(props) {
  const [mobileWidth, setMobileWidth] = React.useState(false);
  const [ismobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    function checkWidth() {
      const windowWidth = window.matchMedia("(max-width: 550px)");
      if (windowWidth.matches) {
        setMobileWidth(true);
      } else {
        setMobileWidth(false);
      }
    }
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  });

  function handleHamburgeMenuClick() {
    setIsMobileMenuOpen(!ismobileMenuOpen);
  }

  return (
    <header className={`header ${props.loggedIn && "header__mobile"}`}>
      <div className="header__logo-group">
        <img className="logo" src={logo} alt="logo" />
        {props.loggedIn && mobileWidth && (
          <img
            className="header__hamburger-logo"
            src={!ismobileMenuOpen ? HamburgerMenuIcon : CloseMenuIcon}
            alt=""
            onClick={handleHamburgeMenuClick}
          />
        )}
      </div>
      <div
        className={`header__info-group ${
          mobileWidth && props.loggedIn && "header__info-group_type_mobile"
        } ${
          mobileWidth && !ismobileMenuOpen && props.loggedIn && "mobile-menu"
        }`}
      >
        {props.loggedIn && <p className="header__email">cjmaret@gmail.com</p>}
        <Link
          className={`header__link ${
            mobileWidth && props.loggedIn && "header__link_type_mobile"
          } ${
            props.loggedIn
              ? "header__link_type_grey"
              : "header__link_type_white"
          }`}
          to={props.pageLink}
        >
          {props.linkTitle}
        </Link>
      </div>
    </header>
  );
}

export default Header;
