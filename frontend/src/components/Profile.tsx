import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Button, Col, Layout, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'react-router-dom';
import {SmallUserReview} from './SmallUserReview'
import LayoutHeader from './Header';
import { Footer } from 'antd/lib/layout/layout';
import { useState, useRef } from 'react';

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
function Profile() {
  const [edit, setEdit] = useState<boolean>(false)
  const { id } = useParams()
  const ref = useRef(null)
  const { data, error } = useSWR(`http://localhost:4000/api/users/${id}`, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const handleClick = () => {
    setEdit(!edit)
    //console.log("")

  };

  const user: ProfileProps  = data.data;
  return (
    <>
    <Layout>
      <LayoutHeader/>
      <Content>
      <Row style={{height:"3em", backgroundColor:"#030d16"}}>
        <Col span={24}/>
      </Row>
        <Row style={{backgroundColor:"#030d16"}}>
          <Col span={4}/>
          <Col span={3}>
            <img style={{objectFit: "cover" , width: "100%", maxHeight: "100%", borderRadius: "50%"}} src={user.profilePicture} alt="User's personal icon"/>
          </Col>
          <Col span={1}>
          <Button type="primary" style={{background: "#722ed1"}} onClick={handleClick} >Primary</Button>
          </Col>
          <Col span={4}/>
          <Col span={10}>
            <TextArea ref={ref} style={{objectFit: "cover" , width: "100%", height: "100%" ,  resize: "none", fontSize:"1.3em", color:"black"}} defaultValue={user.aboutMe} disabled={!edit} />
          </Col>
          <Col span={1}/>
        </Row>
      <Row style={{height:"3em", backgroundColor:"#030d16" }}>
        <Col span={4}/>
        <Col span={3}>
            <h1 style={{textAlign:'center', color:"white"}}>{user.username}</h1>
        </Col>
        <Col span={15}/>
      </Row>
          {user.reviews.map((review, index) =>  (<div style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}}><SmallUserReview key={review.id} {...review}/></div>))}
      </Content>
      <Footer>Footer</Footer>
    </Layout>
    </>
  );
};
export default Profile;
