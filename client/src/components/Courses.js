import React, { Component } from 'react';
// import Course from './Course';

export default class Courses extends Component {

    constructor(props){
        super();

        const { context } = props;

        this.state = {
            courses: context.actions.getCourses() || [],
        };
    }

    render() {
        console.log(this.state.courses);
        return (
            <div className="bounds">
                {/* { this.state.courses.map((course) => <Course key={course.id} course={course} />) } */}
                <div className="grid-33">
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