import React, { Component } from 'react';
import Course from './Course';

export default class Courses extends Component {
    
    constructor(props){
        super();
        
        
        this.state = {
            courses: [],
        };
    }
    
    componentDidMount= async () => {
        const { context } = this.props;

        await context.data.getCourses()
        .then(courses => {
            this.setState({courses});

        });
    }

    render() {
        const { courses } = this.state;
        return (
            <div className="bounds">
                { courses.map((course, index) => <Course key={index} course={course} />) }
                <div key={99} className="grid-33">
                    <a className="course--module course--add--module" href="/courses/create">
                        <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 13 13" className="add">
                            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                        </svg>New Course</h3>
                    </a>
                </div>
          </div>
        );
    }
}