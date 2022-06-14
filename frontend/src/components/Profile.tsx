import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Button, Col, Form, Layout, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'react-router-dom';
import {SmallUserReview} from './SmallUserReview'
import LayoutHeader from './Header';
import { Footer } from 'antd/lib/layout/layout';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MainFooter from "./MainFooter";

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
  const headers = {
    "Content-Type": "application/json",
  }
  const [edit, setEdit] = useState<boolean>(false)
  const [editAllowed, setEditAllowed] = useState(false)
  const { id } = useParams()
  const [profileId, setProfileId] = useState(id)
  const [loggedId, setLoggedId] = useState(undefined)

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
  }, [profileId, loggedId]);

  const { data, error } = useSWR(`http://localhost:4000/api/users/${id}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const onFinish = async (values: IFormValue) => {
    const headers = {
      "Content-Type": "application/json",
    }
    setEdit(!edit)
    if(edit) {
      console.log(values.aboutMe)
      await axios.put(`http://localhost:4000/api/users/${id}`, {aboutMe: values.aboutMe},{headers, withCredentials: true})
    }

  };

  const user: ProfileProps  = data.data;
  return (
    <>
    <Layout>
      <LayoutHeader setProfileId={setProfileId} setLoggedId={setLoggedId}/>
      <Content>
      <Row style={{height:"3em", backgroundColor:"#030d16"}}>
        <Col span={24}/>
      </Row>
      <Form onFinish={onFinish}>
        <Row style={{backgroundColor:"#030d16"}}>
          <Col span={4}/>
          <Col span={3}>
            <img style={{objectFit: "cover" , width: "100%", maxHeight: "100%", borderRadius: "50%"}} src={user.profilePicture} alt="User's personal icon"/>
          </Col>
          <Col span={1}>
          </Col>
          <Col span={4}>
            <Form.Item style={{background: "#722ed1",position:"absolute",right:"0",bottom:"0"}}>
              {
                profileId === loggedId && <Button htmlType="submit" type="primary" >Edit profile</Button>
              }
            </Form.Item>
          </Col>
          <Col span={11}>
          <Form.Item name="aboutMe" style={{height:"100%",width:"100%"}}>
            <TextArea style={{width: "100%", height: "100%" ,resize: "none", fontSize:"1.3em", color:"black"}} defaultValue={user.aboutMe} disabled={!edit && profileId !== loggedId} />
          </Form.Item>  
          </Col>
          <Col span={1}/>
        </Row>
        </Form>
      <Row style={{height:"3em", backgroundColor:"#030d16" }}>
        <Col span={4}/>
        <Col span={3}>
            <h1 style={{textAlign:"center", color:"white"}}>{user.username}</h1>
        </Col>
        <Col span={15}/>
      </Row>
          {user.reviews.map((review, index) =>  (<div style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}}><SmallUserReview key={review.id} {...review}/></div>))}
      </Content>
      <MainFooter/>
    </Layout>
    </>
  );
};
export default Profile;
