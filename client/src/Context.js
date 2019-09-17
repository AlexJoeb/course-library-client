import React, { Component } from 'react';
import Data from "./Data";
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component {
    
    constructor() {
        super();
        this.data = new Data();
    
        this.state = {
          authenticatedUser: Cookies.getJSON(`authenticatedUser`) || null,
        }
    }
    
    render() {

        // ! Stuff to be passed down the context
        const {authenticatedUser} = this.state;

        const value = {
          authenticatedUser,
          data: this.data,
          actions: {
            signIn: this.signIn,
            signOut: this.signOut,
            getCourses: this.data.getCourses,
            createCourse: this.data.createCourse
          }
        }

        return (
            <Context.Provider value={value}>
              {this.props.children}
            </Context.Provider>
        );
    }

    signIn = async (username, password) => {
      const user = await this.data.getUser(username, password);
      
      if (user !== null) {
        this.setState(() => {
          return {
            authenticatedUser: user,
          };
        });

        Cookies.set(`authenticatedUser`, JSON.stringify(user), { expires: 1 });
      }

      return user;
    }

    signOut = () => {
      this.setState({authenticatedUser: null});
      Cookies.remove(`authenticatedUser`);
    }

}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
};

