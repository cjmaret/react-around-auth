import React from 'react';
import Header from "./Header";
import AuthorizationForm from "./AuthorizationForm";

function Register(props) {
    return (
        <>
         <Header linkTitle="Log in" pageLink="./login" />
         <AuthorizationForm title="Sign up" buttonTitle="Sign up" pageLink="./login" pageLinkTitle="Already a member? Log in here!" onAuthorizationSubmit={props.onRegisterSubmit} />
        </>
    );
}

export default Register;
