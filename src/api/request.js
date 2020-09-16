import {request, requestAuth} from './api.js'
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
            const newTokensData = {
                access_token: body.access_token,
                expires_in: Date.now()+60000,
                refresh_token: body.refresh_token
            }
            localStorage.setItem("authToken", JSON.stringify(newTokensData));
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
        console.log(e)

    }
}
