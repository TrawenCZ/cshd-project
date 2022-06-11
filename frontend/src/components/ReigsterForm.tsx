import { Alert, Button, Col, Form, Input, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import axios from 'axios';
import React, { useState } from 'react';
import { Navigate } from "react-router-dom";

enum ErrorRegister {
  USERNAME_EXISTS,
  PASSWORDS_NOT_SAME,
  NO_ERROR,

}
interface FormValues{
  username:string,
  password:string,
  passwordRepeat:string,
}

const RegisterForm: React.FC = () => {
  const [error, setError] = useState<ErrorRegister>(ErrorRegister.NO_ERROR);
  const [goHome, setToGoHome] = useState<boolean>(false);
  const onFinish = async (values: FormValues) => {
    if (values.password !== values.passwordRepeat) {
      setError(ErrorRegister.PASSWORDS_NOT_SAME);
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    }
    const requestData: FormValues = {
      username: values.username,
      password: values.password,
      passwordRepeat: values.passwordRepeat,
    }
    const req = await axios.post('http://localhost:4000/api/users', requestData, {headers})
    if (req.status === 204) {
      setError(ErrorRegister.PASSWORDS_NOT_SAME);
    }else if(req.status === 205) {
      setError(ErrorRegister.USERNAME_EXISTS);
    }else{
      setToGoHome(true);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Content>
      <Row><Col span={24}>{ErrorAlert(error)}</Col></Row>
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

          <Form.Item
            label="Confirm password"
            name="passwordRepeat"
            rules={[{ required: true, message: 'Please confirm your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        </Col>
        <Col span={8}/>
      </Row>
      {goHome && (<Navigate to="/" replace={true} />)}
    </Content>
  );
};

function ErrorAlert(error: ErrorRegister) {
  switch(error){
    case ErrorRegister.NO_ERROR:
      return ;
    case ErrorRegister.PASSWORDS_NOT_SAME:
      return (<Alert
      message="Error"
      description="Passwords are not the same, please use the same passwords!"
      type="error"
      showIcon
    />)
    case ErrorRegister.USERNAME_EXISTS:
      return (<Alert
      message="Error"
      description="Username already exists in the database, please choose a diffrent username!"
      type="error"
      showIcon
    />)
  }
}
export default RegisterForm;
