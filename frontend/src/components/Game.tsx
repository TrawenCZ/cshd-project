import {ImageProps} from './Image'
import {ReviewProps} from './Review'
import {PlatformProps} from './Platform'
import {GenreProps} from './Genre'
import {DeveloperProps} from './Developer'


import useSWR from 'swr';
import fetcher from '../models/fetcher';
import { useState } from 'react';
import { format } from "date-fns";

import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'react-router-dom';
import { Layout, Row, Col, Input, Carousel, Image, Tag, Button} from 'antd';
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
            <h1>{game.name}</h1>
            <h1>{game.rating}</h1>
          </Row>

          <Row justify="center">
            <Carousel>
            {game.pictures.map((picture => {
                return(
                <div>
                  <Image src={picture.source}/>
                </div>
                )
              }))}
            </Carousel>
          </Row>
          <Row justify="space-between">
            <Col>
              <Row>
                <h2>Platforms</h2>
              </Row>
              <Row>
              {game.platforms.map((platform => {
              return(
                <div>
                  <Tag>
                    {platform.name}
                  </Tag>
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
                  <Tag>
                    {genre.name}
                  </Tag>
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
            <Col>
              <Tag>Header</Tag>
            </Col>
          </Row>
          <Row>
            <Input.TextArea />
          </Row>
          <Row justify="space-between">
            <Col>
              <Tag>0-100</Tag>
            </Col>
            <Col>
              <Button type="primary">Add review</Button>
            </Col>
          </Row>
          <Row>
             {/* TODO Your Review - idk what the getter is */}
          </Row>
          <Row>
            {/* TODO Fix backend for this, then uncomment it*/}
            {/* {game.reviews.map((review => {
              return(
                <Row>
                  <Col>
                    <Row>
                      <p>{review.user.username}</p>
                    </Row>
                    <Row>
                      <div>
                        <Image src={review.user.profilePicture}/>
                      </div>
                    </Row>
                  </Col>
                  <Col>
                    <Row>
                      <p>{review.header}</p>
                    </Row>
                    <Row>
                      <p>{review.description}</p>
                    </Row>
                  </Col>
                  <Col>
                    <p>{review.rating}%</p>
                  </Col>
                </Row>
                )
              }))} */}
          </Row>
        </Col>
        <Col span={5}>
          <Row>
             {/* TODO Main Image- idk what the getter is */}
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
              <p>{game.developer.name}</p>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <h3>PUBLISHER</h3>
            </Col>
            <Col>
              {/* TODO publisher isn't in backend yet */}
            </Col>
          </Row>
        </Col>
        </Row>
      </Content>
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
