import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import ReactMarkdown from 'react-markdown';
import config from '../config';

export default class CourseDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            course: [],
            id: ``,
            title: ``,
            description: ``,
            materialsNeeded: ``,
            estimatedTime: ``,
            userId: ``,
            username: ``,
        }
    }

    componentDidMount(){
        axios.get(`${config.apiBaseURL}/courses/${this.props.match.params.id}`)
        .then(resp => {
            const { course } = resp.data;
            this.setState({
                course,
                title: course.title,
                description: course.description,
                materialsNeeded: course.materialsNeeded,
                estimatedTime: course.estimatedTime,
                id: course.id,
                userId: course.userId,
                username: `${course.User.firstName} ${course.User.lastName}`,
            });
        })
        .catch(err => console.log(`There was an error while fetching and parsing course data => ${err.message}`));
    }

    delete = async (event) => {
        event.preventDefault();
        const { context } = this.props;
        const authUser = context.authenticatedUser;
        let password = prompt(`Please enter your password to confirm deletion.`);

        axios.delete(`${config.apiBaseURL}/courses/${this.state.course.id}`, {
            method: `DELETE`,
            auth: {
                username: `${authUser.emailAddress}`,
                password
            }
        }).then(() => {
            this.props.history.push(`/`);
        }).catch(err => {
            console.log(err);
            this.props.history.push(`/error`);
        })
    }

    render() {
        const { context } = this.props;
        return (
            <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            {  context.authenticatedUser && context.authenticatedUser.id === this.state.userId ? (
                                <React.Fragment>
                                    <span>
                                    <Link className="button" to={`/courses/${this.state.course.id}/update`}>Update Course</Link>
                                    <Link className="button" to="/" onClick={this.delete}>Delete Course</Link>
                                    </span>
                                </React.Fragment>
                            ): ("")}
                            <Link className="button button-secondary" to="/">Return to List</Link>
                        </div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{this.state.course.title}</h3>
                            <p>By {this.state.username}</p>
                        </div>
                        <div className="course--description">
                            <ReactMarkdown source={this.state.description} />
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimate Time</h4>
                                    <h3>{this.state.course.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ul>
                                    <ReactMarkdown source={this.state.course.materialsNeeded} />
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