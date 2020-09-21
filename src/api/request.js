import {axiosApiInstance} from './api.js'
import {forwardTo} from "../utils/utils.js";
import { message } from 'antd';



export async function signUp(data) {
    try {
        const response = await axiosApiInstance.post("/sign_up", data);
        message.success(response.data.message);
    } catch (e) {
        message.error(e.message)
    }
    return false
}

export async function login(data) {
    try {
        const response = await axiosApiInstance.post(`/login?email=${data.email}&password=${data.password}`);
        if(response.data.statusCode === 200){
            const { body } = response.data
            localStorage.setItem("access_token", body.access_token);
            localStorage.setItem("refresh_token", body.refresh_token);
            return true
        }
    } catch (e) {
        message.error(e.message)
    }
    return false
    
}

export async function getInfo() {
    try {
        const response = await axiosApiInstance.get('/me');
        return response.data
    } catch (e) {
        forwardTo('/signup')
        message.error(e.message);
    }
}
