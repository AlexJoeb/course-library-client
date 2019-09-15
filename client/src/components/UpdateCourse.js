import React, { Component } from 'react';

export default class UpdateCourse extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            title: "",
            author: "",
            description: "",
            estimatedTime:  "",
            materialsNeeded:  [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }

    componentDidMount(){
        const { context } = this.props;

        
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

    handleCancel(event){
        event.preventDefault();

    }

    handleSubmit(event){
        event.preventDefault();

    }

    render() {
        // eslint-disable-next-line
        const { context } = this.props;
        const courses = context.courses;

        return(
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                <div>
                    <form>
                        <div className="grid-66">
                            <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                value={this.state.title} onChange={this.handleChange}/></div>
                            <p>By Joe Smith</p>
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
                        <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick={this.handleSubmit}>Update Course</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
                    </form>
                </div>
            </div>
        );
    }
}