import React, { Component } from 'react';
import { Link } from "react-router-dom";

import axios from 'axios';

import Config from '../config';

export default class UpdateCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            User: [],
            id: ``,
            title: ``,
            description: ``,
            materialsNeeded: ``,
            estimatedTime: ``,
            errors: []
        };
    }

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
          return {
            [name]: value
          };
        });
      }

      submit = e => {
        e.preventDefault();

        const { context } = this.props;
        const authUser = context.authenticatedUser;
        const emailAddress = authUser.emailAddress;
        const password = prompt("Please enter you password to confirm this action");
        const credentials = btoa(`${authUser.emailAddress}:` + password);

        if (this.state.description === '' || this.state.title === '') {
            this.setState({
                errors: 'Either title or description was not provided.'
            })
        } else {
        axios ({
            method: 'PUT',
            url: `${Config.apiBaseURL}/courses/${this.props.match.params.id}`,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${credentials}`
            },
            auth: {
                username: emailAddress,
                    password
            },
            data:{
                title: this.state.title,
                description: this.state.description,
                estimatedTime: this.state.estimatedTime,
                materialsNeeded: this.state.materialsNeeded
            }
        }).then(()=> {
                this.props.history.push("/");
        }).catch(err => {
            if (err.response.status === 400) {
                this.setState({
                    errors: err.response.data.message
                })
            } else if (err.response.status === 500) {
                this.props.history.push("/error");
            }
        })
      }
    }

    componentDidMount() {
        const {
            id
        } = this.props.match.params;
        axios.get(`${Config.apiBaseURL}/courses/${id}`)
            .then(resp => {
                const { course } = resp.data;
                console.log(course.User);
                this.setState({
                    id: course.id,
                    User: course.User,
                    title: course.title,
                    description: course.description,
                    materialsNeeded: course.materialsNeeded,
                    estimatedTime: course.estimatedTime,
                    })
                }).then(() => {
                    if (this.props.context.authenticatedUser.id !== this.state.User.id) {
                        this.props.history.push("/forbidden");
                    }
                })            
                .catch(err => {
                    console.log(`There was an error while fetching and parsing data => ${err.message}`);
                })
            }

    render() {

        return(
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                    {
                        this.state.errors.length ?
                        (
                            <div>
                                <h2 className="validation--errors--label">Validation errors</h2>
                                <div className="validation-errors">
                                    <ul>
                                        <li>{this.state.errors}</li>
                                    </ul>
                                </div>
                            </div> 
                        ): null
                    }
                <form onSubmit={this.submit}>
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div>
                                <input 
                                    id="title"
                                    name="title"
                                    type="text"
                                    className="input-title course--title--input"
                                    placeholder="Course title..."
                                    value={this.state.title}
                                    onChange={this.change}
                                />
                            </div>
                            <p>By {this.state.user}</p>
                        </div>
                            <div className="course--description">
                                <div>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Course description..."
                                        value={this.state.description}
                                        onChange={this.change}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input 
                                                id="estimatedTime"
                                                name="estimatedTime"
                                                type="text"
                                                className="course--time--input"
                                                value={this.state.estimatedTime}
                                                onChange={this.change}
                                            />
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea
                                                id="materialsNeeded"
                                                name="materialsNeeded"
                                                placeholder="Materials needed"
                                                value={this.state.materialsNeeded}
                                                onChange={this.change}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    <div className="grid-100 pad-botttom">
                        <button className="button" type="submit">Update Course</button>
                        <Link to={'/courses/' + this.props.match.params.id} className="button button-secondary">Cancel</Link>
                    </div>
                </form>
            </div>
        )
    }
}