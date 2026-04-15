import axios from "axios";

const API_URL = 'http://localhost:3001';

const $api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

$api.interceptors.request.use(function (config) {
    // const token = localStorage.getItem('accessToken');
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
});

$api.interceptors.response.use((config) => {
    return config;
}, ((error) => {
    const config = error.config;

    if (error.response &&
        error.response.status === 401 &&
        error.config &&
        !error.config._isRetry
    ) {
        config._isRetry = true;

        try {
            const response = axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true })
            return $api.request(config);
        } catch (e) {
            console.log(e.message);
        }
    }
}));

export default $api;