import axios from "axios";

// Retrieve token from cookies
 const token = document.cookie.split('=')[1];
 console.log(token)
export const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: { authorization: `Bearer ${token}` },
    withCredentials: true // Indicates whether or not cross-site Access-Control requests should be made using credentials
});
