import React from 'react';
import { Redirect } from 'react-router-dom';

const SignOut = ({context}) => {
    context.actions.signOut();
    return (
        <Redirect to="/" />
    );
}

export default SignOut;