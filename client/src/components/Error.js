import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="bounds">
    <h1>Error</h1>
    <p>Sorry! We just encountered an unexpected error.</p>
    <p>Return to homepage <Link to="/">Click here</Link></p>
  </div>
);