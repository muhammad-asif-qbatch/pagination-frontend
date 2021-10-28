import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3005/',
    headers: { 'content-type': 'application/json' }
});
export default instance;