import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
    <div className="bounds">
        <h1>Forbidden</h1>
        <p>You do not have permission to make changes to this course.</p>
        <Link to="/" className="button button-secondary">Return to Courses</Link>
    </div>
)