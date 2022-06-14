import { Alert, Button, Col, Form, Input, Layout, Row } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import axios from 'axios';
import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import LayoutHeader from './Header';
import {MainFooter} from "./MainFooter";

enum ErrorRegister {
  USERNAME_NULL,
  WRONG_PASSWORD,
  NO_ERROR,

}
interface FormValues{
  username:string,
  password:string,
}

const LoginForm: React.FC = () => {
  const [error, setError] = useState<ErrorRegister>(ErrorRegister.NO_ERROR);
  const [goHome, setToGoHome] = useState<boolean>(false);
  const onFinish = async (values: FormValues) => {
    const headers = {
        "Content-Type": "application/json",
    }
    const requestData: FormValues = {
      username: values.username,
      password: values.password,
    }

    const req = await axios.post('http://localhost:4000/api/login', requestData , {headers, withCredentials: true})
    console.log(req)
    if (req.status === 206) {
      setError(ErrorRegister.USERNAME_NULL);
    }else if(req.status === 207) {
      setError(ErrorRegister.WRONG_PASSWORD);
    }else{
      console.log(await axios.get('http://localhost:4000/api/loggedUser', {headers, withCredentials: true}))
      setToGoHome(true);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Layout>
      <LayoutHeader/>
        <Content>
          <Row><Col span={24}>{ErrorAlert(error)}</Col></Row>
          <Row><Col span={24} style={{height:"3em"}}></Col></Row>
          <Row>
          <Col span={8}/>
          <Col span={8}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
            </Col>
            <Col span={8}/>
          </Row>
          {goHome && (<Navigate to="/" replace={true} />)}
        </Content>
      <MainFooter/>
    </Layout>
  );
};

function ErrorAlert(error: ErrorRegister) {
  switch(error){
    case ErrorRegister.NO_ERROR:
      return ;
    case ErrorRegister.WRONG_PASSWORD:
      return (<Alert
      message="Error"
      description="Wrong password!"
      type="error"
      showIcon
    />)
    case ErrorRegister.USERNAME_NULL:
      return (<Alert
      message="Error"
      description="User with written username does not exist!"
      type="error"
      showIcon
    />)
  }
}
export default LoginForm;
