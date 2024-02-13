import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
*
* Intercept all the requests and responses and handle the token refresh logic.
* If the token is expired, it will refresh the token and retry the request.
* If the token is not available, it will redirect the user to the login page.
* If the server is not reachable, it will show a network error message.
*
*/
api.interceptors.request.use(
  (responce) => {
    return responce;
  },

  async (error) => {
    const originalRequest = error.config;

    if (typeof error.response === 'undefined') {
      alert('A server/network error occurred.  Please check your internet connection and try again.');
      return Promise.reject(error);
    }

    if(error.response.status === 401 && originalRequest.url === 'http://localhost:3000/api/auth/refresh') {
      window.location.href = '/login/';
      return Promise.reject(error);
    }

    if (error.responce.data.code === 'token_not_valid' && error.responce.status === 401 && error.responce.statusText === 'Unauthorised'){
      const refreshToken = localStorage.getItem('refresh_token');

      if(refreshToken){
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

        const now = Math.ceil(Date.now() / 1000);
        console.log(tokenParts.exp);

        if(tokenParts.exp > now){
          return api.post('/auth/refresh', {refresh: refreshToken})
          .then((responce) => {
            localStorage.setItem('access_token', responce.data.access);
            localStorage.setItem('refresh_token', responce.data.refresh);

            // https://axios-http.com/docs/config_defaults
            api.defaults.headers['Authorization'] = 'Bearer ' + responce.data.access;
            originalRequest.headers['Authorization'] = 'Bearer ' + responce.data.access;

            return api(originalRequest);
          })
          .catch((err) => {
            console.log(err);
          });
        } else {
          console.log('Refresh token is expired', tokenParts.exp, now);
          window.location.href = '/login/';
        }
      } else {
        console.log('Refresh token not available.');
        window.location.href = '/login/';
      }
    }
  }

)
