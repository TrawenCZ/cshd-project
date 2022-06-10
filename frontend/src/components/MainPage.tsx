import useSWR from 'swr';
import fetcher from '../models/fetcher';
import HeaderMenu from './Header'
//import { game } from '../models/types';

import { Layout, Card, Row, Col, Input } from 'antd'
import { Link } from 'react-router-dom';
import LayoutHeader from './Header';

const { Search } = Input;
const { Header, Footer, Sider, Content, } = Layout;

function MainPage() {
  const { data, error } = useSWR('http://localhost:4000/api/games', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const games: any = data.data;
  const rows = new Array(Math.ceil(games.length / 3))
  for (let i = 0; i < rows.length; i++) {
    rows[i] = new Array(3)
    for (let j = 0; j < 3; j++){
      if (i*3+j < games.length){
        rows[i][j] = games[i*3+j]
      }
    }
    
  }

  return (
    <>
    <Layout>
      <LayoutHeader />
      <Content>
        <Row gutter={[5, 5]} style={{ alignItems: "center" }}
            justify="center">
              {games.map((game: any) => (
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
                </Col>
              ))}
        </Row>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
    </>
  );
};

export default MainPage;