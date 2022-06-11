import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Col, Layout, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'react-router-dom';
import {SmallUserReview} from './SmallUserReview'

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
    const { id } = useParams()
    const { data, error } = useSWR(`http://localhost:4000/api/users/${id}`, fetcher);
    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

  const user: ProfileProps  = data.data;
  return (
    <>
      <Content>
      <Row style={{height:"3em", backgroundColor:"#030d16"}}>
        <Col span={24}/>
      </Row>
        <Row style={{backgroundColor:"#030d16"}}>
          <Col span={7}/>
          <Col span={4}>
            <img style={{objectFit: "cover" , width: "100%", maxHeight: "100%", borderRadius: "50%"}} src={user.profilePicture} alt="User's personal icon"/>
          </Col>
          <Col span={2}/>
          <Col span={8}>
            <TextArea style={{objectFit: "cover" , width: "100%", height: "100%" ,  resize: "none", fontSize:"1.3em", color:"black"}} value={user.aboutMe} disabled />
          </Col>
          <Col span={3}/>
        </Row>
      <Row style={{height:"3em", backgroundColor:"#030d16" }}>
        <Col span={7}/>
        <Col span={4}>
            <h1 style={{textAlign:'center', color:"white"}}>{user.username}</h1>
        </Col>
        <Col span={13}/>
      </Row>
          {user.reviews.map((review, index) =>  (<div style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}}><SmallUserReview key={review.id} {...review}/></div>))}
      </Content>
    </>
  );
};
export default Profile;
