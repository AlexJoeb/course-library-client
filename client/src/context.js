import React, { Component } from 'react';

// * Import Data for API Access
import Data from './data';

// * Import js-cookie for access to browser cookies.
// * js-cookie documentation: https://github.com/js-cookie/js-cookie
import Cookies from 'js-cookie';

// * Create context instance.
const Context = React.createContext();

export class Provider extends Component {

    constructor(){
        super();
        
        // * Initalize a new Data() instance.
        this.data = new Data();

        // * Set the state of the authenticated user to either the cookie's authenticatedUser or null if that doesn't exist.
        // * This allows the user to stay logged in even through URI refreshes.
        this.state = {
            authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
        }
    }

    // * Sign the user in with passed credentials.
    signIn = async (emailAddress, password) => {

        // * Attempt to fetch the user by email and password, await response before going on.
        const user = await this.data.getUser(emailAddress, password);

        // * If user is not null, and user is found ->
        if(user !== null){
            // * Set state's authenticatedUser to the found user instance;
            this.setState(() => {
                return {
                    authenticatedUser: user,
                }
            });
            // * Set the browser cookie's authenicated user as a stringed version of user.
            // * { expires: 1 } tells the browser to expire the cookie in 1 day. That way the user will have to eventually re-login for security.
            Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
        }

        // * Return the found user object.
        return user;
    }

    // * Sign the user out.
    signOut = () => {
        // * No authentication needed to exit an account.. obviously.
        // * Code will just go and set all authenticatedUser instances to null and remove the respective cookie.
        this.setState(() => {
            return {
                authenticatedUser: null,
            }
        });
        Cookies.remove('authenticatedUser');
    }

    render() {
        const { authenticatedUser } = this.state;

        const value = {
            authenticatedUser,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut,
            }
        };

        return (
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

// * Export the Context's Consumer.
export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} - A higher-order component.
 */

// * Export by default the withContext(Component) functiton.
// * This function allows other components (ex: Header, SignIn, SignOut, etc.) to access context.
export default function withContext(Component) {
    return function ContextComponent(props) {
      return (
        <Context.Consumer>
          {context => <Component {...props} context={context} />}
        </Context.Consumer>
      );
    }
}
  