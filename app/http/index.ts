import axios from "axios";
import { API_URL } from "~/shared/api";

const $api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

$api.interceptors.request.use(function (config) {
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