import useSWR from 'swr';
import fetcher from '../models/fetcher';
import HeaderMenu from './HeaderMenu'
//import { game } from '../models/types';

import { Layout, Card, Row, Col } from 'antd'
import { Children } from 'react';
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
      <Header>
        <HeaderMenu />
      </Header>
      <Content>
        {rows.map((row: any) => (
          <Row gutter={[0, 0]} style={{ alignItems: "center" }}
          justify="center">
            {row.map((game: any) => (
              <Col>
                <Card 
                  title={game.name}
                  bordered={false}
                  style={{ width: 300 }}
                  cover={<img src={game.pictures[0].source} alt={game.pictures[0].alt}></img>}
                >
                  
                </Card>
              </Col>
            ))}
          </Row>
        ))}
      </Content>
      <Footer>Footer</Footer>
    </Layout>
    </>
  );
};

export default MainPage;