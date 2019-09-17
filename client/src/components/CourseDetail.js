import React, { Component } from 'react';
import axios from 'axios';

import ActionBar from './ActionBar';

export default class CourseDetail extends Component {
    
    state = {
        course: {},
    };

    componentDidMount(){
        const { context } = this.props;

        axios.get(context.apiRoute + `/courses`)
        .then((resp) => {
          if(resp.status === 200){
                const courses = resp.data;
                const id = Number.parseInt(this.props.match.params.id);
                const course = courses.filter(course => course.id === id);
                this.setState({
                    course: course[0],
                    materials: this.cleanupMaterials(course[0].materialsNeeded),
                })
          }else throw new Error();
        }).catch((err) => console.error(err));
    }

    cleanupMaterials(str = ""){
        if(str === "" || !str) return ["No materials needed."];
        let list = str.split(/\*\s/g);
        list = list.map(item => item.replace(/\n/g, ""));
        list = list.filter(item => item !== "");
        return list;
    }

    render() {
        const {course, materials } = this.state;
        const author = course.User || {firstName: "", lastName: ""};
        return (
            <div>
                <ActionBar />
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course.title}</h3>
                            <p>{`${author.firstName} ${author.lastName}`}</p>
                        </div>
                        <div className="course--description">
                            <p>{course.description}</p>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{course.estimatedTime ? course.estimatedTime : "No time estimate."}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ul>
                                        {materials ? materials.map(item => <li key={materials.indexOf(item)}>{item}</li>) : ""}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}