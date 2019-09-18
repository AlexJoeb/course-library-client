import config from './config';

export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    
    return fetch(url, options);
  } 

  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, 'GET', null, true, {
      emailAddress,
      password
    });

    if (response.status === 200) {
      // * If response is OK (200) -> Return data retrieved from fetch.
      return response.json().then(data => data);
    } else if (response.status === 401) {
      // * Else return null.
      return null;
    } else {
      throw new Error();
    }
  }

  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return await response.json();
    } else {
      throw new Error();
    }
  }

  getCourses = async () => {
    const response = await this.api('/courses', 'GET', null);
    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status > 400 && response.status < 500) {
      return response.json();
    } else {
      throw new Error();
    }
  }

  async getCourseDetails(id) {
    const response = await this.api(`/courses/${id}`, 'GET', null);
    if (response.status === 200) {
      return response.json()
    } else if (response.status === 404) {
      return 404;
    } else {
      throw new Error();
    }
  }

  async createCourse(course, { emailAddress, password }) {
    const response = await this.api('/courses/', 'POST', course, true, { emailAddress, password });
    console.log(response);
    if (response.status === 201) {
      // * Course successfully created.
      return [];
    } else if (response.status === 401 || response.status === 400) {
      return response.json();
    } else {
      throw new Error();
    }
  }

  async updateCourseDetail(course, id, { emailAddress, password }) {
    const response = await this.api('/courses/' + id, 'PUT', course, true, { emailAddress, password });
    if (response.status === 204) {
      return [];
    } else if (response.status === 401 || response.status === 400) {
      return await response.json();
    } else {
      throw new Error();
    }

  }

  async deleteCourse(courseId, { emailAddress, password }) {
    const response = await this.api(`/courses/${courseId}`, 'DELETE', null, true, { emailAddress, password });
    if (response.status === 204) {
      // * Successful Deletion.
      return [];
    } else if (response.status === 401) {
      return await response.json();
    } else {
      throw new Error();
    }
  }
}