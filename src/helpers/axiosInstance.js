import axios from 'axios';

export const BASE_URL = "http://localhost:8090/api/";

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 25000;

export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const privateRequest = axios.create({
    baseURL: BASE_URL
});

privateRequest.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser && currentUser['accessToken'] ? currentUser['accessToken'] : "";
    config.headers.Authorization = TOKEN ? `Bearer ${TOKEN}` : '';
    return config;
}, (error) => Promise.reject(error));
