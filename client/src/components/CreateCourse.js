import React, { Component } from 'react';

export default class CreateCourse extends Component {

    state = {
        title: "",
        description: "",
        materialsNeeded: "",
        estimatedTime: "",
        validationErrors: {
            title: false,
            description: false,
        },
    };

    handleCancel(event){
        event.preventDefault();
    }

    handleSubmit(event){
        event.preventDefault();
    }

    titleChange(event) {
        this.setState({
            title: event.target.value,
        });
    }

    descChange(event) {
        this.setState({
            description: event.target.value,
        });
    }

    materialsChange(event) {
        this.setState({
            materialsNeeded: event.target.value,
        });
    }

    timeChange(event) {
        this.setState({
            estimatedTime: event.target.value,
        });
    }

    render() {
        const { validationErrors } = this.state;
        const hideShowValidation = validationErrors.title || validationErrors.description ? {display: 'block'} : {display: 'none'};
        const hideShowTitle = validationErrors.title ? {display: 'block'} : {display: 'none'};
        const hideShowDesc = validationErrors.description ? {display: 'block'} : {display: 'none'};
        return(
                <div className="bounds course--detail">
                    <h1>Create Course</h1>
                    <div>
                        <div>
                            <h2 className="validation--errors--label" style={hideShowValidation}>Validation errors</h2>
                            <div className="validation-errors">
                                <ul>
                                <li style={hideShowTitle}>Please provide a value for "Title"</li>
                                <li style={hideShowDesc}>Please provide a value for "Description"</li>
                                </ul>
                            </div>
                        </div>
                        <form>
                            <div className="grid-66">
                                <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                    onChange={(event) => this.titleChange(event)} value={this.state.title} /></div>
                                <p>By Joe Smith</p>
                                </div>
                                <div className="course--description">
                                <div><textarea id="description" name="description" className="" placeholder="Course description..." value={this.state.description} onChange={(event) => this.descChange(event)}></textarea></div>
                                </div>
                            </div>
                            <div className="grid-25 grid-right">
                                <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                                            placeholder="Hours, Day, Weeks, etc." onChange={(event) => this.timeChange(event)} value={this.state.estimatedTime} /></div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div><textarea id="materialsNeeded" name="materialsNeeded" className="" value={this.state.materialsNeeded} onChange={(event) => this.materialsChange(event)} placeholder="List all materials. Use '*' before every listed item."></textarea></div>
                                    </li>
                                </ul>
                                </div>
                            </div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Create Course</button>
                                <button className="button button-secondary" onClick={(event) => this.handleCancel(event)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
        );
    }
}