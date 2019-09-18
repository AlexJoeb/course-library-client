import React, { Component } from 'react';
import Form from './Form';

export default class SignUp extends Component {
    state = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
        errors: [],
    };

    render() {
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword,
            errors,
        } = this.state;
        
        return(
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <div>
                        <Form cancel={this.cancel} errors={errors} submit={this.submit} submitButtonText="Sign Up" elements={() => (
                            <React.Fragment>
                                <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={firstName} /></div>
                                <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={lastName} /></div>
                                <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={emailAddress} /></div>
                                <div><input id="password" name="password" type="password" className="" placeholder="Password" value={password} /></div>
                                <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Re-type Password"
                                value={confirmPassword} /></div>
                                <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><button className="button button-secondary" onclick="event.preventDefault(); location.href='/';">Cancel</button></div>
                            </React.Fragment>
                        )}/>
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? <a href="/signin">Click here</a> to sign in!</p>
                </div>
            </div>
        );
    }

    onChange({target: {name, value}}){
        this.setState({
            [name]: value,
        })
    }

    submit = () => {
        const { context } = this.props;
        const { firstName, lastName, emailAddress, password, passwordConfirm } = this.state;

        // ! Check Passwords Match -> Default: If NOT
        if (password !== passwordConfirm) {
            return this.setState({
                errors: ['Please make sure your passwords match!']
            })
        }
        
        const user = {
            firstName,
            lastName,
            emailAddress,
            password
        };
        
        context.data.createUser(user)
            .then(errors => {
                const errorArr = Object.values(errors)
                if (errorArr.length) {
                    return this.setState({
                        errors: errorArr
                    });
                } else {
                    console.log(`User ${firstName} was succesfully created.`);
                    context.actions.signIn(emailAddress, password)
                        .then(() => {
                            this.props.history.push('/');
                        })
                        .catch(err => console.log(err));
                }
            }).catch(err => console.log(err));

    }

    cancel = () => {
        const { from } = this.props.location.state || { from: { pathname: '/' }};
        this.props.history.push(from);
    }
}