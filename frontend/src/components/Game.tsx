import {ImageProps} from './Image'
import {ReviewProps} from './Review'
import {PlatformProps} from './Platform'
import {GenreProps} from './Genre'
import {DeveloperProps} from './Developer'
import MainFooter from "./MainFooter";

import { Link } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../models/fetcher';
import { useState } from 'react';
import { format } from "date-fns";

import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'react-router-dom';
import { Layout, Row, Col, Carousel, Image, Tag,
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,} from 'antd';
import LayoutHeader from './Header';

const { Header, Footer, Sider, Content } = Layout;


export interface GameProps{
  name:string,
  pictures:ImageProps[],
  description: string,
  officialPage: string,
  rating: number,
  releaseDate: Date,
  gameModes: string[],
  genres: GenreProps[],
  developer: DeveloperProps,
  developerId: string,  
  platforms: PlatformProps[],
  reviews: ReviewProps[]
};


function Game() {
  const [genreId, setGenre] = useState('21');
  const { id } = useParams()
  const { data, error } = useSWR(`http://localhost:4000/api/games/${id}`, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const game: GameProps  = data.data;
  var date = new Date("2016-01-04 10:34:23");
  const formattedDate = format(date, "MMMM do, yyyy H:mma");
  {/* TODO format the releaseDate instead of this placeholder */}
  return (
    <>
    <Layout>
    <LayoutHeader setGenres={setGenre}/>
      <Content>
        <Row justify="center" gutter={[24, 16]}>
        <Col span={11}>
          <Row justify="space-between">
            <h1 style={{color:"black", fontSize:"50px"}}>{game.name}</h1>
            <h1 style={{color:"black", fontSize:"50px"}}>{game.rating}%</h1>
          </Row>

            <Carousel>
            {game.pictures.map((picture => {
                return(
                <div>
                  <Image src={picture.source}/>
                </div>
                )
              }))}
            </Carousel>
          <Row justify="space-between">
            <Col>
              <Row>
                <h2>Platforms</h2>
              </Row>
              <Row>
              {game.platforms.map((platform => {
              return(
                <div>
                  <Link to={`/platform/${platform.id}`}>
                    <Tag>
                      {platform.name}
                    </Tag>
                  </Link>
                </div>
                )
              }))}
              </Row>
            </Col>
            <Col>
              <Row>
                <h2>Genres</h2>
              </Row>
              <Row>
              {game.genres.map((genre => {
              return(
                <div>
                  <Link to={`/genre/${genre.id}`}>
                    <Tag>
                      {genre.name}
                    </Tag>
                  </Link>
                </div>
                )
              }))}
              </Row>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <h2>Reviews</h2>
            </Col>
          </Row>

            <Form
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 100 }}
              layout="horizontal"
            >
              <Form.Item label="Title">
                <Input />
              </Form.Item>
              <Form.Item label="Description">
                <TextArea rows={6} />
              </Form.Item>
              <Form.Item label="Rating">
                <InputNumber />
                <Button style={{float: "right"}}>Submit review</Button>
              </Form.Item>
              </Form>

          <Row>
             {/* TODO Your Review - idk what the getter is */}
          </Row>
            
            {game.reviews.map(((review, index) => {
              return(
                
                <Row style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}} justify="space-between" gutter={[24, 24]}> 

                  <Col>
                    <Row>
                      <p>{review.user.username}</p>
                    </Row>
                    <Row>
                      <div>
                        <Link to={`/user/${review.user.id}`}>
                          <Image width={100} src={review.user.profilePicture} />
                        </Link>
                      </div>
                    </Row>
                    <Row justify="center" gutter={[24, 24]}>
                      <Col>
                        <p>{review.rating}%</p>
                      </Col>
                    </Row>
                  </Col>
                  
                  <Col flex="1">
                    <Row>
                      <p>{review.header}</p>
                    </Row>
                    <Row>
                      <p>{review.description}</p>
                    </Row>
                  </Col>

                  
                  
                </Row>
                )
              }))}
        </Col>
        <Col span={5}>
          <Row>
            <div>
              <Image src={game.pictures[0].source}/>
            </div>
          </Row>
          <Row>
            <p>{game.description}</p>
          </Row>
          <Row justify="space-between">
            <Col>
              <h3>RELEASED</h3>
            </Col>
            <Col>
              <p>{formattedDate}</p>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <h3>DEVELOPER</h3>
            </Col>
            <Col>
              <Link to={`/developer/${game.developer.id}`}>
                <p>{game.developer.name}</p>
              </Link>
            </Col>
          </Row>
        </Col>
        </Row>
      </Content>
      <MainFooter/>
    </Layout>

    </>
  );
};

export default Game;


const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

