import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component{
  constructor() {
      super();

      this.state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: []
      }
  }

  render(){
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    const { context } = this.props;

    return(
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <Form cancel={this.onCancel} errors={errors} submit={(e) => this.onSubmit(e)} submitButtonText="Create Course" elements={() => (
            <React.Fragment>
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <div>
                            <input
                            id="title"
                            name="title"
                            className="input-title course--title--input"
                            type="text"
                            value={title}
                            onChange={this.onChange}
                            placeholder="Title" />
                        </div>
                        <p>by{`${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}`}</p>
                    </div>
                    <div className="course--description">
                        <div>
                            <textarea
                            id="description"
                            name="description"
                            type="text"
                            value={description}
                            onChange={this.onChange}
                            placeholder="Course Description"
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
                                    id= "estimatedTime"
                                    name = "estimatedTime"
                                    type="text"
                                    value={estimatedTime}
                                    onChange={this.onChange}
                                    placeholder="Estimated Time"
                                    />
                            </div>
                            </li>
                            <li className="course--stats--list--item">
                            <h4>Materials Needed</h4>
                            <textarea
                                id="materialsNeeded"
                                name="materialsNeeded"
                                type="text"
                                value={materialsNeeded}
                                onChange={this.onChange}
                                placeholder="Materials Needed"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        )}/>
      </div>
    )
  }
  onChange = ({target: {name, value}}) => {
    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const { context } = this.props;
    const data = this.state;

    const { authenticatedUser, userPassword } = context;
    const {
      id:userId,
      emailAddress,
    } = authenticatedUser;

    data.userId = userId;

    context.actions.createCourse(data, {emailAddress, userPassword});
      .then((resp) => {
        console.log(resp);
      })
      .catch(err => console.log(err));
  }

  onCancel = () => {
    this.props.history.push('/');
  }
};