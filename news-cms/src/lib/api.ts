import axios from 'axios';

export const API_URL = 'http://localhost:8080/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// We don't add interceptors here because auth is handled by the server (Next.js)
// or by passing the token explicitly in Server Actions.
