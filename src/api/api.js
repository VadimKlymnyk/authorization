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
    if (localStorage.access_token && localStorage.expires_in && localStorage.refresh_token) {
        tokenData = {
            access_token: localStorage.access_token,
            expires_in: localStorage.expires_in,
            refresh_token: localStorage.refresh_token,
        };
    } else {
        const error = new Error('The token is missing')
        error.name = "AuthError"
        throw error
    }
    if (tokenData) {
        if (Date.now() >= tokenData.expires_in) {
            try {
                const newToken = await refreshToken(tokenData.refresh_token);
                const { body } = newToken
                localStorage.setItem("access_token", body.access_token);
                localStorage.setItem("expires_in", Date.now()+60000);
                localStorage.setItem("refresh_token", body.refresh_token);
                tokenData = {
                    access_token: body.access_token,
                    expires_in: Date.now()+60000,
                    refresh_token: body.refresh_token,
                };

            } catch (e) {
                const error = new Error("Can not update token")
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
    if (json.statusCode === 401 || json.status === "error") {
        throw new Error(json.message || json.body.message)
    }
    return response.ok ? json : Promise.reject(json.error);  
}