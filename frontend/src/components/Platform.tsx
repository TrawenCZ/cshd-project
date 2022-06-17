import {GameProps} from './Game'
import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Button, Col, Layout, Row } from 'antd'

import { useParams, useNavigate } from 'react-router-dom';
import LayoutHeader from './Header';
import MainFooter from "./MainFooter";
import SmallGameCard from './SmallGameCard';
import { HomeOutlined } from '@ant-design/icons';
import '../styles/platform.css';

export interface PlatformProps{
    id:string,
    name:string,
    description:string,
    officialPage:string,
    games:GameProps[]
}


const { Content } = Layout;



function Platform() {
    const { id } = useParams()
    const { data, error } = useSWR(`http://localhost:4000/api/platforms/${id}`, fetcher);

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    const platform: PlatformProps  = data.data;
    return (
        <>
        <Layout>
        <LayoutHeader/>
        <Content>
        <Row style={{height:"1em", backgroundColor:"#030d16"}}>
                <Col span={24}/>
            </Row>
            <Row style={{height:"2em", backgroundColor:"#030d16"}}>
                <Col span={21}/>
                <Col span={2}>
                    <Button style={{float:"right"}} type="primary" icon={<HomeOutlined />} onClick={() => window.location.replace(platform.officialPage)}>Webpage</Button>
                </Col>
                <Col span={1}/>
            </Row>
            <Row style={{ backgroundColor:"#030d16"}}>
                <Col span={5}/>
                <Col span={14}>
                    <h1 className='platform-title'>{platform.name}</h1>
                    <h3 className='platform-description'>{platform.description}</h3>
                </Col>
                <Col span={5}/>
            </Row>
            <Row style={{height:"3em", backgroundColor:"#030d16"}}>
                <Col span={24}/>
            </Row>
            {platform.games.map((game, index) =>  (<div style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}}><SmallGameCard key={game.name} {...game}/></div>))}
        </Content>
        <MainFooter/>
        </Layout>
        </>
    );
};
export default Platform;
