import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class SignIn extends Component {
    
    state = {
        emailAddress: '',
        password: '',
        errors: [],
    };

    render() {
        const {
            emailAddress,
            password,
            errors
        } = this.state;

        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                <h1>Sign In</h1>
                <Form cancel={this.cancel} errors={errors} submit={this.onSubmit} submitButtonText="Sign In" elements={() => (
                    <React.Fragment>
                        <input
                        id="emailAddress"
                        name="emailAddress"
                        type="text"
                        value={emailAddress}
                        onChange={this.onChange}
                        placeholder="Email" />
                        <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={this.onChange}
                        placeholder="Password" />
                    </React.Fragment>
                )} />
                <p>
                    Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
                </p>
                </div>
            </div>
        );
    }

    onChange = ({target: { name, value }}) => {
        this.setState(() => {
            return {
                [name]: value,
            }
        });
    }

    onSubmit = (event) => {
        const { context } = this.props;
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { emailAddress, password } = this.state;

        context.actions.signIn(emailAddress, password)
            .then(user => {
                if(user == null){
                    this.setState(() => {
                        return { errors: ['Sign-in was unsuccessful.']}
                    })
                }else{
                    this.props.history.push(from);
                    console.log(`${emailAddress} has been logged in.`);
                }
            })
            .catch(err => {
                console.log(err);
                this.props.history.push(from);
            });
    }
}