import useSWR from 'swr';
import fetcher from '../models/fetcher';
import axios from "axios";
import { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Input } from 'antd'
import { Link } from 'react-router-dom';
import LayoutHeader from './Header';
import './MainPage.css'

const { Search } = Input;
const { Header, Footer, Sider, Content, } = Layout;

function MainPage() {
  const [page, setPage] = useState(0);
  const [genres, setGenres] = useState(undefined);
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.post(`http://localhost:4000/api/games?page=${page}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      genres: genres,
    }).then((response) => {
      setGames(response.data.data)
      console.log(games)
    });
  }, [genres]);

  return (
    <>
    <Layout>
      <LayoutHeader setGenre={setGenres}/>
      <Content>
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
      </Content>
      <Footer>Footer</Footer>
    </Layout>
    </>
  );
};

export default MainPage;