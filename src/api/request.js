import {request, requestAuth} from './api.js'
import {forwardTo} from "../utils/utils.js";
import { message } from 'antd';

export async function signUp(data) {
    try {
        const response = await request('/sign_up', 'POST',  data );
        if(response && response.status==='Ok'){
            message.success('Користувач зареєстрований');
            return true
        }
        message.error('Помилка реєстрації');
        return false
    } catch (e) {
        console.log(e)
    }
    return false
}

export async function login(data) {
    try {
        const response = await request(`/login?email=${data.email}&password=${data.password}`, 'POST');
        if(response.statusCode === 200){
            const { body } = response
            localStorage.setItem("access_token", body.access_token);
            localStorage.setItem("expires_in", Date.now()+60000);
            localStorage.setItem("refresh_token", body.refresh_token);
            return true
        }else{
            message.error(response.message || response.body.message);
        }
        
    } catch (e) {
        console.log(e)
    }
    return false
    
}

export async function getInfo() {
    try {
        const response = await requestAuth('/me', 'GET')
        return response
    } catch (e) {
        forwardTo('/signup')
        message.error(e.message);
    }
}
