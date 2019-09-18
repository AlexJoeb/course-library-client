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
          userPassword: Cookies.getJSON(`userPassword`) || null,
        }
    }
    
    render() {

        // ! Stuff to be passed down the context
        const {authenticatedUser, userPassword} = this.state;

        const value = {
          authenticatedUser,
          userPassword,
          data: this.data,
          actions:{
            signIn: this.signIn,
            signOut: this.signOut,
            updateCourse: this.updateCourse,
            createCourse: this.createCourse,
            deleteCourse: this.deleteCourse
          }
        }

        return (
            <Context.Provider value={value}>
              {this.props.children}
            </Context.Provider>
        );
    }
    
    signIn = async (emailAddress, password) => {
      const user = await this.data.getUser(emailAddress, password);

      //* Check if user is valid.
      if (user !== null) {
        this.setState(() => {
          return {
            authenticatedUser: user,
            userPassword: password
          };
      });

        //* Set cookies for authenticatedUser and userPassword that exprire in 1 day.
        Cookies.set('authenticatedUser', JSON.stringify(user), {
          expires: 1
        });
        Cookies.set('userPassword', JSON.stringify(password), {
          expires: 1
        });
      }

      return user;
    }

    async updateCourse(course, id, {emailAddress, password}) {
      const courseUpdated = await this.data.updateCourseDetail(course, id, { emailAddress, password });
      
      if (courseUpdated) {
        return courseUpdated
      }
    }

    createCourse = async (course, {emailAddress, password}) => {
      const newCourse = await this.data.createCourse(course, { emailAddress, password });
      if (newCourse) return newCourse;
    }

    signOut = () => {
      this.setState(()=>{
        return{
          authenticatedUser: null,
          userPassword: null
        };
      });

      Cookies.remove('authenticatedUser');
      Cookies.remove('userPassword');
    }

    async deleteCourse(courseId, { emailAddress, password }){
      const deletedCourse = await this.data.deleteCourse(courseId, { emailAddress, password });
      if (deletedCourse) return deletedCourse;
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

