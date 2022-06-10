import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Layout } from 'antd'
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
        <p>{user.username}</p>
        <img src={user.profilePicture} alt="User's personal icon"/>
        <TextArea rows={4} value={user.aboutMe} disabled/>
        {user.reviews.map((review) =>  <SmallUserReview key={review.id} {...review}/>)}

      </Content>
    </>
  );
};

export default Profile;