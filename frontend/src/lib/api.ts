import axios from 'axios';

const API_URL = (typeof window === 'undefined' ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
