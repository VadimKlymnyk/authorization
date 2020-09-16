import React, {useEffect} from 'react';
import { Button, Form, Input } from 'antd';
import { signUp, login } from '../api/request.js';
import {forwardTo} from "../utils/utils.js";
import '../App.css';

function Auth() {
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.removeItem('authToken');
  }, []);

  const onLogin = async () => {
    try {
        const values = await form.validateFields();
        const response = await login(values)
        if(response) forwardTo('/profile')
    } catch (errorInfo) {
        console.log('Failed:', errorInfo);
    }
  }

  const onSignUp = async () => {
    try {
        const values = await form.validateFields();
        signUp(values)
    } catch (errorInfo) {
        console.log('Failed:', errorInfo);
    }
  }

  return (
    <Form
        style={{ width: '250px' }}
        name="login"
        form={form}
    >
        <Form.Item
        name="email"
        rules={[
            {
            type: 'email',
            message: 'E-mail не коректний!',
            },
            {
            required: true,
            message: 'Введіть E-mail!',
            },
        ]}
        >
        <Input placeholder='E-mail'/>
        </Form.Item>
        <Form.Item
        name="password"
        rules={[
            {
            required: true,
            message: 'Введіть пароль!',
            },
        ]}
        >
        <Input.Password
            placeholder='Пароль'
        />
        </Form.Item>
        <Form.Item >
        <div className='button-area'>
            <Button type="primary"  onClick={onSignUp} className="login-form-button">
                Sign up
            </Button>
            <Button type="primary"  onClick={onLogin} className="login-form-button">
                Login
            </Button>
        </div>
        </Form.Item>
    </Form>
  );
}

export default Auth;