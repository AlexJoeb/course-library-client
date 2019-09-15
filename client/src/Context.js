import React, { Component } from 'react';
import axios from 'axios';

const Context = React.createContext();

export class Provider extends Component {

    constructor(){
        super();

        this.state = {
          courses: null,
        }
    }

    // Fetch the Course JSON Object from API.
    componentDidMount() {
      const apiRoute = `http://localhost:5000/api/`;
      axios.get(apiRoute + `/courses`)
        .then((resp) => {
          console.log(resp.data);
          if(resp.status === 200){
            this.setState({
              courses: resp.data,
            })
          }else throw new Error();
        }).catch((err) => console.error(err));
    }


    
    render() {

        // ! Stuff to be passed down the context
        const value = {
            courses: this.state.courses,
        }

        return (
            <Context.Provider value={value}>
              {this.props.children}
            </Context.Provider>
        );
        
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

