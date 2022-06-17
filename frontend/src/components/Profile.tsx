import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Button, Col, Form, Input, Layout, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'react-router-dom';
import {SmallUserReview} from './SmallUserReview'
import LayoutHeader from './Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MainFooter from "./MainFooter";
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

const { Content } = Layout;

export interface ProfileProps {
    id:string,
    username:string,
    password:string,
    aboutMe:string,
    isAdmin:boolean,
    profilePicture:string,
    reviews:any[]
}
interface IFormValue{
  aboutMe: string
}
function Profile() {

  const [edit, setEdit] = useState<boolean>(false)
  const [editAllowed, setEditAllowed] = useState(false)
  const { id } = useParams()
  const [profileId, setProfileId] = useState(id)
  const [loggedId, setLoggedId] = useState(undefined)
  
  const headers = {
    "Content-Type": "application/json",
  }

  useEffect(() => {
    axios.get('http://localhost:4000/api/loggedUser', {headers, withCredentials: true}).then(response => {
    setLoggedId(response.data.data.userId)
    if (id === response.data.data.userId) {
      setEditAllowed(true)
    }
    else {
      setEditAllowed(false)
    }
  })
  }, [profileId, loggedId, headers, id]);

  const { data, error } = useSWR(`http://localhost:4000/api/users/${id}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const onFinish = async (values: IFormValue) => {
    console.log(values.aboutMe)

    setEdit(!edit)
    if(edit) {
      console.log("TEDKA")
      await axios.put(`http://localhost:4000/api/users/${id}`, {aboutMe: values.aboutMe},{headers, withCredentials: true})
    }

  };

  const user: ProfileProps  = data.data;
  return (
    <>
    <Layout>
      <LayoutHeader setProfileId={setProfileId} setLoggedId={setLoggedId}/>
      <Content>
      <Form onFinish={onFinish} style={{margin:"0"}}>
      <Row style={{height:"3em", backgroundColor:"#030d16"}}>
        <Col span={24}/>
      </Row>
      <Row style={{backgroundColor:"#030d16", margin:"0"}}>
        <Col span={4}/>
        <Col span={3}>
          <img style={{objectFit: "cover" , width: "100%", maxHeight: "100%", borderRadius: "50%"}} src={user.profilePicture} alt="User's personal icon"/>
        </Col>
        <Col span={4}/>
        <Col span={11} style={{margin:"0"}}>
          <Form.Item name="aboutMe" style={{margin:"0"}} initialValue={user.aboutMe}>
            <TextArea style={{resize: "none", fontSize:"1.3em", color:"black", margin:"0", height:"12vw"}} disabled={!edit || profileId !== loggedId} />
          </Form.Item>
        </Col>
        <Col span={2}/>
      </Row>
      <Row style={{height:"3em", backgroundColor:"#030d16" }}>
        <Col span={4}/>
        <Col span={3}>
            <h1 style={{textAlign:"center", color:"white"}}>{user.username}</h1>
        </Col>
        <Col span={4}/>
        <Col span={11}>
          <Form.Item style={{margin:"0", float:"left"}}>
          {
            profileId === loggedId && <Button htmlType="submit" type="primary" icon={(edit) ? <UnlockOutlined />:<LockOutlined />}>EDIT ABOUT ME</Button>
          }
          </Form.Item>
        </Col>
        <Col span={6}/>
      </Row>
      </Form>
          {user.reviews.map((review, index) =>  (<div style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}}><SmallUserReview key={review.id} {...review}/></div>))}
      </Content>
      <MainFooter/>
    </Layout>
    </>
  );
};
export default Profile;
