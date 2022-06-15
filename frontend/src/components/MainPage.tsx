import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Input, Button } from 'antd'
import { Link } from 'react-router-dom';
import LayoutHeader from './Header';
import './MainPage.css'
import {MainFooter} from "./MainFooter";

const { Search } = Input;
const { Header, Footer, Sider, Content, } = Layout;

function MainPage() {
  const [page, setPage] = useState(0);
  const [genres, setGenres] = useState(undefined);
  const [platforms, setPlatforms] = useState(undefined);
  const [releaseRange, setReleaseRange] = useState([1980, new Date().getFullYear()]);
  const [ratingRange, setRatingRange] = useState([0, 100]);
  const [games, setGames] = useState([]);
  const [nextEnabled, setNextEnabled] = useState(false)
  const [prevEnabled, setPrevEnabled] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const apiCalls = () => {
    let endpoint = (searchInput === '') ? `http://localhost:4000/api/games?page=` : `http://localhost:4000/api/search?page=`
    let body = (searchInput === '') ? {
      genres: genres,
      platforms: platforms,
      ratingRange: ratingRange,
      releaseRange: releaseRange
    } : {
      value: searchInput
    }

    axios.post(`${endpoint}${page}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...body
    }).then((response) => {
      console.log(response.data.data)
      setGames((searchInput === '') ? response.data.data : response.data.data.games)
    });
    if (page === 0){
      setPrevEnabled(false)
    }
    else if (page > 0){
      axios.post(`${endpoint}${page-1}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        ...body
      }).then((response) => {
        if ((searchInput === '') ? response.data.data.length : response.data.data.games.length > 0){
          setPrevEnabled(true)
        }
        else {
          setPrevEnabled(false)
        }

      });
    }
    axios.post(`${endpoint}${page+1}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...body
    }).then((response) => {
      if ((searchInput === '') ? response.data.data.length : response.data.data.games.length > 0){
        setNextEnabled(true);
      }
      else {
        setNextEnabled(false);
      }
    });
  }

  useEffect(() => {
    apiCalls();
  }, [genres, platforms, page, ratingRange, releaseRange, searchInput]);

  return (
    <>
    <Layout>
      <LayoutHeader setGenre={setGenres} setPlatforms={setPlatforms} setReleaseRange={setReleaseRange} setRatingRange={setRatingRange} setSearchInput={setSearchInput}/>
      <Content>
        <div className='pagination'>
          {games.length > 0 && <Button shape="circle" className='pageButton' icon={<LeftOutlined />} size="large" onClick={(event) => setPage(page-1)} disabled={!prevEnabled}/>}
          {games.length > 0 && <Button shape="circle" className='pageButton' icon={<RightOutlined />} size="large" onClick={(event) => setPage(page+1)} disabled={!nextEnabled}/>}
        </div>
        <Row gutter={[5, 5]} style={{ alignItems: "center" }}
            justify="center">
              {games.map((game: any) => {
                return (
                  <Col>
                    <Card
                      title={game.name}
                      bordered={true}
                      hoverable={true}
                      extra={<h1>{game.rating}</h1>}
                      style={{ width: 264 }}
                      cover={<Link to={`/game/${game.id}`}><img src={game.pictures[0].source} alt={game.pictures[0].alt}></img></Link>}
                    >

                    </Card>
                  </Col>)
              })}
        </Row>
        <div className='pagination'>
          {games.length > 0 && <Button shape="circle" className='pageButton' icon={<LeftOutlined />} size="large" onClick={(event) => setPage(page-1)} disabled={!prevEnabled}/>}
          {games.length > 0 && <Button shape="circle" className='pageButton' icon={<RightOutlined />} size="large" onClick={(event) => setPage(page+1)} disabled={!nextEnabled}/>}
        </div>
      </Content>
      <MainFooter/>
    </Layout>
    </>
  );
};

export default MainPage;
