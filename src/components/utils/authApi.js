import {forwardTo} from "./utils.js";
import { message } from 'antd';

const URL = 'http://142.93.134.108:1111'

export const request =  async (path, method, data) => {
    const response = await fetch(URL+path, {
            "method": method,
            "headers": { "Content-Type": "application/json",},
            "body": JSON.stringify(data)
    })
    const json = await response.json();
    return response.ok ? json : Promise.reject(json.error); 
}

const refreshToken =  async (refresh_token) => {
    const bearer = `Bearer ${refresh_token}`;

    const response = await fetch(URL+'/refresh', {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': bearer,
        },
        method: "POST",
    });

    const json = await response.json();
    return response.ok ? json : Promise.reject(json.error);
}

export const requestAuth = async (path, method) => {

    let tokenData = null;
    let bearer = null;
    if (localStorage.authToken) {
        tokenData = JSON.parse(localStorage.authToken);
    } else {
        forwardTo('/signup')
        const error = new Error('The token is missing')
        message.error('The token is missing');
        error.name = "AuthError"
        throw error
    }
    if (tokenData) {
        if (Date.now() >= tokenData.expires_in) {
            try {
                const newToken = await refreshToken(tokenData.refresh_token);
                const { body } = newToken
                const newTokensData = {
                    access_token: body.access_token,
                    expires_in: Date.now()+60000,
                    refresh_token: body.refresh_token
                }
                localStorage.setItem("authToken", JSON.stringify(newTokensData));
                tokenData = newTokensData

            } catch (e) {
                forwardTo('/signup')
                const error = new Error("Can not update token")
                message.error("Can not update token");
                error.name = "AuthError"
                throw error

            }
        }
        bearer = `Bearer ${tokenData.access_token}`;
    }

    const response = await fetch(URL+path, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': bearer,
        },
        "method": method,
    });
    const json = await response.json();
    if (json.statusCode === 401) {
        forwardTo('/signup')
        message.error(json.body.message)
        throw new Error(json.body.message)
    }
    return response.ok || response.status < 400 ? json : Promise.reject(json.error);  
}