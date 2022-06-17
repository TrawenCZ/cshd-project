import {ImageProps} from './Image'
import {ReviewProps} from './Review'
import {PlatformProps} from './Platform'
import {UserProps} from './User'
import {GenreProps} from './Genre'
import {DeveloperProps} from './Developer'
import MainFooter from "./MainFooter";

import { Link } from 'react-router-dom';
import useSWR, {useSWRConfig} from 'swr';
import axios from 'axios';
import fetcher from '../models/fetcher';
import { useState } from 'react';
import { format } from "date-fns";

import { useMediaQuery } from 'react-responsive';
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
import {
    DeleteOutlined,
    EditOutlined
  } from '@ant-design/icons';
import LayoutHeader from './Header';

const { Header, Footer, Sider, Content } = Layout;

enum ErrorRegister {
  FAILED_TO_SUBMIT,
  NO_ERROR,

}

interface FormValues{
  header:string,
  rating:number,
  description:string
}

interface RequestValues{
  header:string,
  rating:number,
  description:string,
  gameId:string
}

export interface GameProps{
  id:string,
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
  const [edit, setEdit] = useState<boolean>(false)
  const { id } = useParams()
  const [loggedId, setLoggedId] = useState(undefined)

  enum ErrorRegister {
    USERNAME_EXISTS,
    PASSWORDS_NOT_SAME,
    NO_ERROR,
  
  }
  const [errorPost, setErrorPost] = useState<ErrorRegister>(ErrorRegister.NO_ERROR);
  const [goHome, setToGoHome] = useState<boolean>(false);

  const { data, error } = useSWR(`http://localhost:4000/api/games/${id}`, fetcher);
  const { mutate } = useSWRConfig()
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const game: GameProps  = data.data;
  var date = new Date("2016-01-04 10:34:23");
  const formattedDate = formatDate(new Date(game.releaseDate));
  


