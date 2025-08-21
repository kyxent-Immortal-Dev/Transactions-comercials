import axios from "axios";




export const HttpClient = axios.create({
    baseURL : import.meta.env.VITE_BACKEND
})