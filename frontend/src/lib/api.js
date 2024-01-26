import axios from "axios";

const token = document.cookie.split("authorization=")[1];
export const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: { authorization: `Bearer ${token}` },
    withCredentials: true 
});
