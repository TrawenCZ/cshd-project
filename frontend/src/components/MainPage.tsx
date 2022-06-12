import useSWR from 'swr';
import fetcher from '../models/fetcher';
import { useState } from 'react';
import { Layout, Card, Row, Col, Input } from 'antd'
import { Link } from 'react-router-dom';
import LayoutHeader from './Header';
import './MainPage.css'

const { Search } = Input;
const { Header, Footer, Sider, Content, } = Layout;

function MainPage() {
  const [page, setPage] = useState(0);
  const [genreId, setGenre] = useState('0');

  const { data: gamesData, error: gamesError } = useSWR(`http://localhost:4000/api/games?page=${page}&genre=${genreId}`, fetcher);
  const { data: genresData, error: genresError } = useSWR('http://localhost:4000/api/genres', fetcher);


  if (gamesError || genresError) return <div>failed to load</div>;
  if (!gamesData || !genresData) return <div>loading...</div>;

  const games: any = gamesData.data;
  const rows = new Array(Math.ceil(games.length / 3))

  return (
    <>
    <Layout>
      <LayoutHeader setGenre={setGenre}/>
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