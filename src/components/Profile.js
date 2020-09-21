import React, {useState, useEffect} from 'react';
import { Button, Typography  } from 'antd';
import { getInfo } from '../api/request.js';
import {forwardTo} from "../utils/utils.js";
import '../App.css';

function Profile() {
    const [text, setText] = useState('')

    const requestMe =  async () => {
        const response = await getInfo();
        if(response && response.body) setText(response.body.message)
    }

    useEffect(() => {
        requestMe()
    }, []);

    const onLogout = () => {
        setText('')
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        forwardTo('/signup')
    }
  

  return (
    <div >
        {text && <Typography.Title level={3}>{text}</Typography.Title>}
        <Button type="primary" onClick={onLogout}  className="login-form-button">
            Logout
        </Button>
    </div>
  );
}

export default Profile;
