import axios from 'axios';

export const API_URL = (typeof window === 'undefined' ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL);

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// We don't add interceptors here because auth is handled by the server (Next.js)
// or by passing the token explicitly in Server Actions.
