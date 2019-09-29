// * Import baseURL (`http://localhost:5000/api`) from the config.
import apiBaseURL from './config';

export default class Data {

    // * .api() is used to fetch data from the API.
    api(path, method = 'GET', body = null, requiresAuth = false, creds = null){
        // * Add the path to baseURL, (ex: `http://localhost:5000/api/courses`)
        const url = apiBaseURL.apiBaseURL + path;

        // * Setup options object for the fetch.
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        }

        // * If there is a body object (information to pass) -> JSON.Stringify it.
        if(body !== null){
            options.body = JSON.stringify(body);
        }

        // * If route requires auth, then pass token (ex: `Basic bi2345njn234nj52l2n`) as the authentication in the headers.
        if(requiresAuth){
            const encodedCreds = btoa(`${creds.emailAddress}:${creds.password}`);
            options.headers['Authorization'] = `Basic ${encodedCreds}`;
        }

        // * Execute API Fetch.
        return fetch(url, options);
    }

    async getUser(emailAddress, password){
        // * Use API to GET the data on the current user ({ emailAddress, password}).
        const response = await this.api(`/users`, `GET`, null, true, { emailAddress, password });
        if(response.status === 200){
            // * User found, response as JSON.
            return response.json().then(data => data);
        } else if (response.status === 401) {
            // * Credentials are not authorized.
            return null;
        } else {
            // * Something unknown happened..
            throw new Error(`Something unknown happened..`);
        }
    }
    
    async createUser(user) {
        // * Use API to POST the data on the passed user object.
        const response = await this.api('/users', 'POST', user);

        if (response.status === 201) {
            return [];
        }
        else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            });
        }
        else {
            throw new Error();
        }
    }
}