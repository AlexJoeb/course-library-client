import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class UpdateCourse extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            title: "",
            author: {},
            description: "",
            estimatedTime:  "",
            materialsNeeded:  [],
            course: {User:{firstName:"", lastName:""}},
            validationErrors: {
                hideShowDesc: false,
                hideShowTitle: false,
                notAuthor: false,
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount(){
        const { context } = this.props;
        const id = this.props.match.params.id;
        const courses = context.api(`/courses/${id}`, `GET`);
        courses
            .then((resp) => {
                const course = resp.data;
                this.setState({
                    course,
                    title: course.title,
                    author: course.User,
                    description: course.description,
                    estimatedTime: course.estimatedTime,
                    materialsNeeded: course.materialsNeeded,
                    
                });
            })
            .catch((err) => console.log(err));
    }

    handleChange(event){
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;

        if(name === `title`){
            this.setState({title: value});
        }

        if(name === `description`){
            this.setState({description: value});
        }

        if(name === `estimatedTime`){
            this.setState({estimatedTime: value});
        }

        if(name === `materialsNeeded`){
            this.setState({materialsNeeded: value});
        }
    }

    handleSubmit(event){
        event.preventDefault();
        const { context } = this.props;

        const {
            title,
            author,
            description,
            estimatedTime,
            materialsNeeded,
        } = this.state;

        const { id } = this.state.course;

        const course = {
            title,
            author,
            description,
            estimatedTime,
            materialsNeeded,
        };
        // * PUT to `api/courses/:id`

        console.log(context);

        const currentUser = context.authenticatedUser;

        if(title.trim() === ``){
            this.setState({
                validationErrors:{
                    hideShowTitle: true,
                }
            });
            return;
        }

        if(description.trim() === ``){
            this.setState({
                validationErrors:{
                    hideShowDesc: true,
                }
            });
            return;
        }

        if(!currentUser){
            this.setState({
                validationErrors: {
                    notAuthor: true,
                }
            })
            return;
        }

        context.api(`/courses/${id}`, `PUT`, course, true, {
            username: currentUser.username,
            password: currentUser.password,
        })
        .then((resp) => console.log(resp))
        .catch((err) => console.log(err));

        // this.props.history.push(`/courses/${this.props.match.params.id}`);
    }

    render() {
        const { course } = this.state;
        const { validationErrors } = this.state;
        const hideShowValidation = validationErrors.title || validationErrors.notAuthor || validationErrors.description ? {display: 'block'} : {display: 'none'};
        const hideShowTitle = validationErrors.title ? {display: 'block'} : {display: 'none'};
        const hideShowDesc = validationErrors.description ? {display: 'block'} : {display: 'none'};
        const notAuthor = validationErrors.notAuthor ? {display: 'block'} : {display: 'none'};
        return(
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                {/* * Warnings for validation. */}
                <div>
                    <h2 className="validation--errors--label" style={hideShowValidation}>Validation errors</h2>
                    <div className="validation-errors">
                        <ul>
                        <li style={notAuthor}>You must be logged in as the author to update this course.</li>
                        <li style={hideShowTitle}>Please provide a value for "Title"</li>
                        <li style={hideShowDesc}>Please provide a value for "Description"</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <form>
                        <div className="grid-66">
                            <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                value={this.state.title} onChange={this.handleChange}/></div>
                            <p>By {`${course.User.firstName} ${course.User.lastName}`}</p>
                            </div>
                            <div className="course--description">
                            <div><textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.handleChange} value={this.state.description}></textarea></div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                                        placeholder="Hours" onChange={this.handleChange} value={this.state.estimatedTime} /></div>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.handleChange} value={this.state.materialsNeeded}></textarea></div>
                                </li>
                            </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick={this.handleSubmit}>Update Course</button><Link className="button button-secondary" to={`/courses/${this.props.match.params.id}`}>Cancel</Link></div>
                    </form>
                </div>
            </div>
        );
    }
}