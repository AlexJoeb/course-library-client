import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Cookies from 'js-cookie';
import ProtectedRoute from './ProtectedRoute';

import './css/App.css';

import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import SignUp from './components/SignUp';
import NotFound from './components/NotFound';
import Header from './components/Header';

import { withContext } from './Context';

const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const SignInWithContext = withContext(SignIn);
const SignOutWithContext = withContext(SignOut);
const SignUpWithContext = withContext(SignUp);
const HeaderWithContext = withContext(Header);


export default class App extends Component {
  
  state = {
    username: '',
  };

  componentDidMount(){
    this.check();
  }
  
  async check(){
    const { authenticatedUser } = await Cookies.getJSON();
    if(authenticatedUser !== null && authenticatedUser !== undefined){
        const username = `${authenticatedUser.firstName} ${authenticatedUser.lastName}`;
        this.setState({ 
            username
        });
    }
    this.forceUpdate();
}

  render() {
    return (
      <Router>
        <HeaderWithContext username={this.state.username} />
        <Switch>
          {/* Routes */}
          <Route exact path="/" component={CoursesWithContext} />
          <ProtectedRoute path="/courses/create" component={CreateCourseWithContext} />
          <ProtectedRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
          <Route exact path="/courses/:id" component={CourseDetailWithContext} />
          <Route path="/signin" component={SignInWithContext} />
          <Route path="/signup" component={SignUpWithContext} />
          <Route path="/signout" component={SignOutWithContext} />
          <Route component={NotFound} />
          
        </Switch>
      </Router>
    );
  }
}