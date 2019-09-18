import React, { Component } from 'react';

// * Import ReactMarkdown for the Materials List -> Auto Parses the '*' into list items.
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component{
  
    constructor(){
        super();
        this.state = {
            details: [],
            user: {},
            name: '',
            authenticated: false
        }
    }

    async componentDidMount(){
        const { context, match } = this.props;

        await context.data.getCourseDetails(match.params.id)
        .then(details => {
            if (details === 404) return this.props.history.push('/*/notfound');

            const name = `${details.User.firstName} ${details.User.lastName}`;

            // * Check to see if current user is the same as the author => If so, authenticate.
            if (context.authenticatedUser !== null) {
                if (details.User.id === context.authenticatedUser.id) {
                    this.setState({
                        authenticated: true
                    });
                } else {
                    this.setState({
                        authenticated: false
                    });
                }
            }

            if (details.estimatedTime === null 
             || details.estimatedTime === undefined 
             || details.estimatedTime === '') {
                details.estimatedTime = "No time estimate."
            }

            this.setState({ details, name });
        });
    }

    render(){
        const { details, name, authenticated } = this.state;
        const { context } = this.props;

        let emailAddress, password;

        if(authenticated){
            emailAddress = context.authenticatedUser.emailAddress;
            password = context.userPassword;
        }

        return(
            <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            {authenticated ?
                                <span>
                                    <a className="button" href={`/courses/${this.props.match.params.id}/update`}>Update Course</a>
                                    <button className="button" onClick={() => context.actions.deleteCourse(details.id, {emailAddress, password})
                                    .then(()=> this.props.history.push('/'))}>Delete Course</button>
                                </span>
                                :
                                <span></span>
                            }
                            <a className="button button-secondary" href="/">Return to List</a>
                        </div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{details.title}</h3>
                            <p>By {name}</p>
                        </div>
                        <div className="course--description">
                            <ReactMarkdown source={details.description} />
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{details.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ul>
                                        <ReactMarkdown source={details.materialsNeeded} />
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}