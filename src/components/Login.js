import React from 'react';
import Header from "./Header";
import AuthorizationForm from "./AuthorizationForm";

function Login() {
    return (
        <>
         <Header linkTitle="Sign up" pageLink="./register" />
         <AuthorizationForm title="Log in" buttonTitle="Log in" pageLink="./register" pageLinkTitle="Not a member yet? Sign up here!" />
        </>
    );
}

export default Login;
