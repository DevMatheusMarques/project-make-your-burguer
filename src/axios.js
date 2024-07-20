import axios from 'axios';

axios.defaults.baseURL = 'https://api-burger-rho.vercel.app';

axios.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = user.token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axios;