  const headers = {
      "Content-Type": "application/json",
    };
    const user = axios.get('http://localhost:4000/api/loggedUser', {headers, withCredentials: true})
    user.then(response => {
      setLoggedId(response.data.data.userId)
    })
  const onFinish = async(values: FormValues) => {
    const requestData: RequestValues = {
      header: values.header,
      rating: values.rating,
      description: values.description,
      gameId: game.id
    }
    const req = await axios.post('http://localhost:4000/api/reviews', requestData, {headers, withCredentials: true})
    mutate(`http://localhost:4000/api/games/${id}`)
  };
  var reviewId = "";
  for (var review of game.reviews) {
    if (review.user.id == loggedId) {
      reviewId = review.id;
    }   
  }
  const deleteYourReview = async() => {
    await axios.delete(`http://localhost:4000/api/reviews/${reviewId}`, {headers, withCredentials: true});
    mutate(`http://localhost:4000/api/games/${id}`)
  }
  const onEdit = async (values: FormValues) => {
    const requestData: RequestValues = {
      header: values.header,
      rating: values.rating,
      description: values.description,
      gameId: game.id
    }

    setEdit(!edit)
    if(edit) {
      console.log("TEDKA")
      await axios.put(`http://localhost:4000/api/reviews/${reviewId}`, requestData , {headers, withCredentials: true})
    }

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  if (isMobile){
  return (
    <>
    <Layout>
    <LayoutHeader setGenres={setGenre}/>
      <Content>
        <Row justify="center" gutter={[24, 24]}>
        <Col  flex="1 0 100%">
          <Row justify="space-between">
            <h1 style={{color:"black", fontSize:"50px"}}>{game.name}</h1>
            <h1 style={{color:"black", fontSize:"50px"}}>{game.rating}%</h1>
          </Row>

            <Carousel autoplay>
            {game.pictures.map((picture => {
                if (!picture.isMain) {
                return(
                <div>
                  <Image src={picture.source}/>
                </div>
                )                     
                }
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
            

          {loggedId && reviewId == "" &&
              <Form
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 100 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="Title" name="header" rules={[{ required: true, message: 'Please enter the title of your review!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <TextArea rows={6} />
              </Form.Item>
              <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Please enter the rating you want to give this game!' }]}>
                <InputNumber min={0} max={100} />
              </Form.Item>
              <Form.Item>
                <Button style={{float: "right"}} htmlType="submit">Submit review</Button>
              </Form.Item>
              </Form>}



             {/* TODO Your Review - idk what the getter is */}
             {game.reviews.map(((review, index) => {
              if (loggedId == review.user.id){
              return(

                <Form onFinish={onEdit}>
                <Row style = {{backgroundColor:"#d9d9d9"}} justify="space-between" gutter={[24, 24]}>
                  
                  <Col span = "2">
                    <Row>
                      <h2>{review.user.username}</h2>
                    </Row>
                    <Row>
                      <div>
                        <Link to={`/user/${review.user.id}`}>
                          <Image width={100} preview={false} src={review.user.profilePicture} />
                        </Link>
                      </div>
                    </Row>
                    <Row  gutter={[24, 24]} justify="center">
                      <Col>

                        <Form.Item name="rating" initialValue={review.rating} rules={[{ required: true, message: 'Please enter the rating you want to give this game!' }]}>
                          <InputNumber min={0} max={100} disabled={!edit}/>
                        </Form.Item>
                        
                      </Col>
                    </Row>
                  </Col>

                  <Col flex="0.7">
                  <Form.Item name="header" initialValue={review.header} rules={[{ required: true, message: 'Please enter the title of your review!' }]}>
                    <Input disabled={!edit} />
                  </Form.Item>
                  <Form.Item initialValue={review.description} name="description">
                    <TextArea disabled={!edit} rows={6} />
                  </Form.Item>
                  </Col>
                  <Col>
                    <Row>
                      <Button htmlType="submit" type="primary" ><EditOutlined /></Button>
                    </Row>
                    <Row>
                      <Button onClick={() => deleteYourReview()} type="primary"><DeleteOutlined /></Button>
                    </Row>
                  </Col>
                </Row>
                </Form>

                
                )
              }
              }))}
              <hr/>

            



            {game.reviews.map(((review, index) => {
              if (loggedId != review.user.id){
              return(

                
                <Row style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}} justify="space-between" gutter={[24, 24]}>

                  <Col>
                    <Row>
                      <h2>{review.user.username}</h2>
                    </Row>
                    <Row>
                      <div>
                        <Link to={`/user/${review.user.id}`}>
                          <Image width={100} preview={false} src={review.user.profilePicture} />
                        </Link>
                      </div>
                    </Row>
                    <Row justify="center" gutter={[24, 24]}>
                      <Col>
                        <h1>{review.rating}%</h1>
                      </Col>
                    </Row>
                  </Col>

                  <Col flex="1">
                    <Row>
                      <h2>{review.header}</h2>
                    </Row>
                    <Row>
                      <p>{review.description}</p>
                    </Row>
                  </Col>
                </Row>
                
                )
              }
              }))}
        </Col>
        <Col flex="1 0 100%">
          <Row justify="center">
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
  }
  else {
    return (
      <>
      <Layout>
      <LayoutHeader setGenres={setGenre}/>
        <Content>
          <Row justify="center" gutter={[24, 24]}>
          <Col span={11}>
            <Row justify="space-between">
              <h1 style={{color:"black", fontSize:"50px"}}>{game.name}</h1>
              <h1 style={{color:"black", fontSize:"50px"}}>{game.rating}%</h1>
            </Row>
  
              <Carousel autoplay>
              {game.pictures.map((picture => {
                  if (!picture.isMain) {
                  return(
                  <div>
                    <Image src={picture.source}/>
                  </div>
                  )                     
                  }
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
              
  
            {loggedId && reviewId == "" &&
                <Form
                name="basic"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 100 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item label="Title" name="header" rules={[{ required: true, message: 'Please enter the title of your review!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <TextArea rows={6} />
                </Form.Item>
                <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Please enter the rating you want to give this game!' }]}>
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item>
                  <Button style={{float: "right"}} htmlType="submit">Submit review</Button>
                </Form.Item>
                </Form>}
  
  
  
               {/* TODO Your Review - idk what the getter is */}
               {game.reviews.map(((review, index) => {
                if (loggedId == review.user.id){
                return(
  
                  <Form onFinish={onEdit}>
                  <Row style = {{backgroundColor:"#d9d9d9"}} justify="space-between" gutter={[24, 24]}>
                    
                    <Col span = "2">
                      <Row>
                        <h2>{review.user.username}</h2>
                      </Row>
                      <Row>
                        <div>
                          <Link to={`/user/${review.user.id}`}>
                            <Image width={100} preview={false} src={review.user.profilePicture} />
                          </Link>
                        </div>
                      </Row>
                      <Row  gutter={[24, 24]} justify="center">
                        <Col>
  
                          <Form.Item name="rating" initialValue={review.rating} rules={[{ required: true, message: 'Please enter the rating you want to give this game!' }]}>
                            <InputNumber min={0} max={100} disabled={!edit}/>
                          </Form.Item>
                          
                        </Col>
                      </Row>
                    </Col>
  
                    <Col flex="0.7">
                    <Form.Item name="header" initialValue={review.header} rules={[{ required: true, message: 'Please enter the title of your review!' }]}>
                      <Input disabled={!edit} />
                    </Form.Item>
                    <Form.Item initialValue={review.description} name="description">
                      <TextArea disabled={!edit} rows={6} />
                    </Form.Item>
                    </Col>
                    <Col>
                      <Row>
                        <Button htmlType="submit" type="primary" ><EditOutlined /></Button>
                      </Row>
                      <Row>
                        <Button onClick={() => deleteYourReview()} type="primary"><DeleteOutlined /></Button>
                      </Row>
                    </Col>
                  </Row>
                  </Form>
  
                  
                  )
                }
                }))}
                <hr/>
  
              
  
  
  
              {game.reviews.map(((review, index) => {
                if (loggedId != review.user.id){
                return(
  
                  
                  <Row style = {(index % 2 === 0) ? {backgroundColor:"#f5f5f5"} : {backgroundColor:"#d9d9d9"}} justify="space-between" gutter={[24, 24]}>
  
                    <Col>
                      <Row>
                        <h2>{review.user.username}</h2>
                      </Row>
                      <Row>
                        <div>
                          <Link to={`/user/${review.user.id}`}>
                            <Image width={100} preview={false} src={review.user.profilePicture} />
                          </Link>
                        </div>
                      </Row>
                      <Row justify="center" gutter={[24, 24]}>
                        <Col>
                          <h1>{review.rating}%</h1>
                        </Col>
                      </Row>
                    </Col>
  
                    <Col flex="1">
                      <Row>
                        <h2>{review.header}</h2>
                      </Row>
                      <Row>
                        <p>{review.description}</p>
                      </Row>
                    </Col>
                  </Row>
                  
                  )
                }
                }))}
          </Col>
          <Col span={5}>
            <Row justify="center">
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
    }
};

export default Game;


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatDate = (date: Date) => {
  return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
}


const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

