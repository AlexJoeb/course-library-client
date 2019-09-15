import React from 'react';

const ActionBar = (props) => {
    return (
        <div className="actions--bar">
            <div className="bounds">
                <div className="grid-100">
                    <span>
                        <a className="button" href={`/courses/:${props.id}/update`}>Update Course</a>
                        <a className="button" href={`/courses/:${props.id}`}>Delete Course</a>
                    </span>
                    <a className="button button-secondary" href="/">Return to List</a>
                </div>
            </div>
        </div>
    );
}

export default ActionBar;