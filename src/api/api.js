const axios = require('axios');
export const axiosApiInstance  = axios.create({baseURL: "http://142.93.134.108:1111", });

axiosApiInstance.interceptors.request.use(
    config => {
        const access_token = localStorage.access_token;
        const refresh_token = localStorage.refresh_token;
        if (access_token && config.url !== "/refresh") {
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }
        if (refresh_token && config.url === "/refresh") {
            config.headers['Authorization'] = `Bearer ${refresh_token}`;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

const refreshToken =  async () => {
    const response = await axiosApiInstance.post('/refresh');
    const { body } = response.data
    if(response.data.statusCode === 200){
        localStorage.setItem("access_token", body.access_token);
        localStorage.setItem("refresh_token", body.refresh_token);
        return axiosApiInstance.get('/me');
    }
}

axiosApiInstance.interceptors.response.use(
    config => {
      if(config.config.url === "/me" ){
        if(config.data.statusCode === 401 || config.data.status === 'error'){
            return refreshToken()
        }   
      }

      if(config.data.status === 'error' || config.data.status_code === 401 || config.data.statusCode === 401){
        throw new Error(config.data.message || config.data.body.message)
      }
      return config;
    }
  );

