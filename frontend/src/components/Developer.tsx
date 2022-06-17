import {GameProps} from './Game'
import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Col, Layout, Row } from 'antd'

import { useParams } from 'react-router-dom';
import LayoutHeader from './Header';
import MainFooter from "./MainFooter";
import SmallGameCard from './SmallGameCard';
import '../styles/developer.css'

export interface DeveloperProps{
    id:string,
    name:string,
    description:string,
    games:GameProps[]
}

const { Content } = Layout;



function Developer() {
  const { id } = useParams()
  const { data, error } = useSWR(`http://localhost:4000/api/developers/${id}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;


  const developer: DeveloperProps  = data.data;
  return (
    <>
    <Layout>
      <LayoutHeader/>
      <Content>
        <Row style={{height:"3em", backgroundColor:"#030d16"}}>
            <Col span={24}/>
        </Row>
        <Row style={{ backgroundColor:"#030d16"}}>
            <Col span={5}/>
            <Col span={14}>
                <h1 className='developer-title'>{developer.name}</h1>
                <h3 className='developer-description'>{developer.description}</h3>
            </Col>
            <Col span={5}/>
        </Row>
        <Row style={{height:"3em", backgroundColor:"#030d16"}}>
            <Col span={24}/>
        </Row>
        {developer.games.map((game, index) =>  (<div style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}}><SmallGameCard key={game.name} {...game}/></div>))}
      </Content>
      <MainFooter/>
    </Layout>
    </>
  );
};
export default Developer;
