import React, { Component } from 'react';

import ActionBar from './ActionBar';

export default class CourseDetail extends Component {
    
    state = {

    };

    render() {
        return (
            <div>
                <ActionBar />
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">INSERT COURSE NAME</h3>
                            <p>INSERT COURSE OWNER NAME</p>
                        </div>
                        <div className="course--description">
                            <p>INSERT COURSE DESC</p>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>INSERT TIME ESTIMATE</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ul>
                                        <li>INSERT LIST OF MATERIALS NEEDED</li>
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